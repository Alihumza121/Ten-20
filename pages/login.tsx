import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import Head from 'next/head';
import RememberMeCheckbox from '@/components/RememberMeCheckbox';
import EmailInput from '@/components/EmailInput';
import PasswordInput from '@/components/PasswordInput';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRememberMeChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      rememberMe: checked,
    }));
  };

  return (
    <>
      <Head>
        <title>Login - ticktock</title>
      </Head>
      <div className="min-h-screen flex">
        {/* Left side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center lg:p-[72px] p-[32px] bg-white">
          <div className="w-full">
              <h1 className="text-[20px] font-bold text-gray-900 mb-5">
                Welcome back
              </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <EmailInput
                id="email"
                name="email"
                value={formData.email}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, email: value }))
                }
                disabled={isLoading}
                required={true}
                showValidation={false}
              />

              <PasswordInput
                id="password"
                name="password"
                value={formData.password}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, password: value }))
                }
                disabled={isLoading}
                required={true}
                showValidation={false}
              />

              <RememberMeCheckbox
                value={formData.rememberMe}
                onChange={handleRememberMeChange}
                disabled={isLoading}
                required={false}
                showValidation={false}
              />

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="mt-6 text-sm text-gray-600">
              <p>Demo credentials:</p>
              <p className="mt-1 font-mono text-xs bg-gray-50 p-2 rounded">
                Email: john.doe@example.com<br />
                Password: password123
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Branding */}
        <div className="flex-1 items-center justify-center bg-blue-500 lg:p-[72px] p-[32px] hidden md:flex">
        <div className="w-full text-left text-white">
          <h1 className="mb-3 text-[40px] leading-[150%] font-normal text-white lowercase">ticktock</h1>
          <p className="text-[16px] font-normal leading-[150%]">
            Introducing ticktock, our cutting-edge timesheet web application designed to revolutionize how you manage employee work hours. With ticktock, you can effortlessly track and monitor employee attendance and productivity from anywhere, anytime, using any internet-connected device.
          </p>
        </div>
      </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
