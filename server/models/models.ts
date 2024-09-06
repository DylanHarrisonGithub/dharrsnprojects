import { Schema } from "../services/validation/validation.service";

export const acceptedMediaExtensions = {
  image: ['.gif', '.jpg', '.jpeg', '.png', '.heic'],
  video: ['.mov', '.mp4', '.mpeg', '.webm', '.ogg'],
  audio: ['.mp3', '.wav', '.ogg']
};

export const timeData = {
  periods: [ 'Once', 'Daily', 'Weekly', 'BiWeekly', 'Monthly' ] as const,
  weekdays: [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' 
  ] as const,
  months: [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ] as const,
  daysPerMonth: [
    31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
  ] as const,
  years: [...[...Array(40).keys()].map(y => y+2020)] as const,
  dates: [...Array(32).keys()] as const,
  times: [...[...Array(24).keys()].reduce<string[]>((a,h)=> [ //should be 24
    ...a, 
    `${(h%12 || 12).toString().padStart(2,'0')}:00${h < 12 ? 'am' : 'pm'}`,
    `${(h%12 || 12).toString().padStart(2,'0')}:15${h < 12 ? 'am' : 'pm'}`,
    `${(h%12 || 12).toString().padStart(2,'0')}:30${h < 12 ? 'am' : 'pm'}`,
    `${(h%12 || 12).toString().padStart(2,'0')}:45${h < 12 ? 'am' : 'pm'}`,
  ], [])] as const
};

const { periods, weekdays, months, daysPerMonth, years, dates, times } = timeData;

export const defaultTheme: Theme = {
  id: -1,
}

export type User = {
  id: number,
  username: string,
  email: string,
  password: string,
  salt: string,
  privilege: string,
  avatar: string,
  reset: string,
  resetstamp: string,
  tries: number
}

export type Contact = {
  id: number,
  timestamp: number,
  email: string,
  subject: string,
  message: string,
  search: string
}

export type Mail = {
  id: number,
  email: string,
  code: string,
  salt: string,
  verified: string
}

export type Theme = {
  id: number,
}

export const themeSchema: Schema = {
  id: { type: 'string | number', attributes: { required: false }}
}

const models = {
  user: { 
    id: `SERIAL`,
    username: 'TEXT',
    email: `TEXT`,
    password: 'TEXT',
    salt: 'TEXT',
    privilege: `TEXT`,
    avatar: `TEXT`,
    reset: `TEXT`,
    resetstamp: `TEXT`,
    tries: `NUMERIC`,
    PRIMARY: 'KEY (username)' 
  },
  contact: {
    id: `SERIAL`,
    timestamp: `NUMERIC`,
    email: `TEXT`,
    subject: `TEXT`,
    message: `TEXT`,
    search: `TEXT`,
    PRIMARY: `KEY (id)`
  },
  mail: {
    id: `SERIAL`,
    email: `TEXT`,
    code: `TEXT`,
    salt: `TEXT`,
    verified: `TEXT`,
    PRIMARY: `KEY (id)`
  },
  theme: {
    id: `SERIAL`,
  }

};

export default models;