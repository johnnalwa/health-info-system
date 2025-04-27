import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApiEndpoint } from "@/components/api/api-endpoint"

export default function ApiDocsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">API Documentation</h1>
        <p className="mt-2 text-white/80">Access client and program data through our secure REST API</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Reference</CardTitle>
          <CardDescription>Use these endpoints to integrate with the Health Information System</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="clients">
            <TabsList className="mb-4">
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="programs">Programs</TabsTrigger>
              <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
            </TabsList>

            <TabsContent value="clients">
              <div className="space-y-4">
                <ApiEndpoint
                  method="GET"
                  endpoint="/api/clients"
                  description="Get all clients"
                  responseExample={`[
  {
    "id": 1,
    "name": "John Doe",
    "dateOfBirth": "1985-05-15",
    "gender": "Male",
    "contactNumber": "+1234567890",
    "address": "123 Main St, City"
  },
  ...
]`}
                />

                <ApiEndpoint
                  method="GET"
                  endpoint="/api/clients/:id"
                  description="Get a specific client by ID"
                  responseExample={`{
  "id": 1,
  "name": "John Doe",
  "dateOfBirth": "1985-05-15",
  "gender": "Male",
  "contactNumber": "+1234567890",
  "address": "123 Main St, City",
  "enrollments": [
    {
      "programId": 1,
      "programName": "TB Treatment",
      "enrollmentDate": "2023-01-15"
    }
  ]
}`}
                />

                <ApiEndpoint
                  method="POST"
                  endpoint="/api/clients"
                  description="Create a new client"
                  requestExample={`{
  "name": "Jane Smith",
  "dateOfBirth": "1990-08-20",
  "gender": "Female",
  "contactNumber": "+0987654321",
  "address": "456 Oak Ave, Town"
}`}
                  responseExample={`{
  "id": 2,
  "name": "Jane Smith",
  "dateOfBirth": "1990-08-20",
  "gender": "Female",
  "contactNumber": "+0987654321",
  "address": "456 Oak Ave, Town"
}`}
                />
              </div>
            </TabsContent>

            <TabsContent value="programs">
              <div className="space-y-4">
                <ApiEndpoint
                  method="GET"
                  endpoint="/api/programs"
                  description="Get all health programs"
                  responseExample={`[
  {
    "id": 1,
    "name": "TB Treatment",
    "description": "Tuberculosis treatment program",
    "startDate": "2023-01-01",
    "active": true
  },
  ...
]`}
                />

                <ApiEndpoint
                  method="GET"
                  endpoint="/api/programs/:id"
                  description="Get a specific program by ID"
                  responseExample={`{
  "id": 1,
  "name": "TB Treatment",
  "description": "Tuberculosis treatment program",
  "startDate": "2023-01-01",
  "active": true,
  "enrolledClients": 3
}`}
                />
              </div>
            </TabsContent>

            <TabsContent value="enrollments">
              <div className="space-y-4">
                <ApiEndpoint
                  method="GET"
                  endpoint="/api/enrollments"
                  description="Get all program enrollments"
                  responseExample={`[
  {
    "id": 1,
    "clientId": 1,
    "programId": 1,
    "enrollmentDate": "2023-01-15"
  },
  ...
]`}
                />

                <ApiEndpoint
                  method="POST"
                  endpoint="/api/enrollments"
                  description="Enroll a client in a program"
                  requestExample={`{
  "clientId": 1,
  "programId": 2,
  "enrollmentDate": "2023-03-10"
}`}
                  responseExample={`{
  "id": 3,
  "clientId": 1,
  "programId": 2,
  "enrollmentDate": "2023-03-10"
}`}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
          <CardDescription>All API requests require authentication using an API key</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Include your API key in the request headers:</p>
          <pre className="rounded-md bg-slate-950 p-4 text-sm text-white">{`Authorization: Bearer YOUR_API_KEY`}</pre>
        </CardContent>
      </Card>
    </div>
  )
}
