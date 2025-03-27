import Image from "next/image";

export default function NoData({ title = "لا توجد بيانات حاليا", action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-4 p-6 sm:p-8 md:p-12 lg:p-16 w-full">
      <Image
        src="/images/nodata.png"
        width={500}
        height={400}
        alt="لا توجد بيانات"
        className="w-64 h-72 sm:w-72 sm:h-80 md:w-80 md:h-96 lg:w-[250px] lg:h-[250px]"
      />
      <p className="text-gray-700 text-lg  font-semibold">{title}</p>
      {action}
    </div>
  );
}
