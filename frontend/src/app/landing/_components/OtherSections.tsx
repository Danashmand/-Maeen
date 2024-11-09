import React from 'react';
import Whatismaeen from "../../public/landing-icons/whatismaeen.svg";
import arrow from "../../public/landing-icons/arrow.svg";
import leaf from "../../public/landing-icons/Leaf.svg";
import books from "../../public/landing-icons/books.svg";
import Image from 'next/image';
import { FaLinkedin, FaWhatsapp, FaGithub } from 'react-icons/fa';
import userPic from '../../public/landing-icons/Userpic.svg';
import userPic2 from '../../public/landing-icons/Userpic2.svg';
const OtherSections = () => {
  return (
    <div className="bg-gradient-to-b from-white to-secondary/70 p-8 rounded-[100px] shadow-lg w-full  mx-auto ">
      {/* Main Header Section */}
      <div className="text-center items-center flex justify-center  mb-9 ">
        <h1 className="text-6xl font-bold text-black  my-10">
          طوّر معرفتك  <span className='text-secondary'  >
          باللغة العربية </span> مع قاعدة معرفية <span className='text-secondary'  >
      شاملة </span>         </h1>
        
      </div>

      {/* Information Card Section */}
      <div className=" p-6 rounded-lg flex items-start space-x-4" dir='rtl'>
       
        <div  className='flex flex-col bg-white w-1/3 rounded-lg p-3 me-32 ms-44 shadow-lg'  >
          <h2 className="flex gap-4 text-xl font-semibold text-purple-700 mb-2">
            <Image src={Whatismaeen} alt="whatismaeen" width={50} height={50} />
           <p className="text-secondary2 font-bold text-2xl mt-3">
             ما هو   &nbsp;
             <span className='text-secondary '  >
             مَعِين  
             </span>
             ؟
            </p>
          </h2>
          <p className="text-gray-600">
            <b>مَعِين</b> هو منصة تعليمية متطورة تهدف إلى تقديم تجربة تعليم اللغة العربية بشكل مخصص وسهل. 
            من خلال استخدام تقنيات الذكاء الاصطناعي، نوفر دروسًا تفاعلية، مسارات تعليمية مخصصة،
            ومحاكاة للمحادثات باللغة العربية، ما يمنح المتعلمين من مختلف المستويات تحسين مهاراتهم
            بطريقة تتناسب مع احتياجاتهم الخاصة.
          </p>
        </div>
          <span role="img" aria-label="pencil icon" className='text-4xl p-4 bg-white -rotate-12 rounded-lg ms-40 shadow-md mt-20'>✏️</span>
      </div>
      <div className=" p-6 rounded-lg flex items-start space-x-4" dir='ltr'>
       
        <div  className='flex flex-col bg-white w-1/3 rounded-lg p-3 me-32 ms-44 shadow-lg' dir='rtl' >
          <h2 className="flex gap-4 text-xl font-semibold text-purple-700 mb-2">
            <Image src={leaf} alt="whatismaeen" width={50} height={50} />
           <p className="text-secondary2 font-bold text-2xl mt-3">
            كيف طورنا   &nbsp;
             <span className='text-primary '  >
             علام  
             </span>
             ؟
            </p>
          </h2>
          <p className="text-gray-600">
         طورنا ثلاث نسخ من علام لتعليم الأطفال العربية, وهي التالي: الحكواتي و ياقوت وجاسر لحكاية القصص والتعليم المخصص للطفل والتصحيح الإملائي
          </p>
        </div>
            <Image src={arrow} alt="whatismaeen" width={100} height={100} className='mt-20 me-20' />    </div>
            <div className=" p-6 rounded-lg  flex items-start space-x-4" dir='rtl'>
       
       <div  className='flex flex-col bg-white w-1/3 rounded-lg p-3 me-44 ms-44 shadow-lg'  >
         <h2 className="flex gap-4 text-xl font-semibold text-purple-700 mb-2">
           <Image src={Whatismaeen} alt="whatismaeen" width={50} height={50} />
          <p className="text-secondary2 font-bold text-2xl mt-3">
            كيف نقيس مستوى  &nbsp;
            <span className='text-secondary '  >
            الطفل  
            </span>
            ؟
           </p>
         </h2>
         <p className="text-gray-600">
         عن طريق اختبار معياري يقيس مستوى الطفل عند بداية استخدامه للبرنامج بحيث نعطي هذه النتائج لعلام ليعطينا اجابات مخصصة لمتوى الطفل.
         </p>
       </div>
       <Image src={books} alt="whatismaeen" width={70} height={70} className='mt-20 me-20 p-2 bg-white  rounded-lg  shadow-md mt-20' />     </div>
     

     <hr  className='mx-44 my-20 '/>

     <div>
        <h1 className='text-6xl font-bold text-center mb-10'>
الفريق المؤسس        </h1>

<div className='flex flex-row gap-20 ml-24 mb-20'>
<div className="flex flex-col items-center bg-white rounded-3xl shadow-lg p-6 text-center w-60">
      <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
        <Image
          src={userPic} // Replace with the actual path to the profile image
          alt="Profile Picture"
          width={96}
          height={96}
          className="object-cover"
        />
      </div>
      <h3 className="text-lg font-bold text-secondary2 mb-2">سلطان بني علي</h3>
      <div className="flex gap-4 text-gray-900">
        <a href="https://www.linkedin.com/in/username" target="_blank" rel="noopener noreferrer">
          <FaLinkedin size={20} />
        </a>
       
        <a href="https://github.com/username" target="_blank" rel="noopener noreferrer">
          <FaGithub size={20} />
        </a>
      </div>
    </div>
<div className="flex flex-col items-center bg-white rounded-3xl shadow-lg p-6 text-center w-60">
      <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
        <Image
          src={userPic2} // Replace with the actual path to the profile image
          alt="Profile Picture"
          width={96}
          height={96}
          className="object-cover"
        />
      </div>
      <h3 className="text-lg font-bold text-secondary2 mb-2"> دالح الربيع السبيعي</h3>
      <div className="flex gap-4 text-gray-900">
        <a href="https://www.linkedin.com/in/alsubiaeedaleh" target="_blank" rel="noopener noreferrer">
          <FaLinkedin size={20} />
        </a>
       
        <a href="https://github.com/username" target="_blank" rel="noopener noreferrer">
          <FaGithub size={20} />
        </a>
      </div>
    </div>
<div className="flex flex-col items-center bg-white rounded-3xl shadow-lg p-6 text-center w-60">
      <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
        <Image
          src={userPic2} // Replace with the actual path to the profile image
          alt="Profile Picture"
          width={96}
          height={96}
          className="object-cover"
        />
      </div>
      <h3 className="text-lg font-bold text-secondary2 mb-2"> حمزة الشيخي</h3>
      <div className="flex gap-4 text-gray-900">
        <a href="https://www.linkedin.com/in/username" target="_blank" rel="noopener noreferrer">
          <FaLinkedin size={20} />
        </a>
       
        <a href="https://github.com/username" target="_blank" rel="noopener noreferrer">
          <FaGithub size={20} />
        </a>
      </div>
    </div>
<div className="flex flex-col items-center bg-white rounded-3xl shadow-lg p-6 text-center w-60">
      <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
        <Image
          src={userPic2} // Replace with the actual path to the profile image
          alt="Profile Picture"
          width={96}
          height={96}
          className="object-cover"
        />
      </div>
      <h3 className="text-lg font-bold text-secondary2 mb-2">عبدالله الزهراني</h3>
      <div className="flex gap-4 text-gray-900">
        <a href="https://www.linkedin.com/in/username" target="_blank" rel="noopener noreferrer">
          <FaLinkedin size={20} />
        </a>
       
        <a href="https://github.com/username" target="_blank" rel="noopener noreferrer">
          <FaGithub size={20} />
        </a>
      </div>
    </div>


</div>
        
     </div>
    </div>
  );
};

export default OtherSections;
