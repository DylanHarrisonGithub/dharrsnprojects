import { Schema, COMMON_REGEXES } from '../../services/validation/validation.service';

const mailDeleteSchema: Schema = {
  id: {
    type: 'string',
    attributes: { required: true, strLength: { maxLength: 30 } }
  }
};

export default mailDeleteSchema;