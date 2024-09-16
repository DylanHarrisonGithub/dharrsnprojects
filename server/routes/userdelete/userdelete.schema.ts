import { Schema, COMMON_REGEXES } from '../../services/validation/validation.service';
import UserModel from '../../definitions/models/User/User';

const userdeleteSchema: Schema = {
  id: UserModel.schema.id,
  admin: UserModel.schema.username,
  code:  UserModel.schema.otp
};

export default userdeleteSchema;