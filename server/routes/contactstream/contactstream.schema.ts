import { Schema } from "../../services/validation/validation.service";
import Schemas from "../../definitions/schemas/schemas";

const contactStreamSchema: Schema = {
  afterID: Schemas.id,
  numrows: { type: 'string | number', attributes: { required: true, range: { min: 0, max: 50 }}},
  search: { ...Schemas.dbSafeString, attributes: { ...Schemas.dbSafeString.attributes, required: false }},
  id: { ...Schemas.id, attributes: { ...Schemas.id.attributes, required: false }}
};

export default contactStreamSchema;