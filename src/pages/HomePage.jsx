import { useState, useEffect, useRef } from "react";
import SharedNavbar from '../components/SharedNavbar';

/* ─────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────── */
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&family=Hind+Siliguri:wght@400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #F7F7F9;
  color: #1C1C1E;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.bn { font-family: 'Hind Siliguri', sans-serif; }

::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #D1D1D6; border-radius: 4px; }

/* ── Skeleton shimmer ── */
@keyframes shimmer {
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
}
.sk {
  background: linear-gradient(90deg, #EFEFEF 0px, #E4E4E4 200px, #EFEFEF 400px);
  background-size: 600px 100%;
  animation: shimmer 1.5s infinite linear;
  border-radius: 10px;
}

/* ── Page entrance ── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0);    }
}
.fu  { animation: fadeUp .65s cubic-bezier(.22,1,.36,1) both; }
.fu1 { animation: fadeUp .65s .07s  cubic-bezier(.22,1,.36,1) both; }
.fu2 { animation: fadeUp .65s .14s  cubic-bezier(.22,1,.36,1) both; }
.fu3 { animation: fadeUp .65s .21s  cubic-bezier(.22,1,.36,1) both; }
.fu4 { animation: fadeUp .65s .28s  cubic-bezier(.22,1,.36,1) both; }
.fu5 { animation: fadeUp .65s .35s  cubic-bezier(.22,1,.36,1) both; }
.fu6 { animation: fadeUp .65s .42s  cubic-bezier(.22,1,.36,1) both; }

/* ── Float ── */
@keyframes float {
  0%,100% { transform: translateY(0px); }
  50%      { transform: translateY(-7px); }
}
.float { animation: float 3.6s ease-in-out infinite; }

/* ── Scroll dot ── */
@keyframes scrollDot {
  0%   { transform: translateY(0);   opacity: 1;   }
  60%  { transform: translateY(7px); opacity: 0;   }
  61%  { transform: translateY(0);   opacity: 0;   }
  100% { transform: translateY(0);   opacity: 1;   }
}
.scroll-dot { animation: scrollDot 2.2s ease-in-out infinite; }

/* ── Cart icon bounce on add ── */
@keyframes cartPop {
  0%   { transform: scale(1);    }
  30%  { transform: scale(1.38); }
  65%  { transform: scale(.88);  }
  100% { transform: scale(1);    }
}
.cart-pop { animation: cartPop .42s cubic-bezier(.22,1,.36,1); }

/* ── Card hover lift ── */
.card-lift {
  transition: transform .34s cubic-bezier(.34,1.2,.64,1), box-shadow .34s ease;
  will-change: transform;
}
.card-lift:hover {
  transform: translateY(-9px);
  box-shadow: 0 22px 60px rgba(0,0,0,.11);
}

/* ── Tap feedback ── */
.tap {
  cursor: pointer; border: none; outline: none;
  transition: transform .14s ease, opacity .14s ease;
}
.tap:hover  { opacity: .88; }
.tap:active { transform: scale(.95) !important; }

/* ── Glass nav ── */
.glass-nav {
  backdrop-filter: blur(28px) saturate(200%) !important;
  -webkit-backdrop-filter: blur(28px) saturate(200%) !important;
  background: rgba(247,247,249,.9) !important;
  border-bottom: 1px solid rgba(0,0,0,.07) !important;
}

/* ── Horizontal scroll strip ── */
.hstrip {
  overflow-x: auto; scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}
.hstrip::-webkit-scrollbar { display: none; }

/* ── Category pill ── */
.pill { transition: background .22s ease, color .22s ease, box-shadow .22s ease, transform .2s cubic-bezier(.34,1.2,.64,1); }
.pill:hover { transform: translateY(-2px); }

/* ── Nav link ── */
.nav-link { transition: color .18s ease; }
.nav-link:hover { color: #006FD6 !important; }

/* ── Responsive ── */
@media (max-width: 640px) {
  .hide-sm { display: none !important; }
}
@media (min-width: 641px) {
  .show-sm { display: none !important; }
}
`;

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const CATS = [
  { id:"all",         en:"All",           bn:"সকল",              ic:null  },
  { id:"electronics", en:"Electronics",   bn:"ইলেকট্রনিক্স",     ic:"⚡"  },
  { id:"clothing",    en:"Clothing",      bn:"পোশাক",             ic:"👗"  },
  { id:"food",        en:"Food",          bn:"খাবার",              ic:"🍱"  },
  { id:"home",        en:"Home & Living", bn:"গৃহস্থালি",          ic:"🏠"  },
  { id:"beauty",      en:"Beauty",        bn:"সৌন্দর্য",           ic:"✨"  },
  { id:"sports",      en:"Sports",        bn:"খেলাধুলা",           ic:"⚽"  },
];

const PRODS = [
  { id:1, en:"Wireless Earbuds Pro",   bn:"ওয়্যারলেস ইয়ারবাড প্রো",    p:1299, o:1799, cat:"electronics", r:4.8, rv:248, bg:"#EEF2FF", ic:"🎧", badge:"Best Seller" },
  { id:2, en:"Smart LED Watch",        bn:"স্মার্ট এলইডি ঘড়ি",           p:2499, o:3200, cat:"electronics", r:4.6, rv:156, bg:"#F0F9FF", ic:"⌚", badge:"New"         },
  { id:3, en:"Premium Cotton Kurta",   bn:"প্রিমিয়াম কটন কুর্তা",        p:799,  o:1199, cat:"clothing",    r:4.9, rv:312, bg:"#FFF7ED", ic:"👗", badge:"Top Rated"   },
  { id:4, en:"Organic Honey 500g",     bn:"অর্গানিক মধু ৫০০ গ্রাম",       p:349,  o:450,  cat:"food",        r:4.7, rv:89,  bg:"#FFFBEB", ic:"🍯", badge:null          },
  { id:5, en:"Minimalist Desk Lamp",   bn:"মিনিমালিস্ট ডেস্ক ল্যাম্প",    p:1599, o:2100, cat:"home",        r:4.5, rv:67,  bg:"#F0FDF4", ic:"💡", badge:null          },
  { id:6, en:"Vitamin C Serum",        bn:"ভিটামিন সি সিরাম",              p:599,  o:850,  cat:"beauty",      r:4.8, rv:445, bg:"#FDF4FF", ic:"✨", badge:"Hot"         },
  { id:7, en:"Yoga Mat Premium",       bn:"প্রিমিয়াম যোগব্যায়াম ম্যাট",  p:1099, o:1500, cat:"sports",      r:4.6, rv:178, bg:"#F0FDF4", ic:"🧘", badge:null          },
  { id:8, en:"Leather Wallet",         bn:"লেদার ওয়ালেট",                  p:699,  o:999,  cat:"clothing",    r:4.7, rv:203, bg:"#FFF7ED", ic:"👜", badge:null          },
];

const BADGE_COL = {
  "Best Seller":"#34C759", "New":"#006FD6",
  "Top Rated":"#FF9500",   "Hot":"#FF3B30",
};

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function Stars({ r }) {
  return (
    <span style={{ display:"flex", gap:2 }}>
      {[1,2,3,4,5].map(i=>(
        <svg key={i} width="11" height="11" viewBox="0 0 11 11"
          fill={i<=Math.round(r)?"#FF9500":"#E5E5EA"}>
          <path d="M5.5.9 6.8 3.8H10L7.5 5.7l.9 3L5.5 7 2.6 8.7l.9-3L1 3.8h3.2z"/>
        </svg>
      ))}
    </span>
  );
}

/* ─────────────────────────────────────────
   SKELETON CARD
───────────────────────────────────────── */
function SkCard() {
  return (
    <div style={{ background:"white", borderRadius:22, overflow:"hidden",
      boxShadow:"0 2px 14px rgba(0,0,0,.05)" }}>
      <div className="sk" style={{ height:180 }}/>
      <div style={{ padding:16, display:"flex", flexDirection:"column", gap:9 }}>
        <div className="sk" style={{ height:13, width:"70%" }}/>
        <div className="sk" style={{ height:12, width:"50%" }}/>
        <div className="sk" style={{ height:11, width:"34%", marginTop:2 }}/>
        <div className="sk" style={{ height:38, borderRadius:12, marginTop:6 }}/>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────── */
function PCard({ prod, onAdd, added }) {
  const disc = Math.round(((prod.o - prod.p) / prod.o) * 100);
  return (
    <div className="card-lift" style={{ background:"white", borderRadius:22, overflow:"hidden",
      boxShadow:"0 2px 14px rgba(0,0,0,.05)" }}>

      {/* ── Image area ── */}
      <div style={{ background:prod.bg, height:180, position:"relative",
        display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
        <span style={{ fontSize:56 }} className="float">{prod.ic}</span>

        {prod.badge && (
          <span style={{ position:"absolute", top:11, left:11,
            background:BADGE_COL[prod.badge], color:"white",
            fontSize:9, fontWeight:700, padding:"3px 9px", borderRadius:20 }}>
            {prod.badge}
          </span>
        )}
        <span style={{ position:"absolute", top:11, right:11,
          background:"rgba(255,255,255,.88)", color:"#FF3B30",
          fontSize:9, fontWeight:700, padding:"3px 8px", borderRadius:20,
          backdropFilter:"blur(8px)" }}>
          -{disc}%
        </span>
      </div>

      {/* ── Details ── */}
      <div style={{ padding:"14px 16px 16px" }}>
        <p style={{ fontSize:13, fontWeight:600, color:"#1C1C1E", lineHeight:1.35, marginBottom:3 }}>
          {prod.en}
        </p>
        <p className="bn" style={{ fontSize:12, color:"#6C6C70", marginBottom:9 }}>{prod.bn}</p>

        <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:10 }}>
          <Stars r={prod.r}/>
          <span style={{ fontSize:10, color:"#8E8E93" }}>{prod.r} ({prod.rv})</span>
        </div>

        <div style={{ display:"flex", alignItems:"baseline", gap:8, marginBottom:13 }}>
          <span style={{ fontSize:17, fontWeight:700, color:"#1C1C1E" }}>
            ৳{prod.p.toLocaleString()}
          </span>
          <span style={{ fontSize:11, color:"#AEAEB2", textDecoration:"line-through" }}>
            ৳{prod.o.toLocaleString()}
          </span>
        </div>

        <button className="tap"
          onClick={() => onAdd(prod)}
          style={{
            width:"100%", padding:"10px 0",
            background: added ? "#34C759" : "#006FD6",
            color:"white", borderRadius:13,
            fontSize:13, fontWeight:600,
            display:"flex", alignItems:"center", justifyContent:"center", gap:7,
            transition:"background .2s ease",
          }}>
          {added ? (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7L5.5 10.5L12 3.5" stroke="white" strokeWidth="1.9"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Added!
            </>
          ) : (
            <><span style={{fontSize:16,lineHeight:1}}>+</span> Add to Cart</>
          )}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN APP
───────────────────────────────────────── */
export default function HomePage() {
  const [loading,    setLoading]    = useState(true);
  const [cat,        setCat]        = useState("all");
  const [cart,       setCart]       = useState([]);
  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [addedId,    setAddedId]    = useState(null);
  const [cartAnim,   setCartAnim]   = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 14);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const addToCart = p => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      return ex
        ? prev.map(i => i.id===p.id ? {...i, qty:i.qty+1} : i)
        : [...prev, {...p, qty:1}];
    });
    setAddedId(p.id);
    setCartAnim(n => n + 1);
    setTimeout(() => setAddedId(null), 1500);
  };

  const cartTotal = cart.reduce((s,i) => s + i.qty, 0);
  const filtered  = cat === "all" ? PRODS : PRODS.filter(p => p.cat === cat);

  return (
    <>
      <style>{STYLE}</style>
      <div style={{ background:"#F7F7F9", minHeight:"100vh" }}>

        {/* ══════════════════════ NAVBAR ══════════════════════ */}
        <nav
          className={scrolled ? "glass-nav" : ""}
          style={{
            position:"fixed", top:0, left:0, right:0, zIndex:200,
            padding:"0 28px",
            background: scrolled ? undefined : "transparent",
            borderBottom: scrolled ? undefined : "1px solid transparent",
            transition:"all .35s ease",
          }}
        >
          <div style={{ maxWidth:1200, margin:"0 auto", height:60,
            display:"flex", alignItems:"center", justifyContent:"space-between" }}>

            {/* Logo */}
            <span style={{ fontSize:21, fontWeight:800, color:"#1C1C1E",
              letterSpacing:"-0.6px", userSelect:"none" }}>
              Shop<span style={{ color:"#006FD6" }}>BD</span>
            </span>

            {/* Desktop nav */}
            <div className="hide-sm" style={{ display:"flex", gap:30, alignItems:"center" }}>
              {["Home","Products","About","Contact"].map(l => (
                <span key={l} className="nav-link"
                  style={{ fontSize:14, fontWeight:500, color:"#1C1C1E", cursor:"pointer" }}>
                  {l}
                </span>
              ))}
            </div>

            {/* Icons */}
            <div style={{ display:"flex", alignItems:"center", gap:7 }}>
              {/* Search */}
              <button className="tap" style={{ width:38, height:38, borderRadius:19,
                background:"rgba(0,0,0,.05)", display:"flex", alignItems:"center",
                justifyContent:"center", color:"#1C1C1E" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>

              {/* Cart with bounce */}
              <button key={cartAnim} className={`tap${cartAnim>0?" cart-pop":""}`}
                style={{ width:38, height:38, borderRadius:19,
                  background:"rgba(0,0,0,.05)", display:"flex", alignItems:"center",
                  justifyContent:"center", color:"#1C1C1E", position:"relative" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M1 1.5H3.2L4.8 10H13L15 4H5.5"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="7" cy="13.5" r="1.5" fill="currentColor"/>
                  <circle cx="12" cy="13.5" r="1.5" fill="currentColor"/>
                </svg>
                {cartTotal > 0 && (
                  <span style={{
                    position:"absolute", top:-2, right:-2,
                    minWidth:17, height:17, padding:"0 4px",
                    borderRadius:9, background:"#FF3B30",
                    color:"white", fontSize:9, fontWeight:700,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    border:"2px solid #F7F7F9",
                  }}>{cartTotal}</span>
                )}
              </button>

              {/* Hamburger */}
              <button className="tap"
                style={{ width:38, height:38, borderRadius:19,
                  background:"rgba(0,0,0,.05)", display:"flex", alignItems:"center",
                  justifyContent:"center", color:"#1C1C1E" }}
                onClick={() => setMenuOpen(v => !v)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  {menuOpen
                    ? <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    : <path d="M2 4H14M2 8H14M2 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile dropdown */}
          {menuOpen && (
            <div style={{ background:"rgba(247,247,249,.97)", backdropFilter:"blur(28px)",
              padding:"6px 28px 22px", borderTop:"1px solid rgba(0,0,0,.06)",
              animation:"fadeUp .28s ease both" }}>
              {["Home","Products","About","Contact"].map(l => (
                <div key={l} onClick={() => setMenuOpen(false)}
                  style={{ padding:"14px 0", fontSize:16, fontWeight:500, color:"#1C1C1E",
                    borderBottom:"1px solid rgba(0,0,0,.05)", cursor:"pointer" }}>
                  {l}
                </div>
              ))}
            </div>
          )}
        </nav>

        {/* ══════════════════════ HERO ══════════════════════ */}
        <section style={{
          minHeight:"100vh",
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
          padding:"88px 28px 72px", textAlign:"center",
          background:"radial-gradient(ellipse 85% 65% at 50% 10%, rgba(0,111,214,.06) 0%, transparent 72%)",
          position:"relative", overflow:"hidden",
        }}>
          {/* Ambient blobs */}
          <div style={{ position:"absolute", top:"8%", right:"6%", width:260, height:260, pointerEvents:"none",
            background:"radial-gradient(circle, rgba(0,111,214,.055) 0%, transparent 70%)", borderRadius:"50%" }}/>
          <div style={{ position:"absolute", bottom:"18%", left:"2%", width:200, height:200, pointerEvents:"none",
            background:"radial-gradient(circle, rgba(52,199,89,.05) 0%, transparent 70%)", borderRadius:"50%" }}/>
          <div style={{ position:"absolute", top:"40%", left:"10%", width:120, height:120, pointerEvents:"none",
            background:"radial-gradient(circle, rgba(255,149,0,.05) 0%, transparent 70%)", borderRadius:"50%" }}/>

          <div style={{ maxWidth:620, width:"100%", position:"relative" }}>

            {/* Badge */}
            <div className="fu" style={{ display:"inline-flex", alignItems:"center", gap:8,
              background:"rgba(0,111,214,.07)", border:"1px solid rgba(0,111,214,.14)",
              padding:"7px 18px", borderRadius:24, marginBottom:30 }}>
              <span>🛍️</span>
              <span className="bn" style={{ fontSize:13, fontWeight:600, color:"#006FD6" }}>
                বাংলাদেশের প্রিমিয়াম অনলাইন স্টোর
              </span>
            </div>

            {/* Headline */}
            <h1 className="fu1 bn" style={{
              fontSize:"clamp(32px, 7vw, 58px)",
              fontWeight:700, color:"#1C1C1E",
              lineHeight:1.18, marginBottom:18,
              letterSpacing:"-0.5px",
            }}>
              আপনার প্রিয় পণ্য,<br/>
              <span style={{ color:"#006FD6" }}>এখন দোরগোড়ায়</span>
            </h1>

            {/* Subtext */}
            <p className="fu2" style={{
              fontSize:"clamp(14px, 2.5vw, 17px)",
              color:"#6C6C70", lineHeight:1.72,
              maxWidth:450, margin:"0 auto 40px",
            }}>
              Shop thousands of quality products with fast delivery.
              Pay with{" "}
              <strong style={{ color:"#1C1C1E" }}>Cash on Delivery</strong>,{" "}
              <strong style={{ color:"#E2146C" }}>bKash</strong> or{" "}
              <strong style={{ color:"#F5820D" }}>Nagad</strong>.
            </p>

            {/* CTAs */}
            <div className="fu3" style={{
              display:"flex", gap:12, justifyContent:"center",
              flexWrap:"wrap", marginBottom:60,
            }}>
              <button className="tap" style={{
                padding:"14px 34px",
                background:"#006FD6", color:"white",
                borderRadius:15, fontSize:15, fontWeight:600,
                boxShadow:"0 6px 26px rgba(0,111,214,.32)",
              }}>
                Shop Now →
              </button>
              <button className="tap" style={{
                padding:"14px 28px",
                background:"rgba(0,0,0,.05)", color:"#1C1C1E",
                borderRadius:15, fontSize:15, fontWeight:600,
                border:"1.5px solid rgba(0,0,0,.09)",
              }}>
                Browse All
              </button>
            </div>

            {/* Trust stats */}
            <div className="fu4" style={{
              display:"flex", justifyContent:"center",
              gap:"clamp(22px, 5vw, 60px)", flexWrap:"wrap",
            }}>
              {[
                ["50K+",  "পণ্য",      "Products"],
                ["10K+",  "গ্রাহক",    "Customers"],
                ["৳0",    "COD চার্জ", "COD Charge"],
              ].map(([n,bn,en]) => (
                <div key={n} style={{ textAlign:"center" }}>
                  <p style={{ fontSize:24, fontWeight:800, color:"#1C1C1E", letterSpacing:"-0.6px" }}>{n}</p>
                  <p className="bn" style={{ fontSize:12, color:"#6C6C70", lineHeight:1.3 }}>{bn}</p>
                  <p style={{ fontSize:11, color:"#8E8E93" }}>{en}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll indicator */}
          <div style={{ position:"absolute", bottom:34, left:"50%", transform:"translateX(-50%)",
            display:"flex", flexDirection:"column", alignItems:"center", gap:7 }}>
            <span style={{ fontSize:9, color:"#C7C7CC", letterSpacing:2, textTransform:"uppercase" }}>
              Scroll
            </span>
            <div style={{ width:23, height:38, border:"1.5px solid rgba(0,0,0,.1)", borderRadius:12,
              display:"flex", justifyContent:"center", paddingTop:7 }}>
              <div className="scroll-dot" style={{ width:4, height:7, background:"#C7C7CC", borderRadius:2 }}/>
            </div>
          </div>
        </section>

        {/* ══════════════════════ TRUST BAR ══════════════════════ */}
        <div style={{ background:"white", borderTop:"1px solid rgba(0,0,0,.06)",
          borderBottom:"1px solid rgba(0,0,0,.06)", padding:"20px 28px" }}>
          <div style={{ maxWidth:960, margin:"0 auto", display:"flex",
            justifyContent:"space-around", gap:16, flexWrap:"wrap" }}>
            {[
              { ic:"💵", en:"Cash on Delivery", bn:"ক্যাশ অন ডেলিভারি", c:"#34C759" },
              { ic:"💳", en:"bKash Accepted",   bn:"বিকাশ পেমেন্ট",     c:"#E2146C" },
              { ic:"📲", en:"Nagad Accepted",   bn:"নগদ পেমেন্ট",       c:"#F5820D" },
              { ic:"🚚", en:"Fast Delivery",    bn:"দ্রুত ডেলিভারি",    c:"#006FD6" },
              { ic:"🔄", en:"Easy Returns",     bn:"সহজ রিটার্ন",       c:"#FF9500" },
            ].map(b => (
              <div key={b.en} style={{ display:"flex", alignItems:"center", gap:11, flexShrink:0 }}>
                <div style={{ width:38, height:38, borderRadius:11,
                  background:b.c+"1A",
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>
                  {b.ic}
                </div>
                <div>
                  <p style={{ fontSize:12, fontWeight:600, color:"#1C1C1E", lineHeight:1.35 }}>{b.en}</p>
                  <p className="bn" style={{ fontSize:11, color:"#6C6C70", lineHeight:1.2 }}>{b.bn}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════ CATEGORIES ══════════════════════ */}
        <section style={{ padding:"52px 28px 28px" }}>
          <div style={{ maxWidth:1200, margin:"0 auto" }}>

            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
              <h2 style={{ fontSize:23, fontWeight:700, color:"#1C1C1E", margin:0 }}>
                Browse Categories
              </h2>
              <span className="bn" style={{ fontSize:15, color:"#8E8E93" }}>বিভাগ দেখুন</span>
            </div>

            <div className="hstrip" style={{ display:"flex", gap:10, paddingBottom:4 }}>
              {CATS.map(c => (
                <button key={c.id} className="tap pill"
                  onClick={() => setCat(c.id)}
                  style={{
                    flexShrink:0, padding:"9px 20px", borderRadius:26,
                    background: cat===c.id ? "#006FD6" : "white",
                    color:       cat===c.id ? "white"    : "#1C1C1E",
                    border:      cat===c.id
                      ? "2px solid transparent"
                      : "2px solid rgba(0,0,0,.09)",
                    fontSize:13, fontWeight:500, whiteSpace:"nowrap",
                    boxShadow: cat===c.id
                      ? "0 4px 18px rgba(0,111,214,.26)"
                      : "0 1px 5px rgba(0,0,0,.04)",
                  }}>
                  {c.ic && <span style={{ marginRight:5 }}>{c.ic}</span>}
                  {c.en}
                  <span className="bn" style={{ fontSize:11, opacity:.58, marginLeft:3 }}>/{c.bn}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════ PRODUCTS ══════════════════════ */}
        <section style={{ padding:"8px 28px 70px" }}>
          <div style={{ maxWidth:1200, margin:"0 auto" }}>

            <div style={{ display:"flex", alignItems:"center",
              justifyContent:"space-between", marginBottom:24 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <h2 style={{ fontSize:23, fontWeight:700, color:"#1C1C1E", margin:0 }}>
                  {cat==="all" ? "Featured Products" : CATS.find(c=>c.id===cat)?.en}
                </h2>
                <span className="bn" style={{ fontSize:15, color:"#8E8E93" }}>
                  {cat==="all" ? "জনপ্রিয় পণ্য" : CATS.find(c=>c.id===cat)?.bn}
                </span>
              </div>
              <span style={{ fontSize:13, color:"#006FD6", cursor:"pointer",
                fontWeight:600, flexShrink:0 }}>
                View All →
              </span>
            </div>

            <div style={{
              display:"grid",
              gridTemplateColumns:"repeat(auto-fill, minmax(min(100%, 215px), 1fr))",
              gap:18,
            }}>
              {loading
                ? [1,2,3,4,5,6,7,8].map(i => <SkCard key={i}/>)
                : filtered.map(p => (
                    <PCard key={p.id} prod={p} onAdd={addToCart} added={addedId===p.id}/>
                  ))
              }
            </div>

            {!loading && filtered.length === 0 && (
              <div style={{ textAlign:"center", padding:"80px 0" }}>
                <p style={{ fontSize:50, marginBottom:12 }}>🔍</p>
                <p style={{ fontSize:17, fontWeight:600, color:"#1C1C1E", marginBottom:5 }}>
                  No Products Found
                </p>
                <p className="bn" style={{ fontSize:14, color:"#8E8E93" }}>
                  এই বিভাগে এখনো কোনো পণ্য নেই
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ══════════════════════ PROMO BANNER ══════════════════════ */}
        <section style={{ padding:"0 28px 70px" }}>
          <div style={{
            maxWidth:1200, margin:"0 auto",
            background:"linear-gradient(135deg, #006FD6 0%, #004EA8 100%)",
            borderRadius:30, overflow:"hidden", position:"relative",
            padding:"clamp(34px,6vw,54px) clamp(26px,5vw,64px)",
            display:"flex", alignItems:"center",
            justifyContent:"space-between", flexWrap:"wrap", gap:26,
          }}>
            {/* Decorative orbs */}
            <div style={{ position:"absolute", top:-55, right:-55, width:260, height:260,
              background:"rgba(255,255,255,.06)", borderRadius:"50%" }}/>
            <div style={{ position:"absolute", bottom:-70, right:110, width:200, height:200,
              background:"rgba(255,255,255,.04)", borderRadius:"50%" }}/>

            <div style={{ position:"relative" }}>
              <p className="bn" style={{ fontSize:13, color:"rgba(255,255,255,.62)", marginBottom:9 }}>
                সীমিত সময়ের অফার
              </p>
              <h3 style={{ fontSize:"clamp(22px,4vw,34px)", fontWeight:800,
                color:"white", lineHeight:1.2, marginBottom:9 }}>
                Free Delivery on<br/>Orders Over ৳500
              </h3>
              <p className="bn" style={{ fontSize:14, color:"rgba(255,255,255,.72)" }}>
                ৳৫০০-এর উপরে অর্ডারে বিনামূল্যে ডেলিভারি
              </p>
            </div>

            <button className="tap" style={{
              position:"relative",
              padding:"15px 34px",
              background:"white", color:"#006FD6",
              borderRadius:15, fontSize:15, fontWeight:700, flexShrink:0,
              boxShadow:"0 10px 28px rgba(0,0,0,.18)",
            }}>
              Shop Now →
            </button>
          </div>
        </section>

        {/* ══════════════════════ HOW IT WORKS ══════════════════════ */}
        <section style={{ padding:"0 28px 76px" }}>
          <div style={{ maxWidth:920, margin:"0 auto" }}>

            <div style={{ textAlign:"center", marginBottom:42 }}>
              <h2 style={{ fontSize:23, fontWeight:700, color:"#1C1C1E", marginBottom:6 }}>
                How It Works
              </h2>
              <p className="bn" style={{ fontSize:15, color:"#8E8E93" }}>কীভাবে কাজ করে?</p>
            </div>

            <div style={{
              display:"grid",
              gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))",
              gap:16,
            }}>
              {[
                { s:"01", ic:"🔍", en:"Browse",       bn:"পণ্য খুঁজুন"  },
                { s:"02", ic:"🛒", en:"Add to Cart",   bn:"কার্টে দিন"   },
                { s:"03", ic:"📍", en:"Enter Address", bn:"ঠিকানা দিন"   },
                { s:"04", ic:"💳", en:"Pay Your Way",  bn:"পেমেন্ট দিন"  },
                { s:"05", ic:"📦", en:"Delivered!",    bn:"পণ্য পান"     },
              ].map(s => (
                <div key={s.s} style={{ background:"white", borderRadius:22,
                  padding:"26px 14px", textAlign:"center",
                  boxShadow:"0 2px 14px rgba(0,0,0,.05)",
                  border:"1px solid rgba(0,0,0,.04)" }}>
                  <span style={{ fontSize:30, display:"block", marginBottom:12 }}>{s.ic}</span>
                  <span style={{ fontSize:9, fontWeight:700, color:"#006FD6",
                    letterSpacing:1.6, textTransform:"uppercase" }}>
                    {s.s}
                  </span>
                  <p style={{ fontSize:12, fontWeight:600, color:"#1C1C1E",
                    margin:"7px 0 4px", lineHeight:1.35 }}>
                    {s.en}
                  </p>
                  <p className="bn" style={{ fontSize:11, color:"#8E8E93" }}>{s.bn}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════ FOOTER ══════════════════════ */}
        <footer style={{ background:"#1C1C1E", padding:"54px 28px 34px" }}>
          <div style={{ maxWidth:1200, margin:"0 auto" }}>

            <div style={{ display:"grid",
              gridTemplateColumns:"repeat(auto-fit, minmax(150px, 1fr))",
              gap:42, marginBottom:52 }}>

              {/* Brand */}
              <div>
                <p style={{ fontSize:21, fontWeight:800, color:"white",
                  marginBottom:14, letterSpacing:"-0.6px" }}>
                  Shop<span style={{ color:"#006FD6" }}>BD</span>
                </p>
                <p className="bn" style={{ fontSize:13, lineHeight:1.78,
                  color:"rgba(255,255,255,.48)", marginBottom:18 }}>
                  বাংলাদেশের সেরা অনলাইন শপিং প্ল্যাটফর্ম।<br/>দ্রুত ডেলিভারি, সেরা মূল্য।
                </p>
                <div style={{ display:"flex", gap:8 }}>
                  {[{l:"COD",c:"#34C759"},{l:"bKash",c:"#E2146C"},{l:"Nagad",c:"#F5820D"}].map(b=>(
                    <span key={b.l} style={{ fontSize:10, fontWeight:700,
                      padding:"4px 10px", borderRadius:8,
                      background:"rgba(255,255,255,.08)",
                      color:"rgba(255,255,255,.68)" }}>
                      {b.l}
                    </span>
                  ))}
                </div>
              </div>

              {[
                { t:"Shop",    ls:["All Products","New Arrivals","Best Sellers","Deals & Offers"] },
                { t:"Help",    ls:["Track Order","Returns & Refunds","FAQ","Contact Us"]          },
                { t:"Company", ls:["About Us","Privacy Policy","Terms of Use","Blog"]            },
              ].map(col => (
                <div key={col.t}>
                  <p style={{ fontSize:13, fontWeight:600, color:"white", marginBottom:17 }}>
                    {col.t}
                  </p>
                  {col.ls.map(l => (
                    <p key={l}
                      style={{ fontSize:13, marginBottom:12, cursor:"pointer",
                        color:"rgba(255,255,255,.52)", transition:"color .18s" }}
                      onMouseEnter={e => e.currentTarget.style.color = "white"}
                      onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,.52)"}
                    >{l}</p>
                  ))}
                </div>
              ))}
            </div>

            <div style={{ borderTop:"1px solid rgba(255,255,255,.08)", paddingTop:26,
              display:"flex", justifyContent:"space-between",
              alignItems:"center", flexWrap:"wrap", gap:12 }}>
              <p style={{ fontSize:12, color:"rgba(255,255,255,.38)" }}>
                © 2025 ShopBD. All rights reserved.
              </p>
              <div style={{ display:"flex", gap:22 }}>
                {["Privacy","Terms","Support"].map(l => (
                  <span key={l} style={{ fontSize:12, color:"rgba(255,255,255,.38)", cursor:"pointer" }}>
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
