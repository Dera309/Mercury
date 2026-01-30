const mongoose = require('mongoose');
require('dotenv').config({ path: './mercury-investment-platform/apps/api/.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('✅ MongoDB connected successfully');

  // Define User model
  const UserSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
    },
  }, {
    timestamps: true,
  });

  const User = mongoose.model('User', UserSchema);

  // Find all users
  const users = await User.find();
  console.log('Users in database:', users.length);

  if (users.length > 0) {
    users.forEach(user => {
      console.log('User:', user.email);
    });
  } else {
    console.log('No users found in database');
  }

  mongoose.disconnect();
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});