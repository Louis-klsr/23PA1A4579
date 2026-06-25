require("dotenv").config();
const axios = require("axios");

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

console.log("TOKEN:", process.env.ACCESS_TOKEN);
console.log("TOKEN LENGTH:", process.env.ACCESS_TOKEN?.length);


async function Log(stack, level, packageName, message) {
  try {
    const response = await axios.post(
      "http://4.224.186.213/evaluation-service/logs",
      {
        stack,
        level,
        package: packageName,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Log Created:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Logging Failed:",
      error.response?.data || error.message
    );
  }
}

module.exports = Log;