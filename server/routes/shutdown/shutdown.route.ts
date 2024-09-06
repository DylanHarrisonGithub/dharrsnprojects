import * as exec from 'child_process';

import { User } from '../../models/models';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';
import { RouterResponse } from '../../services/router/router.service';

import crypto from 'crypto';

import db from '../../services/db/db.service';

export default async (request: ParsedRequest<{ username: string, code: string }>): Promise<RouterResponse> => { 

  const { username, code } = request.params;

  const user: User | undefined = (await db.row.read<User[]>('user', { username: username })).body?.[0];

  if (!user) {
    return new Promise(res => res({
      code: 400,
      json: {
        success: false, 
        messages: [`SERVER - ROUTES - SHUTDOWN - User ${username} could not be found.`]
      }
    }));
  }

  if (user.tries > 2) {
    return new Promise(res => res({
      code: 400,
      json: {
        success: false, 
        messages: [`SERVER - ROUTES - SHUTDOWN - Max attempts exceeded.`]
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
        messages: [`SERVER - ROUTES - SHUTDOWN - Code is not valid.`]
      }
    }));
  }

  const timedifference = Date.now() - parseInt(user.resetstamp);
  if (timedifference > 300000) {
    return new Promise(res => res({
      code: 400,
      json: {
        success: false, 
        messages: [`SERVER - ROUTES - SHUTDOWN - Code is expired.`]
      }
    }));
  }

  // allow progam to continue through if possible.
  // exec.execSynch('pm2 stop all')
  exec.exec('pm2 stop all');

  return new Promise(res => res({
    code: 200,
    json: {
      success: true, 
      messages: [`SERVER - ROUTES - SHUTDOWN - Server shutdown dispatched.`]
    }
  }));

}