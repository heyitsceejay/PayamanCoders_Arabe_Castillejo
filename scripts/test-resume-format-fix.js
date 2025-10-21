const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Test the file type detection function
function getFileType(mimeType) {
  switch (mimeType) {
    case 'application/pdf':
      return 'pdf';
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return 'docx';
    default:
      return 'unknown';
  }
}

// User model
const userSchema = new mongoose.Schema({
  resume: {
    filename: String,
    originalName: String,
    cloudinaryPublicId: String,
    cloudinaryUrl: String,
    fileSize: Number,
    fileType: String,
    uploadedAt: Date,
  }
}, { strict: false });

const User = mongoose.model('User', userSchema);

async function testResumeFormatFix() {
  try {
    console.log('🧪 Testing resume format fix...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Test file type detection
    console.log('\n1️⃣ Testing file type detection:');
    const testCases = [
      { mimeType: 'application/pdf', expected: 'pdf' },
      { mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', expected: 'docx' },
      { mimeType: 'application/msword', expected: 'unknown' },
      { mimeType: 'text/plain', expected: 'unknown' }
    ];

    testCases.forEach(testCase => {
      const result = getFileType(testCase.mimeType);
      const status = result === testCase.expected ? '✅' : '❌';
      console.log(`${status} ${testCase.mimeType} -> ${result} (expected: ${testCase.expected})`);
    });

    // Check current database state
    console.log('\n2️⃣ Checking current database state:');
    const usersWithResumes = await User.find({
      'resume.fileType': { $exists: true }
    }).select('resume.filename resume.fileType');

    console.log(`Found ${usersWithResumes.length} users with resumes:`);
    usersWithResumes.forEach((user, index) => {
      if (user.resume) {
        const status = user.resume.fileType && user.resume.fileType !== 'N/A' ? '✅' : '❌';
        console.log(`${status} User ${index + 1}: ${user.resume.filename} -> ${user.resume.fileType}`);
      }
    });

    // Check for any remaining N/A formats
    console.log('\n3️⃣ Checking for remaining N/A formats:');
    const usersWithNAFormat = await User.find({
      'resume.fileType': { $in: ['N/A', null, undefined, '', 'raw'] }
    });

    if (usersWithNAFormat.length === 0) {
      console.log('✅ No users found with N/A or invalid formats!');
    } else {
      console.log(`❌ Found ${usersWithNAFormat.length} users with invalid formats:`);
      usersWithNAFormat.forEach((user, index) => {
        console.log(`   User ${index + 1}: ${user.resume?.filename} -> ${user.resume?.fileType}`);
      });
    }

    console.log('\n🎉 Resume format test completed!');
    
  } catch (error) {
    console.error('❌ Error testing resume formats:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📤 Disconnected from MongoDB');
  }
}

// Run the test
testResumeFormatFix();