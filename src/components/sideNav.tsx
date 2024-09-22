'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Clipboard, BarChart, Settings, ShoppingCart, LogIn, Menu, X, CookingPot } from 'lucide-react';
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import Image from 'next/image';
const navItems = [
  { name: 'Pantry', href: '/pantry', icon: Home },
  { name: 'Inventory', href: '/inventory', icon: Clipboard },

 { name: 'Recipe', href: '/recipe', icon: CookingPot },
];

const SideNav: React.FC = () => {
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
       <div className="fixed top-0 left-0 right-0 h-16 bg-white z-30 lg:hidden flex items-center px-4 border-b">
        <button 
          onClick={toggleMenu} 
          className="p-2 bg-gray-100 rounded-md"
        > 
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <span className="ml-4 text-xl font-bold">PantryPal</span>
      </div>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-15 lg:hidden"
          onClick={toggleMenu}
        ></div>
      )}

      {/* Sidebar */}
      <nav className={`
        fixed top-0 left-0 h-full w-64 bg-gray-100 p-4 flex flex-col
        transform transition-transform duration-300 ease-in-out z-20
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:h-screen
      `}>
        <div className="text-xl font-bold mb-8 flex items-center">
          <Link href='/pantry'>PantryPal</Link>
        </div>
        <ul className="flex-grow">
          {navItems.map((item) => (
            <li key={item.name} className="mb-4">
              <Link href={item.href} onClick={() => setIsOpen(false)}>
                <div
                  className={`flex items-center p-2 rounded-md ${
                    pathname === item.href
                      ? 'bg-black text-white scale-105 transition duration-300'
                      : 'hover:bg-gray-200'
                  }`}
                >
                  <item.icon className="mr-2" size={20} />
                  {item.name}
                </div>
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="mt-auto">
          {isSignedIn ? (
            <div className="flex items-center p-2 rounded-md hover:bg-gray-200">
              <UserButton afterSignOutUrl="/" />
              <span className="ml-2">Manage Account</span>
            </div>
          ) : (
            <SignInButton mode="modal">
              <button className="flex items-center w-full p-2 rounded-md hover:bg-gray-200">
                <LogIn className="mr-2" size={20} />
                <span>Sign In</span>
              </button>
            </SignInButton>
          )}
        </div>
      </nav>
    </>
  );
};

export default SideNav;

