// appointmentsService.js
const prisma = require("../models");
const { CAMTYPE } = require("@prisma/client");
const dayjs = require("dayjs");
// Get all appointments
const getAllAppointments = async () => {
  return await prisma.appointments.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      campaign: true,
    },
  });
};

// Get an appointment by ID
const getAppointmentById = async (id) => {
  return await prisma.appointments.findUnique({
    where: { id: id },
    orderBy: { crea: "desc" },
    include: { campaign: true },
  });
};
// Get an appointment by user ID
const getAppointmentByUserId = async (id) => {
  return await prisma.appointments.findMany({
    orderBy: { createdAt: "desc" },
    where: { userId: id },
    include: { campaign: true, nationalCampaign: true },
  });
};
// Get an appointments by campaign ID
const getAppointmentsByCampaignId = async (id) => {
  return await prisma.appointments.findMany({
    orderBy: { createdAt: "desc" },
    where: { campaignId: id },
  });
};

//  Get national campaign appointments
const getNationalCampaignAppointments = async (id) => {
  return await prisma.appointments.findMany({
    orderBy: { createdAt: "desc" },
    where: { nationalCampaignId: id },
  });
};
// Create a new appointment
const createAppointment = async (data, userId) => {
  const { type, campaignId } = data;
  const isCampaign = type === CAMTYPE.USERCAMPAIGN;
  const isNationalCampaign = type === CAMTYPE.NATIONALCAMPAIGN;

  // تنفيذ استعلامات البحث بالتوازي لتحسين الأداء
  const [campaign, user] = await Promise.all([
    prisma.campaign.findUniqueOrThrow({ where: { id: campaignId } }),
    prisma.users.findUniqueOrThrow({ where: { id: userId } }),
  ]);

  // التحقق مما إذا كان المستخدم قد حجز موعدًا سابقًا لهذه الحملة ولم يكمله بعد
  const existingAppointment = await prisma.appointments.findFirst({
    orderBy: { createdAt: "desc" }, // نحصل على أحدث موعد قام المستخدم بحجزه
    where: {
      userId,
      OR: [
        { campaignId: isCampaign ? campaignId : undefined },
        { nationalCampaignId: isNationalCampaign ? campaignId : undefined },
      ],
    },
    include: {
      campaign: { include: { progress: true } },
      nationalCampaign: true,
    },
  });

  // منع المستخدم من حجز أكثر من موعد لنفس الحملة إذا لم يُكمل الحجز الأول
  if (existingAppointment && !existingAppointment.isDone) {
    throw new Error("لقد قمت بحجز موعد مسبقًا لهذه الحملة، يرجى إكماله أولًا.");
  }

  // التحقق مما إذا كانت الحملة قد اكتملت بالفعل (نسبة التقدم 100%)
  if (existingAppointment?.campaign?.progress?.rate === 100) {
    throw new Error("هذه الحملة مكتملة بالفعل، نشكرك على مشاركتك.");
  }

  // تحضير بيانات الحجز وربطها بالحملة والمستخدم المعني
  const appointmentData = {
    ...data,
    user: { connect: { id: userId } },
    ...(isCampaign && { campaign: { connect: { id: campaignId } } }),
    ...(isNationalCampaign && {
      nationalCampaign: { connect: { id: campaignId } },
    }),
  };

  // إزالة القيم غير الضرورية من البيانات لمنع أي تعارض مع Prisma
  delete appointmentData.campaignId;
  delete appointmentData.userId;

  // إنشاء موعد جديد في قاعدة البيانات
  const appointment = await prisma.appointments.create({
    data: appointmentData,
  });

  // تكوين بيانات الإشعار للمستخدم الذي أنشأ الحملة
  const notificationTitle = `لديك حجز موعد جديد في حملتك التبرعية\n${campaign.title}`;
  const notificationBody =
    "شكراً لمساهمتك! يمكنك الآن التحقق من تفاصيل الحجز الخاص بك.";
  const campaignUrl = `${process.env.WEBSITE_URL}${
    isCampaign
      ? `/our-programmes/campaign/user-blood?id=${campaign.id}&title=${campaign.title}`
      : "/our-programmes/blood-donation/national-campaigns"
  }`;

  // إرسال إشعار إلى منشئ الحملة لإعلامه بالحجز الجديد
  const notification = await prisma.notification.create({
    data: {
      title: notificationTitle,
      screen: "ProgramsScreen",
      metadata: JSON.stringify({
        screen: "appointment-list",
        params: { id: campaign.id },
      }),
      link: campaignUrl,
      body: notificationBody,
      userId: campaign.createdByuserId,
    },
  });

  return { appointment, notification };
};

// Update an appointment
const setAppointmentDate = async (id, data) => {
  let updatedAppointment = await prisma.appointments.update({
    where: { id: id },
    include: {
      campaign: true,
      user: true,
    },
    data,
  });

  let notification = await prisma.notification.create({
    data: {
      title: updatedAppointment.campaign.title,
      screen: "ProgramsScreen",
      metadata: JSON.stringify({
        screen: "my-appointments",
      }),
      link:
        process.env.WEBSITE_URL +
        "/our-programmes/blood-donation/my-appointments",
      body: `تم تحديد موعد تبرعك لحمة التبرع بالدم يوم ${dayjs(
        updatedAppointment.date
      ).format("YYYY:MMM:DD")}`,
      userId: updatedAppointment?.userId,
    },
  });

  return { updatedAppointment, notification };
};
const setAppointmentIsDone = async (id) => {
  let updatedAppointment = await prisma.appointments.update({
    where: { id: id },
    data: {
      isDone: true,
    },
  });

  let updatedCamaign = await prisma.campaign.update({
    where: { id: updatedAppointment.campaignId },
    data: {
      lastDonation: new Date(),
      donatedUnits: {
        increment: 1,
      },
      donationCount: {
        increment: 1,
      },
    },
  });

  return await prisma.progress.update({
    where: { campaignId: updatedAppointment.campaignId },
    data: {
      rate: (updatedCamaign.donatedUnits / updatedCamaign.numberOfUnits) * 100,
    },
  });
};

// Delete an appointment
const deleteAppointment = async (id) => {
  return await prisma.appointments.delete({
    where: { id: id },
  });
};

module.exports = {
  setAppointmentIsDone,
  getAllAppointments,
  getAppointmentById,
  getAppointmentByUserId,
  getAppointmentsByCampaignId,
  getNationalCampaignAppointments,
  createAppointment,
  setAppointmentDate,
  deleteAppointment,
};
