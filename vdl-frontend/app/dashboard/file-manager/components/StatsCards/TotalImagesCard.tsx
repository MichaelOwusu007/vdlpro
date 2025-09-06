import Card from "@/app/components/ui/Card";
import { FaRegImages } from "react-icons/fa";

export default function TotalImagesCard() {
  return (
    <Card className="flex items-center gap-4">
      <div className="p-3 bg-blue-100 rounded-full">
        <FaRegImages className="text-blue-600 text-2xl" />
      </div>
      <div>
        <p className="text-sm text-gray-500">Total Images</p>
        <h2 className="text-2xl font-bold">1,240</h2>
      </div>
    </Card>
  );
}
