// src/pages/sign-in/[[...index]].tsx

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full  rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back 👋</h1>
        <p className="text-sm text-center text-gray-500 mb-8">
          Sign in to continue to <span className="font-medium text-indigo-600">Email Marketing Dashboard</span>
        </p>

        <div className="border-t border-gray-200 pt-6">
          <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
        </div>
      </div>
    </div>
  );
}
