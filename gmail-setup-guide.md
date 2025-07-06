# Gmail API Setup Guide for rooted.

## Quick Setup Steps

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 2. Create a New Project
- Click "Select a project" at the top
- Click "NEW PROJECT"
- Name it "rooted-email" or similar
- Click "CREATE"

### 3. Enable Gmail API
- Go to "APIs & Services" → "Library"
- Search "Gmail API"
- Click it and press "ENABLE"

### 4. Configure OAuth Consent Screen
- Go to "APIs & Services" → "OAuth consent screen"
- Choose "External" user type
- Fill in:
  - App name: "rooted"
  - User support email: your email
  - Developer contact: your email
- Click "SAVE AND CONTINUE" through all steps

### 5. Create Credentials
- Go to "APIs & Services" → "Credentials"
- Click "+ CREATE CREDENTIALS" → "OAuth client ID"
- Application type: "Web application"
- Name: "rooted-gmail"
- Authorized redirect URIs: `https://developers.google.com/oauthplayground`
- Click "CREATE"
- **SAVE** the Client ID and Client Secret

### 6. Get Refresh Token
- Go to: https://developers.google.com/oauthplayground
- Click the settings gear icon (top right)
- Check "Use your own OAuth credentials"
- Enter your Client ID and Client Secret
- In the left panel, scroll to "Gmail API v1"
- Select: `https://www.googleapis.com/auth/gmail.send`
- Click "Authorize APIs"
- Sign in with your Gmail account
- Click "Exchange authorization code for tokens"
- **SAVE** the Refresh token

### 7. Required Environment Variables
You'll need these 4 values:
- `GMAIL_CLIENT_ID`: From step 5
- `GMAIL_CLIENT_SECRET`: From step 5  
- `GMAIL_REFRESH_TOKEN`: From step 6
- `GMAIL_USER_EMAIL`: Your Gmail address

## Test the Setup
Once you have the credentials, visit: `/api/test-gmail` to verify everything works.