"use client";
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import background from '../../public/images/MacBook Pro 14_ - 1.svg';

const SignUp = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});
  const router = useRouter();

  const validateForm = () => {
    let isValid = true;
    const newErrors: { email?: string; password?: string; name?: string } = {};

    // Name validation: should not be empty
    if (!name.trim()) {
      newErrors.name = 'Please enter your name';
      isValid = false;
    }

    // Email validation: should be a valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation: minimum 8 characters
    if (password.length < 8) {
      newErrors.password = 'Password should be at least 8 characters long';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission for sign-up
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return; // Exit if form is invalid

    try {
      const response = await axios.post('https://maeen-production.up.railway.app/auth/signup', {
        email,
        password,
        name,
      });
      console.log('Signup success:', response.data);
      router.push('/auth/signin'); // Redirect after successful signup
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden text-right">
      <Image src={background} alt="Background Cover" fill className="-z-10 object-cover" />
      <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white/10 p-10  rounded-[15%] shadow-lg w-[390px] mr-1">
      <h2 className="text-2xl font-bold mb-6 text-right">✋ مرحبًا بك</h2>
          <h2 className="text-5xl font-bold mb-6 text-right">إنشاء حساب</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 text-lg font-base text-white/80">اسمك الكريم</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border text-right border-gray-300 rounded-md text-black"
                placeholder="أدخل اسمك"
                required
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-lg font-base text-white/80">ايميلك</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black text-right"
                placeholder="أدخل بريدك الإلكتروني"
                required
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-bold text-gray-300">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black text-right"
                placeholder="أدخل كلمة المرور الخاصة بك"
                required
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-primary transition duration-200"
            >
              إنشاء حساب
            </button>
          </form>
          <p className="text-center text-gray-100 mt-4">
            لديك حساب بالفعل؟{' '}
            <a href="/auth/signin" className="text-blue-100 text-lg font-bold hover:underline">
              سجل الدخول
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
