import { useState, useEffect } from 'react';
import { Calendar, Users, CheckCircle, XCircle, Clock, FileText, Download, Filter, Plus, Search, AlertCircle, ChevronDown } from 'lucide-react';

export function HrAttendancePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [attendanceQueries, setAttendanceQueries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Initialize sample data
  useEffect(() => {
    // Sample attendance data
    const sampleAttendance = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
      const statuses = ['present', 'leave', 'halfday', 'absent', 'off'];
      const weights = [0.6, 0.1, 0.1, 0.05, 0.15]; // Probability weights
      let random = Math.random();
      let statusIndex = 0;
      
      for (let j = 0; j < weights.length; j++) {
        random -= weights[j];
        if (random <= 0) {
          statusIndex = j;
          break;
        }
      }
      
      return {
        date: date.toISOString().split('T')[0],
        day: i + 1,
        status: statuses[statusIndex],
        checkIn: statuses[statusIndex] === 'present' ? '9:00 AM' : 
                statuses[statusIndex] === 'halfday' ? '9:00 AM' : '-',
        checkOut: statuses[statusIndex] === 'present' ? '6:00 PM' : 
                 statuses[statusIndex] === 'halfday' ? '1:00 PM' : '-',
        hours: statuses[statusIndex] === 'present' ? '9.0' : 
               statuses[statusIndex] === 'halfday' ? '4.0' : '0.0'
      };
    });

    // Sample leave requests
    const sampleLeaveRequests = [
      { id: 1, name: 'Sarah Johnson', type: 'Sick Leave', dates: 'Nov 15-16', status: 'pending', startDate: '2025-11-15', endDate: '2025-11-16' },
      { id: 2, name: 'Mike Chen', type: 'Vacation', dates: 'Nov 20-25', status: 'pending', startDate: '2025-11-20', endDate: '2025-11-25' },
      { id: 3, name: 'Emma Davis', type: 'Personal', dates: 'Nov 18', status: 'approved', startDate: '2025-11-18', endDate: '2025-11-18' },
      { id: 4, name: 'Alex Kim', type: 'Emergency', dates: 'Nov 22', status: 'pending', startDate: '2025-11-22', endDate: '2025-11-22' }
    ];

    // Sample attendance queries
    const sampleQueries = [
      { id: 1, name: 'John Smith', issue: 'Missing check-in', date: 'Nov 12', status: 'open', resolved: false },
      { id: 2, name: 'Lisa Wang', issue: 'Wrong time calculation', date: 'Nov 14', status: 'in progress', resolved: false },
      { id: 3, name: 'Tom Wilson', issue: 'Leave balance dispute', date: 'Nov 15', status: 'open', resolved: false }
    ];

    setAttendanceData(sampleAttendance);
    setLeaveRequests(sampleLeaveRequests);
    setAttendanceQueries(sampleQueries);
  }, [currentDate]);

  // Calculate statistics
  const calculateStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayData = attendanceData.find(item => item.date === today);
    
    const presentCount = attendanceData.filter(item => item.status === 'present').length;
    const leaveCount = attendanceData.filter(item => item.status === 'leave').length;
    const halfdayCount = attendanceData.filter(item => item.status === 'halfday').length;
    const absentCount = attendanceData.filter(item => item.status === 'absent').length;
    
    const pendingLeaves = leaveRequests.filter(req => req.status === 'pending').length;
    const openQueries = attendanceQueries.filter(query => !query.resolved).length;

    return {
      presentToday: todayData?.status === 'present' ? 42 : 41, // Sample data
      onLeave: leaveCount,
      halfDays: halfdayCount,
      absent: absentCount,
      pendingLeaveRequests: pendingLeaves,
      openQueries: openQueries
    };
  };

  const stats = calculateStats();

  // Handle leave request actions
  const handleApproveLeave = (id) => {
    setLeaveRequests(prev => 
      prev.map(req => 
        req.id === id ? { ...req, status: 'approved' } : req
      )
    );
  };

  const handleRejectLeave = (id) => {
    setLeaveRequests(prev => 
      prev.map(req => 
        req.id === id ? { ...req, status: 'rejected' } : req
      )
    );
  };

  // Handle query resolution
  const handleResolveQuery = (id) => {
    setAttendanceQueries(prev =>
      prev.map(query =>
        query.id === id ? { ...query, resolved: true, status: 'resolved' } : query
      )
    );
  };

  // Handle check-in/check-out
  const handleCheckIn = () => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });

    setAttendanceData(prev =>
      prev.map(item =>
        item.date === today 
          ? { 
              ...item, 
              status: 'present', 
              checkIn: timeString,
              checkOut: '-',
              hours: '0.0'
            }
          : item
      )
    );

    alert(`Checked in at ${timeString}`);
  };

  const handleCheckOut = () => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });

    setAttendanceData(prev =>
      prev.map(item =>
        item.date === today && item.status === 'present'
          ? { 
              ...item, 
              checkOut: timeString,
              hours: '9.0' // Calculate actual hours in real app
            }
          : item
      )
    );

    alert(`Checked out at ${timeString}`);
  };

  // Handle new leave request
  const handleAddLeaveRequest = () => {
    const newRequest = {
      id: leaveRequests.length + 1,
      name: 'You',
      type: 'New Leave',
      dates: 'Today',
      status: 'pending',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    };
    setLeaveRequests(prev => [newRequest, ...prev]);
    alert('Leave request added and pending approval');
  };

  // Handle report generation
  const handleGenerateReport = () => {
    const reportData = {
      month: currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }),
      stats: stats,
      attendance: attendanceData,
      leaves: leaveRequests
    };
    
    // In a real app, this would generate and download a file
    console.log('Report generated:', reportData);
    alert('Attendance report generated! Check console for details.');
  };

  // Handle export data
  const handleExportData = () => {
    const exportData = {
      attendance: attendanceData,
      leaveRequests: leaveRequests,
      queries: attendanceQueries
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    // Create download link
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('Data exported successfully!');
  };

  // Filtered data based on search and filter
  const filteredLeaveRequests = leaveRequests.filter(request =>
    request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredQueries = attendanceQueries.filter(query =>
    query.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    query.issue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-6 relative overflow-hidden">
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-sky-100 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse animation-delay-2000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600">Track and manage employee attendance, leaves, and time-off requests</p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Present Today */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Present Today</h3>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.presentToday}</div>
            <p className="text-sm text-green-600 mt-1 flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {Math.round((stats.presentToday / 47) * 100)}% of total staff
            </p>
          </div>

          {/* On Leave */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">On Leave</h3>
              <Calendar className="h-5 w-5 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.onLeave}</div>
            <p className="text-sm text-orange-600 mt-1 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {leaveRequests.filter(req => req.status === 'approved').length} approved, {stats.pendingLeaveRequests} pending
            </p>
          </div>

          {/* Half Days */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Half Days</h3>
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.halfDays}</div>
            <p className="text-sm text-blue-600 mt-1 flex items-center">
              <Users className="h-4 w-4 mr-1" />
              All approved
            </p>
          </div>

          {/* Absent */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Absent</h3>
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.absent}</div>
            <p className="text-sm text-red-600 mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              No notification
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Monthly Overview */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })} Overview
              </h2>
              <div className="flex items-center space-x-2">
                <button className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                  <ChevronDown className="h-4 w-4 ml-2" />
                </button>
                <button 
                  onClick={handleExportData}
                  className="flex items-center px-3 py-2 text-sm bg-[#349dff] text-white rounded-lg hover:bg-[#2980db]"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
              </div>
            </div>

            {/* Calendar View */}
            <div className="grid grid-cols-7 gap-2 mb-6">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
              
              {/* Calendar Days */}
              {attendanceData.map((dayData) => (
                <div 
                  key={dayData.day} 
                  className={`
                    text-center p-2 rounded-lg border text-sm font-medium cursor-pointer hover:scale-105 transition-transform
                    ${dayData.status === 'present' ? 'bg-green-50 border-green-200 text-green-700' :
                      dayData.status === 'leave' ? 'bg-orange-50 border-orange-200 text-orange-700' :
                      dayData.status === 'halfday' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                      dayData.status === 'absent' ? 'bg-red-50 border-red-200 text-red-700' :
                      'bg-gray-50 border-gray-200 text-gray-500'
                    }
                  `}
                  title={`${dayData.date}: ${dayData.status}`}
                >
                  {dayData.day}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                Present ({attendanceData.filter(d => d.status === 'present').length})
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>
                Leave ({attendanceData.filter(d => d.status === 'leave').length})
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                Half Day ({attendanceData.filter(d => d.status === 'halfday').length})
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                Absent ({attendanceData.filter(d => d.status === 'absent').length})
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-400 rounded mr-2"></div>
                Off Days ({attendanceData.filter(d => d.status === 'off').length})
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={handleAddLeaveRequest}
                className="w-full flex items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-[#349dff] hover:bg-blue-50 transition duration-300 group"
              >
                <Plus className="h-5 w-5 text-gray-500 group-hover:text-[#349dff] mr-3 transition duration-300" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Add Leave Request</span>
              </button>
              <button 
                onClick={handleGenerateReport}
                className="w-full flex items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-[#349dff] hover:bg-blue-50 transition duration-300 group"
              >
                <FileText className="h-5 w-5 text-gray-500 group-hover:text-[#349dff] mr-3 transition duration-300" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Generate Report</span>
              </button>
              <button 
                onClick={handleCheckIn}
                className="w-full flex items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-[#349dff] hover:bg-blue-50 transition duration-300 group"
              >
                <Clock className="h-5 w-5 text-gray-500 group-hover:text-[#349dff] mr-3 transition duration-300" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Check In</span>
              </button>
              <button 
                onClick={handleCheckOut}
                className="w-full flex items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-[#349dff] hover:bg-blue-50 transition duration-300 group"
              >
                <Users className="h-5 w-5 text-gray-500 group-hover:text-[#349dff] mr-3 transition duration-300" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Check Out</span>
              </button>
            </div>

            {/* Today's Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Today's Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Checked In:</span>
                  <span className="font-medium text-gray-900">{stats.presentToday}/47</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Late Arrivals:</span>
                  <span className="font-medium text-orange-600">3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Early Departures:</span>
                  <span className="font-medium text-blue-600">2</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pending Requests:</span>
                  <span className="font-medium text-red-600">{stats.pendingLeaveRequests + stats.openQueries}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leave Requests */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Leave Requests</h2>
              <span className="text-sm text-gray-500">{stats.pendingLeaveRequests} pending approvals</span>
            </div>
            <div className="space-y-4">
              {filteredLeaveRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-[#349dff] hover:bg-blue-50 transition duration-300">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{request.name}</h4>
                    <p className="text-xs text-gray-600">{request.type} • {request.dates}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      request.status === 'approved' ? 'bg-green-100 text-green-800 border border-green-200' :
                      request.status === 'rejected' ? 'bg-red-100 text-red-800 border border-red-200' :
                      'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    }`}>
                      {request.status}
                    </span>
                    {request.status === 'pending' && (
                      <div className="flex space-x-1">
                        <button 
                          onClick={() => handleApproveLeave(request.id)}
                          className="text-xs text-green-600 hover:text-green-800 font-medium"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleRejectLeave(request.id)}
                          className="text-xs text-red-600 hover:text-red-800 font-medium"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance Queries */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Attendance Queries</h2>
              <span className="text-sm text-gray-500">{stats.openQueries} unresolved</span>
            </div>
            <div className="space-y-4">
              {filteredQueries.map((query) => (
                <div key={query.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-[#349dff] hover:bg-blue-50 transition duration-300">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{query.name}</h4>
                    <p className="text-xs text-gray-600">{query.issue} • {query.date}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      query.status === 'open' ? 'bg-red-100 text-red-800 border border-red-200' :
                      query.status === 'in progress' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                      'bg-green-100 text-green-800 border border-green-200'
                    }`}>
                      {query.status}
                    </span>
                    {!query.resolved && (
                      <button 
                        onClick={() => handleResolveQuery(query.id)}
                        className="text-xs text-[#349dff] hover:text-[#2980db] font-medium"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}

export default HrAttendancePage;