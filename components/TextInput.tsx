import { useState, useEffect, useCallback } from 'react';

interface TextInputProps {
  id: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search';
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  showValidation?: boolean;
  error?: string;
  className?: string;
  autoComplete?: string;
}

export default function TextInput({
  id,
  name,
  type = 'text',
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  showValidation = false,
  error: externalError,
  className = '',
  autoComplete,
}: TextInputProps) {
  const [internalError, setInternalError] = useState<string>('');
  const [touched, setTouched] = useState(false);

  // Validation logic
  const validate = useCallback(
    (inputValue: string): boolean => {
      // Clear previous errors
      setInternalError('');

      // Required validation
      if (required && !inputValue.trim()) {
        setInternalError(`${label} is required`);
        return false;
      }

      // Email validation
      if (type === 'email' && inputValue.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(inputValue)) {
          setInternalError('Please enter a valid email address');
          return false;
        }
      }

      // Password validation
      if (type === 'password' && inputValue.trim() && inputValue.length < 6) {
        setInternalError('Password must be at least 6 characters');
        return false;
      }

      return true;
    },
    [label, type, required]
  );

  // Validate on change if touched or showValidation is true
  useEffect(() => {
    if (touched || showValidation) {
      validate(value);
    }
  }, [value, touched, showValidation, validate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setTouched(true);
    onChange(newValue);

    // Validate immediately on change if touched
    if (touched || showValidation) {
      validate(newValue);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    validate(value);
  };

  // Use external error if provided, otherwise use internal error
  const displayError = externalError || internalError;
  const hasError = (touched || showValidation) && displayError;

  // Base CSS classes
  const baseClasses =
    'w-full h-[42px] p-[12px_16px] border text-gray-500 border-gray-300 rounded-[8px] text-[14px] transition-colors duration-150 focus:outline-none focus:ring-3 placeholder-gray-400';
  
  // State classes based on error
  const stateClasses = hasError
    ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100';

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className={`block text-sm font-medium mb-2 ${
          disabled
            ? 'text-gray-400'
            : hasError
            ? 'text-red-700'
            : 'text-gray-700'
        }`}
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`${baseClasses} ${stateClasses} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={hasError ? `${id}-error` : undefined}
      />
      {hasError && (
        <p
          id={`${id}-error`}
          className="mt-1 text-sm text-red-600"
          role="alert"
        >
          {displayError}
        </p>
      )}
    </div>
  );
}
