"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  FaCode, 
  FaUserFriends, 
  FaHospitalAlt, 
  FaClipboardList,
  FaServer,
  FaDatabase,
  FaInfoCircle,
  FaExchangeAlt
} from "react-icons/fa";

export default function ApiDocsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Safe way to get origin that works on both client and server
  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      return process.env.NEXT_PUBLIC_API_URL || window.location.origin;
    }
    return process.env.NEXT_PUBLIC_API_URL || '';
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <FaCode className="text-indigo-600 text-2xl mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">API Documentation</h1>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <p className="text-gray-600 mb-4">
            This documentation provides information about the available API endpoints for the Health Information System.
            Use these endpoints to interact with clients, programs, and enrollments programmatically.
          </p>
          <div className="flex items-center">
            <FaInfoCircle className="text-indigo-500 mr-2" />
            <p className="text-sm text-indigo-600">
              All endpoints are relative to the base URL: <code className="bg-gray-100 px-2 py-1 rounded">{getBaseUrl()}</code>
            </p>
          </div>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="overview" className="flex items-center data-[state=active]:bg-white data-[state=active]:text-indigo-700">
              <FaServer className="mr-2" /> Overview
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center data-[state=active]:bg-white data-[state=active]:text-indigo-700">
              <FaUserFriends className="mr-2" /> Clients
            </TabsTrigger>
            <TabsTrigger value="programs" className="flex items-center data-[state=active]:bg-white data-[state=active]:text-indigo-700">
              <FaHospitalAlt className="mr-2" /> Programs
            </TabsTrigger>
            <TabsTrigger value="enrollments" className="flex items-center data-[state=active]:bg-white data-[state=active]:text-indigo-700">
              <FaClipboardList className="mr-2" /> Enrollments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center mb-2">
                  <FaDatabase className="text-indigo-600 mr-2" />
                  <CardTitle>API Overview</CardTitle>
                </div>
                <CardDescription>
                  The Health Information System API is a RESTful API that allows you to interact with the system programmatically.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Authentication</h3>
                    <p className="text-gray-700">
                      Authentication is required for all API endpoints. Use the <code className="bg-gray-100 px-2 py-1 rounded">/api/auth</code> endpoint to obtain a JWT token.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Rate Limiting</h3>
                    <p className="text-gray-700">
                      API requests are limited to 100 requests per minute per IP address.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Error Handling</h3>
                    <p className="text-gray-700">
                      All errors return a JSON object with an <code className="bg-gray-100 px-2 py-1 rounded">error</code> property containing a description of the error.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <FaExchangeAlt className="mr-2" />
                  <span>All responses are in JSON format</span>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="clients" className="space-y-4">
            <EndpointCard
              title="Get All Clients"
              description="Retrieve a list of all clients"
              method="GET"
              endpoint="/api/client"
              responseExample={`[
  {
    "id": "123",
    "first_name": "John",
    "last_name": "Doe",
    "date_of_birth": "1990-01-01",
    "gender": "male",
    "contact_number": "1234567890",
    "email": "john@example.com",
    "address": "123 Main St",
    "created_at": "2023-01-01T00:00:00Z"
  }
]`}
            />
            <EndpointCard
              title="Get Client by ID"
              description="Retrieve a specific client by ID"
              method="GET"
              endpoint="/api/client/[id]"
              responseExample={`{
  "id": "123",
  "first_name": "John",
  "last_name": "Doe",
  "date_of_birth": "1990-01-01",
  "gender": "male",
  "contact_number": "1234567890",
  "email": "john@example.com",
  "address": "123 Main St",
  "created_at": "2023-01-01T00:00:00Z"
}`}
            />
            <EndpointCard
              title="Create Client"
              description="Create a new client"
              method="POST"
              endpoint="/api/client"
              requestExample={`{
  "first_name": "Jane",
  "last_name": "Smith",
  "date_of_birth": "1995-05-15",
  "gender": "female",
  "contact_number": "9876543210",
  "email": "jane@example.com",
  "address": "456 Oak St"
}`}
              responseExample={`{
  "id": "456",
  "first_name": "Jane",
  "last_name": "Smith",
  "date_of_birth": "1995-05-15",
  "gender": "female",
  "contact_number": "9876543210",
  "email": "jane@example.com",
  "address": "456 Oak St",
  "created_at": "2023-01-02T00:00:00Z"
}`}
            />
          </TabsContent>

          <TabsContent value="programs" className="space-y-4">
            <EndpointCard
              title="Get All Programs"
              description="Retrieve a list of all health programs"
              method="GET"
              endpoint="/api/program"
              responseExample={`[
  {
    "id": "789",
    "name": "Diabetes Management",
    "description": "Program for managing diabetes",
    "status": "active",
    "created_at": "2023-01-01T00:00:00Z"
  }
]`}
            />
            <EndpointCard
              title="Create Program"
              description="Create a new health program"
              method="POST"
              endpoint="/api/program"
              requestExample={`{
  "name": "Hypertension Management",
  "description": "Program for managing hypertension",
  "status": "active"
}`}
              responseExample={`{
  "id": "101",
  "name": "Hypertension Management",
  "description": "Program for managing hypertension",
  "status": "active",
  "created_at": "2023-01-03T00:00:00Z"
}`}
            />
          </TabsContent>

          <TabsContent value="enrollments" className="space-y-4">
            <EndpointCard
              title="Get Enrollments"
              description="Retrieve enrollments by client ID or program ID"
              method="GET"
              endpoint="/api/enrollment?clientId=[id]"
              responseExample={`[
  {
    "id": "222",
    "client_id": "123",
    "program_id": "789",
    "enrollment_date": "2023-01-15T00:00:00Z",
    "status": "active",
    "program": {
      "id": "789",
      "name": "Diabetes Management",
      "description": "Program for managing diabetes",
      "status": "active"
    }
  }
]`}
            />
            <EndpointCard
              title="Create Enrollment"
              description="Enroll a client in a health program"
              method="POST"
              endpoint="/api/enrollment"
              requestExample={`{
  "client_id": "456",
  "program_id": "101",
  "status": "active"
}`}
              responseExample={`{
  "id": "333",
  "client_id": "456",
  "program_id": "101",
  "enrollment_date": "2023-01-20T00:00:00Z",
  "status": "active"
}`}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

interface EndpointCardProps {
  title: string;
  description: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  endpoint: string;
  requestExample?: string;
  responseExample: string;
}

function EndpointCard({ title, description, method, endpoint, requestExample, responseExample }: EndpointCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <FaCode className="text-indigo-600 mr-2" /> {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge className={`
            ${method === "GET" ? "bg-blue-100 text-blue-800" : ""}
            ${method === "POST" ? "bg-green-100 text-green-800" : ""}
            ${method === "PUT" ? "bg-yellow-100 text-yellow-800" : ""}
            ${method === "DELETE" ? "bg-red-100 text-red-800" : ""}
          `}>
            {method}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Endpoint</h3>
          <code className="block bg-gray-100 p-2 rounded">{endpoint}</code>
        </div>
        
        {requestExample && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Request Body</h3>
            <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
              {requestExample}
            </pre>
          </div>
        )}
        
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Response</h3>
          <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
            {responseExample}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
