import { knex, type Knex } from 'knex';
import config from 'config';
import dotenv from 'dotenv';
dotenv.config();

const configuration: any = {
    client: 'pg',
    connection: {
        connectionString: process.env.DB_HOST,
        ssl: {
            rejectUnauthorized: false
        }
    },
    pool: {
        min: 2,
        max: 10,
        afterCreate: (conn: { query: (arg0: string, arg1: (err: any) => void) => void; }, done: (arg0: null, arg1: any) => void) => {
            // Example: Setting a PostgreSQL parameter
            conn.query('SET timezone="UTC";', (err) => {
                if (err) {
                    // If there is an error setting the parameter, pass it to the callback
                    done(err, conn);
                } else {
                    done(null, conn);
                }
            });
        }
    },
    migrations: {
        directory: '../migrations'
    },
};

const connectAndQuery = async (): Promise<void> => {
    const db = knex(configuration);
    try {
        const result = await db.raw('SELECT 1+1 as result');
        console.log('Database Connection Successful!!!');
    } catch (e) {
        console.error(`Error in Db connection : ${e}`);
    } finally {
        db.destroy();
    }
}

connectAndQuery();

module.exports = {
    ...configuration
};
