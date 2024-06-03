"use strict";
// src/server.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const db_1 = __importDefault(require("./knexDb/db"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
const port = config_1.default.get('port');
;
const testConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Perform a simple query to check the connection
        yield db_1.default.raw('SELECT 1+1 AS result');
    }
    catch (error) {
        console.error('Error connecting to the database:', error);
    }
    finally {
        // Close the database connection
        yield db_1.default.destroy();
    }
});
// Home route
app.use(express_1.default.json());
app.use(routes_1.default);
// Start the server
app.listen(port, () => {
    testConnection();
    console.log(`Server is running on http://localhost:${port}`);
});
