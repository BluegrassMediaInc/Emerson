import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const logError = (controllerName, error) => {
    // Move one step back to the backend root directory
    const logFilePath = path.join(__dirname, '..', 'error.log');

    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} [${controllerName}] ${error?.stack || error?.message}\n`;

    // Append the error log to error.log file
    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) console.error('Failed to write error log:', err);
    });

    console.error(`[${controllerName} ERROR]:`, error.message);
};