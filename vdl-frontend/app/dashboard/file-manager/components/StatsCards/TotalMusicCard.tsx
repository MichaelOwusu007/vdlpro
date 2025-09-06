import Card from "@/app/components/ui/Card";
import { FaRegFileAudio } from "react-icons/fa";

export default function TotalAudioCard() {
  return (
    <Card className="flex items-center gap-4">
      <div className="p-3 bg-purple-100 rounded-full">
        <FaRegFileAudio className="text-purple-600 text-2xl" />
      </div>
      <div>
        <p className="text-sm text-gray-500">Total Audio</p>
        <h2 className="text-2xl font-bold">320</h2>
      </div>
    </Card>
  );
}
