import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
};

export function Button({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}: ButtonProps) {
  const baseStyles = 'px-4 py-3 font-medium rounded-lg transition-colors duration-200';
  const widthStyles = fullWidth ? 'w-full' : '';
  
  const variants = {
    primary: 'bg-[#10b981] text-white hover:bg-[#059669]',
    secondary: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100',
  };

  return (
    <button 
      className={`${baseStyles} ${widthStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
