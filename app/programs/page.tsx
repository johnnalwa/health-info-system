"use client";

import ProgramList from "@/components/program/ProgramList";
import ProgramForm from "@/components/program/ProgramForm";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function ProgramsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Programs</h1>
          <button
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={() => setIsModalOpen(true)}
          >
            <IoMdAdd className="mr-2" /> Create Program
          </button>
        </div>
        <ProgramList />
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded shadow-lg w-full max-w-lg">
              <ProgramForm 
                onSuccess={() => {
                  setIsModalOpen(false);
                  // Force refresh the program list
                  window.location.reload();
                }} 
                onCancel={() => setIsModalOpen(false)} 
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}