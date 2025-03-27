const express = require("express");
const router = express.Router();
const supervisoryAuthoritiesController = require("../controllers/supervisoryAuthoritiesController");

router.get(
  "/supervisoryAuthorities",
  supervisoryAuthoritiesController.getAllSupervisoryAuthorities
);
router.get(
  "/supervisoryAuthorities/:id",
  supervisoryAuthoritiesController.getSupervisoryAuthorityById
);
router.post(
  "/supervisoryAuthorities/",
  supervisoryAuthoritiesController.createSupervisoryAuthority
);
router.put(
  "/supervisoryAuthorities/:id",
  supervisoryAuthoritiesController.updateSupervisoryAuthority
);
router.delete(
  "/supervisoryAuthorities/:id",
  supervisoryAuthoritiesController.deleteSupervisoryAuthority
);

module.exports = router;
