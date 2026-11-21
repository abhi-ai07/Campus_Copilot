import {
  FiMessageCircle,
  FiBell,
  FiBookOpen,
  FiAward
} from "react-icons/fi";

import FeatureCard from "../FeatureCard/FeatureCard";
import "./Features.css";

function Features() {

  const cards = [
    {
      icon: <FiMessageCircle />,
      title: "AI Chat",
      description: "Ask college-related questions instantly."
    },
    {
      icon: <FiBell />,
      title: "Notice Summary",
      description: "Understand lengthy notices in seconds."
    },
    {
      icon: <FiBookOpen />,
      title: "Library Rules",
      description: "Know borrowing limits, fines and timings."
    },
    {
      icon: <FiAward />,
      title: "Scholarships",
      description: "Learn eligibility and application guidance."
    }
  ];

  return (
    <section className="features section">
      <div className="container">

        <div className="section-header">
          <span className="section-tag fade-up">
            Everything You Need
          </span>

          <h2 className="fade-up delay-1">
            Everything a Student Needs
          </h2>

          <p className="fade-up delay-2">
            One assistant for notices, ERP guidance, scholarships,
            library rules and official college information.
          </p>
        </div>

        <div className="features-grid">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`fade-up delay-${Math.min(index + 1, 4)}`}
            >
              <FeatureCard {...card} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Features;