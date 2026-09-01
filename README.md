# PetPath Web Application

PetPath is an adoption-first pet matching system designed to help prospective pet owners discover animals from verified rescue organisations that may be suitable for their lifestyle and location.

This repository contains the PetPath web portal, developed using React and TypeScript. The web application is used by rescue organisations to manage their organisation profile and pet listings, and by administrators to review organisation registrations and submitted pet listings.

Pet matching and pet discovery are handled separately through the PetPath mobile application. The web portal is primarily intended for organisation, listing and administrative management.

---

## Demo Login Details

Pre-configured organisation and administrator accounts are available for testing the web application.

If access is necessary, please refer to the login details available via the comments in the submission.

The organisation account can be used to access the organisation portal and manage pet listings.

The administrator account can be used to access the administrative area and review organisations and submitted listings.

---

## Main Features

### Rescue Organisation Portal

The organisation portal includes:

- Organisation registration and email verification
- Manual organisation approval workflow
- Organisation profile setup and management
- Creation of pet listings
- Editing existing pet listings
- Animal information management
- Pet suitability information
- Photo and document uploads
- Listing availability management
- Submission of listings for administrative review
- Organisation dashboard and listing statistics

### Administrative Portal

Administrators log in through the same web application but are provided with a separate role-protected interface.

Administrative functionality includes:

- Review of pending rescue organisation registrations
- Organisation approval and rejection
- Review of submitted pet listings
- Listing approval and rejection
- Viewing approved organisations
- Viewing approved pet listings

Organisation verification allows administrators to review the charity information supplied during registration before approving access to the organisation portal.

---

## Technologies

- React
- TypeScript
- Vite
- React Router
- AWS Amplify
- AWS Cognito
- Amazon API Gateway
- AWS Lambda
- Amazon DynamoDB
- Amazon S3

The AWS services are accessed through the deployed PetPath backend APIs, with AWS Cognito used for authentication and role-based access.

---

## Running PetPath

The web application can be run locally from the supplied source code.

The GitHub repository is also available for reference:

[PetPath Web GitHub Repository](https://github.com/harimations-git/petpath-web)

### Requirements

Ensure the following are installed:

- Node.js
- npm

### Accessing and Running the Web Application

The easiest way to access the deployed PetPath web application is to visit:

[https://petpathapp.co.uk](https://petpathapp.co.uk)

When prompted for website access, enter:

- **Username:** `petpath`
- **Password:** `petpathwebsite1`

Once the site has loaded, use the demonstration login credentials provided in the submission comments to access either:

- a rescue organisation account; or
- an administrator account.

These accounts can be used to demonstrate the organisation and administrative functionality of PetPath.

### Running Locally

Alternatively, the web application can be run locally from the supplied source code.

1. Open a terminal in the `petpath-web` project folder.

2. Install the project dependencies:

```bash
npm install
```
3. Run the project:

```bash
npm run dev
```

4. Open the displayed address in a web browser

---

## Organisation and Administrator Access

PetPath uses role-based access to separate organisation and administrator functionality.

Rescue organisation accounts can access organisation profile and pet listing management functionality.

Administrator accounts can access the administrative interface used to review organisations and listings.

Although both account types log in through the same web application, users are directed to the interface appropriate to their account permissions.

---