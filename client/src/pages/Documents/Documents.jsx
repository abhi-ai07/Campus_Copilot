import { useEffect, useMemo, useState } from "react";
import {
  FiSearch,
  FiFileText,
  FiCalendar,
  FiAlertCircle,
  FiRefreshCw,
  FiDownload,
  FiExternalLink,
} from "react-icons/fi";
import "./Documents.css";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    "Academic",
    "Examination",
    "Admission",
    "Scholarship",
    "Library",
    "ERP",
    "General",
  ];

  const fetchDocuments = async () => {
    try {
      setError("");

      const response = await fetch("http://localhost:5000/api/documents");

      if (!response.ok) {
        throw new Error("Unable to fetch documents.");
      }

      const result = await response.json();
      setDocuments(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void fetchDocuments();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    await fetchDocuments();
  };

  const filteredDocuments = useMemo(() => {
    return documents.filter((document) => {
      const matchesCategory =
        activeCategory === "All" || document.category === activeCategory;

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        document.title?.toLowerCase().includes(searchText) ||
        document.description?.toLowerCase().includes(searchText) ||
        document.category?.toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [documents, search, activeCategory]);

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getFileType = (document) => {
    if (document.mimeType === "application/pdf") return "PDF";
    if (document.mimeType?.includes("word")) return "WORD";

    const extension = document.fileName?.split(".").pop();
    return extension ? extension.toUpperCase() : "FILE";
  };

  const getDownloadUrl = (document) => {
    if (!document.documentUrl) return "#";

    const separator = document.documentUrl.includes("?") ? "&" : "?";

    return `${document.documentUrl}${separator}dl=${encodeURIComponent(
      document.fileName || "document",
    )}`;
  };

  return (
    <div className="documents-page">
      {/* Page Heading */}
      <section className="documents-hero">
        <div className="documents-heading">
          <span className="documents-eyebrow">
            <FiFileText />
            COLLEGE RESOURCES
          </span>

          <h1>College Documents</h1>

          <p>
            Access important academic documents, examination guidelines,
            admission information and other college resources.
          </p>
        </div>

        <div className="documents-total">
          <div className="documents-total-icon">
            <FiFileText />
          </div>

          <div>
            <strong>{documents.length}</strong>
            <span>Total Documents</span>
          </div>
        </div>
      </section>

      {/* Search and Refresh */}
      <section className="documents-toolbar">
        <div className="documents-search">
          <FiSearch />

          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          className="documents-refresh"
          onClick={handleRefresh}
          disabled={loading}
        >
          <FiRefreshCw className={loading ? "documents-refresh-spin" : ""} />
          Refresh
        </button>
      </section>

      {/* Category Filters */}
      <section className="documents-filters">
        <div className="documents-filter-label">Filter by category</div>

        <div className="documents-category-list">
          {categories.map((category) => (
            <button
              key={category}
              className={`documents-category ${
                activeCategory === category ? "active" : ""
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Documents Results */}
      <section className="documents-results">
        <div className="documents-results-heading">
          <div>
            <h2>Available Resources</h2>
            <p>{filteredDocuments.length} documents found</p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="documents-message">
            <div className="documents-loader"></div>
            <p>Loading college documents...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="documents-message documents-error">
            <FiAlertCircle />
            <p>{error}</p>
            <button onClick={handleRefresh}>Try Again</button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredDocuments.length === 0 && (
          <div className="documents-message">
            <FiFileText />
            <h3>No documents found</h3>
            <p>Try changing your search or selecting another category.</p>
          </div>
        )}

        {/* Document Cards */}
        {!loading && !error && filteredDocuments.length > 0 && (
          <div className="documents-grid">
            {filteredDocuments.map((document) => (
              <article className="document-card" key={document._id}>
                <div className="document-card-top">
                  <span className="document-category-badge">
                    {document.category}
                  </span>

                  <span className="document-file-type">
                    {getFileType(document)}
                  </span>
                </div>

                <div className="document-card-icon">
                  <FiFileText />
                </div>

                <h3>{document.title}</h3>

                <p className="document-description">
                  {document.description || "No description available."}
                </p>

                <div className="document-card-footer">
                  <span>
                    <FiCalendar />
                    {formatDate(document.uploadedAt)}
                  </span>
                </div>

                <div className="document-card-actions">
                  {document.documentUrl && (
                    <>
                      {document.mimeType === "application/pdf" && (
                        <a
                          href={document.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="document-view-button"
                        >
                          <FiExternalLink />
                          View
                        </a>
                      )}

                      <a
                        href={getDownloadUrl(document)}
                        className="document-download-button"
                      >
                        <FiDownload />
                        Download
                      </a>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Documents;
