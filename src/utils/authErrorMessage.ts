function getErrorName(error: unknown) {
  return error instanceof Error ? error.name : "";
}

export function getSignUpErrorMessage(error: unknown) {
  const errorName = getErrorName(error);

  switch (errorName) {
    case "UsernameExistsException":
      return "An account already exists with this email. Try logging in.";

    case "InvalidPasswordException":
      return "Use 8+ characters with uppercase, lowercase, a number and a symbol.";

    case "InvalidParameterException":
      return "Please check your details and try again.";

    case "LimitExceededException":
      return "Too many attempts. Please wait and try again.";

    case "CodeDeliveryFailureException":
      return "We couldn't send the verification email. Please try again.";

    default:
      return "We couldn't create your account. Please try again.";
  }
}