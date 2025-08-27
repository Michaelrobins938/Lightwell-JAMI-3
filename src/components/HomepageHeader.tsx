"use client";

import { HelpCircle, Menu } from "lucide-react";
import { useState } from "react";
import HomepageMobileSidebar from "./HomepageMobileSidebar";

export default function HomepageHeader() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <header className="flex justify-between items-center w-full p-4 border-b border-gray-700 bg-gray-900 text-gray-200">
        {/* Hamburger only on mobile */}
        <button 
          className="md:hidden text-gray-300 hover:text-white transition" 
          onClick={() => setSidebarOpen(true)}
          aria-label="Open Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex-1" />

        <div className="flex items-center space-x-6">
          <button 
            aria-label="Help" 
            className="hover:text-white transition text-gray-300"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          <button className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition shadow-lg">
            Log in
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Drawer */}
      <HomepageMobileSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
    </>
  );
}
