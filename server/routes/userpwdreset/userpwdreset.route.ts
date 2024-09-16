import { User } from '../../definitions/models/User/User';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';
import { RouterResponse } from '../../services/router/router.service';

import crypto from 'crypto';

import db from '../../services/db/db.service';

export default async (request: ParsedRequest<{ username: string, code: string, password: string }>): Promise<RouterResponse> => { 

  const { username, code, password } = request.params;

  const user: User | undefined = (await db.row.read<User[]>('user', { username: username })).body?.[0];

  if (!user) {
    return new Promise(res => res({
      code: 400,
      json: {
        success: false, 
        messages: [`SERVER - ROUTES - USERPWDRESET - User ${username} could not be found.`]
      }
    }));
  }

  if (user.tries > 2) {
    return new Promise(res => res({
      code: 400,
      json: {
        success: false, 
        messages: [`SERVER - ROUTES - USERPWDRESET - Max attempts exceeded.`]
      }
    }));
  }

  const hash = await crypto.pbkdf2Sync(code, user.resetstamp, 32, 64, 'sha512').toString('hex');
  if (hash !== user.reset) {
    await db.row.update('user', { tries: user.tries + 1 }, { id: user.id });
    return new Promise(res => res({
      code: 400,
      json: {
        success: false, 
        messages: [`SERVER - ROUTES - USERPWDRESET - Code is not valid.`]
      }
    }));
  }

  const timedifference = Date.now() - parseInt(user.resetstamp);
  if (timedifference > 300000) {
    return new Promise(res => res({
      code: 400,
      json: {
        success: false, 
        messages: [`SERVER - ROUTES - USERPWDRESET - Code is expired.`]
      }
    }));
  }

  const newsalt = crypto.randomBytes(32).toString('hex');
  const newhash = await crypto.pbkdf2Sync(password, newsalt, 32, 64, 'sha512').toString('hex');

  const update = await db.row.update('user', { salt: newsalt, password: newhash }, { id: user.id });

  if (!update.success) {
    return new Promise(res => res({
      code: 500,
      json: {
        success: false, 
        messages: [
          `SERVER - ROUTES - USERPWDRESET - Error occured updating password.`,
          ...update.messages
        ]
      }
    }));
  }

  return new Promise(res => res({
    code: 200,
    json: {
      success: true, 
      messages: [`SERVER - ROUTES - USERPWDRESET - Password reset successfully.`]
    }
  }));

}