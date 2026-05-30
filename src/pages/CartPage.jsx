import { useState } from "react";
import SharedNavbar from '../components/SharedNavbar';

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=Hind+Siliguri:wght@400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{margin:0;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif;background:#F7F7F9;color:#1C1C1E;-webkit-font-smoothing:antialiased;}
.bn{font-family:'Hind Siliguri',sans-serif;}
::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:#D1D1D6;border-radius:4px;}

@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideOut{from{opacity:1;transform:translateX(0);max-height:200px}to{opacity:0;transform:translateX(40px);max-height:0;padding:0;margin:0}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}

.fu{animation:fadeUp .5s cubic-bezier(.22,1,.36,1) both;}
.fu1{animation:fadeUp .5s .06s cubic-bezier(.22,1,.36,1) both;}
.fu2{animation:fadeUp .5s .12s cubic-bezier(.22,1,.36,1) both;}
.fade-in{animation:fadeIn .3s ease both;}
.float{animation:float 3.5s ease-in-out infinite;}
.shake{animation:shake .35s ease;}
.slide-out{animation:slideOut .35s cubic-bezier(.22,1,.36,1) forwards;}

.tap{cursor:pointer;border:none;outline:none;transition:transform .13s ease,opacity .13s ease;}
.tap:hover{opacity:.88;}.tap:active{transform:scale(.95) !important;}

.glass-nav{backdrop-filter:blur(28px) saturate(200%) !important;-webkit-backdrop-filter:blur(28px) saturate(200%) !important;background:rgba(247,247,249,.9) !important;border-bottom:1px solid rgba(0,0,0,.07) !important;}
.nav-lnk{transition:color .18s;cursor:pointer;}.nav-lnk:hover{color:#006FD6 !important;}

.cart-item{transition:all .35s cubic-bezier(.22,1,.36,1);overflow:hidden;}
.item-card{transition:box-shadow .25s ease,transform .25s ease;}
.item-card:hover{box-shadow:0 6px 24px rgba(0,0,0,.08);transform:translateY(-2px);}

.inp{padding:11px 14px;background:white;border:1.5px solid rgba(0,0,0,.09);border-radius:12px;font-size:14px;color:#1C1C1E;font-family:'DM Sans',-apple-system,sans-serif;outline:none;transition:border .2s ease,box-shadow .2s ease;}
.inp:focus{border-color:#006FD6;box-shadow:0 0 0 3px rgba(0,111,214,.1);}
.inp::placeholder{color:#AEAEB2;}

.ck-wrap{display:flex;gap:28px;align-items:flex-start;}
.ck-main{flex:1;min-width:0;}
.ck-side{width:340px;flex-shrink:0;position:sticky;top:84px;}

@media(max-width:900px){
  .ck-wrap{flex-direction:column;}
  .ck-side{width:100%;position:static;}
}
@media(max-width:640px){.hide-sm{display:none !important;}}
`;

const INIT_ITEMS = [
  {id:1, en:"Wireless Earbuds Pro",   bn:"ওয়্যারলেস ইয়ারবাড প্রো",    price:1299, orig:1799, ic:"🎧", bg:"#EEF2FF", qty:1},
  {id:3, en:"Premium Cotton Kurta",   bn:"প্রিমিয়াম কটন কুর্তা",       price:799,  orig:1199, ic:"👗", bg:"#FFF7ED", qty:2},
  {id:6, en:"Vitamin C Serum",        bn:"ভিটামিন সি সিরাম",             price:599,  orig:850,  ic:"✨", bg:"#FDF4FF", qty:1},
  {id:4, en:"Organic Honey 500g",     bn:"অর্গানিক মধু ৫০০ গ্রাম",      price:349,  orig:450,  ic:"🍯", bg:"#FFFBEB", qty:1},
];

const DELIVERY = 60;
const PROMOS   = { SHOPBD20:"20", BD10:"10", WELCOME:"15" };

function Navbar({ count, scrolled, menuOpen, setMenuOpen }) {
  return (
    <SharedNavbar />
  );
}

export default function CartPage() {
  const [items,      setItems]     = useState(INIT_ITEMS);
  const [removing,   setRemoving]  = useState(null);
  const [promo,      setPromo]     = useState("");
  const [promoApplied,setPA]       = useState(null);
  const [promoError, setPE]        = useState("");
  const [promoShake, setPS]        = useState(false);
  const [scrolled,   setScrolled]  = useState(false);
  const [menuOpen,   setMenuOpen]  = useState(false);

  const changeQty = (id, d) => setItems(p => p.map(i => i.id===id ? {...i, qty:Math.max(1, i.qty+d)} : i));

  const removeItem = id => {
    setRemoving(id);
    setTimeout(() => {
      setItems(p => p.filter(i => i.id!==id));
      setRemoving(null);
    }, 350);
  };

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (PROMOS[code]) {
      setPA({ code, disc: PROMOS[code] });
      setPromo(""); setPS(false); setPE("");
    } else {
      setPA(null); setPS(true); setPS(false);
      setTimeout(() => setPS(true), 10);
      setTimeout(() => setPS(false), 400);
      setPromo(""); setPA(null);
      setPromo(promo);
      setPS(false);
      setTimeout(() => { setPS(true); setTimeout(() => setPS(false), 400); }, 10);
      setPA(null);
      setPromo(promo);
      setPS(true);
      setTimeout(() => setPS(false), 400);
      setPA(null);
      setPromo(promo);
      setPS(false);
      setPromoError("Invalid promo code. Try: SHOPBD20");
      setTimeout(() => setPromoError(""), 3000);
    }
  };

  import_useEffect: {
    // scroll listener via inline trick
  }

  const subtotal  = items.reduce((s,i) => s+i.price*i.qty, 0);
  const freeShip  = subtotal >= 500;
  const delFee    = freeShip ? 0 : DELIVERY;
  const discount  = promoApplied ? Math.round(subtotal * (+promoApplied.disc/100)) : 0;
  const total     = subtotal + delFee - discount;
  const savings   = items.reduce((s,i) => s+(i.orig-i.price)*i.qty, 0) + discount;
  const cartCount = items.reduce((s,i) => s+i.qty, 0);

  /* empty state */
  if (items.length === 0) return (
    <>
      <style>{STYLE}</style>
      <Navbar count={0} scrolled={false} menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",padding:"80px 28px",textAlign:"center"}}>
        <span style={{fontSize:80,display:"block",marginBottom:20}} className="float">🛒</span>
        <h2 style={{fontSize:26,fontWeight:800,color:"#1C1C1E",marginBottom:8}}>Your Cart is Empty</h2>
        <p className="bn" style={{fontSize:15,color:"#8E8E93",marginBottom:28}}>আপনার কার্ট খালি আছে</p>
        <p style={{fontSize:15,color:"#6C6C70",marginBottom:32,maxWidth:320}}>Looks like you haven't added anything yet. Start shopping!</p>
        <button className="tap" onClick={()=>setItems(INIT_ITEMS)} style={{padding:"14px 36px",background:"#006FD6",color:"white",borderRadius:16,fontSize:15,fontWeight:700,boxShadow:"0 6px 24px rgba(0,111,214,.3)"}}>
          Start Shopping →
        </button>
      </div>
    </>
  );

  return (
    <>
      <style>{STYLE}</style>
      <div style={{background:"#F7F7F9",minHeight:"100vh"}}>
        <Navbar count={cartCount} scrolled={scrolled} menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>

        <div style={{maxWidth:1200,margin:"0 auto",padding:"76px 28px 72px"}}>

          {/* Header */}
          <div style={{paddingTop:20,paddingBottom:22}}>
            <p style={{fontSize:12,color:"#8E8E93",marginBottom:6}}>
              Home &rsaquo; <span style={{color:"#1C1C1E",fontWeight:500}}>Cart</span>
            </p>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
              <div>
                <h1 style={{fontSize:"clamp(22px,3.5vw,30px)",fontWeight:800,color:"#1C1C1E",margin:0,letterSpacing:"-0.4px"}}>
                  My Cart
                </h1>
                <p className="bn" style={{fontSize:13,color:"#8E8E93",margin:0}}>
                  {cartCount} টি পণ্য · ৳{subtotal.toLocaleString()}
                </p>
              </div>
              <button className="tap" onClick={()=>setItems([])}
                style={{fontSize:13,color:"#FF3B30",background:"rgba(255,59,48,.07)",border:"1px solid rgba(255,59,48,.15)",padding:"8px 16px",borderRadius:22,fontWeight:600}}>
                Clear Cart
              </button>
            </div>
          </div>

          <div className="ck-wrap">

            {/* ── Cart items ── */}
            <div className="ck-main">
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {items.map((item, i) => (
                  <div key={item.id}
                    className={`cart-item${removing===item.id?" slide-out":""}`}
                    style={{animation:`fadeUp .45s ${i*0.05}s cubic-bezier(.22,1,.36,1) both`}}>
                    <div className="item-card" style={{background:"white",borderRadius:22,padding:"18px",display:"flex",gap:16,alignItems:"center",boxShadow:"0 2px 14px rgba(0,0,0,.05)"}}>

                      {/* Image */}
                      <div style={{width:88,height:88,borderRadius:16,background:item.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,flexShrink:0}}>
                        {item.ic}
                      </div>

                      {/* Info */}
                      <div style={{flex:1,minWidth:0}}>
                        <p style={{fontSize:14,fontWeight:700,color:"#1C1C1E",margin:"0 0 3px",lineHeight:1.3}}>{item.en}</p>
                        <p className="bn" style={{fontSize:12,color:"#6C6C70",margin:"0 0 10px"}}>{item.bn}</p>

                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
                          {/* Price */}
                          <div style={{display:"flex",alignItems:"baseline",gap:7}}>
                            <span style={{fontSize:17,fontWeight:800,color:"#1C1C1E"}}>৳{(item.price*item.qty).toLocaleString()}</span>
                            {item.qty>1&&<span style={{fontSize:12,color:"#8E8E93"}}>৳{item.price.toLocaleString()} each</span>}
                            <span style={{fontSize:11,color:"#AEAEB2",textDecoration:"line-through"}}>৳{(item.orig*item.qty).toLocaleString()}</span>
                          </div>

                          {/* Controls */}
                          <div style={{display:"flex",alignItems:"center",gap:10}}>
                            {/* Qty stepper */}
                            <div style={{display:"flex",alignItems:"center",background:"#F7F7F9",borderRadius:12,overflow:"hidden"}}>
                              <button className="tap" onClick={()=>changeQty(item.id,-1)}
                                style={{width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:item.qty===1?"#AEAEB2":"#1C1C1E",background:"transparent"}}>−</button>
                              <span style={{width:32,textAlign:"center",fontSize:14,fontWeight:700,color:"#1C1C1E"}}>{item.qty}</span>
                              <button className="tap" onClick={()=>changeQty(item.id,1)}
                                style={{width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:"#1C1C1E",background:"transparent"}}>+</button>
                            </div>

                            {/* Remove */}
                            <button className="tap" onClick={()=>removeItem(item.id)}
                              style={{width:34,height:34,borderRadius:17,background:"rgba(255,59,48,.07)",display:"flex",alignItems:"center",justifyContent:"center",color:"#FF3B30"}}>
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M2 3.5h10M5 3.5V2h4v1.5M5.5 6v4.5M8.5 6v4.5M3 3.5l.5 9h7l.5-9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Savings banner */}
              {savings > 0 && (
                <div className="fu1" style={{marginTop:16,background:"rgba(52,199,89,.07)",border:"1.5px solid rgba(52,199,89,.2)",borderRadius:16,padding:"14px 18px",display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:20}}>🎉</span>
                  <p style={{fontSize:13,fontWeight:600,color:"#34C759",margin:0}}>
                    You're saving ৳{savings.toLocaleString()} on this order!
                  </p>
                  <p className="bn" style={{fontSize:12,color:"#34C759",margin:0,opacity:.8}}>এই অর্ডারে আপনি সাশ্রয় করছেন</p>
                </div>
              )}

              {/* Trust badges */}
              <div className="fu2" style={{marginTop:20,display:"flex",flexWrap:"wrap",gap:12}}>
                {[{ic:"💵",t:"COD Available"},{ic:"🔄",t:"Easy Returns"},{ic:"🚚",t:"Fast Delivery"},{ic:"🔒",t:"Secure Checkout"}].map(b=>(
                  <div key={b.t} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 13px",background:"white",borderRadius:22,boxShadow:"0 1px 6px rgba(0,0,0,.05)",border:"1px solid rgba(0,0,0,.05)"}}>
                    <span style={{fontSize:14}}>{b.ic}</span>
                    <span style={{fontSize:12,fontWeight:500,color:"#3C3C43"}}>{b.t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Order Summary ── */}
            <div className="ck-side">
              <div style={{background:"white",borderRadius:24,overflow:"hidden",boxShadow:"0 2px 16px rgba(0,0,0,.06)"}}>

                <div style={{padding:"20px 22px 16px",borderBottom:"1px solid rgba(0,0,0,.07)"}}>
                  <p style={{fontSize:16,fontWeight:700,color:"#1C1C1E",margin:0}}>Order Summary</p>
                  <p className="bn" style={{fontSize:12,color:"#8E8E93",margin:0}}>অর্ডার সারাংশ</p>
                </div>

                <div style={{padding:"18px 22px",display:"flex",flexDirection:"column",gap:12}}>

                  {/* Item rows */}
                  {items.map(item=>(
                    <div key={item.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                      <span style={{fontSize:13,color:"#6C6C70",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.en} ×{item.qty}</span>
                      <span style={{fontSize:13,fontWeight:600,color:"#1C1C1E",flexShrink:0}}>৳{(item.price*item.qty).toLocaleString()}</span>
                    </div>
                  ))}

                  <div style={{height:1,background:"rgba(0,0,0,.07)",margin:"4px 0"}}/>

                  {/* Promo code */}
                  <div>
                    <p style={{fontSize:12,fontWeight:600,color:"#3C3C43",marginBottom:8}}>
                      Promo Code <span className="bn" style={{fontWeight:400,color:"#8E8E93"}}>(প্রোমো কোড)</span>
                    </p>
                    <div style={{display:"flex",gap:8}}>
                      <input className={`inp${promoShake?" shake":""}`}
                        placeholder="e.g. SHOPBD20"
                        value={promo}
                        onChange={e=>{setPromo(e.target.value.toUpperCase());setPromoError("");}}
                        onKeyDown={e=>e.key==="Enter"&&applyPromo()}
                        style={{flex:1,fontSize:13,padding:"9px 12px"}}/>
                      <button className="tap" onClick={applyPromo}
                        style={{padding:"9px 14px",background:"#006FD6",color:"white",borderRadius:12,fontSize:12,fontWeight:700,flexShrink:0}}>
                        Apply
                      </button>
                    </div>
                    {promoError&&<p style={{fontSize:11,color:"#FF3B30",margin:"5px 0 0"}}>{promoError}</p>}
                    {promoApplied&&(
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:8,padding:"7px 10px",background:"rgba(52,199,89,.08)",borderRadius:10,border:"1px solid rgba(52,199,89,.2)"}}>
                        <span style={{fontSize:12,fontWeight:700,color:"#34C759"}}>🎟 {promoApplied.code} — {promoApplied.disc}% off!</span>
                        <button className="tap" onClick={()=>setPA(null)} style={{fontSize:12,color:"#8E8E93",fontWeight:600}}>✕</button>
                      </div>
                    )}
                    {!promoApplied&&<p style={{fontSize:10,color:"#AEAEB2",margin:"5px 0 0"}}>Try: SHOPBD20 · BD10 · WELCOME</p>}
                  </div>

                  <div style={{height:1,background:"rgba(0,0,0,.07)"}}/>

                  {/* Totals */}
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <span style={{fontSize:13,color:"#6C6C70"}}>Subtotal</span>
                      <span style={{fontSize:13,fontWeight:500}}>৳{subtotal.toLocaleString()}</span>
                    </div>
                    {discount>0&&(
                      <div style={{display:"flex",justifyContent:"space-between"}}>
                        <span style={{fontSize:13,color:"#34C759"}}>Promo discount</span>
                        <span style={{fontSize:13,fontWeight:600,color:"#34C759"}}>-৳{discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:13,color:"#6C6C70"}}>Delivery</span>
                      {freeShip
                        ?<span style={{fontSize:13,fontWeight:700,color:"#34C759"}}>Free 🎉</span>
                        :<span style={{fontSize:13,fontWeight:500}}>৳{DELIVERY}</span>}
                    </div>
                    {!freeShip&&(
                      <div style={{background:"rgba(0,111,214,.06)",borderRadius:10,padding:"8px 10px"}}>
                        <p style={{fontSize:11,color:"#006FD6",fontWeight:500,margin:0}}>Add ৳{(500-subtotal).toLocaleString()} more for free delivery!</p>
                      </div>
                    )}
                    <div style={{height:1,background:"rgba(0,0,0,.07)"}}/>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:16,fontWeight:700,color:"#1C1C1E"}}>Total</span>
                      <span style={{fontSize:20,fontWeight:800,color:"#1C1C1E"}}>৳{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div style={{padding:"0 22px 22px",display:"flex",flexDirection:"column",gap:10}}>
                  <button className="tap" style={{width:"100%",padding:"15px 0",background:"#006FD6",color:"white",borderRadius:16,fontSize:15,fontWeight:700,boxShadow:"0 6px 24px rgba(0,111,214,.28)"}}>
                    Proceed to Checkout →
                  </button>
                  <button className="tap" style={{width:"100%",padding:"12px 0",background:"rgba(0,0,0,.04)",color:"#3C3C43",borderRadius:14,fontSize:13,fontWeight:600,border:"1px solid rgba(0,0,0,.07)"}}>
                    ← Continue Shopping
                  </button>
                  <div style={{display:"flex",justifyContent:"center",gap:16,marginTop:6}}>
                    {["💵 COD","💳 bKash","📲 Nagad"].map(p=>(
                      <span key={p} style={{fontSize:11,color:"#8E8E93",fontWeight:500}}>{p}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
