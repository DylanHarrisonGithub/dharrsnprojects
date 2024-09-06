import { Schema } from '../../services/validation/validation.service';

const userGenCodeSchema: Schema = {
  username: {
    type: 'string',
    attributes: {
      required: true
    }
  }
};

export default userGenCodeSchema;