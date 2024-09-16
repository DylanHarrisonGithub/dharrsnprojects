import { Schema, COMMON_REGEXES } from "../../services/validation/validation.service";
import UserModel from "../../definitions/models/User/User";

const userPwdResetSchema: Schema = {
  username: UserModel.schema.username,
  code: UserModel.schema.otp,
  password: UserModel.schema.password
}

export default userPwdResetSchema;