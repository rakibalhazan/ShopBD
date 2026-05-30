import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

/* ─────────────────────────────────────────
   STYLES
───────────────────────────────────────── */
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=Hind+Siliguri:wght@400;500;600;700&display=swap');

*,*::before,*::after{box-sizing:border-box;}
html,body{margin:0;padding:0;height:100%;}
body{font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif;background:#F0F2F5;color:#1C1C1E;-webkit-font-smoothing:antialiased;overflow:hidden;}
#root{height:100%;}
.bn{font-family:'Hind Siliguri',sans-serif;}

::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:#D1D1D6;border-radius:6px;}

@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideRight{from{opacity:0;transform:translateX(100%)}to{opacity:1;transform:translateX(0)}}
@keyframes popIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}
@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}

.fu{animation:fadeUp .45s cubic-bezier(.22,1,.36,1) both;}
.fu1{animation:fadeUp .45s .05s cubic-bezier(.22,1,.36,1) both;}
.fu2{animation:fadeUp .45s .1s cubic-bezier(.22,1,.36,1) both;}
.fu3{animation:fadeUp .45s .15s cubic-bezier(.22,1,.36,1) both;}
.fade-in{animation:fadeIn .3s ease both;}
.slide-panel{animation:slideRight .35s cubic-bezier(.22,1,.36,1);}
.pop-in{animation:popIn .3s cubic-bezier(.34,1.4,.64,1) both;}
.sk{background:linear-gradient(90deg,#EBEBEB 0px,#E0E0E0 150px,#EBEBEB 300px);background-size:400px;animation:shimmer 1.4s infinite;}

.tap{cursor:pointer;border:none;outline:none;transition:transform .13s ease,opacity .14s ease;}
.tap:hover{opacity:.88;}.tap:active{transform:scale(.95) !important;}

.nav-item{cursor:pointer;transition:background .16s ease,color .16s ease;border-radius:11px;user-select:none;}
.nav-item:hover{background:rgba(255,255,255,.09)!important;}

.stat-card{transition:transform .28s cubic-bezier(.34,1.2,.64,1),box-shadow .28s ease;}
.stat-card:hover{transform:translateY(-5px);box-shadow:0 18px 48px rgba(0,0,0,.12);}

.tbl-row{transition:background .14s ease;}
.tbl-row:hover{background:rgba(0,111,214,.035)!important;}

.inp{padding:10px 14px;background:white;border:1.5px solid rgba(0,0,0,.09);border-radius:12px;font-size:13px;color:#1C1C1E;font-family:'DM Sans',-apple-system,sans-serif;outline:none;transition:border .2s ease,box-shadow .2s ease;width:100%;box-sizing:border-box;}
.inp:focus{border-color:#006FD6;box-shadow:0 0 0 3px rgba(0,111,214,.1);}
.inp::placeholder{color:#AEAEB2;}

/* Sidebar */
.sidebar{position:fixed;left:0;top:0;bottom:0;width:240px;z-index:100;transition:transform .3s cubic-bezier(.22,1,.36,1);}
.sidebar-ovl{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:99;animation:fadeIn .22s ease;}

@media(max-width:820px){
  .sidebar{transform:translateX(-100%);}
  .sidebar.open{transform:translateX(0);}
  .main-area{margin-left:0!important;}
}
@media(min-width:821px){
  .mob-only{display:none!important;}
}
`;

/* ─────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────── */
const REVENUE_DATA = [
  {day:"Mon",v:12400},{day:"Tue",v:19200},{day:"Wed",v:9800},
  {day:"Thu",v:23100},{day:"Fri",v:31500},{day:"Sat",v:42300},{day:"Sun",v:28700},
];

const STATUS_CFG = {
  pending:    {label:"Pending",   labelBn:"অপেক্ষমান",     col:"#FF9500",bg:"rgba(255,149,0,.1)"},
  processing: {label:"Processing",labelBn:"প্রক্রিয়াধীন",   col:"#006FD6",bg:"rgba(0,111,214,.1)"},
  shipped:    {label:"Shipped",   labelBn:"পাঠানো হয়েছে",  col:"#8B5CF6",bg:"rgba(139,92,246,.1)"},
  delivered:  {label:"Delivered", labelBn:"ডেলিভারি হয়েছে",col:"#34C759",bg:"rgba(52,199,89,.1)"},
  cancelled:  {label:"Cancelled", labelBn:"বাতিল",          col:"#FF3B30",bg:"rgba(255,59,48,.1)"},
};

const INIT_ORDERS = [
  {id:"BD-4892",name:"Rahim Uddin",    phone:"017-1234-5678",items:3,total:2997, pay:"bKash",  status:"delivered",  date:"May 28"},
  {id:"BD-4891",name:"Fatema Begum",   phone:"018-1234-5678",items:1,total:1299, pay:"COD",    status:"shipped",    date:"May 28"},
  {id:"BD-4890",name:"Karim Ahmed",    phone:"019-1234-5678",items:2,total:1398, pay:"Nagad",  status:"processing", date:"May 27"},
  {id:"BD-4889",name:"Nasrin Akter",   phone:"016-1234-5678",items:5,total:4895, pay:"bKash",  status:"pending",    date:"May 27"},
  {id:"BD-4888",name:"Jakir Hossain",  phone:"015-1234-5678",items:1,total:799,  pay:"COD",    status:"cancelled",  date:"May 26"},
  {id:"BD-4887",name:"Sumaiya Khanam", phone:"017-2987-6540",items:2,total:2098, pay:"bKash",  status:"delivered",  date:"May 26"},
  {id:"BD-4886",name:"Tariq Islam",    phone:"018-2987-6540",items:1,total:2499, pay:"COD",    status:"shipped",    date:"May 25"},
  {id:"BD-4885",name:"Mim Akter",      phone:"019-2987-6540",items:3,total:1797, pay:"Nagad",  status:"delivered",  date:"May 25"},
  {id:"BD-4884",name:"Sohel Rana",     phone:"016-3456-7890",items:2,total:2198, pay:"bKash",  status:"pending",    date:"May 24"},
  {id:"BD-4883",name:"Riya Chowdhury", phone:"017-3456-7890",items:4,total:3196, pay:"COD",    status:"processing", date:"May 24"},
];

const INIT_PRODS = [
  {id:1, en:"Wireless Earbuds Pro",   bn:"ওয়্যারলেস ইয়ারবাড প্রো",  cat:"Electronics",price:1299,stock:15,ic:"🎧",bg:"#EEF2FF"},
  {id:2, en:"Smart LED Watch",        bn:"স্মার্ট এলইডি ঘড়ি",          cat:"Electronics",price:2499,stock:8, ic:"⌚",bg:"#F0F9FF"},
  {id:3, en:"Premium Cotton Kurta",   bn:"প্রিমিয়াম কটন কুর্তা",       cat:"Clothing",   price:799, stock:32,ic:"👗",bg:"#FFF7ED"},
  {id:4, en:"Organic Honey 500g",     bn:"অর্গানিক মধু ৫০০ গ্রাম",      cat:"Food",       price:349, stock:44,ic:"🍯",bg:"#FFFBEB"},
  {id:5, en:"Minimalist Desk Lamp",   bn:"মিনিমালিস্ট ডেস্ক ল্যাম্প",   cat:"Home",       price:1599,stock:12,ic:"💡",bg:"#F0FDF4"},
  {id:6, en:"Vitamin C Serum",        bn:"ভিটামিন সি সিরাম",             cat:"Beauty",     price:599, stock:24,ic:"✨",bg:"#FDF4FF"},
  {id:7, en:"Yoga Mat Premium",       bn:"প্রিমিয়াম যোগব্যায়াম ম্যাট", cat:"Sports",     price:1099,stock:19,ic:"🧘",bg:"#F0FDF4"},
  {id:8, en:"Leather Wallet",         bn:"লেদার ওয়ালেট",                 cat:"Clothing",   price:699, stock:4, ic:"👜",bg:"#FFF7ED"},
];

const PAY_COL = {bKash:"#E2146C",COD:"#34C759",Nagad:"#F5820D"};

/* ─────────────────────────────────────────
   SIDEBAR NAV ICONS (SVG)
───────────────────────────────────────── */
const Ico = {
  grid:(c)=><svg width="17" height="17" viewBox="0 0 17 17" fill="none"><rect x="1" y="1" width="6" height="6" rx="2" stroke={c} strokeWidth="1.5"/><rect x="10" y="1" width="6" height="6" rx="2" stroke={c} strokeWidth="1.5"/><rect x="1" y="10" width="6" height="6" rx="2" stroke={c} strokeWidth="1.5"/><rect x="10" y="10" width="6" height="6" rx="2" stroke={c} strokeWidth="1.5"/></svg>,
  box: (c)=><svg width="17" height="17" viewBox="0 0 17 17" fill="none"><path d="M8.5 1.5L15 5v7L8.5 15.5 2 12V5l6.5-3.5z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><path d="M8.5 1.5V15.5M2 5l6.5 3.5L15 5" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  clip:(c)=><svg width="17" height="17" viewBox="0 0 17 17" fill="none"><rect x="2" y="3" width="13" height="13" rx="2.5" stroke={c} strokeWidth="1.5"/><path d="M5.5 1.5h6v3h-6z" fill={c} opacity=".5"/><path d="M5 8h7M5 11h5" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  user:(c)=><svg width="17" height="17" viewBox="0 0 17 17" fill="none"><circle cx="8.5" cy="6" r="3.5" stroke={c} strokeWidth="1.5"/><path d="M2 15c0-3.314 2.91-6 6.5-6s6.5 2.686 6.5 6" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  gear:(c)=><svg width="17" height="17" viewBox="0 0 17 17" fill="none"><circle cx="8.5" cy="8.5" r="2.5" stroke={c} strokeWidth="1.5"/><path d="M8.5 1v2M8.5 14v2M1 8.5h2M14 8.5h2M3 3l1.5 1.5M12 12l1.5 1.5M3 14l1.5-1.5M12 5l1.5-1.5" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  bell:(c)=><svg width="17" height="17" viewBox="0 0 17 17" fill="none"><path d="M8.5 1.5A5 5 0 0 0 3.5 6.5v4L2 12h13l-1.5-1.5v-4A5 5 0 0 0 8.5 1.5z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><path d="M7 13.5a1.5 1.5 0 0 0 3 0" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  plus:(c)=><svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 2v11M2 7.5h11" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  edit:(c)=><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9.5 1.5l3 3-8 8H1.5v-3l8-8z" stroke={c} strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  trash:(c)=><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3.5h10M5 3.5V2h4v1.5M5.5 6v4.5M8.5 6v4.5M3 3.5l.5 9h7l.5-9" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  close:(c)=><svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 1l11 11M12 1L1 12" stroke={c} strokeWidth="1.6" strokeLinecap="round"/></svg>,
  search:(c)=><svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="6.5" cy="6.5" r="4.5" stroke={c} strokeWidth="1.4"/><path d="M10.5 10.5L14 14" stroke={c} strokeWidth="1.4" strokeLinecap="round"/></svg>,
  chart:(c)=><svg width="17" height="17" viewBox="0 0 17 17" fill="none"><path d="M2 14L6 9l3.5 3L14 5" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

/* ─────────────────────────────────────────
   STATUS BADGE
───────────────────────────────────────── */
function Badge({ status }) {
  const c = STATUS_CFG[status] || STATUS_CFG.pending;
  return (
    <span style={{ fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:20,
      background:c.bg,color:c.col,whiteSpace:"nowrap" }}>
      {c.label}
    </span>
  );
}

/* ─────────────────────────────────────────
   STAT CARD
───────────────────────────────────────── */
function StatCard({ label, labelBn, value, icon, trend, up, col, delay }) {
  return (
    <div className="stat-card" style={{
      background:"white",borderRadius:22,padding:"22px 24px",
      boxShadow:"0 2px 16px rgba(0,0,0,.06)",
      animation:`fadeUp .45s ${delay}s cubic-bezier(.22,1,.36,1) both`,
    }}>
      <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:16 }}>
        <div style={{ width:44,height:44,borderRadius:14,background:col+"1A",
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:22 }}>
          {icon}
        </div>
        <span style={{ fontSize:11,fontWeight:700,padding:"4px 9px",borderRadius:20,
          background:up?"rgba(52,199,89,.1)":"rgba(255,59,48,.1)",
          color:up?"#34C759":"#FF3B30" }}>
          {up?"↑":"↓"} {trend}
        </span>
      </div>
      <p style={{ fontSize:26,fontWeight:800,color:"#1C1C1E",margin:"0 0 4px",letterSpacing:"-0.5px" }}>{value}</p>
      <p style={{ fontSize:13,fontWeight:500,color:"#6C6C70",margin:0 }}>{label}</p>
      <p className="bn" style={{ fontSize:11,color:"#AEAEB2",margin:0 }}>{labelBn}</p>
    </div>
  );
}

/* ─────────────────────────────────────────
   CUSTOM TOOLTIP FOR CHART
───────────────────────────────────────── */
function CustomTooltip({ active, payload, label }) {
  if (!active||!payload?.length) return null;
  return (
    <div style={{ background:"#18181B",borderRadius:12,padding:"10px 14px",boxShadow:"0 8px 24px rgba(0,0,0,.2)" }}>
      <p style={{ fontSize:12,color:"rgba(255,255,255,.6)",margin:"0 0 3px" }}>{label}</p>
      <p style={{ fontSize:15,fontWeight:700,color:"white",margin:0 }}>৳{payload[0].value.toLocaleString()}</p>
    </div>
  );
}

/* ─────────────────────────────────────────
   ADD PRODUCT PANEL
───────────────────────────────────────── */
function AddPanel({ onClose, onAdd }) {
  const [f,setF] = useState({en:"",bn:"",price:"",orig:"",cat:"Electronics",stock:"",ic:"📦"});
  const cats = ["Electronics","Clothing","Food","Home","Beauty","Sports"];
  const bgs  = {Electronics:"#EEF2FF",Clothing:"#FFF7ED",Food:"#FFFBEB",Home:"#F0FDF4",Beauty:"#FDF4FF",Sports:"#F0FDF4"};
  const ok = f.en&&f.price&&f.stock;

  return (
    <>
      <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:200 }} className="fade-in"/>
      <div className="slide-panel" style={{
        position:"fixed",top:0,right:0,bottom:0,width:"min(400px,100vw)",
        background:"white",zIndex:201,overflowY:"auto",
        boxShadow:"-8px 0 40px rgba(0,0,0,.14)",
      }}>
        <div style={{ padding:"24px 24px 20px",borderBottom:"1px solid rgba(0,0,0,.07)",
          display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div>
            <h3 style={{ fontSize:18,fontWeight:800,color:"#1C1C1E",margin:0 }}>Add Product</h3>
            <p className="bn" style={{ fontSize:12,color:"#8E8E93",margin:0 }}>নতুন পণ্য যোগ করুন</p>
          </div>
          <button className="tap" onClick={onClose} style={{ width:34,height:34,borderRadius:17,
            background:"rgba(0,0,0,.06)",display:"flex",alignItems:"center",justifyContent:"center" }}>
            {Ico.close("#3C3C43")}
          </button>
        </div>

        <div style={{ padding:"24px",display:"flex",flexDirection:"column",gap:18 }}>
          {/* Preview */}
          <div style={{ background:bgs[f.cat]||"#EEF2FF",borderRadius:18,height:130,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:56 }}>
            {f.ic||"📦"}
          </div>

          <div style={{ display:"grid",gridTemplateColumns:"1fr 80px",gap:12 }}>
            <div>
              <label style={{ fontSize:12,fontWeight:600,color:"#3C3C43",display:"block",marginBottom:6 }}>Product Name (English) *</label>
              <input className="inp" placeholder="e.g. Wireless Earbuds" value={f.en} onChange={e=>setF(p=>({...p,en:e.target.value}))}/>
            </div>
            <div>
              <label style={{ fontSize:12,fontWeight:600,color:"#3C3C43",display:"block",marginBottom:6 }}>Icon</label>
              <input className="inp" placeholder="🎧" value={f.ic} onChange={e=>setF(p=>({...p,ic:e.target.value}))} style={{ textAlign:"center",fontSize:22 }}/>
            </div>
          </div>

          <div>
            <label style={{ fontSize:12,fontWeight:600,color:"#3C3C43",display:"block",marginBottom:6 }}>Bengali Name</label>
            <input className="inp bn" placeholder="বাংলা নাম" value={f.bn} onChange={e=>setF(p=>({...p,bn:e.target.value}))}/>
          </div>

          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12 }}>
            <div>
              <label style={{ fontSize:12,fontWeight:600,color:"#3C3C43",display:"block",marginBottom:6 }}>Price (৳) *</label>
              <input className="inp" type="number" placeholder="1299" value={f.price} onChange={e=>setF(p=>({...p,price:e.target.value}))}/>
            </div>
            <div>
              <label style={{ fontSize:12,fontWeight:600,color:"#3C3C43",display:"block",marginBottom:6 }}>Orig. Price (৳)</label>
              <input className="inp" type="number" placeholder="1799" value={f.orig} onChange={e=>setF(p=>({...p,orig:e.target.value}))}/>
            </div>
            <div>
              <label style={{ fontSize:12,fontWeight:600,color:"#3C3C43",display:"block",marginBottom:6 }}>Stock *</label>
              <input className="inp" type="number" placeholder="10" value={f.stock} onChange={e=>setF(p=>({...p,stock:e.target.value}))}/>
            </div>
          </div>

          <div>
            <label style={{ fontSize:12,fontWeight:600,color:"#3C3C43",display:"block",marginBottom:6 }}>Category</label>
            <select className="inp" value={f.cat} onChange={e=>setF(p=>({...p,cat:e.target.value}))}>
              {cats.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ display:"flex",gap:10,paddingTop:8 }}>
            <button className="tap" onClick={onClose} style={{ flex:1,padding:"12px 0",background:"rgba(0,0,0,.05)",color:"#3C3C43",borderRadius:13,fontSize:14,fontWeight:600 }}>
              Cancel
            </button>
            <button className="tap" onClick={()=>{
              if(!ok) return;
              onAdd({
                id:Date.now(),en:f.en,bn:f.bn||f.en,
                cat:f.cat,price:+f.price,stock:+f.stock,
                ic:f.ic||"📦",bg:bgs[f.cat]||"#EEF2FF",
              });
              onClose();
            }} style={{ flex:2,padding:"12px 0",background:ok?"#006FD6":"rgba(0,111,214,.35)",color:"white",borderRadius:13,fontSize:14,fontWeight:700 }}>
              Add Product
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────
   TABS
───────────────────────────────────────── */
function DashboardTab({ orders }) {
  const pending = orders.filter(o=>o.status==="pending").length;
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:24 }}>
      {/* Stats */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16 }}>
        <StatCard label="Total Revenue"  labelBn="মোট আয়"      value="৳1,84,750" icon="💰" trend="12%" up col="#006FD6" delay={0}/>
        <StatCard label="Total Orders"   labelBn="মোট অর্ডার"   value="1,247"     icon="📦" trend="8%"  up col="#34C759" delay={0.05}/>
        <StatCard label="Active Products"labelBn="সক্রিয় পণ্য"  value="18"        icon="🛍" trend="2"   up col="#FF9500" delay={0.1}/>
        <StatCard label="Customers"      labelBn="মোট গ্রাহক"   value="892"       icon="👥" trend="15%" up col="#FF2D55" delay={0.15}/>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"1fr 340px",gap:20 }}>
        {/* Revenue chart */}
        <div className="fu1" style={{ background:"white",borderRadius:22,padding:"24px",boxShadow:"0 2px 16px rgba(0,0,0,.06)" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20 }}>
            <div>
              <p style={{ fontSize:16,fontWeight:700,color:"#1C1C1E",margin:0 }}>Weekly Revenue</p>
              <p className="bn" style={{ fontSize:12,color:"#8E8E93",margin:0 }}>এই সপ্তাহের আয়</p>
            </div>
            <span style={{ fontSize:13,fontWeight:700,color:"#34C759",background:"rgba(52,199,89,.1)",padding:"4px 10px",borderRadius:20 }}>+18%</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={REVENUE_DATA} barSize={28} barCategoryGap="30%">
              <XAxis dataKey="day" tick={{ fill:"#AEAEB2",fontSize:12 }} axisLine={false} tickLine={false}/>
              <YAxis hide/>
              <Tooltip content={<CustomTooltip/>} cursor={{ fill:"rgba(0,111,214,.05)", radius:8 }}/>
              <Bar dataKey="v" radius={[8,8,0,0]}>
                {REVENUE_DATA.map((d,i)=>(
                  <Cell key={i} fill={i===5?"#006FD6":"#E0EAFF"}/>
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p style={{ fontSize:12,color:"#AEAEB2",textAlign:"center",marginTop:8,marginBottom:0 }}>Highest: Saturday ৳42,300</p>
        </div>

        {/* Quick summary */}
        <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
          {/* Pending alert */}
          {pending>0&&(
            <div className="fu2 pop-in" style={{ background:"rgba(255,149,0,.08)",border:"1.5px solid rgba(255,149,0,.2)",borderRadius:18,padding:"16px 18px" }}>
              <p style={{ fontSize:13,fontWeight:700,color:"#FF9500",margin:"0 0 4px" }}>⚠️ {pending} Pending Orders</p>
              <p className="bn" style={{ fontSize:12,color:"#8E8E93",margin:0 }}>{pending}টি অর্ডার অপেক্ষমান</p>
            </div>
          )}

          {/* Payment breakdown */}
          <div className="fu2" style={{ background:"white",borderRadius:18,padding:"18px",boxShadow:"0 2px 14px rgba(0,0,0,.05)",flex:1 }}>
            <p style={{ fontSize:14,fontWeight:700,color:"#1C1C1E",margin:"0 0 14px" }}>Payment Breakdown</p>
            {[{m:"COD",p:42,c:"#34C759"},{m:"bKash",p:38,c:"#E2146C"},{m:"Nagad",p:20,c:"#F5820D"}].map(b=>(
              <div key={b.m} style={{ marginBottom:12 }}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5 }}>
                  <span style={{ fontSize:12,fontWeight:500,color:"#3C3C43" }}>{b.m}</span>
                  <span style={{ fontSize:12,fontWeight:700,color:b.c }}>{b.p}%</span>
                </div>
                <div style={{ height:6,borderRadius:3,background:"rgba(0,0,0,.05)",overflow:"hidden" }}>
                  <div style={{ height:"100%",width:b.p+"%",borderRadius:3,background:b.c,transition:"width .6s ease" }}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="fu3" style={{ background:"white",borderRadius:22,overflow:"hidden",boxShadow:"0 2px 16px rgba(0,0,0,.06)" }}>
        <div style={{ padding:"20px 24px 16px",borderBottom:"1px solid rgba(0,0,0,.07)",
          display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <p style={{ fontSize:15,fontWeight:700,color:"#1C1C1E",margin:0 }}>Recent Orders</p>
          <span style={{ fontSize:12,color:"#006FD6",cursor:"pointer",fontWeight:600 }}>View All →</span>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%",borderCollapse:"collapse",minWidth:560 }}>
            <thead>
              <tr style={{ background:"#F7F7F9" }}>
                {["Order ID","Customer","Total","Payment","Status","Date"].map(h=>(
                  <th key={h} style={{ padding:"11px 16px",fontSize:11,fontWeight:700,color:"#8E8E93",textAlign:"left",whiteSpace:"nowrap",letterSpacing:.4 }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.slice(0,5).map((o,i)=>(
                <tr key={o.id} className="tbl-row" style={{ borderTop:"1px solid rgba(0,0,0,.05)",background:i%2===0?"white":"rgba(0,0,0,.01)" }}>
                  <td style={{ padding:"13px 16px",fontSize:12,fontWeight:700,color:"#006FD6" }}>{o.id}</td>
                  <td style={{ padding:"13px 16px" }}>
                    <p style={{ fontSize:13,fontWeight:600,color:"#1C1C1E",margin:0 }}>{o.name}</p>
                    <p style={{ fontSize:11,color:"#8E8E93",margin:0 }}>{o.phone}</p>
                  </td>
                  <td style={{ padding:"13px 16px",fontSize:13,fontWeight:700,color:"#1C1C1E" }}>৳{o.total.toLocaleString()}</td>
                  <td style={{ padding:"13px 16px" }}>
                    <span style={{ fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:20,
                      background:PAY_COL[o.pay]+"18",color:PAY_COL[o.pay] }}>{o.pay}</span>
                  </td>
                  <td style={{ padding:"13px 16px" }}><Badge status={o.status}/></td>
                  <td style={{ padding:"13px 16px",fontSize:12,color:"#8E8E93" }}>{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ProductsTab({ prods, setProds, showAdd, setShowAdd }) {
  const [search,setSearch] = useState("");
  const [delId, setDelId]  = useState(null);
  const list = prods.filter(p=>p.en.toLowerCase().includes(search.toLowerCase())||p.cat.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:18 }}>
      <div style={{ display:"flex",alignItems:"center",gap:12,flexWrap:"wrap" }}>
        <div style={{ position:"relative",flex:1,minWidth:200 }}>
          <span style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none" }}>{Ico.search("#AEAEB2")}</span>
          <input className="inp" placeholder="Search products…" value={search} onChange={e=>setSearch(e.target.value)} style={{ paddingLeft:36 }}/>
        </div>
        <button className="tap" onClick={()=>setShowAdd(true)} style={{ display:"flex",alignItems:"center",gap:8,padding:"10px 20px",background:"#006FD6",color:"white",borderRadius:13,fontSize:13,fontWeight:700,flexShrink:0,boxShadow:"0 4px 16px rgba(0,111,214,.3)" }}>
          {Ico.plus("white")}<span>Add Product</span>
        </button>
      </div>

      {/* Low stock warning */}
      {prods.some(p=>p.stock<=5)&&(
        <div style={{ background:"rgba(255,59,48,.06)",border:"1.5px solid rgba(255,59,48,.2)",borderRadius:14,padding:"12px 16px" }}>
          <p style={{ fontSize:13,fontWeight:600,color:"#FF3B30",margin:0 }}>
            ⚠️ Low stock: {prods.filter(p=>p.stock<=5).map(p=>p.en).join(", ")}
          </p>
        </div>
      )}

      <div style={{ background:"white",borderRadius:22,overflow:"hidden",boxShadow:"0 2px 16px rgba(0,0,0,.06)" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%",borderCollapse:"collapse",minWidth:620 }}>
            <thead>
              <tr style={{ background:"#F7F7F9" }}>
                {["Product","Category","Price","Stock","Status","Actions"].map(h=>(
                  <th key={h} style={{ padding:"12px 16px",fontSize:11,fontWeight:700,color:"#8E8E93",textAlign:"left",letterSpacing:.4 }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((p,i)=>(
                <tr key={p.id} className="tbl-row" style={{ borderTop:"1px solid rgba(0,0,0,.05)",background:i%2===0?"white":"rgba(0,0,0,.01)" }}>
                  <td style={{ padding:"13px 16px" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                      <div style={{ width:38,height:38,borderRadius:10,background:p.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{p.ic}</div>
                      <div>
                        <p style={{ fontSize:13,fontWeight:600,color:"#1C1C1E",margin:0,lineHeight:1.3 }}>{p.en}</p>
                        <p className="bn" style={{ fontSize:11,color:"#8E8E93",margin:0 }}>{p.bn}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:"13px 16px",fontSize:12,color:"#6C6C70" }}>{p.cat}</td>
                  <td style={{ padding:"13px 16px",fontSize:13,fontWeight:700,color:"#1C1C1E" }}>৳{p.price.toLocaleString()}</td>
                  <td style={{ padding:"13px 16px" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                      <button className="tap" onClick={()=>setProds(prev=>prev.map(x=>x.id===p.id?{...x,stock:Math.max(0,x.stock-1)}:x))}
                        style={{ width:22,height:22,borderRadius:11,background:"rgba(0,0,0,.07)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14 }}>−</button>
                      <span style={{ fontSize:13,fontWeight:700,color:p.stock<=5?"#FF3B30":p.stock<=10?"#FF9500":"#1C1C1E",minWidth:20,textAlign:"center" }}>{p.stock}</span>
                      <button className="tap" onClick={()=>setProds(prev=>prev.map(x=>x.id===p.id?{...x,stock:x.stock+1}:x))}
                        style={{ width:22,height:22,borderRadius:11,background:"rgba(0,0,0,.07)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14 }}>+</button>
                    </div>
                  </td>
                  <td style={{ padding:"13px 16px" }}>
                    <span style={{ fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:20,
                      background:p.stock>0?"rgba(52,199,89,.1)":"rgba(255,59,48,.1)",
                      color:p.stock>0?"#34C759":"#FF3B30" }}>
                      {p.stock>0?"In Stock":"Out of Stock"}
                    </span>
                  </td>
                  <td style={{ padding:"13px 16px" }}>
                    <div style={{ display:"flex",gap:8 }}>
                      <button className="tap" style={{ width:30,height:30,borderRadius:9,background:"rgba(0,111,214,.08)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                        {Ico.edit("#006FD6")}
                      </button>
                      {delId===p.id?(
                        <div style={{ display:"flex",gap:5 }}>
                          <button className="tap" onClick={()=>{setProds(prev=>prev.filter(x=>x.id!==p.id));setDelId(null);}}
                            style={{ padding:"4px 8px",background:"#FF3B30",color:"white",borderRadius:8,fontSize:11,fontWeight:700 }}>Yes</button>
                          <button className="tap" onClick={()=>setDelId(null)}
                            style={{ padding:"4px 8px",background:"rgba(0,0,0,.07)",borderRadius:8,fontSize:11,fontWeight:600 }}>No</button>
                        </div>
                      ):(
                        <button className="tap" onClick={()=>setDelId(p.id)} style={{ width:30,height:30,borderRadius:9,background:"rgba(255,59,48,.08)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                          {Ico.trash("#FF3B30")}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length===0&&(
            <div style={{ textAlign:"center",padding:"60px 0" }}>
              <p style={{ fontSize:32,marginBottom:8 }}>🔍</p>
              <p style={{ fontSize:14,color:"#8E8E93" }}>No products match your search</p>
            </div>
          )}
        </div>
        <div style={{ padding:"14px 20px",borderTop:"1px solid rgba(0,0,0,.06)",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <span style={{ fontSize:12,color:"#8E8E93" }}>{list.length} products</span>
          <span style={{ fontSize:12,color:"#8E8E93" }}>Total stock: {prods.reduce((s,p)=>s+p.stock,0)} units</span>
        </div>
      </div>
    </div>
  );
}

function OrdersTab({ orders, setOrders }) {
  const [filter, setFilter]  = useState("all");
  const [search, setSearch]  = useState("");
  const statuses = ["all","pending","processing","shipped","delivered","cancelled"];
  const counts   = Object.fromEntries(statuses.map(s=>[s,s==="all"?orders.length:orders.filter(o=>o.status===s).length]));
  const list = orders.filter(o=>(filter==="all"||o.status===filter)&&(o.name.toLowerCase().includes(search.toLowerCase())||o.id.toLowerCase().includes(search.toLowerCase())));

  const updateStatus = (id,status) => setOrders(prev=>prev.map(o=>o.id===id?{...o,status}:o));

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:18 }}>
      {/* Search */}
      <div style={{ position:"relative",maxWidth:360 }}>
        <span style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none" }}>{Ico.search("#AEAEB2")}</span>
        <input className="inp" placeholder="Search by name or order ID…" value={search} onChange={e=>setSearch(e.target.value)} style={{ paddingLeft:36 }}/>
      </div>

      {/* Status filter pills */}
      <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
        {statuses.map(s=>{
          const cfg = s==="all"?{label:"All",col:"#006FD6"}:STATUS_CFG[s];
          return (
            <button key={s} className="tap" onClick={()=>setFilter(s)} style={{
              padding:"7px 14px",borderRadius:22,fontSize:12,fontWeight:600,
              background:filter===s?(s==="all"?"#006FD6":cfg.col):"white",
              color:filter===s?"white":(s==="all"?"#1C1C1E":cfg.col),
              border:`1.5px solid ${filter===s?(s==="all"?"transparent":cfg.col):"rgba(0,0,0,.09)"}`,
              boxShadow:filter===s?"0 3px 12px rgba(0,0,0,.15)":"0 1px 4px rgba(0,0,0,.05)",
            }}>
              {s==="all"?"All":cfg.label} <span style={{ opacity:.65,marginLeft:4 }}>({counts[s]})</span>
            </button>
          );
        })}
      </div>

      {/* Orders table */}
      <div style={{ background:"white",borderRadius:22,overflow:"hidden",boxShadow:"0 2px 16px rgba(0,0,0,.06)" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%",borderCollapse:"collapse",minWidth:720 }}>
            <thead>
              <tr style={{ background:"#F7F7F9" }}>
                {["Order","Customer","Items","Total","Payment","Status","Date","Update"].map(h=>(
                  <th key={h} style={{ padding:"12px 14px",fontSize:11,fontWeight:700,color:"#8E8E93",textAlign:"left",letterSpacing:.4,whiteSpace:"nowrap" }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((o,i)=>(
                <tr key={o.id} className="tbl-row" style={{ borderTop:"1px solid rgba(0,0,0,.05)",background:i%2===0?"white":"rgba(0,0,0,.01)" }}>
                  <td style={{ padding:"13px 14px",fontSize:12,fontWeight:700,color:"#006FD6",whiteSpace:"nowrap" }}>{o.id}</td>
                  <td style={{ padding:"13px 14px" }}>
                    <p style={{ fontSize:13,fontWeight:600,color:"#1C1C1E",margin:0 }}>{o.name}</p>
                    <p style={{ fontSize:11,color:"#8E8E93",margin:0 }}>{o.phone}</p>
                  </td>
                  <td style={{ padding:"13px 14px",fontSize:13,color:"#6C6C70",textAlign:"center" }}>{o.items}</td>
                  <td style={{ padding:"13px 14px",fontSize:13,fontWeight:700,color:"#1C1C1E",whiteSpace:"nowrap" }}>৳{o.total.toLocaleString()}</td>
                  <td style={{ padding:"13px 14px" }}>
                    <span style={{ fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:20,background:PAY_COL[o.pay]+"18",color:PAY_COL[o.pay] }}>{o.pay}</span>
                  </td>
                  <td style={{ padding:"13px 14px" }}><Badge status={o.status}/></td>
                  <td style={{ padding:"13px 14px",fontSize:12,color:"#8E8E93",whiteSpace:"nowrap" }}>{o.date}</td>
                  <td style={{ padding:"13px 14px" }}>
                    <select value={o.status} onChange={e=>updateStatus(o.id,e.target.value)}
                      style={{ fontSize:11,fontWeight:600,padding:"5px 8px",borderRadius:9,border:"1.5px solid rgba(0,0,0,.1)",background:"white",color:"#3C3C43",cursor:"pointer",outline:"none" }}>
                      {Object.entries(STATUS_CFG).map(([k,v])=>(
                        <option key={k} value={k}>{v.label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length===0&&(
            <div style={{ textAlign:"center",padding:"60px 0" }}>
              <p style={{ fontSize:32,marginBottom:8 }}>📭</p>
              <p style={{ fontSize:14,color:"#8E8E93" }}>No orders match this filter</p>
            </div>
          )}
        </div>
        <div style={{ padding:"14px 20px",borderTop:"1px solid rgba(0,0,0,.06)" }}>
          <span style={{ fontSize:12,color:"#8E8E93" }}>{list.length} orders shown</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN APP
───────────────────────────────────────── */
const NAV = [
  {id:"dashboard",label:"Dashboard",  ic:"grid"},
  {id:"orders",   label:"Orders",     ic:"clip"},
  {id:"products", label:"Products",   ic:"box"},
  {id:"customers",label:"Customers",  ic:"user"},
  {id:"settings", label:"Settings",   ic:"gear"},
];

export default function AdminDashboard() {
  const [tab,       setTab]      = useState("dashboard");
  const [sideOpen,  setSideOpen] = useState(false);
  const [orders,    setOrders]   = useState(INIT_ORDERS);
  const [prods,     setProds]    = useState(INIT_PRODS);
  const [showAdd,   setShowAdd]  = useState(false);

  const pending = orders.filter(o=>o.status==="pending").length;
  const PAGE_TITLES = { dashboard:"Dashboard", orders:"Orders", products:"Products", customers:"Customers", settings:"Settings" };

  return (
    <>
      <style>{STYLE}</style>

      {showAdd&&<AddPanel onClose={()=>setShowAdd(false)} onAdd={p=>setProds(prev=>[p,...prev])}/>}

      {/* Mobile sidebar overlay */}
      {sideOpen&&<div className="sidebar-ovl" onClick={()=>setSideOpen(false)}/>}

      <div style={{ display:"flex",height:"100vh",overflow:"hidden" }}>

        {/* ══════ SIDEBAR ══════ */}
        <div className={`sidebar${sideOpen?" open":""}`}
          style={{ background:"#18181B",display:"flex",flexDirection:"column" }}>

          {/* Logo */}
          <div style={{ padding:"24px 20px 20px",borderBottom:"1px solid rgba(255,255,255,.07)" }}>
            <span style={{ fontSize:21,fontWeight:800,color:"white",letterSpacing:"-0.6px" }}>
              Shop<span style={{ color:"#006FD6" }}>BD</span>
            </span>
            <p style={{ fontSize:11,color:"rgba(255,255,255,.35)",margin:"3px 0 0" }}>Admin Dashboard</p>
          </div>

          {/* Nav */}
          <nav style={{ flex:1,padding:"16px 12px",display:"flex",flexDirection:"column",gap:4 }}>
            {NAV.map(n=>{
              const active = tab===n.id;
              const color  = active?"white":"rgba(255,255,255,.5)";
              return (
                <div key={n.id} className="nav-item" onClick={()=>{setTab(n.id);setSideOpen(false);}}
                  style={{ display:"flex",alignItems:"center",gap:11,padding:"11px 14px",
                    background:active?"rgba(0,111,214,.22)":"transparent",
                    borderLeft:active?"3px solid #006FD6":"3px solid transparent",
                    borderRadius:active?"0 11px 11px 0":"0 11px 11px 0",
                    marginLeft:-12,paddingLeft:active?"17px":"14px",
                  }}>
                  {Ico[n.ic](color)}
                  <span style={{ fontSize:14,fontWeight:active?700:500,color,flex:1 }}>{n.label}</span>
                  {n.id==="orders"&&pending>0&&(
                    <span style={{ fontSize:10,fontWeight:800,background:"#FF3B30",color:"white",
                      minWidth:18,height:18,borderRadius:9,display:"flex",alignItems:"center",
                      justifyContent:"center",padding:"0 4px" }}>{pending}</span>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Admin profile */}
          <div style={{ padding:"16px 16px 20px",borderTop:"1px solid rgba(255,255,255,.07)",
            display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ width:36,height:36,borderRadius:18,background:"linear-gradient(135deg,#006FD6,#34C759)",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0 }}>👤</div>
            <div style={{ flex:1,minWidth:0 }}>
              <p style={{ fontSize:13,fontWeight:700,color:"white",margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>Admin</p>
              <p style={{ fontSize:11,color:"rgba(255,255,255,.4)",margin:0 }}>admin@shopbd.com</p>
            </div>
          </div>
        </div>

        {/* ══════ MAIN ══════ */}
        <div className="main-area" style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden",marginLeft:240 }}>

          {/* Top bar */}
          <div style={{ background:"white",borderBottom:"1px solid rgba(0,0,0,.07)",
            padding:"0 24px",height:60,display:"flex",alignItems:"center",
            justifyContent:"space-between",flexShrink:0 }}>
            <div style={{ display:"flex",alignItems:"center",gap:12 }}>
              {/* Mobile hamburger */}
              <button className="tap mob-only" onClick={()=>setSideOpen(v=>!v)}
                style={{ width:36,height:36,borderRadius:18,background:"rgba(0,0,0,.05)",
                  display:"flex",alignItems:"center",justifyContent:"center",color:"#3C3C43" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4H14M2 8H14M2 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
              <div>
                <h2 style={{ fontSize:18,fontWeight:800,color:"#1C1C1E",margin:0,letterSpacing:"-0.3px" }}>
                  {PAGE_TITLES[tab]}
                </h2>
              </div>
            </div>

            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <div style={{ position:"relative" }}>
                <button className="tap" style={{ width:38,height:38,borderRadius:19,
                  background:"rgba(0,0,0,.04)",display:"flex",alignItems:"center",
                  justifyContent:"center",color:"#3C3C43" }}>
                  {Ico.bell("#3C3C43")}
                </button>
                {pending>0&&<span style={{ position:"absolute",top:0,right:0,width:16,height:16,
                  borderRadius:8,background:"#FF3B30",color:"white",fontSize:9,fontWeight:800,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  border:"2px solid white" }}>{pending}</span>}
              </div>
              <div style={{ display:"flex",alignItems:"center",gap:8,padding:"7px 12px",
                background:"rgba(0,0,0,.04)",borderRadius:22 }}>
                <div style={{ width:26,height:26,borderRadius:13,
                  background:"linear-gradient(135deg,#006FD6,#34C759)",
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:13 }}>👤</div>
                <span style={{ fontSize:13,fontWeight:600,color:"#1C1C1E" }}>Admin</span>
              </div>
            </div>
          </div>

          {/* Page content */}
          <div key={tab} className="fade-in" style={{ flex:1,overflowY:"auto",padding:"24px" }}>
            {tab==="dashboard" && <DashboardTab orders={orders}/>}
            {tab==="products"  && <ProductsTab prods={prods} setProds={setProds} showAdd={showAdd} setShowAdd={setShowAdd}/>}
            {tab==="orders"    && <OrdersTab orders={orders} setOrders={setOrders}/>}
            {tab==="customers" && (
              <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:360,gap:12 }}>
                <span style={{ fontSize:56 }}>👥</span>
                <p style={{ fontSize:18,fontWeight:700,color:"#1C1C1E",margin:0 }}>Customers</p>
                <p style={{ fontSize:14,color:"#8E8E93",margin:0,textAlign:"center" }}>Customer management will be available after connecting the backend.</p>
                <p className="bn" style={{ fontSize:13,color:"#AEAEB2" }}>ব্যাকএন্ড সংযোগের পরে গ্রাহক ব্যবস্থাপনা পাওয়া যাবে</p>
              </div>
            )}
            {tab==="settings" && (
              <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:360,gap:12 }}>
                <span style={{ fontSize:56 }}>⚙️</span>
                <p style={{ fontSize:18,fontWeight:700,color:"#1C1C1E",margin:0 }}>Settings</p>
                <p style={{ fontSize:14,color:"#8E8E93",margin:0,textAlign:"center" }}>Settings will be available after backend is connected.</p>
                <p className="bn" style={{ fontSize:13,color:"#AEAEB2" }}>সেটিংস ব্যাকএন্ড সংযোগের পরে পাওয়া যাবে</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
