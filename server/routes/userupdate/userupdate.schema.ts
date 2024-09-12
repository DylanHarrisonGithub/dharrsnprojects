import { Schema } from "../../services/validation/validation.service";
import UserModel from "../../definitions/models/User/User";

const userUpdateSchema: Schema = {
  id: UserModel.schema.id,
  update: {
    type: {
      username: { ...UserModel.schema.username, attributes: { ...UserModel.schema.username.attributes, required: false } },
      avatar: { ...UserModel.schema.avatar, attributes: { ...UserModel.schema.avatar.attributes, required: false } },
      privilege: { ...UserModel.schema.privilege, attributes: { ...UserModel.schema.privilege.attributes, required: false } },
    },
    attributes: {
      required: false
    }
  }
}

export default userUpdateSchema;