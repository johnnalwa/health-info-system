"use client";

import { useState, useEffect } from "react";
import { IoMdAdd } from "react-icons/io";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProgramForm from "@/components/program/ProgramForm";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

// Define the Program type
interface Program {
  id: string;
  name: string;
  description: string;
  status: string;
  created_at?: string;
}

export default function ProgramsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{key: keyof Program, direction: 'ascending' | 'descending'} | null>(null);
  
  // Fetch programs data with optimized fetching
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchPrograms = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/program", { 
          signal,
          next: { revalidate: 60 }, // Cache for 60 seconds
          cache: 'force-cache' // Use Next.js cache
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch programs");
        }
        
        const data = await response.json();
        setPrograms(data);
        setError(null);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error("Error fetching programs:", err);
          setError("Failed to load programs. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrograms();

    // Cleanup function to abort fetch on unmount
    return () => controller.abort();
  }, []);

  // Handle program creation success
  const handleProgramCreated = () => {
    setIsModalOpen(false);
    // Refetch programs after creation
    fetch("/api/program", { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setPrograms(data))
      .catch(err => console.error("Error refetching programs:", err));
  };

  // Sorting logic
  const requestSort = (key: keyof Program) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  // Get sorted programs
  const getSortedPrograms = () => {
    if (!sortConfig) return programs;
    
    return [...programs].sort((a, b) => {
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';
      
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  // Helper to get sort icon
  const getSortIcon = (key: keyof Program) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <FaSort className="ml-1 text-gray-400" />;
    }
    return sortConfig.direction === 'ascending' ? 
      <FaSortUp className="ml-1 text-green-600" /> : 
      <FaSortDown className="ml-1 text-green-600" />;
  };
  
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Programs</h1>
          <button
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={() => setIsModalOpen(true)}
          >
            <IoMdAdd className="mr-2" /> Create Program
          </button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        ) : programs.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg text-center">
            <p className="text-gray-500">No programs found. Create your first program using the button above.</p>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('name')}
                    >
                      <div className="flex items-center">
                        Name {getSortIcon('name')}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('description')}
                    >
                      <div className="flex items-center">
                        Description {getSortIcon('description')}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('status')}
                    >
                      <div className="flex items-center">
                        Status {getSortIcon('status')}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getSortedPrograms().map((program) => (
                    <tr key={program.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{program.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{program.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          program.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {program.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded shadow-lg w-full max-w-lg">
              <ProgramForm 
                onSuccess={handleProgramCreated} 
                onCancel={() => setIsModalOpen(false)} 
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
