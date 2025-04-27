// app/clients/page.tsx
"use client";

import { useState } from "react";
import { 
  FaUserFriends, 
  FaUserPlus, 
  FaSearch,
  FaFilter
} from "react-icons/fa";
import ClientList from "@/components/client/ClientList";
import ClientForm from "@/components/client/ClientForm";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function ClientsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSuccess = () => {
    setIsModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FaUserFriends className="text-blue-600 text-2xl mr-3" />
              <h1 className="text-2xl font-bold text-gray-800">Clients</h1>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
            >
              <FaUserPlus className="mr-2" />
              Add New Client
            </button>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex items-center">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search clients by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="ml-4">
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <FaFilter className="mr-2" />
                  Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        <ClientList searchTerm={searchTerm} />

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
              <div className="flex items-center justify-between mb-4 pb-2 border-b">
                <div className="flex items-center">
                  <FaUserPlus className="text-blue-600 mr-2 text-xl" />
                  <h2 className="text-xl font-bold">Add New Client</h2>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <ClientForm onSuccess={handleSuccess} onCancel={() => setIsModalOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
