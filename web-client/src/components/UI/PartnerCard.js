import Image from "next/image";
import FlipCard from "./FlipCard";

const PartnerCard = ({ partnerName, partnerImage, handleClick }) => {
  return (
    <FlipCard
      onClick={handleClick}
      height="h-[150px]"
      width="w-[150px]"
      front={
        <Image
          width={200}
          height={200}
          src={partnerImage}
          alt={partnerName}
          className="w-full rounded-xl"
        />
      }
      back={<p className="text-textColor">{partnerName}</p>}
    />
  );
};

export default PartnerCard;
