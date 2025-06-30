import AcmeLogo from '@/app/ui/acme-logo';
import SignUpForm from '../ui/signup-form';
import { Suspense } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Sign up for an account',
};
 
export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-center justify-center rounded-lg bg-black p-3 md:h-36">
          <div className="w-32 text-white md:w-36 flex justify-center items-center">
            <AcmeLogo />
          </div>
        </div>
        <Suspense>
          <SignUpForm />
        </Suspense>
      </div>
    </main>
  );
}