const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function createEmployerUser() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found in environment variables');
    return;
  }

  console.log('🔄 Creating employer test user...');

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('workqit');
    const usersCollection = db.collection('users');

    // Test employer user data
    const employerUser = {
      email: 'employer@workqit.com',
      password: await bcrypt.hash('password123', 12),
      firstName: 'John',
      lastName: 'Employer',
      role: 'employer',
      profile: {
        bio: 'HR Manager at TechCorp Inc. Looking for talented individuals to join our team.',
        skills: ['Recruiting', 'HR Management', 'Team Building'],
        location: 'San Francisco, CA',
        experience: 'Senior Level',
        availability: 'full_time',
        remote: false
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Check if employer user already exists
    const existingUser = await usersCollection.findOne({ email: employerUser.email });
    
    if (existingUser) {
      console.log('👤 Employer user already exists');
      console.log('📧 Email:', employerUser.email);
      console.log('🔑 Password: password123');
      console.log('👔 Role:', employerUser.role);
      return;
    }

    // Create the employer user
    const result = await usersCollection.insertOne(employerUser);
    console.log('✅ Employer user created successfully!');
    console.log('🆔 User ID:', result.insertedId);
    console.log('📧 Email:', employerUser.email);
    console.log('🔑 Password: password123');
    console.log('👔 Role:', employerUser.role);
    console.log('👤 Name:', employerUser.firstName, employerUser.lastName);

  } catch (error) {
    console.error('❌ Error creating employer user:', error);
  } finally {
    await client.close();
    console.log('🔌 Connection closed');
  }
}

createEmployerUser();