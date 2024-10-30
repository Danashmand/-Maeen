// Sidebar.tsx
"use client";
import React from 'react';
import { useRouter, usePathname } from 'next/navigation'; 
import Logo from "../public/logo.svg"; 
import Image from 'next/image';
import DashboardIcon from '../public/sidebarIcons/dashboard.svg';
import CashIcon from '../public/sidebarIcons/cash.svg';
import PencilIcon from '../public/sidebarIcons/pencil.svg';
import AnnotationIcon from '../public/sidebarIcons/annotation.svg';
import EqualCircleIcon from "../public/sidebarIcons/equal-circle.svg";
import VectorIcon from "../public/sidebarIcons/vector.svg";
import Logout from "../public/sidebarIcons/logout.svg";
import Face from "../public/face.svg";
const SidebarItem = ({ icon: Icon, label, href, isActive }: { icon: React.FC, label: string, href?: string, isActive?: boolean }) => (
  <div>
    <a 
      href={href || "#"} 
      className={`flex ml-4 items-center space-x-2 p-3 rounded-2xl ${isActive ? 'bg-secondary2' : 'hover:bg-secondary2'}`}
    > 
      <Image className="w-6 h-6" alt='' src={Icon}/> 
      <span className='text-xl font-bold'>{label}</span>
    </a>
  </div>
);

interface UserData {
  _id: string;
  name: string;
  email: string;
}

interface SidebarProps {
  userData: UserData | null; // Accept userData as a prop
}

const Sidebar = ({ userData }: SidebarProps) => {
  const router = useRouter(); 
  const currentPath = usePathname(); 

  const sidebarItems = [
    { icon: DashboardIcon, label: "لوحة المعلومات", href: "/dashboard" },
    { icon: VectorIcon, label: "طور قرائتي", href: "/dashboard/comprehensive-lessons" }, 
    { icon: AnnotationIcon, label: "مدرسك الإفتراضي", href: "/dashboard/virtual-teacher" },
    { icon: PencilIcon, label: "حسّن إملائك" },
    { icon: EqualCircleIcon, label: "اختبر نفسك" },
  ];

  return (
    <div className="h-full m-8 w-56 bg-gradient-to-b from-primary to-secondary2 rounded-3xl text-white flex flex-col p-1 relative">
      <div className="absolute top-0 m-0 left-0 right-0 h-24 w-64 rounded-3xl bg-gradient-to-b from-white/30 to-transparent"></div>

      <div className="text-center mb-1 mr-6"> 
        <Image src={Logo} alt="Logo" className="mx-auto" />
      </div>

      {/* User Info Section */}
      

      <nav className="flex-grow"> 
        <ul className="space-y-1.5"> 
          {sidebarItems.map((item, index) => (
            <SidebarItem 
              key={index} 
              icon={item.icon} 
              label={item.label} 
              href={item.href} 
              isActive={currentPath === item.href} 
            />
          ))}
        </ul>
      </nav>

      <div className='mt-auto'> 
        <SidebarItem icon={Logout} label="تسجيل الخروج" href='../auth/signin' />
      </div>
    </div>
  );
};

export default Sidebar;
