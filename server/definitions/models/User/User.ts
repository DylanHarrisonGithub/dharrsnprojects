import { Model } from '../models';
import Schemas from '../../schemas/schemas'
import { Schema, COMMON_REGEXES } from '../../../services/validation/validation.service';

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

const UserModel: Model = {

  db: {
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

  schema: {
    ...(({ id, username, email, password, otp, privilege }) => ({ id, username, email, password, otp, privilege }))(Schemas),
    avatar: Schemas.imageFilename
  },

};

const map: (user: Partial<User>) => { [K in keyof typeof UserModel.db]: string | number } = (user) => ({
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
})


export default UserModel;