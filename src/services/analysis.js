import { dbReports } from '../services/db';

const ALERT_HOURS = 6;
const ALERT_THRESHOLD = 5;

export const checkRegionalAlerts = () => {
  const reports = dbReports.getAll();
  const now = new Date();
  
  // Filter reports from the last 6 hours
  const recentReports = reports.filter(r => {
    const reportDate = new Date(r.data);
    const diffHours = (now - reportDate) / (1000 * 60 * 60);
    return diffHours <= ALERT_HOURS;
  });

  // Count by neighborhood
  const counts = {};
  recentReports.forEach(r => {
    counts[r.bairro] = (counts[r.bairro] || 0) + 1;
  });

  // Find neighborhoods exceeding threshold
  const criticalNeighborhoods = Object.keys(counts).filter(
    bairro => counts[bairro] >= ALERT_THRESHOLD
  );

  return criticalNeighborhoods;
};

// Also calculate Top 10 for ranking
export const getTop10Neighborhoods = () => {
    const reports = dbReports.getAll();
    const counts = {};
    reports.forEach(r => {
      counts[r.bairro] = (counts[r.bairro] || 0) + 1;
    });
  
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([bairro, count]) => ({ bairro, count }));
};
