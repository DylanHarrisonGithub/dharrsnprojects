import { Schema, COMMON_REGEXES } from '../../services/validation/validation.service';

const registerSchema: Schema = {
  admin: {
    type: 'string',
    attributes: {
      required: true,
      strLength: { minLength: 6 }
    }
  },
  username: {
    type: 'string',
    attributes: {
      required: true,
      strLength: { minLength: 6 }
    }
  },
  password: {
    type: COMMON_REGEXES.PASSWORD_STRONGEST,
    attributes: {
      required: true,
      strLength: { minLength: 8 }
    }
  },
  code:  {
    type: 'string',
    attributes: {
      required: true,
      strLength: { minLength: 0, maxLength: 128 }
    }
  },
  avatar: {
    type: 'string',
    attributes: {
      required: false,
    }
  },
  email: {
    type: 'string',
    attributes: {
      required: false
    }
  },
};

export default registerSchema;