import { useCart } from "@/context/CartContext";
import { Button, Typography, Card, CardBody } from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Cart() {
  const { cart, cartTotal, clearCart } = useCart();

  return (
    <div className="p-6 flex flex-col items-center bg-gray-50 rounded-xl shadow-md">
      {/* Header Image */}
      <Image
        className="rounded-xl mb-6 shadow-lg"
        src={"/images/donationill.jpg"}
        width={300}
        height={350}
        alt="Donation Illustration"
      />

      {/* Total Donation Amount */}
      <Card className="w-full mb-6">
        <CardBody>
          <Typography className="font-ElMessiri text-center text-gray-700">
            المجموع الكلي لسلة التبرع:
            <span className="font-bold text-blue-600 inline">
              {" "}
              {cartTotal} دج
            </span>
          </Typography>
        </CardBody>
      </Card>

      {/* Actions */}
      <Link href={"/cart"} className="w-full mt-6">
        <Button
          color="blue"
          onClick={() => "Go to Checkout"}
          className="font-ElMessiri w-full mx-auto"
        >
          الانتقال الى السلة
        </Button>
      </Link>
    </div>
  );
}
