import { RouterResponse } from '../../services/router/router.service';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';

import db from '../../services/db/db.service';

import config from '../../config/config';

export default async (request: ParsedRequest<{ id: string }>): Promise<RouterResponse> => { 

  const { id } = request.params;

  const projectDeleteRes = await db.row.delete('project', { id: id });

  if (!projectDeleteRes.success) {
    return new Promise(res => res({
      code: 500,
      json: {
        success: false, 
        messages: [ 
          `SERVER - ROUTES - PROJECTDELETE - Project could not be deleted.`,
          ...projectDeleteRes.messages
        ]
      }
    }));
  }

  return new Promise(res => res({
    code: 200,
    json: {
      success: true, 
      messages: [ 
        `SERVER - ROUTES - PROJECTDELETE - Project successfully deleted.`,
        ...projectDeleteRes.messages
      ]
    }
  }));

}