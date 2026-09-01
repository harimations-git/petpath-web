//Error type to display error messages
export type ErrorResponse = {
  message?: string;
};

/**
 * Gets the name of an error when the provided value is an Error object.
 * @param error Error value to check.
 */
function getErrorName(error: unknown) {
  return error instanceof Error ? error.name : "";
}

/**
 * Helper function used to turn complex aws errors into a readable user friendly format during signup
 * @param error 
 * @returns 
 */
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

/**
 * Helper function gets and returns an error message with a fallback if there is an error
 * @param response 
 * @param fallbackMessage 
 * @returns 
 */
export async function getErrorMessage(response: Response, fallbackMessage: string) {
  try {
    const data = await response.json() as ErrorResponse;
    return data.message || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}