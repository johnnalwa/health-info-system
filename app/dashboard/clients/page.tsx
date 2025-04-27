// app/dashboard/clients/page.tsx

"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { FaUserPlus, FaSearch, FaUsers } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import ClientForm from "@/components/client/ClientForm";
import ClientSearch from "@/components/client/ClientSearch";

export default function ClientsPage() {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);

  const handleClientSuccess = () => {
    setIsClientModalOpen(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center">
              <FaUsers className="mr-3" /> Client Management
            </h1>
            <p className="mt-2 text-blue-100">Search, view and manage client profiles</p>
          </div>
          <button
            onClick={() => setIsClientModalOpen(true)}
            className="flex items-center bg-white text-blue-600 px-4 py-2 rounded-md shadow-sm hover:bg-blue-50 transition-colors">
            <IoMdAdd className="mr-2 text-xl" />
            <span>New Client</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-3">
              <FaSearch className="text-xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Find Clients</h2>
          </div>
          
          <ClientSearch />
        </div>
      </div>

      {/* Client Registration Modal */}
      <Dialog 
        open={isClientModalOpen} 
        onClose={() => setIsClientModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
              <Dialog.Title className="text-xl font-bold flex items-center">
                <FaUserPlus className="mr-2" /> Register New Client
              </Dialog.Title>
              <button 
                onClick={() => setIsClientModalOpen(false)}
                className="text-white hover:text-blue-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <ClientForm onSuccess={handleClientSuccess} />
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
