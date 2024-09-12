import { Schema, COMMON_REGEXES } from '../../services/validation/validation.service';
import Schemas from '../../definitions/schemas/schemas';

const mailGenCodeSchema: Schema = {
  email: Schemas.email,
  code: Schemas.otp,
  opt: {
    type: 'boolean',
    attributes: { required: true }
  }
};

export default mailGenCodeSchema;