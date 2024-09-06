import { RouterResponse } from '../../services/router/router.service';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';

import db from '../../services/db/db.service';

import { Mail } from '../../models/models';

import config from '../../config/config';

export default async (request: ParsedRequest<{ id: string }>): Promise<RouterResponse> => { 

  const { id } = request.params;

  const mailDeleteRes = await db.row.delete('mail', { id: id });

  if (!mailDeleteRes.success) {
    return new Promise(res => res({
      code: 500,
      json: {
        success: false, 
        messages: [ 
          `SERVER - ROUTES - MAILDELETE - Email could not be deleted.`,
          ...mailDeleteRes.messages
        ]
      }
    }));
  }

  return new Promise(res => res({
    code: 200,
    json: {
      success: true, 
      messages: [ 
        `SERVER - ROUTES - MAILDELETE - Email successfully deleted.`,
        ...mailDeleteRes.messages
      ]
    }
  }));

}