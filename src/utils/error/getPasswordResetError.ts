/**
 * Turns AWS error messages into readable user friendly messages
 * @param error 
 */
export function getPasswordResetError(
    error: unknown
): string {
    if (!(error instanceof Error)) {
        return "Unable to reset your password.";
    }

    switch (error.name) {
        case "CodeMismatchException":
            return "The verification code is incorrect.";

        case "ExpiredCodeException":
            return "The verification code has expired. Please request a new one.";

        case "InvalidPasswordException":
            return "Your new password does not meet the password requirements.";

        case "LimitExceededException":
        case "TooManyRequestsException":
            return "Too many attempts. Please wait before trying again.";

        case "UserNotFoundException":
            return "We could not send a reset code for that email address.";

        case "NotAuthorizedException":
            return "Unable to reset the password for this account.";

        default:
            return error.message ||
                "Unable to reset your password.";
    }
}