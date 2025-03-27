const suppliersServices = require("../../../services/dashboardsServices/suppliers/index");
const kpis = async (req, res) => {
  const userId = req.user.id;
  try {
    const data = await suppliersServices.inventoryManagement.getKpis(userId);
    res.json(data);
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: "Error getting kpis" });
  }
};

const inventoryByProduct = async (req, res) => {
  const userId = req.user.id;
  try {
    const data =
      await suppliersServices.inventoryManagement.getInventoryByProduct(userId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error getting kpis" });
  }
};

const inventoryByCategory = async (req, res) => {
  const userId = req.user.id;

  try {
    const data =
      await suppliersServices.inventoryManagement.inventoryByCategory(userId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error getting kpis" });
  }
};

const inventoryDepletion = async (req, res) => {
  const userId = req.user.id;

  try {
    const data = await suppliersServices.inventoryManagement.inventoryDepletion(
      userId
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error getting kpis" });
  }
};

module.exports = {
  kpis,
  inventoryByProduct,
  inventoryByCategory,
  inventoryDepletion,
};
