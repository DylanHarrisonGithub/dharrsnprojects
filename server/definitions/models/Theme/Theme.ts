import { Model } from '../models';
import Schemas from '../../schemas/schemas';
import { Schema, COMMON_REGEXES } from '../../../services/validation/validation.service';

export type Theme = {
  id: number
}

const ThemeModel: Model = {
  db: {
    id: `SERIAL`,
    PRIMARY: `KEY (id)`
  },
  schema: {
    id: Schemas.id
  }
}

export default ThemeModel;