import { Schema, COMMON_REGEXES } from '../../services/validation/validation.service';

const loginSchema: Schema = {
  username: {
    type: 'string',
    attributes: {
      required: true
    }
  },
  password: {
    type: 'string',
    attributes: {
      required: true
    }
  }
};

export default loginSchema;