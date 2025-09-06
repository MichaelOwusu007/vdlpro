import Card from "@/app/components/ui/Card";
import { FaRegFolder } from "react-icons/fa";

export default function TotalOthersCard() {
  return (
    <Card className="flex items-center gap-4">
      <div className="p-3 bg-gray-200 rounded-full">
        <FaRegFolder className="text-gray-700 text-2xl" />
      </div>
      <div>
        <p className="text-sm text-gray-500">Other Files</p>
        <h2 className="text-2xl font-bold">75</h2>
      </div>
    </Card>
  );
}
