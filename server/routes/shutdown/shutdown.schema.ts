import { Schema } from '../../services/validation/validation.service';

const shutdownSchema: Schema = {
  username: {
    type: 'string',
    attributes: {
      required: true
    }
  },
  code: {
    type: 'string',
    attributes: { required: true }
  }
};

export default shutdownSchema;