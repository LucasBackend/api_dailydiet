import { knex as setupKnex, Knex } from 'knex';
import { env } from './env';

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection: env.DATABASE_CLIENT === 'sqlite'
    ? {
        filename: env.DATABASE_URL
      }
    : env.DATABASE_URL,
  pool: env.DATABASE_CLIENT === 'sqlite'
    ? {
        afterCreate: (conn, cb) => conn.run('PRAGMA foreign_keys = ON', cb)
      }
    : {
        min: 2,
        max: 10,
      },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './database/migrations',
  },
};

export const knex = setupKnex(config);