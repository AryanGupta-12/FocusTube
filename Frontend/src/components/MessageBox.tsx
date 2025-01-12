import { useState } from "react";
interface MessageBoxProps {
  message: string;
}
function MessageBox({ message }: MessageBoxProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleOkClick = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
      style={{ zIndex: 999 }}
    >
      <div
        className="bg-secondary text-white rounded-3 p-4 shadow"
        style={{ maxWidth: "90%", width: "300px" }}
      >
        <p className="text-center mb-4">{message}</p>
        <div className="text-center">
          <button
            className="btn btn-light rounded-pill fw-bold"
            onClick={handleOkClick}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default MessageBox;
