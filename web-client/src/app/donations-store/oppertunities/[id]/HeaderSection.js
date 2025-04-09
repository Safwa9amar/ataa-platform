import Typography from "@/components/UI/Typography";
import { Button } from "@material-tailwind/react";
import StatisticsGrid from "./StatisticsGrid";
import useElapsedTime from "@/hooks/useElapsedTime";
import Link from "next/link";
import CONSTANTS from "@/config/constants";
import { useShare } from "@/context/ShareContext";
import { useCredentials } from "@/context/CredentialsContext";
import { useSearchParams } from "next/navigation";

function HeaderSection({ data }) {
  const { customText: lastDonation } = useElapsedTime(data?.lastDonation);
  const { openShareModal } = useShare();
  const { user } = useCredentials();
  const searchParams = useSearchParams();
  const sharingSource = searchParams.get("source");

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
        <Typography variant="h3" className="font-ElMessiri">
          {data?.title}
        </Typography>
        <Typography variant="h5" className="font-ElMessiri w-1/2">
          {data?.description}
        </Typography>

        <div className="flex gap-3 mt-4 ">
          {user.role === CONSTANTS.USERS_ROLES.donor && (
            <Link
              href={`/donate-now?type=${CONSTANTS.DONATION_TYPES.STORE}&id=${
                data.id
              }${sharingSource ? "&source=" + sharingSource : ""}`}
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
                  `/donations-store/oppertunities/${data.id}`,
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
        <StatisticsGrid lastDonation={lastDonation} data={data} />
      </div>
    </div>
  );
}

export default HeaderSection;
