import React from 'react';

const OtherSections = () => {
  return (
    <div className="bg-gradient-to-b from-purple-100 to-white p-8 rounded-[100px] shadow-lg w-full  mx-auto ">
      {/* Main Header Section */}
      <div className="text-center items-center flex justify-center  mb-6 ">
        <h1 className="text-6xl font-bold text-black  ">
          طوّر معرفتك  <span className='text-secondary'  >
          باللغة العربية </span> مع قاعدة معرفية <span className='text-secondary'  >
      شاملة </span>         </h1>
        
      </div>

      {/* Information Card Section */}
      <div className=" p-6 rounded-lg shadow-md flex items-start space-x-4" dir='rtl'>
        <div className="text-4xl text-purple-500">
        </div>
        <div  className='flex flex-col bg-white w-1/3 rounded-lg p-3' >
          <h2 className="text-xl font-semibold text-purple-700 mb-2">
            ما هي مُعين؟
          </h2>
          <p className="text-gray-600">
            مُعين هو منصة تعليمية متطورة تهدف إلى تقديم تجربة تعليم اللغة العربية بشكل مخصص وسهل.
            من خلال استخدام تقنيات الذكاء الاصطناعي، نوفر دروسًا تفاعلية، مسارات تعليمية مخصصة،
            ومحاكاة للمحادثات باللغة العربية، ما يمنح المتعلمين من مختلف المستويات تحسين مهاراتهم
            بطريقة تتناسب مع احتياجاتهم الخاصة.
          </p>
        </div>
          <span role="img" aria-label="pencil icon" className='text-4xl p-4 bg-white rotate-12 rounded-lg mr-40 shadow-md mt-20'>✏️</span>
      </div>
     
    </div>
  );
};

export default OtherSections;
