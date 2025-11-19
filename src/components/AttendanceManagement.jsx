import { useState, useEffect, useRef } from 'react';
import { 
  Clock, Calendar, Users, CheckCircle, XCircle, Plus, 
  Search, Filter, Download, MoreVertical, Eye, Edit, 
  RefreshCw, TrendingUp, BarChart3, Coffee, LogIn, LogOut,
  ChevronDown, ChevronUp, MapPin, Smartphone, Monitor,
  FileText, Printer, Mail, UserCheck, AlertTriangle,
  Play, Square, Pause, Circle, Camera, Video, Mic, 
  Zap, Battery, Wifi, Cloud, Shield, Lock, Unlock,
  Bell, MessageCircle, Phone, Map, Navigation,
  PieChart, BarChart, LineChart, Target, Award,
  Settings, RotateCw, Power, WifiOff, Bluetooth,
  Heart, Activity, Thermometer, Gauge,
  DownloadCloud, UploadCloud, Database, Server,
  Smartphone as Mobile,
  Laptop, Tablet, Watch, Headphones
} from 'lucide-react';

// Data normalization function
const normalizeAttendanceData = (data) => {
  return data.map(record => ({
    id: record.id || Date.now(),
    employeeId: record.employeeId || 0,
    employee: {
      id: record.employee?.id || 0,
      name: record.employee?.name || 'Unknown Employee',
      department: record.employee?.department || 'Unknown',
      position: record.employee?.position || 'Unknown',
      avatar: record.employee?.avatar || '',
      email: record.employee?.email || '',
      phone: record.employee?.phone || '',
      team: record.employee?.team || 'Unknown'
    },
    date: record.date || new Date().toISOString().split('T')[0],
    checkIn: record.checkIn || null,
    checkOut: record.checkOut || null,
    status: record.status || 'Unknown',
    hours: record.hours || 0,
    location: {
      type: record.location?.type || 'Unknown',
      coordinates: record.location?.coordinates || {},
      address: record.location?.address || 'N/A',
      accuracy: record.location?.accuracy || 'Unknown'
    },
    device: {
      type: record.device?.type || 'Unknown',
      model: record.device?.model || 'N/A',
      os: record.device?.os || 'N/A',
      ip: record.device?.ip || 'N/A',
      browser: record.device?.browser || 'N/A'
    },
    verification: {
      method: record.verification?.method || 'Manual',
      confidence: record.verification?.confidence || 100,
      timestamp: record.verification?.timestamp || 'N/A'
    },
    breaks: record.breaks || [],
    overtime: record.overtime || 0,
    productivity: record.productivity || 0,
    focusSessions: record.focusSessions || [],
    notes: record.notes || '',
    alerts: record.alerts || [],
    sessionQuality: record.sessionQuality || 'Unknown'
  }));
};

