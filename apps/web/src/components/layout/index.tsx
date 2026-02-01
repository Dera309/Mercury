import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/markets', label: 'Markets' },
  ];

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>💎</span>
            <span className={styles.logoText}>Mercury</span>
          </Link>

          <nav className={styles.nav}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${router.pathname === item.href ? styles.navLinkActive : ''
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={styles.headerActions}>
            {isAuthenticated && user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                  {user.email}
                </span>
                <button
                  onClick={logout}
                  className={styles.loginButton}
                  style={{ cursor: 'pointer' }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link href="/auth/login" className={styles.loginButton}>
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h4>Mercury Investment Platform</h4>
            <p>Your trusted partner for multi-asset investment management.</p>
          </div>
          <div className={styles.footerSection}>
            <h4>Quick Links</h4>
            <Link href="/portfolio">Portfolio</Link>
            <Link href="/markets">Markets</Link>
          </div>
          <div className={styles.footerSection}>
            <h4>Support</h4>
            <Link href="#">Help Center</Link>
            <Link href="#">Contact Us</Link>
          </div>
          <div className={styles.footerSection}>
            <h4>Legal</h4>
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} Mercury Investment Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
