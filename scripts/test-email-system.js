const { sendVerificationEmail } = require('../lib/email.ts')

async function testEmailSystem() {
  console.log('🧪 Testing Email System...')
  console.log('========================')
  
  // Check environment variables
  console.log('📋 Environment Check:')
  console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Missing')
  console.log('EMAIL_APP_PASSWORD:', process.env.EMAIL_APP_PASSWORD ? '✅ Set' : '❌ Missing')
  console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'http://localhost:3000')
  console.log('')
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    console.log('❌ Email credentials not found in environment variables')
    console.log('Make sure your .env.local file has:')
    console.log('EMAIL_USER=kloydmatyo@gmail.com')
    console.log('EMAIL_APP_PASSWORD=vgot-ijaw-hehc-cyjg')
    return
  }
  
  // Test email sending
  console.log('📧 Testing email sending...')
  try {
    const result = await sendVerificationEmail(
      'kloydmatyo@gmail.com', // Send to your own email for testing
      'test-token-123',
      'Kloyd'
    )
    
    console.log('✅ Email function result:', result)
    
    if (result.success) {
      console.log('🎉 Email sent successfully!')
      console.log('📬 Check your inbox at kloydmatyo@gmail.com')
      console.log('📁 Also check your spam folder just in case')
    } else {
      console.log('❌ Email sending failed:', result.message)
      if (result.error) {
        console.log('Error details:', result.error)
      }
    }
    
  } catch (error) {
    console.log('❌ Email test failed with error:')
    console.error(error)
    
    // Check common issues
    if (error.message.includes('Invalid login')) {
      console.log('\n🔍 Possible Issues:')
      console.log('1. App Password might be incorrect')
      console.log('2. 2-Factor Authentication not enabled on Gmail')
      console.log('3. App Password not generated correctly')
    }
    
    if (error.message.includes('Less secure app')) {
      console.log('\n🔍 Issue: Less secure app access')
      console.log('Solution: Use App Password instead of regular password')
    }
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' })

testEmailSystem().catch(console.error)