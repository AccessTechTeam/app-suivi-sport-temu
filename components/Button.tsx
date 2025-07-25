
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = "w-full text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
  
  const variantClasses = {
    primary: 'bg-brand-primary hover:bg-blue-800 focus:ring-brand-primary',
    secondary: 'bg-brand-secondary hover:bg-blue-600 focus:ring-brand-secondary',
    danger: 'bg-brand-danger hover:bg-red-700 focus:ring-brand-danger',
    ghost: 'bg-transparent text-brand-primary hover:bg-blue-50'
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
