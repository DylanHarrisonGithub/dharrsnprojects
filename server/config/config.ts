import path from 'path';
import crypto from 'crypto';

const secret = crypto.randomBytes(64).toString('hex');

const appName = `dharrsnprojects`;

const config = {
  APPNAME: appName,
  APPURL: process.env[`${appName.toUpperCase()}_URL`] || `${appName}.com`,
  SERVER_SECRET: process.env[`${appName.toUpperCase()}_SERVER_SECRET`] || secret,
  DATABASE_URL: process.env[`${appName.toUpperCase()}_DATABASE_URL`] || '',
  ENVIRONMENT: process.env.NODE_ENV?.toUpperCase() || 'DEVELOPMENT',
  SOCKET_CONNECT_PRIVELEGE: ['guest', 'user', 'admin'],
  ROOT_DIR: path.normalize(__dirname + `/../../`),
  PORT: process.env[`${appName.toUpperCase()}_PORT`] || 3000,
  ROOT_URL: '/',
  ERROR_URL: '/error',
  NODEMAILER: {
    EMAIL: process.env[`${appName.toUpperCase()}_NODEMAILER_EMAIL`] || '',
    PASSWORD: process.env[`${appName.toUpperCase()}_NODEMAILER_PASSWORD`] || ''
  },
  ADMIN_EMAIL: process.env[`${appName.toUpperCase()}_ADMIN_EMAIL`] || '',
  MAX_HD_SIZE_GB: process.env[`${appName.toUpperCase()}_MAX_HD_SIZE_GB`] || 20,
  REPOSITORY: {
    URL: process.env[`${appName.toUpperCase()}_REPO_URL`],
    BRANCH: process.env[`${appName.toUpperCase()}_REPO_BRANCH`] || 'main',
    PAT: process.env[`${appName.toUpperCase()}_REPO_PAT`],
    SECRET: process.env[`${appName.toUpperCase()}_REPO_SECRET`]
  }
};

export default config;