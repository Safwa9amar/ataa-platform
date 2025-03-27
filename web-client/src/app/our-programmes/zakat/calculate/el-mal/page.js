"use client";
import React, { useState, useEffect } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { Button } from "@material-tailwind/react";
import { useZakat } from "@/context/ZakatContext";
import { usePreciousMetals } from "@/context/PreciousMetalsContext";
import Image from "next/image";
import { toast } from "react-toastify";

export default function Page({ closeModel }) {
  const { currencyData, setBaseCurrency, loading } = useCurrency();
  const { addZakat } = useZakat();
  const { goldData } = usePreciousMetals();
  const [currency, setCurrency] = useState({ code: "DZD" });

  const [amount, setAmount] = useState(null);

  const handleCurrencyChange = (value) => {
    setCurrency(value);
    setBaseCurrency(value.code);
  };

  const handleAddZakat = () => {
    const Unit24 = goldData.prices.find((item) => item.unit === "24");

    if (!Unit24) {
      toast.error("لم يتم العثور على سعر الذهب عيار 24.", {
        position: "bottom-left",
        toastId: 1,
      });
      return;
    }

    const Unit24PriceDZD = parseFloat(Unit24.priceInDZD);
    const nisabPriceDZD = Unit24PriceDZD * 85;

    if (typeof amount === "undefined" || amount === null) {
      toast.info("الرجاء ادخال المبلغ لحساب الزكاة.", {
        position: "bottom-left",
        toastId: 2,
      });
      return;
    }

    if (amount >= nisabPriceDZD) {
      const zakatElmal = (amount * 0.025).toFixed(2);
      addZakat("زكاة المال", zakatElmal, "cashAmount");
      toast.success(
        `تم إضافة مبلغ زكاة المال بنجاح، بلغت قيمته ${zakatElmal} دينار جزائري`,
        {
          position: "bottom-left",
          toastId: 3,
        }
      );
    } else {
      toast.warn(
        `النصاب: قيمة 85 غرام ذهب صافي اي ${nisabPriceDZD} دج فأكثر وإلا فإن الزكاة فيه غير مشروعة`,
        {
          position: "bottom-left",
          toastId: 4,
        }
      );
    }
  };

  useEffect(() => {
    return () => {
      setBaseCurrency("DZD");
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-6 p-10 rounded-lg shadow-sm ">
      <input
        type="number"
        onChange={(e) => setAmount(e.target.value)}
        className="w-80 h-12 border-2 rounded-md p-2 text-center"
        placeholder="ادخل المبلغ المملوك"
      />
      <div className="w-full flex justify-center">
        {loading ? (
          <div className="animate-spin w-10 h-10 rounded-full border-r-2 border-secondaryColor" />
        ) : (
          <div className="flex gap-2" width="95%" label="العملة (سعر البنك)">
            <Button
              className="flex gap-1"
              color={currency.code === "USD" ? "green" : "gray"}
              variant={currency.code === "USD" ? "filled" : "outlined"}
              onClick={() =>
                handleCurrencyChange({
                  code: "USD",
                  currencyName: "دولار امريكي",
                })
              }
            >
              <Image
                width={20}
                height={32}
                src="/flags/us.png"
                alt="USA"
                className="h-4"
              />
              <p>USD</p>
            </Button>
            <Button
              className="flex gap-1"
              color={currency.code === "EUR" ? "green" : "gray"}
              variant={currency.code === "EUR" ? "filled" : "outlined"}
              onClick={() =>
                handleCurrencyChange({
                  code: "EUR",
                  currencyName: "يورو",
                })
              }
            >
              <Image
                width={20}
                height={32}
                src="/flags/eu.png"
                alt="EUR"
                className="h-4"
              />
              <p>EUR</p>
            </Button>
            <Button
              className="flex gap-1"
              color={currency.code === "DZD" ? "green" : "gray"}
              variant={currency.code === "DZD" ? "filled" : "outlined"}
              label="DZD"
              onClick={() =>
                handleCurrencyChange({
                  code: "DZD",
                  currencyName: "دينار جزائري",
                })
              }
            >
              <Image
                width={20}
                height={32}
                src="/flags/dz.png"
                alt="DZD"
                className="h-4"
              />
              <p>DZD</p>
            </Button>
          </div>
        )}
      </div>

      <Button
        className="text-sm rounded-full md:w-96 bg-gradient-to-tl from-primaryColorDark to-secondaryColorDark font-ElMessiri"
        onClick={handleAddZakat}
      >
        احسب
      </Button>
    </div>
  );
}
