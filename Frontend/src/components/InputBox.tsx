interface TextBoxProps {
  placeholder: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  text: string;
}

function TextBox({ placeholder, handleInputChange, text }: TextBoxProps) {
  return (
    <div
      className="text-box-container"
      style={{ width: "75%", marginTop: "15px" }}
    >
      <input
        type="text"
        className="form-control rounded-pill"
        placeholder={placeholder}
        onChange={handleInputChange}
        value={text}
        style={{
          marginBottom: "15px",
        }}
      />
    </div>
  );
}

export default TextBox;
