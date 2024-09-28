import * as exec from 'child_process';
import * as path from 'path';

import { User } from '../../definitions/models/User/User';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';
import { RouterResponse } from '../../services/router/router.service';

import config from '../../config/config';

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
        messages: [`SERVER - ROUTES - UPDATE - User ${username} could not be found.`]
      }
    }));
  }

  if (user.tries > 2) {
    return new Promise(res => res({
      code: 400,
      json: {
        success: false, 
        messages: [`SERVER - ROUTES - UPDATE - Max attempts exceeded.`]
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
        messages: [`SERVER - ROUTES - UPDATE - Code is not valid.`]
      }
    }));
  }

  const timedifference = Date.now() - parseInt(user.resetstamp);
  if (timedifference > 300000) {
    return new Promise(res => res({
      code: 400,
      json: {
        success: false, 
        messages: [`SERVER - ROUTES - UPDATE - Code is expired.`]
      }
    }));
  }

  if (!config.REPOSITORY.URL) {
    return new Promise(res => res({
      code: 500,
      json: {
        success: false, 
        messages: [`SERVER - ROUTES - UPDATE - Server repository is not configured.`]
      }
    }));
  }

  try {

    
    const urlRes = exec.execSync(`sudo git remote set-url origin https://${config.REPOSITORY.PAT ? config.REPOSITORY.PAT + '@' : ''}${config.REPOSITORY.URL}`);

    const status = await exec.execSync(`sudo git fetch && sudo git status`);

    if (status.includes('Your branch is up to date')) {
      return new Promise(res => res({
        code: 200,
        json: {
          success: true, 
          messages: [
            `SERVER - ROUTES - UPDATE - Server did not update because it is already up to date.`,
            status.toString()
          ],
        }
      }));
    }

    if (status.includes('Your branch is behind')) {

      try {
        const rDir = path.resolve(config.ROOT_DIR);
        await exec.execSync(`sudo chmod +x update.sh`);
        const child = exec.spawn('sudo', ['sh', 'update.sh'], { detached: true, stdio: 'inherit', shell: true, cwd: rDir});
        child.unref();

        return new Promise(res => res({
          code: 200,
          json: {
            success: true, 
            messages: [
              `SERVER - ROUTES - UPDATE - Server UPDATE dispatched.`,
              `SERVER - ROUTES - UPDATE - Server UPDATE will cause temporary outage.`,
              // status.toString()            
            ]
          }
        }));
      } catch (e) {
        return new Promise(res => res({
          code: 500,
          json: {
            success: false, 
            messages: [
              `SERVER - ROUTES - UPDATE - Error occurred while updating server.`,
              status.toString()
            ]
          }
        }));
      }
    }

    return new Promise(res => res({
      code: 500,
      json: {
        success: false, 
        messages: [
          `SERVER - ROUTES - UPDATE - Failed to update server.`,
          `SERVER - ROUTES - UPDATE - Local repository may be configured incorrectly.`,
          status.toString()
        ]
      }
    }));

  } catch (e) {
    return new Promise(res => res({
      code: 500,
      json: {
        success: false, 
        messages: [`SERVER - ROUTES - UPDATE - Error occured checking for server updates.`, e]
      }
    }));
  }

  // should be unreacheable
  return new Promise(res => res({
    code: 500,
    json: {
      success: true, 
      messages: [`SERVER - ROUTES - UPDATE - Server UPDATE may or may not have been dispatched.`]
    }
  }));

}