"use client";
import { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import background from '../../public/images/MacBook Pro 14_ - 1.svg';
const SignIn = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  // Handle form submission for traditional email/password sign-in
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/signin', {
        email,
        password,
      });
      console.log('Login success:', response.data);
      // Store the JWT token in local storage
      localStorage.setItem('token', response.data.token); 
      router.push('/dashboard'); 
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Handle Google sign-in redirect
  const handleGoogleSignIn = () => {
    window.location.href = 'http://localhost:3000/auth/google'; // Google OAuth route
  };

  return (
    <div>

    <div className="relative h-screen w-full overflow-hidden text-right">
  
    <Image
      src={background}
      alt="Background Cover"
      fill
      className="-z-10 object-cover  "
    />
    
    <div className="flex items-center justify-center min-h-screen ">
      <div className="bg-white/10 p-16 rounded-[10%] shadow-lg w-[470px]  mr-1 ">
        <h2 className="text-2xl font-bold mb-6 text-right" > ✋ مرحبًا بك     </h2>
        <div className='text-right text-5xl font-bold '>تسجيل الدخول </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 mt-5">
            <label className="block mb-2  text-lg font-base text-white/80">
              ايميلك
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-black text-right"
              placeholder="أدخل بريدك الإلكتروني"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-bold text-gray-700 text-white/80">
             كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-black text-right"
              placeholder="أدخل كلمة المرور الخاصة بك"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-primary transition duration-200"
          >
         تسجيل دخول 
          </button>
        </form>
        <div className="text-center mt-4 ">
          <p className='text-xl'> ـــــــــــــــــــــــــــــــ أوـــــــــــــــــــــــــــــ </p>
          <button
            onClick={handleGoogleSignIn}
            className="w-full mt-4 bg-secondary2 text-white py-2 px-4 rounded-md hover:bg-primary transition duration-200"
          >
           سجل مع قوقل
          </button>
        </div>
        <p className="text-center text-gray-100 mt-4">
         ليس لديك حساب؟{' '}
          <a href="/auth/signup" className="text-blue-100 text-lg font-bold hover:underline">
           سجل الآن
          </a>
        </p>
      </div>
    </div>
    </div>
    </div>
  );
};

export default SignIn;
