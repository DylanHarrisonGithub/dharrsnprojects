import { RouterResponse } from '../../services/router/router.service';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';

import crypto from 'crypto';

import DB from '../../services/db/db.service';
import email from '../../services/email/email.service';
import authentication from '../../services/authentication/authentication.service';

import oneTimePasscodeEmailTemplate from '../../email-templates/onetimepasscode.template';

import { User } from '../../models/models';

import config from '../../config/config';

export default async (request: ParsedRequest<{ username: string }>): Promise<RouterResponse> => { 
  
  const { username } = request.params;

  const user: User | undefined = (await DB.row.read<User[]>('user', { username: username })).body?.[0];

  if (!user) {
    return new Promise(res => res({
      code: 400,
      json: {
        success: false, 
        messages: [`SERVER - ROUTES - USERGENCODE - User ${username} could not be found.`]
      }
    }))
  }

  const code = crypto.randomBytes(4).toString('hex').toUpperCase().substring(0, 6).padEnd(6, '0');
  const stamp = Date.now().toString();
  const hash = await crypto.pbkdf2Sync(code, stamp, 32, 64, 'sha512').toString('hex');

  const updateResult: { success: boolean, messages: string[] } = await DB.row.update(
    'user',
    {
      reset: hash,
      resetstamp: stamp,
      tries: 0
    },
    { id: user.id }
  );

  if (!updateResult.success) {
    return new Promise(res => res({
      code: 500,
      json: {
        success: false, 
        messages: [ 
          `SERVER - ROUTES - USERGENCODE - Error storing generated code for user ${username}.`,
          ...updateResult.messages
        ]
      }
    }));
  }

  const recipient = [
    config.NODEMAILER.EMAIL,
    config.ADMIN_EMAIL,
    user.email
  ].reduce((pv, cv) => (cv && cv.length) ? cv : pv, 'NORECIPIENT');

  const emailResult = await email(
    recipient,             
    `${user.username} code request`,
    undefined, //`${code}`,
    oneTimePasscodeEmailTemplate(code)
  );

  if (!emailResult.success) {
    return new Promise(res => res({
      code: 500,
      json: {
        success: false, 
        messages: [ 
          `SERVER - ROUTES - USERGENCODE - Error emailing generated code for user ${username}.`,
          ...emailResult.messages,
          ...updateResult.messages
        ]
      }
    }));
  }

  return new Promise(res => res({
    code: 200,
    json: {
      success: true, 
      messages: [ 
        `SERVER - ROUTES - USERGENCODE - Code generated for user ${username}.`,
        `SERVER - ROUTES - USERGENCODE - Please check email inbox for user.`,
        ...emailResult.messages,
        ...updateResult.messages
      ]
    }
  }));

}