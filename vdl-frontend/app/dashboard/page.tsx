import { redirect } from "next/navigation";

export default function DashboardIndex() {
  redirect("/dashboard/file-manager");
}
