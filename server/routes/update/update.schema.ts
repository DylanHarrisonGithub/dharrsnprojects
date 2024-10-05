import { Schema } from '../../services/validation/validation.service';
import Schemas from '../../definitions/schemas/schemas';

const updateSchema: Schema = {
  username: { ...Schemas.username, attributes: { ...Schemas.username.attributes, required: false }},
  code: { ...Schemas.otp, attributes: { ...Schemas.otp.attributes, required: false }}
};

export default updateSchema;