import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Calendar,
  FileText,
  ClipboardList,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  UserCheck2Icon,
  SheetIcon
} from 'lucide-react';

const Sidebar = ({ isCollapsed, setIsCollapsed, activeItem, setActiveItem }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Calendar, badge: null, path: '/dashboard' },
    { id: 'attendance', label: 'Attendance', icon: SheetIcon, badge: null, path: '/attendance' },
    { id: 'customers', label: 'Customers', icon: UserCheck2Icon, badge: null},
    { id: 'projects', label: 'Projects', icon: FileText, badge: null },
    { id: 'applications', label: 'Applications', icon: ClipboardList, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  // Helper function to check if item is active based on current route
  const isItemActive = (item) => {
    // If the item has a path, check if it matches current location
    if (item.path) {
      return location.pathname === item.path;
    }
    // Fallback to activeItem state
    return activeItem === item.id;
  };

  // Logout function
  const handleLogout = () => {
    // Show confirmation dialog
    if (window.confirm('Are you sure you want to logout?')) {
      // Clear user data from localStorage
      localStorage.removeItem('attendanceData');
      localStorage.removeItem('checkedIn');
      localStorage.removeItem('checkInTime');
      localStorage.removeItem('userSession');
      
      // You can add more cleanup here if needed
      // For example: clear any user tokens, session data, etc.
      
      // Redirect to login page
      navigate('/login');
      
      // Optional: Show success message
      // alert('You have been logged out successfully!');
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        bg-blue-50/80 backdrop-blur-md border-r border-blue-200/40
        transition-all duration-500 ease-in-out
        flex flex-col
        ${isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'translate-x-0 w-64'}
        shadow-xl shadow-blue-500/10
      `}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue-200/40">
          {!isCollapsed && (
            <Link to="/dashboard" className="flex items-center">
              <div className="w-10 h-10 bg-[#349dff] rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-blue-500/30">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Sales Dashboard
                </h1>
                <p className="text-gray-600 text-xs">Welcome back, Sarah!</p>
              </div>
            </Link>
          )}
          
          {isCollapsed && (
            <Link to="/dashboard" className="w-10 h-10 bg-[#349dff] rounded-xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </Link>
          )}

          {/* Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg bg-white/70 backdrop-blur-sm border border-blue-200/40 hover:bg-white/90 transition-all duration-300 shadow-sm"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            )}
          </button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-blue-200/40">
          {!isCollapsed ? (
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#349dff] to-[#1e87e6] rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-lg shadow-blue-500/30">
                SJ
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">Sarah Johnson</p>
                <p className="text-xs text-gray-600 truncate">Sales Agent</p>
              </div>
              <button className="p-2 rounded-lg bg-white/70 backdrop-blur-sm border border-blue-200/40 hover:bg-white/90 transition-all duration-300 shadow-sm">
                <Bell className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#349dff] to-[#1e87e6] rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-lg shadow-blue-500/30">
                SJ
              </div>
              <button className="p-2 rounded-lg bg-white/70 backdrop-blur-sm border border-blue-200/40 hover:bg-white/90 transition-all duration-300 shadow-sm">
                <Bell className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-6">
          <div className="space-y-2 px-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isItemActive(item);
              
              // Use button if no path, otherwise use Link
              const NavigationElement = item.path ? Link : 'button';
              const navigationProps = item.path ? { to: item.path } : {};

              return (
                <NavigationElement
                  key={item.id}
                  {...navigationProps}
                  onClick={() => setActiveItem(item.id)}
                  className={`
                    w-full flex items-center rounded-xl px-4 py-4 text-sm font-medium transition-all duration-300 relative
                    backdrop-blur-sm border
                    ${isActive
                      ? 'bg-[#349dff] text-white shadow-lg shadow-blue-500/30 border-[#349dff] transform -translate-y-0.5'
                      : 'bg-white/60 text-gray-700 border-blue-200/40 hover:bg-white/80 hover:border-[#349dff]/30 hover:shadow-md'
                    }
                    ${isCollapsed ? 'justify-center' : 'justify-between'}
                  `}
                >
                  <div className="flex items-center">
                    <Icon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
                    {!isCollapsed && <span className="font-semibold">{item.label}</span>}
                  </div>
                  
                  {!isCollapsed && item.badge && (
                    <span className={`
                      inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold leading-none rounded-full min-w-6
                      ${isActive
                        ? 'bg-white/20 text-white backdrop-blur-sm' 
                        : 'bg-[#349dff] text-white shadow-sm'
                      }
                    `}>
                      {item.badge}
                    </span>
                  )}

                  {isCollapsed && item.badge && (
                    <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full shadow-sm"></span>
                  )}
                </NavigationElement>
              );
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-blue-200/40">
          <button 
            onClick={handleLogout}
            className={`
              w-full flex items-center rounded-xl px-4 py-4 text-sm font-semibold transition-all duration-300
              backdrop-blur-sm border border-red-200/50
              bg-white/60 text-red-600 hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-md
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <LogOut className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;