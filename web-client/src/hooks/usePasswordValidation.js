import { useState } from "react";
import validator from "validator";

export const usePasswordValidation = (
  validationOptions = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  }
) => {
  const [password, setPassword] = useState("");
  const [validations, setValidations] = useState({
    minLength: false,
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasSymbol: false,
  });

  const onPasswordChange = (value) => {
    setPassword(value);

    setValidations({
      minLength: value.length >= validationOptions.minLength,
      hasLowercase: /[a-z]/.test(value),
      hasUppercase: /[A-Z]/.test(value),
      hasNumber: /[0-9]/.test(value),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      isStrong: validator.isStrongPassword(value, validationOptions),
    });
  };

  return { password, validations, onPasswordChange };
};
