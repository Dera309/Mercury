import React, { useState } from 'react';
import { Layout } from '../src/components/layout';
import { Card } from '../src/components/ui';

const SupportPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validate and send data (mock implementation)
        console.log('Support request submitted:', formData);
        setSubmitted(true);
        // Reset form after 3 seconds
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: typeof formData) => ({ ...prev, [name]: value }));
    };

    return (
        <Layout>
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
                <h1 style={{ marginBottom: '2rem', color: '#1a1a1a' }}>Support & Help Center</h1>

                <div style={{ display: 'grid', gap: '2rem' }}>
                    {/* FAQ Section */}
                    <section>
                        <h2 style={{ marginBottom: '1rem', color: '#333' }}>Frequently Asked Questions</h2>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <Card>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>How do I verify my account?</h3>
                                <p style={{ color: '#666' }}>
                                    Account verification is automatic upon registration. If you experience issues, please check your email for a verification link or contact support.
                                </p>
                            </Card>
                            <Card>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Is my investment data secure?</h3>
                                <p style={{ color: '#666' }}>
                                    Yes, we use industry-standard encryption and security practices to protect your data. Your portfolio information is encrypted both in transit and at rest.
                                </p>
                            </Card>
                            <Card>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>How can I reset my password?</h3>
                                <p style={{ color: '#666' }}>
                                    You can reset your password from the login page by clicking "Forgot Password". Follow the instructions sent to your email.
                                </p>
                            </Card>
                        </div>
                    </section>

                    {/* Contact Form */}
                    <section>
                        <h2 style={{ marginBottom: '1rem', color: '#333' }}>Contact Us</h2>
                        <Card>
                            {submitted ? (
                                <div style={{ textAlign: 'center', padding: '2rem', color: 'green' }}>
                                    <h3>Thank you for contacting us!</h3>
                                    <p>We will get back to you shortly.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                                        <label htmlFor="name">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                                        <label htmlFor="email">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                                        <label htmlFor="subject">Subject</label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                                        <label htmlFor="message">Message</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={5}
                                            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        style={{
                                            padding: '0.75rem',
                                            background: '#0070f3',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Send Message
                                    </button>
                                </form>
                            )}
                        </Card>
                    </section>
                </div>
            </div>
        </Layout>
    );
};

export default SupportPage;
