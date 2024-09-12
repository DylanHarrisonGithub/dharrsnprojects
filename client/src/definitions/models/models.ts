import { Schema } from '../../services/validation.service';
import UserModel, { User } from './User/User';
import MailModel, { Mail } from './Mail/Mail';
import ContactModel, { Contact } from './Contact/Contact';

import { dbTypes } from "../data/data";

const unionRegex = (...regexes: RegExp[]) => new RegExp(regexes.map(regex => regex.source).join("|"));

export type Model = {
  db?: { PRIMARY: `KEY (${string})` } | { [key: string]: typeof dbTypes[number] } & { PRIMARY: any }
  schema: Schema
}

export type ModelTypes = {
  User: User,
  Mail: Mail,
  Contact: Contact
}

const ServerModels: { [key: string]: Model } = {
  user: UserModel,
  mail: MailModel,
  contact: ContactModel
}

export default ServerModels;
