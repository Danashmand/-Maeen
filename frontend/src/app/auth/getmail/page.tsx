"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import background from '../../public/images/MacBook Pro 14_ - 1.svg';
function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setError(null); // Reset error on input change
  };
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const getUser = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const email = emailInput.value;
    
    if (!validateEmail(email)) {
      setError("يرجى إدخال بريد إلكتروني صحيح.");
      return;
    }
    try {
      const response = await axios.get(`https://maeen-production.up.railway.app/users/email?email=${email}`);
      console.log("Login success:", response.data);
  
      // Store the user data in localStorage with consistent structure
      localStorage.setItem("user", JSON.stringify({ userData: response.data }));
  
      // Redirect to the dashboard
      router.push("/first-exam");  // Uses Next.js navigation
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  

  return (
    <div className="relative h-screen w-full overflow-hidden text-right">
  
    <Image
      src={background}
      alt="Background Cover"
      fill
      className="-z-10 object-cover  "
    />
        <div className="flex items-center justify-center min-h-screen ">
        <div className="bg-white/10 p-16 rounded-[10%] shadow-lg w-[470px] h-[470px] mr-1 ">
        <h2 className="text-2xl font-bold mb-6 text-right" > ✋ مرحبًا بك     </h2>

        <h2 className="text-5xl font-bold mb-6 text-right">  خطوة أخيرة</h2>

      <label htmlFor="email" className="block mb-2  text-lg font-base text-white/80"> أدخل بريدك الإلكتروني الذي سجلت به </label>
      <input      onChange={handleInputChange}         className="w-full px-3 py-2 text-secondary2/80 border text-right border-gray-300 rounded-md"
 type="text" id="email" name="email" placeholder="أدخل بريدك الإلكتروني" />
               {error && <p className="text-red-500 font-bold mt-2 text-sm">{error}</p>}
               <button type="submit" onClick={getUser}             className="w-full mt-3 bg-secondary text-white py-2 px-4 rounded-md hover:bg-primary transition duration-200"
      >إنشاء حساب</button>
    </div>
    </div>
    </div>
  );
}

export default Page;
