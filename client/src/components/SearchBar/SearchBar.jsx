import { useState } from "react";
import { FiSearch, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

function SearchBar() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");

  const goToChat = (event) => {
    event.preventDefault();

    const message = question.trim();
    if (!message) return;

    navigate("/chat", {
      state: { question: message, autoSend: true },
    });
  };

  return (
    <form className="search-bar" onSubmit={goToChat}>
      <div className="search-left">
        <FiSearch className="search-icon" />

        <input
          type="text"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask anything about your college..."
          aria-label="Ask anything about your college"
        />
      </div>

      <button
        className="search-send"
        type="submit"
        disabled={!question.trim()}
        aria-label="Send question"
      >
        <FiArrowRight />
      </button>
    </form>
  );
}

export default SearchBar;
