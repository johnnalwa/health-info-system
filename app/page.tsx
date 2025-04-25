// app/page.tsx

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Health Information System
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Manage clients and health programs efficiently
        </p>

        <Link
          href="/dashboard"
          className="inline-block bg-blue-600 text-white font-medium py-3 px-6 rounded-md hover:bg-blue-700 transition duration-200">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
