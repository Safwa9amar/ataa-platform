import { useCart } from "@/context/CartContext";
import { Button, Typography, Card, CardBody } from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function Zakat() {
  const searchParams = useSearchParams();
  const amount = searchParams.get("price");

  return (
    <div className="p-6 flex flex-col items-center bg-gray-50 rounded-xl shadow-md">
      {/* Header Image */}
      <Image
        className="rounded-xl mb-6 shadow-lg"
        src={"/images/image48.png"}
        width={300}
        height={350}
        alt="zalat Illustration"
      />

      {/* Total Donation Amount */}
      <Card className="w-full mb-6">
        <CardBody>
          <Typography className="font-ElMessiri text-center text-gray-700">
            المجموع الكلي للزكاة:
            <span className="font-bold text-blue-600 inline"> {amount} دج</span>
          </Typography>
        </CardBody>
      </Card>

      {/* Actions */}
      <Link href={"/our-programmes/zakat/calculate"} className="w-full mt-6">
        <Button
          color="blue"
          onClick={() => "Go to Checkout"}
          className="font-ElMessiri w-full mx-auto"
        >
          الانتقال الى حاسبة الزكاة
        </Button>
      </Link>
    </div>
  );
}
