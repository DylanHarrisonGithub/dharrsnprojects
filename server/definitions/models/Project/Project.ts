import { Model } from '../models';
import Schemas from '../../schemas/schemas';

export type Project = {
  id: number,
  thumbnail: string,
  title: string,
  links: string[],
  technologies: string[],
  features: string[],
  description: string,
  media: string[],
  projectType: 'app' | 'demo' | 'webapp',
  search: string
}

const ProjectModel: Model = {
  db: {
    id: `SERIAL`,
    thumbnail: `TEXT`,
    title: `TEXT`,
    links: `TEXT`,
    technologies: `TEXT`,
    features: `TEXT`,
    description: `TEXT`,
    media: `TEXT`,
    projectType: `TEXT`,
    search: `TEXT`,
    PRIMARY: `KEY (id)`,
  },
  schema: {
    id: Schemas.id,
    afterID: Schemas.id,
    thumbnail: Schemas.imageFilename,
    title: Schemas.sentence,
    links: { type: 'string', attributes: { required: true, array: { minLength: 0 }}},
    technologies: { ...Schemas.sentence, attributes: { ...Schemas.sentence.attributes, array: { minLength: 0 } } },
    features: { ...Schemas.sentence, attributes: { ...Schemas.sentence.attributes, array: { minLength: 0 } } },
    description: Schemas.paragraph,
    media: { type: 'string', attributes: { required: true, array: { minLength: 0 }}},
    projectType: { type: ['app', 'demo', 'webapp'], attributes: { required: true }},
    search: { ...Schemas.dbSafeString, attributes: { ...Schemas.dbSafeString.attributes, required: false }},
  }
}

export default ProjectModel;