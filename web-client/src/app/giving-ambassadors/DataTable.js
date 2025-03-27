"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  Input,
  CardFooter,
  Button,
} from "@material-tailwind/react";
import API_ENDPOINTS from "@/config/apiEndPoints";
import { getCommonHeaders } from "@/services/getCommonHeaders";
import numbro from "numbro";
import RankIcons from "@/components/UI/RankIcons";
import Swal from "sweetalert2";
import { useCredentials } from "@/context/CredentialsContext";
import SearchWithMenu from "@/components/UI/SearchWithMenu";

const TABLE_HEAD = ["المركز", "اسم السفير", "نقاط السفير"];

export function DataTable() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { userToken, user, isLoggedIn } = useCredentials();
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.USERS.GET_ALL, {
        method: "GET",
        headers: getCommonHeaders(userToken),
      });
      const result = await response.json();
      return result.filter((item) => item.isVisible);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData().then((fetchedData) => {
      setData(fetchedData.sort((a, b) => b.ambassadorRank - a.ambassadorRank));
      setFilteredData(fetchedData);
      setLoading(false);
    });
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  // Show modal using SweetAlert
  const showModal = ({ name, ambassadorRank }) => {
    if (!isLoggedIn) return Swal.fire("من فضلك سجل الدخول أولا", "", "info");
    Swal.fire({
      title: ` ${name} : تفاصيل السفير `,
      html: `
        <div dir="rtl" class="flex flex-col items-center">
          <p class="text-lg font-semibold mt-2">نقاطك: ${ambassadorRank}</p>
          <p class="text-md font-semibold mt-2">تصنيفك: ${ambassadorRank}</p>
          <p class="text-md italic text-gray-600 mt-2">
            كنتم خير معاون وخير دليل
          </p>
        </div>
      `,
      icon: "info",
      confirmButtonText: "موافق",
      customClass: {
        popup: "rounded-lg shadow-lg bg-mangoBlack",
        title: "text-green-600 font-bold text-2xl",
        confirmButton: "bg-green-500 hover:bg-green-600 text-white",
      },
      allowOutsideClick: false,
    });
  };

  return (
    <>
      <Button
        className="text-white w-fit font-ElMessiri"
        size="md"
        variant="gradient"
        color="green"
        onClick={() => showModal(user)}
      >
        عرض نقاطك
      </Button>
      <div className="flex w-full gap-2 m-5">
        <SearchWithMenu
          onInputChange={handleSearch}
          inputValue={searchTerm}
          placeholder="البحث"
        />
      </div>
      <Card className="h-full w-full text-textColor shadow-lg rounded-lg bg-nav_bg">
        <CardBody className="px-2 overflow-hidden">
          <table className="w-full min-w-max table-auto text-right ">
            <thead className="bg-green-500 text-white dark:bg-green-700">
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th key={head} className="p-4">
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
              {filteredData.length > 0 ? (
                filteredData.map(({ id, name, ambassadorRank }, index) => (
                  <tr key={id}>
                    <td className="px-5 py-3 text-lg">{index + 1}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Typography variant="small" className="font-bold">
                          {name}
                        </Typography>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-lg">{ambassadorRank}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center p-4">
                    <Typography variant="h4" color="green">
                      لا توجد نتائج مطابقة
                    </Typography>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </>
  );
}
