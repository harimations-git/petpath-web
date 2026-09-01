import { Amplify } from "aws-amplify";
import { cognitoUserPoolsTokenProvider } from "aws-amplify/auth/cognito";
import { defaultStorage } from "aws-amplify/utils";

// Load the Cognito configuration from environment variables
const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const userPoolClientId = import.meta.env.VITE_COGNITO_CLIENT_ID;

// Stop the application if the required Cognito configuration is missing
if (!userPoolId || !userPoolClientId) {
  throw new Error("Cognito environment variables are missing.");
}

/**
 * Configure AWS Amplify to use the PetPath Cognito user pool
 * for authentication in the web portal.
 */
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId,
      userPoolClientId,
      loginWith: {
        email: true,
      },
    },
  },
});

//Store Cognito tokens in browser storage so the user's session persists
cognitoUserPoolsTokenProvider.setKeyValueStorage(defaultStorage);