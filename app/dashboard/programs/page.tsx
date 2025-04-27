// app/dashboard/programs/page.tsx

"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { FaHospital, FaPlusCircle, FaRegClipboard, FaCheckCircle, FaClock } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import ProgramForm from "@/components/program/ProgramForm";
import { Program } from "@/lib/types";

export default function ProgramsPage() {
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPrograms = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/program");
      if (!response.ok) {
        throw new Error("Failed to fetch programs");
      }
      const data = await response.json();
      setPrograms(data);
    } catch (error) {
      console.error("Error fetching programs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleProgramCreated = () => {
    fetchPrograms();
    setIsProgramModalOpen(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center">
              <FaHospital className="mr-3" /> Health Programs
            </h1>
            <p className="mt-2 text-green-100">Create and manage health programs for your clients</p>
          </div>
          <button
            onClick={() => setIsProgramModalOpen(true)}
            className="flex items-center bg-white text-green-600 px-4 py-2 rounded-md shadow-sm hover:bg-green-50 transition-colors">
            <IoMdAdd className="mr-2 text-xl" />
            <span>New Program</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-3">
              <FaRegClipboard className="text-xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Available Programs</h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.length > 0 ? (
                programs.map((program) => (
                  <div
                    key={program.id}
                    className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg">{program.name}</h3>
                      <span
                        className={`flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                          program.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                        {program.status === "active" ? (
                          <>
                            <FaCheckCircle className="mr-1" /> Active
                          </>
                        ) : (
                          <>
                            <FaClock className="mr-1" /> Inactive
                          </>
                        )}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-3">{program.description}</p>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {program.enrollment_count ? `Enrolled: ${program.enrollment_count} clients` : "No enrollments yet"}
                      </span>
                      <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 bg-gray-50 rounded-lg p-8 text-center">
                  <div className="flex flex-col items-center">
                    <FaPlusCircle className="text-gray-400 text-5xl mb-4" />
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No Programs Available</h3>
                    <p className="text-gray-500 mb-4">Create your first health program to get started</p>
                    <button 
                      onClick={() => setIsProgramModalOpen(true)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                      Create Program
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

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
              <Dialog.Title className="text-xl font-bold flex items-center">
                <FaPlusCircle className="mr-2" /> Create New Program
              </Dialog.Title>
              <button 
                onClick={() => setIsProgramModalOpen(false)}
                className="text-white hover:text-green-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <ProgramForm onSuccess={handleProgramCreated} />
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
