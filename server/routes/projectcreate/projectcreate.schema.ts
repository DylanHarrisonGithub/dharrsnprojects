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
  projectType 
}) => ({thumbnail, title, links, technologies, features, description, media, projectType }))(ProjectModel.schema)};

export default projectCreateSchema;