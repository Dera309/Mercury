import React from 'react';
import styles from './Loader.module.css';

interface LoaderProps {
    size?: 'small' | 'medium' | 'large';
    variant?: 'spinner' | 'dots';
    text?: string;
    fullscreen?: boolean;
}

interface SkeletonProps {
    variant?: 'text' | 'card' | 'avatar';
    width?: string | number;
    height?: string | number;
    count?: number;
}

export const Loader: React.FC<LoaderProps> = ({
    size = 'medium',
    variant = 'spinner',
    text,
    fullscreen = false,
}) => {
    const sizeClass = size === 'small'
        ? styles.spinnerSmall
        : size === 'large'
            ? styles.spinnerLarge
            : '';

    return (
        <div className={`${styles.loader} ${fullscreen ? styles.loaderFullscreen : ''}`}>
            {variant === 'spinner' ? (
                <div className={`${styles.spinner} ${sizeClass}`} />
            ) : (
                <div className={styles.pulsingDots}>
                    <div className={styles.dot} />
                    <div className={styles.dot} />
                    <div className={styles.dot} />
                </div>
            )}
            {text && <span className={styles.loaderText}>{text}</span>}
        </div>
    );
};

export const Skeleton: React.FC<SkeletonProps> = ({
    variant = 'text',
    width,
    height,
    count = 1,
}) => {
    const variantClass =
        variant === 'text'
            ? styles.skeletonText
            : variant === 'card'
                ? styles.skeletonCard
                : styles.skeletonAvatar;

    const style: React.CSSProperties = {
        width: width ?? (variant === 'text' ? '100%' : undefined),
        height: height,
    };

    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className={`${styles.skeleton} ${variantClass}`}
                    style={style}
                />
            ))}
        </>
    );
};

export const PageLoader: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => (
    <Loader fullscreen variant="spinner" size="large" text={text} />
);

export default Loader;
