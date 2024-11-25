// components/Header.tsx
'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { 
  Bars3Icon, 
  BellIcon, 
  UserCircleIcon 
} from '@heroicons/react/24/outline';
import { signOut } from 'next-auth/react';

interface HeaderProps {
  openSidebar: () => void;
  user: {
    shopName?: string;
    name?: string;
    image?: string;
    // Add other user properties if needed
  };
}

export default function Header({ 
  openSidebar,
  user 
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 bg-white shadow">
      {/* Hamburger button for mobile */}
      <button
        type="button"
        className="px-4 border-r border-gray-200 text-gray-500 md:hidden focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        onClick={openSidebar}
        aria-label="Open sidebar"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>
      
      {/* Header content */}
      <div className="flex-1 px-4 flex justify-between">
        {/* Shop Name */}
        <div className="flex-1 flex items-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            {user?.shopName || 'Dashboard'}
          </h1>
        </div>
        
        {/* Right-side icons */}
        <div className="ml-4 flex items-center md:ml-6">
          {/* Notifications Button */}
          <button
            type="button"
            className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            aria-label="View notifications"
          >
            <BellIcon className="h-6 w-6" />
          </button>

          {/* User Menu */}
          <Menu as="div" className="ml-3 relative">
            <div>
              <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span className="sr-only">Open user menu</span>
                {user?.image ? (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={user.image}
                    alt={user.name || 'User Avatar'}
                  />
                ) : (
                  <UserCircleIcon className="h-8 w-8 text-gray-400" />
                )}
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items 
                className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                {/* Additional Menu Items can be added here */}
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => signOut()}
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                    >
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
}
