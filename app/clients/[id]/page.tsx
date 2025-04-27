"use client";

import { useState, useEffect } from "react";
import { Client, Program } from "@/lib/types";
import { FaArrowLeft, FaCalendarPlus } from "react-icons/fa";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const [client, setClient] = useState<Client | null>(null);
  const [enrolledPrograms, setEnrolledPrograms] = useState<Program[]>([]);
  const [availablePrograms, setAvailablePrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const [enrollmentNote, setEnrollmentNote] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        setIsLoading(true);
        // Fetch client details
        const clientResponse = await fetch(`/api/client/${params.id}`);
        if (!clientResponse.ok) {
          throw new Error("Failed to fetch client details");
        }
        const clientData = await clientResponse.json();
        setClient(clientData);

        // Fetch client's enrolled programs
        const enrollmentsResponse = await fetch(`/api/enrollment?clientId=${params.id}`);
        if (enrollmentsResponse.ok) {
          const enrollmentsData = await enrollmentsResponse.json();
          setEnrolledPrograms(enrollmentsData);
        }

        // Fetch all available programs
        const programsResponse = await fetch("/api/program");
        if (programsResponse.ok) {
          const programsData = await programsResponse.json();
          setAvailablePrograms(programsData);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching client details:", err);
        setError("Failed to load client details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientDetails();
  }, [params.id]);

  const handleEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgram) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/enrollment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: params.id,
          program_id: selectedProgram,
          notes: enrollmentNote,
          status: "active",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to enroll client in program");
      }

      // Refresh enrolled programs
      const enrollmentsResponse = await fetch(`/api/enrollment?clientId=${params.id}`);
      if (enrollmentsResponse.ok) {
        const enrollmentsData = await enrollmentsResponse.json();
        setEnrolledPrograms(enrollmentsData);
      }

      setIsEnrollModalOpen(false);
      setSelectedProgram("");
      setEnrollmentNote("");
    } catch (error) {
      console.error("Error enrolling client:", error);
      alert("Failed to enroll client in program. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center p-8 h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !client) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p>{error || "Client not found"}</p>
          </div>
          <div className="mt-4">
            <Link href="/clients" className="text-blue-600 hover:text-blue-800 flex items-center">
              <FaArrowLeft className="mr-2" /> Back to Clients
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Filter out programs the client is already enrolled in
  const notEnrolledPrograms = availablePrograms.filter(
    (program) => !enrolledPrograms.some((enrolled) => enrolled.id === program.id)
  );

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/clients" className="text-blue-600 hover:text-blue-800 mr-4">
              <FaArrowLeft />
            </Link>
            <h1 className="text-2xl font-bold">
              {client.first_name} {client.last_name}
            </h1>
          </div>
          {notEnrolledPrograms.length > 0 && (
            <button
              onClick={() => setIsEnrollModalOpen(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <FaCalendarPlus className="mr-2" /> Enroll in Program
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md col-span-2">
            <h2 className="text-xl font-semibold mb-4">Client Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Full Name</p>
                <p className="font-medium">
                  {client.first_name} {client.last_name}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Date of Birth</p>
                <p className="font-medium">{new Date(client.date_of_birth).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Gender</p>
                <p className="font-medium">{client.gender}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Phone</p>
                <p className="font-medium">{client.contact_number}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Email</p>
                <p className="font-medium">{client.email || "—"}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Address</p>
                <p className="font-medium">{client.address}</p>
              </div>
            </div>
            {client.medical_history && (
              <div className="mt-4">
                <p className="text-gray-500 text-sm">Medical History</p>
                <p className="font-medium">{client.medical_history}</p>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Client Details</h2>
            <div>
              <p className="text-gray-500 text-sm">Client ID</p>
              <p className="font-medium">{client.id}</p>
            </div>
            <div className="mt-4">
              <p className="text-gray-500 text-sm">Registered On</p>
              <p className="font-medium">{new Date(client.created_at).toLocaleDateString()}</p>
            </div>
            <div className="mt-4">
              <p className="text-gray-500 text-sm">Last Updated</p>
              <p className="font-medium">{new Date(client.updated_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Enrolled Programs</h2>
          {enrolledPrograms.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Program Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enrollment Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enrolledPrograms.map((program) => (
                    <tr key={program.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{program.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{program.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            program.enrollment_status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {program.enrollment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {program.enrollment_date
                            ? new Date(program.enrollment_date).toLocaleDateString()
                            : "—"}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">This client is not enrolled in any programs.</p>
          )}
        </div>

        {/* Enrollment Modal */}
        {isEnrollModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded shadow-lg w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4">Enroll in Program</h2>
              <form onSubmit={handleEnrollment}>
                <div className="mb-4">
                  <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Program
                  </label>
                  <select
                    id="program"
                    value={selectedProgram}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select a program</option>
                    {notEnrolledPrograms.map((program) => (
                      <option key={program.id} value={program.id}>
                        {program.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    value={enrollmentNote}
                    onChange={(e) => setEnrollmentNote(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsEnrollModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedProgram}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300"
                  >
                    {isSubmitting ? "Enrolling..." : "Enroll"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
