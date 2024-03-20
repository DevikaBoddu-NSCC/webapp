const { configDotenv } = require('dotenv');
const { createLogger, format, transports, config } = require('winston');
const { combine, timestamp, json } = format;
require('dotenv').config();
console.log(process.env)
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
   transports: [
    new transports.Console(),
       new transports.File({ filename: 'webapp.log', dirname : process.env.LOGPATH ?? './log' })
     ]
});
module.exports = logger;


