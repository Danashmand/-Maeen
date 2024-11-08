import React from 'react';

const Slogan = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-32  text-white text-center">
      <h4 className="text-2xl mb-2">مرحبا بك في  <b>مَعِين</b></h4>
      <h1 className="text-8xl font-bold mb-2">الذكاء الاصطناعي</h1>
      <p className=" text-4xl font-bold mb-6">باستخدام أول نموذج توليدي سعودي</p>
      <p className=" text-6xl font-bold mb-6">عـــــلام</p>
      {/* <div className="bg-white text-purple-700 rounded-full   px-6 py-2">
        <span className="text-2xl">ألق نظرة</span>
      </div> */}
    </div>
  );
};

export default Slogan;
