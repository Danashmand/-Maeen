import React from 'react'
import Logo from '../../public/logo.svg'
import Image from 'next/image'
const Nav = () => {
  return (
    <div className='flex justify-between items-center text-xl ml-4 '>
      <Image src={Logo} alt="logo" /> 
      <div className='flex justify-around gap-8 ml-20' > 
        <div  className=' rounded-2xl p-1'>من نحن</div>
        <div className=' rounded-2xl p-1'>خدماتنا </div>
        <div className=' rounded-2xl p-1'>منتجنا</div>
        <div className='border  rounded-2xl p-1'>الرئيسية</div>
        <div className=' rounded-2xl p-1'>الفوائد</div>
        <div className=' rounded-2xl p-1'>الأسئلة الشائعة</div>
        <div className=' rounded-2xl p-1'>اتصل بنا</div>
       
      </div>


<div className='flex justify-between gap-4 mr-7 font-bold'>
    <button className='border  rounded-2xl p-1'> مستخدم جديد</button>
    <button > تسجيل دخول</button>
</div> 


    </div>
  )
}

export default Nav
