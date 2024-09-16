import { RouterResponse } from '../../services/router/router.service';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';

import db from '../../services/db/db.service';

export default async (request: ParsedRequest<{}>): Promise<RouterResponse> => { 

  const maillistRes = await db.row.read('mail');

  if (!maillistRes.success) {
    return new Promise(res => res({
      code: 500,
      json: {
        success: false, 
        messages: [ 
          `SERVER - ROUTES - MAILLIST - Email list could not be retrieved.`,
          ...maillistRes.messages
        ]
      }
    }));
  }

  return new Promise(res => res({
    code: 200,
    json: {
      success: true, 
      messages: [ 
        `SERVER - ROUTES - MAILLIST - Email list successfully retrieved.`,
        ...maillistRes.messages
      ],
      body: maillistRes.body
    }
  }));

}