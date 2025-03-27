const prisma = require("../models/index");
const stripeClient = require("stripe")(process.env.STRIPE_API_KEY);

async function chargily(client, field, amount) {
  return await client.createCheckout({
    amount: amount,
    currency: "dzd",
    success_url: `${process.env.WEBSITE_URL}/fast-donation-success/?gateway=chargily/`,
    failure_url: `${process.env.WEBSITE_URL}/fast-donation-fail/?gateway=chargily`,
    description:
      "التبرع السريع لمنصة عطاء من خلال بوابة الدفع الجزائرية شارجيلي",
    locale: "ar",
    metadata: {
      field: field,
    },
  });
}
async function baridimob(data) {
  // حفظ الصورة في قاعدة البيانات
  let img = await prisma.image.create({
    data: data.screenShoot, // تأكد من أن data.screenShoot هو حقل مقبول
  });

  // استرجاع الحالة الأكثر احتياجًا
  let dop = await getMostNeededDonationOpportunity(data.field);
  if (!dop) {
    throw new Error("لم يتم العثور على أي فرصة تبرع محتاحة حاليا");
  }
  if (dop.progress.requiredAmount === dop.progress.totalAmount) {
    throw new Error("الفرصة مكتملة");
  }
  console.log("Most Needed Donation ID:", dop.id);

  // إنشاء التبرع السريع
  let donation = await prisma.donation.create({
    data: {
      paymentMethod: data.paymentMethode,
      donationType: "fastDonation",
      amount: data.amount,
      donationOpportunity: {
        connect: { id: dop.id },
      },
      screenShoot: {
        connect: { id: img.id },
      },
    },
    include: {
      donationOpportunity: true,
    },
  });

  let newTotalAmount = dop.progress.totalAmount + donation.amount;
  let newProgressRate = (newTotalAmount / dop.progress.requiredAmount) * 100;

  // تحديث بيانات فرصة التبرع
  await prisma.donationOpportunity.update({
    where: { id: dop.id },
    data: {
      lastDonation: new Date(),
      donationCount: { increment: 1 },
      endAt: newProgressRate >= 100 ? new Date() : null,
      progress: {
        update: {
          totalAmount: { increment: data.amount },
          rate: { set: newProgressRate > 100 ? 100 : newProgressRate },
        },
      },
    },
  });

  return donation;
}

const stripe = async (field, amount) => {
  try {
    // Validate input parameters
    if (!field || typeof field !== "string") {
      throw new Error("Invalid or missing 'field' parameter.");
    }

    if (!amount || typeof amount !== "string" || amount <= 0) {
      throw new Error("Invalid or missing 'amount' parameter.");
    }

    console.log("Initializing Stripe payment...");

    // Convert amount to the smallest currency unit (e.g., cents)
    const amountInCents = Number(amount) * 100;

    // Create a Stripe checkout session
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"], // Specify allowed payment methods
      line_items: [
        {
          price_data: {
            currency: "dzd", // Use the appropriate currency
            product_data: {
              name: `Donation for ${field}`, // Descriptive product name
            },
            unit_amount: amountInCents, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment", // Use payment mode
      success_url: `${process.env.WEBSITE_URL}/fast-donation-success/?gateway=stripe`,
      cancel_url: `${process.env.WEBSITE_URL}/fast-donation-fail/?gateway=stripe`,
      metadata: {
        field,
      },
    });

    console.log("Stripe session created:", session.id);

    return session;
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error.message);
    throw new Error(
      "Failed to initialize Stripe payment. Please try again later."
    );
  }
};
async function getMostNeededDonationOpportunity(fieldId) {
  try {
    const opportunity = await prisma.donationOpportunity.findFirst({
      where: {
        field: {
          id: fieldId,
        },
        status: "ACTIVE", // فقط الفرص النشطة
        progress: {
          rate: {
            lt: 100,
          },
        },
      },
      orderBy: [
        {
          progress: {
            requiredAmount: "desc", // الأولوية للحالات التي تحتاج أكبر مبلغ
          },
        },
        {
          progress: {
            totalAmount: "asc", // الأولوية للحالات التي جمعت أقل مبلغ
          },
        },
      ],
      include: {
        progress: true,
      },
    });

    return opportunity;
  } catch (error) {
    console.error("Error fetching most needed donation opportunity:", error);
    throw new Error("Failed to fetch donation opportunity");
  }
}
module.exports = {
  chargily,
  stripe,
  baridimob,
};
