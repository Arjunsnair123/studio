'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/app/stat-card';
import { Users, Calendar, CheckCircle } from 'lucide-react';
import { alumniData, eventData } from '@/lib/data';

const chartData = [
  { year: '2019', total: Math.floor(Math.random() * 2000) + 1000 },
  { year: '2020', total: Math.floor(Math.random() * 2000) + 1500 },
  { year: '2021', total: Math.floor(Math.random() * 2000) + 2000 },
  { year: '2022', total: Math.floor(Math.random() * 2000) + 2500 },
  { year: '2023', total: Math.floor(Math.random() * 2000) + 3000 },
  { year: '2024', total: alumniData.length },
];

export default function AdminOverviewPage() {
  const totalAlumni = alumniData.length;
  const totalEvents = eventData.length;
  const totalRSVPs = eventData.reduce((sum, event) => sum + event.rsvps, 0);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-headline font-bold">Overview</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Alumni" value={totalAlumni.toLocaleString()} icon={<Users className="h-4 w-4" />} />
        <StatCard title="Upcoming Events" value={totalEvents.toString()} icon={<Calendar className="h-4 w-4" />} />
        <StatCard title="Total Event RSVPs" value={totalRSVPs.toLocaleString()} icon={<CheckCircle className="h-4 w-4" />} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Alumni Growth</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <XAxis
                dataKey="year"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
