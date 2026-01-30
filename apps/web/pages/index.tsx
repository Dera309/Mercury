import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Layout } from '../src/components/layout';
import { Card, Button } from '../src/components/ui';
import styles from './Home.module.css';

const features = [
  {
    icon: '📊',
    title: 'Portfolio Tracking',
    description: 'Monitor your investments in real-time with comprehensive portfolio analytics and performance metrics.',
  },
  {
    icon: '📈',
    title: 'Market Data',
    description: 'Access live market data, stock quotes, and sector performance to make informed investment decisions.',
  },
  {
    icon: '🔒',
    title: 'Secure Trading',
    description: 'Execute trades securely with bank-level encryption and multi-factor authentication.',
  },
  {
    icon: '📱',
    title: 'Mobile Ready',
    description: 'Manage your investments on the go with our fully responsive design that works on any device.',
  },
];

const stats = [
  { value: '$2.5B+', label: 'Assets Under Management' },
  { value: '50K+', label: 'Active Investors' },
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Support' },
];

const HomePage: React.FC = () => {
  return (
    <Layout>
      <Head>
        <title>Mercury Investment Platform - Multi-Asset Investment Management</title>
        <meta name="description" content="Manage your multi-asset investments with ease using Mercury Investment Platform." />
      </Head>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Invest Smarter with <span className={styles.highlight}>Mercury</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Your all-in-one platform for multi-asset investment management. 
            Track portfolios, analyze markets, and execute trades with confidence.
          </p>
          <div className={styles.heroCta}>
            <Link href="/auth/login">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/markets">
              <Button variant="outline" size="lg">Explore Markets</Button>
            </Link>
          </div>
        </div>
        <div className={styles.heroImage}>
          <div className={styles.mockChart}>
            <div className={styles.chartLine} />
            <div className={styles.chartDots}>
              {[...Array(5)].map((_, i) => (
                <div key={i} className={styles.chartDot} style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statItem}>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Why Choose Mercury?</h2>
        <p className={styles.sectionSubtitle}>
          Everything you need to manage your investments in one powerful platform
        </p>
        <div className={styles.featureGrid}>
          {features.map((feature, index) => (
            <Card key={index} className={styles.featureCard} hoverable>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <Card variant="elevated" className={styles.ctaCard}>
          <h2>Ready to Start Investing?</h2>
          <p>Join thousands of investors who trust Mercury for their investment needs.</p>
          <Link href="/auth/login">
            <Button size="lg">Create Free Account</Button>
          </Link>
        </Card>
      </section>
    </Layout>
  );
};

export default HomePage;
