import { COMMON_REGEXES, Schema } from "../../services/validation/validation.service";

const imageFileRegex = /^(.*\/)?([^\/]+\.(jpg|jpeg|png|gif|bmp|webp|svg))$/i; //optionally beginning with a path ..
const videoFileRegex = /^(.*\/)?([^\/]+\.(mov|mpeg|mp4|webm|ogg))$/i;
const audioFileRegex = /^(.*\/)?([^\/]+\.(mp3|wav|ogg|aac))$/i;
const fileRegex = /^\/?(?:[\w\-\.\s\[\]\(\)]+\/)*[\w\-\.\s\[\]\(\]]+$/;
const usernameRegex = /^[a-zA-Z0-9][a-zA-Z0-9_-]*[a-zA-Z0-9]$/;
const dbSafeString = /^[a-zA-Z0-9\s\-_.,]*$/;

const Schemas: Schema = {
  email: { type: COMMON_REGEXES.EMAIL, attributes: { required: true, strLength: { minLength: 5, maxLength: 63 }}},
  filename: { type: fileRegex, attributes: { required: true, range: { min: 1, max: 255 }}},
  imageFilename: { type: imageFileRegex, attributes: { required: true, range: { min: 1, max: 255 }}},
  videoFilename: { type: videoFileRegex, attributes: { required: true, range: { min: 1, max: 255 }}},
  audioFilename: { type: audioFileRegex, attributes: { required: true, range: { min: 1, max: 255 }}},
  id: { type: 'string | number', attributes: { required: true, range: { min: 0 } }},
  password: { type: 'string', attributes: { required: true, strLength: { minLength: 8, maxLength: 255 }}},
  username: { type: usernameRegex, attributes: { required: true, strLength: { minLength: 6, maxLength: 63 }}},
  otp: { type: 'string', attributes: { required: true, strLength: { minLength: 0, maxLength: 128 }}},
  sentence: { type: COMMON_REGEXES.COMMON_WRITING, attributes: { required: true, strLength: { minLength: 1, maxLength: 128 }}},
  paragraph: { type: COMMON_REGEXES.COMMON_WRITING, attributes: { required: true, strLength: { minLength: 1, maxLength: 1024 }}},
  dbSafeString: { type: dbSafeString, attributes: { required: true, strLength: { minLength: 1, maxLength: 1024 }}},
  privilege: { type: ['guest', 'user', 'admin'], attributes: { required: true }}
};

export default Schemas;