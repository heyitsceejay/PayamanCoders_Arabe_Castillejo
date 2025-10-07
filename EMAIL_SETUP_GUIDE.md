# Email Setup Guide for WorkQit

## Problem
Your email verification system was only logging emails to the console instead of actually sending them. This guide will help you set up real email delivery using Gmail SMTP.

## Solution: Gmail SMTP Setup

### Step 1: Enable 2-Factor Authentication on Gmail
1. Go to your Google Account settings: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google", enable "2-Step Verification" if not already enabled

### Step 2: Generate Gmail App Password
1. Still in Google Account Security settings
2. Under "Signing in to Google", click on "App passwords"
3. Select "Mail" as the app and "Other" as the device
4. Enter "WorkQit" as the device name
5. Click "Generate"
6. Copy the 16-character app password (it will look like: `abcd efgh ijkl mnop`)

### Step 3: Update Environment Variables
Edit your `.env.local` file and replace these values:

```env
# Email Configuration (Gmail SMTP)
EMAIL_USER=your-actual-email@gmail.com
EMAIL_APP_PASSWORD=your-16-character-app-password
```

**Example:**
```env
EMAIL_USER=john.doe@gmail.com
EMAIL_APP_PASSWORD=abcd efgh ijkl mnop
```

### Step 4: Restart Your Development Server
After updating the environment variables:
```bash
# Stop your current server (Ctrl+C)
# Then restart it
npm run dev
```

## Testing the Email System

### Option 1: Register a New Account
1. Go to `/auth/register`
2. Register with a real email address
3. Check your inbox for the verification email

### Option 2: Resend Verification Email
1. If you have an unverified account, go to `/auth/verify-email`
2. Enter your email to resend the verification email

## Email Features

### What's Included:
- ✅ Professional HTML email templates
- ✅ Fallback to plain text for older email clients
- ✅ Automatic fallback to console logging if email fails
- ✅ Beautiful branded email design
- ✅ Security warnings and expiration notices
- ✅ Mobile-responsive email layout

### Email Types:
1. **Email Verification** - Sent when users register
2. **Password Reset** - Sent when users request password reset

## Troubleshooting

### Common Issues:

1. **"Invalid credentials" error**
   - Make sure you're using an App Password, not your regular Gmail password
   - Ensure 2-Factor Authentication is enabled on your Gmail account

2. **"Less secure app access" error**
   - This shouldn't happen with App Passwords, but if it does, enable "Less secure app access" in Gmail settings

3. **Emails going to spam**
   - This is normal for development. Check your spam folder
   - In production, consider using a dedicated email service like SendGrid

4. **Email not received**
   - Check the server console for error messages
   - Verify your EMAIL_USER and EMAIL_APP_PASSWORD are correct
   - Make sure your internet connection is stable

### Development Mode Fallback
If email credentials are not configured, the system will:
- Log email content to the console
- Still allow the registration process to complete
- Show appropriate messages to users

## Production Recommendations

For production deployment, consider using:
- **SendGrid** - Professional email service with better deliverability
- **AWS SES** - Amazon's email service
- **Mailgun** - Developer-friendly email API
- **Postmark** - Transactional email service

These services provide better:
- Email deliverability rates
- Analytics and tracking
- Bounce and complaint handling
- Higher sending limits

## Security Notes

- Never commit your actual email credentials to version control
- Use environment variables for all sensitive configuration
- App Passwords are safer than regular passwords for SMTP
- Consider rotating App Passwords periodically
- Monitor your email sending for suspicious activity

## Next Steps

1. Set up your Gmail App Password
2. Update your `.env.local` file
3. Restart your development server
4. Test the email verification flow
5. Consider upgrading to a professional email service for production