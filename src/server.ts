// src/server.ts

import express, { Request, Response } from 'express';
import config from 'config';
import db from './knexDb/db';
import routes from './routes';

const app = express();
const port = config.get<number>('port');;

const testConnection = async () => {
    try {
        // Perform a simple query to check the connection
        await db.raw('SELECT 1+1 AS result');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    } finally {
        // Close the database connection
        await db.destroy();
    }
}
// Home route
app.use(express.json());
app.use(routes);

// Start the server
app.listen(port, () => {
    testConnection();
    console.log(`Server is running on http://localhost:${port}`);
});
