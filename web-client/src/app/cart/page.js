"use client";
import React, { useEffect } from "react";
import { Avatar, Button, Input } from "@material-tailwind/react";
import { FaTrashAlt, FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import CONSTANTS from "@/config/constants";
import Link from "next/link";
import { useCredentials } from "@/context/CredentialsContext";
import { notFound } from "next/navigation";
import API_ENDPOINTS from "@/config/apiEndPoints";

const CartScreen = () => {
  const {
    cart,
    loading,
    addToCart,
    cartTotal,
    removeFromCart,
    deleteItemFromCart,
    editItemPrice,
  } = useCart();
  const { user, loading: authLoading } = useCredentials();

  const renderCartItem = (item) => (
    <div className="flex flex-col sm:flex-row justify-between items-center p-4 shadow-sm border rounded-lg bg-mangoBlack dark:border-gray-700 mb-4">
      <div className="flex  items-center gap-4">
        <Avatar
          src={`${API_ENDPOINTS.UPLOADS}/${
            item.type === "store"
              ? item.productImages[0].filename
              : item.images[0].filename
          }`}
          alt={item.title}
          size="xl"
          className="m-2"
        />
        <div>
          <h5 className="text-md font-medium text-gray-900 dark:text-gray-100">
            {item.title}
          </h5>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {item.category?.ar_title || "No Category"}
          </p>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Price: {(item.price * item.quantity).toFixed(2)}{" "}
            {process.env.APP_CURRENCY_NAME}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {item.type === "store" && (
          <div className="flex items-center ">
            <button
              className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              onClick={() => removeFromCart(item.id)}
              aria-label="Decrease Quantity"
            >
              <FaMinusCircle className="text-xl text-gray-600 dark:text-gray-300" />
            </button>
            <input
              type="number"
              value={item.quantity}
              readOnly
              className="w-10 text-center bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-300"
            />
            <button
              className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              onClick={() => addToCart({ id: item.id, type: item.type })}
              aria-label="Increase Quantity"
            >
              <FaPlusCircle className="text-xl text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        )}
        {item.type === CONSTANTS.DONATION_TYPES.DONATION_OPPOERTUNITY && (
          <Input
            label="المبلغ"
            type="number"
            value={item.price}
            onChange={(e) => editItemPrice(item, e.target.value)}
            className="w-24 text-gray-800 dark:text-gray-300"
          />
        )}

        <button
          className="p-2 bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 rounded-full"
          onClick={() => deleteItemFromCart(item.id)}
          aria-label="Remove Item"
        >
          <FaTrashAlt className="text-red-500 dark:text-red-300" />
        </button>
      </div>
    </div>
  );

  if (loading && authLoading) {
    if (user.role !== CONSTANTS.USERS_ROLES.donor) {
      return notFound();
    }
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
      </div>
    );
  } else {
    return (
      <div
        className="w-full mx-auto p-10 md:p-20 bg-gray-100 dark:bg-gray-900"
        dir="rtl"
      >
        <div className="flex justify-between items-center mb-6 px-4 border-b border-gray-300 dark:border-gray-700">
          <h1 className="text-2xl text-gray-900 dark:text-gray-100">
            سلة التبرع
          </h1>
          <h1 className="text-2xl text-gray-900 dark:text-gray-100">
            {cart.length ? cart.length + " عناصر" : "لا توجد عناصر"}
          </h1>
        </div>
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <img
              src="/images/emptyCart.jpg"
              alt="Empty Cart"
              className="w-32 h-32 rounded-lg mb-4"
            />
            <p className="text-lg text-gray-600 dark:text-gray-400">
              لا توجد أي عناصر حاليا
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-4 space-y-4 mx-5">
              {cart.map((item) => (
                <div key={item.id}>{renderCartItem(item)}</div>
              ))}
            </div>
            <div className="bg-mangoBlack p-4 rounded-md shadow-lg flex flex-wrap justify-between items-center ">
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                المجموع: {cartTotal} دج
              </p>
              <Link
                className="bg-gradient-to-tl from-secondaryColorDark to-primaryColorDark text-white text-center  font-bold py-2 px-4 rounded-full w-32 hover:scale-105 focus:scale-100  transition-transform"
                href={`donate-now?type=${CONSTANTS.DONATION_TYPES.CART}`}
              >
                تبرع الآن
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }
};

export default CartScreen;