export function AdvancedAttendanceManagement() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState('daily');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [showGeoModal, setShowGeoModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [activeBreak, setActiveBreak] = useState(null);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [notifications, setNotifications] = useState([]);

  // Sample data with all required fields (biometric removed)
  const sampleData = [
    {
      id: 1,
      employeeId: 1,
      employee: {
        id: 1,
        name: 'John Smith',
        department: 'Sales',
        position: 'Manager',
        avatar: '/avatars/john.jpg',
        email: 'john@company.com',
        phone: '+1 (555) 123-4567',
        team: 'Enterprise Sales'
      },
      date: '2024-01-15',
      checkIn: '09:00',
      checkOut: '17:30',
      status: 'Present',
      hours: 8.5,
      location: {
        type: 'Office',
        coordinates: { lat: 40.7128, lng: -74.0060 },
        address: '123 Main St, New York, NY',
        accuracy: 'High'
      },
      device: {
        type: 'Desktop',
        model: 'Dell Precision 5560',
        os: 'Windows 11',
        ip: '192.168.1.100',
        browser: 'Chrome 120'
      },
      verification: {
        method: 'Manual',
        confidence: 100,
        timestamp: '08:59:45'
      },
      breaks: [
        { 
          id: 1, 
          type: 'Lunch', 
          start: '12:00', 
          end: '12:45', 
          duration: 45, 
          status: 'completed',
          location: 'Cafeteria',
          autoDetected: true
        },
        { 
          id: 2, 
          type: 'Coffee', 
          start: '15:30', 
          end: '15:45', 
          duration: 15, 
          status: 'completed',
          location: 'Break Room',
          autoDetected: true
        }
      ],
      overtime: 0.5,
      productivity: 92,
      focusSessions: [
        { start: '09:15', end: '11:45', duration: 150, score: 95 },
        { start: '13:00', end: '16:30', duration: 210, score: 88 }
      ],
      notes: 'High productivity day',
      alerts: [],
      sessionQuality: 'Excellent'
    },
    {
      id: 2,
      employeeId: 2,
      employee: {
        id: 2,
        name: 'Sarah Johnson',
        department: 'Marketing',
        position: 'Director',
        avatar: '/avatars/sarah.jpg',
        email: 'sarah@company.com',
        phone: '+1 (555) 123-4568',
        team: 'Digital Marketing'
      },
      date: '2024-01-15',
      checkIn: '09:15',
      checkOut: '17:45',
      status: 'Late',
      hours: 8.5,
      location: {
        type: 'Remote',
        coordinates: { lat: 40.7589, lng: -73.9851 },
        address: '456 Park Ave, New York, NY',
        accuracy: 'Medium'
      },
      device: {
        type: 'Laptop',
        model: 'MacBook Pro 16"',
        os: 'macOS Sonoma',
        ip: '192.168.1.101',
        browser: 'Safari 17'
      },
      verification: {
        method: 'Mobile App',
        confidence: 100,
        timestamp: '09:14:30'
      },
      breaks: [
        { 
          id: 1, 
          type: 'Lunch', 
          start: '12:30', 
          end: '13:15', 
          duration: 45, 
          status: 'completed',
          location: 'Home',
          autoDetected: false
        }
      ],
      overtime: 0.75,
      productivity: 85,
      focusSessions: [
        { start: '09:30', end: '12:00', duration: 150, score: 82 },
        { start: '13:30', end: '17:00', duration: 210, score: 87 }
      ],
      notes: 'Working from home - video calls',
      alerts: ['Late check-in'],
      sessionQuality: 'Good'
    },
    {
      id: 3,
      employeeId: 3,
      employee: {
        id: 3,
        name: 'Mike Chen',
        department: 'Engineering',
        position: 'Senior Developer',
        avatar: '/avatars/mike.jpg',
        email: 'mike@company.com',
        phone: '+1 (555) 123-4569',
        team: 'Backend Team'
      },
      date: '2024-01-15',
      checkIn: '08:45',
      checkOut: null,
      status: 'Active',
      hours: 0,
      location: {
        type: 'Office',
        coordinates: { lat: 40.7128, lng: -74.0060 },
        address: '123 Main St, New York, NY',
        accuracy: 'High'
      },
      device: {
        type: 'Desktop',
        model: 'Custom Workstation',
        os: 'Ubuntu 22.04',
        ip: '192.168.1.102',
        browser: 'Firefox 121'
      },
      verification: {
        method: 'Web Portal',
        confidence: 100,
        timestamp: '08:44:20'
      },
      breaks: [
        { 
          id: 1, 
          type: 'Break', 
          start: '16:00', 
          end: null, 
          duration: 0, 
          status: 'active',
          location: 'Break Room',
          autoDetected: true
        }
      ],
      overtime: 0,
      productivity: 78,
      focusSessions: [
        { start: '09:00', end: '12:00', duration: 180, score: 92 },
        { start: '13:00', end: '16:00', duration: 180, score: 85 }
      ],
      notes: 'Currently working on project deadline',
      alerts: [],
      sessionQuality: 'Good'
    }
  ];

  const [attendanceData, setAttendanceData] = useState(normalizeAttendanceData(sampleData));

  // Real-time simulation
  useEffect(() => {
    if (realTimeUpdates && autoRefresh) {
      const interval = setInterval(() => {
        simulateRealTimeUpdates();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [realTimeUpdates, autoRefresh]);

  const simulateRealTimeUpdates = () => {
    setAttendanceData(prev => prev.map(record => {
      if (record.status === 'Active' && Math.random() > 0.7) {
        const hasActiveBreak = record.breaks.some(b => b.status === 'active');
        if (!hasActiveBreak && Math.random() > 0.5) {
          return {
            ...record,
            breaks: [...record.breaks, {
              id: Date.now(),
              type: ['Coffee', 'Break', 'Personal'][Math.floor(Math.random() * 3)],
              start: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              end: null,
              duration: 0,
              status: 'active',
              location: record.location.type === 'Office' ? 'Break Room' : 'Home',
              autoDetected: true
            }]
          };
        }
      }
      return record;
    }));
  };

  // Statistics with safe calculations
  const stats = {
    totalEmployees: attendanceData.length,
    present: attendanceData.filter(a => a.status === 'Present' || a.status === 'Active').length,
    absent: attendanceData.filter(a => a.status === 'Absent').length,
    late: attendanceData.filter(a => a.status === 'Late').length,
    activeBreaks: attendanceData.reduce((count, record) => 
      count + (record.breaks || []).filter(b => b.status === 'active').length, 0
    ),
    remoteWorkers: attendanceData.filter(a => a.location?.type === 'Remote').length,
    averageProductivity: attendanceData.length > 0 
      ? (attendanceData.reduce((sum, record) => sum + (record.productivity || 0), 0) / attendanceData.length).toFixed(1)
      : 0,
    totalOvertime: attendanceData.reduce((sum, record) => sum + (record.overtime || 0), 0).toFixed(1),
    verifiedCheckins: attendanceData.filter(a => (a.verification?.confidence || 0) > 95).length
  };

  // AI-Powered Insights
  const aiInsights = [
    {
      type: 'pattern',
      title: 'Productivity Peak',
      description: 'Team shows highest productivity between 10:00-12:00',
      impact: 'high',
      suggestion: 'Schedule important meetings during this window'
    },
    {
      type: 'anomaly',
      title: 'Unusual Break Pattern',
      description: '3 employees taking extended breaks simultaneously',
      impact: 'medium',
      suggestion: 'Review break policy compliance'
    },
    {
      type: 'trend',
      title: 'Remote Work Efficiency',
      description: 'Remote workers show 15% higher focus session scores',
      impact: 'low',
      suggestion: 'Consider flexible remote work options'
    }
  ];

  // Enhanced filtering
  const filteredData = attendanceData.filter(record => {
    const matchesSearch = record.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.employee.team.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDepartment === 'all' || record.employee.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
    
    return matchesSearch && matchesDept && matchesStatus;
  });

  // Enhanced break management
  const handleStartBreak = (employeeId, breakType = 'Break') => {
    setAttendanceData(prev => prev.map(att => 
      att.employeeId === employeeId && att.status === 'Active' 
        ? {
            ...att,
            breaks: [...(att.breaks || []), {
              id: Date.now(),
              type: breakType,
              start: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              end: null,
              duration: 0,
              status: 'active',
              location: att.location?.type === 'Office' ? 'Break Room' : 'Remote',
              autoDetected: false
            }]
          }
        : att
    ));
    
    addNotification('Break Started', `${getEmployeeName(employeeId)} started a ${breakType.toLowerCase()} break`, 'info');
  };

  const handleEndBreak = (employeeId, breakId) => {
    setAttendanceData(prev => prev.map(att => 
      att.employeeId === employeeId 
        ? {
            ...att,
            breaks: (att.breaks || []).map(b => 
              b.id === breakId 
                ? {
                    ...b,
                    end: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    duration: Math.round((new Date() - new Date(`${att.date} ${b.start}`)) / (1000 * 60)),
                    status: 'completed'
                  }
                : b
            )
          }
        : att
    ));
    
    addNotification('Break Ended', `${getEmployeeName(employeeId)} ended their break`, 'success');
    setActiveBreak(null);
  };

  const handleForceCheckout = (employeeId) => {
    setAttendanceData(prev => prev.map(att => 
      att.employeeId === employeeId && att.status === 'Active'
        ? {
            ...att,
            checkOut: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'Present',
            hours: calculateHours(att.checkIn, new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
          }
        : att
    ));
    
    addNotification('Forced Checkout', `${getEmployeeName(employeeId)} was automatically checked out`, 'warning');
  };

  const handleReverify = (employeeId) => {
    addNotification('Verification Request', `Verification request sent to ${getEmployeeName(employeeId)}`, 'info');
    setTimeout(() => {
      addNotification('Verification Complete', `${getEmployeeName(employeeId)} successfully verified`, 'success');
    }, 3000);
  };

  const addNotification = (title, message, type = 'info') => {
    const newNotification = {
      id: Date.now(),
      title,
      message,
      type,
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
  };

  const getEmployeeName = (employeeId) => {
    const employee = attendanceData.find(a => a.employeeId === employeeId)?.employee;
    return employee?.name || 'Employee';
  };

  const calculateHours = (start, end) => {
    if (!start || !end) return 0;
    const startTime = new Date(`2000-01-01 ${start}`);
    const endTime = new Date(`2000-01-01 ${end}`);
    return (endTime - startTime) / (1000 * 60 * 60);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Enhanced Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advanced Attendance Management</h1>
          <p className="text-gray-600">Comprehensive attendance tracking with real-time monitoring and analytics</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-xl">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-700">Live</span>
          </div>
          <button 
            onClick={() => setShowAnalytics(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition duration-200"
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </button>
          <button 
            onClick={() => setShowGeoModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition duration-200"
          >
            <Map className="h-4 w-4" />
            Geo View
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-200">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* AI Insights Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {aiInsights.map((insight, index) => (
          <div key={index} className={`p-4 rounded-xl border ${
            insight.impact === 'high' ? 'bg-red-50 border-red-200' :
            insight.impact === 'medium' ? 'bg-yellow-50 border-yellow-200' :
            'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-start justify-between mb-2">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                insight.impact === 'high' ? 'bg-red-100 text-red-800' :
                insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {insight.type.toUpperCase()}
              </span>
              <Zap className="h-4 w-4 text-yellow-500" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">{insight.title}</h4>
            <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
            <p className="text-xs text-gray-500">{insight.suggestion}</p>
          </div>
        ))}
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <EnhancedStatCard 
          title="Total" 
          value={stats.totalEmployees} 
          icon={Users}
          color="blue"
          trend="+2%"
        />
        <EnhancedStatCard 
          title="Present" 
          value={stats.present} 
          icon={UserCheck}
          color="green"
          trend="+5%"
        />
        <EnhancedStatCard 
          title="Remote" 
          value={stats.remoteWorkers} 
          icon={Smartphone}
          color="purple"
          trend="+12%"
        />
        <EnhancedStatCard 
          title="Productivity" 
          value={`${stats.averageProductivity}%`} 
          icon={TrendingUp}
          color="green"
          trend="+3%"
        />
        <EnhancedStatCard 
          title="Overtime" 
          value={`${stats.totalOvertime}h`} 
          icon={Clock}
          color="orange"
          trend="-8%"
        />
        <EnhancedStatCard 
          title="Active Breaks" 
          value={stats.activeBreaks} 
          icon={Coffee}
          color="red"
          trend="+2"
        />
        <EnhancedStatCard 
          title="Verified" 
          value={stats.verifiedCheckins} 
          icon={Shield}
          color="indigo"
          trend="100%"
        />
        <EnhancedStatCard 
          title="Late" 
          value={stats.late} 
          icon={AlertTriangle}
          color="yellow"
          trend="-15%"
        />
      </div>

      {/* Controls Panel */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees, departments, teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select 
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Departments</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Engineering">Engineering</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
            </select>

            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Present">Present</option>
              <option value="Active">Active</option>
              <option value="Late">Late</option>
              <option value="Absent">Absent</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div className="flex gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={realTimeUpdates}
                onChange={(e) => setRealTimeUpdates(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Live Updates
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Auto Refresh
            </label>
            <button 
              onClick={() => setShowBreakModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition duration-200"
            >
              <Coffee className="h-4 w-4" />
              Breaks
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Attendance Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <EnhancedAttendanceTable 
            data={filteredData}
            onStartBreak={handleStartBreak}
            onEndBreak={handleEndBreak}
            onViewDetails={setSelectedEmployee}
            onForceCheckout={handleForceCheckout}
            onReverify={handleReverify}
            activeBreak={activeBreak}
          />
        </div>
      </div>

      {/* Notifications Panel */}
      <NotificationsPanel 
        notifications={notifications}
        onClearAll={() => setNotifications([])}
        onMarkAsRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? {...n, read: true} : n))}
      />

      {/* Enhanced Modals */}
      {selectedEmployee && (
        <EnhancedEmployeeDetailModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          onReverify={handleReverify}
        />
      )}

      {showBreakModal && (
        <EnhancedBreakManagementModal
          onClose={() => setShowBreakModal(false)}
          attendanceData={attendanceData}
          onEndBreak={handleEndBreak}
        />
      )}

      {showGeoModal && (
        <GeoLocationModal
          onClose={() => setShowGeoModal(false)}
          attendanceData={attendanceData}
        />
      )}

      {showAnalytics && (
        <AnalyticsDashboard
          onClose={() => setShowAnalytics(false)}
          attendanceData={attendanceData}
        />
      )}
    </div>
  );
}

// Enhanced Stat Card Component
function EnhancedStatCard({ title, value, icon: Icon, color, trend }) {
  const colorClasses = {
    blue: 'text-blue-500 bg-blue-50',
    green: 'text-green-500 bg-green-50',
    red: 'text-red-500 bg-red-50',
    orange: 'text-orange-500 bg-orange-50',
    purple: 'text-purple-500 bg-purple-50',
    indigo: 'text-indigo-500 bg-indigo-50',
    yellow: 'text-yellow-500 bg-yellow-50'
  };

  const isPositive = trend.startsWith('+');

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-200 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-4 w-4" />
        </div>
        <span className={`text-xs font-medium ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend}
        </span>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm font-medium text-gray-600">{title}</p>
      </div>
    </div>
  );
}

// Enhanced Attendance Table Component
function EnhancedAttendanceTable({ data, onStartBreak, onEndBreak, onViewDetails, onForceCheckout, onReverify, activeBreak }) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200 bg-gray-50">
          <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Employee</th>
          <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Check In/Out</th>
          <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Location & Device</th>
          <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Breaks</th>
          <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Productivity</th>
          <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Verification</th>
          <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Status</th>
          <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {data.map((record) => (
          <EnhancedAttendanceRow 
            key={record.id}
            record={record}
            onStartBreak={onStartBreak}
            onEndBreak={onEndBreak}
            onViewDetails={onViewDetails}
            onForceCheckout={onForceCheckout}
            onReverify={onReverify}
            activeBreak={activeBreak}
          />
        ))}
      </tbody>
    </table>
  );
}

// Enhanced Attendance Row Component
function EnhancedAttendanceRow({ record, onStartBreak, onEndBreak, onViewDetails, onForceCheckout, onReverify, activeBreak }) {
  const [showBreakDetails, setShowBreakDetails] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  
  const activeBreakForEmployee = (record.breaks || []).find(b => b.status === 'active');
  const totalBreakTime = (record.breaks || []).reduce((sum, breakItem) => sum + (breakItem.duration || 0), 0);

  return (
    <>
      <tr className="hover:bg-gray-50 transition duration-150 group">
        <td className="py-4 px-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {record.employee.name.split(' ').map(n => n[0]).join('')}
              </div>
              {record.status === 'Active' && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div>
              <div className="font-medium text-gray-900">{record.employee.name}</div>
              <div className="text-sm text-gray-600">{record.employee.department} • {record.employee.team}</div>
            </div>
          </div>
        </td>
        
        <td className="py-4 px-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <LogIn className="h-3 w-3 text-green-500" />
              <span className="text-sm font-medium">{record.checkIn || '--:--'}</span>
            </div>
            <div className="flex items-center gap-2">
              <LogOut className="h-3 w-3 text-blue-500" />
              <span className="text-sm">{record.checkOut || '--:--'}</span>
            </div>
          </div>
        </td>
        
        <td className="py-4 px-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {record.location?.type === 'Office' ? (
                <Monitor className="h-3 w-3 text-blue-500" />
              ) : (
                <Smartphone className="h-3 w-3 text-green-500" />
              )}
              <span className="text-sm">{record.location?.type || 'Unknown'}</span>
            </div>
            <div className="flex items-center gap-2">
              {record.device?.type === 'Desktop' ? (
                <Laptop className="h-3 w-3 text-gray-500" />
              ) : record.device?.type === 'Laptop' ? (
                <Laptop className="h-3 w-3 text-purple-500" />
              ) : (
                <Mobile className="h-3 w-3 text-orange-500" />
              )}
              <span className="text-xs text-gray-500">{record.device?.model || 'Unknown'}</span>
            </div>
          </div>
        </td>
        
        <td className="py-4 px-6">
          <button 
            onClick={() => setShowBreakDetails(!showBreakDetails)}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition duration-200"
          >
            <Coffee className="h-4 w-4" />
            {(record.breaks || []).length}
            {showBreakDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {totalBreakTime > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              {Math.floor(totalBreakTime / 60)}h {totalBreakTime % 60}m total
            </div>
          )}
        </td>
        
        <td className="py-4 px-6">
          <div className="flex items-center gap-2">
            <div className="w-12 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${record.productivity || 0}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium">{record.productivity || 0}%</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {(record.focusSessions || []).length} focus sessions
          </div>
        </td>
        
        <td className="py-4 px-6">
          <div className="flex items-center gap-2">
            <Shield className={`h-4 w-4 ${
              (record.verification?.confidence || 0) > 95 ? 'text-green-500' : 'text-yellow-500'
            }`} />
            <div>
              <div className="text-sm font-medium">{record.verification?.method || 'Manual'}</div>
              <div className="text-xs text-gray-500">{record.verification?.confidence || 100}%</div>
            </div>
          </div>
        </td>
        
        <td className="py-4 px-6">
          <div className="space-y-1">
            <EnhancedStatusBadge status={record.status} />
            {record.sessionQuality && (
              <div className={`text-xs font-medium ${
                record.sessionQuality === 'Excellent' ? 'text-green-600' :
                record.sessionQuality === 'Good' ? 'text-blue-600' :
                'text-yellow-600'
              }`}>
                {record.sessionQuality}
              </div>
            )}
          </div>
        </td>
        
        <td className="py-4 px-6">
          <div className="flex items-center gap-1">
            <button 
              onClick={() => onViewDetails(record)}
              className="p-2 text-gray-400 hover:text-blue-600 transition duration-200"
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </button>
            
            {record.status === 'Active' && !activeBreakForEmployee && (
              <div className="relative">
                <button 
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className="p-2 text-gray-400 hover:text-orange-600 transition duration-200"
                  title="Break Actions"
                >
                  <Coffee className="h-4 w-4" />
                </button>
                {showQuickActions && (
                  <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <button 
                      onClick={() => onStartBreak(record.employeeId, 'Coffee')}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-t-lg"
                    >
                      ☕ Coffee Break
                    </button>
                    <button 
                      onClick={() => onStartBreak(record.employeeId, 'Lunch')}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      🍽️ Lunch Break
                    </button>
                    <button 
                      onClick={() => onStartBreak(record.employeeId, 'Break')}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-b-lg"
                    >
                      ⏸️ Quick Break
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {activeBreakForEmployee && (
              <button 
                onClick={() => onEndBreak(record.employeeId, activeBreakForEmployee.id)}
                className="p-2 text-gray-400 hover:text-green-600 transition duration-200"
                title="End Break"
              >
                <Square className="h-4 w-4" />
              </button>
            )}
            
            {record.status === 'Active' && (
              <button 
                onClick={() => onForceCheckout(record.employeeId)}
                className="p-2 text-gray-400 hover:text-red-600 transition duration-200"
                title="Force Checkout"
              >
                <Power className="h-4 w-4" />
              </button>
            )}
            
            <button 
              onClick={() => onReverify(record.employeeId)}
              className="p-2 text-gray-400 hover:text-purple-600 transition duration-200"
              title="Re-verify"
            >
              <Shield className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>
      
      {/* Enhanced Break Details Expandable Row */}
      {showBreakDetails && (
        <tr>
          <td colSpan="8" className="bg-gray-50 p-4">
            <EnhancedBreakDetails record={record} />
          </td>
        </tr>
      )}
    </>
  );
}

// Enhanced Break Details Component
function EnhancedBreakDetails({ record }) {
  const breaks = record.breaks || [];
  const totalBreakTime = breaks.reduce((sum, b) => sum + (b.duration || 0), 0);

  return (
    <div className="pl-16">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium text-gray-900">Break Analytics</h4>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Total Break Time: {Math.floor(totalBreakTime / 60)}h {totalBreakTime % 60}m</span>
          <span>Break Efficiency: 92%</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {breaks.length > 0 ? (
          breaks.map((breakItem) => (
            <div key={breakItem.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition duration-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="font-medium text-gray-900">{breakItem.type || 'Break'}</span>
                  {breakItem.autoDetected && (
                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Auto</span>
                  )}
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  breakItem.status === 'active' ? 'bg-green-500 animate-pulse' : 
                  breakItem.status === 'completed' ? 'bg-blue-500' : 'bg-gray-400'
                }`} />
              </div>
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex justify-between">
                  <span>Start:</span>
                  <span className="font-medium">{breakItem.start || 'N/A'}</span>
                </div>
                {breakItem.end && (
                  <div className="flex justify-between">
                    <span>End:</span>
                    <span className="font-medium">{breakItem.end}</span>
                  </div>
                )}
                {breakItem.duration > 0 && (
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{Math.floor(breakItem.duration / 60)}h {breakItem.duration % 60}m</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="font-medium">{breakItem.location || 'N/A'}</span>
                </div>
                <div className={`text-xs font-medium text-center mt-2 px-2 py-1 rounded ${
                  breakItem.status === 'active' ? 'bg-green-100 text-green-800' : 
                  breakItem.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {breakItem.status?.charAt(0).toUpperCase() + breakItem.status?.slice(1) || 'Unknown'}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-8">
            <Coffee className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No breaks recorded for this session</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Enhanced Status Badge Component
function EnhancedStatusBadge({ status }) {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'Present':
        return { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle };
      case 'Active':
        return { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Activity };
      case 'Late':
        return { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: Clock };
      case 'Absent':
        return { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle };
      case 'Remote':
        return { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Smartphone };
      default:
        return { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Circle };
    }
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      <IconComponent className="h-3 w-3" />
      {status}
    </span>
  );
}

// Notifications Panel Component
function NotificationsPanel({ notifications, onClearAll, onMarkAsRead }) {
  const unreadCount = notifications.filter(n => !n.read).length;

  if (notifications.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Notifications
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </h3>
        <button 
          onClick={onClearAll}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear All
        </button>
      </div>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            className={`p-3 rounded-lg border transition duration-200 cursor-pointer ${
              notification.read 
                ? 'bg-gray-50 border-gray-200' 
                : 'bg-blue-50 border-blue-200'
            }`}
            onClick={() => onMarkAsRead(notification.id)}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-medium text-sm text-gray-900">
                {notification.title}
              </span>
              <span className="text-xs text-gray-500">
                {notification.timestamp.toLocaleTimeString()}
              </span>
            </div>
            <p className="text-sm text-gray-600">{notification.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Enhanced Employee Detail Modal Component
function EnhancedEmployeeDetailModal({ employee, onClose, onReverify }) {
  // Safe employee data with defaults
  const safeEmployee = {
    ...employee,
    employee: employee.employee || {},
    location: employee.location || { type: 'Unknown', coordinates: {}, address: 'N/A', accuracy: 'Unknown' },
    device: employee.device || { type: 'Unknown', model: 'N/A', os: 'N/A', ip: 'N/A', browser: 'N/A' },
    verification: employee.verification || { method: 'Manual', confidence: 100, timestamp: 'N/A' },
    breaks: employee.breaks || [],
    focusSessions: employee.focusSessions || [],
    alerts: employee.alerts || [],
    notes: employee.notes || '',
    sessionQuality: employee.sessionQuality || 'Unknown',
    productivity: employee.productivity || 0,
    overtime: employee.overtime || 0,
    hours: employee.hours || 0,
    checkIn: employee.checkIn || 'N/A',
    checkOut: employee.checkOut || 'N/A',
    status: employee.status || 'Unknown',
    date: employee.date || 'Unknown Date'
  };

  const totalHours = safeEmployee.hours;
  const totalBreaks = safeEmployee.breaks.reduce((sum, b) => sum + (b.duration || 0), 0);
  const productiveHours = totalHours - (totalBreaks / 60);
  
  // Safe calculation for focus score
  const focusSessions = safeEmployee.focusSessions;
  const focusScore = focusSessions.length > 0 
    ? focusSessions.reduce((sum, session) => sum + (session.score || 0), 0) / focusSessions.length 
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Advanced Attendance Analytics</h3>
            <p className="text-gray-600">
              {safeEmployee.employee.name || 'Unknown Employee'} • 
              {safeEmployee.date} • 
              {safeEmployee.sessionQuality} Session
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <XCircle className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Enhanced Basic Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-3">Employee Information</h4>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-600">Name:</span> {safeEmployee.employee.name || 'N/A'}</div>
                <div><span className="text-gray-600">Department:</span> {safeEmployee.employee.department || 'N/A'}</div>
                <div><span className="text-gray-600">Position:</span> {safeEmployee.employee.position || 'N/A'}</div>
                <div><span className="text-gray-600">Team:</span> {safeEmployee.employee.team || 'N/A'}</div>
                <div><span className="text-gray-600">Contact:</span> {safeEmployee.employee.phone || 'N/A'}</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <h4 className="font-semibold text-gray-900 mb-3">Attendance Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <EnhancedStatusBadge status={safeEmployee.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check In:</span>
                  <span className="font-medium">{safeEmployee.checkIn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check Out:</span>
                  <span className="font-medium">{safeEmployee.checkOut}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Hours:</span>
                  <span className="font-medium">{totalHours}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Overtime:</span>
                  <span className="font-medium text-orange-600">{safeEmployee.overtime}h</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <h4 className="font-semibold text-gray-900 mb-3">Session Analytics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Productivity:</span>
                  <span className="font-medium">{safeEmployee.productivity}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Focus Score:</span>
                  <span className="font-medium">{focusScore.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Session Quality:</span>
                  <span className={`font-medium ${
                    safeEmployee.sessionQuality === 'Excellent' ? 'text-green-600' :
                    safeEmployee.sessionQuality === 'Good' ? 'text-blue-600' : 'text-yellow-600'
                  }`}>
                    {safeEmployee.sessionQuality}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Productive Time:</span>
                  <span className="font-medium">{productiveHours.toFixed(1)}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Break Time:</span>
                  <span className="font-medium">{Math.floor(totalBreaks / 60)}h {totalBreaks % 60}m</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
              <h4 className="font-semibold text-gray-900 mb-3">Security & Location</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{safeEmployee.location.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Device:</span>
                  <span className="font-medium">{safeEmployee.device.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Verification:</span>
                  <span className="font-medium">{safeEmployee.verification.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Confidence:</span>
                  <span className={`font-medium ${
                    safeEmployee.verification.confidence > 95 ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {safeEmployee.verification.confidence}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">IP Address:</span>
                  <span className="font-mono text-xs">{safeEmployee.device.ip}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Focus Sessions Timeline */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-4">Focus Sessions Timeline</h4>
            <div className="space-y-3">
              {focusSessions.length > 0 ? (
                focusSessions.map((session, index) => (
                  <div key={index} className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition duration-200">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {(session.start || 'N/A')} - {(session.end || 'N/A')}
                        </div>
                        <div className="text-sm text-gray-600">
                          Duration: {Math.floor((session.duration || 0) / 60)}h {(session.duration || 0) % 60}m
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{session.score || 0}%</div>
                      <div className="text-sm text-gray-600">Focus Score</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No focus sessions recorded</p>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Breaks Timeline */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-gray-900">Breaks Timeline</h4>
              <div className="text-sm text-gray-600">
                Total: {Math.floor(totalBreaks / 60)}h {totalBreaks % 60}m • Efficiency: 92%
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {safeEmployee.breaks.length > 0 ? (
                safeEmployee.breaks.map((breakItem) => (
                  <div key={breakItem.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition duration-200">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{breakItem.type || 'Break'}</span>
                        {breakItem.autoDetected && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Auto</span>
                        )}
                      </div>
                      <div className={`w-3 h-3 rounded-full ${
                        breakItem.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-blue-500'
                      }`} />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">{(breakItem.start || 'N/A')} - {(breakItem.end || 'Ongoing')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">
                          {breakItem.duration > 0 ? `${Math.floor(breakItem.duration / 60)}h ${breakItem.duration % 60}m` : 'Active'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">{breakItem.location || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  <Coffee className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No breaks recorded for this session</p>
                </div>
              )}
            </div>
          </div>

          {/* Notes & Alerts */}
          {(safeEmployee.notes || safeEmployee.alerts.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {safeEmployee.notes && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Session Notes</h4>
                  <p className="text-sm text-gray-600">{safeEmployee.notes}</p>
                </div>
              )}
              {safeEmployee.alerts.length > 0 && (
                <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    Alerts & Issues
                  </h4>
                  <div className="space-y-2">
                    {safeEmployee.alerts.map((alert, index) => (
                      <div key={index} className="text-sm text-red-600 flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        {alert}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center p-6 border-t border-gray-200">
          <button 
            onClick={() => onReverify(safeEmployee.employeeId)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition duration-200"
          >
            <Shield className="h-4 w-4" />
            Re-verify
          </button>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition duration-200"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-200">
              Export Full Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Break Management Modal Component
function EnhancedBreakManagementModal({ onClose, attendanceData, onEndBreak }) {
  const activeBreaks = attendanceData.flatMap(record => 
    (record.breaks || []).filter(b => b.status === 'active').map(b => ({
      ...b,
      employee: record.employee,
      recordId: record.id,
      employeeId: record.employeeId
    }))
  );

  const breakStats = {
    totalActive: activeBreaks.length,
    averageDuration: activeBreaks.length > 0 ? activeBreaks.reduce((sum, b) => sum + (b.duration || 0), 0) / activeBreaks.length : 0,
    byType: activeBreaks.reduce((acc, breakItem) => {
      acc[breakItem.type] = (acc[breakItem.type] || 0) + 1;
      return acc;
    }, {})
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Break Management Center</h3>
            <p className="text-gray-600">Monitor and manage all active employee breaks in real-time</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <XCircle className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          {/* Break Statistics */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{breakStats.totalActive}</div>
              <div className="text-sm text-blue-600">Active Breaks</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {breakStats.averageDuration ? Math.floor(breakStats.averageDuration) : 0}m
              </div>
              <div className="text-sm text-green-600">Avg Duration</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Object.keys(breakStats.byType).length}
              </div>
              <div className="text-sm text-purple-600">Break Types</div>
            </div>
          </div>

          {activeBreaks.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-900">Active Breaks</h4>
                <span className="text-sm text-gray-600">{activeBreaks.length} ongoing</span>
              </div>
              {activeBreaks.map((breakItem) => (
                <div key={`${breakItem.recordId}-${breakItem.id}`} 
                     className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-200 hover:shadow-md transition duration-200">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {breakItem.employee?.name?.split(' ').map(n => n[0]).join('') || 'EE'}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{breakItem.employee?.name || 'Unknown Employee'}</div>
                      <div className="text-sm text-gray-600">
                        {breakItem.type} break • Started at {breakItem.start} • {breakItem.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-orange-600 font-medium">
                      Ongoing • {Math.floor((new Date() - new Date(`2000-01-01 ${breakItem.start}`)) / (1000 * 60))}m
                    </span>
                    <button 
                      onClick={() => onEndBreak(breakItem.employeeId, breakItem.id)}
                      className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition duration-200"
                    >
                      End Break
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Coffee className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Active Breaks</h4>
              <p className="text-gray-600">All employees are currently working.</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition duration-200"
          >
            Close
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-200">
            Break Policy Settings
          </button>
        </div>
      </div>
    </div>
  );
}

// Geo Location Modal Component
function GeoLocationModal({ onClose, attendanceData }) {
  const locations = attendanceData.map(record => ({
    ...record,
    coordinates: record.location?.coordinates || {}
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl h-[80vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Employee Location Map</h3>
            <p className="text-gray-600">Real-time geographic distribution of your team</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <XCircle className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 h-[calc(100%-80px)]">
          <div className="bg-gray-100 rounded-xl w-full h-full flex items-center justify-center relative">
            <div className="text-center">
              <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Location Tracking Map</h4>
              <p className="text-gray-600 mb-4">Interactive map showing employee locations</p>
              
              <div className="flex justify-center gap-4">
                {locations.slice(0, 3).map((location, index) => (
                  <div key={index} className="bg-white p-3 rounded-lg shadow-md">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${
                        location.location?.type === 'Office' ? 'bg-blue-500' : 'bg-green-500'
                      }`}></div>
                      <span className="font-medium text-sm">{location.employee.name}</span>
                    </div>
                    <div className="text-xs text-gray-600">{location.location?.address || 'Unknown location'}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Analytics Dashboard Component
function AnalyticsDashboard({ onClose, attendanceData }) {
  const productivityData = attendanceData.map(record => record.productivity || 0);
  const averageProductivity = productivityData.length > 0 
    ? productivityData.reduce((a, b) => a + b, 0) / productivityData.length 
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-7xl h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Advanced Analytics Dashboard</h3>
            <p className="text-gray-600">Comprehensive insights into team attendance and productivity</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <XCircle className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4">
              <div className="text-2xl font-bold">94%</div>
              <div className="text-sm opacity-90">Attendance Rate</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4">
              <div className="text-2xl font-bold">{averageProductivity.toFixed(1)}%</div>
              <div className="text-sm opacity-90">Avg Productivity</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4">
              <div className="text-2xl font-bold">2.3h</div>
              <div className="text-sm opacity-90">Avg Daily Overtime</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-4">
              <div className="text-2xl font-bold">87%</div>
              <div className="text-sm opacity-90">Remote Work Efficiency</div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-4">Productivity Trend</h4>
              <div className="h-64 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                <LineChart className="h-12 w-12 text-gray-400" />
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-4">Department Performance</h4>
              <div className="h-64 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                <BarChart className="h-12 w-12 text-gray-400" />
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-4">Break Patterns Analysis</h4>
              <div className="h-64 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                <PieChart className="h-12 w-12 text-gray-400" />
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-4">Work Location Distribution</h4>
              <div className="h-64 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                <Map className="h-12 w-12 text-gray-400" />
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              AI-Powered Recommendations
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-sm font-medium text-gray-900 mb-2">Optimize Break Schedules</div>
                <div className="text-sm text-gray-600">Shift break times to avoid team-wide productivity dips</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-sm font-medium text-gray-900 mb-2">Remote Work Policy</div>
                <div className="text-sm text-gray-600">Consider expanding remote work based on performance data</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdvancedAttendanceManagement;