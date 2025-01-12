import React, { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
interface DarkModeProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}
function DarkModeButton({ isDarkMode, toggleDarkMode }: DarkModeProps) {
  return (
    <button
      className="btn btn-primary mt-3"
      onClick={toggleDarkMode}
      style={{
        borderRadius: 30,
        cursor: "pointer",
        fontSize: "1.3rem",
        color: isDarkMode ? "#fff" : "#000",
      }}
    >
      {isDarkMode ? <FaSun /> : <FaMoon />}
    </button>
  );
}

export default DarkModeButton;
