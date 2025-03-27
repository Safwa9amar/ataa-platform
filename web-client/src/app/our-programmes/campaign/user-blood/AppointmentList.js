"use client";
import { useState, useCallback, useEffect } from "react";
import {
  Badge,
  Button,
  Chip,
  IconButton,
  Input,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCredentials } from "@/context/CredentialsContext";
import {
  getAppointmentsByCampaignId,
  setAppointmentDate,
  setAppointmentIsDone,
  updateAppointment,
} from "@/services/appointmentsServices";
import { IoIosCall } from "react-icons/io";
import { CiCalendarDate, CiMail } from "react-icons/ci";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import withReactContent from "sweetalert2-react-content";
import { BiMenuAltLeft } from "react-icons/bi";
import { RiMenu3Line } from "react-icons/ri";
import { RxDropdownMenu } from "react-icons/rx";

import { FaCheckCircle } from "react-icons/fa";
const socket = io(process.env.NEXT_PUBLIC_API_URL);
const mySwal = withReactContent(Swal);
const AppointmentList = ({ id }) => {
  const [state, setState] = useState([]);
  const { userToken, user } = useCredentials();
  const [loading, setLoading] = useState(false);
  const [loadingState, setLoadingState] = useState(true);
  const [loadingID, setLoadingID] = useState(null);
  const [date, setDate] = useState(
    dayjs(new Date()).format("YYYY:MM:DD HH:mm")
  );

  const getData = async () => {
    try {
      let res = await getAppointmentsByCampaignId(id, userToken);
      setState(res);
    } catch (error) {
      console.error("Error fetching appointments:", error.message);
    } finally {
      setLoadingState(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    socket.emit("register", { userId: user.id });
    socket.on("notification", () => {
      setLoadingState(true);
      setState(null);
      getData();
    });
  }, [user]);

  const handleIsDone = async (item) => {
    // Show confirmation dialog
    const confirmation = await Swal.fire({
      text: "هل انت متأكد ؟",
      icon: "question",
      showCloseButton: true,
      showCancelButton: true, // Add cancel button
      confirmButtonText: "نعم",
      cancelButtonText: "لا",
    });

    // Exit if the user cancels
    if (!confirmation.isConfirmed || loading || item.isDone) return;

    try {
      setLoading(true);
      setLoadingID(item.id);

      // Update appointment
      await setAppointmentIsDone(item.id, { isDone: !item.isDone }, userToken);

      // Update state with new appointment status
      const updatedData = state.map((_item) =>
        _item.id === item.id ? { ..._item, isDone: !item.isDone } : _item
      );
      setState(updatedData);
    } catch (error) {
      console.error("Error updating appointment:", error.message);
    } finally {
      setLoading(false);
      setLoadingID(null);
    }
  };

  const handleDateChange = useCallback(
    async (id, currentDate) => {
      try {
        if (loading) return;

        // Show modal for date selection
        const { value: selectedDate } = await mySwal.fire({
          title: "تحديد تاريخ و وقت الموعد",
          html: (
            <>
              <Input
                type="datetime-local"
                defaultValue={currentDate} // Pre-fill with the current date
                id="date-picker"
                className="w-full p-2 border rounded"
              />
            </>
          ),
          focusConfirm: false,
          preConfirm: () => {
            const inputElement = document.getElementById("date-picker");
            return inputElement ? inputElement.value : null;
          },
          showCancelButton: true,
          confirmButtonText: "تأكيد",
          cancelButtonText: "إلغاء",
        });

        if (!selectedDate) {
          Swal.fire("لم يتم التغيير", "لم يتم اختيار تاريخ جديد.", "info");
          return;
        }

        setLoading(true);

        // Update appointment
        await setAppointmentDate(
          id,
          { date: new Date(selectedDate).toISOString() },
          userToken
        );

        // Update local state
        const updatedData = state.map((item) =>
          item.id === id
            ? { ...item, date: new Date(selectedDate).toISOString() }
            : item
        );
        setState(updatedData);

        Swal.fire("تم التحديث", "تم تعديل الموعد بنجاح.", "success");
      } catch (error) {
        console.error("Error updating appointment:", error);
        Swal.fire("خطأ", "حدث خطأ أثناء تحديث الموعد.", "error");
      } finally {
        setLoading(false);
      }
    },
    [state, userToken, loading, setLoading, updateAppointment]
  );
  if (state?.length === 0) {
    return <div className="p-6 text-center">لا يوجد مواعيد حتى الآن</div>;
  }
  return (
    <div className="p-6">
      <table className="table-auto w-full text-right border-collapse border border-gray-200 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="border border-gray-200 dark:border-gray-700 p-2">
              البريد الالكتروني
            </th>
            <th className="border border-gray-200 dark:border-gray-700 p-2">
              رقم الهاتف
            </th>
            <th className="border border-gray-200 dark:border-gray-700 p-2">
              تاريخ وتوقيت الحجز
            </th>
            <th className="border border-gray-200 dark:border-gray-700 p-2">
              تاريخ وتوقيت الموعد
            </th>

            <th className="border border-gray-200 dark:border-gray-700 p-2">
              الإجراءات
            </th>
          </tr>
        </thead>
        <tbody>
          {state?.map((item) => (
            <tr
              key={item.id}
              className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="border border-gray-200 dark:border-gray-700 p-2">
                {item.email}
              </td>
              <td className="border border-gray-200 dark:border-gray-700 p-2">
                {item.phone}
              </td>
              <td className="border border-gray-200 dark:border-gray-700 p-2">
                {dayjs(item.createdAt).format("DD-MM-YYYY")}
                <br />
                {dayjs(item.createdAt).format("HH:mm:ss")}
              </td>
              <td className="border border-gray-200 dark:border-gray-700 p-2">
                {item.date ? dayjs(item.date).format("DD-MM-YYYY") : "/"}
                <br />
                {item.date ? dayjs(item.date).format("HH:mm:ss") : "/"}
              </td>

              <td className="border border-gray-200 dark:border-gray-700 p-2 ">
                {item.isDone ? (
                  <Chip
                    color="green"
                    className="w-fit"
                    size="sm"
                    value="تم التبرع"
                  />
                ) : (
                  <Menu placement="left-start">
                    <MenuHandler>
                      <IconButton variant="text">
                        <RxDropdownMenu className="text-textColor" size={32} />
                      </IconButton>
                    </MenuHandler>
                    <MenuList className="bg-mangoBlack" dir="rtl">
                      <MenuItem
                        className="flex gap-2"
                        onClick={() => {
                          handleDateChange(item.id, date.date);
                        }}
                      >
                        <CiCalendarDate size={20} />
                        تحديد موعد
                      </MenuItem>
                      <MenuItem
                        size="sm"
                        color={item.isDone ? "green" : "blue"}
                        onClick={() => handleIsDone(item)}
                        disabled={item.isDone}
                        loading={loadingID === item.id}
                        className="rounded-full flex gap-2"
                      >
                        <FaCheckCircle />

                        {loadingID === item.id
                          ? "جاري التأكيد..."
                          : item.isDone
                          ? "تم التبرع"
                          : "تأكيد اكتمال التبرع"}
                      </MenuItem>
                      <MenuItem>
                        <a className="flex gap-2" href={`mailto:${item.email}`}>
                          <CiMail size={20} />
                          <span>ارسال بريد</span>
                        </a>
                      </MenuItem>
                      <MenuItem>
                        <a className="flex gap-2" href={`tel:${item.phone}`}>
                          <IoIosCall size={20} />
                          اتصال
                        </a>
                      </MenuItem>
                    </MenuList>
                  </Menu>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentList;
