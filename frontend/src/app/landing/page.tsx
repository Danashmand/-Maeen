import React from 'react'
import Image from 'next/image';
import background from '../public/images/Landing Page 3.svg';
const page = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden text-right">
  
    <Image
      src={background}
      alt="Background Cover"
      fill
      className="-z-10 object-cover  "
    />
    <div className='flex justify-between gap-1 ' >
        <div></div>
    </div>
</div>

  )
}

export default page
