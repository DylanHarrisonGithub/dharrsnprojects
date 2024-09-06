import { Schema } from "../../services/validation/validation.service";

const deleteMediaSchema: Schema = {
  filename: { type: 'string', attributes: { required: true, range: { min: 0, max: 255 }}},
};

export default deleteMediaSchema;