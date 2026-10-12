import "./Hero.css";
import SearchBar from "../SearchBar/SearchBar";
import QuickActions from "../QuickActions/QuickActions";

function Hero() {
  return (
    <section className="hero section">
      <div className="container hero-content">
        <div className="hero-badge fade-up">
          ✦ AI-Powered College Assistant
        </div>

        <h1 className="fade-up delay-1">
          Your College Guide,
          <br />
          Powered by <span>AI.</span>
        </h1>

        <p className="fade-up delay-2">
          Ask about ERP processes, notices, scholarships, library rules,
          departments, deadlines, and official college information.
        </p>

        <div className="fade-up delay-3">
          <SearchBar />
        </div>

        <div className="fade-up delay-4">
          <QuickActions />
        </div>
      </div>
    </section>
  );
}

export default Hero;