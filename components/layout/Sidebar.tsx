"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaUsers, FaHospital, FaCode } from "react-icons/fa";

export default function Sidebar() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path;
  };

  const navItems = [
    { path: "/", label: "Dashboard", icon: <FaHome className="text-lg" /> },
    { path: "/clients", label: "Clients", icon: <FaUsers className="text-lg" /> },
    { path: "/programs", label: "Programs", icon: <FaHospital className="text-lg" /> },
    { path: "/api-docs", label: "API Docs", icon: <FaCode className="text-lg" /> },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-700 to-indigo-800 text-white flex flex-col py-8 px-4 h-screen sticky top-0">
      <div className="mb-10 flex items-center gap-2">
        <span className="text-2xl font-bold">HealthSys</span>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Link 
            key={item.path}
            href={item.path} 
            className={`py-2 px-3 rounded flex items-center gap-2 font-medium transition-colors duration-200 ${
              isActive(item.path) 
                ? "bg-blue-600 text-white" 
                : "hover:bg-blue-600/50 text-blue-100"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}