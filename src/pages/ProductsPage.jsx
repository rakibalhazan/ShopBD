import { useState, useEffect, useMemo } from "react";

/* ─────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────── */
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=Hind+Siliguri:wght@400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin:0; font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif; background:#F7F7F9; color:#1C1C1E; -webkit-font-smoothing:antialiased; }
.bn  { font-family:'Hind Siliguri',sans-serif; }
::-webkit-scrollbar { width:4px; height:4px; }
::-webkit-scrollbar-thumb { background:#D1D1D6; border-radius:4px; }

@keyframes shimmer { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
.sk { background:linear-gradient(90deg,#EFEFEF 0px,#E4E4E4 200px,#EFEFEF 400px); background-size:600px; animation:shimmer 1.5s infinite linear; border-radius:10px; }

@keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn   { from{opacity:0}                            to{opacity:1}                         }
@keyframes slideUp  { from{transform:translateY(100%)}           to{transform:translateY(0)}           }
@keyframes dropDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
@keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
@keyframes cartPop  { 0%{transform:scale(1)} 30%{transform:scale(1.38)} 65%{transform:scale(.88)} 100%{transform:scale(1)} }

.fu     { animation:fadeUp  .55s cubic-bezier(.22,1,.36,1) both; }
.fu1    { animation:fadeUp  .55s .06s cubic-bezier(.22,1,.36,1) both; }
.fu2    { animation:fadeUp  .55s .12s cubic-bezier(.22,1,.36,1) both; }
.float  { animation:float   3.6s ease-in-out infinite; }
.drawer { animation:slideUp .32s cubic-bezier(.22,1,.36,1); }
.ovl    { animation:fadeIn  .22s ease; }
.ddrop  { animation:dropDown .2s  ease; }
.cart-pop { animation:cartPop .42s cubic-bezier(.22,1,.36,1); }

.card-lift { transition:transform .34s cubic-bezier(.34,1.2,.64,1),box-shadow .34s ease; will-change:transform; }
.card-lift:hover { transform:translateY(-9px); box-shadow:0 22px 60px rgba(0,0,0,.11); }

.tap { cursor:pointer; border:none; outline:none; transition:transform .14s ease,opacity .14s ease; }
.tap:hover  { opacity:.88; }
.tap:active { transform:scale(.95) !important; }

.glass-nav { backdrop-filter:blur(28px) saturate(200%) !important; -webkit-backdrop-filter:blur(28px) saturate(200%) !important; background:rgba(247,247,249,.9) !important; border-bottom:1px solid rgba(0,0,0,.07) !important; }
.nav-lnk   { transition:color .18s; cursor:pointer; }
.nav-lnk:hover { color:#006FD6 !important; }

.filt-opt  { cursor:pointer; transition:background .16s ease,color .16s ease; user-select:none; }
.filt-opt:hover { background:rgba(0,111,214,.07) !important; }

.pill-cat  { transition:all .2s cubic-bezier(.34,1.2,.64,1); cursor:pointer; }
.pill-cat:hover { transform:translateY(-2px); }

/* Layout */
.pl-wrap   { display:flex; gap:28px; align-items:flex-start; }
.pl-sidebar { width:240px; flex-shrink:0; position:sticky; top:84px; max-height:calc(100vh - 104px); overflow-y:auto; }
.pl-sidebar::-webkit-scrollbar { display:none; }
.pl-main   { flex:1; min-width:0; }

@media (max-width:768px) {
  .pl-sidebar  { display:none !important; }
  .hide-mob    { display:none !important; }
}
@media (min-width:769px) {
  .show-mob    { display:none !important; }
}
@media (max-width:540px) {
  .hide-xs { display:none !important; }
}
`;

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const CATS = [
  { id:"all",         en:"All",           bn:"সকল",          ic:null },
  { id:"electronics", en:"Electronics",   bn:"ইলেকট্রনিক্স", ic:"⚡" },
  { id:"clothing",    en:"Clothing",      bn:"পোশাক",         ic:"👗" },
  { id:"food",        en:"Food",          bn:"খাবার",          ic:"🍱" },
  { id:"home",        en:"Home & Living", bn:"গৃহস্থালি",      ic:"🏠" },
  { id:"beauty",      en:"Beauty",        bn:"সৌন্দর্য",       ic:"✨" },
  { id:"sports",      en:"Sports",        bn:"খেলাধুলা",       ic:"⚽" },
];

const PRICE_OPTS = [
  { id:"all",    en:"All Prices",       min:0,    max:Infinity },
  { id:"u500",   en:"Under ৳500",       min:0,    max:499      },
  { id:"500-1k", en:"৳500 – ৳1,000",   min:500,  max:1000     },
  { id:"1k-2k",  en:"৳1,000 – ৳2,000", min:1000, max:2000     },
  { id:"2k+",    en:"৳2,000 & above",  min:2000, max:Infinity  },
];

const RATING_OPTS = [
  { id:"all", en:"All Ratings", min:0   },
  { id:"4+",  en:"4★ & above", min:4   },
  { id:"3+",  en:"3★ & above", min:3   },
];

const SORT_OPTS = [
  { id:"popular",    en:"Most Popular"        },
  { id:"newest",     en:"Newest First"        },
  { id:"price-low",  en:"Price: Low to High"  },
  { id:"price-high", en:"Price: High to Low"  },
  { id:"top-rated",  en:"Top Rated"           },
];

const ALL_PRODS = [
  { id:1,  en:"Wireless Earbuds Pro",    bn:"ওয়্যারলেস ইয়ারবাড প্রো",      p:1299, o:1799, cat:"electronics", r:4.8, rv:248, bg:"#EEF2FF", ic:"🎧", badge:"Best Seller", isNew:false },
  { id:2,  en:"Smart LED Watch",         bn:"স্মার্ট এলইডি ঘড়ি",             p:2499, o:3200, cat:"electronics", r:4.6, rv:156, bg:"#F0F9FF", ic:"⌚", badge:"New",         isNew:true  },
  { id:9,  en:"Bluetooth Speaker",       bn:"ব্লুটুথ স্পিকার",               p:1899, o:2499, cat:"electronics", r:4.4, rv:89,  bg:"#EEF2FF", ic:"🔊", badge:null,          isNew:false },
  { id:10, en:"USB-C Fast Charger",      bn:"ইউএসবি-সি ফাস্ট চার্জার",       p:499,  o:699,  cat:"electronics", r:4.5, rv:312, bg:"#F0F9FF", ic:"🔌", badge:null,          isNew:false },
  { id:3,  en:"Premium Cotton Kurta",    bn:"প্রিমিয়াম কটন কুর্তা",          p:799,  o:1199, cat:"clothing",    r:4.9, rv:312, bg:"#FFF7ED", ic:"👗", badge:"Top Rated",   isNew:false },
  { id:8,  en:"Leather Wallet",          bn:"লেদার ওয়ালেট",                  p:699,  o:999,  cat:"clothing",    r:4.7, rv:203, bg:"#FFF7ED", ic:"👜", badge:null,          isNew:false },
  { id:11, en:"Casual Sneakers",         bn:"ক্যাজুয়াল স্নিকার্স",            p:1599, o:2200, cat:"clothing",    r:4.6, rv:178, bg:"#FFF7ED", ic:"👟", badge:"New",         isNew:true  },
  { id:12, en:"Linen Shirt",             bn:"লিনেন শার্ট",                    p:599,  o:899,  cat:"clothing",    r:4.5, rv:94,  bg:"#FFF7ED", ic:"👔", badge:null,          isNew:false },
  { id:4,  en:"Organic Honey 500g",      bn:"অর্গানিক মধু ৫০০ গ্রাম",         p:349,  o:450,  cat:"food",        r:4.7, rv:89,  bg:"#FFFBEB", ic:"🍯", badge:null,          isNew:false },
  { id:13, en:"Premium Green Tea",       bn:"প্রিমিয়াম গ্রিন টি",             p:249,  o:350,  cat:"food",        r:4.6, rv:145, bg:"#FFFBEB", ic:"🍵", badge:null,          isNew:false },
  { id:14, en:"Mixed Dry Fruits 250g",   bn:"মিক্সড ড্রাই ফ্রুটস ২৫০ গ্রাম", p:599,  o:799,  cat:"food",        r:4.8, rv:67,  bg:"#FFFBEB", ic:"🥜", badge:"Hot",         isNew:false },
  { id:5,  en:"Minimalist Desk Lamp",    bn:"মিনিমালিস্ট ডেস্ক ল্যাম্প",      p:1599, o:2100, cat:"home",        r:4.5, rv:67,  bg:"#F0FDF4", ic:"💡", badge:null,          isNew:false },
  { id:15, en:"Cotton Bed Sheet Set",    bn:"কটন বেড শিট সেট",                p:999,  o:1400, cat:"home",        r:4.7, rv:203, bg:"#F0FDF4", ic:"🛏", badge:null,          isNew:false },
  { id:16, en:"Ceramic Mug Set (4pcs)",  bn:"সিরামিক মগ সেট (৪টি)",           p:449,  o:650,  cat:"home",        r:4.4, rv:88,  bg:"#F0FDF4", ic:"☕", badge:null,          isNew:false },
  { id:6,  en:"Vitamin C Serum",         bn:"ভিটামিন সি সিরাম",               p:599,  o:850,  cat:"beauty",      r:4.8, rv:445, bg:"#FDF4FF", ic:"✨", badge:"Hot",         isNew:false },
  { id:17, en:"Rose Water Toner",        bn:"রোজ ওয়াটার টোনার",               p:299,  o:420,  cat:"beauty",      r:4.6, rv:234, bg:"#FDF4FF", ic:"🌹", badge:null,          isNew:false },
  { id:7,  en:"Yoga Mat Premium",        bn:"প্রিমিয়াম যোগব্যায়াম ম্যাট",    p:1099, o:1500, cat:"sports",      r:4.6, rv:178, bg:"#F0FDF4", ic:"🧘", badge:null,          isNew:false },
  { id:18, en:"Jump Rope Pro",           bn:"জাম্প রোপ প্রো",                 p:399,  o:599,  cat:"sports",      r:4.5, rv:112, bg:"#F0FDF4", ic:"⚡", badge:null,          isNew:false },
];

const BADGE_COL = { "Best Seller":"#34C759","New":"#006FD6","Top Rated":"#FF9500","Hot":"#FF3B30" };
const PAGE_SIZE = 8;

/* ─────────────────────────────────────────
   STARS
───────────────────────────────────────── */
function Stars({ r, sm }) {
  const s = sm ? 10 : 11;
  return (
    <span style={{ display:"flex", gap:2 }}>
      {[1,2,3,4,5].map(i=>(
        <svg key={i} width={s} height={s} viewBox="0 0 11 11"
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
      <div className="sk" style={{ height:178 }}/>
      <div style={{ padding:15, display:"flex", flexDirection:"column", gap:9 }}>
        <div className="sk" style={{ height:12, width:"70%" }}/>
        <div className="sk" style={{ height:11, width:"50%" }}/>
        <div className="sk" style={{ height:10, width:"34%", marginTop:2 }}/>
        <div className="sk" style={{ height:36, borderRadius:12, marginTop:6 }}/>
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
    <div className="card-lift" style={{ background:"white", borderRadius:22,
      overflow:"hidden", boxShadow:"0 2px 14px rgba(0,0,0,.05)" }}>
      <div style={{ background:prod.bg, height:178, position:"relative",
        display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
        <span style={{ fontSize:52 }} className="float">{prod.ic}</span>
        {prod.badge && (
          <span style={{ position:"absolute", top:10, left:10, background:BADGE_COL[prod.badge],
            color:"white", fontSize:9, fontWeight:700, padding:"3px 8px", borderRadius:20 }}>
            {prod.badge}
          </span>
        )}
        <span style={{ position:"absolute", top:10, right:10, background:"rgba(255,255,255,.88)",
          color:"#FF3B30", fontSize:9, fontWeight:700, padding:"3px 8px", borderRadius:20,
          backdropFilter:"blur(8px)" }}>-{disc}%</span>
      </div>

      <div style={{ padding:"14px 15px 15px" }}>
        <p style={{ fontSize:13, fontWeight:600, color:"#1C1C1E", lineHeight:1.35, marginBottom:3 }}>
          {prod.en}
        </p>
        <p className="bn" style={{ fontSize:12, color:"#6C6C70", marginBottom:8 }}>{prod.bn}</p>
        <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:9 }}>
          <Stars r={prod.r} sm/>
          <span style={{ fontSize:10, color:"#8E8E93" }}>{prod.r} ({prod.rv})</span>
        </div>
        <div style={{ display:"flex", alignItems:"baseline", gap:7, marginBottom:12 }}>
          <span style={{ fontSize:16, fontWeight:700, color:"#1C1C1E" }}>৳{prod.p.toLocaleString()}</span>
          <span style={{ fontSize:11, color:"#AEAEB2", textDecoration:"line-through" }}>
            ৳{prod.o.toLocaleString()}
          </span>
        </div>
        <button className="tap" onClick={() => onAdd(prod)} style={{
          width:"100%", padding:"10px 0",
          background: added ? "#34C759" : "#006FD6",
          color:"white", borderRadius:13, fontSize:13, fontWeight:600,
          display:"flex", alignItems:"center", justifyContent:"center", gap:7,
          transition:"background .2s ease",
        }}>
          {added ? (
            <><svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2 6.5L5.5 10L11 3.5" stroke="white" strokeWidth="1.9"
                strokeLinecap="round" strokeLinejoin="round"/></svg>Added!</>
          ) : (
            <><span style={{ fontSize:16, lineHeight:1 }}>+</span> Add to Cart</>
          )}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   FILTER SECTION (collapsible)
───────────────────────────────────────── */
function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom:4 }}>
      <button className="tap" onClick={() => setOpen(v=>!v)} style={{
        width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"12px 16px", background:"none", borderRadius:12,
        fontSize:13, fontWeight:600, color:"#1C1C1E",
      }}>
        <span>{title}</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
          style={{ transition:"transform .22s ease", transform: open?"rotate(180deg)":"rotate(0deg)" }}>
          <path d="M2 5L7 10L12 5" stroke="#8E8E93" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div style={{ padding:"2px 8px 10px" }}>{children}</div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   FILTER OPTION ROW
───────────────────────────────────────── */
function FilterOpt({ label, active, onClick }) {
  return (
    <div className="filt-opt" onClick={onClick} style={{
      display:"flex", alignItems:"center", gap:9,
      padding:"8px 8px", borderRadius:10,
      background: active ? "rgba(0,111,214,.08)" : "transparent",
    }}>
      <div style={{
        width:16, height:16, borderRadius:5, flexShrink:0,
        border: active ? "none" : "1.5px solid #D1D1D6",
        background: active ? "#006FD6" : "transparent",
        display:"flex", alignItems:"center", justifyContent:"center",
        transition:"all .16s ease",
      }}>
        {active && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1.5 5L3.8 7.5L8.5 2.5" stroke="white" strokeWidth="1.6"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <span style={{ fontSize:13, fontWeight: active ? 600 : 400,
        color: active ? "#006FD6" : "#3C3C43" }}>{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────
   SIDEBAR (desktop)
───────────────────────────────────────── */
function Sidebar({ cat, setCat, price, setPrice, minRating, setMinRating, onClear, hasActive }) {
  return (
    <div className="pl-sidebar">
      <div style={{ background:"white", borderRadius:22,
        boxShadow:"0 2px 14px rgba(0,0,0,.05)", overflow:"hidden" }}>

        {/* Header */}
        <div style={{ padding:"16px 16px 12px", display:"flex",
          alignItems:"center", justifyContent:"space-between",
          borderBottom:"1px solid rgba(0,0,0,.06)" }}>
          <span style={{ fontSize:15, fontWeight:700, color:"#1C1C1E" }}>Filters</span>
          {hasActive && (
            <span onClick={onClear} style={{ fontSize:12, fontWeight:600,
              color:"#FF3B30", cursor:"pointer" }}>Clear All</span>
          )}
        </div>

        {/* Category */}
        <FilterSection title="Category">
          {CATS.map(c => (
            <FilterOpt key={c.id}
              label={<><span>{c.en}</span>{c.ic&&<span style={{marginLeft:5}}>{c.ic}</span>}</>}
              active={cat===c.id}
              onClick={() => setCat(c.id)}/>
          ))}
        </FilterSection>

        <div style={{ height:1, background:"rgba(0,0,0,.06)", margin:"0 16px" }}/>

        {/* Price */}
        <FilterSection title="Price Range">
          {PRICE_OPTS.map(p => (
            <FilterOpt key={p.id} label={p.en} active={price===p.id}
              onClick={() => setPrice(p.id)}/>
          ))}
        </FilterSection>

        <div style={{ height:1, background:"rgba(0,0,0,.06)", margin:"0 16px" }}/>

        {/* Rating */}
        <FilterSection title="Min. Rating">
          {RATING_OPTS.map(r => (
            <FilterOpt key={r.id} label={r.en} active={minRating===r.id}
              onClick={() => setMinRating(r.id)}/>
          ))}
        </FilterSection>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MOBILE FILTER DRAWER
───────────────────────────────────────── */
function FilterDrawer({ cat, setCat, price, setPrice, minRating, setMinRating, onClose, onClear, hasActive }) {
  return (
    <>
      {/* Overlay */}
      <div className="ovl" onClick={onClose} style={{
        position:"fixed", inset:0, background:"rgba(0,0,0,.4)",
        zIndex:300, backdropFilter:"blur(2px)",
      }}/>
      {/* Drawer */}
      <div className="drawer" style={{
        position:"fixed", bottom:0, left:0, right:0, zIndex:400,
        background:"white", borderRadius:"24px 24px 0 0",
        maxHeight:"82vh", overflowY:"auto",
        boxShadow:"0 -8px 40px rgba(0,0,0,.14)",
      }}>
        {/* Handle */}
        <div style={{ display:"flex", justifyContent:"center", padding:"12px 0 0" }}>
          <div style={{ width:40, height:4, background:"#E5E5EA", borderRadius:2 }}/>
        </div>

        {/* Header */}
        <div style={{ padding:"12px 24px 14px", display:"flex",
          alignItems:"center", justifyContent:"space-between",
          borderBottom:"1px solid rgba(0,0,0,.06)" }}>
          <span style={{ fontSize:17, fontWeight:700 }}>Filters</span>
          <button className="tap" onClick={onClose} style={{
            width:32, height:32, borderRadius:16,
            background:"rgba(0,0,0,.06)", display:"flex",
            alignItems:"center", justifyContent:"center", color:"#3C3C43",
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2L12 12M12 2L2 12" stroke="currentColor"
                strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div style={{ padding:"8px 16px" }}>
          <FilterSection title="Category">
            {CATS.map(c => (
              <FilterOpt key={c.id}
                label={<>{c.en}{c.ic&&<span style={{marginLeft:5}}>{c.ic}</span>}</>}
                active={cat===c.id} onClick={() => setCat(c.id)}/>
            ))}
          </FilterSection>
          <div style={{ height:1, background:"rgba(0,0,0,.06)", margin:"4px 8px" }}/>
          <FilterSection title="Price Range">
            {PRICE_OPTS.map(p => (
              <FilterOpt key={p.id} label={p.en} active={price===p.id}
                onClick={() => setPrice(p.id)}/>
            ))}
          </FilterSection>
          <div style={{ height:1, background:"rgba(0,0,0,.06)", margin:"4px 8px" }}/>
          <FilterSection title="Min. Rating">
            {RATING_OPTS.map(r => (
              <FilterOpt key={r.id} label={r.en} active={minRating===r.id}
                onClick={() => setMinRating(r.id)}/>
            ))}
          </FilterSection>
        </div>

        {/* Footer buttons */}
        <div style={{ padding:"12px 20px 28px", display:"flex", gap:10,
          borderTop:"1px solid rgba(0,0,0,.06)", marginTop:4 }}>
          {hasActive && (
            <button className="tap" onClick={onClear} style={{
              flex:1, padding:"13px 0", background:"rgba(255,59,48,.08)",
              color:"#FF3B30", borderRadius:14, fontSize:14, fontWeight:600,
            }}>Clear All</button>
          )}
          <button className="tap" onClick={onClose} style={{
            flex:2, padding:"13px 0", background:"#006FD6",
            color:"white", borderRadius:14, fontSize:14, fontWeight:600,
          }}>Apply Filters</button>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────
   SORT DROPDOWN
───────────────────────────────────────── */
function SortDropdown({ sort, setSort }) {
  const [open, setOpen] = useState(false);
  const label = SORT_OPTS.find(s=>s.id===sort)?.en || "Sort";
  return (
    <div style={{ position:"relative" }}>
      <button className="tap" onClick={() => setOpen(v=>!v)} style={{
        display:"flex", alignItems:"center", gap:7,
        padding:"9px 14px", background:"white", borderRadius:12,
        border:"1.5px solid rgba(0,0,0,.09)", fontSize:13, fontWeight:500,
        color:"#1C1C1E", whiteSpace:"nowrap",
        boxShadow:"0 1px 5px rgba(0,0,0,.04)",
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 3H13M3 7H11M5 11H9" stroke="currentColor"
            strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
        <span className="hide-xs">{label}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{ transition:"transform .2s", transform:open?"rotate(180deg)":"none" }}>
          <path d="M2 4L6 8L10 4" stroke="currentColor"
            strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className="ddrop" style={{
          position:"absolute", top:"calc(100% + 6px)", right:0, zIndex:50,
          background:"white", borderRadius:16,
          boxShadow:"0 8px 32px rgba(0,0,0,.12)",
          border:"1px solid rgba(0,0,0,.07)",
          overflow:"hidden", minWidth:200,
        }}>
          {SORT_OPTS.map(s => (
            <div key={s.id} onClick={() => { setSort(s.id); setOpen(false); }}
              style={{
                padding:"12px 16px", fontSize:13, fontWeight: sort===s.id ? 600 : 400,
                color: sort===s.id ? "#006FD6" : "#1C1C1E",
                background: sort===s.id ? "rgba(0,111,214,.06)" : "white",
                cursor:"pointer", transition:"background .14s",
              }}
              onMouseEnter={e => { if(sort!==s.id) e.currentTarget.style.background="#F7F7F9"; }}
              onMouseLeave={e => { if(sort!==s.id) e.currentTarget.style.background="white"; }}
            >
              {s.en}
              {sort===s.id && (
                <span style={{ marginLeft:6 }}>✓</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN APP
───────────────────────────────────────── */
export default function ProductsPage() {
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [cat,         setCat]         = useState("all");
  const [price,       setPrice]       = useState("all");
  const [minRating,   setMinRating]   = useState("all");
  const [sort,        setSort]        = useState("popular");
  const [visible,     setVisible]     = useState(PAGE_SIZE);
  const [cart,        setCart]        = useState([]);
  const [addedId,     setAddedId]     = useState(null);
  const [cartAnim,    setCartAnim]    = useState(0);
  const [scrolled,    setScrolled]    = useState(false);
  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 14);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const hasActive = cat!=="all" || price!=="all" || minRating!=="all" || search!=="";

  const clearAll = () => {
    setCat("all"); setPrice("all"); setMinRating("all"); setSearch("");
    setVisible(PAGE_SIZE);
  };

  const addToCart = p => {
    setCart(prev => {
      const ex = prev.find(i=>i.id===p.id);
      return ex ? prev.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i) : [...prev,{...p,qty:1}];
    });
    setAddedId(p.id); setCartAnim(n=>n+1);
    setTimeout(() => setAddedId(null), 1500);
  };

  const cartTotal = cart.reduce((s,i)=>s+i.qty,0);

  /* ── Filtering + sorting ── */
  const filtered = useMemo(() => {
    const pr = PRICE_OPTS.find(p=>p.id===price) || PRICE_OPTS[0];
    const mr = RATING_OPTS.find(r=>r.id===minRating)?.min || 0;
    const q  = search.toLowerCase().trim();

    let res = ALL_PRODS.filter(p =>
      (cat==="all" || p.cat===cat) &&
      (p.p >= pr.min && p.p <= pr.max) &&
      (p.r >= mr) &&
      (!q || p.en.toLowerCase().includes(q) || p.bn.includes(q))
    );

    if (sort==="price-low")  res = [...res].sort((a,b)=>a.p-b.p);
    if (sort==="price-high") res = [...res].sort((a,b)=>b.p-a.p);
    if (sort==="top-rated")  res = [...res].sort((a,b)=>b.r-a.r);
    if (sort==="newest")     res = [...res].sort((a,b)=>b.isNew-a.isNew);
    if (sort==="popular")    res = [...res].sort((a,b)=>b.rv-a.rv);

    return res;
  }, [cat, price, minRating, sort, search]);

  const displayed = filtered.slice(0, visible);
  const canLoadMore = visible < filtered.length;

  /* ── Active filter chips ── */
  const activeChips = [
    cat!=="all"       && { key:"cat",    label: CATS.find(c=>c.id===cat)?.en,         clear:()=>setCat("all")      },
    price!=="all"     && { key:"price",  label: PRICE_OPTS.find(p=>p.id===price)?.en, clear:()=>setPrice("all")    },
    minRating!=="all" && { key:"rating", label: RATING_OPTS.find(r=>r.id===minRating)?.en, clear:()=>setMinRating("all") },
    search            && { key:"search", label: `"${search}"`,                         clear:()=>setSearch("")      },
  ].filter(Boolean);

  return (
    <>
      <style>{STYLE}</style>

      {/* Drawer overlay */}
      {drawerOpen && (
        <FilterDrawer
          cat={cat} setCat={v=>{setCat(v);setVisible(PAGE_SIZE);}}
          price={price} setPrice={v=>{setPrice(v);setVisible(PAGE_SIZE);}}
          minRating={minRating} setMinRating={v=>{setMinRating(v);setVisible(PAGE_SIZE);}}
          onClose={()=>setDrawerOpen(false)}
          onClear={clearAll}
          hasActive={hasActive}
        />
      )}

      <div style={{ background:"#F7F7F9", minHeight:"100vh" }}>

        {/* ══════ NAV ══════ */}
        <nav className={scrolled?"glass-nav":""} style={{
          position:"fixed", top:0, left:0, right:0, zIndex:200, padding:"0 28px",
          background:scrolled?undefined:"transparent",
          borderBottom:scrolled?undefined:"1px solid transparent",
          transition:"all .35s ease",
        }}>
          <div style={{ maxWidth:1200, margin:"0 auto", height:60,
            display:"flex", alignItems:"center", justifyContent:"space-between" }}>

            <span style={{ fontSize:21, fontWeight:800, color:"#1C1C1E", letterSpacing:"-0.6px" }}>
              Shop<span style={{ color:"#006FD6" }}>BD</span>
            </span>

            <div className="hide-mob" style={{ display:"flex", gap:30 }}>
              {["Home","Products","About","Contact"].map(l=>(
                <span key={l} className="nav-lnk"
                  style={{ fontSize:14, fontWeight:500, color: l==="Products"?"#006FD6":"#1C1C1E" }}>
                  {l}
                </span>
              ))}
            </div>

            <div style={{ display:"flex", gap:7, alignItems:"center" }}>
              <button className="tap" style={{ width:38,height:38,borderRadius:19,
                background:"rgba(0,0,0,.05)",display:"flex",alignItems:"center",
                justifyContent:"center",color:"#1C1C1E" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>

              <button key={cartAnim} className={`tap${cartAnim>0?" cart-pop":""}`}
                style={{ width:38,height:38,borderRadius:19,background:"rgba(0,0,0,.05)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  color:"#1C1C1E",position:"relative" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M1 1.5H3.2L4.8 10H13L15 4H5.5" stroke="currentColor"
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="7" cy="13.5" r="1.5" fill="currentColor"/>
                  <circle cx="12" cy="13.5" r="1.5" fill="currentColor"/>
                </svg>
                {cartTotal>0 && (
                  <span style={{ position:"absolute",top:-2,right:-2,minWidth:17,height:17,
                    padding:"0 4px",borderRadius:9,background:"#FF3B30",color:"white",
                    fontSize:9,fontWeight:700,display:"flex",alignItems:"center",
                    justifyContent:"center",border:"2px solid #F7F7F9" }}>{cartTotal}</span>
                )}
              </button>

              <button className="tap"
                style={{ width:38,height:38,borderRadius:19,background:"rgba(0,0,0,.05)",
                  display:"flex",alignItems:"center",justifyContent:"center",color:"#1C1C1E" }}
                onClick={()=>setMenuOpen(v=>!v)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  {menuOpen
                    ?<path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    :<path d="M2 4H14M2 8H14M2 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>}
                </svg>
              </button>
            </div>
          </div>
          {menuOpen && (
            <div style={{ background:"rgba(247,247,249,.97)", backdropFilter:"blur(28px)",
              padding:"6px 28px 20px", borderTop:"1px solid rgba(0,0,0,.06)" }}>
              {["Home","Products","About","Contact"].map(l=>(
                <div key={l} onClick={()=>setMenuOpen(false)}
                  style={{ padding:"13px 0",fontSize:16,fontWeight:500,
                    color:l==="Products"?"#006FD6":"#1C1C1E",
                    borderBottom:"1px solid rgba(0,0,0,.05)",cursor:"pointer" }}>
                  {l}
                </div>
              ))}
            </div>
          )}
        </nav>

        {/* ══════ PAGE HEADER ══════ */}
        <div style={{ paddingTop:76, paddingBottom:0, paddingLeft:28, paddingRight:28 }}>
          <div style={{ maxWidth:1200, margin:"0 auto", paddingTop:28, paddingBottom:20 }}>
            <p style={{ fontSize:12, color:"#8E8E93", marginBottom:6 }}>
              Home &rsaquo; <span style={{ color:"#006FD6" }}>Products</span>
            </p>
            <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap",
              justifyContent:"space-between" }}>
              <div>
                <h1 style={{ fontSize:"clamp(24px,4vw,34px)", fontWeight:800,
                  color:"#1C1C1E", margin:0, letterSpacing:"-0.5px" }}>
                  All Products
                </h1>
                <p className="bn" style={{ fontSize:14, color:"#8E8E93", marginTop:4 }}>
                  সকল পণ্য দেখুন
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ══════ SEARCH BAR ══════ */}
        <div style={{ padding:"0 28px 20px" }}>
          <div style={{ maxWidth:1200, margin:"0 auto" }}>
            <div style={{ position:"relative", maxWidth:600 }}>
              <svg style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)",
                color:"#8E8E93", pointerEvents:"none" }}
                width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search products… (পণ্য খুঁজুন)"
                value={search}
                onChange={e => { setSearch(e.target.value); setVisible(PAGE_SIZE); }}
                style={{
                  width:"100%", padding:"13px 42px 13px 44px",
                  background:"white", border:"1.5px solid rgba(0,0,0,.09)",
                  borderRadius:16, fontSize:14, color:"#1C1C1E",
                  outline:"none", fontFamily:"inherit",
                  boxShadow:"0 2px 12px rgba(0,0,0,.05)",
                  transition:"border .2s ease, box-shadow .2s ease",
                }}
                onFocus={e => {
                  e.target.style.border="1.5px solid #006FD6";
                  e.target.style.boxShadow="0 0 0 4px rgba(0,111,214,.1)";
                }}
                onBlur={e => {
                  e.target.style.border="1.5px solid rgba(0,0,0,.09)";
                  e.target.style.boxShadow="0 2px 12px rgba(0,0,0,.05)";
                }}
              />
              {search && (
                <button className="tap" onClick={()=>setSearch("")}
                  style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                    width:24, height:24, borderRadius:12, background:"rgba(0,0,0,.07)",
                    display:"flex", alignItems:"center", justifyContent:"center", color:"#6C6C70" }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 1L11 11M11 1L1 11" stroke="currentColor"
                      strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ══════ MAIN LAYOUT ══════ */}
        <div style={{ padding:"0 28px 80px" }}>
          <div className="pl-wrap" style={{ maxWidth:1200, margin:"0 auto" }}>

            {/* ── Sidebar ── */}
            <Sidebar
              cat={cat} setCat={v=>{setCat(v);setVisible(PAGE_SIZE);}}
              price={price} setPrice={v=>{setPrice(v);setVisible(PAGE_SIZE);}}
              minRating={minRating} setMinRating={v=>{setMinRating(v);setVisible(PAGE_SIZE);}}
              onClear={clearAll} hasActive={hasActive}
            />

            {/* ── Main content ── */}
            <div className="pl-main">

              {/* Top bar: mobile filter btn + sort + results count */}
              <div style={{ display:"flex", alignItems:"center",
                justifyContent:"space-between", marginBottom:16, gap:10, flexWrap:"wrap" }}>

                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  {/* Mobile filter button */}
                  <button className="show-mob tap" onClick={()=>setDrawerOpen(true)}
                    style={{ display:"flex", alignItems:"center", gap:7,
                      padding:"9px 14px", background:"white", borderRadius:12,
                      border:`1.5px solid ${hasActive?"#006FD6":"rgba(0,0,0,.09)"}`,
                      fontSize:13, fontWeight:500,
                      color: hasActive ? "#006FD6" : "#1C1C1E",
                      boxShadow:"0 1px 5px rgba(0,0,0,.04)",
                    }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1 3H13M3 7H11M5 11H9" stroke="currentColor"
                        strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                    Filters
                    {hasActive && (
                      <span style={{ background:"#006FD6", color:"white",
                        fontSize:9, fontWeight:700, padding:"1px 5px",
                        borderRadius:8, minWidth:16, textAlign:"center" }}>
                        {activeChips.length}
                      </span>
                    )}
                  </button>

                  {/* Result count */}
                  {!loading && (
                    <span style={{ fontSize:13, color:"#8E8E93" }}>
                      <strong style={{ color:"#1C1C1E" }}>{filtered.length}</strong> products
                    </span>
                  )}
                </div>

                <SortDropdown sort={sort} setSort={v=>{setSort(v);setVisible(PAGE_SIZE);}}/>
              </div>

              {/* Active filter chips */}
              {activeChips.length > 0 && (
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16 }}>
                  {activeChips.map(chip => (
                    <div key={chip.key} style={{ display:"flex", alignItems:"center", gap:6,
                      background:"rgba(0,111,214,.09)", borderRadius:20, padding:"5px 12px 5px 10px",
                      border:"1px solid rgba(0,111,214,.2)" }}>
                      <span style={{ fontSize:12, fontWeight:600, color:"#006FD6" }}>{chip.label}</span>
                      <button className="tap" onClick={chip.clear}
                        style={{ width:16, height:16, borderRadius:8,
                          background:"rgba(0,111,214,.18)", display:"flex",
                          alignItems:"center", justifyContent:"center", color:"#006FD6" }}>
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1 1L7 7M7 1L1 7" stroke="currentColor"
                            strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button className="tap" onClick={clearAll}
                    style={{ fontSize:12, fontWeight:600, color:"#FF3B30",
                      background:"rgba(255,59,48,.08)", border:"1px solid rgba(255,59,48,.15)",
                      borderRadius:20, padding:"5px 12px" }}>
                    Clear All
                  </button>
                </div>
              )}

              {/* Category pills (horizontal scroll) */}
              <div style={{ overflowX:"auto", scrollbarWidth:"none", WebkitOverflowScrolling:"touch",
                marginBottom:22 }}>
                <div style={{ display:"flex", gap:8, paddingBottom:4 }}
                  ref={el => { if(el) el.style.cssText += "scrollbar-width:none;"; }}>
                  {CATS.map(c => (
                    <button key={c.id} className="tap pill-cat"
                      onClick={() => { setCat(c.id); setVisible(PAGE_SIZE); }}
                      style={{
                        flexShrink:0, padding:"8px 16px", borderRadius:22,
                        background: cat===c.id ? "#006FD6" : "white",
                        color:       cat===c.id ? "white"    : "#1C1C1E",
                        border:      cat===c.id ? "2px solid transparent" : "2px solid rgba(0,0,0,.08)",
                        fontSize:12, fontWeight:500, whiteSpace:"nowrap",
                        boxShadow:   cat===c.id ? "0 3px 14px rgba(0,111,214,.24)" : "0 1px 4px rgba(0,0,0,.04)",
                      }}>
                      {c.ic&&<span style={{marginRight:4}}>{c.ic}</span>}
                      {c.en}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product grid */}
              <div style={{
                display:"grid",
                gridTemplateColumns:"repeat(auto-fill, minmax(min(100%, 200px), 1fr))",
                gap:16,
              }}>
                {loading
                  ? [1,2,3,4,5,6,7,8].map(i=><SkCard key={i}/>)
                  : displayed.map(p=>(
                      <PCard key={p.id} prod={p} onAdd={addToCart} added={addedId===p.id}/>
                    ))
                }
              </div>

              {/* Empty state */}
              {!loading && filtered.length===0 && (
                <div style={{ textAlign:"center", padding:"72px 0" }}>
                  <p style={{ fontSize:52, marginBottom:14 }}>🔍</p>
                  <p style={{ fontSize:18, fontWeight:700, color:"#1C1C1E", marginBottom:6 }}>
                    No Products Found
                  </p>
                  <p className="bn" style={{ fontSize:14, color:"#8E8E93", marginBottom:24 }}>
                    অনুসন্ধান ফলাফল পাওয়া যায়নি
                  </p>
                  <button className="tap" onClick={clearAll} style={{
                    padding:"12px 28px", background:"#006FD6", color:"white",
                    borderRadius:14, fontSize:14, fontWeight:600,
                  }}>
                    Clear Filters
                  </button>
                </div>
              )}

              {/* Load More */}
              {!loading && canLoadMore && (
                <div style={{ textAlign:"center", marginTop:36 }}>
                  <p style={{ fontSize:12, color:"#8E8E93", marginBottom:14 }}>
                    Showing {displayed.length} of {filtered.length} products
                  </p>
                  <button className="tap" onClick={() => setVisible(v=>v+PAGE_SIZE)}
                    style={{
                      padding:"13px 40px",
                      background:"white", color:"#006FD6",
                      border:"1.5px solid rgba(0,111,214,.3)",
                      borderRadius:14, fontSize:14, fontWeight:600,
                      boxShadow:"0 2px 12px rgba(0,0,0,.05)",
                    }}>
                    Load More
                    <span style={{ marginLeft:8, fontSize:12, opacity:.7 }}>
                      (+{Math.min(PAGE_SIZE, filtered.length-visible)} products)
                    </span>
                  </button>
                </div>
              )}

              {/* All loaded */}
              {!loading && !canLoadMore && filtered.length > 0 && (
                <p style={{ textAlign:"center", fontSize:13, color:"#8E8E93", marginTop:32 }}>
                  ✓ All {filtered.length} products shown
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
