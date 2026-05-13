import { useParams, Link } from "react-router-dom";
import moviesGridImg from "../assets/movies grid.jfif";

function Authentication() {
  const { method } = useParams();
  const isRegister = method === "register";

  return (
    <section className="relative min-h-screen lg:mt-[10vh] flex items-center justify-center p-4">
      {/* Background Image Grid */}
      <div 
        className="absolute inset-0 z-0 overflow-hidden"
        style={{
          backgroundImage: `url('${moviesGridImg}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.4)',
          maskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)"
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative z-10 w-full max-w-[450px] p-8 md:p-16 rounded-[4px] bg-black/40 backdrop-blur-[5px] rounded-xl flex flex-col gap-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white text-left">
          {isRegister ? "Sign Up" : "Sign In"}
        </h1>

        <form className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Email or phone number"
              className="w-full rounded-full border border-[var(--accent-blue)] bg-black/20 text-white outline-none p-4 rounded-[4px] transition-all"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-full border border-[var(--accent-blue)] bg-black/20 text-white outline-none p-4 rounded-[4px] transition-all"
            />
            {isRegister && (
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full rounded-full border border-[var(--accent-blue)] bg-black/20 text-white outline-none p-4 rounded-[4px] transition-all"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-[var(--accent-blue)] hover:bg-[var(--accent-hover)] text-white font-bold py-3 mt-6 rounded-[4px] transition-all duration-300"
          >
            {isRegister ? "Sign Up" : "Sign In"}
          </button>

          {!isRegister && (
            <div className="flex items-center justify-between text-[#b3b3b3] text-sm mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-[#b3b3b3]" defaultChecked />
                <span>Remember me</span>
              </label>
              <a href="#" className="hover:underline">Forgot password?</a>
            </div>
          )}
        </form>

        <div className="flex flex-col gap-4 mt-4">
          <p className="text-[#737373] text-base">
            {isRegister ? "Already have an account?" : "New to CinemaTM?"}
            <Link
              to={isRegister ? "/authenticate/log-in" : "/authenticate/register"}
              className="text-white hover:underline ml-2"
              onClick={() => window.scrollTo({ top: 0 })}
            >
              {isRegister ? "Sign in now" : "Sign up now"}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Authentication;
