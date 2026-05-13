import { useState, useEffect } from "react";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w92";

const REGIONS = [
  { code: "US", name: "🇺🇸 United States" },
  { code: "GB", name: "🇬🇧 United Kingdom" },
  { code: "CA", name: "🇨🇦 Canada" },
  { code: "AU", name: "🇦🇺 Australia" },
  { code: "DE", name: "🇩🇪 Germany" },
  { code: "FR", name: "🇫🇷 France" },
  { code: "JP", name: "🇯🇵 Japan" },
  { code: "IN", name: "🇮🇳 India" },
  { code: "BR", name: "🇧🇷 Brazil" },
  { code: "MX", name: "🇲🇽 Mexico" },
];

const TAB_KEYS = [
  { key: "flatrate", label: "Streaming" },
  { key: "rent",    label: "Rent" },
  { key: "buy",     label: "Buy" },
];

const dropdownCls =
  "bg-black/40 border border-white/10 text-white text-[0.82rem] px-3 py-[6px] rounded-full outline-none cursor-pointer appearance-none transition-all focus:border-[#00c3ff]";

function ProviderLogo({ provider }) {
  return (
    <div className="flex flex-col items-center gap-2 shrink-0 group/prov">
      <div className="w-[52px] h-[52px] rounded-[14px] overflow-hidden border border-white/10 shadow-md transition-all duration-300 group-hover/prov:border-[#00c3ff]/50 group-hover/prov:shadow-[0_0_16px_rgba(0,195,255,0.25)]">
        <img
          src={`${IMG_BASE}${provider.logo_path}`}
          alt={provider.provider_name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <span className="text-[0.62rem] text-gray-400 text-center max-w-[62px] leading-tight truncate">
        {provider.provider_name}
      </span>
    </div>
  );
}

function WatchProviders({ id, type }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState("US");
  const [activeTab, setActiveTab] = useState("flatrate");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${BASE_URL}/${type}/${id}/watch/providers?api_key=${API_KEY}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d.results || {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, type]);

  const regionData = data?.[region];
  const activeProviders = regionData?.[activeTab] || [];

  // find first tab that has content
  useEffect(() => {
    if (!regionData) return;
    const first = TAB_KEYS.find((t) => regionData[t.key]?.length > 0);
    if (first) setActiveTab(first.key);
  }, [region, regionData]);

  if (!loading && (!data || Object.keys(data).length === 0)) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="text-[1.8rem] font-bold text-white border-l-4 border-[#00c3ff] pl-[15px]">
          Where to Watch
        </h2>
        <select
          className={dropdownCls}
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          {REGIONS.map((r) => (
            <option key={r.code} value={r.code} className="bg-[#1a1c22]">
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {/* Glassmorphism card */}
      <div className="bg-white/[0.04] border border-white/10 rounded-[18px] p-5 backdrop-blur-sm shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
        {loading ? (
          <div className="flex gap-3 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-[52px] h-[52px] rounded-[14px] bg-white/10" />
            ))}
          </div>
        ) : !regionData ? (
          <p className="text-gray-500 text-[0.9rem]">
            Not available in{" "}
            <span className="text-white font-semibold">
              {REGIONS.find((r) => r.code === region)?.name || region}
            </span>
            .
          </p>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex gap-2 mb-5">
              {TAB_KEYS.map(({ key, label }) => {
                const count = regionData[key]?.length || 0;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    disabled={count === 0}
                    className={`px-4 py-[6px] rounded-full text-[0.8rem] font-semibold border transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                      activeTab === key
                        ? "bg-[#00c3ff] border-[#00c3ff] text-white shadow-[0_0_12px_rgba(0,195,255,0.4)]"
                        : "bg-transparent border-white/15 text-gray-400 hover:border-white/30"
                    }`}
                  >
                    {label}
                    {count > 0 && (
                      <span className="ml-1 text-[0.7rem] opacity-70">({count})</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Providers */}
            {activeProviders.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-1 [scrollbar-width:none]">
                {activeProviders.map((p) => (
                  <ProviderLogo key={p.provider_id} provider={p} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-[0.85rem]">No {TAB_KEYS.find(t=>t.key===activeTab)?.label.toLowerCase()} options available.</p>
            )}

            {/* JustWatch attribution */}
            {regionData.link && (
              <a
                href={regionData.link}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-[0.7rem] text-gray-600 hover:text-[#00c3ff] transition-colors no-underline"
              >
                Powered by JustWatch →
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default WatchProviders;
