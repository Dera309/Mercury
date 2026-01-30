import React, { ReactNode, HTMLAttributes } from 'react';
import styles from './Card.module.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  className = '',
  ...props
}) => {
  const cardClasses = [
    styles.card,
    styles[variant],
    styles[`padding-${padding}`],
    hoverable ? styles.hoverable : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: ReactNode;
  action?: ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, action }) => (
  <div className={styles.cardHeader}>
    <div className={styles.cardHeaderContent}>{children}</div>
    {action && <div className={styles.cardHeaderAction}>{action}</div>}
  </div>
);

interface CardTitleProps {
  children: ReactNode;
  subtitle?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, subtitle }) => (
  <div className={styles.cardTitle}>
    <h3>{children}</h3>
    {subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}
  </div>
);

interface CardContentProps {
  children: ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({ children }) => (
  <div className={styles.cardContent}>{children}</div>
);

interface CardFooterProps {
  children: ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children }) => (
  <div className={styles.cardFooter}>{children}</div>
);

export default Card;
