import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TimesheetEntryModal from '@/components/TimesheetEntryModal';

describe('TimesheetEntryModal', () => {
  const mockOnClose = jest.fn();
  const timesheetId = '1';

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('renders the modal with all fields', () => {
    render(
      <TimesheetEntryModal
        timesheetId={timesheetId}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Add New Entry')).toBeInTheDocument();
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Select Project/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Type of Work/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Task description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Hours/i)).toBeInTheDocument();
  });

  it('displays validation errors for empty required fields', async () => {
    render(
      <TimesheetEntryModal
        timesheetId={timesheetId}
        onClose={mockOnClose}
      />
    );

    const submitButton = screen.getByText('Add entry');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Date is required')).toBeInTheDocument();
      expect(screen.getByText('Project is required')).toBeInTheDocument();
      expect(screen.getByText('Type of work is required')).toBeInTheDocument();
    });
  });

  it('validates description length', async () => {
    render(
      <TimesheetEntryModal
        timesheetId={timesheetId}
        onClose={mockOnClose}
      />
    );

    const descriptionInput = screen.getByLabelText(/Task description/i);
    fireEvent.change(descriptionInput, { target: { value: 'abc' } });

    const submitButton = screen.getByText('Add entry');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Description must be at least 5 characters')
      ).toBeInTheDocument();
    });
  });

  it('validates hours range', async () => {
    render(
      <TimesheetEntryModal
        timesheetId={timesheetId}
        onClose={mockOnClose}
      />
    );

    const hoursInput = screen.getByLabelText(/Hours/i);
    fireEvent.change(hoursInput, { target: { value: '25' } });

    const submitButton = screen.getByText('Add entry');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Hours must be between 0.5 and 24')
      ).toBeInTheDocument();
    });
  });

  it('calls onClose when cancel button is clicked', () => {
    render(
      <TimesheetEntryModal
        timesheetId={timesheetId}
        onClose={mockOnClose}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledWith(false);
  });

  it('increments hours when + button is clicked', () => {
    render(
      <TimesheetEntryModal
        timesheetId={timesheetId}
        onClose={mockOnClose}
      />
    );

    const hoursInput = screen.getByLabelText(/Hours/i) as HTMLInputElement;
    const incrementButton = screen.getByText('+');

    expect(hoursInput.value).toBe('1');

    fireEvent.click(incrementButton);
    expect(hoursInput.value).toBe('2');
  });

  it('decrements hours when - button is clicked', () => {
    render(
      <TimesheetEntryModal
        timesheetId={timesheetId}
        onClose={mockOnClose}
      />
    );

    const hoursInput = screen.getByLabelText(/Hours/i) as HTMLInputElement;
    const decrementButton = screen.getByText('−');

    // Set initial value to 2
    fireEvent.change(hoursInput, { target: { value: '2' } });
    expect(hoursInput.value).toBe('2');

    fireEvent.click(decrementButton);
    expect(hoursInput.value).toBe('1');
  });
});
