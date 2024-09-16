import { Schema, COMMON_REGEXES } from "../../services/validation/validation.service";
import ContactModel from "../../definitions/models/Contact/Contact";

const contactCreateSchema: Schema = {
  ...(({ 
    email, 
    subject, 
    message 
  }) => ({ email, subject, message }))(ContactModel.schema)
};

export default contactCreateSchema;