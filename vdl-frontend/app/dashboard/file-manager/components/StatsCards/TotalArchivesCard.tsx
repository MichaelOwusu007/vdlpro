import Card from "@/app/components/ui/Card";
import { FaRegFileArchive } from "react-icons/fa";

export default function TotalArchivesCard() {
  return (
    <Card className="flex items-center gap-4">
      <div className="p-3 bg-yellow-100 rounded-full">
        <FaRegFileArchive className="text-yellow-600 text-2xl" />
      </div>
      <div>
        <p className="text-sm text-gray-500">Total Archives</p>
        <h2 className="text-2xl font-bold">150</h2>
      </div>
    </Card>
  );
}
