import { Schema, COMMON_REGEXES } from '../../services/validation/validation.service';
import UserModel from '../../definitions/models/User/User';

const loginSchema: Schema = {
  ...(({ 
    username, 
    password 
  }) => ({ username, password }))(UserModel.schema)
};

export default loginSchema;