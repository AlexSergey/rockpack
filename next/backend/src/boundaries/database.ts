import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  define: {
    timestamps: false
  }
});

export const start = async (): Promise<void> => await sequelize.authenticate();

export const stop = async (): Promise<void> => await sequelize.close();
