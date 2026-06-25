const Log = require("./logger");

async function run() {
  await Log(
    "backend",
    "info",
    "handler",
    "Application started"
  );

  await Log(
    "backend",
    "error",
    "db",
    "Critical database connection failure."
  );
}

run();