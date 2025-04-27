"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  FaUserFriends, 
  FaHospitalAlt, 
  FaClipboardList, 
  FaBookMedical, 
  FaFileMedicalAlt,
  FaUserPlus,
  FaPlusCircle,
  FaChartLine,
  FaCode
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { Dialog } from "@headlessui/react";
import ClientForm from "@/components/client/ClientForm";
import ProgramForm from "@/components/program/ProgramForm";
import DashboardLayout from "@/components/layout/DashboardLayout";

type Stats = {
  clientCount: number;
  programCount: number;
  enrollmentCount: number;
};

export default function Home() {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [stats, setStats] = useState<Stats>({
    clientCount: 0,
    programCount: 0,
    enrollmentCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/stats", {
          signal: controller.signal,
          cache: 'no-store'
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }
        
        const data = await response.json();
        setStats(data);
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error("Error fetching stats:", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchStats();
    
    return () => {
      controller.abort();
    };
  }, []);

  const handleClientSuccess = () => {
    setIsClientModalOpen(false);
    fetch("/api/stats", { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Error refreshing stats:", err));
  };

  const handleProgramSuccess = () => {
    setIsProgramModalOpen(false);
    fetch("/api/stats", { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Error refreshing stats:", err));
  };

  return (
    <DashboardLayout>
      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-3">
            <MdDashboard className="text-3xl mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold">Health Information System</h1>
          </div>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl">Manage clients and health programs efficiently with our comprehensive health management platform</p>
        </div>
      </div>

      {/* Stats overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <FaUserFriends className="text-2xl" />
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
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <FaHospitalAlt className="text-2xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase font-semibold">Total Programs</p>
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
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-500 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <FaClipboardList className="text-2xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase font-semibold">Total Enrollments</p>
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

      {/* Quick actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <FaChartLine className="text-xl mr-2 text-gray-700" />
          <h2 className="text-2xl font-bold">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-blue-500">
            <div className="flex items-center mb-3">
              <FaUserFriends className="text-xl mr-2 text-blue-600" />
              <h3 className="text-lg font-semibold">Clients</h3>
            </div>
            <p className="text-gray-600 mb-4">View, add, and manage client information</p>
            <div className="flex space-x-3">
              <Link href="/clients" className="text-blue-600 hover:text-blue-800 font-medium flex items-center hover:underline">
                <span>View All</span>
              </Link>
              <button
                onClick={() => setIsClientModalOpen(true)}
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center hover:underline"
              >
                <FaUserPlus className="mr-1" /> Add New
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-green-500">
            <div className="flex items-center mb-3">
              <FaHospitalAlt className="text-xl mr-2 text-green-600" />
              <h3 className="text-lg font-semibold">Programs</h3>
            </div>
            <p className="text-gray-600 mb-4">Manage health programs and services</p>
            <div className="flex space-x-3">
              <Link href="/programs" className="text-green-600 hover:text-green-800 font-medium flex items-center hover:underline">
                <span>View All</span>
              </Link>
              <button
                onClick={() => setIsProgramModalOpen(true)}
                className="text-green-600 hover:text-green-800 font-medium flex items-center hover:underline"
              >
                <FaPlusCircle className="mr-1" /> Add New
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-purple-500">
            <div className="flex items-center mb-3">
              <FaBookMedical className="text-xl mr-2 text-purple-600" />
              <h3 className="text-lg font-semibold">Enrollments</h3>
            </div>
            <p className="text-gray-600 mb-4">Manage client program enrollments</p>
            <div className="flex space-x-3">
              <Link href="/clients" className="text-purple-600 hover:text-purple-800 font-medium flex items-center hover:underline">
                <FaClipboardList className="mr-1" /> Manage
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-indigo-500">
            <div className="flex items-center mb-3">
              <FaFileMedicalAlt className="text-xl mr-2 text-indigo-600" />
              <h3 className="text-lg font-semibold">API Documentation</h3>
            </div>
            <p className="text-gray-600 mb-4">Access API endpoints and documentation</p>
            <div className="flex space-x-3">
              <Link href="/api-docs" className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center hover:underline">
                <FaCode className="mr-1" /> View Docs
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Client Modal */}
      {isClientModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between mb-4 pb-2 border-b">
              <div className="flex items-center">
                <FaUserPlus className="text-blue-600 mr-2 text-xl" />
                <h2 className="text-xl font-bold">Add New Client</h2>
              </div>
              <button 
                onClick={() => setIsClientModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ClientForm onSuccess={handleClientSuccess} onCancel={() => setIsClientModalOpen(false)} />
          </div>
        </div>
      )}

      {/* Program Modal */}
      {isProgramModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between mb-4 pb-2 border-b">
              <div className="flex items-center">
                <FaHospitalAlt className="text-green-600 mr-2 text-xl" />
                <h2 className="text-xl font-bold">Add New Program</h2>
              </div>
              <button 
                onClick={() => setIsProgramModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ProgramForm onSuccess={handleProgramSuccess} onCancel={() => setIsProgramModalOpen(false)} />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
