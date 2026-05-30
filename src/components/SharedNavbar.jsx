import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NAV_STYLE = `
  .sn-link { transition: color .18s ease; cursor: pointer; user-select: none; }
  .sn-link:hover { color: #006FD6 !important; }
  .sn-tap { cursor: pointer; border: none; outline: none; transition: transform .13s ease, opacity .14s ease; background: none; }
  .sn-tap:hover  { opacity: .88; }
  .sn-tap:active { transform: scale(.95); }
  .sn-glass {
    backdrop-filter: blur(28px) saturate(200%) !important;
    -webkit-backdrop-filter: blur(28px) saturate(200%) !important;
    background: rgba(247,247,249,.9) !important;
    border-bottom: 1px solid rgba(0,0,0,.07) !important;
  }
`;

const LINKS = [
  { label: "Home",     path: "/"         },
  { label: "Products", path: "/products" },
  { label: "Cart",     path: "/cart"     },
  { label: "Login",    path: "/login"    },
];

export default function SharedNavbar({ cartCount = 0 }) {
  const navigate   = useNavigate();
  const location   = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 14);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const go = (path) => { navigate(path); setMenuOpen(false); };

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      <style>{NAV_STYLE}</style>
      <nav
        className={scrolled ? "sn-glass" : ""}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
          padding: "0 28px",
          background: scrolled ? undefined : "rgba(247,247,249,.95)",
          borderBottom: scrolled ? undefined : "1px solid rgba(0,0,0,.07)",
          transition: "all .35s ease",
          fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", height: 60,
          display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* ── Logo ── */}
          <span
            onClick={() => go("/")}
            style={{ fontSize: 21, fontWeight: 800, color: "#1C1C1E",
              letterSpacing: "-0.6px", cursor: "pointer", userSelect: "none" }}
          >
            Shop<span style={{ color: "#006FD6" }}>BD</span>
          </span>

          {/* ── Desktop links ── */}
          <div style={{ display: "flex", gap: 28, alignItems: "center",
            "@media(maxWidth:640px)": { display: "none" } }}>
            {LINKS.map(({ label, path }) => (
              <span
                key={label}
                className="sn-link"
                onClick={() => go(path)}
                style={{
                  fontSize: 14, fontWeight: isActive(path) ? 700 : 500,
                  color: isActive(path) ? "#006FD6" : "#1C1C1E",
                  borderBottom: isActive(path) ? "2px solid #006FD6" : "2px solid transparent",
                  paddingBottom: 2,
                }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* ── Icons ── */}
          <div style={{ display: "flex", gap: 7, alignItems: "center" }}>

            {/* Search */}
            <button className="sn-tap"
              style={{ width: 38, height: 38, borderRadius: 19,
                background: "rgba(0,0,0,.05)", display: "flex",
                alignItems: "center", justifyContent: "center", color: "#1C1C1E" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>

            {/* Cart */}
            <button className="sn-tap"
              onClick={() => go("/cart")}
              style={{ width: 38, height: 38, borderRadius: 19,
                background: "rgba(0,0,0,.05)", display: "flex",
                alignItems: "center", justifyContent: "center",
                color: "#1C1C1E", position: "relative" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M1 1.5H3.2L4.8 10H13L15 4H5.5"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="7" cy="13.5" r="1.5" fill="currentColor"/>
                <circle cx="12" cy="13.5" r="1.5" fill="currentColor"/>
              </svg>
              {cartCount > 0 && (
                <span style={{
                  position: "absolute", top: -2, right: -2,
                  minWidth: 17, height: 17, padding: "0 4px",
                  borderRadius: 9, background: "#FF3B30", color: "white",
                  fontSize: 9, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "2px solid #F7F7F9",
                }}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Login */}
            <button className="sn-tap"
              onClick={() => go("/login")}
              style={{
                padding: "8px 16px", borderRadius: 22,
                background: isActive("/login") ? "#006FD6" : "rgba(0,0,0,.05)",
                color: isActive("/login") ? "white" : "#1C1C1E",
                fontSize: 13, fontWeight: 600,
              }}>
              Login
            </button>

            {/* Hamburger */}
            <button className="sn-tap"
              style={{ width: 38, height: 38, borderRadius: 19,
                background: "rgba(0,0,0,.05)", display: "flex",
                alignItems: "center", justifyContent: "center", color: "#1C1C1E" }}
              onClick={() => setMenuOpen(v => !v)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                {menuOpen
                  ? <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  : <path d="M2 4H14M2 8H14M2 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>}
              </svg>
            </button>
          </div>
        </div>

        {/* ── Mobile dropdown ── */}
        {menuOpen && (
          <div style={{
            background: "rgba(247,247,249,.97)", backdropFilter: "blur(28px)",
            padding: "6px 28px 20px", borderTop: "1px solid rgba(0,0,0,.06)",
          }}>
            {LINKS.map(({ label, path }) => (
              <div key={label} onClick={() => go(path)}
                style={{
                  padding: "14px 0", fontSize: 16, fontWeight: 500,
                  color: isActive(path) ? "#006FD6" : "#1C1C1E",
                  borderBottom: "1px solid rgba(0,0,0,.05)", cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                {label}
                {isActive(path) && <span style={{ marginLeft: 8, fontSize: 12 }}>●</span>}
              </div>
            ))}
            <div onClick={() => go("/admin")}
              style={{ padding: "14px 0", fontSize: 16, fontWeight: 500,
                color: "#FF9500", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif" }}>
              ⚙️ Admin Panel
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
