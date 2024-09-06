import { Schema } from "../services/validation.service";

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
  times: [...[...Array(24).keys()].reduce<string[]>((a,h)=> [
    ...a, 
    `${(h%12 || 12).toString().padStart(2,'0')}:00${h < 12 ? 'am' : 'pm'}`,
    `${(h%12 || 12).toString().padStart(2,'0')}:15${h < 12 ? 'am' : 'pm'}`,
    `${(h%12 || 12).toString().padStart(2,'0')}:30${h < 12 ? 'am' : 'pm'}`,
    `${(h%12 || 12).toString().padStart(2,'0')}:45${h < 12 ? 'am' : 'pm'}`,
  ], [])] as const
};

const { periods, weekdays, months, daysPerMonth, years, dates, times } = timeData;

export type User = {
  id: number,
  username: string, 
  privilege: string,
  avatar: string,
}

export type Contact = {
  id: number,
  email: string,
  subject: string,
  message: string,
  timestamp: number,
  search: string
}

export type Mail = {
  id: number,
  email: string,
  // code: string,
  // salt: string,
  verified: string
}

export type Theme = {
  id: number,
}

export const themeSchema: Schema = {
  id: { type: 'string | number', attributes: { required: false }},
}

export const defaultTheme: Theme = {
  id: -1,
}