import { Schema, COMMON_REGEXES } from '../../services/validation/validation.service';

const mailGenCodeSchema: Schema = {
  email: {
    type: COMMON_REGEXES.EMAIL,
    attributes: { required: true, strLength: { minLength: 5, maxLength: 30 } }
  }
};

export default mailGenCodeSchema;