// config.js

// Base URL for the API. The server URL can be set via environment variable `SERVER_URL`.
// const BASE_URL = "https://api.ataa-platform.com/api/";
const BASE_URL = "http://localhost:5500" || process.env.SERVER_URL;


// API_ENDPOINTS is an object that defines all the API endpoints used in the application.
const API_ENDPOINTS = {
  // Base URL and status check endpoint
  BASE_URL: BASE_URL, // The base URL for all API requests
  CHECK_SERVER_STATUS: `${BASE_URL}/status`, // Endpoint to check server status
  GET_STATISTICS: `${BASE_URL}/statistics`, // Endpoint to check server status
  GET_ENUMS: `${BASE_URL}/enums`, // Endpoint to check server status
  TESTIMONIALS: `${BASE_URL}/testimonials`,
  HOME_CAROUSEL_DATA: `${BASE_URL}/home-carousel`,

  // Endpoints for handling file uploads and assets
  UPLOADS: `${BASE_URL}/uploads`, // Endpoint for uploading files
  SERVER_ASSESTS: `${BASE_URL}/assets`, // Endpoint for accessing server assets

  // Endpoints related to file operations
  DASHBOARDS: {
    accountHealth: `${BASE_URL}/dashboards/charity/account-health`,
    programsPerformance: `${BASE_URL}/dashboards/charity/programs-performance`,
    executiveSummary: `${BASE_URL}/dashboards/charity/executive-summary`,
    financial: `${BASE_URL}/dashboards/charity/financial`,
    donor: `${BASE_URL}/dashboards/charity/donor`,
  },

  // Endpoints related to file operations
  FAST_DONATION: {
    CHARGILY: `${BASE_URL}/fast-donation/chargily`, // Endpoint to upload a file
    STRIPE: `${BASE_URL}/fast-donation/stripe`, // Endpoint to delete a file
    CCP: `${BASE_URL}/fast-donation/ccp`, // Endpoint to delete a file
    BARIDI_MOB: `${BASE_URL}/fast-donation/baridimob`, // Endpoint to delete a file
  },
  // Endpoints related to file operations
  FILES: {
    FILE_UPLOAD: `${BASE_URL}/file/upload`, // Endpoint to upload a file
    DELETE_FILE: `${BASE_URL}/file/delete`, // Endpoint to delete a file
  },

  // Endpoints related to store operations (products and categories)
  STORE: {
    // Product-related endpoints
    GET_ALL_PRODUCTS: `${BASE_URL}/store/products`, // Get all products
    GET_PRODUCT_BY_ID: `${BASE_URL}/store/products`, // Get a product by ID (ID appended later)
    CREATE_PRODUCT: `${BASE_URL}/store/products`, // Create a new product
    UPDATE_PRODUCT: `${BASE_URL}/store/products`, // Update a product by ID (ID appended later)
    DELETE_PRODUCT: `${BASE_URL}/store/products`, // Delete a product by ID (ID appended later)

    // Search for products within a specific category by keywords
    SEARCH_PRODUCTS_IN_CATEGORY: `${BASE_URL}/store/products/search`, // Search products in a category by keywords

    // Category-related endpoints
    GET_ALL_CATEGORIES: `${BASE_URL}/store/categories`, // Get all categories
    GET_CATEGORY_BY_ID: `${BASE_URL}/store/categories`, // Get a category by ID (ID appended later)
    CREATE_CATEGORY: `${BASE_URL}/store/categories`, // Create a new category
    UPDATE_CATEGORY: `${BASE_URL}/store/categories`, // Update a category by ID (ID appended later)
    DELETE_CATEGORY: `${BASE_URL}/store/categories`, // Delete a category by ID (ID appended later)
  },

  // Endpoints related to likes
  LIKES: {
    ADD: `${BASE_URL}/likes`, // Add a like (POST /likes/:charityId)
    GET_BY_CHARITY: `${BASE_URL}/likes`, // Get likes by charity ID (GET /likes/:charityId)
    DELETE: `${BASE_URL}/likes`, // Delete a like by ID (DELETE /likes/:id)
  },

  // Endpoints related to comments
  COMMENTS: {
    GET_ALL_BY_CHARITY: `${BASE_URL}/comments/charity`, // Get all comments by charity ID (GET /comments/charity/:charityId)
    GET_BY_ID: `${BASE_URL}/comments`, // Get a comment by ID (ID appended later)
    CREATE: `${BASE_URL}/comments`, // Create a new comment
    UPDATE: `${BASE_URL}/comments`, // Update a comment by ID (ID appended later)
    DELETE: `${BASE_URL}/comments`, // Delete a comment by ID (ID appended later)
  },
  // In your API_ENDPOINTS configuration
  INCOME: {
    CREATE: `${BASE_URL}/incomes`,
    UPDATE: `${BASE_URL}/incomes`,
    DELETE: `${BASE_URL}/incomes`,
    GET_BY_ID: `${BASE_URL}/incomes`,
    GET_ALL: `${BASE_URL}/incomes`,
  },
  EXPENSE: {
    CREATE: `${BASE_URL}/expense`,
    UPDATE: `${BASE_URL}/expense`,
    DELETE: `${BASE_URL}/expense`,
    GET_BY_ID: `${BASE_URL}/expense`,
    GET_ALL: `${BASE_URL}/expense`,
  },
  INVOICE: {
    CREATE: `${BASE_URL}/invoice`,
    UPDATE: `${BASE_URL}/invoice`,
    DELETE: `${BASE_URL}/invoice`,
    GET_BY_ID: `${BASE_URL}/invoice`,
    GET_ALL: `${BASE_URL}/invoice`,
  },
  // Endpoints related to comments
  PLANS: {
    GET_ALL: `${BASE_URL}/plans`, // Get all plans by charity ID (GET /plans/charity/:planID)
    GET_BY_ID: `${BASE_URL}/plans`, // Get a plans by ID (ID appended later)
    CREATE: `${BASE_URL}/plans`, // Create a new plans
    UPDATE: `${BASE_URL}/plans`, // Update a plans by ID (ID appended later)
    DELETE: `${BASE_URL}/plans`, // Delete a plans by ID (ID appended later)
  },
  // Endpoints related to charity associations
  CHARITY_ASSOCIATIONS: {
    GET_ALL: `${BASE_URL}/charityAssociations`, // Get all charity associations
    GET_BY_ID: `${BASE_URL}/charityAssociations`, // Get a charity association by ID (ID appended later)
    CREATE: `${BASE_URL}/charityAssociations`, // Create a new charity association
    UPDATE: `${BASE_URL}/charityAssociations`, // Update a charity association by ID (ID appended later)
    DELETE: `${BASE_URL}/charityAssociations`, // Delete a charity association by ID (ID appended later)
  },

  // Endpoints related to images
  IMAGES: {
    GET_ALL: `${BASE_URL}/image`, // Get all images
    GET_BY_ID: `${BASE_URL}/image`, // Get an image by ID (ID appended later)
    CREATE: `${BASE_URL}/image`, // Create a new image entry
    UPDATE: `${BASE_URL}/image`, // Update an image entry by ID (ID appended later)
    DELETE: `${BASE_URL}/image`, // Delete an image entry by ID (ID appended later)
  },

  // Endpoints related to authentication and user management
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`, // User login
    SIGNUP: `${BASE_URL}/auth/signup`, // User signup
    CHECK_AUTH: `${BASE_URL}/check_auth`, // Check if the user is authenticated
    VERIFY_SIGNUP: `${BASE_URL}/auth/verify-sign-up`, // Verify user signup
    FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`, // Forgot password process
    RESET_PASSWORD: `${BASE_URL}/auth/reset-password`, // Reset password process
    GOOGLE_AUTH: `${BASE_URL}/auth/google`, // Google authentication
  },

  // Endpoints related to user management
  USERS: {
    GET_ALL: `${BASE_URL}/users`, // Get all users
    GET_BY_ID: `${BASE_URL}/users`, // Get a user by ID (ID appended later)
    CREATE: `${BASE_URL}/users`, // Create a new user
    UPDATE: `${BASE_URL}/users`, // Update a user by ID (ID appended later)
    DELETE: `${BASE_URL}/users`, // Delete a user by ID (ID appended later)
    GET_PROFILE: `${BASE_URL}/users/profile`, // Get user profile
    UPDATE_PROFILE: `${BASE_URL}/users`, // Update user profile
    UPDATE_PASSWORD: `${BASE_URL}/users/password`, // Update user profile
  },

  // Endpoints related to donation opportunities
  DONATION_OPERTUNITIES: {
    GET_ALL: `${BASE_URL}/donation-opportunities`, // Get all donation opportunities
    GET_BY_ID: `${BASE_URL}/donation-opportunities`, // Get a donation opportunity by ID (ID appended later)
    CREATE: `${BASE_URL}/donation-opportunities-create/`, // Create a new donation opportunity
    UPDATE: `${BASE_URL}/donation-opportunities`, // Update a donation opportunity by ID (ID appended later)
    DELETE: `${BASE_URL}/donation-opportunities`, // Delete a donation opportunity by ID (ID appended later)
    GET_FOR_HOME: `${BASE_URL}/donation-opportunities/home`, // Get donation opportunities for home page
  },
  DONATION: {
    GET_ALL: `${BASE_URL}/donation`, // Get all donation
    CREATE: `${BASE_URL}/donation`, // Create a new donation
    GET_BY_ID: `${BASE_URL}/donation/`, // Get a donation by ID (ID appended later)
    UPDATE: `${BASE_URL}/donation/`, // Update a donation by ID (ID appended later)
    DELETE: `${BASE_URL}/donation/`, // Delete a donation by ID (ID appended later)
  },
  // Endpoints related to campaigns
  CAMPAIGN: {
    GET_CAMPAIGNS: `${BASE_URL}/campaigns`,
    CREATE_CAMPAIGN: `${BASE_URL}/campaigns`,
    GET_CAMPAIGN_BY_ID: `${BASE_URL}/campaigns/`, // Append ID directly
    GET_CAMPAIGNS_BY_USER_ID: `${BASE_URL}/campaigns-user`, // Query params: ?type=&status=&page=&...
    GET_USERS_CAMPAIGNS: `${BASE_URL}/campaigns-users`, // Query params: ?type=&status=&page=&...
  },
  // Endpoints related to recharges
  RECHARGE: {
    GET_ALL: `${BASE_URL}/recharges`, // Get all recharges
    GET_BY_ID: `${BASE_URL}/recharges`, // Get a recharge by ID (ID appended later)
    CREATE: `${BASE_URL}/recharges`, // Create a new recharge
    UPDATE: `${BASE_URL}/recharges`, // Update a recharge by ID (ID appended later)
    DELETE: `${BASE_URL}/recharges`, // Delete a recharge by ID (ID appended later)
  },

  // Endpoints related to fields
  FIELD: {
    GET_FIELDS: `${BASE_URL}/fields`, // Get all fields
  },

  // Endpoints related to cities and locations in Algeria
  ALGERIA_CITIES: {
    GET_CITIES: `${BASE_URL}/algeria-cities`, // Get all cities
    GET_WILAYAS: `${BASE_URL}/algeria-cities/wilayas`, // Get all wilayas (provinces)
    GET_DAIRAS: `${BASE_URL}/algeria-cities//:wilayaCode/dairas`, // Get all dairas (districts) by wilaya code
    GET_COMMUNES: `${BASE_URL}/algeria-cities/:wilayaCode/dairas/:dairaName`, // Get all communes (municipalities) by wilaya code and daira name
  },

  // Endpoints related to categories
  CATEGORY: {
    GET_CATEGORIES: `${BASE_URL}/categories`, // Get all categories
  },

  // Endpoints related to precious metals prices
  PRECIOUS_METALS: {
    SILVER_PRICES: `${BASE_URL}/silver-prices`, // Get silver prices
    GOLD_PRICES: `${BASE_URL}/gold-prices`, // Get gold prices
  },

  // Endpoint for logging errors
  LOG_ERRORS: {
    LOG: `${BASE_URL}/log-error`, // Log an error
  },

  // Endpoint for app GUID
  APP: {
    GUID: `${BASE_URL}/app-guid`, // Get app GUID
  },

  GIVINGPARTNERS: {
    GET_ALL: `${BASE_URL}/givingPartners`, // Get all giving partners
    GET_BY_ID: `${BASE_URL}/givingPartners`, // Get a giving partner by ID (ID appended later)
    CREATE: `${BASE_URL}/givingPartners`, // Create a new giving partner
    UPDATE: `${BASE_URL}/givingPartners`, // Update a giving partner by ID (ID appended later)
    DELETE: `${BASE_URL}/givingPartners`, // Delete a giving partner by ID (ID appended later)
  },
  SUPERVISORYAUTHORITIES: {
    GET_ALL: `${BASE_URL}/supervisoryAuthorities`, // Get all Supervisory Authorities
    GET_BY_ID: `${BASE_URL}/supervisoryAuthorities`, // Get a Supervisory Authority by ID (ID appended later)
    CREATE: `${BASE_URL}/supervisoryAuthorities`, // Create a new Supervisory Authority
    UPDATE: `${BASE_URL}/supervisoryAuthorities`, // Update a Supervisory Authority by ID (ID appended later)
    DELETE: `${BASE_URL}/supervisoryAuthorities`, // Delete a Supervisory Authority by ID (ID appended later)
  },
  // REPPORTS
  REPPORTS: {
    GET_ZAKAT_REPPORT: `${BASE_URL}/repports/zakat`, // Get Zakat Repport
    GET_USER_BALANCE_REPPORTS: `${BASE_URL}/repports/user-balance`, // Get User Balance Repport
    GET_DONATION_OPPORTUNITIES_REPPORTS: `${BASE_URL}/repports/donation-opportunity`, // Get Donation Opportunities Repport
    GET_CAMPAIGNS_REPPORTS: `${BASE_URL}/repports/campaigns`, // Get Campaigns Repport
    GET_DONATIONS_REPPORTS: `${BASE_URL}/repports/donations`, // Get Donations Repport
  },
  // API_ENDPOINTS
  APPOINTMENTS: {
    GET_ALL: `${BASE_URL}/appointments`, // Get all appointments
    GET_BY_USER_ID: `${BASE_URL}/appointments/user`, // Get all appointments by user ID
    GET_BY_CAMPAIGN_ID: `${BASE_URL}/appointments/campaign`, // Get all appointments by campaign ID
    GET_BY_NATIONAL_CAMPAIGN_ID: `${BASE_URL}/appointments/national-campaign`, // Get all appointments by national campaign ID
    GET_BY_ID: `${BASE_URL}/appointments`, // Get an appointment by ID (ID appended later)

    SET_DATE: `${BASE_URL}/appointments/setDate`, // set DAte
    SET_IS_DONE: `${BASE_URL}/appointments/setIsDone`, // set is done

    CREATE: `${BASE_URL}/appointments`, // Create a new appointment
    UPDATE: `${BASE_URL}/appointments`, // Update an appointment by ID (ID appended later)
    DELETE: `${BASE_URL}/appointments`, // Delete an appointment by ID (ID appended later)
  },
  // CHAROTIES_ENDPOINTS
  CHARITIES: {
    GET_ALL: `${BASE_URL}/charities`, // Get all charities
    SEARCH: `${BASE_URL}/charities/search`, // Get all charities
    GET_BY_USER_ID: `${BASE_URL}/charities/user`, // Get all charities by user ID
    GET_BY_ID: `${BASE_URL}/charities`, // Get an appointment by ID (ID appended later)
    CREATE: `${BASE_URL}/charities`, // Create a new appointment
    UPDATE: `${BASE_URL}/charities`, // Update an appointment by ID (ID appended later)
    DELETE: `${BASE_URL}/charities`, // Delete an appointment by ID (ID appended later)
  },
  // PARTNERS
  PARTNERS: {
    GET_ALL: `${BASE_URL}/partners`, // Get all partners
    GET_BY_USER_ID: `${BASE_URL}/partners/user`, // Get all partners by user ID
    GET_BY_ID: `${BASE_URL}/partners`, // Get an appointment by ID (ID appended later)
    CREATE: `${BASE_URL}/partners`, // Create a new appointment
    UPDATE: `${BASE_URL}/partners`, // Update an appointment by ID (ID appended later)
    DELETE: `${BASE_URL}/partners`, // Delete an appointment by ID (ID appended later)
  },
  // BLOOD_AGENCIES
  BLOOD_AGENCIES: {
    GET_ALL: `${BASE_URL}/blood-agencies`, // Get all blood-agencies
    GET_BY_USER_ID: `${BASE_URL}/blood-agencies/user`, // Get all blood-agencies by user ID
    GET_BY_ID: `${BASE_URL}/blood-agencies`, // Get an appointment by ID (ID appended later)
    CREATE: `${BASE_URL}/blood-agencies`, // Create a new appointment
    UPDATE: `${BASE_URL}/blood-agencies`, // Update an appointment by ID (ID appended later)
    DELETE: `${BASE_URL}/blood-agencies`, // Delete an appointment by ID (ID appended later)
  },

  // ZAKAT
  ZAKAT: {
    GET_BY_USER_ID: `${BASE_URL}/zakat/user`, // Get all Zakat records by user ID
    CREATE: `${BASE_URL}/zakat`, // Create a new Zakat record
    UPDATE: `${BASE_URL}/zakat`, // Update a Zakat record by ID (ID appended later)
    DELETE: `${BASE_URL}/zakat`, // Delete a Zakat record by ID (ID appended later)
  },
  // ZAKAT
  NOTIFICATION: `${BASE_URL}/notifications`,
  // devices
  LOGGED_DEVICES: {
    CREATE: `${BASE_URL}/devices`, // Create a new devices record
    GET: `${BASE_URL}/devices`, // Update a devices record by ID (ID appended later)
    UPDATE: `${BASE_URL}/devices`, // Delete a devices record by ID (ID appended later)
  },
  NATIONAL_BLOOD: {
    GET_ALL: `${BASE_URL}/nationalCampaign`, // Get all national blood campaigns
    GET_BY_ID: `${BASE_URL}/nationalCampaign`, // Get a national blood campaign by ID (ID appended later)
    GET_BY_QUERY: `${BASE_URL}/nationalCampaign/query`, // Get national blood campaigns by query parameters
    CREATE: `${BASE_URL}/nationalCampaign`, // Create a new national blood campaign
    UPDATE: `${BASE_URL}/nationalCampaign`, // Update a national blood campaign by ID (ID appended later)
    DELETE: `${BASE_URL}/nationalCampaign`, // Delete a national blood campaign by ID (ID appended later)
  },
};

// Export the API_ENDPOINTS object for use throughout the application


export const CONSTANTS = {
  DONATION_TYPES: {
    CART: "cart",
    STORE: "store",
    CAMPAIGN: "campaign",
    DONATION_OPPOERTUNITY: "donationOpportunity",
    ZAKAT: "zakat",
  },
  CAMPAIGNSTATUS: {
    ONGOING: "صدقة جارية",
    URGENT: "مستعجلة",
    NOT_URGENT: "غير مستعجلة",
  },
  CAMPAIGN_USER_CREATETOR_TYPES: {
    USERCAMPAIGN: "USERCAMPAIGN",
    NATIONALCAMPAIGN: "NATIONALCAMPAIGN",
  },
};

// Export the API_ENDPOINTS object for use throughout the application
export default API_ENDPOINTS;
