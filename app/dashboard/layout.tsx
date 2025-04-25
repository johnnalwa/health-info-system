// app/dashboard/layout.tsx

import { ReactNode } from "react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold">Health Info System</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className="block px-4 py-2 rounded-md hover:bg-blue-50 hover:text-blue-700">
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/clients"
                className="block px-4 py-2 rounded-md hover:bg-blue-50 hover:text-blue-700">
                Clients
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/programs"
                className="block px-4 py-2 rounded-md hover:bg-blue-50 hover:text-blue-700">
                Programs
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-lg font-semibold text-gray-900">
              Health Information System
            </h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
