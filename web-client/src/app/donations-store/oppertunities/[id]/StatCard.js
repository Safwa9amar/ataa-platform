import Typography from "@/components/UI/Typography";

function StatCard({ label, value }) {
  return (
    <div className="w-full h-full bg-secondaryColor rounded-tl-3xl rounded-br-3xl shadow-sm dark:shadow-white flex flex-col items-center justify-center p-4">
      <Typography variant="h4" className="font-ElMessiri dark:text-black">
        {value ?? "N/A"}
      </Typography>
      <Typography className="font-ElMessiri dark:text-black">
        {label}
      </Typography>
    </div>
  );
}

export default StatCard;
