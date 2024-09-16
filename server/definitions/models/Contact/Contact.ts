import { Model } from '../models';
import Schemas from '../../schemas/schemas';
import { Schema, COMMON_REGEXES } from '../../../services/validation/validation.service';

export type Contact = {
  id: number,
  timestamp: number,
  email: string,
  subject: string,
  message: string,
  search: string
}

const ContactModel: Model = {
  db: {
    id: `SERIAL`,
    timestamp: `NUMERIC`,
    email: `TEXT`,
    subject: `TEXT`,
    message: `TEXT`,
    search: `TEXT`,
    PRIMARY: `KEY (id)`,
  },
  schema: {
    ...(({ id, email }) => ({ id, email }))(Schemas),
    subject: Schemas.sentence,
    message: Schemas.paragraph,
    afterID: Schemas.id,
    numrows: { type: 'string | number', attributes: { required: true, range: { min: 0, max: 255 }}},
    search: { ...Schemas.dbSafeString, attributes: { ...Schemas.dbSafeString.attributes, required: false }},
  }
}

export default ContactModel;