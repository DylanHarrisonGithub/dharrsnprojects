import { Model } from '../models';
import Schemas from '../../schemas/schemas';
import { Schema, COMMON_REGEXES } from '../../../services/validation/validation.service';

export type Mail = {
  id: number,
  email: string,
  code: string,
  salt: string,
  verified: string
}

const MailModel: Model = {
  db: {
    id: `SERIAL`,
    email: `TEXT`,
    code: `TEXT`,
    salt: `TEXT`,
    verified: `TEXT`,
    PRIMARY: `KEY (id)`
  },
  schema: {
    email: Schemas.email
  }
}

export default MailModel;