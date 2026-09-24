import{t as e}from"./jsx-runtime-0vZSBttN.js";import{t}from"./utils-DojpP95n.js";function n(e){let t=2166136261;for(let n=0;n<e.length;n++)t^=e.charCodeAt(n),t=Math.imul(t,16777619);return t>>>0}var r=[[`#22d3ee`,`#3b82f6`,`#d7dde8`],[`#34d399`,`#22d3ee`,`#f4f4f5`],[`#e8b86d`,`#f07178`,`#d7dde8`],[`#3b82f6`,`#6366f1`,`#22d3ee`],[`#f07178`,`#e8b86d`,`#22d3ee`],[`#a78bfa`,`#22d3ee`,`#d7dde8`],[`#fb7185`,`#3b82f6`,`#34d399`],[`#38bdf8`,`#818cf8`,`#f4f4f5`]];function i(e){let t=n(e||`vant`),i=r[t%r.length],a=i[0],o=i[1],s=i[2],c=(t>>>8)%360,l=(t>>>16)%6,u=40+(t>>>4)%9-4,d=40+(t>>>12)%9-4,f=``;f=l===0?`<polygon points="40,12 64,52 16,52" fill="${a}"/>
      <circle cx="${u}" cy="${d}" r="11" fill="${o}"/>`:l===1?`<rect x="18" y="18" width="44" height="44" rx="8" fill="${a}" transform="rotate(${c} 40 40)"/>
      <rect x="28" y="28" width="24" height="24" rx="4" fill="#07060c"/>`:l===2?`<circle cx="40" cy="40" r="26" fill="none" stroke="${a}" stroke-width="6"/>
      <circle cx="${u}" cy="${d}" r="10" fill="${o}"/>
      <path d="M18 54 L40 22 L62 54" fill="none" stroke="${s}" stroke-width="3"/>`:l===3?`<path d="M40 10 L70 40 L40 70 L10 40 Z" fill="${a}"/>
      <path d="M40 24 L56 40 L40 56 L24 40 Z" fill="#07060c"/>
      <circle cx="40" cy="40" r="6" fill="${o}"/>`:l===4?`<rect x="14" y="30" width="52" height="20" rx="4" fill="${a}"/>
      <rect x="30" y="14" width="20" height="52" rx="4" fill="${o}"/>
      <circle cx="40" cy="40" r="8" fill="${s}"/>`:`<path d="M20 18 H60 L40 70 Z" fill="${a}"/>
      <circle cx="40" cy="32" r="8" fill="#07060c"/>
      <rect x="36" y="46" width="8" height="14" fill="${o}"/>`;let p=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
  <rect width="80" height="80" rx="18" fill="#101018"/>
  <rect x="2" y="2" width="76" height="76" rx="16" fill="none" stroke="${a}" stroke-opacity="0.45" stroke-width="2"/>
  ${f}
</svg>`;return`data:image/svg+xml;utf8,${encodeURIComponent(p.replace(/\s+/g,` `).trim())}`}var a=e();function o({src:e,name:n,seed:r,size:o=64,className:s}){let c=e&&e.length>8?e:i(r||n||`vant`);return(0,a.jsx)(`img`,{src:c,alt:n,width:o,height:o,className:t(`rounded-2xl object-cover outline outline-1 -outline-offset-1 outline-white/10`,s),style:{width:o,height:o}})}export{i as n,o as t};