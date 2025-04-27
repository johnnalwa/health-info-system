"use client";

import { useState, useEffect, useMemo } from "react";
import { FaEdit, FaTrash, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

type Program = {
  id: string;
  name: string;
  description: string;
  status: string;
};

type SortConfig = {
  key: keyof Program;
  direction: 'ascending' | 'descending';
};

export default function ProgramList() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // Optimized data fetching with caching
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchPrograms = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/program", { 
          signal,
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

  // Sorting logic
  const requestSort = (key: keyof Program) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  // Memoized sorted programs to prevent unnecessary re-renders
  const sortedPrograms = useMemo(() => {
    if (!sortConfig) return programs;
    
    return [...programs].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [programs, sortConfig]);

  // Helper to get sort icon
  const getSortIcon = (key: keyof Program) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <FaSort className="ml-1 text-gray-400" />;
    }
    return sortConfig.direction === 'ascending' ? 
      <FaSortUp className="ml-1 text-green-600" /> : 
      <FaSortDown className="ml-1 text-green-600" />;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  if (sortedPrograms.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg text-center">
        <p className="text-gray-500">No programs found. Create your first program using the button above.</p>
      </div>
    );
  }

  return (
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedPrograms.map((program) => (
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
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-900">
                      <FaEdit />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}