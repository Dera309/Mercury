import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../src/store';
import { authApi } from '../../src/services/api';
import { loginSuccess } from '../../src/store/slices/authActionCreators';
import styles from './login.module.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

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
            } else if (err.response?.data) {
                errorMessage = JSON.stringify(err.response.data);
            } else if (err.message) {
                errorMessage = err.message;
            }

            // Special handling for mock mode
            if (errorMessage.includes('mock')) {
                errorMessage = 'Login successful (mock mode) - check console for details';
                console.log('Mock login successful - user would be logged in with mock data');
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
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
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <p>
                Don't have an account? <a href="/auth/register">Register here</a>
            </p>
        </div>
    );
};

export default LoginPage;