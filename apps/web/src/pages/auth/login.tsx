import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { authApi } from '../../services/api';
import { loginSuccess } from '../../store/slices/authActionCreators';
import styles from './login.module.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();

    const validateForm = () => {
        if (!email.trim()) {
            setError('Please enter your email address');
            return false;
        }
        
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }
        
        if (!password) {
            setError('Please enter your password');
            return false;
        }
        
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        // Basic form validation
        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }

        console.log('Attempting login with:', { email, password });

        try {
            const response = await authApi.login({ email, password });

            console.log('Login response:', response);

            if (response.success) {
                // Store token in localStorage
                localStorage.setItem('token', response.data.token);

                // Dispatch login action to Redux store
                dispatch(loginSuccess(response.data.user));

                // Redirect to portfolio
                router.push('/portfolio');
            } else {
                setError(response.message || 'Login failed');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            console.error('Error response:', err.response);
            console.error('Error response data:', err.response?.data);

            // Handle different error formats
            let errorMessage = 'An error occurred during login';

            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.response?.data) {
                errorMessage = JSON.stringify(err.response.data);
            } else if (err.message) {
                errorMessage = err.message;
            } else {
                errorMessage = 'Network error - please check your connection';
            }

            // Special handling for mock mode
            if (errorMessage.includes('mock')) {
                errorMessage = 'Login successful (mock mode) - check console for details';
                console.log('Mock login successful - user would be logged in with mock data');
            }

            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <h1>Login to Mercury</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                    />
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <p>
                Don't have an account? <a href="/auth/register">Register here</a>
            </p>
        </div>
    );
};

export default LoginPage;