import { RouterResponse } from '../../services/router/router.service';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';
import { Theme } from '../../definitions/models/Theme/theme';
import { defaultTheme } from '../../definitions/data/data';

import db from '../../services/db/db.service';

export default async (request: ParsedRequest<Theme>): Promise<RouterResponse> => {

  // precaution to filter any additional params that were provided with request
  const filteredTheme: Theme = Object.fromEntries(Object.entries(request.params).filter(([key]) => key in defaultTheme)) as Theme;

  const dbres = await db.row.create('theme', filteredTheme);

  return new Promise<RouterResponse>(resolve => resolve({
    code: dbres.success ? 200 : 400,
    json: {
      success: dbres.success,
      messages: dbres.messages    
    }
  }));
}