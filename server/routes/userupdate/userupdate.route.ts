import { RouterResponse } from '../../services/router/router.service';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';

import { User } from '../../models/models';

import db from '../../services/db/db.service';

export default async (request: ParsedRequest<
  { id: number, update: { username?: string, avatar?: string, privilege?: string } }
>): Promise<RouterResponse> => {

  const safeupdate: { username?: string, avatar?: string, privilege?: string } = [
    'username', 'avatar', 'privilege'
  ].reduce((a, v) => (request.params.update as any)[v] ? { ...a, [v]: (request.params.update as any)[v] } : a, {});

  var queryResult: { success: boolean, messages: string[] } = await db.row.update('user', safeupdate, { id: request.params.id });

  return new Promise(res => res({
    code: 200,
    json: {
      success: queryResult.success, 
      messages: queryResult.messages
    }
  }))
};