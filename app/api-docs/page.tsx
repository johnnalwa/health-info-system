
export default function ApiDocs() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">API Documentation</h1>

      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Client API</h2>
        <p className="mb-4">
          Our API allows external systems to access client profiles and related
          information.
        </p>

        <div className="bg-gray-100 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-bold mb-2">Get Client Profile</h3>
          <p className="mb-4">
            Retrieve a clients complete profile including enrolled programs.
          </p>

          <div className="mb-4">
            <h4 className="font-bold">Endpoint</h4>
            <code className="bg-gray-200 px-2 py-1 rounded">
              GET /api/client/:id
            </code>
          </div>

          <div className="mb-4">
            <h4 className="font-bold">Authentication</h4>
            <p>Bearer token required</p>
          </div>

          <div className="mb-4">
            <h4 className="font-bold">Response Example</h4>
            <pre className="bg-gray-200 p-3 rounded overflow-x-auto">
              {JSON.stringify(
                {
                  id: "123e4567-e89b-12d3-a456-426614174000",
                  first_name: "John",
                  last_name: "Doe",
                  date_of_birth: "1980-01-01",
                  gender: "male",
                  contact_number: "+1234567890",
                  email: "john.doe@example.com",
                  address: "123 Main St, City",
                  medical_history: "No significant medical history",
                  programs: [
                    {
                      id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                      name: "TB Control",
                      description: "Tuberculosis control program",
                      status: "active",
                      enrollment_date: "2023-01-15",
                    },
                  ],
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Search Clients</h3>
          <p className="mb-4">
            Search for clients based on different criteria.
          </p>

          <div className="mb-4">
            <h4 className="font-bold">Endpoint</h4>
            <code className="bg-gray-200 px-2 py-1 rounded">
              GET /api/client?search=:term
            </code>
          </div>

          <div className="mb-4">
            <h4 className="font-bold">Authentication</h4>
            <p>Bearer token required</p>
          </div>

          <div className="mb-4">
            <h4 className="font-bold">Query Parameters</h4>
            <ul className="list-disc list-inside">
              <li>
                <code>search</code>: Search term for name, email, or phone
              </li>
              <li>
                <code>program</code>: (Optional) Filter by program ID
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Security and Authentication</h2>
        <p className="mb-4">
          All API requests require authentication using JWT tokens. Contact
          system administrators to obtain API access credentials.
        </p>

        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Request Authentication</h3>
          <p className="mb-4">
            Include your token in the Authorization header:
          </p>

          <pre className="bg-gray-200 p-3 rounded overflow-x-auto">
            Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
          </pre>
        </div>
      </div>
    </div>
  );
}
