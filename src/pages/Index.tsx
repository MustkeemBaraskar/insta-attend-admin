
import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { Clock, Users, Calendar } from "lucide-react";

// Mock data for the dashboard
const attendanceData = [
  { date: "Apr 23", present: 45, absent: 5, late: 3 },
  { date: "Apr 24", present: 48, absent: 2, late: 4 },
  { date: "Apr 25", present: 47, absent: 3, late: 2 },
  { date: "Apr 26", present: 49, absent: 1, late: 2 },
  { date: "Apr 27", present: 46, absent: 4, late: 3 },
  { date: "Apr 28", present: 42, absent: 8, late: 2 },
  { date: "Apr 29", present: 47, absent: 3, late: 2 },
];

const workingHoursData = [
  { date: "Apr 23", hours: 7.9 },
  { date: "Apr 24", hours: 8.2 },
  { date: "Apr 25", hours: 8.1 },
  { date: "Apr 26", hours: 7.8 },
  { date: "Apr 27", hours: 8.0 },
  { date: "Apr 28", hours: 8.3 },
  { date: "Apr 29", hours: 8.1 },
];

const Index = () => {
  const [statCards, setStatCards] = useState([
    { title: "Total Employees", value: 52, icon: Users, change: "+2 this month", color: "bg-blue-500" },
    { title: "Present Today", value: 47, icon: Clock, change: "90.3%", color: "bg-green-500" },
    { title: "On Leave", value: 3, icon: Calendar, change: "5.7%", color: "bg-orange-500" },
    { title: "Avg. Working Hours", value: "8.1", icon: Clock, change: "+0.3 hrs from last week", color: "bg-purple-500" },
  ]);

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500">Welcome back, Admin User</p>
        </div>
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-attendo-50 text-attendo-600">
          <span className="text-sm font-medium">Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <Card key={index} className="border-none shadow-sm">
            <CardContent className="p-6 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
                <p className="text-xs text-gray-500 mt-1">{card.change}</p>
              </div>
              <div className={`p-3 rounded-full ${card.color} text-white`}>
                <card.icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Daily Attendance</CardTitle>
            <CardDescription>Last 7 working days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" fill="#4ade80" name="Present" />
                  <Bar dataKey="absent" fill="#f87171" name="Absent" />
                  <Bar dataKey="late" fill="#fbbf24" name="Late" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Average Working Hours</CardTitle>
            <CardDescription>Last 7 working days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={workingHoursData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[7, 9]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="hours" stroke="#9b87f5" name="Hours" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {[
              { user: "John Smith", action: "checked in", time: "Today, 09:12 AM" },
              { user: "Sarah Johnson", action: "applied for leave", time: "Today, 08:45 AM" },
              { user: "Mike Williams", action: "submitted expense report", time: "Yesterday, 05:30 PM" },
              { user: "Emily Davis", action: "checked out", time: "Yesterday, 05:15 PM" }
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                  {activity.user.split(" ").map(name => name[0]).join("")}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    <span className="text-gray-900">{activity.user}</span>
                    <span className="text-gray-500"> {activity.action}</span>
                  </p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Index;
