import { useState, useEffect, useCallback } from 'react';

interface RememberMeCheckboxProps {
  value: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  showValidation?: boolean;
  className?: string;
}

export default function RememberMeCheckbox({
  value,
  onChange,
  disabled = false,
  required = false,
  showValidation = false,
  className = '',
}: RememberMeCheckboxProps) {
  const [error, setError] = useState<string>('');
  const [touched, setTouched] = useState(false);

  // Validation logic
  const validate = useCallback((checked: boolean): boolean => {
    if (required && !checked) {
      setError('You must accept to remember your session');
      return false;
    }
    setError('');
    return true;
  }, [required]);

  // Validate on change if touched or showValidation is true
  useEffect(() => {
    if (touched || showValidation) {
      validate(value);
    }
  }, [value, touched, showValidation, validate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setTouched(true);
    onChange(checked);
    
    // Validate immediately on change
    if (touched || showValidation) {
      validate(checked);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    validate(value);
  };

  return (
    <div className={className}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="rememberMe"
            name="rememberMe"
            type="checkbox"
            checked={value}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            className={`h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded transition-colors ${
              error ? 'border-red-500' : ''
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'rememberMe-error' : undefined}
          />
        </div>
        <div className="ml-2 text-sm">
          <label
            htmlFor="rememberMe"
            className={`font-medium ${
              disabled
                ? 'text-gray-400 cursor-not-allowed'
                : error
                ? 'text-red-700'
                : 'text-gray-700 cursor-pointer'
            }`}
          >
            Remember me
          </label>
          {required && (
            <span className="ml-1 text-red-500" aria-label="required">
              *
            </span>
          )}
          {error && (
            <p
              id="rememberMe-error"
              className="mt-1 text-sm text-red-600"
              role="alert"
            >
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
