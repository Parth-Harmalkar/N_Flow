import { format } from 'date-fns';

export function exportAttendanceToCSV(data: any[], employeeName: string) {
  if (!data || data.length === 0) return;

  // Header row
  const headers = ['Date', 'Login Time', 'Logout Time', 'Total Time (Hours)', 'Status'];
  
  // Data rows
  const rows = data.map(record => {
    const loginTime = record.login_time ? format(new Date(record.login_time), 'hh:mm a') : 'N/A';
    const logoutTime = record.logout_time ? format(new Date(record.logout_time), 'hh:mm a') : 'N/A';
    const totalTime = record.total_hours ? `${record.total_hours}h` : 'N/A';
    
    return [
      record.date,
      loginTime,
      logoutTime,
      totalTime,
      record.status.toUpperCase()
    ];
  });

  // Combine rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Attendance_${employeeName.replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
