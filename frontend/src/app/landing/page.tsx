import React from 'react'
import Image from 'next/image';
import background from '../public/images/Landing Page 4.png';
import Nav from './_components/Nav';
import Slogan from './_components/Slogan';
import OtherSections from './_components/OtherSections';
const page = () => {
  return (
    <div>

    <div className="relative h-screen w-full  text-right font-TheYearofTheCamel">
  
    <Image
      src={background}
      alt="Background Cover"
      fill
      className="-z-10 object-cover  "
    />
    <div className='flex flex-col  ' >
       <Nav/>
       <Slogan/>
    </div>
</div>
<div className="relative w-full   text-right font-TheYearofTheCamel">
<Image
      src={background}
      alt="Background Cover"
      fill
      className="-z-10 object-cover   "
    /> 
      <div className="absolute inset-0 bg-black/20 -z-10" />
       <OtherSections/>
</div>

    </div>
  )
}

export default page
