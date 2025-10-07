import crypto from 'crypto'
import nodemailer from 'nodemailer'

// Email verification token generation
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Email verification token expiry (24 hours)
export function getVerificationTokenExpiry(): Date {
  return new Date(Date.now() + 24 * 60 * 60 * 1000)
}

// Create email transporter
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD, // Gmail App Password
    },
  })
}

// Send verification email
export async function sendVerificationEmail(email: string, token: string, firstName: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/verify-email?token=${token}`
  
  try {
    // If email credentials are not configured, fall back to console logging
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      console.log(`
        📧 Email Verification Required (Development Mode)
        ================================================
        To: ${email}
        Subject: Verify your WorkQit account
        
        Hi ${firstName},
        
        Thank you for registering with WorkQit! Please verify your email address by clicking the link below:
        
        ${verificationUrl}
        
        This link will expire in 24 hours.
        
        If you didn't create an account with WorkQit, please ignore this email.
        
        Best regards,
        The WorkQit Team
      `)
      
      return { success: true, message: 'Verification email logged to console (development mode)' }
    }

    const transporter = createTransporter()
    
    const mailOptions = {
      from: `"WorkQit" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify your WorkQit account',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify your WorkQit account</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">WorkQit</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Your Career Journey Starts Here</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
            <h2 style="color: #333; margin-top: 0;">Hi ${firstName}!</h2>
            
            <p>Thank you for registering with WorkQit! We're excited to have you join our community.</p>
            
            <p>To complete your registration and start using your account, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 5px; 
                        font-weight: bold; 
                        display: inline-block;
                        transition: transform 0.2s;">
                Verify Email Address
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666;">
              If the button doesn't work, you can also copy and paste this link into your browser:
              <br>
              <a href="${verificationUrl}" style="color: #667eea; word-break: break-all;">${verificationUrl}</a>
            </p>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #856404;">
                <strong>⏰ Important:</strong> This verification link will expire in 24 hours for security reasons.
              </p>
            </div>
            
            <p style="font-size: 14px; color: #666;">
              If you didn't create an account with WorkQit, please ignore this email and no account will be created.
            </p>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #999; text-align: center;">
              Best regards,<br>
              The WorkQit Team<br>
              <em>Connecting talent with opportunity</em>
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
        Hi ${firstName},
        
        Thank you for registering with WorkQit! Please verify your email address by visiting this link:
        
        ${verificationUrl}
        
        This link will expire in 24 hours.
        
        If you didn't create an account with WorkQit, please ignore this email.
        
        Best regards,
        The WorkQit Team
      `
    }

    await transporter.sendMail(mailOptions)
    return { success: true, message: 'Verification email sent successfully' }
    
  } catch (error) {
    console.error('Email sending error:', error)
    
    // Fall back to console logging if email fails
    console.log(`
      📧 Email Verification Required (Fallback - Email service failed)
      ================================================================
      To: ${email}
      Subject: Verify your WorkQit account
      
      Hi ${firstName},
      
      Thank you for registering with WorkQit! Please verify your email address by clicking the link below:
      
      ${verificationUrl}
      
      This link will expire in 24 hours.
      
      If you didn't create an account with WorkQit, please ignore this email.
      
      Best regards,
      The WorkQit Team
      
      Error: ${error.message}
    `)
    
    return { success: false, message: 'Email service temporarily unavailable', error: error.message }
  }
}

// Send password reset email
export async function sendPasswordResetEmail(email: string, token: string, firstName: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`
  
  try {
    // If email credentials are not configured, fall back to console logging
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      console.log(`
        🔐 Password Reset Request (Development Mode)
        ============================================
        To: ${email}
        Subject: Reset your WorkQit password
        
        Hi ${firstName},
        
        You requested to reset your password for your WorkQit account. Click the link below to reset your password:
        
        ${resetUrl}
        
        This link will expire in 1 hour.
        
        If you didn't request a password reset, please ignore this email.
        
        Best regards,
        The WorkQit Team
      `)
      
      return { success: true, message: 'Password reset email logged to console (development mode)' }
    }

    const transporter = createTransporter()
    
    const mailOptions = {
      from: `"WorkQit" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset your WorkQit password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset your WorkQit password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">WorkQit</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Password Reset Request</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
            <h2 style="color: #333; margin-top: 0;">Hi ${firstName}!</h2>
            
            <p>You requested to reset your password for your WorkQit account.</p>
            
            <p>Click the button below to reset your password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 5px; 
                        font-weight: bold; 
                        display: inline-block;
                        transition: transform 0.2s;">
                Reset Password
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666;">
              If the button doesn't work, you can also copy and paste this link into your browser:
              <br>
              <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
            </p>
            
            <div style="background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #721c24;">
                <strong>⏰ Important:</strong> This password reset link will expire in 1 hour for security reasons.
              </p>
            </div>
            
            <p style="font-size: 14px; color: #666;">
              If you didn't request a password reset, please ignore this email and your password will remain unchanged.
            </p>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #999; text-align: center;">
              Best regards,<br>
              The WorkQit Team<br>
              <em>Connecting talent with opportunity</em>
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
        Hi ${firstName},
        
        You requested to reset your password for your WorkQit account. Click the link below to reset your password:
        
        ${resetUrl}
        
        This link will expire in 1 hour.
        
        If you didn't request a password reset, please ignore this email.
        
        Best regards,
        The WorkQit Team
      `
    }

    await transporter.sendMail(mailOptions)
    return { success: true, message: 'Password reset email sent successfully' }
    
  } catch (error) {
    console.error('Password reset email error:', error)
    
    // Fall back to console logging if email fails
    console.log(`
      🔐 Password Reset Request (Fallback - Email service failed)
      ===========================================================
      To: ${email}
      Subject: Reset your WorkQit password
      
      Hi ${firstName},
      
      You requested to reset your password for your WorkQit account. Click the link below to reset your password:
      
      ${resetUrl}
      
      This link will expire in 1 hour.
      
      If you didn't request a password reset, please ignore this email.
      
      Best regards,
      The WorkQit Team
      
      Error: ${error.message}
    `)
    
    return { success: false, message: 'Email service temporarily unavailable', error: error.message }
  }
}