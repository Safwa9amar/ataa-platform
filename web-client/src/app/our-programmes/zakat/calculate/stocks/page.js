"use client";
import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { usePreciousMetals } from "@/context/PreciousMetalsContext";
import { useZakat } from "@/context/ZakatContext";
import { useCurrency } from "@/context/CurrencyContext";
import { Button, IconButton } from "@material-tailwind/react";
import { toast } from "react-toastify";
import Image from "next/image";
import { RiAddCircleLine } from "react-icons/ri";
import { MdOutlineRestore } from "react-icons/md";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { TrashIcon } from "@heroicons/react/24/solid";
import { FaTrash } from "react-icons/fa6";
import { v4 as uuidv4 } from "uuid";

const MySwal = withReactContent(Swal);
const Page = () => {
  const { goldData } = usePreciousMetals();
  const { currencyData, setBaseCurrency, loading } = useCurrency();
  const { addZakat } = useZakat();

  const [currency, setCurrency] = useState({
    code: "DZD",
    currencyName: "الدينار جزائري",
  });
  const [totalStockPrice, setTotalStockPrice] = useState(0);
  const [stockAmount, setStockAmount] = useState("");
  const [stockPrice, setStockPrice] = useState("");
  const [stockName, setStockName] = useState("");
  const [stockData, setStockData] = useState([]);

  const stockNameRef = useRef(null);
  const stockPriceRef = useRef(null);
  const stockAmountRef = useRef(null);

  const exchangeRate = currencyData?.data["DZD"]?.value || 1;

  const handleShowHistory = useCallback(() => {
    MySwal.fire({
      title: "سجل زكاة الاسهم",
      customClass: {
        title: "text-textColora",
        popup: "bg-mangoBlack",
        htmlContainer: "flex flex-col items-center",
      },
      html: (
        <table dir="rtl" className="w-full">
          <thead>
            <tr className="bg-teal-500 text-white rounded-t-lg">
              <td>اسم السهم</td>
              <td>عدد الاسهم</td>
              <td>قيمة السهم</td>
              <td>ازالة</td>
            </tr>
          </thead>
          <tbody>
            {stockData.map((stock) => {
              return (
                <tr
                  id={stock.id}
                  className="hover:bg-teal-200 hover:text-white"
                >
                  <td>{stock.stockName}</td>
                  <td>{stock.stockAmount}</td>
                  <td>{stock.stockPrice}</td>
                  <td className="group">
                    <IconButton
                      onClick={(e) => {
                        document.getElementById(stock.id).remove();
                        handleDeleteStock(stock.id);
                      }}
                      color="red"
                      variant="text"
                    >
                      <FaTrash className="pointer-events-none" size={20} />
                    </IconButton>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ),
    });
  }, [stockData]);

  const handleAddStock = () => {
    if (!stockAmount || !stockPrice) {
      toast.warning("الرجاء إدخال عدد الأسهم وقيمتها بشكل صحيح.", {
        position: "bottom-left",
        toastId: 5,
      });
      return;
    }
    const newStock = {
      id: uuidv4(),
      stockName,
      stockAmount: parseFloat(stockAmount),
      stockPrice: parseFloat(stockPrice),
    };
    setStockData([...stockData, newStock]);

    // Clear input fields
    setStockName("");
    setStockAmount("");
    setStockPrice("");
    stockNameRef.current?.focus();
    toast.success("تمت إضافة السهم بنجاح إلى القائمة.", {
      position: "bottom-left",
      toastId: 6,
    });
  };

  const handleDeleteStock = (id) => {
    setStockData([...stockData.filter((stock) => stock.id !== id)]);
  };

  const handleRemoveStock = () => {
    const lastStock = stockData.pop();
    if (lastStock) {
      setStockName(lastStock.stockName);
      setStockAmount(lastStock.stockAmount.toString());
      setStockPrice(lastStock.stockPrice.toString());
      stockNameRef.current?.focus();
    }
    setStockData([...stockData]);
  };

  useEffect(() => {
    const total = stockData.reduce(
      (acc, { stockPrice, stockAmount }) => acc + stockPrice * stockAmount,
      0
    );
    setTotalStockPrice(total);
  }, [stockData]);

  const handleCurrencyChange = (value) => {
    setCurrency(value);
    setBaseCurrency(value.code);
  };

  const currencyButtons = useMemo(
    () => [
      {
        code: "USD",
        currencyName: "دولار امريكي",
        img: (
          <Image
            width={20}
            height={32}
            src="/flags/us.png"
            alt="USA"
            className="h-4"
          />
        ),
      },
      {
        code: "EUR",
        currencyName: "يورو",
        img: (
          <Image
            width={20}
            height={32}
            src="/flags/eu.png"
            alt="EUR"
            className="h-4"
          />
        ),
      },
      {
        code: "DZD",
        currencyName: "دينار جزائري",
        img: (
          <Image
            width={20}
            height={32}
            src="/flags/dz.png"
            alt="DZD"
            className="h-4"
          />
        ),
      },
    ],
    []
  );

  const calculateZakat = () => {
    const Unit24 = goldData.prices.find((item) => item.unit === "24");
    if (!Unit24) {
      toast.error(
        "عذرًا، لم نتمكن من العثور على سعر الذهب عيار 24. يرجى المحاولة لاحقًا.",
        {
          position: "bottom-left",
          toastId: 1,
        }
      );
      return;
    }
    const Unit24PriceDZD = parseFloat(Unit24.priceInDZD);
    const nisabPriceDZD = Unit24PriceDZD * 85;

    if (totalStockPrice >= nisabPriceDZD) {
      const zakatStocks = totalStockPrice * 0.025;

      toast.success(
        `تمت إضافة زكاة الأسهم بنجاح! قيمة الزكاة: ${zakatStocks} دينار جزائري.`,
        {
          position: "bottom-left",
          toastId: 3,
        }
      );
      addZakat(
        "زكاة الاسهم",
        parseFloat(zakatStocks.toFixed(2)),
        "stockAmount"
      );
    } else {
      toast.info(
        `النصاب المطلوب للزكاة هو ${nisabPriceDZD} دينار جزائري. إذا كان إجمالي قيمة الأسهم أقل من هذا المبلغ، فلا زكاة مطلوبة.`,
        {
          position: "bottom-left",
          toastId: 4,
        }
      );
    }
  };

  return (
    <div className="flex flex-col items-center p-4 gap-2">
      <div className="bg-[url(/images/Frame176.png)] dark:bg-[url(/images/Frame176_dark.png)]  w-full h-32 bg-[100% 100%] rounded-lg bg-center flex flex-col items-center justify-center gap-2">
        <p className="text-xl flex gap-2">
          <span>{currency.currencyName}</span>
          <span>{(totalStockPrice / exchangeRate || 0).toFixed(2)} </span>
        </p>
        <p className="text-sm 300">اجمالي قيمة الاسهم</p>
      </div>
      <p className="text-lg">اختر العملة الأساسية لحساب الزكاة (سعر البنك)</p>
      {loading ? (
        <div className="animate-spin w-10 h-10 rounded-full border-r-2 border-secondaryColor" />
      ) : (
        <div className="flex gap-1">
          {currencyButtons.map(({ code, currencyName, img }) => (
            <Button
              className="flex gap-1"
              key={code}
              color="green"
              variant={currency.code === code ? "gradient" : "outlined"}
              onClick={() => handleCurrencyChange({ code, currencyName })}
            >
              {img}
              {code}
            </Button>
          ))}
        </div>
      )}

      <input
        ref={stockNameRef}
        value={stockName}
        onChange={(e) => setStockName(e.target.value)}
        className="border-2 border-gray-300 rounded-md w-full md:w-96 h-10 p-2 text-center my-2"
        placeholder="أدخل اسم السهم"
      />
      <input
        ref={stockAmountRef}
        value={stockAmount}
        onChange={(e) => setStockAmount(e.target.value)}
        type="number"
        className="border-2 border-gray-300 rounded-md w-full md:w-96 h-10 p-2 text-center my-2"
        placeholder="أدخل عدد الأسهم التي تمتلكها"
      />
      <input
        ref={stockPriceRef}
        value={stockPrice}
        onChange={(e) => setStockPrice(e.target.value)}
        type="number"
        className="border-2 border-gray-300 rounded-md w-full md:w-96 h-10 p-2 text-center my-2"
        placeholder="قيمة السهم في السوق بتاريخ اخراج الزكاة + الارباح"
      />

      <div className="flex justify-between  md:w-96 my-4">
        <Button
          onClick={handleShowHistory}
          className="rounded-full"
          color="teal"
        >
          عرض السجل
        </Button>
        <div className="flex gap-2">
          <IconButton
            className="flex items-center gap-2  rounded-full"
            color="teal"
            onClick={handleAddStock}
          >
            <RiAddCircleLine size={32} />
          </IconButton>
          <IconButton
            className="flex  items-center gap-2 rounded-full"
            onClick={handleRemoveStock}
            bgColor="red"
          >
            <MdOutlineRestore size={32} />
          </IconButton>
        </div>
      </div>
      <Button
        className="text-sm rounded-full md:w-96 bg-gradient-to-tl from-primaryColorDark to-secondaryColorDark font-ElMessiri"
        onClick={calculateZakat}
      >
        احسب
      </Button>
    </div>
  );
};

export default Page;
