"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function Dashboard({ mode }: { mode: "admin" | "asha" | "citizen" }) {
  const data = useQuery(api.reports.getVillageSummary, { village: "Bangalore" });

  if (!data) return <div>Loading...</div>;

  // Citizen view
  if (mode === "citizen") {
    return (
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Citizen View</h2>
        <ul className="list-disc pl-4">
          <li>Report my symptoms</li>
          <li>See simplified local summary (anonymized)</li>
        </ul>

        <h3 className="text-lg font-medium mt-4">Summary by Disease</h3>
        <pre className="bg-gray-100 p-3 rounded-md text-sm">
          {JSON.stringify(data.byDisease, null, 2)}
        </pre>
      </div>
    );
  }

  // ASHA view
  if (mode === "asha") {
    return (
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">ASHA Dashboard 👩‍⚕️</h2>
        <ul className="list-disc pl-4">
          <li>View submitted symptom reports from citizens</li>
          <li>Track local disease patterns</li>
        </ul>
        <pre className="bg-gray-100 p-3 rounded-md text-sm">
          {JSON.stringify(data.reports, null, 2)}
        </pre>
      </div>
    );
  }

  // Admin view
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Admin Control Panel ⚙️</h2>
      <ul className="list-disc pl-4">
        <li>Monitor all village health reports</li>
        <li>View real-time outbreak trends</li>
        <li>Manage ASHA users and permissions</li>
      </ul>
      <pre className="bg-gray-100 p-3 rounded-md text-sm">
        {JSON.stringify(data.reports, null, 2)}
      </pre>
    </div>
  );
}
