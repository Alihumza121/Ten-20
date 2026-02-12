import TextInput from './TextInput';

interface EmailInputProps {
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

export default function EmailInput({
  id = 'email',
  name = 'email',
  label = 'Email',
  value,
  onChange,
  placeholder = 'name@example.com',
  required = true,
  disabled = false,
  showValidation = false,
  error,
  className = '',
}: EmailInputProps) {
  return (
    <TextInput
      id={id}
      name={name}
      type="email"
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      showValidation={showValidation}
      error={error}
      className={className}
      autoComplete="email"
    />
  );
}
