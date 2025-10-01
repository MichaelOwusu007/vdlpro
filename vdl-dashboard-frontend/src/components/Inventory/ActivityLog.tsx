import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import type { ActivityLog } from "./InventoryService";

export function ActivityLog({ logs }: { logs: ActivityLog[] }) {
  if (logs.length === 0) return null;

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 text-sm">
          {logs.map((log) => (
            <li
              key={log.id}
              className="border-b pb-2 last:border-b-0 text-muted-foreground"
            >
              <div className="flex justify-between">
                <span className="font-medium">{log.action}</span>
                <span className="text-xs">{new Date(log.timestamp).toLocaleString()}</span>
              </div>
              {log.details && (
                <pre className="text-xs bg-muted/40 p-2 rounded mt-1 overflow-x-auto">
                  {JSON.stringify(log.details, null, 2)}
                </pre>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
