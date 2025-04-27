"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Program } from "@/lib/types";
import Link from "next/link";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";

export default function EnrollClientPage({ params }: { params: { id: string } }) {
  const clientId = params.id;
  const router = useRouter();
  const [clientName, setClientName] = useState("");
  const [availablePrograms, setAvailablePrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [enrollmentNotes, setEnrollmentNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch client data
        const clientResponse = await fetch(`/api/client/${clientId}`);
        if (!clientResponse.ok) {
          throw new Error("Failed to fetch client data");
        }
        const clientData = await clientResponse.json();
        setClientName(`${clientData.first_name} ${clientData.last_name}`);

        // Fetch available programs
        const programsResponse = await fetch("/api/program");
        if (!programsResponse.ok) {
          throw new Error("Failed to fetch programs");
        }
        const programsData = await programsResponse.json();

        // Filter out programs the client is already enrolled in
        const enrolledProgramIds = new Set(
          clientData.programs?.map((p: Program) => p.id) || []
        );
        const unenrolledPrograms = programsData.filter(
          (p: Program) => !enrolledProgramIds.has(p.id)
        );

        setAvailablePrograms(unenrolledPrograms);
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [clientId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgram) return;

    setIsSubmitting(true);
    setErrorMessage("");
    
    try {
      const response = await fetch("/api/enrollment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          program_id: selectedProgram,
          notes: enrollmentNotes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to enroll client");
      }

      // Get the program name for the success message
      const program = availablePrograms.find(p => p.id === selectedProgram);
      setSuccessMessage(`Successfully enrolled ${clientName} in ${program?.name}`);
      
      // Remove the enrolled program from available programs
      setAvailablePrograms(prev => prev.filter(p => p.id !== selectedProgram));
      
      // Reset form
      setSelectedProgram("");
      setEnrollmentNotes("");
    } catch (error) {
      console.error("Error enrolling client:", error);
      setErrorMessage("Failed to enroll client. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-2">
            <Link 
              href={`/dashboard/clients/${clientId}`}
              className="flex items-center text-blue-100 hover:text-white mr-4">
              <FaArrowLeft className="mr-2" /> Back to Profile
            </Link>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Enroll Client in Program</h1>
          {clientName && <p className="mt-2 text-blue-100">Client: {clientName}</p>}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p>Loading available programs...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            {successMessage && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center">
                <FaCheckCircle className="mr-2" />
                {successMessage}
              </div>
            )}
            
            {errorMessage && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {errorMessage}
              </div>
            )}

            {availablePrograms.length > 0 ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Program
                  </label>
                  <select
                    value={selectedProgram}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required>
                    <option value="">Select a program</option>
                    {availablePrograms.map((program) => (
                      <option key={program.id} value={program.id}>
                        {program.name} - {program.status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enrollment Notes (Optional)
                  </label>
                  <textarea
                    value={enrollmentNotes}
                    onChange={(e) => setEnrollmentNotes(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add any notes about this enrollment"
                  />
                </div>

                <div className="flex justify-between">
                  <Link
                    href={`/dashboard/clients/${clientId}`}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={!selectedProgram || isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">
                    {isSubmitting ? "Enrolling..." : "Enroll Client"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">This client is already enrolled in all available programs.</p>
                <Link
                  href={`/dashboard/clients/${clientId}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Return to Client Profile
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
