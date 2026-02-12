import TextInput from './TextInput';

interface PasswordInputProps {
  id?: string;
  name?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  showValidation?: boolean;
  error?: string;
  className?: string;
}

export default function PasswordInput({
  id = 'password',
  name = 'password',
  label = 'Password',
  value,
  onChange,
  placeholder = '••••••••••',
  required = true,
  disabled = false,
  showValidation = false,
  error,
  className = '',
}: PasswordInputProps) {
  return (
    <TextInput
      id={id}
      name={name}
      type="password"
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      showValidation={showValidation}
      error={error}
      className={className}
      autoComplete="current-password"
    />
  );
}
