"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaUsers, FaHospital, FaCalendarAlt, FaCode } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
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
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <FaCalendarAlt className="text-xl" />
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
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-3">Clients</h3>
            <p className="text-gray-600 mb-4">View, add, and manage client information</p>
            <div className="flex space-x-3">
              <Link href="/clients" className="text-blue-600 hover:text-blue-800 font-medium">
                View All
              </Link>
              <button
                onClick={() => setIsClientModalOpen(true)}
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                <IoMdAdd className="mr-1" /> Add New
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-3">Programs</h3>
            <p className="text-gray-600 mb-4">Manage health programs and services</p>
            <div className="flex space-x-3">
              <Link href="/programs" className="text-blue-600 hover:text-blue-800 font-medium">
                View All
              </Link>
              <button
                onClick={() => setIsProgramModalOpen(true)}
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                <IoMdAdd className="mr-1" /> Add New
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-3">Enrollments</h3>
            <p className="text-gray-600 mb-4">Manage client program enrollments</p>
            <div className="flex space-x-3">
              <Link href="/clients" className="text-blue-600 hover:text-blue-800 font-medium">
                Manage
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-3">API Documentation</h3>
            <p className="text-gray-600 mb-4">Access API endpoints and documentation</p>
            <div className="flex space-x-3">
              <Link href="/api-docs" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                <FaCode className="mr-1" /> View Docs
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Client Modal */}
      {isClientModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg w-full max-w-lg">
            <ClientForm onSuccess={handleClientSuccess} onCancel={() => setIsClientModalOpen(false)} />
          </div>
        </div>
      )}

      {/* Program Modal */}
      {isProgramModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg w-full max-w-lg">
            <ProgramForm onSuccess={handleProgramSuccess} onCancel={() => setIsProgramModalOpen(false)} />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
