import { Schema, COMMON_REGEXES } from '../../services/validation/validation.service';
import Schemas from '../../definitions/schemas/schemas';

const mailGenCodeSchema: Schema = {
  email: Schemas.email
};

export default mailGenCodeSchema;