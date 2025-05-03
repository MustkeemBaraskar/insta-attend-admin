
import { Bell, Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/api/services";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Header = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    authService.logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };
  
  const currentUser = authService.getCurrentUser();
  const userInitial = currentUser?.name ? currentUser.name.charAt(0) : "U";

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
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>
        <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
          <LogOut className="h-5 w-5" />
        </Button>
        <div className="hidden md:block h-10 w-px bg-gray-200"></div>
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-attendo-500 text-white flex items-center justify-center">
            {userInitial}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium">{currentUser?.name || "Admin User"}</p>
            <p className="text-xs text-gray-500">{currentUser?.role || "Administrator"}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
