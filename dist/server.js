"use strict";
// src/server.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const app = (0, express_1.default)();
const port = config_1.default.get('port');
;
// Home route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});
// About route
app.get('/about', (req, res) => {
    res.send('About Page');
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
