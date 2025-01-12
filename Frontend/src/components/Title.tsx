import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface TitleProps {
  title: string;
  isDarkMode: boolean;
  subText: string;
}
function Title({ title, isDarkMode, subText }: TitleProps) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
  };
  const textStyle: React.CSSProperties = {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "6rem",
    fontWeight: "bold",
    textTransform: "none",
    background:
      "linear-gradient(45deg, #ff6b6b,rgb(11, 11, 11),rgb(0, 63, 108), #a29bfe)",
    backgroundSize: "400% 400%",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    animation: "gradientAnimation 3s ease infinite",
    transition: "transform 0.8s ease",
    transform: clicked ? "translateY(-20px)" : "translateY(0)",
    cursor: "pointer",
  };

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "50vh",
    marginTop: "15vh",
    backgroundColor: isDarkMode ? "#343434" : "#C7C6C1", // Change to match your website's background
  };

  const formattedText = subText.split("\n").map((line, index) => (
    <React.Fragment key={index}>
      {line}
      {index < subText.split("\n").length - 1 && <br />}
    </React.Fragment>
  ));

  return (
    <div style={containerStyle}>
      <h1
        onClick={handleClick}
        style={textStyle}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.4)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {title}
      </h1>
      {clicked && (
        <p
          style={{
            textAlign: "center",
            fontSize: "1.5rem",
            marginTop: "20px",
            opacity: 0,
            animation: "fadeIn 4s forwards",
            fontFamily: "'Arial', sans-serif",
            fontWeight: "bold",
          }}
        >
          {formattedText}
        </p>
      )}
      <style>
        {`
          @keyframes gradientAnimation {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
             @keyframes fadeIn {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Title;
