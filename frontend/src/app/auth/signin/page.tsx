"use client";
import { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import background from '../../public/images/MacBook Pro 14_ - 1.svg';
import Google from '../../public/images/google.svg';
const SignIn = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate password (e.g., at least 6 characters)
  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  // Handle form submission for traditional email/password sign-in
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setError(null);

    // Check email and password validity
    if (!validateEmail(email)) {
      setError('يرجى إدخال بريد إلكتروني صحيح.');
      return;
    }
    if (!validatePassword(password)) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل.');
      return;
    }

    try {
      const response = await axios.post('https://maeen-production.up.railway.app/auth/signin', {
        email,
        password,
      });
      console.log('Login success:', JSON.stringify(response.data));
      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem('token', response.data.token); 
      router.push('/first-exam');
    } catch (error) {
      console.error('Login failed:', error);
      setError('فشل تسجيل الدخول. تحقق من البريد الإلكتروني وكلمة المرور وحاول مرة أخرى.');
    }
  };

  // Handle Google sign-in redirect
  const handleGoogleSignIn = () => {
    window.location.href = 'https://maeen-production.up.railway.app/auth/google';
  };

  return (
    <div className="relative h-screen w-full overflow-hidden text-right">
      <Image
        src={background}
        alt="Background Cover"
        fill
        className="-z-10 object-cover"
      />
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white/10 p-10  rounded-[15%] shadow-lg w-[390px] mr-1">
          <h2 className="text-2xl font-bold mb-6 text-right">✋ مرحبًا بك</h2>
          <div className="text-right text-5xl font-bold">تسجيل الدخول</div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4 mt-5">
              <label className="block mb-2 text-lg font-base text-white/80">
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
              <label className="block mb-2 text-lg font-base text-white/80">
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
            {error && <p className="text-red-500 mb-4 text-sm text-right">{error}</p>}
            <button
              type="submit"
              className="w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-primary transition duration-200"
            >
              تسجيل دخول
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-xl">ـــــــــــــــــــــــــــــــ أو ــــــــــــــــــــــــــــــ</p>
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex justify-center gap-1 items-center text-center mt-4 bg-secondary2 text-white py-2 px-4 rounded-md hover:bg-primary transition duration-200"
            >
              <Image src={Google} alt="google" width={20} height={20} />
              <div>
              سجل مع قوقل 

              </div>
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
  );
};

export default SignIn;
