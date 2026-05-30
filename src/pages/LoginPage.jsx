import { useState } from "react";
import SharedNavbar from '../components/SharedNavbar';

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=Hind+Siliguri:wght@400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{margin:0;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif;background:#F7F7F9;color:#1C1C1E;-webkit-font-smoothing:antialiased;}
.bn{font-family:'Hind Siliguri',sans-serif;}

@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes popIn{from{opacity:0;transform:scale(.93)}to{opacity:1;transform:scale(1)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-7px)}40%,80%{transform:translateX(7px)}}
@keyframes slideTab{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
@keyframes drawCheck{from{stroke-dashoffset:60}to{stroke-dashoffset:0}}

.fu {animation:fadeUp .55s cubic-bezier(.22,1,.36,1) both;}
.fu1{animation:fadeUp .55s .07s cubic-bezier(.22,1,.36,1) both;}
.fu2{animation:fadeUp .55s .14s cubic-bezier(.22,1,.36,1) both;}
.fu3{animation:fadeUp .55s .21s cubic-bezier(.22,1,.36,1) both;}
.fu4{animation:fadeUp .55s .28s cubic-bezier(.22,1,.36,1) both;}
.fade-in{animation:fadeIn .3s ease both;}
.pop-in{animation:popIn .4s cubic-bezier(.34,1.4,.64,1) both;}
.float{animation:float 3.6s ease-in-out infinite;}
.tab-content{animation:slideTab .3s cubic-bezier(.22,1,.36,1) both;}
.shake{animation:shake .38s ease;}
.check-path{stroke-dasharray:60;stroke-dashoffset:60;animation:drawCheck .5s .3s cubic-bezier(.22,1,.36,1) forwards;}
@keyframes spin{to{transform:rotate(360deg)}}
.spin{animation:spin .7s linear infinite;}

.tap{cursor:pointer;border:none;outline:none;transition:transform .13s ease,opacity .14s ease;}
.tap:hover{opacity:.88;}.tap:active{transform:scale(.95) !important;}

.inp{width:100%;padding:13px 16px;background:white;border:1.5px solid rgba(0,0,0,.09);border-radius:14px;font-size:14px;color:#1C1C1E;font-family:'DM Sans',-apple-system,sans-serif;outline:none;transition:border .2s ease,box-shadow .2s ease;}
.inp:focus{border-color:#006FD6;box-shadow:0 0 0 4px rgba(0,111,214,.1);}
.inp::placeholder{color:#AEAEB2;}
.inp-err{border-color:#FF3B30 !important;box-shadow:0 0 0 3px rgba(255,59,48,.1) !important;}

.social-btn{transition:all .2s ease;cursor:pointer;border:1.5px solid rgba(0,0,0,.09);border-radius:14px;background:white;display:flex;align-items:center;justify-content:center;gap:9px;padding:12px 0;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;color:#1C1C1E;}
.social-btn:hover{border-color:rgba(0,0,0,.18);box-shadow:0 4px 16px rgba(0,0,0,.07);transform:translateY(-1px);}
.social-btn:active{transform:scale(.97);}

.tab-pill{transition:all .22s cubic-bezier(.34,1.2,.64,1);cursor:pointer;border-radius:12px;user-select:none;}
`;

/* ── Eye icon ── */
const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    {open
      ? <><path d="M1 9s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="#8E8E93" strokeWidth="1.4"/><circle cx="9" cy="9" r="2.5" stroke="#8E8E93" strokeWidth="1.4"/></>
      : <><path d="M1 9s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="#8E8E93" strokeWidth="1.4"/><path d="M2 2l14 14" stroke="#8E8E93" strokeWidth="1.4" strokeLinecap="round"/></>
    }
  </svg>
);

/* ── Field wrapper ── */
function Field({ label, labelBn, error, children }) {
  return (
    <div>
      <label style={{display:"block",fontSize:13,fontWeight:600,color:"#1C1C1E",marginBottom:7}}>
        {label}
        {labelBn && <span className="bn" style={{fontWeight:400,color:"#8E8E93",marginLeft:5,fontSize:12}}>{labelBn}</span>}
      </label>
      {children}
      {error && <p style={{fontSize:11,color:"#FF3B30",margin:"5px 0 0",fontWeight:500}}>{error}</p>}
    </div>
  );
}

/* ── Password input with toggle ── */
function PasswordInput({ value, onChange, placeholder, className }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{position:"relative"}}>
      <input
        type={show ? "text" : "password"}
        className={`inp${className ? " "+className : ""}`}
        placeholder={placeholder || "••••••••"}
        value={value}
        onChange={onChange}
        style={{paddingRight:46}}
      />
      <button
        type="button"
        className="tap"
        onClick={() => setShow(v => !v)}
        style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",display:"flex",alignItems:"center",justifyContent:"center"}}
      >
        <EyeIcon open={show}/>
      </button>
    </div>
  );
}

/* ── Success screen ── */
function SuccessScreen({ mode, name, onContinue }) {
  return (
    <div className="fade-in" style={{textAlign:"center",padding:"8px 0 4px"}}>
      <div className="pop-in" style={{width:72,height:72,borderRadius:36,background:"linear-gradient(135deg,#34C759,#30B955)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",boxShadow:"0 10px 28px rgba(52,199,89,.3)"}}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path className="check-path" d="M6 16L13 23L26 10" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h3 style={{fontSize:22,fontWeight:800,color:"#1C1C1E",marginBottom:6}}>
        {mode === "login" ? "Welcome back!" : "Account Created! 🎉"}
      </h3>
      {name && <p style={{fontSize:15,color:"#6C6C70",marginBottom:4}}>Hello, <strong style={{color:"#1C1C1E"}}>{name}</strong></p>}
      <p className="bn" style={{fontSize:14,color:"#8E8E93",marginBottom:28}}>
        {mode === "login" ? "সফলভাবে লগইন হয়েছে" : "অ্যাকাউন্ট তৈরি হয়েছে"}
      </p>
      <button className="tap" onClick={onContinue} style={{width:"100%",padding:"14px 0",background:"#006FD6",color:"white",borderRadius:15,fontSize:15,fontWeight:700,boxShadow:"0 6px 22px rgba(0,111,214,.28)"}}>
        Continue Shopping →
      </button>
    </div>
  );
}

/* ── Main App ── */
export default function LoginPage() {
  const [mode,       setMode]      = useState("login"); // "login" | "register"
  const [status,     setStatus]    = useState("idle");  // "idle" | "loading" | "success"
  const [shakeForm,  setShakeForm] = useState(false);
  const [errors,     setErrors]    = useState({});
  const [successName,setSuccessName] = useState("");

  /* Login form */
  const [lEmail,   setLE] = useState("");
  const [lPass,    setLP] = useState("");
  const [remember, setRem] = useState(false);

  /* Register form */
  const [rName,    setRN] = useState("");
  const [rPhone,   setRP] = useState("");
  const [rEmail,   setRE] = useState("");
  const [rPass,    setRPa] = useState("");
  const [rConf,    setRC] = useState("");
  const [agree,    setAgree] = useState(false);

  const switchMode = m => {
    setMode(m); setErrors({}); setStatus("idle");
  };

  const triggerShake = () => {
    setShakeForm(false);
    setTimeout(() => setShakeForm(true), 10);
    setTimeout(() => setShakeForm(false), 400);
  };

  const validateLogin = () => {
    const e = {};
    if (!lEmail.trim())  e.lEmail = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(lEmail)) e.lEmail = "Enter a valid email";
    if (!lPass.trim())   e.lPass  = "Password is required";
    else if (lPass.length < 6) e.lPass = "Minimum 6 characters";
    return e;
  };

  const validateRegister = () => {
    const e = {};
    if (!rName.trim())  e.rName  = "Full name is required";
    if (!rPhone.trim()) e.rPhone = "Phone is required";
    else if (!/^01[3-9]\d{8}$/.test(rPhone.trim())) e.rPhone = "Enter valid BD number (01XXXXXXXXX)";
    if (!rEmail.trim()) e.rEmail = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(rEmail)) e.rEmail = "Enter a valid email";
    if (!rPass.trim())  e.rPass  = "Password is required";
    else if (rPass.length < 6) e.rPass = "Minimum 6 characters";
    if (rPass !== rConf) e.rConf = "Passwords do not match";
    if (!agree) e.agree = "You must agree to the terms";
    return e;
  };

  const handleSubmit = () => {
    const e = mode === "login" ? validateLogin() : validateRegister();
    if (Object.keys(e).length) { setErrors(e); triggerShake(); return; }
    setErrors({});
    setStatus("loading");
    setTimeout(() => {
      setSuccessName(mode === "login" ? lEmail.split("@")[0] : rName.split(" ")[0]);
      setStatus("success");
    }, 1800);
  };

  return (
    <>
      <style>{STYLE}</style>
      <div style={{minHeight:"100vh",background:"radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,111,214,.06) 0%, transparent 65%), #F7F7F9",display:"flex",flexDirection:"column"}}>

        {/* Nav bar */}
        <nav style={{padding:"0 28px",borderBottom:"1px solid rgba(0,0,0,.07)",background:"rgba(247,247,249,.9)",backdropFilter:"blur(20px)",height:58,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <span style={{fontSize:21,fontWeight:800,color:"#1C1C1E",letterSpacing:"-0.6px"}}>
            Shop<span style={{color:"#006FD6"}}>BD</span>
          </span>
          <span style={{fontSize:13,color:"#8E8E93"}}>🔒 Secure &amp; Encrypted</span>
        </nav>

        {/* Main */}
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"28px 20px 48px"}}>
          <div style={{width:"100%",maxWidth:440}}>

            {/* Card */}
            <div className={`fu pop-in${shakeForm?" shake":""}`}
              style={{background:"white",borderRadius:28,padding:"clamp(28px,5vw,40px)",boxShadow:"0 12px 50px rgba(0,0,0,.09)"}}>

              {status === "success" ? (
                <SuccessScreen mode={mode} name={successName} onContinue={() => { setStatus("idle"); setMode("login"); }}/>
              ) : (
                <>
                  {/* Logo + heading */}
                  <div style={{textAlign:"center",marginBottom:28}}>
                    <span style={{fontSize:40,display:"block",marginBottom:12}} className="float">🛍️</span>
                    <h2 style={{fontSize:24,fontWeight:800,color:"#1C1C1E",margin:"0 0 5px",letterSpacing:"-0.4px"}}>
                      {mode === "login" ? "Welcome Back" : "Create Account"}
                    </h2>
                    <p className="bn" style={{fontSize:14,color:"#8E8E93",margin:0}}>
                      {mode === "login" ? "আপনার অ্যাকাউন্টে লগইন করুন" : "নতুন অ্যাকাউন্ট তৈরি করুন"}
                    </p>
                  </div>

                  {/* Mode toggle */}
                  <div style={{display:"flex",background:"#F7F7F9",borderRadius:16,padding:5,marginBottom:28,gap:4}}>
                    {[["login","Login","লগইন"],["register","Register","রেজিস্টার"]].map(([m,en,bn])=>(
                      <div key={m} className="tab-pill" onClick={() => switchMode(m)}
                        style={{flex:1,padding:"10px 0",textAlign:"center",
                          background:mode===m?"white":"transparent",
                          boxShadow:mode===m?"0 2px 12px rgba(0,0,0,.08)":"none"}}>
                        <span style={{fontSize:14,fontWeight:mode===m?700:500,color:mode===m?"#1C1C1E":"#8E8E93"}}>{en}</span>
                        <span className="bn" style={{fontSize:11,color:mode===m?"#8E8E93":"#AEAEB2",marginLeft:5}}>{bn}</span>
                      </div>
                    ))}
                  </div>

                  {/* Social login */}
                  <div className="fu1" style={{marginBottom:20}}>
                    <button className="social-btn" style={{width:"100%"}}>
                      <svg width="18" height="18" viewBox="0 0 18 18">
                        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                        <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                      </svg>
                      Continue with Google
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="fu1" style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
                    <div style={{flex:1,height:1,background:"rgba(0,0,0,.08)"}}/>
                    <span style={{fontSize:12,color:"#AEAEB2",fontWeight:500}}>or continue with email</span>
                    <div style={{flex:1,height:1,background:"rgba(0,0,0,.08)"}}/>
                  </div>

                  {/* Form fields */}
                  <div key={mode} className="tab-content" style={{display:"flex",flexDirection:"column",gap:14}}>

                    {mode === "register" && (
                      <>
                        <Field label="Full Name" labelBn="পুরো নাম" error={errors.rName}>
                          <input className={`inp${errors.rName?" inp-err":""}`} placeholder="e.g. Rahim Uddin" value={rName} onChange={e=>setRN(e.target.value)}/>
                        </Field>
                        <Field label="Phone" labelBn="ফোন নম্বর" error={errors.rPhone}>
                          <input className={`inp${errors.rPhone?" inp-err":""}`} type="tel" placeholder="01XXXXXXXXX" value={rPhone} onChange={e=>setRP(e.target.value)}/>
                        </Field>
                      </>
                    )}

                    <Field label="Email Address" labelBn="ইমেইল" error={mode==="login"?errors.lEmail:errors.rEmail}>
                      <input
                        className={`inp${(mode==="login"?errors.lEmail:errors.rEmail)?" inp-err":""}`}
                        type="email" placeholder="your@email.com"
                        value={mode==="login"?lEmail:rEmail}
                        onChange={e=>mode==="login"?setLE(e.target.value):setRE(e.target.value)}
                      />
                    </Field>

                    <Field label="Password" labelBn="পাসওয়ার্ড" error={mode==="login"?errors.lPass:errors.rPass}>
                      <PasswordInput
                        value={mode==="login"?lPass:rPass}
                        onChange={e=>mode==="login"?setLP(e.target.value):setRPa(e.target.value)}
                        className={(mode==="login"?errors.lPass:errors.rPass)?"inp-err":""}
                        placeholder={mode==="register"?"At least 6 characters":"••••••••"}
                      />
                    </Field>

                    {mode === "register" && (
                      <Field label="Confirm Password" labelBn="পাসওয়ার্ড নিশ্চিত করুন" error={errors.rConf}>
                        <PasswordInput value={rConf} onChange={e=>setRC(e.target.value)} className={errors.rConf?"inp-err":""} placeholder="Re-enter password"/>
                      </Field>
                    )}

                    {/* Login extras */}
                    {mode === "login" && (
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                        <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
                          <div onClick={()=>setRem(v=>!v)} style={{width:18,height:18,borderRadius:5,border:`1.5px solid ${remember?"#006FD6":"#D1D1D6"}`,background:remember?"#006FD6":"white",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .16s ease",flexShrink:0}}>
                            {remember&&<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5L3.8 7.5L8.5 2.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </div>
                          <span style={{fontSize:13,color:"#3C3C43"}}>Remember me</span>
                        </label>
                        <span style={{fontSize:13,color:"#006FD6",cursor:"pointer",fontWeight:600}}>Forgot password?</span>
                      </div>
                    )}

                    {/* Register terms */}
                    {mode === "register" && (
                      <div>
                        <label style={{display:"flex",alignItems:"flex-start",gap:9,cursor:"pointer"}}>
                          <div onClick={()=>setAgree(v=>!v)} style={{width:18,height:18,borderRadius:5,border:`1.5px solid ${agree?"#006FD6":errors.agree?"#FF3B30":"#D1D1D6"}`,background:agree?"#006FD6":"white",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .16s ease",flexShrink:0,marginTop:1}}>
                            {agree&&<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5L3.8 7.5L8.5 2.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </div>
                          <span style={{fontSize:13,color:"#3C3C43",lineHeight:1.5}}>
                            I agree to the <span style={{color:"#006FD6",fontWeight:600}}>Terms of Service</span> and <span style={{color:"#006FD6",fontWeight:600}}>Privacy Policy</span>
                          </span>
                        </label>
                        {errors.agree&&<p style={{fontSize:11,color:"#FF3B30",margin:"5px 0 0 27px"}}>{errors.agree}</p>}
                      </div>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    className="tap"
                    onClick={handleSubmit}
                    style={{width:"100%",marginTop:22,padding:"15px 0",background:status==="loading"?"rgba(0,111,214,.7)":"#006FD6",color:"white",borderRadius:16,fontSize:15,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:9,boxShadow:"0 6px 24px rgba(0,111,214,.28)",transition:"background .2s"}}>
                    {status === "loading" ? (
                      <><svg className="spin" width="17" height="17" viewBox="0 0 17 17" fill="none"><circle cx="8.5" cy="8.5" r="6.5" stroke="rgba(255,255,255,.3)" strokeWidth="2.5"/><path d="M8.5 2a6.5 6.5 0 0 1 6.5 6.5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>Please wait…</>
                    ) : mode === "login" ? (
                      "Login to ShopBD →"
                    ) : (
                      "Create My Account →"
                    )}
                  </button>

                  {/* Switch mode */}
                  <p style={{textAlign:"center",fontSize:13,color:"#8E8E93",marginTop:18,marginBottom:0}}>
                    {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                    <span style={{color:"#006FD6",fontWeight:700,cursor:"pointer"}} onClick={()=>switchMode(mode==="login"?"register":"login")}>
                      {mode === "login" ? "Register" : "Login"}
                    </span>
                  </p>
                </>
              )}
            </div>

            {/* Bottom trust */}
            <div className="fu2" style={{display:"flex",justifyContent:"center",gap:20,marginTop:20,flexWrap:"wrap"}}>
              {["🔒 SSL Secured","🛡 Privacy Protected","✓ 10K+ Members"].map(t=>(
                <span key={t} style={{fontSize:12,color:"#8E8E93",fontWeight:500}}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
