// Import routes
const fcmRouter = require("../modules/FCMTokens/routes");
// User and Authentication Related Routes
const authRoutes = require("./routes/Authentication/index");
const usersRoutes = require("./routes/users/index");
const userRouter = require("./userRouter");
const rechargeRouter = require("./rechargeRouter");
const convertAmbassadorPointsToBalanceRouter = require("../modules/donor/convertAmbassadorPointsToBalance");
// Donation and Charity Related Routes
const donationOpportunityRouter = require("./donationOpportunityRouter");
const charityAssociationRoutes = require("./charityAssociationRoutes");
const campaignRouter = require("./campaignRouter");
const progressRouter = require("./progressRouter");
const likesRouter = require("./likesRouter");
const commentRoutes = require("./commentRoutes");
const donationRouter = require("../modules/donation/donationRouter");

// Information and Content Related Routes
const infoSectionsCardRouter = require("./infoSectionsCardRouter");
const infoSectionRouter = require("./infoSectionRouter");
const categoryRouter = require("./categoryRouter");
const fieldRouter = require("./fieldRouter");

// Location and Cities Related Routes
const algeriaCitiesRouter = require("./algeriaCitiesRouter");

// share routes
const shareRoute = require("../modules/sharing/shareRoutes");
const CharitySharesRoute = require("../modules/charities/shares/routes");

// File and Image Handling Routes
const fileUploadRouter = require("./filesUploadRouter");
const fileRouter = require("./fileRouter");
const imageRouter = require("./imageRouter");

// Miscellaneous Routes
const appGuidRouter = require("./appGuidRouter");
const errorLogsRouter = require("./errorLogRouter");
const logErroRouter = require("./routes/logError");

// Store and Pricing Related Routes
const storeRouter = require("./storeRouter");
const silverPrice = require("./routes/preciousMetals");

//
const givingPartnersRouter = require("./givingPartnersRoutes");
const supervisoryAuthoritiesRouter = require("./supervisoryAuthoritiesRoutes");
// rapports routes
const repportsRouters = require("./repportsRouters");
// appointments
const appointmentsRouter = require("./appointmentsRouter");
// zakat
const zakatRouter = require("./zakatRouter");

// chariies
const charityRoutes = require("../modules/charities/charityRoutes");

// partner routter
const partnerRoutes = require("./partnerRouter");
//  bloodAgencyRoutes
const bloodAgencyRoutes = require("./bloodAgencyRoutes");
// get logged in edvices
const loggedInDevices = require("./loggedDeviceRouter");
// get statisticsRoutes
const statisticsRoutes = require("./statisticsRoutes");
// Aggregate and export all routes

//paymentRoutes
const paymentRoutes = require("./paymentRoutes");

// nationalCampaignRoutes
const nationalCampaignRoutes = require("./nationalCampaignRoutes");

// notificationRoutes
const notificationRoutes = require("./notificationRoutes");
// plansRoutes
const plansRoutes = require("./planRoutes");

// enums
const enumRouter = require("./enumRouter");

// chargily web hook
const chargilyWebHookrouter = require("./chargilyWebHookRouter");

//testimonialRouter
const testimonialRouter = require("./testimonialRouter");

//HomeCarouselRouter
const HomeCarouselRouter = require("./HomeCarouselRouter");

//fastDonationRouter
const fastDonationRouter = require("./fastDonationRouter");

//dashboardRoutes
const dashboardRoutes = require("./dashboardRoutes/index");

//incomesRoutes
const incomesRoutes = require("./incomesRoutes");

//invoiceRouter
const invoiceRouter = require("./invoiceRouter");

//expensesRouter
const expensesRouter = require("./expensesRouter");

const routers = [
  fcmRouter,
  //fastDonationRouter
  fastDonationRouter,
  // User and Authentication
  userRouter,
  authRoutes,
  usersRoutes,
  rechargeRouter,
  // convertAmbassadorPointsToBalanceRouter
  convertAmbassadorPointsToBalanceRouter,

  // Donation and Charity
  donationOpportunityRouter,
  charityAssociationRoutes,
  campaignRouter,
  appointmentsRouter,
  progressRouter,
  likesRouter,
  commentRoutes,
  donationRouter,

  // Information and Content
  infoSectionsCardRouter,
  infoSectionRouter,
  categoryRouter,
  fieldRouter,

  // Location and Cities
  algeriaCitiesRouter,

  //shareRoute
  shareRoute,

  // File and Image Handling
  fileUploadRouter,
  fileRouter,
  imageRouter,

  // Miscellaneous
  appGuidRouter,
  errorLogsRouter,
  logErroRouter,

  // Store and Pricing
  storeRouter,
  silverPrice,

  //
  givingPartnersRouter,
  supervisoryAuthoritiesRouter,

  // rapports
  repportsRouters,

  // zakat
  zakatRouter,

  //
  charityRoutes,

  //
  partnerRoutes,
  //
  bloodAgencyRoutes,

  //loggedInDevices
  loggedInDevices,
  //statisticsRoutes
  statisticsRoutes,

  //paymentRoutes
  paymentRoutes,

  //nationalCampaignRoutes
  nationalCampaignRoutes,

  //notificationRoutes
  notificationRoutes,

  // plans routes
  plansRoutes,

  // enums
  enumRouter,

  //chargilyWebHookrouter
  chargilyWebHookrouter,

  // testimonialRouter
  testimonialRouter,
  // HomeCarouselRouter
  HomeCarouselRouter,

  //incomesRoutes
  incomesRoutes,
  //invoiceRouter
  invoiceRouter,
  //expensesRouter
  expensesRouter,
  //dashboardRoutes
  dashboardRoutes,
  CharitySharesRoute,
];

module.exports = routers;
