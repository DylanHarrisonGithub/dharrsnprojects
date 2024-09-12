import { Schema } from "../../services/validation/validation.service";
import Schemas from "../../definitions/schemas/schemas";

const contactDeleteSchema: Schema = {
  id: Schemas.id,
};

export default contactDeleteSchema;