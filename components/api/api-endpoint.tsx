import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface ApiEndpointProps {
  method: "GET" | "POST" | "PUT" | "DELETE"
  endpoint: string
  description: string
  requestExample?: string
  responseExample: string
}

export function ApiEndpoint({ method, endpoint, description, requestExample, responseExample }: ApiEndpointProps) {
  const methodColors = {
    GET: "bg-blue-100 text-blue-800",
    POST: "bg-green-100 text-green-800",
    PUT: "bg-yellow-100 text-yellow-800",
    DELETE: "bg-red-100 text-red-800",
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-4 flex items-center gap-2">
          <Badge className={methodColors[method]}>{method}</Badge>
          <code className="rounded bg-muted px-2 py-1 text-sm">{endpoint}</code>
        </div>

        <p className="mb-4">{description}</p>

        {requestExample && (
          <div className="mb-4">
            <p className="mb-1 text-sm font-medium">Request Body:</p>
            <pre className="rounded-md bg-slate-950 p-4 text-sm text-white overflow-auto">{requestExample}</pre>
          </div>
        )}

        <div>
          <p className="mb-1 text-sm font-medium">Response:</p>
          <pre className="rounded-md bg-slate-950 p-4 text-sm text-white overflow-auto">{responseExample}</pre>
        </div>
      </CardContent>
    </Card>
  )
}
