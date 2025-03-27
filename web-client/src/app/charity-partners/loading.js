import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="relative flex flex-col items-center">
        <Image
          className="absolute w-20 h-20"
          width={200}
          height={200}
          src={"/logo/logoWithCircle.png"}
        />
        <div className="w-20 h-20 rounded-full border-4 border-r-primaryColor animate-spin"></div>
      </div>
    </div>
  );
}
