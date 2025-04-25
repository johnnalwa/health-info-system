// app/components/client/ClientProfile.tsx

"use client";

import { useState, useEffect } from "react";
import { ClientWithPrograms, Program } from "@/lib/types";

interface ClientProfileProps {
  clientId: string;
}

export default function ClientProfile({ clientId }: ClientProfileProps) {
  const [client, setClient] = useState<ClientWithPrograms | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availablePrograms, setAvailablePrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [enrollmentNotes, setEnrollmentNotes] = useState("");
  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    const fetchClientData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/client/${clientId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch client data");
        }

        const data = await response.json();
        setClient(data);

        // Fetch available programs
        const programsResponse = await fetch("/api/program");
        if (!programsResponse.ok) {
          throw new Error("Failed to fetch programs");
        }

        const programsData = await programsResponse.json();

        // Filter out programs the client is already enrolled in
        const enrolledProgramIds = new Set(
          data.programs?.map((p: Program) => p.id) || []
        );
        const unenrolledPrograms = programsData.filter(
          (p: Program) => !enrolledProgramIds.has(p.id)
        );

        setAvailablePrograms(unenrolledPrograms);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientData();
  }, [clientId]);

  const handleEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgram) return;

    setIsEnrolling(true);
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

      // Refresh client data
      const refreshResponse = await fetch(`/api/client/${clientId}`);
      if (refreshResponse.ok) {
        const updatedClient = await refreshResponse.json();
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
    } catch (error) {
      console.error("Error enrolling client:", error);
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading client data...</div>;
  }

  if (!client) {
    return <div className="text-center py-8">Client not found</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="border-b pb-4 mb-6">
        <h1 className="text-2xl font-bold">
          {client.first_name} {client.last_name}
        </h1>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">
              Date of Birth:{" "}
              {new Date(client.date_of_birth).toLocaleDateString()}
            </p>
            <p className="text-gray-600">Gender: {client.gender}</p>
            <p className="text-gray-600">Contact: {client.contact_number}</p>
            {client.email && (
              <p className="text-gray-600">Email: {client.email}</p>
            )}
          </div>
          <div>
            <p className="text-gray-600">Address: {client.address}</p>
            {client.medical_history && (
              <p className="text-gray-600">
                Medical History: {client.medical_history}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Enrolled Programs</h2>
        {client.programs && client.programs.length > 0 ? (
          <div className="divide-y">
            {client.programs.map((program) => (
              <div key={program.id} className="py-3">
                <h3 className="font-medium">{program.name}</h3>
                <p className="text-sm text-gray-600">
                  Status: <span className="font-medium">{program.status}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Enrolled:{" "}
                  {new Date(program.enrollment_date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {program.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Not enrolled in any programs</p>
        )}
      </div>

      {availablePrograms.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Enroll in Program</h2>
          <form onSubmit={handleEnrollment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Program
              </label>
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={!selectedProgram || isEnrolling}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300">
                {isEnrolling ? "Enrolling..." : "Enroll Client"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
