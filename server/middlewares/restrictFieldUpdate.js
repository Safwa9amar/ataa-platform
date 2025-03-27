function restrictFieldUpdate(req, res, next) {
  const { trialEndDate } = req.body;

  if (trialEndDate) {
    return res
      .status(403)
      .json({ message: "Modification of trialEndDate is not allowed." });
  }

  next();
}

module.exports = restrictFieldUpdate;
