import { useState } from "react";
import axios from "axios";

function FeedbackBox() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [feedback, setFeedback] = useState("");
  const showModal = () => {
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
    setFeedback("");
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeedback(e.target.value);
  };

  const handleOkClick = async () => {
    if (feedback.trim()) {
      try {
        const response = await fetch("http://127.0.0.1:5000/add_data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ value: feedback }), // Ensure the value is wrapped in a JSON object
        });

        if (!response.ok) {
          const error = await response.json();
          console.error("Error:", error.message || error.error);
        } else {
          const data = await response.json();
          console.log("Success:", data.message);
        }
      } catch (error) {
        console.error("Request failed:", error);
      }
    } else {
      console.error("Feedback cannot be empty");
    }

    hideModal(); // Hide the modal after submission
  };

  return (
    <div>
      <button
        className="btn btn-secondary mt-3"
        onClick={showModal}
        style={{
          marginTop: "auto",
          borderRadius: 20,
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Feedback💬
      </button>

      {isModalVisible && (
        <div
          className="modal"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "300px",
              textAlign: "center",
              position: "relative",
            }}
          >
            <h2 style={{ color: "rgb(0,0,0)" }}>Enter Your Feedback</h2>
            <input
              type="text"
              value={feedback}
              onChange={handleFeedbackChange}
              placeholder="Write your feedback here..."
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            <div className="modal-buttons" style={{ marginTop: "20px" }}>
              <button
                onClick={handleOkClick}
                style={{
                  padding: "10px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                OK
              </button>
              <button
                onClick={hideModal}
                style={{
                  padding: "10px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginLeft: "10px",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeedbackBox;
