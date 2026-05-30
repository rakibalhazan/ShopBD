import { useState, useEffect } from "react";

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=Hind+Siliguri:wght@400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{margin:0;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif;background:#F7F7F9;color:#1C1C1E;-webkit-font-smoothing:antialiased;}
.bn{font-family:'Hind Siliguri',sans-serif;}
::-webkit-scrollbar{width:4px;height:4px;}::-webkit-scrollbar-thumb{background:#D1D1D6;border-radius:4px;}

@keyframes shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}
.sk{background:linear-gradient(90deg,#EFEFEF 0px,#E4E4E4 200px,#EFEFEF 400px);background-size:600px;animation:shimmer 1.5s infinite linear;border-radius:10px;}

@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes float{0%,100%{transform:translateY(0px)}50%{transform:translateY(-10px)}}
@keyframes cartPop{0%{transform:scale(1)}30%{transform:scale(1.4)}65%{transform:scale(.86)}100%{transform:scale(1)}}
@keyframes swapIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}

.fu{animation:fadeUp .55s cubic-bezier(.22,1,.36,1) both;}
.fu1{animation:fadeUp .55s .06s cubic-bezier(.22,1,.36,1) both;}
.fu2{animation:fadeUp .55s .12s cubic-bezier(.22,1,.36,1) both;}
.float{animation:float 3.5s ease-in-out infinite;}
.swap{animation:swapIn .35s cubic-bezier(.22,1,.36,1);}
.cart-pop{animation:cartPop .42s cubic-bezier(.22,1,.36,1);}

.tap{cursor:pointer;border:none;outline:none;transition:transform .14s ease,opacity .14s ease;}
.tap:hover{opacity:.88;}.tap:active{transform:scale(.95) !important;}

.glass-nav{backdrop-filter:blur(28px) saturate(200%) !important;-webkit-backdrop-filter:blur(28px) saturate(200%) !important;background:rgba(247,247,249,.9) !important;border-bottom:1px solid rgba(0,0,0,.07) !important;}
.nav-lnk{transition:color .18s;cursor:pointer;}.nav-lnk:hover{color:#006FD6 !important;}

.clr{cursor:pointer;transition:transform .2s cubic-bezier(.34,1.3,.64,1),box-shadow .18s ease;border-radius:50%;}
.clr:hover{transform:scale(1.12);}

.rel-card{cursor:pointer;transition:transform .28s cubic-bezier(.34,1.2,.64,1),box-shadow .28s ease;border-radius:18px;overflow:hidden;}
.rel-card:hover{transform:translateY(-6px);box-shadow:0 16px 44px rgba(0,0,0,.1);}

.hscroll{overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;}
.hscroll::-webkit-scrollbar{display:none;}

.pd-wrap{display:flex;gap:44px;align-items:flex-start;}
.pd-left{width:46%;flex-shrink:0;position:sticky;top:84px;}
.pd-right{flex:1;min-width:0;}

@media(max-width:768px){.pd-wrap{flex-direction:column;}.pd-left{width:100%;position:static;}}
@media(max-width:640px){.hide-sm{display:none !important;}}
`;

/* ── DATA ── */
const PRODS = [
  { id:1, en:"Wireless Earbuds Pro", bn:"ওয়্যারলেস ইয়ারবাড প্রো",
    p:1299,o:1799,cat:"Electronics",catBn:"ইলেকট্রনিক্স",r:4.8,rv:248,sold:1200,bg:"#EEF2FF",ic:"🎧",badge:"Best Seller",stock:15,
    desc:"Experience crystal-clear audio with Active Noise Cancellation. Deep bass, crisp highs, and a wide soundstage make every song feel live. Touch controls and a built-in HD mic keep you connected effortlessly.",
    descBn:"অ্যাক্টিভ নয়েজ ক্যান্সেলেশন দিয়ে ক্রিস্টাল-ক্লিয়ার অডিও উপভোগ করুন। গভীর বেস এবং উজ্জ্বল হাই দিয়ে প্রতিটি গান লাইভের মতো অনুভব করুন। টাচ কন্ট্রোল ও বিল্ট-ইন HD মাইক সহ।",
    feats:["Active Noise Cancellation (ANC)","30-hour total battery life","IPX5 water & sweat resistance","Bluetooth 5.3 — 10m range","Touch controls on each earbud","Built-in HD microphone for calls"],
    colors:[{n:"Midnight Black",h:"#1C1C1E"},{n:"Pearl White",h:"#E5E5EA"},{n:"Ocean Blue",h:"#006FD6"}] },
  { id:2, en:"Smart LED Watch", bn:"স্মার্ট এলইডি ঘড়ি",
    p:2499,o:3200,cat:"Electronics",catBn:"ইলেকট্রনিক্স",r:4.6,rv:156,sold:850,bg:"#F0F9FF",ic:"⌚",badge:"New",stock:8,
    desc:"Stay on top of your health and never miss a beat. Vivid 1.8\" AMOLED display, real-time health monitoring, and a 7-day battery life packed into an ultra-slim 8mm body.",
    descBn:"আপনার স্বাস্থ্যের উপর নজর রাখুন। প্রাণবন্ত ১.৮\" AMOLED ডিসপ্লে, রিয়েল-টাইম হেলথ মনিটরিং এবং ৭ দিনের ব্যাটারি লাইফ সহ।",
    feats:["1.8\" AMOLED always-on display","Heart rate & SpO2 monitoring","7-day battery life","100+ workout modes","IP67 waterproof rated","Sleep & stress tracking"],
    colors:[{n:"Midnight",h:"#1C1C1E"},{n:"Silver",h:"#8E8E93"},{n:"Rose Gold",h:"#C99B8C"}] },
  { id:3, en:"Premium Cotton Kurta", bn:"প্রিমিয়াম কটন কুর্তা",
    p:799,o:1199,cat:"Clothing",catBn:"পোশাক",r:4.9,rv:312,sold:2100,bg:"#FFF7ED",ic:"👗",badge:"Top Rated",stock:32,
    desc:"Handcrafted from 100% premium Bangladeshi cotton with traditional hand block-print patterns. Breathable, soft, and perfect for any occasion — from casual outings to festive events.",
    descBn:"ঐতিহ্যবাহী হ্যান্ড ব্লক-প্রিন্ট প্যাটার্ন সহ ১০০% প্রিমিয়াম বাংলাদেশি তুলা দিয়ে তৈরি। শ্বাসযোগ্য, নরম এবং যেকোনো উপলক্ষের জন্য উপযুক্ত।",
    feats:["100% Bangladeshi cotton fabric","Hand block-printed design","Pre-shrunk & machine washable","Available S – XXL","Traditional Jamdani motif","Natural, skin-safe dyes"],
    colors:[{n:"Turmeric",h:"#D97706"},{n:"Forest Green",h:"#15803D"},{n:"Crimson",h:"#DC2626"}] },
  { id:6, en:"Vitamin C Serum", bn:"ভিটামিন সি সিরাম",
    p:599,o:850,cat:"Beauty",catBn:"সৌন্দর্য",r:4.8,rv:445,sold:3200,bg:"#FDF4FF",ic:"✨",badge:"Hot",stock:24,
    desc:"Clinically formulated with 20% Vitamin C, Hyaluronic Acid, and Vitamin E. Brightens skin, reduces dark spots, and visibly smooths fine lines within 4 weeks of consistent use.",
    descBn:"২০% ভিটামিন সি, হায়ালুরোনিক অ্যাসিড ও ভিটামিন ই দিয়ে ক্লিনিক্যালি তৈরি। ত্বক উজ্জ্বল করে, কালো দাগ কমায় এবং ৪ সপ্তাহে সূক্ষ্ম রেখা হ্রাস করে।",
    feats:["20% Vitamin C concentration","Hyaluronic Acid & Vitamin E","Dermatologist tested & approved","Alcohol-free formula","30ml bottle — 2-month supply","All skin types incl. sensitive"],
    colors:[{n:"Original",h:"#F59E0B"},{n:"Night Formula",h:"#4F46E5"}] },
];

const BADGE_COL = {"Best Seller":"#34C759","New":"#006FD6","Top Rated":"#FF9500","Hot":"#FF3B30"};

/* ── STARS ── */
function Stars({ r, sz = 12 }) {
  return (
    <span style={{ display:"flex", gap:2 }}>
      {[1,2,3,4,5].map(i=>(
        <svg key={i} width={sz} height={sz} viewBox="0 0 11 11"
          fill={i<=Math.round(r)?"#FF9500":"#E5E5EA"}>
          <path d="M5.5.9 6.8 3.8H10L7.5 5.7l.9 3L5.5 7 2.6 8.7l.9-3L1 3.8h3.2z"/>
        </svg>
      ))}
    </span>
  );
}

/* ── NAVBAR ── */
function Navbar({ cartTotal, cartAnim, scrolled, menuOpen, setMenuOpen }) {
  return (
    <nav className={scrolled?"glass-nav":""} style={{
      position:"fixed",top:0,left:0,right:0,zIndex:200,padding:"0 28px",
      background:scrolled?undefined:"transparent",
      borderBottom:scrolled?undefined:"1px solid transparent",
      transition:"all .35s ease",
    }}>
      <div style={{maxWidth:1200,margin:"0 auto",height:60,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontSize:21,fontWeight:800,color:"#1C1C1E",letterSpacing:"-0.6px"}}>
          Shop<span style={{color:"#006FD6"}}>BD</span>
        </span>
        <div className="hide-sm" style={{display:"flex",gap:30}}>
          {["Home","Products","About","Contact"].map(l=>(
            <span key={l} className="nav-lnk" style={{fontSize:14,fontWeight:500,color:l==="Products"?"#006FD6":"#1C1C1E"}}>{l}</span>
          ))}
        </div>
        <div style={{display:"flex",gap:7,alignItems:"center"}}>
          <button className="tap" style={{width:38,height:38,borderRadius:19,background:"rgba(0,0,0,.05)",display:"flex",alignItems:"center",justifyContent:"center",color:"#1C1C1E"}}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <button key={cartAnim} className={`tap${cartAnim>0?" cart-pop":""}`}
            style={{width:38,height:38,borderRadius:19,background:"rgba(0,0,0,.05)",display:"flex",alignItems:"center",justifyContent:"center",color:"#1C1C1E",position:"relative"}}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1 1.5H3.2L4.8 10H13L15 4H5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="7" cy="13.5" r="1.5" fill="currentColor"/>
              <circle cx="12" cy="13.5" r="1.5" fill="currentColor"/>
            </svg>
            {cartTotal>0&&<span style={{position:"absolute",top:-2,right:-2,minWidth:17,height:17,padding:"0 4px",borderRadius:9,background:"#FF3B30",color:"white",fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid #F7F7F9"}}>{cartTotal}</span>}
          </button>
          <button className="tap" style={{width:38,height:38,borderRadius:19,background:"rgba(0,0,0,.05)",display:"flex",alignItems:"center",justifyContent:"center",color:"#1C1C1E"}} onClick={()=>setMenuOpen(v=>!v)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              {menuOpen?<path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>:<path d="M2 4H14M2 8H14M2 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>}
            </svg>
          </button>
        </div>
      </div>
      {menuOpen&&(
        <div style={{background:"rgba(247,247,249,.97)",backdropFilter:"blur(28px)",padding:"6px 28px 20px",borderTop:"1px solid rgba(0,0,0,.06)"}}>
          {["Home","Products","About","Contact"].map(l=>(
            <div key={l} onClick={()=>setMenuOpen(false)} style={{padding:"13px 0",fontSize:16,fontWeight:500,color:"#1C1C1E",borderBottom:"1px solid rgba(0,0,0,.05)",cursor:"pointer"}}>{l}</div>
          ))}
        </div>
      )}
    </nav>
  );
}

/* ── MAIN APP ── */
export default function ProductDetailPage() {
  const [prod,       setProd]      = useState(PRODS[0]);
  const [selColor,   setSelColor]  = useState(0);
  const [qty,        setQty]       = useState(1);
  const [cart,       setCart]      = useState([]);
  const [addedAnim,  setAddedAnim] = useState(false);
  const [cartAnim,   setCartAnim]  = useState(0);
  const [activeTab,  setActiveTab] = useState("Description");
  const [scrolled,   setScrolled]  = useState(false);
  const [menuOpen,   setMenuOpen]  = useState(false);
  const [imgKey,     setImgKey]    = useState(0);

  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>14);
    window.addEventListener("scroll",fn);
    return()=>window.removeEventListener("scroll",fn);
  },[]);

  const switchProd = p => {
    setProd(p); setSelColor(0); setQty(1);
    setActiveTab("Description"); setImgKey(k=>k+1);
    window.scrollTo({top:0,behavior:"smooth"});
  };

  const addToCart = () => {
    setCart(prev=>{
      const ex=prev.find(i=>i.id===prod.id);
      return ex?prev.map(i=>i.id===prod.id?{...i,qty:i.qty+qty}:i):[...prev,{...prod,qty}];
    });
    setAddedAnim(true); setCartAnim(n=>n+1);
    setTimeout(()=>setAddedAnim(false),1600);
  };

  const cartTotal = cart.reduce((s,i)=>s+i.qty,0);
  const disc      = Math.round(((prod.o-prod.p)/prod.o)*100);
  const related   = PRODS.filter(p=>p.id!==prod.id);
  const TABS      = ["Description","Features","Delivery"];

  return (
    <>
      <style>{STYLE}</style>
      <div style={{background:"#F7F7F9",minHeight:"100vh"}}>
        <Navbar cartTotal={cartTotal} cartAnim={cartAnim} scrolled={scrolled} menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>

        <div style={{maxWidth:1200,margin:"0 auto",padding:"84px 28px 72px"}}>

          {/* ── Breadcrumb ── */}
          <p style={{fontSize:12,color:"#8E8E93",marginBottom:28,marginTop:16}}>
            Home &rsaquo; <span style={{cursor:"pointer"}}>Products</span> &rsaquo;{" "}
            <span style={{color:"#1C1C1E",fontWeight:500}}>{prod.en}</span>
          </p>

          {/* ── Product layout ── */}
          <div className="pd-wrap">

            {/* LEFT — Image panel */}
            <div className="pd-left">
              <div key={imgKey} className="swap" style={{borderRadius:28,overflow:"hidden",background:prod.bg,position:"relative"}}>

                {/* Main visual */}
                <div style={{height:400,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
                  {/* Ghost blur */}
                  <span style={{position:"absolute",fontSize:180,opacity:.1,filter:"blur(28px)",transform:"scale(1.3)",pointerEvents:"none"}}>{prod.ic}</span>
                  {/* Main emoji */}
                  <span style={{fontSize:110,zIndex:1,position:"relative"}} className="float">{prod.ic}</span>

                  {prod.badge&&(
                    <span style={{position:"absolute",top:18,left:18,background:BADGE_COL[prod.badge],color:"white",fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:20}}>
                      {prod.badge}
                    </span>
                  )}
                  <span style={{position:"absolute",top:18,right:18,background:"rgba(255,255,255,.88)",color:"#FF3B30",fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:20,backdropFilter:"blur(8px)"}}>
                    -{disc}%
                  </span>
                </div>

                {/* Color thumbnails */}
                <div style={{display:"flex",gap:10,padding:"16px 20px 20px",justifyContent:"center",background:"rgba(255,255,255,.5)",borderTop:"1px solid rgba(255,255,255,.6)"}}>
                  {prod.colors.map((c,i)=>(
                    <div key={i} onClick={()=>setSelColor(i)}
                      className="clr"
                      style={{
                        width:36,height:36,borderRadius:18,
                        background:c.h,
                        border:`3px solid ${selColor===i?"#006FD6":"rgba(0,0,0,.12)"}`,
                        boxShadow:selColor===i?"0 0 0 2px rgba(0,111,214,.3)":"none",
                        transform:selColor===i?"scale(1.18)":"scale(1)",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Stock badge */}
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:16,padding:"12px 16px",background:"white",borderRadius:14,boxShadow:"0 2px 10px rgba(0,0,0,.05)"}}>
                <div style={{width:8,height:8,borderRadius:4,background:prod.stock>10?"#34C759":"#FF9500"}}/>
                <span style={{fontSize:13,fontWeight:500,color:"#3C3C43"}}>
                  {prod.stock>10?"In Stock":"Only "+prod.stock+" left"} —{" "}
                  <span className="bn" style={{color:"#8E8E93",fontWeight:400}}>
                    {prod.stock>10?"স্টকে আছে":"মাত্র "+prod.stock+"টি বাকি"}
                  </span>
                </span>
              </div>
            </div>

            {/* RIGHT — Info panel */}
            <div className="pd-right">

              {/* Category */}
              <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(0,111,214,.07)",border:"1px solid rgba(0,111,214,.14)",padding:"5px 12px",borderRadius:20,marginBottom:14}}>
                <span style={{fontSize:12,fontWeight:600,color:"#006FD6"}}>{prod.cat}</span>
                <span className="bn" style={{fontSize:11,color:"#006FD6",opacity:.75}}>/ {prod.catBn}</span>
              </div>

              {/* Name */}
              <h1 className="fu" style={{fontSize:"clamp(22px,3.5vw,32px)",fontWeight:800,color:"#1C1C1E",lineHeight:1.2,marginBottom:6,letterSpacing:"-0.4px"}}>
                {prod.en}
              </h1>
              <p className="bn fu1" style={{fontSize:16,color:"#6C6C70",marginBottom:18}}>{prod.bn}</p>

              {/* Rating row */}
              <div className="fu2" style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,flexWrap:"wrap"}}>
                <Stars r={prod.r} sz={14}/>
                <span style={{fontSize:14,fontWeight:700,color:"#1C1C1E"}}>{prod.r}</span>
                <span style={{fontSize:13,color:"#8E8E93"}}>{prod.rv.toLocaleString()} reviews</span>
                <span style={{width:1,height:14,background:"#E5E5EA"}}/>
                <span style={{fontSize:13,color:"#8E8E93"}}>{prod.sold.toLocaleString()} sold</span>
              </div>

              {/* Price */}
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24,padding:"16px 20px",background:"white",borderRadius:16,boxShadow:"0 2px 12px rgba(0,0,0,.05)"}}>
                <span style={{fontSize:28,fontWeight:800,color:"#1C1C1E",letterSpacing:"-0.5px"}}>
                  ৳{prod.p.toLocaleString()}
                </span>
                <span style={{fontSize:16,color:"#AEAEB2",textDecoration:"line-through"}}>
                  ৳{prod.o.toLocaleString()}
                </span>
                <span style={{marginLeft:"auto",background:"#FFF0F0",color:"#FF3B30",fontSize:13,fontWeight:700,padding:"4px 10px",borderRadius:20}}>
                  Save ৳{(prod.o-prod.p).toLocaleString()}
                </span>
              </div>

              {/* Color selector */}
              <div style={{marginBottom:22}}>
                <p style={{fontSize:13,fontWeight:600,color:"#1C1C1E",marginBottom:10}}>
                  Color: <span style={{color:"#006FD6"}}>{prod.colors[selColor].n}</span>
                </p>
                <div style={{display:"flex",gap:10}}>
                  {prod.colors.map((c,i)=>(
                    <div key={i} onClick={()=>setSelColor(i)} className="clr"
                      style={{
                        width:32,height:32,borderRadius:16,background:c.h,
                        border:`3px solid ${selColor===i?"#006FD6":"rgba(0,0,0,.12)"}`,
                        boxShadow:selColor===i?"0 0 0 3px rgba(0,111,214,.25)":"none",
                        transform:selColor===i?"scale(1.15)":"scale(1)",
                      }}/>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:26}}>
                <p style={{fontSize:13,fontWeight:600,color:"#1C1C1E",margin:0}}>Quantity:</p>
                <div style={{display:"flex",alignItems:"center",gap:0,background:"white",borderRadius:14,boxShadow:"0 2px 10px rgba(0,0,0,.06)",overflow:"hidden"}}>
                  <button className="tap" onClick={()=>setQty(q=>Math.max(1,q-1))}
                    style={{width:42,height:42,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:300,color:qty===1?"#AEAEB2":"#1C1C1E",background:"transparent"}}>
                    −
                  </button>
                  <span style={{width:44,textAlign:"center",fontSize:16,fontWeight:700,color:"#1C1C1E"}}>
                    {qty}
                  </span>
                  <button className="tap" onClick={()=>setQty(q=>Math.min(prod.stock,q+1))}
                    style={{width:42,height:42,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:300,color:"#1C1C1E",background:"transparent"}}>
                    +
                  </button>
                </div>
                <span style={{fontSize:12,color:"#8E8E93"}}>{prod.stock} available</span>
              </div>

              {/* CTAs */}
              <div style={{display:"flex",gap:12,marginBottom:24}}>
                <button className="tap" onClick={addToCart} style={{
                  flex:1,padding:"14px 0",
                  background:addedAnim?"#34C759":"white",
                  color:addedAnim?"white":"#006FD6",
                  border:`1.5px solid ${addedAnim?"#34C759":"#006FD6"}`,
                  borderRadius:16,fontSize:15,fontWeight:600,
                  display:"flex",alignItems:"center",justifyContent:"center",gap:7,
                  transition:"background .22s ease,color .22s ease,border .22s ease",
                }}>
                  {addedAnim?(
                    <><svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7L5.5 10.5L12 3.5" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>Added!</>
                  ):<><span style={{fontSize:16,lineHeight:1}}>+</span> Add to Cart</>}
                </button>
                <button className="tap" style={{
                  flex:1,padding:"14px 0",
                  background:"#006FD6",color:"white",
                  borderRadius:16,fontSize:15,fontWeight:600,
                  boxShadow:"0 4px 18px rgba(0,111,214,.3)",
                }}>
                  Buy Now →
                </button>
              </div>

              {/* Delivery pills */}
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:28}}>
                {[
                  {ic:"💵",t:"Cash on Delivery",c:"#34C759"},
                  {ic:"💳",t:"bKash",c:"#E2146C"},
                  {ic:"📲",t:"Nagad",c:"#F5820D"},
                  {ic:"🚚",t:"Free over ৳500",c:"#006FD6"},
                ].map(b=>(
                  <div key={b.t} style={{display:"flex",alignItems:"center",gap:5,padding:"6px 12px",background:"white",borderRadius:22,boxShadow:"0 1px 5px rgba(0,0,0,.05)",border:"1px solid rgba(0,0,0,.05)"}}>
                    <span style={{fontSize:14}}>{b.ic}</span>
                    <span style={{fontSize:12,fontWeight:500,color:"#3C3C43"}}>{b.t}</span>
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <div style={{background:"white",borderRadius:20,overflow:"hidden",boxShadow:"0 2px 14px rgba(0,0,0,.05)"}}>
                {/* Tab bar */}
                <div style={{display:"flex",borderBottom:"1px solid rgba(0,0,0,.07)"}}>
                  {TABS.map(tab=>(
                    <button key={tab} className="tap" onClick={()=>setActiveTab(tab)} style={{
                      flex:1,padding:"13px 8px",background:"transparent",
                      borderBottom:`2px solid ${activeTab===tab?"#006FD6":"transparent"}`,
                      color:activeTab===tab?"#006FD6":"#6C6C70",
                      fontSize:13,fontWeight:activeTab===tab?600:500,
                      transition:"all .2s ease",whiteSpace:"nowrap",
                    }}>{tab}</button>
                  ))}
                </div>

                {/* Tab content */}
                <div style={{padding:"20px 22px"}}>
                  {activeTab==="Description" && (
                    <div>
                      <p style={{fontSize:14,lineHeight:1.75,color:"#3C3C43",marginBottom:12}}>{prod.desc}</p>
                      <p className="bn" style={{fontSize:13,lineHeight:1.85,color:"#6C6C70"}}>{prod.descBn}</p>
                    </div>
                  )}
                  {activeTab==="Features" && (
                    <div style={{display:"flex",flexDirection:"column",gap:10}}>
                      {prod.feats.map((f,i)=>(
                        <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10}}>
                          <div style={{width:20,height:20,borderRadius:10,background:"rgba(0,111,214,.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M1.5 5L3.8 7.5L8.5 2.5" stroke="#006FD6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <span style={{fontSize:13,color:"#3C3C43",lineHeight:1.5}}>{f}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {activeTab==="Delivery" && (
                    <div style={{display:"flex",flexDirection:"column",gap:14}}>
                      {[
                        {ic:"🚚",t:"Standard Delivery",v:"2–5 business days · ৳60"},
                        {ic:"⚡",t:"Express Delivery",v:"Next day · ৳120"},
                        {ic:"💵",t:"Cash on Delivery",v:"Pay when it arrives · Free"},
                        {ic:"🔄",t:"Returns",v:"7-day hassle-free returns"},
                        {ic:"🛡",t:"Warranty",v:"6-month manufacturer warranty"},
                      ].map(d=>(
                        <div key={d.t} style={{display:"flex",alignItems:"center",gap:12}}>
                          <div style={{width:36,height:36,borderRadius:10,background:"#F7F7F9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{d.ic}</div>
                          <div>
                            <p style={{fontSize:13,fontWeight:600,color:"#1C1C1E",margin:0}}>{d.t}</p>
                            <p style={{fontSize:12,color:"#8E8E93",margin:0}}>{d.v}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Related Products ── */}
          <div style={{marginTop:60}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
              <h2 style={{fontSize:22,fontWeight:700,color:"#1C1C1E",margin:0}}>You May Also Like</h2>
              <span className="bn" style={{fontSize:14,color:"#8E8E93"}}>আরও দেখুন</span>
            </div>
            <div className="hscroll" style={{display:"flex",gap:16,paddingBottom:8}}>
              {related.map(p=>{
                const d=Math.round(((p.o-p.p)/p.o)*100);
                return (
                  <div key={p.id} className="rel-card" onClick={()=>switchProd(p)}
                    style={{background:"white",flexShrink:0,width:200,boxShadow:"0 2px 12px rgba(0,0,0,.05)"}}>
                    <div style={{background:p.bg,height:140,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
                      <span style={{fontSize:44}} className="float">{p.ic}</span>
                      {p.badge&&<span style={{position:"absolute",top:8,left:8,background:BADGE_COL[p.badge],color:"white",fontSize:8,fontWeight:700,padding:"2px 7px",borderRadius:20}}>{p.badge}</span>}
                    </div>
                    <div style={{padding:14}}>
                      <p style={{fontSize:12,fontWeight:600,color:"#1C1C1E",lineHeight:1.3,marginBottom:3}}>{p.en}</p>
                      <p className="bn" style={{fontSize:11,color:"#8E8E93",marginBottom:8}}>{p.bn}</p>
                      <div style={{display:"flex",alignItems:"baseline",gap:6}}>
                        <span style={{fontSize:15,fontWeight:700,color:"#1C1C1E"}}>৳{p.p.toLocaleString()}</span>
                        <span style={{fontSize:11,color:"#AEAEB2",textDecoration:"line-through"}}>৳{p.o.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
