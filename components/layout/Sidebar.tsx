"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FaHome, 
  FaUserFriends, 
  FaHospitalAlt, 
  FaClipboardCheck, 
  FaCode,
  FaChartBar
} from "react-icons/fa";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="h-screen w-64 bg-gray-900 text-white fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <FaChartBar className="text-blue-400 text-2xl" />
          <h1 className="text-xl font-bold">Health Info System</h1>
        </div>
      </div>
      <nav className="mt-6">
        <ul className="space-y-2 px-4">
          <li>
            <Link
              href="/"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive("/")
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <FaHome className="mr-3 text-lg" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="/clients"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive("/clients") || pathname?.startsWith("/clients/")
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <FaUserFriends className="mr-3 text-lg" />
              <span>Clients</span>
            </Link>
          </li>
          <li>
            <Link
              href="/programs"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive("/programs")
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <FaHospitalAlt className="mr-3 text-lg" />
              <span>Programs</span>
            </Link>
          </li>
          <li>
            <Link
              href="/api-docs"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive("/api-docs")
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <FaCode className="mr-3 text-lg" />
              <span>API Documentation</span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
        <div className="flex items-center px-4 py-2 text-sm text-gray-400">
          <FaClipboardCheck className="mr-2" />
          <span>Health Info System v1.0</span>
        </div>
      </div>
    </div>
  );
}