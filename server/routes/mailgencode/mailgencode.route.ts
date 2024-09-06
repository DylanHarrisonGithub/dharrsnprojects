import { RouterResponse } from '../../services/router/router.service';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';

import crypto from 'crypto';

import DB from '../../services/db/db.service';
import emailer from '../../services/email/email.service';
import authentication from '../../services/authentication/authentication.service';

import { Mail } from '../../models/models';
import oneTimePasscodeEmailTemplate from '../../email-templates/onetimepasscode.template';

import config from '../../config/config';

export default async (request: ParsedRequest<{ email: string }>): Promise<RouterResponse> => { 
  
  const { email } = request.params;

  const mail: Mail | undefined = (await DB.row.read<Mail[]>('mail', { email: email })).body?.[0];

  if (mail && (mail.verified === 'false') && (Date.now() - parseInt(mail.salt) < 300000)) {
    return new Promise(res => res({
      code: 400,
      json: {
        success: false, 
        messages: [ 
          `SERVER - ROUTES - MAILGENCODE - Email cannot be sent another code at this time. Please try again later.`
        ]
      }
    }));
  }

  const code = crypto.randomBytes(4).toString('hex').toUpperCase().substring(0, 6).padEnd(6, '0');
  const stamp = Date.now().toString();
  const hash = await crypto.pbkdf2Sync(code, stamp, 32, 64, 'sha512').toString('hex');

  let result: { success: boolean, messages: string[] }
  if (mail) {
     result = await DB.row.update(
      'mail',
      {
        code: hash,
        salt: stamp,
        verified: 'false'
      },
      { id: mail.id }
    );
  } else {
    result = await DB.row.create(
      'mail',
      {
        email: email,
        code: hash,
        salt: stamp,
        verified: 'false'
      }
    );
  }

  if (!result.success) {
    return new Promise(res => res({
      code: 500,
      json: {
        success: false, 
        messages: [ 
          `SERVER - ROUTES - MAILGENCODE - Error storing generated code for email ${email}.`,
          ...result.messages
        ]
      }
    }));
  }

  const emailResult = await emailer(
    email,             
    `iamzae.com code request`,
    undefined, //`${code}`
    oneTimePasscodeEmailTemplate(code)
  );

  if (!emailResult.success) {
    return new Promise(res => res({
      code: 500,
      json: {
        success: false, 
        messages: [ 
          `SERVER - ROUTES - MAILGENCODE - Error emailing generated code for ${email}.`,
          ...emailResult.messages,
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
        `SERVER - ROUTES - MAILGENCODE - Code generated for ${email}.`,
        `SERVER - ROUTES - MAILGENCODE - Please check email inbox for user.`,
        ...emailResult.messages,
        ...result.messages
      ]
    }
  }));

}