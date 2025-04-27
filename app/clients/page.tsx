// app/clients/page.tsx
"use client";
import ClientSearch from "@/components/client/ClientSearch";
import ClientForm from "@/components/client/ClientForm";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";

export default function ClientsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Clients</h1>
        <button
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setIsModalOpen(true)}
        >
          <IoMdAdd className="mr-2" /> Register Client
        </button>
      </div>
      <ClientSearch />
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg w-full max-w-lg">
            <ClientForm onSuccess={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
