import knex from 'knex';
import * as configuration from './knexfile';
import dotenv from 'dotenv';
dotenv.config();
import config from 'config';

const connection = knex(configuration);
export const raw = async ({ query }: { query: string }) => {
    const data = await connection.raw(query);
    return data.rows;
}
const connectAndQueryT = async (): Promise<void> => {
    try {
        const result = await connection.raw('SELECT 1+1 as result');
    } catch (e) {
        console.error(`Error in Db connection : ${e}`);
    }

}
connectAndQueryT();
export default connection;
