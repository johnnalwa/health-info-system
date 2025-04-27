"use client";

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
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-gray-500 text-center">Loading programs...</p>
        </div>
        
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded shadow-lg w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4">Create Program</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Program Name</label>
                  <input 
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter program name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter program description"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                  >
                    Create Program
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
