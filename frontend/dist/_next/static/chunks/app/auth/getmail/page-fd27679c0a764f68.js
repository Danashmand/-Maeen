(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[834],{809:function(e,t,s){Promise.resolve().then(s.bind(s,2669))},2669:function(e,t,s){"use strict";s.r(t);var r=s(9676),l=s(6030),a=s(3014),n=s(4929),i=s(518),o=s(8192);t.default=function(){let e=(0,n.useRouter)(),[t,s]=(0,l.useState)(""),[c,u]=(0,l.useState)(null),d=e=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e),h=async t=>{t.preventDefault();let s=document.getElementById("email").value;if(!d(s)){u("يرجى إدخال بريد إلكتروني صحيح.");return}try{let t=await a.Z.get("https://maeen-production.up.railway.app/users/email?email=".concat(s));console.log("Login success:",t.data),localStorage.setItem("user",JSON.stringify({userData:t.data})),e.push("/first-exam")}catch(e){console.error("Error fetching user:",e)}};return(0,r.jsxs)("div",{className:"relative h-screen w-full overflow-hidden text-right",children:[(0,r.jsx)(i.default,{src:o.Z,alt:"Background Cover",fill:!0,className:"-z-10 object-cover  "}),(0,r.jsx)("div",{className:"flex items-center justify-center min-h-screen ",children:(0,r.jsxs)("div",{className:"bg-white/10 p-10 py-16 rounded-[15%] shadow-lg w-[390px] mr-1",children:[(0,r.jsx)("h2",{className:"text-2xl font-bold mb-6 text-right",children:" ✋ مرحبًا بك     "}),(0,r.jsx)("h2",{className:"text-5xl font-bold mb-6 text-right",children:"  خطوة أخيرة"}),(0,r.jsx)("label",{htmlFor:"email",className:"block mb-2  text-lg font-base text-white/80",children:" أدخل بريدك الإلكتروني الذي سجلت به "}),(0,r.jsx)("input",{onChange:e=>{s(e.target.value),c&&console.log("error",t),u(null)},className:"w-full px-3 py-2 text-secondary2/80 border text-right border-gray-300 rounded-md",type:"text",id:"email",name:"email",placeholder:"أدخل بريدك الإلكتروني"}),c&&(0,r.jsx)("p",{className:"text-red-500 font-bold mt-2 text-sm",children:c}),(0,r.jsx)("button",{type:"submit",onClick:h,className:"w-full mt-3 bg-secondary text-white py-2 px-4 rounded-md hover:bg-primary transition duration-200",children:"إنشاء حساب"})]})})]})}},8192:function(e,t){"use strict";t.Z={src:"/_next/static/media/MacBook Pro 14_ - 1.4f973d01.svg",height:851,width:1512,blurWidth:0,blurHeight:0}}},function(e){e.O(0,[795,132,82,890,744],function(){return e(e.s=809)}),_N_E=e.O()}]);