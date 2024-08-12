import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Button = ({
    children,
    onClick = () => { },
    type = 'button',
    className = '',
    variant = 'default',
    disabled = false,
    as: Component = 'button',
    ...props
}) => {
    const { isDarkMode } = useTheme();

    const baseStyles = 'px-6 py-3 rounded-lg transition inline-flex items-center justify-center font-semibold';

    const variants = {
        primary: isDarkMode ? 'bg-main-accent text-white hover:bg-main-accent-dark' : 'bg-main-accent text-white hover:bg-main-accent-dark',
        secondary: isDarkMode ? 'bg-dark-surface text-dark-textPrimary border-dark-border hover:bg-dark-hover' : 'bg-light-surface text-light-textPrimary border-light-border hover:bg-light-hover',
        danger: 'bg-red-500 text-white hover:bg-red-600',
        default: isDarkMode ? 'bg-dark-background text-dark-textPrimary hover:bg-dark-hover' : 'bg-light-background text-light-textPrimary hover:bg-light-hover',
        back: isDarkMode ? 'bg-dark-muted text-dark-textPrimary hover:bg-dark-hover hover:text-dark-textSecondary' : 'bg-light-muted text-light-textPrimary hover:bg-light-hover hover:text-light-textSecondary',
    };

    const disabledStyles = 'bg-gray-300 text-gray-600 cursor-not-allowed';

    return (
        <Component
            onClick={onClick}
            type={type}
            className={`${baseStyles} ${disabled ? disabledStyles : variants[variant]} ${className}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </Component>
    );
};

export default Button;
