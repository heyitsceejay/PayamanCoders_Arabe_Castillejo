const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

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

// Application model
const applicationSchema = new mongoose.Schema({
  resume: {
    filename: String,
    cloudinaryUrl: String,
    cloudinaryPublicId: String,
    uploadedAt: Date,
  }
}, { strict: false });

const Application = mongoose.model('Application', applicationSchema);

async function fixResumeFormats() {
  try {
    console.log('🔧 Starting resume format fix...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Function to determine file type from filename or URL
    const getFileTypeFromFilename = (filename) => {
      if (!filename) return 'pdf'; // Default to PDF
      
      const extension = filename.toLowerCase().split('.').pop();
      switch (extension) {
        case 'pdf':
          return 'pdf';
        case 'docx':
          return 'docx';
        case 'doc':
          return 'doc';
        default:
          return 'pdf'; // Default to PDF
      }
    };

    // Fix User resumes
    console.log('\n1️⃣ Fixing User resume formats...');
    const usersWithResumes = await User.find({
      'resume.fileType': { $in: [null, undefined, 'N/A', '', 'raw'] }
    });

    console.log(`Found ${usersWithResumes.length} users with invalid resume formats`);

    for (const user of usersWithResumes) {
      if (user.resume) {
        const newFileType = getFileTypeFromFilename(user.resume.filename);
        
        await User.findByIdAndUpdate(user._id, {
          'resume.fileType': newFileType
        });
        
        console.log(`✅ Fixed user ${user._id}: ${user.resume.filename} -> ${newFileType}`);
      }
    }

    // Fix Application resumes (if they have fileType field)
    console.log('\n2️⃣ Checking Application resume formats...');
    const applicationsWithResumes = await Application.find({
      'resume.fileType': { $in: [null, undefined, 'N/A', '', 'raw'] }
    });

    console.log(`Found ${applicationsWithResumes.length} applications with invalid resume formats`);

    for (const app of applicationsWithResumes) {
      if (app.resume && app.resume.filename) {
        const newFileType = getFileTypeFromFilename(app.resume.filename);
        
        await Application.findByIdAndUpdate(app._id, {
          'resume.fileType': newFileType
        });
        
        console.log(`✅ Fixed application ${app._id}: ${app.resume.filename} -> ${newFileType}`);
      }
    }

    console.log('\n🎉 Resume format fix completed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing resume formats:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📤 Disconnected from MongoDB');
  }
}

// Run the fix
fixResumeFormats();