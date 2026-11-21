import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiBookOpen,
  FiBell,
  FiMessageCircle,
  FiAward,
  FiTarget,
  FiZap,
  FiShield,
  FiDatabase,
  FiCpu,
} from "react-icons/fi";
import "./About.css";

function About() {
  const features = [
    {
      icon: FiMessageCircle,
      title: "AI Chat Assistant",
      description:
        "Ask college-related questions in natural language and get easy-to-understand guidance.",
    },
    {
      icon: FiBell,
      title: "Notice Summaries",
      description:
        "Understand important announcements, deadlines and college notices without reading lengthy documents.",
    },
    {
      icon: FiBookOpen,
      title: "ERP & Academic Guidance",
      description:
        "Get step-by-step explanations of ERP processes, academic rules and college procedures.",
    },
    {
      icon: FiAward,
      title: "Scholarship Guidance",
      description:
        "Explore scholarship information, eligibility requirements and application guidance.",
    },
  ];

  const technologies = [
    { icon: FiZap, name: "React.js", description: "Interactive frontend" },
    { icon: FiCpu, name: "Node.js & Express", description: "Backend APIs" },
    { icon: FiDatabase, name: "MongoDB", description: "Data storage" },
  ];

  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-glow" />

        <div className="about-hero-content">
          <span className="about-eyebrow">
            <FiZap />
            ABOUT CAMPUSCOPILOT
          </span>

          <h1>
            College life, made
            <br />
            <span>simpler with AI.</span>
          </h1>

          <p>
            Your smart college companion for understanding notices, academic
            processes, scholarships and essential college information — all in
            one place.
          </p>

          <Link to="/chat" className="about-primary-btn">
            Explore CampusCopilot <FiArrowRight />
          </Link>
        </div>

        <div className="about-hero-art" aria-hidden="true">
          <div className="about-orbit about-orbit-one" />
          <div className="about-orbit about-orbit-two" />

          <div className="about-ai-card">
            <div className="about-ai-icon">✦</div>
            <span className="about-ai-label">YOUR COLLEGE ASSISTANT</span>
            <h3>How can I help you today?</h3>

            <div className="about-ai-option">
              <FiBookOpen />
              <span>Academic guidance</span>
              <FiArrowRight />
            </div>

            <div className="about-ai-option">
              <FiBell />
              <span>Important notices</span>
              <FiArrowRight />
            </div>

            <div className="about-ai-option">
              <FiAward />
              <span>Scholarship information</span>
              <FiArrowRight />
            </div>

            <div className="about-ai-status">
              <span />
              Designed for students
            </div>
          </div>
        </div>
      </section>

      <section className="about-mission">
        <div className="about-section-heading">
          <span className="about-section-tag">OUR PURPOSE</span>
          <h2>Making college information easier to access.</h2>
          <p>
            Students often need to search through multiple notices and documents
            to find a simple answer. CampusCopilot aims to make that process
            easier through a single, student-friendly interface.
          </p>
        </div>

        <div className="about-mission-card">
          <div className="about-mission-icon">
            <FiTarget />
          </div>
          <div>
            <h3>Our Mission</h3>
            <p>
              To help students understand college information through simple
              conversations, clear explanations and organised knowledge.
            </p>
          </div>
        </div>
      </section>

      <section className="about-features">
        <div className="about-section-heading">
          <span className="about-section-tag">WHAT WE OFFER</span>
          <h2>One assistant. Multiple ways to help.</h2>
          <p>
            CampusCopilot is designed to bring commonly needed college
            information closer to students.
          </p>
        </div>

        <div className="about-features-grid">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article className="about-feature-card" key={feature.title}>
                <div className="about-feature-icon">
                  <Icon />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="about-how">
        <div className="about-section-heading">
          <span className="about-section-tag">HOW IT WORKS</span>
          <h2>Answers, made easier.</h2>
          <p>
            The planned workflow is designed to make college information
            accessible without complicated navigation.
          </p>
        </div>

        <div className="about-steps">
          <article className="about-step">
            <span className="about-step-number">01</span>
            <h3>Ask a question</h3>
            <p>Type your college-related question in simple language.</p>
          </article>

          <article className="about-step">
            <span className="about-step-number">02</span>
            <h3>Find relevant information</h3>
            <p>
              The planned knowledge base will help retrieve relevant college
              documents and information.
            </p>
          </article>

          <article className="about-step">
            <span className="about-step-number">03</span>
            <h3>Understand the answer</h3>
            <p>
              Get guidance in clear language, with English and Hinglish support
              as a project goal.
            </p>
          </article>
        </div>
      </section>

      <section className="about-tech">
        <div className="about-section-heading">
          <span className="about-section-tag">TECHNOLOGY</span>
          <h2>Built with modern web technologies.</h2>
          <p>
            The project uses a familiar web stack, with AI-powered document
            retrieval planned as part of the implementation.
          </p>
        </div>

        <div className="about-tech-grid">
          {technologies.map((technology) => {
            const Icon = technology.icon;

            return (
              <article className="about-tech-card" key={technology.name}>
                <div className="about-tech-icon">
                  <Icon />
                </div>
                <div>
                  <h3>{technology.name}</h3>
                  <p>{technology.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="about-scope">
        <div className="about-scope-icon">
          <FiShield />
        </div>
        <div>
          <h3>Built with a clear scope</h3>
          <p>
            CampusCopilot is an academic project. In its current scope, it
            explains college processes but does not access student ERP accounts,
            submit forms or replace official college notices. Answers should be
            verified against official sources.
          </p>
        </div>
      </section>

      <section className="about-cta">
        <div>
          <span className="about-section-tag">READY TO EXPLORE?</span>
          <h2>Your college questions start here.</h2>
          <p>
            Explore the assistant and see how CampusCopilot is designed to help.
          </p>
        </div>

        <Link to="/chat" className="about-primary-btn">
          Start a Conversation <FiArrowRight />
        </Link>
      </section>
    </div>
  );
}

export default About;
