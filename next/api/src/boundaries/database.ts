import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  define: {
    timestamps: false,
  },
  dialect: process.env.DATABASE_DIALECT as 'mysql' | 'sqlite',
  host: process.env.DB_HOST,

  logging: process.env.DB_LOGGING === '1' ? console.log : false,
  port: Number(process.env.DB_PORT),
});

export const start = async (): Promise<void> => await sequelize.authenticate();

export const stop = async (): Promise<void> => await sequelize.close();
