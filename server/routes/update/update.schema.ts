import { Schema } from '../../services/validation/validation.service';
import Schemas from '../../definitions/schemas/schemas';

const updateSchema: Schema = {
  username: Schemas.username,
  code: Schemas.otp
};

export default updateSchema;