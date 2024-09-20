import { Schema } from "../../services/validation/validation.service"
import ProjectModel from "../../definitions/models/Project/Project";

const projectCreateSchema: Schema = {...(({
  thumbnail, 
  title, 
  links, 
  technologies, 
  features, 
  description, 
  media, 
  projecttype 
}) => ({thumbnail, title, links, technologies, features, description, media, projecttype }))(ProjectModel.schema)};

export default projectCreateSchema;