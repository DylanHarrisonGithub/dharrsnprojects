import { Schema, COMMON_REGEXES } from '../../services/validation/validation.service';

const userdeleteSchema: Schema = {
  id: { type: 'string | number', attributes: { required: true, range: { min: 0 } }},
  admin: {
    type: 'string',
    attributes: {
      required: true,
      strLength: { minLength: 6 }
    }
  },
  code:  {
    type: 'string',
    attributes: {
      required: true,
      strLength: { minLength: 0, maxLength: 128 }
    }
  }
};

export default userdeleteSchema;