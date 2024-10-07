import React from 'react'
import Sidebar from '@/app/_components/sidebar'
function page() {
  return (
    <div> 
        <div className='h-screen flex flex-col bg-white'>
            <div className='  ' >
                <Sidebar />
            </div>
            <div className='flex justify-between gap-1 ' >
                <div></div>
            </div>
        </div>
      
    </div>
  )
}

export default page
