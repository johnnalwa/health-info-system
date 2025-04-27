"use client";

import { useState } from "react";
import { 
  FaHospitalAlt, 
  FaPlusCircle, 
  FaSearch,
  FaFilter,
  FaSortAmountDown
} from "react-icons/fa";
import ProgramList from "@/components/program/ProgramList";
import ProgramForm from "@/components/program/ProgramForm";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function ProgramsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSuccess = () => {
    setIsModalOpen(false);
  };

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FaHospitalAlt className="text-green-600 text-2xl mr-3" />
              <h1 className="text-2xl font-bold text-gray-800">Health Programs</h1>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
            >
              <FaPlusCircle className="mr-2" />
              Add New Program
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
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Search programs by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="ml-4 flex space-x-2">
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  <FaFilter className="mr-2" />
                  Filters
                </button>
                <button 
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  onClick={() => handleSort("name")}
                >
                  <FaSortAmountDown className="mr-2" />
                  Sort
                </button>
              </div>
            </div>
          </div>
        </div>

        <ProgramList 
          searchTerm={searchTerm} 
          sortField={sortField} 
          sortDirection={sortDirection} 
          onSort={handleSort}
        />

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
              <div className="flex items-center justify-between mb-4 pb-2 border-b">
                <div className="flex items-center">
                  <FaHospitalAlt className="text-green-600 mr-2 text-xl" />
                  <h2 className="text-xl font-bold">Add New Program</h2>
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
              <ProgramForm onSuccess={handleSuccess} onCancel={() => setIsModalOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
