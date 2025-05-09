
import { useState } from "react";
import { Bell, Search, LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/api/services";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

// Mock notifications
const mockNotifications = [
  {
    id: "n1",
    title: "Leave Approved",
    description: "Your leave request for April 10-11 has been approved.",
    date: "2025-04-06T10:30:00",
    read: false,
    type: "leave",
  },
  {
    id: "n2",
    title: "New Employee",
    description: "Sarah Johnson has joined the company as UX Designer.",
    date: "2025-04-06T09:15:00",
    read: false,
    type: "employee",
  },
  {
    id: "n3",
    title: "Payroll Generated",
    description: "Payroll for April 2025 has been generated and is ready for review.",
    date: "2025-04-05T16:45:00",
    read: true,
    type: "payroll",
  },
  {
    id: "n4",
    title: "Leave Request",
    description: "Jane Smith has requested leave from April 15-22.",
    date: "2025-04-05T14:20:00",
    read: true,
    type: "leave",
  },
  {
    id: "n5",
    title: "System Update",
    description: "System will undergo maintenance on April 10 from 8PM to 10PM.",
    date: "2025-04-04T11:05:00",
    read: true,
    type: "system",
  }
];

const Header = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [notificationOpen, setNotificationOpen] = useState(false);
  
  const handleLogout = () => {
    authService.logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };
  
  const currentUser = authService.getCurrentUser();
  const userInitial = currentUser?.name ? currentUser.name.charAt(0) : "U";
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };
  
  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
      <div className="flex-1">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            className="pl-10 bg-gray-50 border-gray-200 rounded-lg focus:ring-attendo-500 focus:border-attendo-500"
            placeholder="Search..."
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-medium">Notifications</h3>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-gray-500 hover:text-gray-700"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </Button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 flex justify-between ${!notification.read ? 'bg-blue-50' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-gray-500">{notification.description}</p>
                      <p className="text-xs text-gray-400">{format(new Date(notification.date), "MMM dd, h:mm a")}</p>
                    </div>
                    <button 
                      className="text-gray-400 hover:text-gray-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No notifications
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
        
        <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
          <LogOut className="h-5 w-5" />
        </Button>
        <div className="hidden md:block h-10 w-px bg-gray-200"></div>
        
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-attendo-500 text-white flex items-center justify-center">
                {userInitial}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{currentUser?.name || "Admin User"}</p>
                <p className="text-xs text-gray-500">{currentUser?.role || "Administrator"}</p>
              </div>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80" align="end">
            <div className="flex justify-between space-x-4">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">{currentUser?.name || "Admin User"}</h4>
                <p className="text-sm text-gray-500">{currentUser?.email || "admin@insta-attend.com"}</p>
                <div className="flex items-center pt-2">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                  <span className="text-xs font-medium text-green-600">Online</span>
                </div>
              </div>
              <div className="h-16 w-16 rounded-full bg-attendo-500 text-white text-xl font-semibold flex items-center justify-center">
                {userInitial}
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-500 mb-2">User Details</div>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Role:</dt>
                  <dd className="text-sm font-medium">{currentUser?.role || "Administrator"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Employee ID:</dt>
                  <dd className="text-sm font-medium">{currentUser?.id || "A-001"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Department:</dt>
                  <dd className="text-sm font-medium">Management</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Joined:</dt>
                  <dd className="text-sm font-medium">Jan 15, 2023</dd>
                </div>
              </dl>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex space-x-2">
                <Button size="sm" className="w-full" onClick={() => navigate("/settings")}>
                  Settings
                </Button>
                <Button size="sm" variant="outline" className="w-full" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </header>
  );
};

export default Header;
