"use client";
import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import background from '../../public/images/MacBook Pro 14_ - 1.svg';
function Page() {
  const router = useRouter();

  const getUser = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const email = emailInput.value;

    try {
      const response = await axios.get(`https://maeen-production.up.railway.app/users/email?email=${email}`);
      console.log("Login success:", response.data);

      // Store the user data in localStorage as a string
      localStorage.setItem("user", JSON.stringify(response.data));

      // Redirect to the dashboard
      router.push("/dashboard/virtual-teacher");  // Uses Next.js navigation
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
      <input               className="w-full px-3 py-2 border text-right border-gray-300 rounded-md"
 type="text" id="email" name="email" placeholder="أدخل بريدك الإلكتروني" />
      <button type="submit" onClick={getUser}             className="w-full mt-3 bg-secondary text-white py-2 px-4 rounded-md hover:bg-primary transition duration-200"
      >إنشاء حساب</button>
    </div>
    </div>
    </div>
  );
}

export default Page;
