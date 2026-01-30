import User, { IUser } from '../models/User';
import { LoginCredentials, RegisterCredentials, User as UserType } from '../types';
import { generateToken } from '../middlewares/auth';

export const registerUser = async (
  credentials: RegisterCredentials
): Promise<{ user: UserType; token: string }> => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: credentials.email.toLowerCase() });
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  // Create new user
  const user = new User({
    email: credentials.email.toLowerCase(),
    password: credentials.password,
    firstName: credentials.firstName,
    lastName: credentials.lastName,
  });

  await user.save();

  // Generate token
  const token = generateToken({
    userId: user._id.toString(),
    email: user.email,
  });

  // Return user without password
  const userResponse: UserType = {
    id: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: user.avatar,
    createdAt: user.createdAt.toISOString(),
  };

  return { user: userResponse, token };
};

export const loginUser = async (
  credentials: LoginCredentials
): Promise<{ user: UserType; token: string }> => {
  // Find user
  const user = await User.findOne({ email: credentials.email.toLowerCase() });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Check password
  const isPasswordValid = await user.comparePassword(credentials.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Generate token
  const token = generateToken({
    userId: user._id.toString(),
    email: user.email,
  });

  // Return user without password
  const userResponse: UserType = {
    id: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: user.avatar,
    createdAt: user.createdAt.toISOString(),
  };

  return { user: userResponse, token };
};

export const getUserById = async (userId: string): Promise<UserType | null> => {
  const user = await User.findById(userId);
  if (!user) {
    return null;
  }

  return {
    id: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: user.avatar,
    createdAt: user.createdAt.toISOString(),
  };
};
