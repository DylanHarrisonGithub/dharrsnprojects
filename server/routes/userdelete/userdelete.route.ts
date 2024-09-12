import crypto from 'crypto';

import { RouterResponse } from '../../services/router/router.service';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';
import DB from '../../services/db/db.service';
import { User } from '../../definitions/models/User/User';

export default async (request: ParsedRequest<{ id: number, admin: string, code: string }>): Promise<RouterResponse> => {

  const { id, admin, code } = request.params;

  const user: User | undefined = (await DB.row.read<User[]>('user', { username: admin })).body?.[0];

  if (!user) {
    return new Promise(res => res({
      code: 400,
      json: {
        success: false, 
        messages: [`SERVER - ROUTES - USERDELETE - Admin ${admin} could not be found.`]
      }
    }));
  }

  if (user.tries > 2) {
    return new Promise(res => res({
      code: 400,
      json: {
        success: false, 
        messages: [`SERVER - ROUTES - USERDELETE - Max attempts exceeded.`]
      }
    }));
  }

  let hash = await crypto.pbkdf2Sync(code, user.resetstamp, 32, 64, 'sha512').toString('hex');
  if (hash !== user.reset) {
    await DB.row.update('user', { tries: user.tries + 1 }, { id: user.id });
    return new Promise(res => res({
      code: 400,
      json: {
        success: false, 
        messages: [`SERVER - ROUTES - USERDELETE - Code is not valid.`]
      }
    }));
  }

  const timedifference = Date.now() - parseInt(user.resetstamp);
  if (timedifference > 300000) {
    return new Promise(res => res({
      code: 400,
      json: {
        success: false, 
        messages: [`SERVER - ROUTES - USERDELETE - Code is expired.`]
      }
    }));
  }
  // 2fa auth successful


  const dbRes = await DB.row.delete('user', { id: id });

  if (dbRes.success) {
    return new Promise(res => res({
      code: 200,
      json: {
        success: true,
        messages: [  
          `SERVER - ROUTES - USERDELETE - User deleted.`
        ].concat(dbRes.messages),
        body: dbRes.body
      }
    }));
  } else {
    return new Promise(res => res({
      code: 500,
      json: {
        success: false,
        messages: [  
          `SERVER - ROUTES - USERDELETE - User could not be deleted.`
        ].concat(dbRes.messages),
        body: request.params
      }
    }));
  }
};