import { CategorySkeletonLoader } from "./Fields";
import { DonationCardSkeleton } from "@/components/UI/DonationCard";

export default function Loading() {
  return (
    <div className="flex flex-col gap-10">
      <CategorySkeletonLoader />
      <div className="flex flex-wrap justify-around my-10">
        <DonationCardSkeleton />
        <DonationCardSkeleton />
        <DonationCardSkeleton />
      </div>
    </div>
  );
}
