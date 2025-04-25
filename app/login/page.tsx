import React from "react";

import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Health Information System</h1>
          <p className="mt-2 text-gray-600">Sign in to access the dashboard</p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
