import Card from "@/app/components/ui/Card";
import { FaRegFileAlt } from "react-icons/fa";

export default function TotalDocumentsCard() {
  return (
    <Card className="flex items-center gap-4">
      <div className="p-3 bg-green-100 rounded-full">
        <FaRegFileAlt className="text-green-600 text-2xl" />
      </div>
      <div>
        <p className="text-sm text-gray-500">Total Documents</p>
        <h2 className="text-2xl font-bold">890</h2>
      </div>
    </Card>
  );
}
