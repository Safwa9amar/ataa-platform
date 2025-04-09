import { Button, Typography } from "@material-tailwind/react";
import useElapsedTime from "@/hooks/useElapsedTime";
import Link from "next/link";
import CONSTANTS from "@/config/constants";
import { useCredentials } from "@/context/CredentialsContext";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useShare } from "@/context/ShareContext";
import { getDonationOpportunitiesRepports } from "@/services/repportsService";
import Swal from "sweetalert2"; // Import SweetAlert2
import { useSearchParams } from "next/navigation";

function HeaderSection({ data }) {
  const { customText: lastDonation } = useElapsedTime(data?.lastDonation);
  const { isLoggedIn, userToken, user } = useCredentials();
  const { openShareModal } = useShare();
  const searchParams = useSearchParams();
  const sharingSource = searchParams.get("source");
  
  const isOrphan = data?.category?.title === "kafalat";


  const fetchDonationReport = async () => {
    try {
      if (!isLoggedIn)
        return Swal.fire({
          title: "يجب عليك تسجيل الدخول لحسابك حتى تتمكن من مراجعة التقرير",
          icon: "info",
        });
      // Display loading alert
      Swal.fire({
        title: "جارٍ تحميل التقرير...",
        text: "يرجى الانتظار قليلاً",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await getDonationOpportunitiesRepports(data.id, userToken);

      // On success, show report details
      Swal.fire({
        icon: "success",
        title: "تم تحميل التقرير بنجاح",
        html: `
          <p><strong>الفرصة:</strong> ${data.title}</p>
        `,
        confirmButtonText: "حسنًا",
      });
    } catch (error) {
      // On error, show error alert
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "فشل تحميل التقرير",
        text: "حدث خطأ أثناء تحميل التقرير. يرجى المحاولة لاحقاً.",
      });
    }
  };

  const DynamiqueStatisticsGrid = useMemo(() => {
    if (isOrphan) {
      return dynamic(() => import("./OrphanStatistics"));
    }
    return dynamic(() => import("./StatisticsGrid"));
  }, []);

  return (
    <div
      className="relative w-full bg-no-repeat bg-cover bg-fixed text-white h-[50vh] flex items-center justify-center"
      style={{
        backgroundImage: `url(${
          process.env.NEXT_PUBLIC_API_URL +
            "/uploads/" +
            data?.images[0]?.filename || ""
        })`,
      }}
    >
      <div className="w-full h-full md:p-20 text-center bg-black bg-opacity-75 flex flex-col gap-4 justify-center items-center">
        <Typography className="font-ElMessiri text-xl md:text-4xl">
          {data?.title}
        </Typography>
        <Typography className="font-ElMessiri md:w-1/2 text-md">
          {data?.description}
        </Typography>

        <div className="flex gap-3 mt-4 ">
          {user.role === CONSTANTS.USERS_ROLES.donor &&
            (data?.progress?.rate !== 100 ? (
              <Link
                href={`/donate-now?type=${
                  CONSTANTS.DONATION_TYPES.DONATION_OPPOERTUNITY
                }&id=${data.id}${isOrphan ? "&orphan=true" : ""}${
                  sharingSource ? "&source=" + sharingSource : ""
                }`}
              >
                <Button
                  variant="outlined"
                  color="green"
                  className="font-ElMessiri hover:bg-secondaryColor hover:text-white"
                >
                  {isOrphan ? "اكفلني" : "تبرع الآن"}
                </Button>
              </Link>
            ) : (
              isLoggedIn && (
                <Button
                  onClick={fetchDonationReport} // Fetch report on click
                  variant="outlined"
                  color="green"
                  className="font-ElMessiri hover:bg-secondaryColor hover:text-white"
                >
                  عرض التقرير
                </Button>
              )
            ))}
          <Button
            onClick={() =>
              openShareModal({
                url:
                  window.location.host + `/donation-opportunity?id=${data.id}`,
                title: data.title,
                userId: user.id,
                type: "donationOpportunity",
                itemId: data.id,
              })
            }
            className="font-ElMessiri"
          >
            مشاركة
          </Button>
        </div>
      </div>
      <div
        className={`hidden  absolute -bottom-14 w-3/4 h-1/4 md:grid grid-flow-col-dense gap-2`}
      >
        <DynamiqueStatisticsGrid lastDonation={lastDonation} data={data} />
      </div>
    </div>
  );
}

export default HeaderSection;
