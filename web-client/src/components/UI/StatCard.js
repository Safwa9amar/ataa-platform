import Typography from "@/components/UI/Typography";

function StatCard({ label, value }) {
  return (
    <div className="w-full h-full bg-secondaryColor rounded-tl-3xl rounded-br-3xl shadow-sm dark:shadow-white flex flex-col items-center justify-center p-4">
      <Typography className="font-ElMessiri text-white dark:text-black font-bold text-center text-xl md:text-3xl">
        {value ?? "N/A"}
      </Typography>
      <Typography className="font-ElMessiri text-white dark:text-black text-xs">
        {label}
      </Typography>
    </div>
  );
}

export default StatCard;
