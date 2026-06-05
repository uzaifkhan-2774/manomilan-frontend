import React from 'react'
import LOGO from  '../../assets/ManomilanLogo.png'

const PageNotFound = () => {
  return (
    <div>
    
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fff6f7] px-4 py-8 font-[Nunito,sans-serif]">
 
      {/* Radial bg blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 rounded-none"
          style={{ background: "radial-gradient(ellipse 60% 45% at 15% 20%, rgba(235,28,76,.07) 0%, transparent 70%), radial-gradient(ellipse 55% 40% at 85% 75%, rgba(255,80,110,.06) 0%, transparent 70%)" }}
        />
      </div>
 
      {/* Floating petals */}
      {[
        { l:"6%",  t:"10%", d:6.1, delay:"0s",    size:"0.9rem", op:0.13 },
        { l:"13%", t:"74%", d:8.2, delay:"1.1s",  size:"0.7rem", op:0.09 },
        { l:"82%", t:"12%", d:7.0, delay:"0.5s",  size:"0.9rem", op:0.11 },
        { l:"90%", t:"65%", d:9.1, delay:"2s",    size:"1rem",   op:0.10 },
        { l:"50%", t:"3%",  d:7.4, delay:"1.5s",  size:"0.8rem", op:0.12 },
        { l:"67%", t:"83%", d:10,  delay:"3.2s",  size:"0.65rem",op:0.07 },
        { l:"33%", t:"88%", d:8.3, delay:"2.6s",  size:"0.9rem", op:0.10 },
      ].map((p, i) => (
        <span
          key={i}
          className="pointer-events-none absolute select-none animate-[drift_linear_infinite]"
          style={{
            left: p.l, top: p.t, opacity: p.op, fontSize: p.size,
            animationDuration: `${p.d}s`, animationDelay: p.delay,
          }}
        >🌸</span>
      ))}
 
      {/* Card */}
      <div
        className="relative z-10 w-full max-w-[460px] animate-[fadeUp_.65s_ease_.1s_both] rounded-3xl border border-[rgba(235,28,76,.15)] bg-white/97 px-10 py-10 text-center"
        style={{ boxShadow: "0 6px 40px rgba(235,28,76,.10)" }}
      >
        {/* Logo */}
        <div className="mb-5 flex justify-center animate-[popIn_.75s_cubic-bezier(.34,1.56,.64,1)_.2s_both]">
          <img src={LOGO} alt="Manomilan" className="h-10 w-auto" />
        </div>
 
        {/* Ring */}
        <div
          className="mx-auto mb-4 flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 border-[rgba(235,28,76,.22)] text-[1.8rem] animate-[popIn_.8s_cubic-bezier(.34,1.56,.64,1)_.38s_both,ringGlow_2.5s_ease-in-out_1.5s_infinite]"
          style={{ background: "linear-gradient(135deg,#fff0f2,#ffd8de)" }}
          role="img" aria-label="rings"
        >💍</div>
 
        {/* 404 */}
        <span
          className="mb-1 block font-[Nunito] text-[5.8rem] font-extrabold leading-none animate-[pulse404_4s_ease-in-out_infinite,shimmer_3s_linear_.9s_infinite,fadeUp_.65s_ease_.45s_both]"
          style={{
            background: "linear-gradient(135deg,#eb1c4c 0%,#c0143b 45%,#eb1c4c 75%,#ff4d72 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
          aria-label="404"
        >404</span>
 
        
        <div className="mx-auto my-3 flex max-w-[200px] items-center gap-2.5 animate-[fadeUp_.5s_ease_.7s_both]" aria-hidden="true">
          <span className="h-px flex-1" style={{ background: "linear-gradient(to right,transparent,rgba(235,28,76,.3),transparent)" }} />
          <span className="text-xs text-[#eb1c4c] opacity-55">♦</span>
          <span className="h-px flex-1" style={{ background: "linear-gradient(to right,transparent,rgba(235,28,76,.3),transparent)" }} />
        </div>
 
      
        <h1 className="mb-2 font-[Nunito] text-2xl font-bold leading-snug text-[#2d0a14] animate-[fadeUp_.55s_ease_.78s_both]">
          Page Not Found
        </h1>
 
        <p className="mx-auto mb-0 max-w-[340px] text-sm leading-relaxed text-[#8a3a4c] animate-[fadeUp_.55s_ease_.88s_both]">
          Oops! This page seems to have found its match elsewhere.
        </p>
 
 
        <p className="mt-5 flex items-center justify-center gap-1 text-[1 rem] tracking-wide text-[#c07080] animate-[fadeUp_.5s_ease_1s_both]">
          Finding your perfect match
          <span className="ml-1 inline-flex items-end gap-[3px]" aria-hidden="true">
            <span className="inline-block h-1 w-1 rounded-full bg-[#eb1c4c] animate-[dotBob_1.4s_ease-in-out_infinite]" />
            <span className="inline-block h-1 w-1 rounded-full bg-[#eb1c4c] animate-[dotBob_1.4s_ease-in-out_.2s_infinite]" />
            <span className="inline-block h-1 w-1 rounded-full bg-[#eb1c4c] animate-[dotBob_1.4s_ease-in-out_.4s_infinite]" />
          </span>
        </p>
      </div>
 
      {/*keyframes*/}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)} }
        @keyframes popIn    { 0%{opacity:0;transform:scale(.55)} 65%{transform:scale(1.06)} 100%{opacity:1;transform:scale(1)} }
        @keyframes drift    { 0%,100%{transform:translateY(0) rotate(0deg)} 40%{transform:translateY(-14px) rotate(6deg)} 75%{transform:translateY(-6px) rotate(-4deg)} }
        @keyframes pulse404 { 0%,100%{letter-spacing:.28em} 50%{letter-spacing:.36em} }
        @keyframes shimmer  { from{background-position:-200% center} to{background-position:200% center} }
        @keyframes dotBob   { 0%,80%,100%{transform:translateY(0);opacity:.35} 40%{transform:translateY(-6px);opacity:1} }
        @keyframes ringGlow { 0%,100%{box-shadow:0 0 0 0 rgba(235,28,76,.18)} 50%{box-shadow:0 0 0 14px rgba(235,28,76,0)} }
      `}</style>
    </div>

    </div>
  )
}

export default PageNotFound
