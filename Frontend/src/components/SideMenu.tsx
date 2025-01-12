import { ListGroup } from "react-bootstrap";
import FeedbackBox from "./FeedbackBox";
interface SideBarProps {
  isOpen: boolean;
  toggleSideMenu: () => void;
  button1?: React.ReactNode;
  button2?: React.ReactNode;
}

function SideBar({ isOpen, toggleSideMenu, button1, button2 }: SideBarProps) {
  if (!isOpen) return null;

  return (
    <div
      className="position-fixed top-0 start-0 vh-100 bg-light p-3 "
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "180px",
        boxShadow: "2px 0px 5px rgba(0.5, 0, 0, 1.5)",
        zIndex: 999,
      }}
    >
      <h3 style={{ color: "rgb(0, 0, 0)", fontWeight: "bold" }}>Side Menu</h3>
      <div style={{ flex: 1 }}>
        <ListGroup>{button1}</ListGroup>
        <ListGroup>{button2}</ListGroup>
      </div>
      <FeedbackBox />
      <button
        className="btn btn-secondary mt-3"
        onClick={toggleSideMenu}
        style={{ marginTop: "auto" }}
      >
        Close
      </button>
    </div>
  );
}

export default SideBar;
