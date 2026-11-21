import { useNavigate } from "react-router-dom";
import {
  FiFileText,
  FiBook,
  FiAward,
  FiCalendar
} from "react-icons/fi";

import "./QuickActions.css";

function QuickActions() {
  const navigate = useNavigate();

  const openChat = (question) => {
    navigate("/chat", {
      state: { question }
    });
  };

  const actions = [
    {
      icon: <FiFileText />,
      label: "How to fill ERP form?"
    },
    {
      icon: <FiBook />,
      label: "Library timings"
    },
    {
      icon: <FiAward />,
      label: "Scholarship eligibility"
    },
    {
      icon: <FiCalendar />,
      label: "Exam schedule"
    }
  ];

  return (
    <div className="quick-actions">
      {actions.map((item, index) => (
        <button
          key={index}
          className="quick-chip"
          onClick={() => openChat(item.label)}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

export default QuickActions;