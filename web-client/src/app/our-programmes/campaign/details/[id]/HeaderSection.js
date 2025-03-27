import Typography from "@/components/UI/Typography";
import { Button } from "@material-tailwind/react";
import StatisticsGrid from "./StatisticsGrid";
import useElapsedTime from "@/hooks/useElapsedTime";
import Link from "next/link";
import CONSTANTS from "@/config/constants";
import { useCredentials } from "@/context/CredentialsContext";
import { useShare } from "@/context/ShareContext";
import { getCampaignsRepports } from "@/services/repportsService"; // Import the report service
import Swal from "sweetalert2";
import { useSearchParams } from "next/navigation";

function HeaderSection({ data }) {
  const { user, userToken, isLoggedIn } = useCredentials();
  const { openShareModal } = useShare();
  const searchParams = useSearchParams();
  const sharingSource = searchParams.get("source");

  const handleCampaignReport = async () => {
    try {
      if (!isLoggedIn)
        return Swal.fire({
          title: "يجب عليك تسجيل الدخول لحسابك حتى تتمكن من مراجعة التقرير",
          icon: "info",
        });
      // Show date selection dialog
      const { value: dates } = await Swal.fire({
        title: data.title,
        confirmButtonText: "تحميل التقرير",
        showCancelButton: true,
        // preConfirm: () => {
        //   const from = document.getElementById("from-date").value;
        //   const to = document.getElementById("to-date").value;
        //   return { from, to };
        // },
      });

      await getCampaignsRepports(data.id, userToken);
      Swal.fire("تم بنجاح!", "تم تحميل التقرير.", "success");
    } catch (error) {
      console.error("Error downloading campaign report:", error.message);
      Swal.fire("خطأ", "فشل تحميل التقرير.", "error");
    }
  };

  return (
    <div
      className="relative w-full bg-no-repeat bg-cover bg-fixed text-white h-[50vh] flex items-center justify-center"
      style={{
        backgroundImage: `url(${
          process.env.NEXT_PUBLIC_API_URL +
            "/uploads/" +
            data?.images[0].filename || ""
        })`,
      }}
    >
      <div className="w-full h-full md:p-20 text-center bg-black bg-opacity-75 flex flex-col gap-4 justify-center items-center">
        <Typography variant="h3" className="font-ElMessiri">
          {data?.title}
        </Typography>

        <div className="flex gap-3 mt-4 ">
          {user.id === data.createdByuserId && data?.progress?.rate === 100 ? (
            <Button
              variant="outlined"
              color="green"
              className="font-ElMessiri hover:bg-secondaryColor hover:text-white"
              onClick={handleCampaignReport}
            >
              عرض التقرير
            </Button>
          ) : (
            data?.isAgreed && (
              <>
                {user.id !== data.createdByuserId && (
                  <Link
                    href={`/donate-now?type=${
                      CONSTANTS.DONATION_TYPES.CAMPAIGN
                    }&id=${data.id}${
                      sharingSource ? "&source=" + sharingSource : ""
                    }`}
                  >
                    <Button
                      variant="outlined"
                      color="green"
                      className="font-ElMessiri hover:bg-secondaryColor hover:text-white"
                    >
                      تبرع الآن
                    </Button>
                  </Link>
                )}
                <Button
                  onClick={() =>
                    openShareModal({
                      url:
                        window.location.host +
                        `/our-programmes/campaign/details/${data.id}`,
                      title: data.title,
                      userId: user.id,
                      type: "campaign",
                      itemId: data.id,
                    })
                  }
                  className="font-ElMessiri"
                >
                  مشاركة
                </Button>
              </>
            )
          )}
        </div>
      </div>
      <div className="absolute -bottom-14 w-1/2 h-1/4 hidden md:grid grid-flow-col-dense gap-2">
        <StatisticsGrid data={data} />
      </div>
    </div>
  );
}

export default HeaderSection;
