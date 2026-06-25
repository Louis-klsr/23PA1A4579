require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const scheduleVehicles = require("./scheduler");

const BASE_URL =
  "http://4.224.186.213/evaluation-service";

const headers = {
  Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
};

async function main() {
  try {
    const depotsRes = await axios.get(
      `${BASE_URL}/depots`,
      { headers }
    );

    const vehiclesRes = await axios.get(
      `${BASE_URL}/vehicles`,
      { headers }
    );

    const depots = depotsRes.data.depots;
    const vehicles = vehiclesRes.data.vehicles;

    const result = [];

    for (const depot of depots) {
      const schedule = scheduleVehicles(
        vehicles,
        depot.MechanicHours
      );

      result.push({
        depotID: depot.ID,
        mechanicHours: depot.MechanicHours,
        totalImpact: schedule.totalImpact,
        selectedTasks:
          schedule.selectedVehicles.map(
            v => v.TaskID
          )
      });
    }

    fs.writeFileSync(
      "output.json",
      JSON.stringify(result, null, 2)
    );

    console.log(result);
  } catch (err) {
    console.error(
      err.response?.data || err.message
    );
  }
}

main();