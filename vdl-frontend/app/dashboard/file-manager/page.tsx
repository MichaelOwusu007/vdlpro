import { 
  TotalImagesCard,
  TotalVideosCard,
  TotalDocsCard,
  TotalMusicCard,
  TotalOthersCard,
  TotalArchivesCard,
  StorageUsageCard,
  StorageCircleCard
} from "@/app/dashboard/file-manager/components/StatsCards";


export default function FileManagerPage() {
  return (
    <div className="space-y-6">
      {/* Top stats section - horizontally scrollable */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        <TotalImagesCard />
        <TotalVideosCard />
        <TotalDocsCard />
        <TotalMusicCard />
        <TotalOthersCard />
        <TotalArchivesCard />
      </div>

      {/* Storage section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StorageUsageCard />
        <StorageCircleCard />
      </div>
    </div>
  );
}

