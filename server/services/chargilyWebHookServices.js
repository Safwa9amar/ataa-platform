const prisma = require("../models/index");
async function chargilyWebHookServices(event, client) {
  try {
    const { id, type, data } = event;

    if (type !== "checkout.paid") {
      console.log("Event type is not 'checkout.paid'. Ignored.");
      return null;
    }

    const { customer_id, amount, payment_method } = data;

    // Fetch customer details from the client
    const customer = await client.getCustomer(customer_id);
    if (!customer) {
      console.error(`Customer with ID ${customer_id} not found.`);
      return null;
    }

    // Find the user by email or phone
    const user = await prisma.users.findFirst({
      where: {
        OR: [{ email: customer.email }, { phone: customer.phone }],
      },
    });
    if (!user) {
      console.error(
        `User not found for email: ${customer.email} or phone: ${customer.phone}.`
      );
      return null;
    }

    // Find the corresponding plan by price
    const plan = await prisma.plan.findFirst({
      where: { price: amount },
    });
    if (!plan) {
      console.error(`Plan not found for the price: ${amount}.`);
      return null;
    }

    // Check for an active subscription
    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        endDate: {
          gt: new Date(), // Check if the endDate is in the future
        },
      },
      include: { plan: true },
    });

    if (activeSubscription) {
      // نفس الخطة
      if (activeSubscription.plan.id === plan.id) {
        const newEndDate = new Date(activeSubscription.endDate);
        newEndDate.setFullYear(newEndDate.getFullYear() + 1);

        const updatedSubscription = await prisma.subscription.update({
          where: { id: activeSubscription.id },
          data: {
            endDate: newEndDate,
            paymentMethod: "CHARGILY",
            totalPrice: activeSubscription.totalPrice + amount,
            isEdited: true,
            isRecurring: true,
          },
        });

        console.log(
          `Subscription ${activeSubscription.id} extended successfully:`,
          updatedSubscription
        );
        return updatedSubscription;
      } else {
        // خطة مختلفة
        const currentDate = new Date();
        const remainingDays =
          (new Date(activeSubscription.endDate) - currentDate) /
          (1000 * 60 * 60 * 24); // الأيام المتبقية
        const totalDays = 365; // Assuming yearly subscription
        const remainingValue =
          (remainingDays / totalDays) * activeSubscription.price;

        // خصم القيمة المتبقية من سعر الخطة الجديدة
        const adjustedPrice = amount - remainingValue;

        // تحديث الاشتراك الحالي إلى "PENDING"
        // تحديث الاشتراك النشط إلى "PENDING"
        if (activeSubscription.plan.id !== plan.id) {
          // تحديث الاشتراك النشط إلى "PENDING"
          const pendingSubscription = await prisma.subscription.update({
            where: { id: activeSubscription.id },
            data: {
              status: "PENDING", // تحديث حالة الاشتراك إلى "PENDING"
            },
          });
          console.log(
            `Active subscription ${activeSubscription.id} marked as pending:`,
            pendingSubscription
          );
        }

        // إنشاء اشتراك جديد بالخطة الجديدة
        const newEndDate = new Date();
        newEndDate.setFullYear(newEndDate.getFullYear() + 1);

        const newSubscription = await prisma.subscription.create({
          data: {
            user: { connect: { id: user.id } },
            plan: { connect: { id: plan.id } },
            price: adjustedPrice,
            paymentMethod: "CHARGILY",
            endDate: newEndDate,
            totalPrice: adjustedPrice,
            status: "ACTIVE",
          },
        });

        console.log(
          `New subscription created successfully with adjusted price:`,
          newSubscription
        );
        return newSubscription;
      }
    }

    // في حالة عدم وجود اشتراك نشط
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);

    const newSubscription = await prisma.subscription.create({
      data: {
        user: { connect: { id: user.id } },
        plan: { connect: { id: plan.id } },
        price: amount,
        paymentMethod: "CHARGILY",
        endDate: endDate,
        totalPrice: amount,
        status: "ACTIVE",
      },
    });

    console.log("New subscription created successfully:", newSubscription);
    return newSubscription;
  } catch (error) {
    console.error("Error processing Chargily webhook:", error);
    throw error;
  }
}

module.exports = { chargilyWebHookServices };
