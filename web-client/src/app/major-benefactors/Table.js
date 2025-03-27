"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  Input,
  Button,
} from "@material-tailwind/react";
import API_ENDPOINTS from "@/config/apiEndPoints";
import { getCommonHeaders } from "@/services/getCommonHeaders";
import numbro from "numbro";
import RankIcons from "@/components/UI/RankIcons";
import UILoading from "@/components/UI/Loading";
import Swal from "sweetalert2";
import SearchWithMenu from "@/components/UI/SearchWithMenu";
import withReactContent from "sweetalert2-react-content";

const TABLE_HEAD = ["اسم المحسن", "المبلغ (دج)", "التصنيف"];
const MySwal = withReactContent(Swal);

export function TransactionsTable() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const userToken = "";
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
      setData(fetchedData);
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

  const showModal = ({ name, totalDonatedAmount, topDonorRank }) => {
    MySwal.fire({
      title: ` ${name} : تفاصيل المحسن`,
      html: (
        <div class="flex flex-col items-center">
          <p class="text-gray-700 dark:text-gray-300 text-xl mt-4 font-semibold">
            المبلغ المتبرع به:
            {numbro(totalDonatedAmount).format({
              output: "currency",
              thousandSeparated: true,
              currencySymbol: "دج",
              currencyPosition: "postfix",
              spaceSeparated: true,
              mantissa: 2,
            })}
          </p>
          <RankIcons size={50} rank={topDonorRank} />
          <p class="text-gray-700 dark:text-gray-400 italic text-lg mt-2">
            ﴿ وَفِي ذَٰلِكَ فَلْيَتَنَافَسِ الْمُتَنَافِسُونَ ﴾
          </p>
        </div>
      ),
      icon: "info",
      confirmButtonText: "موافق",
      customClass: {
        popup: "rounded-lg shadow-lg dark:bg-gray-800",
        title: "text-green-600 dark:text-green-400 font-bold text-2xl",
        confirmButton: "bg-green-500 hover:bg-green-600 text-white",
      },
      allowOutsideClick: false,
    });
  };

  return (
    <>
      <div className="flex w-full gap-2 m-5">
        <SearchWithMenu
          onInputChange={handleSearch}
          inputValue={searchTerm}
          placeholder="البحث"
        />
      </div>
      <Card className="h-full w-full shadow-lg rounded-lg bg-nav_bg">
        <CardBody className=" px-0">
          {loading ? (
            <UILoading />
          ) : (
            <table className="w-full min-w-max table-auto text-right">
              <thead className="bg-green-500 text-white dark:bg-green-700 rounded-md">
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th key={head} className="p-4">
                      <Typography
                        variant="small"
                        className="font-normal leading-none"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map(
                    ({ id, name, totalDonatedAmount, topDonorRank }, index) => {
                      return (
                        <tr
                          key={id}
                          className="dark:hover:bg-gray-700 text-textColor hover:text-gray-200 transition-all duration-200"
                        >
                          <td>
                            <Button
                              variant="text"
                              size="sm"
                              onClick={() =>
                                showModal({
                                  name,
                                  totalDonatedAmount,
                                  topDonorRank,
                                })
                              }
                              className="flex items-center gap-3 hover:bg-green-100 dark:hover:bg-gray-600 rounded-md"
                            >
                              <Typography
                                variant="small"
                                className="font-bold text-green-600 dark:text-green-400"
                              >
                                {name}
                              </Typography>
                            </Button>
                          </td>
                          <td className="p-4">
                            {numbro(totalDonatedAmount).format({
                              output: "currency",
                              thousandSeparated: true,
                              currencySymbol: "دج",
                              currencyPosition: "postfix",
                              spaceSeparated: true,
                              mantissa: 2,
                            })}
                          </td>
                          <td className="p-4">
                            <RankIcons rank={topDonorRank} />
                          </td>
                        </tr>
                      );
                    }
                  )
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
          )}
        </CardBody>
      </Card>
    </>
  );
}
