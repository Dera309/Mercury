import { Request, Response, NextFunction } from 'express';
import { ApiResponse, User as UserType } from '../types';

// Mock user data for testing without database
const mockUsers: UserType[] = [
  {
    id: '1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    createdAt: new Date().toISOString(),
  },
];

export const mockLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log('Mock login request received:', req.body);
    const { email, password } = req.body;
    
    // Find user by email
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      const error: any = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // In mock mode, we don't actually validate the password
    // but we log it for debugging purposes
    console.log('Mock login - password received (not validated):', password);

    // Mock token generation
    const token = 'mock-jwt-token-' + Date.now();

    const response: ApiResponse<{ user: UserType; token: string }> = {
      success: true,
      data: { user, token },
      message: 'Login successful (mock mode)',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const mockRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      const error: any = new Error('User already exists with this email');
      error.statusCode = 400;
      throw error;
    }

    // Create new user
    const newUser: UserType = {
      id: String(mockUsers.length + 1),
      email,
      firstName,
      lastName,
      createdAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);

    // Mock token generation
    const token = 'mock-jwt-token-' + Date.now();

    const response: ApiResponse<{ user: UserType; token: string }> = {
      success: true,
      data: { user: newUser, token },
      message: 'User registered successfully (mock mode)',
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const mockGetCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // In a real app, this would decode JWT and find user
    // For mock, just return the first user
    const user = mockUsers[0];

    if (!user) {
      const error: any = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const response: ApiResponse<UserType> = {
      success: true,
      data: user,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
