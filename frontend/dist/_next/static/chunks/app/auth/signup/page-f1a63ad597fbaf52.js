(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[271],{9066:function(e,t,s){Promise.resolve().then(s.bind(s,5788))},5788:function(e,t,s){"use strict";s.r(t);var a=s(9676),l=s(6030),r=s(3014),n=s(4929),i=s(518),d=s(8192);t.default=()=>{let[e,t]=(0,l.useState)(""),[s,c]=(0,l.useState)(""),[o,u]=(0,l.useState)(""),[h,x]=(0,l.useState)({}),m=(0,n.useRouter)(),b=()=>{let t=!0,a={};return o.trim()||(a.name="Please enter your name",t=!1),/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)||(a.email="Please enter a valid email address",t=!1),s.length<8&&(a.password="Password should be at least 8 characters long",t=!1),x(a),t},p=async t=>{if(t.preventDefault(),b())try{let t=await r.Z.post("https://maeen-production.up.railway.app/auth/signup",{email:e,password:s,name:o});console.log("Signup success:",t.data),m.push("/auth/signin")}catch(e){console.error("Signup failed:",e)}};return(0,a.jsxs)("div",{className:"relative h-screen w-full overflow-hidden text-right",children:[(0,a.jsx)(i.default,{src:d.Z,alt:"Background Cover",fill:!0,className:"-z-10 object-cover"}),(0,a.jsx)("div",{className:"flex items-center justify-center min-h-screen",children:(0,a.jsxs)("div",{className:"bg-white/10 p-10  rounded-[15%] shadow-lg w-[390px] mr-1",children:[(0,a.jsx)("h2",{className:"text-2xl font-bold mb-6 text-right",children:"✋ مرحبًا بك"}),(0,a.jsx)("h2",{className:"text-5xl font-bold mb-6 text-right",children:"إنشاء حساب"}),(0,a.jsxs)("form",{onSubmit:p,children:[(0,a.jsxs)("div",{className:"mb-4",children:[(0,a.jsx)("label",{className:"block mb-2 text-lg font-base text-white/80",children:"اسمك الكريم"}),(0,a.jsx)("input",{type:"text",value:o,onChange:e=>u(e.target.value),className:"w-full px-3 py-2 border text-right border-gray-300 rounded-md text-black",placeholder:"أدخل اسمك",required:!0}),h.name&&(0,a.jsx)("p",{className:"text-red-500 text-sm",children:h.name})]}),(0,a.jsxs)("div",{className:"mb-4",children:[(0,a.jsx)("label",{className:"block mb-2 text-lg font-base text-white/80",children:"ايميلك"}),(0,a.jsx)("input",{type:"email",value:e,onChange:e=>t(e.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md text-black text-right",placeholder:"أدخل بريدك الإلكتروني",required:!0}),h.email&&(0,a.jsx)("p",{className:"text-red-500 text-sm",children:h.email})]}),(0,a.jsxs)("div",{className:"mb-6",children:[(0,a.jsx)("label",{className:"block mb-2 text-sm font-bold text-gray-300",children:"كلمة المرور"}),(0,a.jsx)("input",{type:"password",value:s,onChange:e=>c(e.target.value),className:"w-full px-3 py-2 border border-gray-300 rounded-md text-black text-right",placeholder:"أدخل كلمة المرور الخاصة بك",required:!0}),h.password&&(0,a.jsx)("p",{className:"text-red-500 text-sm",children:h.password})]}),(0,a.jsx)("button",{type:"submit",className:"w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-primary transition duration-200",children:"إنشاء حساب"})]}),(0,a.jsxs)("p",{className:"text-center text-gray-100 mt-4",children:["لديك حساب بالفعل؟"," ",(0,a.jsx)("a",{href:"/auth/signin",className:"text-blue-100 text-lg font-bold hover:underline",children:"سجل الدخول"})]})]})})]})}},8192:function(e,t){"use strict";t.Z={src:"/_next/static/media/MacBook Pro 14_ - 1.4f973d01.svg",height:851,width:1512,blurWidth:0,blurHeight:0}}},function(e){e.O(0,[795,132,82,890,744],function(){return e(e.s=9066)}),_N_E=e.O()}]);