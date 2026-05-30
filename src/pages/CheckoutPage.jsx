import { useState, useEffect } from "react";
import SharedNavbar from '../components/SharedNavbar';

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=Hind+Siliguri:wght@400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{margin:0;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif;background:#F7F7F9;color:#1C1C1E;-webkit-font-smoothing:antialiased;}
.bn{font-family:'Hind Siliguri',sans-serif;}
::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:#D1D1D6;border-radius:4px;}

@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes popIn{from{opacity:0;transform:scale(.75)}to{opacity:1;transform:scale(1)}}
@keyframes drawCheck{from{stroke-dashoffset:60}to{stroke-dashoffset:0}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}

.fu{animation:fadeUp .55s cubic-bezier(.22,1,.36,1) both;}
.fu1{animation:fadeUp .55s .08s cubic-bezier(.22,1,.36,1) both;}
.fu2{animation:fadeUp .55s .16s cubic-bezier(.22,1,.36,1) both;}
.fu3{animation:fadeUp .55s .24s cubic-bezier(.22,1,.36,1) both;}
.spin{animation:spin .75s linear infinite;}
.pop-in{animation:popIn .5s cubic-bezier(.34,1.4,.64,1) both;}
.check-path{stroke-dasharray:60;stroke-dashoffset:60;animation:drawCheck .5s .4s cubic-bezier(.22,1,.36,1) forwards;}
.fade-in{animation:fadeIn .4s ease both;}

.tap{cursor:pointer;border:none;outline:none;transition:transform .14s ease,opacity .14s ease;}
.tap:hover{opacity:.88;}.tap:active{transform:scale(.95) !important;}

.glass-nav{backdrop-filter:blur(28px) saturate(200%) !important;-webkit-backdrop-filter:blur(28px) saturate(200%) !important;background:rgba(247,247,249,.9) !important;border-bottom:1px solid rgba(0,0,0,.07) !important;}
.nav-lnk{transition:color .18s;cursor:pointer;}.nav-lnk:hover{color:#006FD6 !important;}

.inp{width:100%;padding:13px 16px;background:white;border:1.5px solid rgba(0,0,0,.09);border-radius:14px;font-size:14px;color:#1C1C1E;font-family:'DM Sans',-apple-system,sans-serif;outline:none;transition:border .2s ease,box-shadow .2s ease;appearance:none;-webkit-appearance:none;}
.inp:focus{border-color:#006FD6;box-shadow:0 0 0 4px rgba(0,111,214,.1);}
.inp::placeholder{color:#AEAEB2;}

.pay-card{cursor:pointer;border-radius:18px;border:2px solid rgba(0,0,0,.09);background:white;transition:border .2s ease,box-shadow .2s ease,transform .18s ease;}
.pay-card:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,.08);}
.pay-card.active{border-color:#006FD6;box-shadow:0 0 0 4px rgba(0,111,214,.1);}

.ck-wrap{display:flex;gap:28px;align-items:flex-start;}
.ck-form{flex:1;min-width:0;order:2;}
.ck-aside{width:340px;flex-shrink:0;position:sticky;top:84px;order:1;}

@media(max-width:900px){
  .ck-wrap{flex-direction:column;}
  .ck-aside{width:100%;position:static;order:1;}
  .ck-form{order:2;}
}
@media(max-width:640px){.hide-sm{display:none !important;}}
`;

/* ── PRE-FILLED CART ── */
const INIT_CART = [
  {id:1, en:"Wireless Earbuds Pro",   bn:"ওয়্যারলেস ইয়ারবাড প্রো",   price:1299, ic:"🎧", bg:"#EEF2FF", qty:1},
  {id:3, en:"Premium Cotton Kurta",   bn:"প্রিমিয়াম কটন কুর্তা",      price:799,  ic:"👗", bg:"#FFF7ED", qty:2},
  {id:6, en:"Vitamin C Serum",        bn:"ভিটামিন সি সিরাম",            price:599,  ic:"✨", bg:"#FDF4FF", qty:1},
];

const DIVISIONS = ["Dhaka","Chittagong","Rajshahi","Khulna","Barisal","Sylhet","Rangpur","Mymensingh"];

const PAYMENT_METHODS = [
  { id:"cod",   label:"Cash on Delivery", labelBn:"ক্যাশ অন ডেলিভারি", ic:"💵", col:"#34C759", desc:"Pay when your order arrives at your door." },
  { id:"bkash", label:"bKash",            labelBn:"বিকাশ",              ic:"💳", col:"#E2146C", desc:"Send payment to bKash, then enter your transaction ID." },
  { id:"nagad", label:"Nagad",            labelBn:"নগদ",                ic:"📲", col:"#F5820D", desc:"Send payment to Nagad, then enter your transaction ID." },
];

const DELIVERY_FEE = 60;

/* ── NAVBAR ── */
function Navbar({ scrolled, menuOpen, setMenuOpen }) {
  return (
    <nav className={scrolled?"glass-nav":""} style={{
      position:"fixed",top:0,left:0,right:0,zIndex:200,padding:"0 28px",
      background:scrolled?undefined:"rgba(247,247,249,.95)",
      borderBottom:"1px solid rgba(0,0,0,.07)",transition:"all .35s ease",
    }}>
      <div style={{maxWidth:1200,margin:"0 auto",height:60,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontSize:21,fontWeight:800,color:"#1C1C1E",letterSpacing:"-0.6px"}}>
          Shop<span style={{color:"#006FD6"}}>BD</span>
        </span>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:13,color:"#8E8E93"}}>🔒 Secure Checkout</span>
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

/* ── FORM INPUT ── */
function Field({ label, labelBn, required, children }) {
  return (
    <div>
      <label style={{display:"block",fontSize:13,fontWeight:600,color:"#1C1C1E",marginBottom:7}}>
        {label}
        <span className="bn" style={{fontWeight:400,color:"#8E8E93",marginLeft:5}}>{labelBn}</span>
        {required&&<span style={{color:"#FF3B30",marginLeft:3}}>*</span>}
      </label>
      {children}
    </div>
  );
}

/* ── SUCCESS SCREEN ── */
function SuccessScreen({ order, onBack }) {
  return (
    <div className="fade-in" style={{
      minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
      background:"#F7F7F9",padding:"28px",
    }}>
      <div style={{
        maxWidth:480,width:"100%",background:"white",borderRadius:32,
        padding:"48px 36px",textAlign:"center",
        boxShadow:"0 24px 80px rgba(0,0,0,.1)",
      }}>

        {/* Animated checkmark */}
        <div className="pop-in" style={{
          width:80,height:80,borderRadius:40,
          background:"linear-gradient(135deg,#34C759,#30B955)",
          display:"flex",alignItems:"center",justifyContent:"center",
          margin:"0 auto 24px",
          boxShadow:"0 12px 32px rgba(52,199,89,.3)",
        }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path className="check-path" d="M7 18L14 25L29 11"
              stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h2 style={{fontSize:24,fontWeight:800,color:"#1C1C1E",marginBottom:6}}>
          Order Placed! 🎉
        </h2>
        <p className="bn" style={{fontSize:15,color:"#8E8E93",marginBottom:28}}>
          অর্ডার সফলভাবে দেওয়া হয়েছে
        </p>

        {/* Order details */}
        <div style={{background:"#F7F7F9",borderRadius:18,padding:"20px",marginBottom:24,textAlign:"left"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
            <span style={{fontSize:13,color:"#8E8E93"}}>Order Number</span>
            <span style={{fontSize:13,fontWeight:700,color:"#006FD6"}}>#{order.number}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
            <span style={{fontSize:13,color:"#8E8E93"}}>Items</span>
            <span style={{fontSize:13,fontWeight:600,color:"#1C1C1E"}}>{order.itemCount} products</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
            <span style={{fontSize:13,color:"#8E8E93"}}>Total Paid</span>
            <span style={{fontSize:14,fontWeight:700,color:"#1C1C1E"}}>৳{order.total.toLocaleString()}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
            <span style={{fontSize:13,color:"#8E8E93"}}>Payment</span>
            <span style={{fontSize:13,fontWeight:600,color:"#1C1C1E"}}>{order.payment}</span>
          </div>
          <div style={{height:1,background:"rgba(0,0,0,.06)",margin:"4px 0 12px"}}/>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:18}}>🚚</span>
            <div>
              <p style={{fontSize:13,fontWeight:600,color:"#1C1C1E",margin:0}}>Estimated Delivery</p>
              <p style={{fontSize:12,color:"#8E8E93",margin:0}}>2 – 5 business days</p>
            </div>
          </div>
        </div>

        {/* Phone confirm */}
        <div style={{background:"rgba(0,111,214,.06)",border:"1px solid rgba(0,111,214,.14)",borderRadius:14,padding:"14px 16px",marginBottom:28}}>
          <p style={{fontSize:13,color:"#3C3C43",margin:0,lineHeight:1.6}}>
            📞 We'll confirm your order by calling <strong style={{color:"#006FD6"}}>{order.phone}</strong>
          </p>
          <p className="bn" style={{fontSize:12,color:"#8E8E93",margin:"4px 0 0"}}>
            আমরা আপনার নম্বরে কল করে অর্ডার নিশ্চিত করব
          </p>
        </div>

        <button className="tap" onClick={onBack} style={{
          width:"100%",padding:"15px 0",
          background:"#006FD6",color:"white",
          borderRadius:16,fontSize:15,fontWeight:700,
          boxShadow:"0 6px 24px rgba(0,111,214,.28)",
        }}>
          Continue Shopping →
        </button>
      </div>
    </div>
  );
}

/* ── MAIN APP ── */
export default function CheckoutPage() {
  const [cart,       setCart]      = useState(INIT_CART);
  const [payMethod,  setPayMethod] = useState("cod");
  const [scrolled,   setScrolled]  = useState(false);
  const [menuOpen,   setMenuOpen]  = useState(false);
  const [step,       setStep]      = useState("form"); // "form" | "loading" | "success"
  const [orderInfo,  setOrderInfo] = useState(null);
  const [errors,     setErrors]    = useState({});
  const [summOpen,   setSummOpen]  = useState(true);

  const [form, setForm] = useState({
    name:"", phone:"", email:"",
    division:"Dhaka", district:"", upazila:"", address:"",
    note:"", bkashTxn:"", bkashNum:"",
    nagadTxn:"", nagadNum:"",
  });

  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>14);
    window.addEventListener("scroll",fn);
    return()=>window.removeEventListener("scroll",fn);
  },[]);

  const F = (k,v) => setForm(p=>({...p,[k]:v}));
  const subtotal   = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const freeShip   = subtotal >= 500;
  const delivery   = freeShip ? 0 : DELIVERY_FEE;
  const total      = subtotal + delivery;
  const itemCount  = cart.reduce((s,i)=>s+i.qty,0);

  const changeQty = (id, delta) => {
    setCart(prev => prev
      .map(i=>i.id===id?{...i,qty:Math.max(0,i.qty+delta)}:i)
      .filter(i=>i.qty>0)
    );
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())     e.name     = "Name is required";
    if (!form.phone.trim())    e.phone    = "Phone is required";
    else if (!/^01[3-9]\d{8}$/.test(form.phone.trim())) e.phone = "Enter a valid BD number (01XXXXXXXXX)";
    if (!form.district.trim()) e.district = "District is required";
    if (!form.address.trim())  e.address  = "Address is required";
    if (payMethod==="bkash") {
      if (!form.bkashTxn.trim()) e.bkashTxn = "Transaction ID required";
      if (!form.bkashNum.trim()) e.bkashNum  = "Your bKash number required";
    }
    if (payMethod==="nagad") {
      if (!form.nagadTxn.trim()) e.nagadTxn = "Transaction ID required";
      if (!form.nagadNum.trim()) e.nagadNum  = "Your Nagad number required";
    }
    return e;
  };

  const placeOrder = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); window.scrollTo({top:300,behavior:"smooth"}); return; }
    setErrors({});
    setStep("loading");
    setTimeout(()=>{
      const num = "BD-" + Math.floor(10000+Math.random()*90000);
      const pm  = PAYMENT_METHODS.find(p=>p.id===payMethod)?.label || "COD";
      setOrderInfo({ number:num, total, itemCount, payment:pm, phone:form.phone });
      setStep("success");
    }, 2000);
  };

  if (step==="success") return (
    <><style>{STYLE}</style>
      <SuccessScreen order={orderInfo} onBack={()=>{ setStep("form"); setCart(INIT_CART); }}/>
    </>
  );

  return (
    <>
      <style>{STYLE}</style>
      <div style={{background:"#F7F7F9",minHeight:"100vh"}}>
        <Navbar scrolled={scrolled} menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>

        <div style={{maxWidth:1200,margin:"0 auto",padding:"76px 28px 72px"}}>

          {/* ── Page header ── */}
          <div style={{paddingTop:20,paddingBottom:24}}>
            <p style={{fontSize:12,color:"#8E8E93",marginBottom:6}}>
              Home &rsaquo; Cart &rsaquo; <span style={{color:"#1C1C1E",fontWeight:500}}>Checkout</span>
            </p>
            <h1 style={{fontSize:"clamp(22px,3.5vw,30px)",fontWeight:800,color:"#1C1C1E",margin:0,letterSpacing:"-0.4px"}}>
              Checkout
            </h1>
          </div>

          {/* ── Progress steps ── */}
          <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:32,overflowX:"auto"}}>
            {[["🛒","Cart"],["📋","Details"],["💳","Payment"],["✅","Confirm"]].map(([ic,label],i)=>(
              <div key={label} style={{display:"flex",alignItems:"center",flexShrink:0}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <div style={{
                    width:34,height:34,borderRadius:17,
                    background:i<=1?"#006FD6":"rgba(0,0,0,.07)",
                    color:i<=1?"white":"#8E8E93",
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,
                    fontWeight:700,
                  }}>
                    {i<1?"✓":ic}
                  </div>
                  <span style={{fontSize:10,fontWeight:500,color:i<=1?"#006FD6":"#8E8E93",whiteSpace:"nowrap"}}>{label}</span>
                </div>
                {i<3&&<div style={{width:40,height:2,background:i<1?"#006FD6":"rgba(0,0,0,.08)",margin:"0 6px",marginBottom:20,flexShrink:0}}/>}
              </div>
            ))}
          </div>

          <div className="ck-wrap">

            {/* ── ORDER SUMMARY (aside) ── */}
            <div className="ck-aside">
              <div style={{background:"white",borderRadius:24,overflow:"hidden",boxShadow:"0 2px 16px rgba(0,0,0,.06)"}}>

                {/* Header - toggle on mobile */}
                <div onClick={()=>setSummOpen(v=>!v)} style={{
                  display:"flex",alignItems:"center",justifyContent:"space-between",
                  padding:"18px 20px",borderBottom:summOpen?"1px solid rgba(0,0,0,.07)":"none",
                  cursor:"pointer",
                }}>
                  <div>
                    <p style={{fontSize:15,fontWeight:700,color:"#1C1C1E",margin:0}}>Order Summary</p>
                    <p className="bn" style={{fontSize:12,color:"#8E8E93",margin:0}}>{itemCount} টি পণ্য</p>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:16,fontWeight:800,color:"#1C1C1E"}}>৳{total.toLocaleString()}</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                      style={{transition:"transform .22s ease",transform:summOpen?"rotate(180deg)":"rotate(0deg)"}}>
                      <path d="M2 5L7 10L12 5" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>

                {summOpen && (
                  <div>
                    {/* Items */}
                    <div style={{padding:"16px 20px",display:"flex",flexDirection:"column",gap:14}}>
                      {cart.map(item=>(
                        <div key={item.id} style={{display:"flex",alignItems:"center",gap:12}}>
                          <div style={{width:48,height:48,borderRadius:12,background:item.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>
                            {item.ic}
                          </div>
                          <div style={{flex:1,minWidth:0}}>
                            <p style={{fontSize:12,fontWeight:600,color:"#1C1C1E",margin:0,lineHeight:1.35,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.en}</p>
                            <p className="bn" style={{fontSize:11,color:"#8E8E93",margin:0}}>{item.bn}</p>
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                            <button className="tap" onClick={()=>changeQty(item.id,-1)}
                              style={{width:24,height:24,borderRadius:12,background:"rgba(0,0,0,.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"#3C3C43"}}>
                              −
                            </button>
                            <span style={{fontSize:13,fontWeight:700,color:"#1C1C1E",minWidth:16,textAlign:"center"}}>{item.qty}</span>
                            <button className="tap" onClick={()=>changeQty(item.id,1)}
                              style={{width:24,height:24,borderRadius:12,background:"rgba(0,0,0,.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"#3C3C43"}}>
                              +
                            </button>
                          </div>
                          <span style={{fontSize:13,fontWeight:700,color:"#1C1C1E",flexShrink:0}}>
                            ৳{(item.price*item.qty).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Totals */}
                    <div style={{borderTop:"1px solid rgba(0,0,0,.07)",padding:"16px 20px",display:"flex",flexDirection:"column",gap:10}}>
                      <div style={{display:"flex",justifyContent:"space-between"}}>
                        <span style={{fontSize:13,color:"#6C6C70"}}>Subtotal</span>
                        <span style={{fontSize:13,fontWeight:500,color:"#1C1C1E"}}>৳{subtotal.toLocaleString()}</span>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <span style={{fontSize:13,color:"#6C6C70"}}>Delivery</span>
                        {freeShip
                          ?<span style={{fontSize:13,fontWeight:600,color:"#34C759"}}>Free 🎉</span>
                          :<span style={{fontSize:13,fontWeight:500,color:"#1C1C1E"}}>৳{DELIVERY_FEE}</span>}
                      </div>
                      {!freeShip&&(
                        <div style={{background:"rgba(52,199,89,.08)",borderRadius:10,padding:"8px 12px"}}>
                          <p style={{fontSize:11,color:"#34C759",margin:0,fontWeight:500}}>
                            Add ৳{(500-subtotal).toLocaleString()} more for free delivery!
                          </p>
                        </div>
                      )}
                      <div style={{height:1,background:"rgba(0,0,0,.07)"}}/>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <span style={{fontSize:15,fontWeight:700,color:"#1C1C1E"}}>Total</span>
                        <span style={{fontSize:18,fontWeight:800,color:"#1C1C1E"}}>৳{total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── FORM ── */}
            <div className="ck-form">

              {/* Customer Details */}
              <div style={{background:"white",borderRadius:24,padding:"24px",boxShadow:"0 2px 16px rgba(0,0,0,.06)",marginBottom:20}}>
                <h2 style={{fontSize:17,fontWeight:700,color:"#1C1C1E",marginBottom:6}}>Customer Details</h2>
                <p className="bn" style={{fontSize:13,color:"#8E8E93",marginBottom:22}}>আপনার তথ্য দিন</p>

                <div style={{display:"flex",flexDirection:"column",gap:16}}>

                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                    <Field label="Full Name" labelBn="পুরো নাম" required>
                      <input className="inp" placeholder="e.g. Rahim Uddin" value={form.name} onChange={e=>F("name",e.target.value)}/>
                      {errors.name&&<p style={{fontSize:11,color:"#FF3B30",margin:"5px 0 0"}}>{errors.name}</p>}
                    </Field>
                    <Field label="Phone" labelBn="ফোন নম্বর" required>
                      <input className="inp" type="tel" placeholder="01XXXXXXXXX" value={form.phone} onChange={e=>F("phone",e.target.value)}/>
                      {errors.phone&&<p style={{fontSize:11,color:"#FF3B30",margin:"5px 0 0"}}>{errors.phone}</p>}
                    </Field>
                  </div>

                  <Field label="Email (optional)" labelBn="ঐচ্ছিক">
                    <input className="inp" type="email" placeholder="your@email.com" value={form.email} onChange={e=>F("email",e.target.value)}/>
                  </Field>

                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
                    <Field label="Division" labelBn="বিভাগ" required>
                      <select className="inp" value={form.division} onChange={e=>F("division",e.target.value)} style={{cursor:"pointer"}}>
                        {DIVISIONS.map(d=><option key={d} value={d}>{d}</option>)}
                      </select>
                    </Field>
                    <Field label="District" labelBn="জেলা" required>
                      <input className="inp" placeholder="e.g. Mirpur" value={form.district} onChange={e=>F("district",e.target.value)}/>
                      {errors.district&&<p style={{fontSize:11,color:"#FF3B30",margin:"5px 0 0"}}>{errors.district}</p>}
                    </Field>
                    <Field label="Upazila / Thana" labelBn="থানা">
                      <input className="inp" placeholder="e.g. Pallabi" value={form.upazila} onChange={e=>F("upazila",e.target.value)}/>
                    </Field>
                  </div>

                  <Field label="Street Address" labelBn="বিস্তারিত ঠিকানা" required>
                    <textarea className="inp" rows={3} placeholder="House/Flat no., Road, Area…"
                      value={form.address} onChange={e=>F("address",e.target.value)}
                      style={{resize:"none",lineHeight:1.6}}/>
                    {errors.address&&<p style={{fontSize:11,color:"#FF3B30",margin:"5px 0 0"}}>{errors.address}</p>}
                  </Field>

                  <Field label="Order Note (optional)" labelBn="বিশেষ নির্দেশনা">
                    <input className="inp" placeholder="Any special instructions?" value={form.note} onChange={e=>F("note",e.target.value)}/>
                  </Field>
                </div>
              </div>

              {/* Payment Method */}
              <div style={{background:"white",borderRadius:24,padding:"24px",boxShadow:"0 2px 16px rgba(0,0,0,.06)",marginBottom:20}}>
                <h2 style={{fontSize:17,fontWeight:700,color:"#1C1C1E",marginBottom:6}}>Payment Method</h2>
                <p className="bn" style={{fontSize:13,color:"#8E8E93",marginBottom:22}}>পেমেন্ট পদ্ধতি বেছে নিন</p>

                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {PAYMENT_METHODS.map(pm=>(
                    <div key={pm.id}>
                      <div className={`pay-card${payMethod===pm.id?" active":""}`}
                        onClick={()=>setPayMethod(pm.id)}
                        style={{padding:"18px 20px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:14}}>
                          {/* Radio circle */}
                          <div style={{
                            width:22,height:22,borderRadius:11,flexShrink:0,
                            border:`2px solid ${payMethod===pm.id?"#006FD6":"#D1D1D6"}`,
                            background:payMethod===pm.id?"#006FD6":"white",
                            display:"flex",alignItems:"center",justifyContent:"center",
                            transition:"all .18s ease",
                          }}>
                            {payMethod===pm.id&&<div style={{width:8,height:8,borderRadius:4,background:"white"}}/>}
                          </div>

                          {/* Icon */}
                          <div style={{
                            width:44,height:44,borderRadius:12,
                            background:pm.col+"18",
                            display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,
                          }}>{pm.ic}</div>

                          {/* Labels */}
                          <div style={{flex:1}}>
                            <div style={{display:"flex",alignItems:"center",gap:6}}>
                              <p style={{fontSize:15,fontWeight:700,color:"#1C1C1E",margin:0}}>{pm.label}</p>
                              <span className="bn" style={{fontSize:12,color:"#8E8E93"}}>({pm.labelBn})</span>
                            </div>
                            <p style={{fontSize:12,color:"#8E8E93",margin:0,lineHeight:1.4}}>{pm.desc}</p>
                          </div>
                        </div>
                      </div>

                      {/* bKash extra fields */}
                      {payMethod==="bkash"&&pm.id==="bkash"&&(
                        <div style={{marginTop:8,padding:"18px 20px",background:"rgba(226,20,108,.05)",border:"1.5px dashed rgba(226,20,108,.25)",borderRadius:16}}>
                          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,padding:"12px 14px",background:"rgba(226,20,108,.08)",borderRadius:12}}>
                            <span style={{fontSize:22}}>💳</span>
                            <div>
                              <p style={{fontSize:13,fontWeight:700,color:"#E2146C",margin:0}}>
                                Send ৳{total.toLocaleString()} to:
                              </p>
                              <p style={{fontSize:16,fontWeight:800,color:"#1C1C1E",margin:0,letterSpacing:".5px"}}>
                                01XXXXXXXX
                              </p>
                              <p style={{fontSize:11,color:"#8E8E93",margin:0}}>bKash Personal Account</p>
                            </div>
                          </div>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                            <Field label="Your bKash Number" labelBn="বিকাশ নম্বর" required>
                              <input className="inp" placeholder="01XXXXXXXXX" value={form.bkashNum} onChange={e=>F("bkashNum",e.target.value)}/>
                              {errors.bkashNum&&<p style={{fontSize:11,color:"#FF3B30",margin:"5px 0 0"}}>{errors.bkashNum}</p>}
                            </Field>
                            <Field label="Transaction ID" labelBn="ট্রান্জেকশন ID" required>
                              <input className="inp" placeholder="e.g. 8FGH92KL" value={form.bkashTxn} onChange={e=>F("bkashTxn",e.target.value)}/>
                              {errors.bkashTxn&&<p style={{fontSize:11,color:"#FF3B30",margin:"5px 0 0"}}>{errors.bkashTxn}</p>}
                            </Field>
                          </div>
                        </div>
                      )}

                      {/* Nagad extra fields */}
                      {payMethod==="nagad"&&pm.id==="nagad"&&(
                        <div style={{marginTop:8,padding:"18px 20px",background:"rgba(245,130,13,.05)",border:"1.5px dashed rgba(245,130,13,.3)",borderRadius:16}}>
                          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,padding:"12px 14px",background:"rgba(245,130,13,.1)",borderRadius:12}}>
                            <span style={{fontSize:22}}>📲</span>
                            <div>
                              <p style={{fontSize:13,fontWeight:700,color:"#F5820D",margin:0}}>
                                Send ৳{total.toLocaleString()} to:
                              </p>
                              <p style={{fontSize:16,fontWeight:800,color:"#1C1C1E",margin:0,letterSpacing:".5px"}}>
                                01XXXXXXXX
                              </p>
                              <p style={{fontSize:11,color:"#8E8E93",margin:0}}>Nagad Personal Account</p>
                            </div>
                          </div>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                            <Field label="Your Nagad Number" labelBn="নগদ নম্বর" required>
                              <input className="inp" placeholder="01XXXXXXXXX" value={form.nagadNum} onChange={e=>F("nagadNum",e.target.value)}/>
                              {errors.nagadNum&&<p style={{fontSize:11,color:"#FF3B30",margin:"5px 0 0"}}>{errors.nagadNum}</p>}
                            </Field>
                            <Field label="Transaction ID" labelBn="ট্রান্জেকশন ID" required>
                              <input className="inp" placeholder="e.g. NG73HD92" value={form.nagadTxn} onChange={e=>F("nagadTxn",e.target.value)}/>
                              {errors.nagadTxn&&<p style={{fontSize:11,color:"#FF3B30",margin:"5px 0 0"}}>{errors.nagadTxn}</p>}
                            </Field>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Place Order Button */}
              <button className="tap" onClick={placeOrder}
                disabled={step==="loading"}
                style={{
                  width:"100%",padding:"16px 0",
                  background:step==="loading"?"rgba(0,111,214,.7)":"#006FD6",
                  color:"white",borderRadius:18,
                  fontSize:16,fontWeight:700,
                  display:"flex",alignItems:"center",justifyContent:"center",gap:10,
                  boxShadow:"0 6px 28px rgba(0,111,214,.3)",
                  transition:"background .2s ease",
                }}>
                {step==="loading"?(
                  <>
                    <svg className="spin" width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <circle cx="9" cy="9" r="7" stroke="rgba(255,255,255,.3)" strokeWidth="2.5"/>
                      <path d="M9 2a7 7 0 0 1 7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                    </svg>
                    Placing Order…
                  </>
                ):(
                  <>
                    Place Order — ৳{total.toLocaleString()}
                    <span style={{fontSize:18}}>→</span>
                  </>
                )}
              </button>

              <p style={{textAlign:"center",fontSize:11,color:"#AEAEB2",marginTop:14}}>
                🔒 Your information is safe and encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
