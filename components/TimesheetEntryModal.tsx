import { useState, useEffect } from 'react';
import { TimesheetEntry } from '@/lib/mock-data';

interface TimesheetEntryModalProps {
  timesheetId: string;
  entry?: TimesheetEntry | null;
  initialDate?: string;
  onClose: (shouldRefresh: boolean) => void;
}

interface FormData {
  projectName: string;
  typeOfWork: string;
  description: string;
  hours: string;
}

interface FormErrors {
  projectName?: string;
  typeOfWork?: string;
  description?: string;
  hours?: string;
}

export default function TimesheetEntryModal({
  timesheetId,
  entry,
  initialDate,
  onClose,
}: TimesheetEntryModalProps) {
  const [formData, setFormData] = useState<FormData>({
    projectName: entry?.projectName || '',
    typeOfWork: entry?.typeOfWork || '',
    description: entry?.description || '',
    hours: entry?.hours.toString() || '1',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState<string[]>([]);
  const [workTypes, setWorkTypes] = useState<string[]>([]);

  useEffect(() => {
    fetchProjectsAndWorkTypes();
  }, []);

  const fetchProjectsAndWorkTypes = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data.projects);
      setWorkTypes(data.workTypes);
    } catch (err) {
      console.error('Failed to fetch projects and work types:', err);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.projectName) {
      newErrors.projectName = 'Project is required';
    }

    if (!formData.typeOfWork) {
      newErrors.typeOfWork = 'Type of work is required';
    }

    if (!formData.description || formData.description.trim().length < 5) {
      newErrors.description = 'Description must be at least 5 characters';
    }

    const hours = Number(formData.hours);
    if (!formData.hours || isNaN(hours) || hours < 0.5 || hours > 24) {
      newErrors.hours = 'Hours must be between 0.5 and 24';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const url = `/api/timesheets/${timesheetId}/entries`;
      const method = entry ? 'PUT' : 'POST';
      const body = entry
        ? {
            entryId: entry.id,
            date: entry.date, // Keep existing date when editing
            ...formData,
            hours: Number(formData.hours),
          }
        : {
            date: initialDate || new Date().toISOString().split('T')[0], // Use initialDate or today
            ...formData,
            hours: Number(formData.hours),
          };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Failed to save entry');
      }

      onClose(true);
    } catch (err) {
      alert('Failed to save entry. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIncrement = () => {
    const currentHours = Number(formData.hours) || 0;
    if (currentHours < 24) {
      setFormData((prev) => ({
        ...prev,
        hours: (currentHours + 1).toString(),
      }));
    }
  };

  const handleDecrement = () => {
    const currentHours = Number(formData.hours) || 0;
    if (currentHours > 0.5) {
      setFormData((prev) => ({
        ...prev,
        hours: (currentHours - 1).toString(),
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={() => onClose(false)}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-[646px] sm:w-full">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="bg-white p-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {entry ? 'Edit Entry' : 'Add New Entry'}
                </h3>
                <button
                  type="button"
                  onClick={() => onClose(false)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="bg-white p-5  space-y-4">
              {/* Select Project */}
              <div className="lg:max-w-[364px] w-full"> 
                <label
                  htmlFor="projectName"
                  className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2"
                >
                  Select Project <span className="text-grar-900">*</span>
                  <i className="fas fa-info-circle text-gray-400 text-xs cursor-help" title="Select the project for this timesheet entry"></i>
                </label>
                <div className="input-field  relative !py-0">
                  <select
                    id="projectName"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleChange}
                    className={`appearance-none h-[42px] bg-transparent w-full text-gray-500 text-[14px] ${
                      errors.projectName
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                    }`}
                    disabled={isSubmitting}
                  >
                    <option value="">Project Name</option>
                    {projects.map((project) => (
                      <option key={project} value={project}>
                        {project}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <i className="fas fa-chevron-down text-gray-500 text-sm"></i>
                  </div>
                </div>
                {errors.projectName && (
                  <p className="mt-1 text-sm text-red-600">{errors.projectName}</p>
                )}
              </div>

              {/* Type of Work */}
              <div className="lg:max-w-[364px] w-full">
                <label
                  htmlFor="typeOfWork"
                  className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2"
                >
                  Type of Work <span className="text-gray-900">*</span>
                  <i className="fas fa-info-circle text-gray-400 text-xs cursor-help" title="Select the type of work performed"></i>
                </label>
                <div className="input-field  relative !py-0">
                  <select
                    id="typeOfWork"
                    name="typeOfWork"
                    value={formData.typeOfWork}
                    onChange={handleChange}
                    className={`appearance-none h-[42px] bg-transparent w-full text-gray-500 text-[14px] ${
                      errors.typeOfWork
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                    }`}
                    disabled={isSubmitting}
                  >
                    <option value="">Select work type</option>
                    {workTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <i className="fas fa-chevron-down text-gray-500 text-sm"></i>
                  </div>
                </div>
                {errors.typeOfWork && (
                  <p className="mt-1 text-sm text-red-600">{errors.typeOfWork}</p>
                )}
              </div>

              {/* Task Description */}
              <div className="lg:max-w-[494px] w-full">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Task description <span className="text-gray-900">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write text here ..."
                  className={`w-full  min-h-[163px] p-[12px_16px] border text-gray-500 border-gray-300 rounded-[8px] text-[14px] transition-colors duration-150 focus:outline-none focus:ring-3 placeholder-gray-400 resize-none ${
                    errors.description
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  A note for extra info
                </p>
              </div>

              {/* Hours */}
              <div className="lg:max-w-[113px] w-full">
                <label
                  htmlFor="hours"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Hours <span className="text-gray-900">*</span>
                </label>
                <div className={`flex items-center border rounded-[12px] overflow-hidden bg-gray-100 ${
                  errors.hours
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}>
                  <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={isSubmitting || Number(formData.hours) <= 0.5}
                    className="w-[34px] flex-none h-[37px] leading-[13px] flex items-center justify-center bg-transparent hover:bg-gray-100 text-gray-900 font-bold disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none border-r border-gray-300 transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    id="hours"
                    name="hours"
                    min="0.5"
                    max="24"
                    step="0.5"
                    value={formData.hours}
                    onChange={handleChange}
                    className={`flex-1 h-[37px] w-[50px] p-0 appearance-none text-center text-[14px] text-gray-500 !bg-[rgba(169,169,169,0)] focus:outline-none focus:bg-white transition-colors border-0 ${
                      errors.hours ? 'text-red-500' : ''
                    }`}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={handleIncrement}
                    disabled={isSubmitting || Number(formData.hours) >= 24}
                    className="w-[34px] flex-none h-[37px] leading-[13px] flex items-center justify-center bg-transparent hover:bg-gray-100 text-gray-900 font-bold disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none border-l border-gray-300 transition-colors"
                  >
                    +
                  </button>
                </div>
                {errors.hours && (
                  <p className="mt-1 text-sm text-red-600">{errors.hours}</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className=" p-5 border-t border-gray-200 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
             
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
              >
                {isSubmitting
                  ? 'Saving...'
                  : entry
                  ? 'Update entry'
                  : 'Add entry'}
              </button>
              <button
                type="button"
                onClick={() => onClose(false)}
                disabled={isSubmitting}
                className="px-4 py-2 flex-1 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
