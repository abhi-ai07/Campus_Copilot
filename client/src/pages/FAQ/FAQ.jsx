import { useEffect, useMemo, useState } from "react";
import {
  FiHelpCircle,
  FiSearch,
  FiChevronDown,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";
import "./FAQ.css";

function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openFAQ, setOpenFAQ] = useState(null);

  const categories = [
    "All",
    "ERP",
    "Academic",
    "Examination",
    "Scholarship",
    "Library",
    "Admission",
    "General",
  ];

  const fetchFAQs = async () => {
    try {
      setError("");

      const response = await fetch("http://localhost:5000/api/faqs");

      if (!response.ok) {
        throw new Error("Unable to fetch FAQs.");
      }

      const result = await response.json();
      setFaqs(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    const loadFAQs = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/faqs");

        if (!response.ok) {
          throw new Error("Unable to fetch FAQs.");
        }

        const result = await response.json();

        if (!ignore) {
          setFaqs(result.data || []);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadFAQs();

    return () => {
      ignore = true;
    };
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    await fetchFAQs();
  };

  const filteredFAQs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory =
        activeCategory === "All" || faq.category === activeCategory;

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        faq.question?.toLowerCase().includes(searchText) ||
        faq.answer?.toLowerCase().includes(searchText) ||
        faq.keywords?.some((keyword) =>
          keyword.toLowerCase().includes(searchText),
        );

      return matchesCategory && matchesSearch;
    });
  }, [faqs, search, activeCategory]);

  return (
    <div className="faq-page">
      <section className="faq-hero">
        <div className="faq-heading">
          <span className="faq-eyebrow">
            <FiHelpCircle />
            HELP CENTER
          </span>

          <h1>Frequently Asked Questions</h1>

          <p>
            Find answers to common questions about college, ERP, examinations,
            scholarships and more.
          </p>
        </div>

        <div className="faq-total">
          <div className="faq-total-icon">
            <FiHelpCircle />
          </div>

          <div>
            <strong>{faqs.length}</strong>
            <span>Available FAQs</span>
          </div>
        </div>
      </section>

      <section className="faq-toolbar">
        <div className="faq-search">
          <FiSearch />

          <input
            type="text"
            placeholder="Search your question..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpenFAQ(null);
            }}
          />
        </div>

        <button
          className="faq-refresh"
          onClick={handleRefresh}
          disabled={loading}
        >
          <FiRefreshCw />
          Refresh
        </button>
      </section>

      <section className="faq-filters">
        <p>Browse by category</p>

        <div className="faq-category-list">
          {categories.map((category) => (
            <button
              key={category}
              className={`faq-category ${
                activeCategory === category ? "active" : ""
              }`}
              onClick={() => {
                setActiveCategory(category);
                setOpenFAQ(null);
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="faq-content">
        <div className="faq-content-heading">
          <h2>How can we help you?</h2>
          <p>{filteredFAQs.length} questions found</p>
        </div>

        {loading && (
          <div className="faq-message">
            <div className="faq-loader"></div>
            <p>Loading questions...</p>
          </div>
        )}

        {!loading && error && (
          <div className="faq-message faq-error">
            <FiAlertCircle />
            <p>{error}</p>
            <button onClick={handleRefresh}>Try Again</button>
          </div>
        )}

        {!loading && !error && filteredFAQs.length === 0 && (
          <div className="faq-message">
            <FiHelpCircle />
            <h3>No questions found</h3>
            <p>Try another keyword or select a different category.</p>
          </div>
        )}

        {!loading && !error && filteredFAQs.length > 0 && (
          <div className="faq-list">
            {filteredFAQs.map((faq) => (
              <article className="faq-card" key={faq._id}>
                <button
                  className="faq-question"
                  onClick={() =>
                    setOpenFAQ(openFAQ === faq._id ? null : faq._id)
                  }
                  aria-expanded={openFAQ === faq._id}
                >
                  <div>
                    <span className="faq-card-category">{faq.category}</span>

                    <h3>{faq.question}</h3>
                  </div>

                  <FiChevronDown
                    className={
                      openFAQ === faq._id ? "faq-chevron open" : "faq-chevron"
                    }
                  />
                </button>

                {openFAQ === faq._id && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default FAQ;
