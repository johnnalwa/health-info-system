// app/dashboard/page.tsx

import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Doctor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/clients"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-bold mb-2">Manage Clients</h2>
          <p className="text-gray-600">
            Register new clients, search and view existing client profiles
          </p>
        </Link>

        <Link
          href="/dashboard/programs"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-bold mb-2">Health Programs</h2>
          <p className="text-gray-600">Create and manage health programs</p>
        </Link>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">API Documentation</h2>
          <p className="text-gray-600 mb-4">
            Access client profiles via our secure API
          </p>
          <a
            href="/api-docs"
            target="_blank"
            className="text-blue-600 hover:underline">
            View API Documentation
          </a>
        </div>
      </div>
    </div>
  );
}
