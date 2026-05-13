import { FaApple, FaGooglePlay } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  const handleScroll = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="text-[var(--text-muted)] pt-[100px] px-[5%] pb-[40px]"
      style={{
        background: "#080810",
        maskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%)"
      }}
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[40px] mb-[40px]">
        <div>
          <h2 className="text-[2rem] font-extrabold text-[var(--text-main)] mb-[15px] tracking-[1px]">Cinema<span className="text-[var(--accent-blue)]">TM</span></h2>
          <p className="leading-[1.6] text-[0.95rem] max-w-[400px]">
            Your ultimate destination for discovering, tracking, and exploring the best movies 
            and TV shows. Experience the world of cinema with premium design and seamless interaction.
          </p>
        </div>
        
        <div>
          <h3 className="text-[1.2rem] font-bold text-[var(--text-main)] mb-[20px]">Links</h3>
          <div className="flex flex-col gap-[12px]">
            <Link onClick={handleScroll} to="/" className="text-[var(--text-muted)] text-[0.95rem] transition-colors duration-300 w-fit hover:text-[var(--accent-blue)]">Home</Link>
            <Link onClick={handleScroll} to="/movies" className="text-[var(--text-muted)] text-[0.95rem] transition-colors duration-300 w-fit hover:text-[var(--accent-blue)]">Movies</Link>
            <Link onClick={handleScroll} to="/tv-shows" className="text-[var(--text-muted)] text-[0.95rem] transition-colors duration-300 w-fit hover:text-[var(--accent-blue)]">TV Shows</Link>
            <Link onClick={handleScroll} to="/watchlist" className="text-[var(--text-muted)] text-[0.95rem] transition-colors duration-300 w-fit hover:text-[var(--accent-blue)]">Watchlist</Link>
            <Link onClick={handleScroll} to="/authenticate/log-in" className="text-[var(--text-muted)] text-[0.95rem] transition-colors duration-300 w-fit hover:text-[var(--accent-blue)]">Log In</Link>
            <Link onClick={handleScroll} to="/authenticate/register" className="text-[var(--text-muted)] text-[0.95rem] transition-colors duration-300 w-fit hover:text-[var(--accent-blue)]">Register</Link>
          </div>
        </div>

        <div>
          <h3 className="text-[1.2rem] font-bold text-[var(--text-main)] mb-[20px]">Get The App</h3>
          <div className="flex flex-row flex-wrap gap-[15px]">
            <a href="#" className="flex items-center gap-[15px] bg-[var(--glass-bg)] border border-[var(--glass-border)] px-[20px] py-[12px] rounded-[12px] text-[var(--text-main)] transition-all duration-300 w-[200px] hover:bg-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.3)] hover:-translate-y-[2px]">
              <FaApple size={30} />
              <div>
                <span className="block text-[0.75rem] text-[var(--text-muted)]">Download on the</span>
                <strong className="block text-[1.1rem] font-semibold">App Store</strong>
              </div>
            </a>
            <a href="#" className="flex items-center gap-[15px] bg-[var(--glass-bg)] border border-[var(--glass-border)] px-[20px] py-[12px] rounded-[12px] text-[var(--text-main)] transition-all duration-300 w-[200px] hover:bg-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.3)] hover:-translate-y-[2px]">
              <FaGooglePlay size={25} />
              <div>
                <span className="block text-[0.75rem] text-[var(--text-muted)]">GET IT ON</span>
                <strong className="block text-[1.1rem] font-semibold">Google Play</strong>
              </div>
            </a>
          </div>
        </div>
      </div>
      
      <div className="max-w-[1400px] mx-auto pt-[20px] text-center text-[0.9rem]">
        <p>&copy; {new Date().getFullYear()} CinemaTM. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
