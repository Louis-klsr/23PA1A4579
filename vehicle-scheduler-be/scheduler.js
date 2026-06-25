function scheduleVehicles(vehicles, mechanicHours) {
  const n = vehicles.length;

  const dp = Array.from(
    { length: n + 1 },
    () => Array(mechanicHours + 1).fill(0)
  );

  for (let i = 1; i <= n; i++) {
    const duration = vehicles[i - 1].Duration;
    const impact = vehicles[i - 1].Impact;

    for (let h = 0; h <= mechanicHours; h++) {
      if (duration <= h) {
        dp[i][h] = Math.max(
          impact + dp[i - 1][h - duration],
          dp[i - 1][h]
        );
      } else {
        dp[i][h] = dp[i - 1][h];
      }
    }
  }

  const selected = [];
  let h = mechanicHours;

  for (let i = n; i > 0; i--) {
    if (dp[i][h] !== dp[i - 1][h]) {
      selected.push(vehicles[i - 1]);
      h -= vehicles[i - 1].Duration;
    }
  }

  return {
    totalImpact: dp[n][mechanicHours],
    selectedVehicles: selected.reverse()
  };
}

module.exports = scheduleVehicles;