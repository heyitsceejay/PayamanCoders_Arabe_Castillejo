const fetch = require('node-fetch')

async function testVerificationFlow() {
  console.log('🧪 Testing Email Verification Flow...')
  console.log('====================================')
  
  // Test with an invalid token
  console.log('1️⃣ Testing with invalid token...')
  try {
    const response = await fetch('http://localhost:3000/api/auth/verify-email?token=invalid-token-123')
    const result = await response.json()
    
    console.log('Status:', response.status)
    console.log('Response:', result)
    console.log('')
  } catch (error) {
    console.log('❌ Test failed:', error.message)
  }
  
  // Test with no token
  console.log('2️⃣ Testing with no token...')
  try {
    const response = await fetch('http://localhost:3000/api/auth/verify-email')
    const result = await response.json()
    
    console.log('Status:', response.status)
    console.log('Response:', result)
    console.log('')
  } catch (error) {
    console.log('❌ Test failed:', error.message)
  }
  
  console.log('✅ Verification flow tests completed!')
  console.log('')
  console.log('🔍 What should happen now:')
  console.log('- Invalid tokens show a helpful "already verified" message')
  console.log('- Users are redirected to login page')
  console.log('- No more confusing "Invalid or expired" errors')
}

testVerificationFlow().catch(console.error)