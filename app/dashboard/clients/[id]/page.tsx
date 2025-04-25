// app/dashboard/clients/[id]/page.tsx

"use client";

import ClientProfile from "@/components/client/ClientProfile";

export default function ClientProfilePage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="px-4 py-8">
      <ClientProfile clientId={params.id} />
    </div>
  );
}
