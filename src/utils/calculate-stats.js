const calculateStats = (oldStats, success, responseTime, interval) => {
  const newStats = {
    lastStatus: success,
    consecutiveFailures: success ? 0 : oldStats.consecutiveFailures + 1,
    passedChecks: oldStats.passedChecks + success,
    totalChecks: oldStats.totalChecks + 1,
    upTime: (oldStats.totalChecks !== 0 ?
       (oldStats.upTime + (success ? interval : 0)) : 0),
    totalTime: (oldStats.totalChecks !== 0 ?
       (oldStats.totalTime + interval) : 0),
    avgResponseTime:
      (oldStats.avgResponseTime * oldStats.totalChecks + responseTime) /
      (oldStats.totalChecks + 1)
  };
  return newStats;
};

module.exports = calculateStats;