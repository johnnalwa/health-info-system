"use client";

import { useState, useEffect, useMemo } from "react";
import { FaEdit, FaTrash, FaSort, FaSortUp, FaSortDown, FaEye } from "react-icons/fa";
import Link from "next/link";
import { Client } from "@/lib/types";

type SortConfig = {
  key: keyof Client;
  direction: 'ascending' | 'descending';
};

export default function ClientList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Optimized data fetching with caching
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchClients = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/client", { 
          signal,
          cache: 'force-cache' // Use Next.js cache
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }
        
        const data = await response.json();
        setClients(data);
        setFilteredClients(data);
        setError(null);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error("Error fetching clients:", err);
          setError("Failed to load clients. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();

    // Cleanup function to abort fetch on unmount
    return () => controller.abort();
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredClients(clients);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = clients.filter(
      (client) =>
        (client.first_name && client.first_name.toLowerCase().includes(term)) ||
        (client.last_name && client.last_name.toLowerCase().includes(term)) ||
        (client.contact_number && client.contact_number.includes(term)) ||
        (client.email && client.email.toLowerCase().includes(term))
    );

    setFilteredClients(filtered);
  }, [searchTerm, clients]);

  // Sorting logic
  const requestSort = (key: keyof Client) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  // Memoized sorted clients to prevent unnecessary re-renders
  const sortedClients = useMemo(() => {
    if (!sortConfig) return filteredClients;
    
    return [...filteredClients].sort((a, b) => {
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
  }, [filteredClients, sortConfig]);

  // Helper to get sort icon
  const getSortIcon = (key: keyof Client) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <FaSort className="ml-1 text-gray-400" />;
    }
    return sortConfig.direction === 'ascending' ? 
      <FaSortUp className="ml-1 text-blue-600" /> : 
      <FaSortDown className="ml-1 text-blue-600" />;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Search bar */}
      <div className="p-4 border-b">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, phone, or email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('first_name')}
              >
                <div className="flex items-center">
                  First Name {getSortIcon('first_name')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('last_name')}
              >
                <div className="flex items-center">
                  Last Name {getSortIcon('last_name')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('email')}
              >
                <div className="flex items-center">
                  Email {getSortIcon('email')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('contact_number')}
              >
                <div className="flex items-center">
                  Phone {getSortIcon('contact_number')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedClients.length > 0 ? (
              sortedClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{client.first_name || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{client.last_name || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{client.email || "—"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{client.contact_number || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link href={`/clients/${client.id}`} className="text-blue-600 hover:text-blue-900">
                        <FaEye title="View Details" />
                      </Link>
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <FaEdit title="Edit" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <FaTrash title="Delete" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">
                  No clients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}