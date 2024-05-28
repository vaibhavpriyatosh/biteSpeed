// src/server.ts

import express, { Request, Response } from 'express';
import config from 'config';

const app = express();
const port = config.get<number>('port');;

// Home route
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

// About route
app.get('/about', (req: Request, res: Response) => {
    res.send('About Page');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
