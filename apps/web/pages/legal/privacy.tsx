import React from 'react';
import { Layout } from '../../src/components/layout';
import { Card } from '../../src/components/ui';

const PrivacyPage = () => {
    return (
        <Layout>
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
                <h1 style={{ marginBottom: '2rem', color: '#1a1a1a' }}>Privacy Policy</h1>

                <Card>
                    <div style={{ lineHeight: '1.6', color: '#333' }}>
                        <p style={{ marginBottom: '1rem' }}>Last updated: {new Date().toLocaleDateString()}</p>

                        <h2 style={{ fontSize: '1.5rem', margin: '1.5rem 0 1rem' }}>1. Information We Collect</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us. This may include your name, email address, and financial data.
                        </p>

                        <h2 style={{ fontSize: '1.5rem', margin: '1.5rem 0 1rem' }}>2. How We Use Your Information</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            We use your information to provide, maintain, and improve our services, including processing transactions, analyzing trends, and communicating with you.
                        </p>

                        <h2 style={{ fontSize: '1.5rem', margin: '1.5rem 0 1rem' }}>3. Data Security</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                        </p>

                        <h2 style={{ fontSize: '1.5rem', margin: '1.5rem 0 1rem' }}>4. Third-Party Services</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            We may use third-party services to better provide our services. These third parties have their own privacy policies and we encourage you to review them.
                        </p>

                        <h2 style={{ fontSize: '1.5rem', margin: '1.5rem 0 1rem' }}>5. Contact Us</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            If you have any questions about this Privacy Policy, please contact us at privacy@mercury-platform.com.
                        </p>
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

export default PrivacyPage;
