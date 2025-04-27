// components/client/ClientProfile.tsx

"use client";

import { useState, useEffect } from "react";
import { ClientWithPrograms, Program } from "@/lib/types";
import { FaUser, FaCalendarAlt, FaVenusMars, FaPhone, FaEnvelope, FaMapMarkerAlt, FaNotesMedical, FaCheckCircle } from "react-icons/fa";

interface ClientProfileProps {
  clientId: string;
}

export default function ClientProfile({ clientId }: ClientProfileProps) {
  const [client, setClient] = useState<ClientWithPrograms | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availablePrograms, setAvailablePrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [enrollmentNotes, setEnrollmentNotes] = useState("");
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);

  useEffect(() => {
    const fetchClientData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log(`Fetching client data for ID: ${clientId}`);
        const response = await fetch(`/api/client/${clientId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("API error:", errorData);
          throw new Error(errorData.error || "Failed to fetch client data");
        }

        const data = await response.json();
        console.log("Client data received:", data);
        setClient(data);

        // Fetch available programs
        const programsResponse = await fetch("/api/program");
        if (!programsResponse.ok) {
          throw new Error("Failed to fetch programs");
        }

        const programsData = await programsResponse.json();
        console.log("Available programs:", programsData);

        // Filter out programs the client is already enrolled in
        const enrolledProgramIds = new Set(
          data.programs?.map((p: Program) => p.id) || []
        );
        const unenrolledPrograms = programsData.filter(
          (p: Program) => !enrolledProgramIds.has(p.id)
        );

        setAvailablePrograms(unenrolledPrograms);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (clientId) {
      fetchClientData();
    }
  }, [clientId]);

  const handleEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgram) return;

    setIsEnrolling(true);
    setEnrollmentSuccess(false);
    try {
      console.log("Enrolling client with data:", {
        client_id: clientId,
        program_id: selectedProgram,
        notes: enrollmentNotes,
      });
      
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

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || "Failed to enroll client");
      }

      console.log("Enrollment successful:", responseData);
      setEnrollmentSuccess(true);

      // Refresh client data
      const refreshResponse = await fetch(`/api/client/${clientId}`);
      if (refreshResponse.ok) {
        const updatedClient = await refreshResponse.json();
        console.log("Updated client data:", updatedClient);
        setClient(updatedClient);

        // Update available programs
        const enrolledProgramIds = new Set(
          updatedClient.programs?.map((p: Program) => p.id) || []
        );
        setAvailablePrograms((prev) =>
          prev.filter((p) => !enrolledProgramIds.has(p.id))
        );
      }

      // Reset form
      setSelectedProgram("");
      setEnrollmentNotes("");
    } catch (err) {
      console.error("Error enrolling client:", err);
      setError(err instanceof Error ? err.message : "Failed to enroll client");
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse text-center">
          <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-4"></div>
          <div className="h-4 w-64 bg-gray-200 rounded mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading client data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p className="font-medium">Error loading client</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
        <p className="font-medium">Client not found</p>
        <p className="text-sm">The requested client could not be found in the database.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Client Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 text-white">
        <div className="flex items-center">
          <div className="bg-white/20 p-3 rounded-full mr-4">
            <FaUser className="text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {client.first_name} {client.last_name}
            </h1>
            <p className="text-blue-100">Client Profile</p>
          </div>
        </div>
      </div>

      {/* Client Details */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-3">
            <div className="flex items-center">
              <FaCalendarAlt className="text-gray-400 mr-2" />
              <span className="text-gray-600 mr-2">Date of Birth:</span>
              <span className="font-medium">
                {client.date_of_birth ? new Date(client.date_of_birth).toLocaleDateString() : 'Not provided'}
              </span>
            </div>
            <div className="flex items-center">
              <FaVenusMars className="text-gray-400 mr-2" />
              <span className="text-gray-600 mr-2">Gender:</span>
              <span className="font-medium">{client.gender || 'Not specified'}</span>
            </div>
            <div className="flex items-center">
              <FaPhone className="text-gray-400 mr-2" />
              <span className="text-gray-600 mr-2">Contact:</span>
              <span className="font-medium">{client.contact_number || 'Not provided'}</span>
            </div>
            {client.email && (
              <div className="flex items-center">
                <FaEnvelope className="text-gray-400 mr-2" />
                <span className="text-gray-600 mr-2">Email:</span>
                <span className="font-medium">{client.email}</span>
              </div>
            )}
          </div>
          <div className="space-y-3">
            <div className="flex items-start">
              <FaMapMarkerAlt className="text-gray-400 mr-2 mt-1" />
              <span className="text-gray-600 mr-2">Address:</span>
              <span className="font-medium">{client.address || 'Not provided'}</span>
            </div>
            {client.medical_history && (
              <div className="flex items-start">
                <FaNotesMedical className="text-gray-400 mr-2 mt-1" />
                <span className="text-gray-600 mr-2">Medical History:</span>
                <span className="font-medium">{client.medical_history}</span>
              </div>
            )}
          </div>
        </div>

        {/* Enrolled Programs */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FaCheckCircle className="text-green-500 mr-2" />
            Enrolled Programs
          </h2>
          {client.programs && client.programs.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {client.programs.map((program) => (
                <div key={program.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-lg text-blue-600">{program.name}</h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">
                      <span className="text-gray-500">Status:</span>{" "}
                      <span className={`font-medium ${program.status === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {program.status}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-500">Enrolled:</span>{" "}
                      <span className="font-medium">
                        {program.enrollment_date ? new Date(program.enrollment_date).toLocaleDateString() : 'Unknown'}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 mt-2">{program.description}</p>
                    {program.notes && (
                      <p className="text-sm mt-2 italic border-t pt-2">
                        <span className="text-gray-500">Notes:</span> {program.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-gray-500">Not enrolled in any programs</p>
            </div>
          )}
        </div>

        {/* Enrollment Form */}
        {availablePrograms.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Enroll in Program</h2>
            
            {enrollmentSuccess && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                <p className="font-medium">Enrollment Successful</p>
                <p className="text-sm">Client has been successfully enrolled in the program.</p>
              </div>
            )}
            
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="font-medium">Enrollment Failed</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleEnrollment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Program
                </label>
                <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select a program</option>
                  {availablePrograms.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notes (Optional)
                </label>
                <textarea
                  value={enrollmentNotes}
                  onChange={(e) => setEnrollmentNotes(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add any notes about this enrollment"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={!selectedProgram || isEnrolling}
                  className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex items-center justify-center">
                  {isEnrolling ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enrolling...
                    </>
                  ) : (
                    "Enroll Client"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
