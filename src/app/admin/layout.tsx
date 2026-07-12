'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth(); const router = useRouter();
  useEffect(() => { if (!loading && (!user || user.role !== 'admin')) router.push('/'); }, [user, loading, router]);
  if (loading) return <div className="min-h-screen bg-cream flex items-center justify-center dark:bg-navy-dark"><div className="w-8 h-8 border-2 border-ruby border-t-transparent rounded-full animate-spin" /></div>;
  if (!user || user.role !== 'admin') return null;
  return <div className="min-h-screen bg-cream dark:bg-gradient-to-br dark:from-navy-dark dark:via-navy dark:to-navy-dark"><Navbar /><div className="flex pt-16"><Sidebar /><main className="flex-1 p-6 min-h-[calc(100vh-4rem)]">{children}</main></div></div>;
}
