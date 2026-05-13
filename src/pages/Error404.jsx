import { Link } from "react-router-dom";
import { BiHomeAlt } from "react-icons/bi";

function Error404() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0b0c10] relative overflow-hidden">
      <div className="text-center z-10 animate-fadeIn max-w-lg p-10 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl mx-4">
        <h1 className="text-8xl md:text-9xl font-black bg-gradient-to-br from-white to-[#00c3ff] bg-clip-text text-transparent tracking-tighter">
          404
        </h1>
        <div className="w-12 h-1 bg-[#00c3ff] mx-auto my-6 rounded-full"></div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
          Page Not Found
        </h2>
        <p className="text-gray-400 leading-relaxed mb-8">
          The movie or page you are looking for might have been removed, 
          had its name changed, or is temporarily unavailable.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-3 bg-white text-black px-8 py-3 rounded-full font-bold transition-all duration-300 hover:bg-[#00c3ff] hover:text-white hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,195,255,0.4)] group"
        >
          <BiHomeAlt size={22} className="transition-transform group-hover:scale-110" /> Back to Home
        </Link>
      </div>
      
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00c3ff]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-20 -right-20 w-[300px] h-[300px] bg-[#57EBDE]/5 rounded-full blur-[80px] pointer-events-none"></div>
    </div>
  );
}

export default Error404;