import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
}

export function Button({ children, className = '', variant = 'primary', ...rest }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-md transition-colors ${
        variant === 'primary' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'border border-gray-300 hover:bg-gray-100'
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
