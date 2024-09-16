import { Schema } from '../../services/validation/validation.service';
import UserModel from '../../definitions/models/User/User';

const userGenCodeSchema: Schema = {
  username: UserModel.schema.username
};

export default userGenCodeSchema;