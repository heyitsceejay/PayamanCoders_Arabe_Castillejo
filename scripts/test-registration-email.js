const fetch = require('node-fetch')

async function testRegistrationEmail() {
  console.log('🧪 Testing Registration Email Flow...')
  console.log('====================================')
  
  const testUser = {
    email: 'kloydmatyo+test@gmail.com', // Using + alias to avoid conflicts
    password: 'TestPassword123!@#',
    firstName: 'Test',
    lastName: 'User',
    role: 'job_seeker'
  }
  
  try {
    console.log('📝 Attempting to register user:', testUser.email)
    
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    })
    
    const result = await response.json()
    
    console.log('📊 Registration Response Status:', response.status)
    console.log('📊 Registration Response:', result)
    
    if (response.ok && result.requiresVerification) {
      console.log('✅ Registration successful!')
      console.log('📧 Verification email should be sent to:', testUser.email)
      console.log('📬 Check your inbox and spam folder')
    } else {
      console.log('❌ Registration failed:', result.error || result.message)
    }
    
  } catch (error) {
    console.error('❌ Registration test failed:', error.message)
  }
}

testRegistrationEmail().catch(console.error)