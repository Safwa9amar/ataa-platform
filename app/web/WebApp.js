import React from "react";
import { useTheme } from "../context/ThemeContext";
import AlertMessage from "../components/AlertMessage";
import Unlogged from "../components/Unlogged";

export default function WebApp() {
  const { theme } = useTheme();
  return (
    <div
      style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
      className={`h-screen flex justify-center items-center`}
    >
      <Unlogged />
      <AlertMessage
        message={"Hello World"}
        onClose={() => alert("Alert Closed")}
        onConfirm={() => alert("Alert Confirmed")}
      />
      <h1 className="text-red-950">Web App</h1>
    </div>
  );
}
