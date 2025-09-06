import Card from "@/app/components/ui/Card";
import { FaVideo } from "react-icons/fa";

export default function TotalVideosCard() {
  return (
    <Card className="flex items-center gap-4">
      <div className="p-3 bg-red-100 rounded-full">
        <FaVideo className="text-red-600 text-2xl" />
      </div>
      <div>
        <p className="text-sm text-gray-500">Total Videos</p>
        <h2 className="text-2xl font-bold">520</h2>
      </div>
    </Card>
  );
}
