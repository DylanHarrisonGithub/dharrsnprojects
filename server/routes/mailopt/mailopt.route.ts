import { RouterResponse } from '../../services/router/router.service';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';

import crypto from 'crypto';

import DB from '../../services/db/db.service';
import emailer from '../../services/email/email.service';
import authentication from '../../services/authentication/authentication.service';

import { Mail } from '../../models/models';

import config from '../../config/config';
import { ServicePromise } from '../../services/services';

export default async (request: ParsedRequest<{ email: string, code: string, opt: boolean }>): Promise<RouterResponse> => { 
  
  const { email, code, opt } = request.params;

  const mail: Mail | undefined = (await DB.row.read<Mail[]>('mail', { email: email })).body?.[0];

  if (!mail) {
    return new Promise(res => res({
      code: 400,
      json: {
        success: false, 
        messages: [ 
          `SERVER - ROUTES - MAILOPT - Email does not exist.`
        ]
      }
    }));
  }

  const hash = await crypto.pbkdf2Sync(code, mail.salt, 32, 64, 'sha512').toString('hex');
  if (hash !== mail.code) {
    return new Promise(res => res({
      code: 400,
      json: {
        success: false, 
        messages: [`SERVER - ROUTES - MAILOPT - Code is not valid.`]
      }
    }));
  }

  const timedifference = Date.now() - parseInt(mail.salt);
  if (timedifference > 300000) {
    return new Promise(res => res({
      code: 400,
      json: {
        success: false, 
        messages: [`SERVER - ROUTES - MAILOPT - Code is expired.`]
      }
    }));
  }

  let result: { success: boolean, messages: string[] }
  if (opt) {
     result = await DB.row.update<ServicePromise>('mail', { verified: 'true' }, { id: mail.id } );
  } else {
    result = await DB.row.delete(
      'mail',
      { id: mail.id }
    );
  }

  if (!result.success) {
    return new Promise(res => res({
      code: 500,
      json: {
        success: false, 
        messages: [ 
          opt ? 
              `SERVER - ROUTES - MAILOPT - Error opting in ${email}. Please try again later.`
            :
              `SERVER - ROUTES - MAILOPT - Error opting out ${email}. Please try again later.`
          ,
          ...result.messages
        ]
      }
    }));
  }

  return new Promise(res => res({
    code: 200,
    json: {
      success: true, 
      messages: [
        opt ? 
          `SERVER - ROUTES - MAILOPT - ${email} successfully registered!.`
        :
          `SERVER - ROUTES - MAILOPT - ${email} successfully opted out.`,
        ...result.messages
      ]
    }
  }));

}