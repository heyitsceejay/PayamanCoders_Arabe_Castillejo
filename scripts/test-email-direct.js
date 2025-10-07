// Load environment variables first
require('dotenv').config({ path: '.env.local' })

// Import the email function
const { sendVerificationEmail } = require('../lib/email.ts')

async function testDirectEmail() {
  console.log('🧪 Testing Direct Email Sending...')
  console.log('==================================')
  
  try {
    console.log('📧 Sending test verification email...')
    
    const result = await sendVerificationEmail(
      'kloydmatyo@gmail.com',
      'test-verification-token-' + Date.now(),
      'Kloyd'
    )
    
    console.log('✅ Email Result:', result)
    
    if (result.success) {
      console.log('🎉 SUCCESS! Verification email sent!')
      console.log('📬 Check your inbox at kloydmatyo@gmail.com')
      console.log('📁 Also check spam folder if not in inbox')
      console.log('')
      console.log('🔗 The email contains a verification link that would look like:')
      console.log('   http://localhost:3000/auth/verify-email?token=test-verification-token-...')
    } else {
      console.log('❌ Email sending failed:', result.message)
      if (result.error) {
        console.log('Error details:', result.error)
      }
    }
    
  } catch (error) {
    console.error('❌ Direct email test failed:', error)
  }
}

testDirectEmail().catch(console.error)