import React from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa6";

export default function RankIcons({ rank, size = 30 }) {
  // Common inline style for images
  const imageStyle = {
    width: size,
    height: size,
    margin: "0 5px",
  };

  switch (rank) {
    case "Star":
      return <FaStar size={size} color="#f1c40f" style={{ margin: "0 5px" }} />;
    case "Silver":
      return (
        <Image
          width={200}
          height={200}
          src={"/images/silver.png"}
          alt="Silver"
          style={imageStyle}
        />
      );
    case "Gold":
      return (
        <Image
          width={200}
          height={200}
          src={"/images/gold.png"}
          alt="Gold"
          style={imageStyle}
        />
      );
    case "Bronze":
      return (
        <Image
          width={200}
          height={200}
          src={"/images/bronze.png"}
          alt="Bronze"
          style={imageStyle}
        />
      );
    case "Platinum":
      return (
        <Image
          width={200}
          height={200}
          src={"/images/platinum.png"}
          alt="Platinum"
          style={imageStyle}
        />
      );
    default:
      return null;
  }
}
