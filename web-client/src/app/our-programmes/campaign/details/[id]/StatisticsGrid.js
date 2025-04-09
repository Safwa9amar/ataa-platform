import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { motion } from "framer-motion";
import useElapsedTime from "@/hooks/useElapsedTime";
import StatCard from "@/components/UI/StatCard";

function StatisticsGrid({ data }) {
  const { customText: lastDonation } = useElapsedTime(data?.lastDonation);
  const stats = [
    { label: "عدد الزيارات", value: data?._count.visits },
    { label: "اخر عملية تبرع", value: lastDonation },

    {
      label: "",
      value:
        data.campaignStatus === "ONGOING" ? (
          <>
            <p className="text-lg">تم جمع : {data?.progress.totalAmount} دج </p>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <CircularProgressbar
              className="w-20 h-20"
              styles={buildStyles({
                pathColor: "cayan",
                trailColor: "#EFE",
                textColor: "white",
              })}
              value={Math.floor(data?.progress.rate)}
              text={`${Math.floor(data?.progress.rate)}%`}
              strokeWidth={3}
            />
            <p className="text-xs">تم جمع : {data?.progress.totalAmount} دج </p>
            <p className="text-xs">
              متبقي :{" "}
              {data?.progress.requiredAmount - data?.progress.totalAmount} دج
            </p>
          </div>
        ),
    },
    { label: "عدد عمليات التبرع", value: data?._count.donations },
    { label: "عدد المستفيدين", value: data?.numOfBeneficiaries },
  ];

  // Animation Variants
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { opacity: 1, scale: 0.9, y: 0 },
    hover: { scale: 1 },
  };

  return (
    <>
      {stats.map(
        (stat, index) =>
          stat.value !== 0 && (
            <motion.div
              key={index}
              className={`${
                index % 2 === 0 && index === stats.length - 1
                  ? "col-span-2 md:col-span-1"
                  : ""
              }`}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              transition={{ duration: 0.1 }} // Add stagger effect
            >
              <StatCard label={stat.label} value={stat.value} />
            </motion.div>
          )
      )}
      {data.campaignStatus === "ONGOING" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="col-span-2 md:col-span-1"
        >
          <StatCard
            label="مجال صرف الصدقة"
            value={data?.category.ar_title}
          />
        </motion.div>
      )}
    </>
  );
}

export default StatisticsGrid;
