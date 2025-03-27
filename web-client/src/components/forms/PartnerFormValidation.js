import validator from "validator";

// Validation functions for each field
export const validateEntityType = (entityType) => {
  if (!entityType) {
    return "يرجى اختيار نوع الحساب (فرد أو شركة).";
  }
  return null;
};

export const validateIndividualFields = (formData) => {
  const errors = {};
  if (!formData.fullName) {
    errors.fullName = "يرجى إدخال الاسم الكامل.";
  }
  if (!validator.isEmail(formData.email)) {
    errors.email = "يرجى إدخال بريد إلكتروني صحيح.";
  }
  if (!validator.isMobilePhone(formData.phone, "ar-DZ")) {
    errors.phone = "يرجى إدخال رقم هاتف صحيح.";
  }
  return errors;
};

export const validateCompanyFields = (formData) => {
  const errors = {};
  if (validator.isEmpty(formData.companyName)) {
    errors.companyName = "يرجى إدخال اسم الشركة.";
  }
  if (!validator.isEmail(formData.email)) {
    errors.email = "يرجى إدخال بريد إلكتروني صحيح للشركة.";
  }
  if (!validator.isMobilePhone(formData.phone, "ar-DZ")) {
    errors.phone = "يرجى إدخال رقم هاتف صحيح للشركة.";
  }
  return errors;
};

export const validateContactInfo = (formData) => {
  const errors = {};
  if (!formData.contactPerson) {
    errors.contactPerson = "يرجى إدخال اسم الشخص المشرف.";
  }
  if (!validator.isEmail(formData.contactEmail)) {
    errors.contactEmail = "يرجى إدخال بريد إلكتروني صحيح.";
  }
  if (!validator.isMobilePhone(formData.contactPhone, "ar-DZ")) {
    errors.contactPhone = "يرجى إدخال رقم هاتف صحيح.";
  }
  return errors;
};

export const validateRegistrationInfo = (formData) => {
  const errors = {};
  if (!formData.registrationNumber) {
    errors.registrationNumber = "يرجى إدخال رقم التسجيل التجاري.";
  }
  if (!formData.taxID) {
    errors.taxID = "يرجى إدخال رقم التعريف الضريبي.";
  }
  return errors;
};

export const validatePaymentInfo = (formData) => {
  const errors = {};
  if (!formData.bankDetails) {
    errors.bankDetails = "يرجى إدخال معلومات حساب البنك.";
  }
  if (!formData.acceptedPaymentMethods) {
    errors.acceptedPaymentMethods = "يرجى إدخال طرق الدفع المقبولة.";
  }
  return errors;
};

// Main step validation
export const validateStep = (activeStep, formData, setErrors) => {
  const newErrors = {};

  if (activeStep === 0) {
    const entityTypeError = validateEntityType(formData.entityType);
    if (entityTypeError) newErrors.entityType = entityTypeError;

    if (formData.entityType === "INDIVIDUAL") {
      Object.assign(newErrors, validateIndividualFields(formData));
    } else if (formData.entityType === "COMPANY") {
      Object.assign(newErrors, validateCompanyFields(formData));
    }
  }

  if (activeStep === 1 && formData.entityType === "COMPANY") {
    Object.assign(newErrors, validateContactInfo(formData));
  }

  if (activeStep === 2) {
    Object.assign(newErrors, validateRegistrationInfo(formData));
  }

  if (activeStep === 3) {
    Object.assign(newErrors, validatePaymentInfo(formData));
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
