import { render, screen, fireEvent } from '@testing-library/react';
import RememberMeCheckbox from '@/components/RememberMeCheckbox';

describe('RememberMeCheckbox', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the checkbox with label', () => {
    render(
      <RememberMeCheckbox value={false} onChange={mockOnChange} />
    );

    expect(screen.getByLabelText('Remember me')).toBeInTheDocument();
    expect(screen.getByText('Keep me signed in for 30 days')).toBeInTheDocument();
  });

  it('calls onChange when checkbox is clicked', () => {
    render(
      <RememberMeCheckbox value={false} onChange={mockOnChange} />
    );

    const checkbox = screen.getByLabelText('Remember me');
    fireEvent.click(checkbox);

    expect(mockOnChange).toHaveBeenCalledWith(true);
  });

  it('shows checked state when value is true', () => {
    render(
      <RememberMeCheckbox value={true} onChange={mockOnChange} />
    );

    const checkbox = screen.getByLabelText('Remember me') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it('shows unchecked state when value is false', () => {
    render(
      <RememberMeCheckbox value={false} onChange={mockOnChange} />
    );

    const checkbox = screen.getByLabelText('Remember me') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });

  it('disables checkbox when disabled prop is true', () => {
    render(
      <RememberMeCheckbox value={false} onChange={mockOnChange} disabled={true} />
    );

    const checkbox = screen.getByLabelText('Remember me') as HTMLInputElement;
    expect(checkbox.disabled).toBe(true);
  });

  it('shows required indicator when required prop is true', () => {
    render(
      <RememberMeCheckbox value={false} onChange={mockOnChange} required={true} />
    );

    const requiredIndicator = screen.getByText('*');
    expect(requiredIndicator).toBeInTheDocument();
  });

  it('shows validation error when required and unchecked', () => {
    render(
      <RememberMeCheckbox
        value={false}
        onChange={mockOnChange}
        required={true}
        showValidation={true}
      />
    );

    expect(
      screen.getByText('You must accept to remember your session')
    ).toBeInTheDocument();
  });

  it('does not show error when required but checked', () => {
    render(
      <RememberMeCheckbox
        value={true}
        onChange={mockOnChange}
        required={true}
        showValidation={true}
      />
    );

    expect(
      screen.queryByText('You must accept to remember your session')
    ).not.toBeInTheDocument();
  });

  it('validates on blur when touched', () => {
    render(
      <RememberMeCheckbox
        value={false}
        onChange={mockOnChange}
        required={true}
      />
    );

    const checkbox = screen.getByLabelText('Remember me');
    fireEvent.blur(checkbox);

    expect(
      screen.getByText('You must accept to remember your session')
    ).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <RememberMeCheckbox
        value={false}
        onChange={mockOnChange}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has proper accessibility attributes when error exists', () => {
    render(
      <RememberMeCheckbox
        value={false}
        onChange={mockOnChange}
        required={true}
        showValidation={true}
      />
    );

    const checkbox = screen.getByLabelText('Remember me');
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    expect(checkbox).toHaveAttribute('aria-describedby', 'rememberMe-error');
  });
});
