import React from 'react';
import { Layout } from '../../src/components/layout';
import { Card } from '../../src/components/ui';

const TermsPage = () => {
    return (
        <Layout>
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
                <h1 style={{ marginBottom: '2rem', color: '#1a1a1a' }}>Terms of Service</h1>

                <Card>
                    <div style={{ lineHeight: '1.6', color: '#333' }}>
                        <p style={{ marginBottom: '1rem' }}>Last updated: {new Date().toLocaleDateString()}</p>

                        <h2 style={{ fontSize: '1.5rem', margin: '1.5rem 0 1rem' }}>1. Acceptance of Terms</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            By accessing and using the Mercury Investment Platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                        </p>

                        <h2 style={{ fontSize: '1.5rem', margin: '1.5rem 0 1rem' }}>2. Description of Service</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            Mercury Investment Platform provides tools for tracking and managing investment portfolios. We are not a licensed financial advisor, and our services are for informational purposes only.
                        </p>

                        <h2 style={{ fontSize: '1.5rem', margin: '1.5rem 0 1rem' }}>3. User Accounts</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.
                        </p>

                        <h2 style={{ fontSize: '1.5rem', margin: '1.5rem 0 1rem' }}>4. Investment Risks</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            Investing in financial markets involves risk, including the potential loss of principal. Past performance is not indicative of future results. You are solely responsible for your investment decisions.
                        </p>

                        <h2 style={{ fontSize: '1.5rem', margin: '1.5rem 0 1rem' }}>5. Modifications</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            We reserve the right to modify these terms at any time. We will notify users of any significant changes.
                        </p>
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

export default TermsPage;
