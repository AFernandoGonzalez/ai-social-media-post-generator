import React from 'react';
import { Link } from 'react-router-dom';

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
    const baseStyles = 'px-6 py-3 rounded-lg transition inline-flex items-center justify-center font-semibold';

    const variants = {
        primary: 'bg-black text-white hover:bg-gray-800',
        secondary: 'bg-white text-black border border-black hover:bg-gray-100',
        danger: 'bg-red-500 text-white hover:bg-red-600',
        default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        back: 'bg-gray-100 text-gray-800 hover:bg-gray-900 hover:text-white',
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
