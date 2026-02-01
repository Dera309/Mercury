import { Request, Response, NextFunction } from 'express';

// Input validation types
interface ValidationRule {
    field: string;
    type: 'string' | 'email' | 'password' | 'number';
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    message?: string;
}

// Validate email format
const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Sanitize string input (prevent XSS)
export const sanitizeInput = (input: string): string => {
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
};

// Create validation middleware
export const validate = (rules: ValidationRule[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const errors: string[] = [];

        for (const rule of rules) {
            const value = req.body[rule.field];

            // Check required
            if (rule.required && (value === undefined || value === null || value === '')) {
                errors.push(rule.message || `${rule.field} is required`);
                continue;
            }

            // Skip validation if field is empty and not required
            if (value === undefined || value === null || value === '') {
                continue;
            }

            // Type validations
            switch (rule.type) {
                case 'string':
                    if (typeof value !== 'string') {
                        errors.push(`${rule.field} must be a string`);
                    } else {
                        if (rule.minLength && value.length < rule.minLength) {
                            errors.push(`${rule.field} must be at least ${rule.minLength} characters`);
                        }
                        if (rule.maxLength && value.length > rule.maxLength) {
                            errors.push(`${rule.field} must be at most ${rule.maxLength} characters`);
                        }
                    }
                    break;

                case 'email':
                    if (typeof value !== 'string' || !isValidEmail(value)) {
                        errors.push(`${rule.field} must be a valid email address`);
                    }
                    break;

                case 'password':
                    if (typeof value !== 'string') {
                        errors.push(`${rule.field} must be a string`);
                    } else {
                        if (value.length < 8) {
                            errors.push(`${rule.field} must be at least 8 characters`);
                        }
                        if (!/[A-Z]/.test(value)) {
                            errors.push(`${rule.field} must contain at least one uppercase letter`);
                        }
                        if (!/[a-z]/.test(value)) {
                            errors.push(`${rule.field} must contain at least one lowercase letter`);
                        }
                        if (!/[0-9]/.test(value)) {
                            errors.push(`${rule.field} must contain at least one number`);
                        }
                    }
                    break;

                case 'number':
                    if (typeof value !== 'number' && isNaN(Number(value))) {
                        errors.push(`${rule.field} must be a number`);
                    }
                    break;
            }

            // Pattern validation
            if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
                errors.push(rule.message || `${rule.field} has invalid format`);
            }
        }

        if (errors.length > 0) {
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors,
            });
            return;
        }

        next();
    };
};

// Pre-built validation rules for common use cases
export const loginValidation = validate([
    { field: 'email', type: 'email', required: true },
    { field: 'password', type: 'string', required: true, minLength: 1 },
]);

export const registerValidation = validate([
    { field: 'email', type: 'email', required: true },
    { field: 'password', type: 'password', required: true },
    { field: 'firstName', type: 'string', required: true, minLength: 1, maxLength: 50 },
    { field: 'lastName', type: 'string', required: true, minLength: 1, maxLength: 50 },
]);
