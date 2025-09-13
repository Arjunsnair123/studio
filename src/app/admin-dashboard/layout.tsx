'use client';
import { DashboardLayout } from '@/components/app/dashboard-layout';
import { LayoutDashboard, Users, Calendar, BarChart } from 'lucide-react';

const navItems = [
  { href: '/admin-dashboard', label: 'Overview', icon: <LayoutDashboard /> },
  { href: '/admin-dashboard/alumni', label: 'Alumni', icon: <Users /> },
  { href: '/admin-dashboard/events', label: 'Events', icon: <Calendar /> },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout navItems={navItems} title="Admin Dashboard">{children}</DashboardLayout>;
}
