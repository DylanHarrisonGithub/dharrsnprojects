import { Schema } from "../../services/validation/validation.service";
import Schemas from "../../definitions/schemas/schemas";

const deleteMediaSchema: Schema = {
  filename: Schemas.filename,
};

export default deleteMediaSchema;