import { Schema, COMMON_REGEXES } from '../../services/validation/validation.service';
import UserModel from '../../definitions/models/User/User';
import Schemas from '../../definitions/schemas/schemas';

const registerSchema: Schema = {
  admin: Schemas.username,
  ...(({ 
    username, 
    password, 
    email, 
    avatar 
  }) => ({ username, password, email, avatar }))(UserModel.schema),
  code:  UserModel.schema.otp,
};

export default registerSchema;