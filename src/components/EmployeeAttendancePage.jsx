import { useState, useEffect } from 'react';
import { 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Download, 
  TrendingUp, 
  AlertCircle, 
  RefreshCw, 
  LogIn, 
  LogOut, 
  X,
  Coffee,
  Utensils,
  Church,
  AlarmSmoke,
  UserCheck,
  Fingerprint,
  Calculator
} from 'lucide-react';
import { useAttendance } from '../hooks/UseAttendance';

export function EmployeeAttendancePage() {
  const {
    attendanceData,
    systemAttendance,
    handleSystemCheckIn,
    handleSystemCheckOut,
    updateWorkingTime,
    setBreakStatus,
    setAttendanceData,
    getTodayStatus,
    getAttendanceStats
  } = useAttendance();

  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(false);
  const [calendarDays, setCalendarDays] = useState([]);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [activeTab, setActiveTab] = useState('system');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Break Data with automatic timing
  const [breakData, setBreakData] = useState({
    smoke: { 
      active: false, 
      startTime: null, 
      totalDuration: 0, 
      sessions: [],
      autoEndTimer: null,
      breakLimit: 10
    },
    dinner: { 
      active: false, 
      startTime: null, 
      totalDuration: 0, 
      sessions: [],
      autoEndTimer: null,
      breakLimit: 60
    },
    washroom: { 
      active: false, 
      startTime: null, 
      totalDuration: 0, 
      sessions: [],
      autoEndTimer: null,
      breakLimit: 10
    },
    pray: { 
      active: false, 
      startTime: null, 
      totalDuration: 0, 
      sessions: [],
      autoEndTimer: null,
      breakLimit: 10
    }
  });

  // Machine attendance state
  const [machineAttendance, setMachineAttendance] = useState({
    checkedIn: false,
    checkInTime: null,
    checkOutTime: null,
    status: 'pending',
    lastSync: null,
    deviceId: 'BIO-001',
    location: 'Main Entrance'
  });

  // Employee profile data
  const employee = {
    name: 'Sarah Johnson',
    position: 'Sales Agent',
    employeeId: 'EMP-2024-001',
    department: 'Sales',
    joinDate: '2024-01-15'
  };

  // Leave types
  const leaveTypes = [
    'Sick Leave',
    'Vacation',
    'Personal',
    'Emergency',
    'Maternity Leave',
    'Paternity Leave',
    'Bereavement Leave'
  ];

  // Break types
  const breakTypes = [
    { 
      id: 'smoke', 
      name: 'Smoke Break', 
      icon: AlarmSmoke, 
      color: 'bg-orange-500', 
      activeColor: 'bg-orange-600',
      description: '10 minutes automatic break',
      limit: 10
    },
    { 
      id: 'dinner', 
      name: 'Dinner Break', 
      icon: Utensils, 
      color: 'bg-purple-500', 
      activeColor: 'bg-purple-600',
      description: '60 minutes meal break',
      limit: 60
    },
    { 
      id: 'washroom', 
      name: 'Washroom Break', 
      icon: Coffee, 
      color: 'bg-blue-500', 
      activeColor: 'bg-blue-600',
      description: '10 minutes automatic break',
      limit: 10
    },
    { 
      id: 'pray', 
      name: 'Prayer Break', 
      icon: Church, 
      color: 'bg-green-500', 
      activeColor: 'bg-green-600',
      description: '10 minutes automatic break',
      limit: 10
    }
  ];

  // Calculate total break time
  const calculateTotalBreakTime = () => {
    return breakTypes.reduce((total, breakType) => 
      total + breakData[breakType.id].totalDuration, 0
    );
  };

  // Calculate working hours summary
  const calculateWorkingHoursSummary = () => {
    const totalBreakTime = calculateTotalBreakTime();
    const netWorkingTime = Math.max(0, systemAttendance.totalWorkingTime - totalBreakTime);
    
    return {
      totalBreakTime,
      netWorkingTime,
      grossWorkingTime: systemAttendance.totalWorkingTime,
      efficiency: systemAttendance.totalWorkingTime > 0 
        ? Math.max(0, ((netWorkingTime / systemAttendance.totalWorkingTime) * 100)).toFixed(1)
        : 0
    };
  };

  // Update current time and calculate working duration
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      updateWorkingTime();
    }, 60000);

    return () => clearInterval(timer);
  }, [systemAttendance.checkedIn, systemAttendance.lastUpdate, systemAttendance.isOnBreak]);

  // Simulate machine attendance data
  useEffect(() => {
    const simulateMachineAttendance = () => {
      const now = new Date();
      
      // Simulate machine check-in at 9:00 AM if it's a working day
      const isWorkingDay = now.getDay() !== 0 && now.getDay() !== 6;
      if (isWorkingDay && now.getHours() >= 9 && now.getHours() < 18 && !machineAttendance.checkedIn && !machineAttendance.checkInTime) {
        const checkInTime = new Date();
        checkInTime.setHours(9, 0, 0, 0);
        
        setMachineAttendance({
          checkedIn: true,
          checkInTime: checkInTime,
          checkOutTime: null,
          status: 'present',
          lastSync: checkInTime,
          deviceId: 'BIO-001',
          location: 'Main Entrance'
        });
      }
      
      // Simulate machine check-out at 6:00 PM if checked in
      if (machineAttendance.checkedIn && now.getHours() >= 18 && !machineAttendance.checkOutTime) {
        const checkOutTime = new Date();
        checkOutTime.setHours(18, 0, 0, 0);
        
        setMachineAttendance(prev => ({
          ...prev,
          checkedIn: false,
          checkOutTime: checkOutTime,
          lastSync: checkOutTime
        }));
      }
    };

    const interval = setInterval(simulateMachineAttendance, 60000);
    return () => clearInterval(interval);
  }, [machineAttendance.checkedIn, machineAttendance.checkInTime, machineAttendance.checkOutTime]);

  // Initialize sample data
  useEffect(() => {
    const generateAttendanceData = () => {
      const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
      const data = [];

      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(selectedYear, selectedMonth, i);
        const dayOfWeek = date.getDay();
        const dateString = date.toISOString().split('T')[0];
        
        // Check if we already have data for this date
        const existingData = attendanceData.find(d => d.date === dateString);
        if (existingData) {
          data.push(existingData);
          continue;
        }

        // Skip weekends for sample data
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          data.push({
            date: dateString,
            day: i,
            status: 'off',
            checkIn: '-',
            checkOut: '-',
            hours: '0.0',
            remarks: 'Weekend'
          });
          continue;
        }

        // For today's date, initialize with empty check-in/check-out
        const isToday = dateString === new Date().toISOString().split('T')[0];
        if (isToday) {
          data.push({
            date: dateString,
            day: i,
            status: 'pending',
            checkIn: '-',
            checkOut: '-',
            hours: '0.0',
            remarks: 'Not checked in yet'
          });
          continue;
        }

        // For past dates, generate realistic attendance data
        const isPastDate = date < new Date();
        if (isPastDate) {
          const statuses = ['present', 'present', 'present', 'present', 'present', 'late', 'halfday', 'absent'];
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
          
          let checkIn, checkOut, hours, remarks;

          switch (randomStatus) {
            case 'present':
              checkIn = '09:00 AM';
              checkOut = '06:00 PM';
              hours = '9.0';
              remarks = 'On time';
              break;
            case 'late':
              checkIn = '09:16 AM';
              checkOut = '06:30 PM';
              hours = '8.0';
              remarks = 'Late arrival';
              break;
            case 'halfday':
              checkIn = '09:00 AM';
              checkOut = '02:00 PM';
              hours = '5.0';
              remarks = 'Half day';
              break;
            case 'absent':
              checkIn = '-';
              checkOut = '-';
              hours = '0.0';
              remarks = 'Absent';
              break;
            default:
              checkIn = '-';
              checkOut = '-';
              hours = '0.0';
              remarks = 'Off';
          }

          data.push({
            date: dateString,
            day: i,
            status: randomStatus,
            checkIn,
            checkOut,
            hours,
            remarks
          });
        } else {
          // Future dates
          data.push({
            date: dateString,
            day: i,
            status: 'pending',
            checkIn: '-',
            checkOut: '-',
            hours: '0.0',
            remarks: 'Future date'
          });
        }
      }

      return data;
    };

    // Sample leave requests for the employee
    const sampleLeaveRequests = [
      { 
        id: 1, 
        type: 'Sick Leave', 
        dates: 'Nov 15-16, 2025', 
        status: 'approved', 
        days: 2,
        appliedDate: '2025-11-10',
        reason: 'Fever and cold'
      },
      { 
        id: 2, 
        type: 'Vacation', 
        dates: 'Nov 25-29, 2025', 
        status: 'pending', 
        days: 5,
        appliedDate: '2025-11-20',
        reason: 'Family vacation'
      },
      { 
        id: 3, 
        type: 'Personal', 
        dates: 'Dec 5, 2025', 
        status: 'approved', 
        days: 1,
        appliedDate: '2025-11-28',
        reason: 'Doctor appointment'
      }
    ];

    const attendance = generateAttendanceData();
    // Only set if we have new data to avoid infinite loops
    if (JSON.stringify(attendance) !== JSON.stringify(attendanceData)) {
      setAttendanceData(attendance);
    }
    setLeaveRequests(sampleLeaveRequests);
    
    // Generate calendar days with proper alignment
    const calendarDays = generateCalendarDays(attendance, selectedMonth, selectedYear);
    setCalendarDays(calendarDays);
  }, [selectedMonth, selectedYear, attendanceData]);

  // Generate calendar days with proper alignment
  const generateCalendarDays = (attendanceData, month, year) => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ isEmpty: true });
    }

    // Add actual days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateString = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay();
      
      // Find attendance data for this day
      const attendance = attendanceData.find(day => day.date === dateString) || {
        date: dateString,
        day: i,
        status: dayOfWeek === 0 || dayOfWeek === 6 ? 'off' : 'pending',
        checkIn: '-',
        checkOut: '-',
        hours: '0.0',
        remarks: dayOfWeek === 0 || dayOfWeek === 6 ? 'Weekend' : 'Not checked in yet'
      };

      days.push({
        ...attendance,
        isEmpty: false,
        isToday: dateString === new Date().toISOString().split('T')[0]
      });
    }

    return days;
  };

  // Enhanced Break Management with Automatic Timing
  const handleBreakStart = (breakType) => {
    if (breakData[breakType].active) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });

    const breakConfig = breakTypes.find(b => b.id === breakType);
    const breakLimit = breakConfig ? breakConfig.limit : 10;

    // Set auto-end timer
    const autoEndTimer = setTimeout(() => {
      handleBreakEnd(breakType);
      alert(`⏰ ${breakConfig.name} automatically ended after ${breakLimit} minutes`);
    }, breakLimit * 60 * 1000);

    setBreakData(prev => ({
      ...prev,
      [breakType]: {
        ...prev[breakType],
        active: true,
        startTime: now,
        autoEndTimer: autoEndTimer,
        sessions: [...prev[breakType].sessions, { 
          start: now, 
          end: null,
          duration: 0,
          autoEnded: false
        }]
      }
    }));

    // Pause system working time during break
    setBreakStatus(true);

    alert(`🕒 ${breakConfig.name} started at ${timeString}\nAuto-ends in ${breakLimit} minutes`);
  };

  const handleBreakEnd = (breakType) => {
    if (!breakData[breakType].active) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });

    // Clear auto-end timer
    if (breakData[breakType].autoEndTimer) {
      clearTimeout(breakData[breakType].autoEndTimer);
    }

    setBreakData(prev => {
      const breakInfo = prev[breakType];
      const lastSession = breakInfo.sessions[breakInfo.sessions.length - 1];
      
      if (lastSession && !lastSession.end) {
        const duration = (now - lastSession.start) / (1000 * 60); // duration in minutes
        const updatedSessions = [...breakInfo.sessions];
        updatedSessions[updatedSessions.length - 1] = { 
          ...lastSession, 
          end: now, 
          duration: Math.round(duration)
        };
        
        return {
          ...prev,
          [breakType]: {
            ...breakInfo,
            active: false,
            startTime: null,
            autoEndTimer: null,
            totalDuration: breakInfo.totalDuration + duration,
            sessions: updatedSessions
          }
        };
      }
      
      return prev;
    });

    // Resume system working time after break
    setBreakStatus(false);

    const breakConfig = breakTypes.find(b => b.id === breakType);
    alert(`✅ ${breakConfig.name} ended at ${timeString}`);
  };

  // System Attendance - Manual Check-in/Check-out (CRM)
  const handleSystemCheckInWrapper = async () => {
    if (!canCheckIn()) return;
    
    setIsLoading(true);
    
    try {
      const result = await handleSystemCheckIn();
      alert(`✅ System Check-in successful at ${result.timeString}${result.isLate ? ' (Late)' : ''}`);
    } catch (error) {
      alert('❌ Failed to check in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSystemCheckOutWrapper = async () => {
    if (!canCheckOut()) return;
    
    setIsLoading(true);
    
    try {
      const result = await handleSystemCheckOut();
      alert(`✅ System Check-out successful at ${result.timeString}\nTotal hours: ${result.hours}`);
    } catch (error) {
      alert('❌ Failed to check out. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Format time for display
  const formatTime = (date) => {
    if (!date) return '-';
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Format duration for display
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Format hours for display
  const formatHours = (minutes) => {
    const hours = (minutes / 60).toFixed(1);
    return `${hours}h`;
  };

  // Check if employee can check in
  const canCheckIn = () => {
    const todayStatus = getTodayStatus();
    return todayStatus.checkIn === '-' && !isLoading;
  };

  // Check if employee can check out
  const canCheckOut = () => {
    const todayStatus = getTodayStatus();
    return todayStatus.checkIn !== '-' && todayStatus.checkOut === '-' && !isLoading;
  };

  // Get check-in button text and status
  const getCheckInButtonInfo = () => {
    const todayStatus = getTodayStatus();
    if (isLoading) return { text: 'Processing...', icon: <RefreshCw className="h-4 w-4 animate-spin mr-2" /> };
    if (todayStatus.checkIn !== '-') return { text: `Checked In: ${todayStatus.checkIn}`, icon: <CheckCircle className="h-4 w-4 mr-2" /> };
    return { text: 'Check In', icon: <LogIn className="h-4 w-4 mr-2" /> };
  };

  // Get check-out button text and status
  const getCheckOutButtonInfo = () => {
    const todayStatus = getTodayStatus();
    if (isLoading) return { text: 'Processing...', icon: <RefreshCw className="h-4 w-4 animate-spin mr-2" /> };
    if (todayStatus.checkOut !== '-') return { text: `Checked Out: ${todayStatus.checkOut}`, icon: <CheckCircle className="h-4 w-4 mr-2" /> };
    return { text: 'Check Out', icon: <LogOut className="h-4 w-4 mr-2" /> };
  };

  const checkInButtonInfo = getCheckInButtonInfo();
  const checkOutButtonInfo = getCheckOutButtonInfo();

  // Handle leave application form
  const [leaveForm, setLeaveForm] = useState({
    type: 'Sick Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const handleApplyLeave = () => {
    setShowLeaveModal(true);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setLeaveForm(prev => ({
      ...prev,
      startDate: tomorrow.toISOString().split('T')[0],
      endDate: tomorrow.toISOString().split('T')[0]
    }));
  };

  // Handle leave form submission
  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    
    if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason) {
      alert('Please fill in all required fields');
      return;
    }

    const startDate = new Date(leaveForm.startDate);
    const endDate = new Date(leaveForm.endDate);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    const newLeave = {
      id: leaveRequests.length + 1,
      type: leaveForm.type,
      dates: `${formatDate(startDate)} - ${formatDate(endDate)}`,
      status: 'pending',
      days: days,
      appliedDate: new Date().toISOString().split('T')[0],
      reason: leaveForm.reason
    };
    
    setLeaveRequests(prev => [newLeave, ...prev]);
    setShowLeaveModal(false);
    setLeaveForm({
      type: 'Sick Leave',
      startDate: '',
      endDate: '',
      reason: ''
    });
    
    alert('📝 Leave application submitted for approval');
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Handle data export
  const handleExportData = () => {
    const stats = getAttendanceStats();
    const workingHoursSummary = calculateWorkingHoursSummary();
    
    const exportData = {
      employee: employee,
      period: `${selectedMonth + 1}/${selectedYear}`,
      attendance: attendanceData,
      leaveRequests: leaveRequests,
      statistics: stats,
      breakData: breakData,
      systemAttendance: systemAttendance,
      machineAttendance: machineAttendance,
      workingHoursSummary: workingHoursSummary
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance-${employee.name}-${selectedMonth+1}-${selectedYear}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('📊 Attendance data exported successfully!');
  };

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'system':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleSystemCheckInWrapper}
                disabled={!canCheckIn()}
                className={`flex items-center justify-center p-4 rounded-xl border transition duration-300 group ${
                  canCheckIn() 
                    ? 'bg-green-50 border-green-200 hover:border-green-400 hover:bg-green-100 text-green-700' 
                    : getTodayStatus().checkIn !== '-'
                    ? 'bg-green-100 border-green-300 text-green-800 cursor-default'
                    : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {checkInButtonInfo.icon}
                <span className="text-sm font-medium">{checkInButtonInfo.text}</span>
              </button>
              
              <button 
                onClick={handleSystemCheckOutWrapper}
                disabled={!canCheckOut()}
                className={`flex items-center justify-center p-4 rounded-xl border transition duration-300 group ${
                  canCheckOut() 
                    ? 'bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-100 text-blue-700' 
                    : getTodayStatus().checkOut !== '-'
                    ? 'bg-blue-100 border-blue-300 text-blue-800 cursor-default'
                    : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {checkOutButtonInfo.icon}
                <span className="text-sm font-medium">{checkOutButtonInfo.text}</span>
              </button>
            </div>
            
            {/* Working Time Display */}
            {systemAttendance.checkedIn && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-700 font-medium">Current Session:</span>
                  <span className="text-blue-900 font-bold">
                    {formatDuration(systemAttendance.totalWorkingTime)}
                  </span>
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  {systemAttendance.isOnBreak ? '⏸️ Time paused for break' : '⏱️ Time tracking active'}
                </div>
              </div>
            )}
            
            <div className="text-xs text-gray-500 text-center">
              Manual system check-in/check-out from CRM
            </div>
          </div>
        );

      case 'machine':
        return (
          <div className="space-y-4">
            {/* Machine Attendance Status Display Only - No Buttons */}
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <div className="text-center mb-4">
                <Fingerprint className="h-12 w-12 text-purple-500 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-purple-900">Machine Attendance</h3>
                <p className="text-sm text-purple-600">Automatically recorded from attendance device</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-700">Status:</span>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    machineAttendance.checkedIn 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}>
                    {machineAttendance.checkedIn ? 'Checked In' : 'Not Checked In'}
                  </span>
                </div>
                
                {machineAttendance.checkInTime && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-700">Check In Time:</span>
                    <span className="text-sm font-medium text-purple-900">
                      {formatTime(machineAttendance.checkInTime)}
                    </span>
                  </div>
                )}
                
                {machineAttendance.checkOutTime && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-700">Check Out Time:</span>
                    <span className="text-sm font-medium text-purple-900">
                      {formatTime(machineAttendance.checkOutTime)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-700">Device:</span>
                  <span className="text-sm font-medium text-purple-900">
                    {machineAttendance.deviceId || 'Not connected'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-700">Location:</span>
                  <span className="text-sm font-medium text-purple-900">
                    {machineAttendance.location || 'Main Entrance'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 text-center">
              Attendance data automatically synced from biometric/RFID device
            </div>
          </div>
        );

      case 'breaks':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {breakTypes.map((breakType) => (
                <div key={breakType.id} className="flex flex-col space-y-2">
                  <button 
                    onClick={() => handleBreakStart(breakType.id)}
                    disabled={breakData[breakType.id].active || isLoading}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition duration-300 group ${
                      breakData[breakType.id].active
                        ? `${breakType.activeColor} text-white border-transparent`
                        : `${breakType.color} bg-opacity-10 text-${breakType.color.split('-')[1]}-700 border-${breakType.color.split('-')[1]}-200 hover:border-${breakType.color.split('-')[1]}-400`
                    }`}
                  >
                    <breakType.icon className="h-5 w-5 mb-1" />
                    <span className="text-xs font-medium text-center">
                      {breakData[breakType.id].active ? 'Active' : `Start ${breakType.name}`}
                    </span>
                    <span className="text-xs opacity-75 mt-1">{breakType.limit}m auto</span>
                  </button>
                  
                  <button 
                    onClick={() => handleBreakEnd(breakType.id)}
                    disabled={!breakData[breakType.id].active || isLoading}
                    className={`flex items-center justify-center p-2 rounded-xl border transition duration-300 group text-xs ${
                      !breakData[breakType.id].active
                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-400 text-gray-700'
                    }`}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    End Now
                  </button>
                </div>
              ))}
            </div>
            
            {/* Break Summary */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Today's Break Summary</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {breakTypes.map((breakType) => (
                  <div key={breakType.id} className="flex justify-between items-center">
                    <span className="text-gray-600">{breakType.name}:</span>
                    <span className="font-medium">
                      {formatDuration(breakData[breakType.id].totalDuration)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center col-span-2 pt-2 border-t border-gray-200">
                  <span className="text-gray-800 font-medium">Total Break Time:</span>
                  <span className="font-bold text-gray-900">
                    {formatDuration(calculateTotalBreakTime())}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const workingHoursSummary = calculateWorkingHoursSummary();
  const stats = getAttendanceStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-6 relative overflow-hidden">
      {/* Leave Application Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Apply for Leave</h3>
              <button 
                onClick={() => setShowLeaveModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition duration-200"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleLeaveSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leave Type
                </label>
                <select 
                  value={leaveForm.type}
                  onChange={(e) => setLeaveForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {leaveTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input 
                    type="date"
                    value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input 
                    type="date"
                    value={leaveForm.endDate}
                    onChange={(e) => setLeaveForm(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min={leaveForm.startDate}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Leave *
                </label>
                <textarea 
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm(prev => ({ ...prev, reason: e.target.value }))}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Please provide a reason for your leave application..."
                  required
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="flex-1 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subtle Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-sky-100 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse animation-delay-2000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Attendance</h1>
            <p className="text-gray-600">Track your attendance, leaves, and working hours</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900">{currentTime.toLocaleDateString()}</div>
            <div className="text-sm text-gray-600">{currentTime.toLocaleTimeString()}</div>
          </div>
        </div>

        {/* Working Hours Calculation Summary */}
        {systemAttendance.checkedIn && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-500" />
                Working Hours Calculation
              </h2>
              <div className="text-sm text-gray-500">Today's Summary</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Gross Working Time */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-blue-900">Gross Working Time</h3>
                  <Clock className="h-4 w-4 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  {formatHours(workingHoursSummary.grossWorkingTime)}
                </div>
                <p className="text-xs text-blue-700 mt-1">
                  {formatDuration(workingHoursSummary.grossWorkingTime)}
                </p>
              </div>

              {/* Total Break Time */}
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-orange-900">Total Break Time</h3>
                  <Coffee className="h-4 w-4 text-orange-500" />
                </div>
                <div className="text-2xl font-bold text-orange-900">
                  {formatHours(workingHoursSummary.totalBreakTime)}
                </div>
                <p className="text-xs text-orange-700 mt-1">
                  {formatDuration(workingHoursSummary.totalBreakTime)}
                </p>
              </div>

              {/* Net Working Time */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-green-900">Net Working Time</h3>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-green-900">
                  {formatHours(workingHoursSummary.netWorkingTime)}
                </div>
                <p className="text-xs text-green-700 mt-1">
                  {formatDuration(workingHoursSummary.netWorkingTime)}
                </p>
              </div>

              {/* Efficiency */}
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-purple-900">Efficiency</h3>
                  <CheckCircle className="h-4 w-4 text-purple-500" />
                </div>
                <div className="text-2xl font-bold text-purple-900">
                  {workingHoursSummary.efficiency}%
                </div>
                <p className="text-xs text-purple-700 mt-1">
                  Productive time ratio
                </p>
              </div>
            </div>

            {/* Calculation Breakdown */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Calculation Breakdown</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Gross Working Time:</span>
                  <span className="font-medium">{formatHours(workingHoursSummary.grossWorkingTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Break Time:</span>
                  <span className="font-medium text-orange-600">- {formatHours(workingHoursSummary.totalBreakTime)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-1">
                  <span className="font-medium">Net Working Time:</span>
                  <span className="font-bold text-green-600">{formatHours(workingHoursSummary.netWorkingTime)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* System Attendance Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-blue-500" />
                System Attendance (CRM)
              </h3>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                systemAttendance.checkedIn ? 'bg-green-100 text-green-800 border border-green-200' :
                'bg-gray-100 text-gray-800 border border-gray-200'
              }`}>
                {systemAttendance.checkedIn ? 'Checked In' : 'Not Checked In'}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Check In Time:</span>
                <span className="text-sm font-medium text-gray-900">
                  {systemAttendance.checkInTime ? formatTime(systemAttendance.checkInTime) : '-'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Check Out Time:</span>
                <span className="text-sm font-medium text-gray-900">
                  {systemAttendance.checkOutTime ? formatTime(systemAttendance.checkOutTime) : '-'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Working Time:</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDuration(systemAttendance.totalWorkingTime)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  systemAttendance.status === 'present' ? 'bg-green-100 text-green-800' :
                  systemAttendance.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {systemAttendance.status?.charAt(0).toUpperCase() + systemAttendance.status?.slice(1) || 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Machine Attendance Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Fingerprint className="h-5 w-5 text-green-500" />
                Machine Attendance
              </h3>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                machineAttendance.checkedIn ? 'bg-green-100 text-green-800 border border-green-200' :
                'bg-gray-100 text-gray-800 border border-gray-200'
              }`}>
                {machineAttendance.checkedIn ? 'Checked In' : 'Not Checked In'}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Check In Time:</span>
                <span className="text-sm font-medium text-gray-900">
                  {machineAttendance.checkInTime ? formatTime(machineAttendance.checkInTime) : '-'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Check Out Time:</span>
                <span className="text-sm font-medium text-gray-900">
                  {machineAttendance.checkOutTime ? formatTime(machineAttendance.checkOutTime) : '-'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Device ID:</span>
                <span className="text-sm font-medium text-gray-900">
                  {machineAttendance.deviceId || '-'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Location:</span>
                <span className="text-sm font-medium text-gray-900">
                  {machineAttendance.location || '-'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Attendance Percentage */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Attendance</h3>
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.attendancePercentage}%</div>
            <p className="text-sm text-gray-600 mt-1">
              {stats.present} of {stats.workingDays} days
            </p>
          </div>

          {/* Present Days */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Present</h3>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.present}</div>
            <p className="text-sm text-green-600 mt-1 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Full working days
            </p>
          </div>

          {/* Leaves */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Leaves Taken</h3>
              <Calendar className="h-5 w-5 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">2</div>
            <p className="text-sm text-orange-600 mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              1 pending
            </p>
          </div>

          {/* Absent/Late */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Absent/Late</h3>
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.absent + stats.late}</div>
            <p className="text-sm text-red-600 mt-1">
              {stats.absent} absent, {stats.late} late
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Monthly Calendar & Graph */}
          <div className="lg:col-span-2 space-y-6">
            {/* Calendar */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  {new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long', year: 'numeric' })} Calendar
                </h2>
                <div className="flex items-center space-x-2">
                  <select 
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i}>
                        {new Date(selectedYear, i).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                  <select 
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[2024, 2025, 2026].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
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
                {calendarDays.map((dayData, index) => {
                  if (dayData.isEmpty) {
                    return (
                      <div 
                        key={`empty-${index}`} 
                        className="text-center p-2 rounded-lg border border-transparent text-sm"
                      >
                        {/* Empty cell */}
                      </div>
                    );
                  }

                  return (
                    <div 
                      key={dayData.date} 
                      className={`
                        text-center p-2 rounded-lg border text-sm font-medium cursor-pointer transition-all relative
                        ${dayData.isToday ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
                        ${dayData.status === 'present' ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' :
                          dayData.status === 'late' ? 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100' :
                          dayData.status === 'halfday' ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' :
                          dayData.status === 'absent' ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100' :
                          dayData.status === 'pending' ? 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200' :
                          'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                        }
                      `}
                      title={`${dayData.date}\nStatus: ${dayData.status}\nCheck-in: ${dayData.checkIn}\nCheck-out: ${dayData.checkOut}\nHours: ${dayData.hours}\nRemarks: ${dayData.remarks}`}
                    >
                      {dayData.day}
                      {dayData.isToday && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                  Present
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
                  Late
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                  Half Day
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                  Absent
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-400 rounded mr-2"></div>
                  Off
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Actions Panel */}
          <div className="space-y-6">
            {/* Attendance Type Tabs */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex space-x-1 mb-4">
                {[
                  { id: 'system', name: 'System', icon: UserCheck },
                  { id: 'machine', name: 'Machine', icon: Fingerprint },
                  { id: 'breaks', name: 'Breaks', icon: Coffee }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center p-2 rounded-lg text-xs font-medium transition duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="h-3 w-3 mr-1" />
                    {tab.name}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeAttendancePage;