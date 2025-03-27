"use client";
import React, { useEffect, useState } from "react";
import { Button, Input } from "@material-tailwind/react";
import { usePreciousMetals } from "@/context/PreciousMetalsContext";
import { useCurrency } from "@/context/CurrencyContext";
import {
  calculateZakatNetWeightGold,
  calculateZakatValue,
} from "@/utils/zakatUtils";
import { useZakat } from "@/context/ZakatContext";
import Image from "next/image";
import { toast } from "react-toastify";

export default function Page({ closeModel, setAmount }) {
  const { goldData } = usePreciousMetals();
  const { currencyData, setBaseCurrency, loading } = useCurrency();
  const { addZakat } = useZakat();

  const [caliber, setCaliber] = useState({
    priceInDZD: goldData?.prices[0]?.priceInDZD || 0,
    unit: "14",
  });
  const [goldWeight, setGoldWeight] = useState(0);
  const [weightUnit, setWeightUnit] = useState({
    name: "جرام",
    code: "gram",
  });
  const [netWeight, setNetWeight] = useState(0);
  const [gramPrice, setGramPrice] = useState(0);
  const [code, setCode] = useState({
    code: "DZD",
    currencyName: "دينار جزائري",
  });

  const exchangeRate = currencyData?.data?.["DZD"]?.value;

  const handleCurrencyChange = (curr) => {
    setCode(curr);
    setBaseCurrency(curr.code);
  };

  useEffect(() => {
    setNetWeight(
      calculateZakatNetWeightGold(goldWeight, caliber.unit, weightUnit.code)
    );

    if (exchangeRate) {
      setGramPrice(caliber.priceInDZD / exchangeRate);
    }
  }, [code, exchangeRate, caliber, goldWeight, weightUnit]);

  const showNotification = () => {
    const goldZakat = calculateZakatValue(netWeight, gramPrice).toFixed(2);
    if (netWeight >= 85) {
      addZakat("زكاة الذهب", goldZakat, "goldAmount");
      toast.success(
        `تم اضافة مبلغ زكاة الذهب بنجاح ، بلغت قيمته ${goldZakat} ${code.currencyName}`,
        {
          toastId: 1,
          position: "bottom-left",
        }
      );
    } else {
      toast.warning(
        "النصاب : قيمة 85 غرام ذهب صافي فأكثر وإلا فإن الزكاة فيه غير مشروعة",
        {
          toastId: 2,
          position: "bottom-left",
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
    <div
      className="flex flex-col items-center gap-4 overflow-hidden p-4"
      dir="rtl"
    >
      <div className="w-full h-32 rounded-lg  bg-[100% 100%] bg-center bg-[url(/images/Frame178.png)] dark:bg-[url(/images/Frame178_dark.png)]">
        <div className="flex flex-col justify-center items-center h-full text-center">
          <p>
            سعر الغرام:{" "}
            <span>
              {gramPrice.toFixed(2)} {code.currencyName}
            </span>
          </p>
          <p>
            اخر تحديث: <span>{goldData?.date}</span>
          </p>
          <p>
            الوزن الصافي: <span>{netWeight.toFixed(2)} غرام</span>
          </p>
          <p>
            المبلغ الكلي:{" "}
            <span>
              {(netWeight * gramPrice).toFixed(2)} {code.currencyName}
            </span>
          </p>
        </div>
      </div>
      <p className="text-lg">العملة (سعر البنك)</p>
      <div className="w-full flex justify-center">
        {loading ? (
          <div className="animate-spin w-10 h-10 rounded-full border-r-2 border-secondaryColor" />
        ) : (
          <div className="flex gap-2" dir="ltr" width="95%">
            <Button
              color="green"
              className="flex gap-1"
              variant={code.code === "USD" ? "filled" : "outlined"}
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
              color="green"
              className="flex gap-1"
              variant={code.code === "EUR" ? "filled" : "outlined"}
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
              color="green"
              className="flex gap-1"
              variant={code.code === "DZD" ? "filled" : "outlined"}
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

      <div width="95%" label="العيار">
        <div className="flex gap-2 overflow-x-auto">
          {goldData?.prices.map((item) => (
            <Button
              key={item.unit}
              color="green"
              variant={caliber.unit === item.unit ? "filled" : "outlined"}
              onClick={() => setCaliber(item)}
            >
              {item.unit}
            </Button>
          ))}
        </div>
      </div>

      <div className="mb-4 w-72">
        <label
          htmlFor="weight-unit"
          className="block text-sm font-medium text-gray-700"
        >
          وحدة الوزن
        </label>
        <select
          id="weight-unit"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={weightUnit.code}
          onChange={(e) =>
            setWeightUnit({
              code: e.target.value,
              name: e.target.options[e.target.selectedIndex].text,
            })
          }
        >
          <option value="gram">جرام</option>
          <option value="ounce">اونصة</option>
          <option value="kilogram">كيلوغرام</option>
        </select>
      </div>
      <div className="w-72">
        <Input
          className="self-center"
          onChange={(e) => setGoldWeight(e.target.value)}
          type="number"
          variant="static"
          label="وزن الذهب"
          placeholder="وزن الذهب"
        />
      </div>

      <Button
        className="text-sm rounded-full md:w-96 bg-gradient-to-tl from-primaryColorDark to-secondaryColorDark font-ElMessiri"
        onClick={showNotification}
      >
        احسب
      </Button>
    </div>
  );
}
