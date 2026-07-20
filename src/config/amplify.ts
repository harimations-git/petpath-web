import { Amplify } from "aws-amplify";
import { cognitoUserPoolsTokenProvider } from "aws-amplify/auth/cognito";
import { defaultStorage } from "aws-amplify/utils";

const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const userPoolClientId = import.meta.env.VITE_COGNITO_CLIENT_ID;

if (!userPoolId || !userPoolClientId) {
  throw new Error("Cognito environment variables are missing.");
}

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

//user session persists
cognitoUserPoolsTokenProvider.setKeyValueStorage(
    defaultStorage //browser local storage
);