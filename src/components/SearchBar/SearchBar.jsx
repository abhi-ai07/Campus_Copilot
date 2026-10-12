import { FiSearch, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

function SearchBar() {
  const navigate = useNavigate();

  const goToChat = () => {
    navigate("/chat");
  };

  return (
    <div className="search-bar" onClick={goToChat}>
      <div className="search-left">
        <FiSearch className="search-icon" />
        <span>Ask anything about your college...</span>
      </div>

      <button className="search-send">
        <FiArrowRight />
      </button>
    </div>
  );
}

export default SearchBar;