// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import Link from "next/link";
import { FaUserPlus, FaUsers, FaHospital, FaBook, FaChartLine, FaCalendarAlt, FaCode } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import ClientForm from "@/components/client/ClientForm";
import ProgramForm from "@/components/program/ProgramForm";

export default function Home() {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [stats, setStats] = useState({
    clientCount: 0,
    programCount: 0,
    enrollmentCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch statistics from the API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setStats({
            clientCount: data.clientCount,
            programCount: data.programCount,
            enrollmentCount: data.enrollmentCount
          });
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleClientSuccess = () => {
    setIsClientModalOpen(false);
    // Refresh stats after adding a new client
    fetch('/api/stats').then(res => res.json()).then(data => {
      setStats({
        clientCount: data.clientCount,
        programCount: data.programCount,
        enrollmentCount: data.enrollmentCount
      });
    });
  };

  const handleProgramSuccess = () => {
    setIsProgramModalOpen(false);
    // Refresh stats after adding a new program
    fetch('/api/stats').then(res => res.json()).then(data => {
      setStats({
        clientCount: data.clientCount,
        programCount: data.programCount,
        enrollmentCount: data.enrollmentCount
      });
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Health Information System</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl">Manage clients and health programs efficiently with our comprehensive health management platform</p>
        </div>
      </div>

      {/* Stats overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <FaUsers className="text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase font-semibold">Total Clients</p>
                {isLoading ? (
                  <div className="h-8 flex items-center">
                    <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ) : (
                  <p className="text-2xl font-bold">{stats.clientCount}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <FaHospital className="text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase font-semibold">Active Programs</p>
                {isLoading ? (
                  <div className="h-8 flex items-center">
                    <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ) : (
                  <p className="text-2xl font-bold">{stats.programCount}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <FaCalendarAlt className="text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase font-semibold">Enrollments</p>
                {isLoading ? (
                  <div className="h-8 flex items-center">
                    <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ) : (
                  <p className="text-2xl font-bold">{stats.enrollmentCount}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-3">
                    <FaUsers className="text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Clients</h3>
                </div>
                <button 
                  onClick={() => setIsClientModalOpen(true)}
                  className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                  <IoMdAdd className="text-xl" />
                </button>
              </div>
              <p className="text-gray-600 mb-4">Manage client profiles and enrollments</p>
              <Link 
                href="/dashboard/clients"
                className="inline-block text-blue-600 hover:text-blue-800 font-medium">
                View all clients
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600 mr-3">
                    <FaHospital className="text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Programs</h3>
                </div>
                <button 
                  onClick={() => setIsProgramModalOpen(true)}
                  className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
                  <IoMdAdd className="text-xl" />
                </button>
              </div>
              <p className="text-gray-600 mb-4">Create and manage health programs</p>
              <Link 
                href="/dashboard/programs"
                className="inline-block text-green-600 hover:text-green-800 font-medium">
                View all programs
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-3">
                  <FaCode className="text-xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">API Access</h3>
              </div>
              <p className="text-gray-600 mb-4">Access client profiles via our secure API</p>
              <a
                href="/api-docs"
                target="_blank"
                className="inline-block text-purple-600 hover:text-purple-800 font-medium">
                View API Documentation
              </a>
            </div>
          </div>
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
              <Dialog.Title className="text-xl font-bold">Register New Client</Dialog.Title>
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

      {/* Program Creation Modal */}
      <Dialog 
        open={isProgramModalOpen} 
        onClose={() => setIsProgramModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="bg-green-600 text-white py-4 px-6 flex justify-between items-center">
              <Dialog.Title className="text-xl font-bold">Create New Program</Dialog.Title>
              <button 
                onClick={() => setIsProgramModalOpen(false)}
                className="text-white hover:text-green-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <ProgramForm onSuccess={handleProgramSuccess} />
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
