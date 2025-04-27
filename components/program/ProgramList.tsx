"use client";

import { useState, useEffect, useMemo } from "react";
import { FaSort, FaSortUp, FaSortDown, FaHospitalAlt } from "react-icons/fa";
import { Program } from "@/lib/types";

interface ProgramListProps {
  searchTerm?: string;
  sortField?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (field: string) => void;
}

export default function ProgramList({ 
  searchTerm = "", 
  sortField = "name", 
  sortDirection = "asc",
  onSort
}: ProgramListProps) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch programs data with optimized fetching
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchPrograms = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/program", { 
          signal,
          cache: 'no-store' // Don't cache to ensure fresh data
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
        if (!signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchPrograms();

    // Cleanup function to abort fetch on unmount
    return () => controller.abort();
  }, []);

  // Handle local sorting if no external handler provided
  const handleSort = (field: keyof Program) => {
    if (onSort) {
      onSort(field);
    }
  };

  // Get filtered and sorted programs
  const filteredAndSortedPrograms = useMemo(() => {
    // First filter by search term
    let filteredPrograms = programs;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredPrograms = programs.filter(
        (program) =>
          (program.name?.toLowerCase().includes(term) || false) ||
          (program.description?.toLowerCase().includes(term) || false) ||
          (program.status?.toLowerCase().includes(term) || false)
      );
    }
    
    // Then sort
    return [...filteredPrograms].sort((a, b) => {
      const aValue = a[sortField as keyof Program] || '';
      const bValue = b[sortField as keyof Program] || '';
      
      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [programs, searchTerm, sortField, sortDirection]);

  // Helper to get sort icon
  const getSortIcon = (key: keyof Program) => {
    if (sortField !== key) {
      return <FaSort className="ml-1 text-gray-400" />;
    }
    return sortDirection === 'asc' ? 
      <FaSortUp className="ml-1 text-green-600" /> : 
      <FaSortDown className="ml-1 text-green-600" />;
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      ) : filteredAndSortedPrograms.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg text-center">
          <p className="text-gray-500">
            {searchTerm ? "No programs match your search criteria." : "No programs found. Create your first program using the button above."}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Name {getSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('description')}
                  >
                    <div className="flex items-center">
                      Description {getSortIcon('description')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status {getSortIcon('status')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedPrograms.map((program) => (
                  <tr key={program.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                          <FaHospitalAlt className="h-4 w-4" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{program.name}</div>
                        </div>
                      </div>
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
    </>
  );
}