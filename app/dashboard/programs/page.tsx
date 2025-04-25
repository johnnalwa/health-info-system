// app/dashboard/programs/page.tsx

"use client";

import { useState, useEffect } from "react";
import ProgramForm from "@/components/program/ProgramForm";
import { Program } from "@/lib/types";

export default function ProgramsPage() {
  const [activeTab, setActiveTab] = useState("view");
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
    setActiveTab("view");
  };

  return (
    <div className="px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Health Programs</h1>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("view")}
              className={`${
                activeTab === "view"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
              View Programs
            </button>
            <button
              onClick={() => setActiveTab("create")}
              className={`${
                activeTab === "create"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
              Create Program
            </button>
          </nav>
        </div>
      </div>

      {activeTab === "view" ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Available Programs</h2>

          {isLoading ? (
            <div className="text-center py-4">Loading programs...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.length > 0 ? (
                programs.map((program) => (
                  <div
                    key={program.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold">{program.name}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          program.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                        {program.status}
                      </span>
                    </div>
                    <p className="text-sm mt-2">{program.description}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-4">
                  No programs available. Create your first program!
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <ProgramForm onSuccess={handleProgramCreated} />
      )}
    </div>
  );
}
