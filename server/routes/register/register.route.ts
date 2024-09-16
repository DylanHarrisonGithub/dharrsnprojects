import { RouterResponse } from '../../services/router/router.service';
import DB from '../../services/db/db.service';
import authentication from '../../services/authentication/authentication.service';
import crypto from 'crypto';

import config from '../../config/config';
import { User } from '../../definitions/models/User/User';

export default async (request: any): Promise<RouterResponse> => {

  const { admin, username, password, code, avatar, email }: { admin: string, username: string, password: string, code: string, avatar: string | undefined, email: string | undefined } = request.params;

  const user: User | undefined = (await DB.row.read<User[]>('user', { username: admin })).body?.[0];

  if (!user) {
    return new Promise(res => res({
      code: 400,
      json: {
        success: false, 
        messages: [`SERVER - ROUTES - REGISTER - Admin ${admin} could not be found.`]
      }
    }));
  }

  if (user.tries > 2) {
    return new Promise(res => res({
      code: 400,
      json: {
        success: false, 
        messages: [`SERVER - ROUTES - REGISTER - Max attempts exceeded.`]
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
        messages: [`SERVER - ROUTES - REGISTER - Code is not valid.`]
      }
    }));
  }

  const timedifference = Date.now() - parseInt(user.resetstamp);
  if (timedifference > 300000) {
    return new Promise(res => res({
      code: 400,
      json: {
        success: false, 
        messages: [`SERVER - ROUTES - REGISTER - Code is expired.`]
      }
    }));
  }

  // 2fa auth successful

  const salt = crypto.randomBytes(32).toString('hex');
  hash = await crypto.pbkdf2Sync(password, salt, 32, 64, 'sha512').toString('hex');

  const res = await DB.row.create('user', { 
    username: username,
    email: email || config.ADMIN_EMAIL || ``,
    privilege: 'user', 
    password: hash, 
    salt: salt, 
    avatar: ``,
    reset: ``,
    resetstamp: `0`,
    tries: 0
  });

  const token = await authentication.generateToken({username: username, privilege: 'user', dummy: ""});
  
  if (res.success && token.success) {
    return new Promise(resolve => resolve({ 
      code: 200, 
      json: { 
        success: true, 
        messages: [
          `SERVER - ROUTES - REGISTER - New user ${username} registered.`
        ].concat(res.messages).concat(token.messages),
        body: { token: token.body! }
      } 
    }));
  } else {
    return new Promise(resolve => resolve({ 
      code: 500, 
      json: { 
        success: false, 
        messages: [`SERVER - ROUTES - REGISTER - User ${username} could not be registered.`].concat(res.messages).concat(token.messages)
      } 
    }));
  }

};