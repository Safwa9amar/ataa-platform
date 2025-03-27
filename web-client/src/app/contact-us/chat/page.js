"use client";
import { useCredentials } from "@/context/CredentialsContext";
import Link from "next/link";
import React, { useState } from "react";

export default function Page() {
  const { isLoggedIn } = useCredentials();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (input.trim() === "") return; // Prevent empty messages

    // Add the message to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: input },
    ]);

    // Simulate a platform response
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "platform", text: "شكرًا لتواصلك معنا! سنرد عليك قريبًا." },
      ]);
    }, 1000);

    setInput(""); // Clear the input field
  };

  return (
    <div
      className="p-6 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md"
      dir="rtl"
    >
      {!isLoggedIn ? (
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            يرجى تسجيل الدخول لبدء المحادثة.
          </p>
          <Link
            href="/account/login"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            تسجيل الدخول
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4">
          <div className="h-48 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-md p-2 mb-4">
            {messages.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center">
                لا توجد رسائل حتى الآن. ابدأ المحادثة!
              </p>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-2 mb-2 rounded-md ${
                  message.sender === "user"
                    ? "bg-blue-100 text-blue-800 self-end text-right dark:bg-blue-800 dark:text-blue-200"
                    : "bg-gray-100 text-gray-800 self-start text-left dark:bg-gray-600 dark:text-gray-200"
                }`}
              >
                <p>{message.text}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md text-right dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="اكتب رسالتك هنا..."
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 transition"
            >
              إرسال
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
