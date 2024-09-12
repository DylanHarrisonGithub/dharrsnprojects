import { Schema, COMMON_REGEXES } from '../../services/validation/validation.service';
import Schemas from '../../definitions/schemas/schemas';

const mailDeleteSchema: Schema = {
  id: Schemas.id
};

export default mailDeleteSchema;