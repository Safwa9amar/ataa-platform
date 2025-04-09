import Typography from "@/components/UI/Typography";

function StatCard({ label, value }) {
  return (
    <div className="w-full h-full bg-secondaryColor rounded-tl-3xl rounded-br-3xl shadow-sm dark:shadow-white flex flex-col items-center justify-center p-4">
      <Typography className="font-ElMessiri text-white dark:text-black font-bold text-center text-lg sm:text-xl">
        {value ?? "N/A"}
      </Typography>
      <Typography className="font-ElMessiri text-white dark:text-black text-[10px] sm:text-xs md:text-sm lg:text-base text-center mt-1">
        {label}
      </Typography>
    </div>
  );
}

export default StatCard;
