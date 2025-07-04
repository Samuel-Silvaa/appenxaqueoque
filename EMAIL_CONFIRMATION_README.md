# Email Confirmation Functionality

This document describes the email confirmation functionality implemented in the React Native app.

## Overview

The email confirmation system allows users to:
1. Request an email confirmation link
2. Confirm their email via a deeplink
3. Track email confirmation status in the user session

## API Endpoints

### Send Email Confirmation
- **Endpoint**: `POST /session/send-email-confirmation`
- **Payload**: `{ email: string }`
- **Response**: `{ message: string }`

### Confirm Email
- **Endpoint**: `POST /session/confirm-email`
- **Payload**: `{ token: string, email: string }`
- **Response**: `{ message: string, isEmailConfirmed: boolean }`

## Deeplink Format

The email confirmation deeplink follows this format:
```
http://localhost:8081/confirm-email?token=${token}&email=${email}
```

## Implementation Details

### 1. Updated Auth Types (`src/infra/@types/auth.types.ts`)
- Added `isEmailConfirmed: boolean` to `LogInResponse`
- Added `SendEmailConfirmationDTO` and `SendEmailConfirmationResponse`
- Added `ConfirmEmailDTO` and `ConfirmEmailResponse`

### 2. Updated Auth Service (`src/infra/services/authService.tsx`)
- Added `requestHandleSendEmailConfirmation` function
- Added `requestHandleConfirmEmail` function

### 3. Updated Auth Reducer (`src/infra/app/reducers/auth.reducer.ts`)
- Added `isEmailConfirmed` to the auth state
- Added async thunks for email confirmation actions
- Added reducer cases to handle email confirmation responses

### 4. New Pages

#### SendEmailConfirmation (`src/modules/auth/emailConfirmation/SendEmailConfirmation.tsx`)
- Form to request email confirmation
- Validates email format
- Shows success/error messages
- Navigates back to login on success

#### ConfirmEmail (`src/modules/auth/emailConfirmation/ConfirmEmail.tsx`)
- Handles deeplink with token and email parameters
- Automatically confirms email on page load
- Shows loading, success, and error states
- Navigates to login on completion

### 5. Updated Navigation (`src/modules/auth/index.tsx`)
- Added routes for `sendEmailConfirmation` and `confirmEmail` pages

### 6. Deeplink Handling (`App.tsx`)
- Added deeplink listener for email confirmation URLs
- Parses token and email from URL parameters
- Navigates to ConfirmEmail page with parameters

### 7. UI Integration
- Added "Esqueci minha senha" link in Login page
- Added "Confirmar email" link in Patient registration page

## Usage Flow

1. **User requests email confirmation**:
   - User clicks "Esqueci minha senha" on login page
   - Or clicks "Confirmar email" on registration page
   - User enters email and submits form
   - System sends confirmation email

2. **User confirms email**:
   - User receives email with confirmation link
   - User clicks link: `http://localhost:8081/confirm-email?token=abc123&email=user@example.com`
   - App opens and automatically confirms email
   - User sees success message and is redirected to login

3. **Session tracking**:
   - `isEmailConfirmed` field is updated in auth state
   - Login response includes email confirmation status

## Testing

To test the email confirmation functionality:

1. **Send confirmation email**:
   - Navigate to login page
   - Click "Esqueci minha senha"
   - Enter email and submit

2. **Test deeplink**:
   - Use a test URL: `http://localhost:8081/confirm-email?token=test-token&email=test@example.com`
   - App should open and show confirmation process

## Notes

- The deeplink handling is configured for development (`localhost:8081`)
- For production, update the deeplink URL pattern in `App.tsx`
- Email confirmation status is tracked in the Redux store
- Error handling includes user-friendly messages and navigation 