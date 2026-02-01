import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../src/store';
import { authApi } from '../../src/services/api';
import { loginSuccess } from '../../src/store/slices/authActionCreators';
import styles from './login.module.css';

const RegisterPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
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

        console.log('Attempting registration with:', { firstName, lastName, email, password });

        try {
            const response = await authApi.register({
                firstName,
                lastName,
                email,
                password
            });

            console.log('Registration response:', response);

            if (response.success) {
                // Store token in localStorage
                localStorage.setItem('token', response.data.token);

                // Dispatch login action to Redux store
                dispatch(loginSuccess(response.data.user));

                // Redirect to portfolio
                router.push('/portfolio');
            } else {
                setError(response.message || 'Registration failed');
            }
        } catch (err: any) {
            console.error('Registration error:', err);
            console.error('Error response:', err.response);
            console.error('Error response data:', err.response?.data);

            // Handle different error formats
            let errorMessage = 'An error occurred during registration';

            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.response?.data) {
                errorMessage = JSON.stringify(err.response.data);
            } else if (err.message) {
                errorMessage = err.message;
            }

            // Special handling for mock mode
            if (errorMessage.includes('mock')) {
                errorMessage = 'Registration successful (mock mode) - check console for details';
                console.log('Mock registration successful - user would be registered with mock data');
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <h1>Register for Mercury</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="firstName">First Name:</label>
                    <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        placeholder="Enter your first name"
                    />
                </div>
                <div>
                    <label htmlFor="lastName">Last Name:</label>
                    <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        placeholder="Enter your last name"
                    />
                </div>
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
                        minLength={6}
                    />
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Registering...' : 'Register'}
                </button>
            </form>
            <p>
                Already have an account? <a href="/auth/login">Login here</a>
            </p>
        </div>
    );
};

export default RegisterPage;