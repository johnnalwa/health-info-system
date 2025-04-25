// app/dashboard/clients/page.tsx

"use client";

import { useState } from "react";
import ClientForm from "@/components/client/ClientForm";
import ClientSearch from "@/components/client/ClientSearch";

export default function ClientsPage() {
  const [activeTab, setActiveTab] = useState("search");

  return (
    <div className="px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Client Management</h1>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("search")}
              className={`${
                activeTab === "search"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
              Search Clients
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`${
                activeTab === "register"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
              Register New Client
            </button>
          </nav>
        </div>
      </div>

      {activeTab === "search" ? (
        <ClientSearch />
      ) : (
        <ClientForm onSuccess={() => setActiveTab("search")} />
      )}
    </div>
  );
}
