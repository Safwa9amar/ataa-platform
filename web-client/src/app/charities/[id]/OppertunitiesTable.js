"use client";
import SearchWithMenu from "@/components/UI/SearchWithMenu";
import { useCredentials } from "@/context/CredentialsContext";
import { getDonationOpportunitiesRepports } from "@/services/repportsService";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  Avatar,
  Input,
} from "@material-tailwind/react";
import { useState } from "react";
import { TbListDetails } from "react-icons/tb";
import Swal from "sweetalert2";

const TABLE_HEAD = ["الفرصة", "تاريخ الانتهاء", "عرض التقرير"];

const TABLE_ROWS = [
  {
    id: 1,
    title: "عنوان الفرصة",
    img: "/logo/fullLogo.png",
    endAt: "22-10-2024",
  },
  {
    id: 2,
    title: "عنوان الفرصة",
    img: "/logo/fullLogo.png",
    endAt: "22-10-2024",
  },
  {
    id: 3,
    title: "عنوان الفرصة",
    img: "/logo/fullLogo.png",
    endAt: "22-10-2024",
  },
  {
    id: 4,
    title: "عنوان الفرصة",
    img: "/logo/fullLogo.png",
    endAt: "22-10-2024",
  },
];

export function OppertunitiesTable({ data }) {
  const { userToken, isLoggedIn } = useCredentials();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRows = TABLE_ROWS.filter((row) =>
    row.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchDonationReport = async (id) => {
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

      await getDonationOpportunitiesRepports(id, userToken);

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

  return (
    <section className="p-10">
      <div className="mb-4 flex flex-col-reverse justify-between gap-8 md:flex-row md:items-center">
        <div className="flex w-full shrink-0 gap-2 md:w-max">
          <SearchWithMenu
            onInputChange={setSearchTerm}
            inputValue={searchTerm}
            placeholder="ابحث عن فرص الجمعية"
          />
        </div>

        <div dir="rtl" className="text-textColor">
          <Typography variant="h3" className="font-ElMessiri">
            قائمة الفرص المكتملة
          </Typography>
          <Typography className="mt-1 font-normal font-ElMessiri">
            استعرض الفرص المكتملة التي قدمتها {data.legalName} لدعم المشاريع
            والمبادرات الواعدة.
          </Typography>
        </div>
      </div>

      <table
        className="h-full w-full text-textColor border-2 border-borderColor  shadow-md bg-mangoBlack  min-w-max table-auto text-right "
        dir="rtl"
      >
        <thead>
          <tr>
            {TABLE_HEAD.map((head) => (
              <th
                key={head}
                className="border-y border-borderColor rounded-xl p-5"
              >
                <Typography
                  variant="small"
                  className="font-normal leading-none font-ElMessiri"
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredRows.length > 0 ? (
            filteredRows.map(({ id, title, img, endAt }, index) => {
              return (
                <tr key={id}>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={img}
                        alt={`صورة ${title}`}
                        size="md"
                        className="border border-blue-gray-50 bg-blue-gray-50/50 object-contain p-1"
                      />
                      <Typography
                        variant="small"
                        className="font-bold font-ElMessiri"
                      >
                        {id}. {title}
                      </Typography>
                    </div>
                  </td>

                  <td>
                    <Typography
                      variant="small"
                      className="font-normal font-ElMessiri"
                    >
                      {endAt}
                    </Typography>
                  </td>

                  <td aria-label="عرض التفاصيل">
                    <TbListDetails
                      className="cursor-pointer hover:text-blue-600 transition "
                      size={26}
                      onClick={() => fetchDonationReport(id)}
                    />
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={3} className="p-4 text-center">
                <Typography
                  variant="small"
                  className="font-normal text-gray-500"
                >
                  لم يتم العثور على نتائج.
                </Typography>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
