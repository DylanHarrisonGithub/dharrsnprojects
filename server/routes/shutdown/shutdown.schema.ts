import { Schema } from '../../services/validation/validation.service';
import UserModel from '../../definitions/models/User/User';

const shutdownSchema: Schema = {
  username: UserModel.schema.username,
  code: UserModel.schema.otp
};

export default shutdownSchema;