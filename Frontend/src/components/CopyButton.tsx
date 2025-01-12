import { useState } from "react";
interface CopyButtonProps {
  text: string;
}
function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        padding: "8px 16px",
        fontSize: "14px",
        cursor: "pointer",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
      }}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
export default CopyButton;
