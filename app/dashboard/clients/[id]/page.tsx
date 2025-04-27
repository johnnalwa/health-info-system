// app/dashboard/clients/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaUserPlus, FaArrowLeft, FaCalendarAlt } from "react-icons/fa";
import { ClientWithPrograms, Program } from "@/lib/types";
import ClientProfile from "@/components/client/ClientProfile";

export default function ClientProfilePage({ params }: { params: { id: string } }) {
  const clientId = params.id;
  const router = useRouter();
  const [client, setClient] = useState<ClientWithPrograms | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientData();
  }, [clientId]);

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-2">
            <Link 
              href="/dashboard/clients"
              className="flex items-center text-blue-100 hover:text-white mr-4">
              <FaArrowLeft className="mr-2" /> Back to Clients
            </Link>
          </div>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold">
              {isLoading ? "Loading..." : `${client?.first_name} ${client?.last_name}`}
            </h1>
            <Link
              href={`/dashboard/clients/${clientId}/enroll`}
              className="flex items-center bg-white text-blue-600 px-4 py-2 rounded-md shadow-sm hover:bg-blue-50 transition-colors">
              <FaUserPlus className="mr-2" />
              <span>Enroll in Program</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p>Loading client profile...</p>
          </div>
        ) : client ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Client Information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Client Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">
                      <span className="font-medium">Date of Birth:</span>{" "}
                      {new Date(client.date_of_birth).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Gender:</span> {client.gender}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Contact:</span> {client.contact_number}
                    </p>
                    {client.email && (
                      <p className="text-gray-600">
                        <span className="font-medium">Email:</span> {client.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-gray-600">
                      <span className="font-medium">Address:</span> {client.address}
                    </p>
                    {client.medical_history && (
                      <p className="text-gray-600">
                        <span className="font-medium">Medical History:</span>{" "}
                        {client.medical_history}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Enrollment Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-3">
                  <FaCalendarAlt className="text-xl" />
                </div>
                <h2 className="text-xl font-bold">Program Enrollments</h2>
              </div>
              
              <div className="mb-4">
                <div className="text-3xl font-bold text-blue-600">
                  {client.programs?.length || 0}
                </div>
                <p className="text-sm text-gray-500">Total programs enrolled</p>
              </div>

              <Link
                href={`/dashboard/clients/${clientId}/enroll`}
                className="w-full flex justify-center items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                <FaUserPlus className="mr-2" />
                <span>Enroll in Program</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-red-500">Client not found</p>
          </div>
        )}

        {/* Enrolled Programs */}
        {client && client.programs && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Enrolled Programs</h2>
            
            {client.programs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {client.programs.map((program) => (
                  <div key={program.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg">{program.name}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${program.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                        {program.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Enrolled: {new Date(program.enrollment_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">{program.description}</p>
                    {program.notes && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500 font-medium">Notes:</p>
                        <p className="text-sm text-gray-600">{program.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-4">Not enrolled in any programs</p>
                <Link
                  href={`/dashboard/clients/${clientId}/enroll`}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                  <FaUserPlus className="mr-2" />
                  Enroll in Program
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
