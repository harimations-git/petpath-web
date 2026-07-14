import {
    confirmResetPassword,
    resetPassword,
} from "aws-amplify/auth";

export type SendPasswordResetCodeResult = {
    isComplete: boolean;
    destination?: string;
};

/**
 * Sends a reset code provided my aws to the email provided
 * @param email 
 * @returns 
 */
export async function sendPasswordResetCode(
    email: string
): Promise<SendPasswordResetCodeResult> { 
    const normalisedEmail = email.trim().toLowerCase();

    const result = await resetPassword({
        username: normalisedEmail,
    });

    if(result.nextStep.resetPasswordStep === "DONE") {
        return {
            isComplete: true,
        };
    }

    return {
        isComplete: false,
        destination:
        result.nextStep.codeDeliveryDetails?.destination,
    };
}

type ConfirmPasswordResetInput = {
    email: string;
    confirmationCode: string;
    newPassword: string;
};

/**
 * Receives code and new password and uploads them to aws
 * @param param0 
 */
export async function completePasswordReset({
    email,
    confirmationCode,
    newPassword,
}: ConfirmPasswordResetInput): Promise<void> {
    await confirmResetPassword({
        username: email.trim().toLowerCase(),
        confirmationCode: confirmationCode.trim(),
        newPassword
    });
}