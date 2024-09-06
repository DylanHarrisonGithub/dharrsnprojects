import { Schema, COMMON_REGEXES } from "../../services/validation/validation.service";
//{ username?: string, avatar?: string, privilege?: string } 
const userPwdResetSchema: Schema = {
  username: {
    type: 'string',
    attributes: {
      required: true
    }
  },
  code: {
    type: 'string',
    attributes: {
      required: true
    }
  },
  password: {
    type: COMMON_REGEXES.PASSWORD_STRONGEST,
    attributes: {
      required: false
    }
  }
}

export default userPwdResetSchema;