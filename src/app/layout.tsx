import { Inter } from 'next/font/google';
import { SessionProvider } from '@/providers/SessionProvider';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import { Notifications } from '@/components/Notifications';
import Sidebar from '@/components/dashboard/Sidebar'; // ✅ Import your Sidebar component

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Billzzy',
  description: 'Billing and Inventory Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen`} suppressHydrationWarning>
        <SessionProvider>
          <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
          <Notifications />

          <div className="flex min-h-screen">
            {/* ✅ Sidebar added here */}
            <Sidebar />

            {/* ✅ Main content area */}
            <main className="flex-1 p-4 overflow-auto">
              {children}
            </main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
