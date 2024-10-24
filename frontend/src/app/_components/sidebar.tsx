"use client";
import React from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Import useRouter and usePathname for routing
import Logo from "../public/logo.svg"; 
import Image from 'next/image';
import DashboardIcon from '../public/sidebarIcons/dashboard.svg';
import CashIcon from '../public/sidebarIcons/cash.svg';
import PencilIcon from '../public/sidebarIcons/pencil.svg';
import AnnotationIcon from '../public/sidebarIcons/annotation.svg';
import EqualCircleIcon from "../public/sidebarIcons/equal-circle.svg";
import VectorIcon from "../public/sidebarIcons/vector.svg";
import Setting from "../public/sidebarIcons/setting.svg";
import Logout from "../public/sidebarIcons/logout.svg";

// Reusable Sidebar Item Component
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

const Sidebar = () => {
  const router = useRouter(); // Get the current router
  const currentPath = usePathname(); // Get the current pathname

  const sidebarItems = [
    { icon: DashboardIcon, label: "لوحة المعلومات", href: "/dashboard" },
    { icon: CashIcon, label: "مسارك التعليمي", href: "/dashboard/learning-path" },
    { icon: VectorIcon, label: "طور قرائتي", href: "/dashboard/comprehensive-lessons" }, 
    { icon: AnnotationIcon, label: "مدرسك الإفتراضي", href: "/dashboard/virtual-teacher" },
    { icon: PencilIcon, label: "حسّن إملائك" },
    { icon: EqualCircleIcon, label: "اختبر نفسك" },
  ];

  return (
    <div className="h-full m-8 w-56 bg-gradient-to-b from-primary to-secondary2 rounded-3xl text-white flex flex-col p-1 relative">
      {/* White brightness gradient */}
      <div className="absolute top-0 m-0 left-0 right-0 h-24 w-64 rounded-3xl bg-gradient-to-b from-white/30 to-transparent"></div>

      {/* Logo with less space below */}
      <div className="text-center mb-1 mr-6"> {/* Reduced margin-bottom */}
        <Image src={Logo} alt="Logo" className="mx-auto" />
      </div>

      {/* Navigation Links with reduced space */}
      <nav className="flex-grow"> {/* Allow nav to take available space */}
        <ul className="space-y-1.5"> {/* Reduced space between items */}
          {sidebarItems.map((item, index) => (
            <SidebarItem 
              key={index} 
              icon={item.icon} 
              label={item.label} 
              href={item.href} 
              isActive={currentPath === item.href} // Check if the current path matches the item's href
            />
          ))}
        </ul>
      </nav>

      {/* Settings and Logout */}
      <div className='mt-auto'> {/* Push settings and logout to the bottom */}
        <SidebarItem icon={Logout} label="تسجيل الخروج" href='../auth/signin' />
      </div>
    </div>
  );
};

export default Sidebar;
