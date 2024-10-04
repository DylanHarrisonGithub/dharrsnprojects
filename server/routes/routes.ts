import projectdeleteRoute from './projectdelete/projectdelete.route';
import projectdeleteSchema from './projectdelete/projectdelete.schema';
import projectstreamRoute from './projectstream/projectstream.route';
import projectstreamSchema from './projectstream/projectstream.schema';
import projectcreateRoute from './projectcreate/projectcreate.route';
import projectcreateSchema from './projectcreate/projectcreate.schema';
import themedeleteRoute from './themedelete/themedelete.route';
import themedeleteSchema from './themedelete/themedelete.schema';
import themecreateRoute from './themecreate/themecreate.route';
import themecreateSchema from './themecreate/themecreate.schema';
import themeRoute from './theme/theme.route';
import themeSchema from './theme/theme.schema';
import userdeleteRoute from './userdelete/userdelete.route';
import userdeleteSchema from './userdelete/userdelete.schema';
import updateRoute from './update/update.route';
import updateSchema from './update/update.schema';
import shutdownRoute from './shutdown/shutdown.route';
import shutdownSchema from './shutdown/shutdown.schema';
import maildeleteRoute from './maildelete/maildelete.route';
import maildeleteSchema from './maildelete/maildelete.schema';
import maillistRoute from './maillist/maillist.route';
import maillistSchema from './maillist/maillist.schema';
import calchdusageRoute from './calchdusage/calchdusage.route';
import calchdusageSchema from './calchdusage/calchdusage.schema';
import mailoptRoute from './mailopt/mailopt.route';
import mailoptSchema from './mailopt/mailopt.schema';
import mailgencodeRoute from './mailgencode/mailgencode.route';
import mailgencodeSchema from './mailgencode/mailgencode.schema';
import userpwdresetRoute from './userpwdreset/userpwdreset.route';
import userpwdresetSchema from './userpwdreset/userpwdreset.schema';
import usergencodeRoute from './usergencode/usergencode.route';
import usergencodeSchema from './usergencode/usergencode.schema';
import contactstreamRoute from './contactstream/contactstream.route';
import contactstreamSchema from './contactstream/contactstream.schema';
import contactdeleteRoute from './contactdelete/contactdelete.route';
import contactdeleteSchema from './contactdelete/contactdelete.schema';
import contactcreateRoute from './contactcreate/contactcreate.route';
import contactcreateSchema from './contactcreate/contactcreate.schema';
import userupdateRoute from './userupdate/userupdate.route';
import userupdateSchema from './userupdate/userupdate.schema';
import userlistRoute from './userlist/userlist.route';
import userlistSchema from './userlist/userlist.schema';
import deletemediaRoute from './deletemedia/deletemedia.route';
import deletemediaSchema from './deletemedia/deletemedia.schema';
import uploadmediaRoute from './uploadmedia/uploadmedia.route';
import uploadmediaSchema from './uploadmedia/uploadmedia.schema';
import medialistRoute from './medialist/medialist.route';
import medialistSchema from './medialist/medialist.schema';
import loginRoute from './login/login.route';
import loginSchema from './login/login.schema';
import registerRoute from './register/register.route';
import registerSchema from './register/register.schema';

import { ParsedRequest } from "../services/requestParser/requestParser.service";
import { RouterResponse } from "../services/router/router.service";
import { Schema } from '../services/validation/validation.service';

import config from '../config/config';

export interface Route {
  method: string[],
  contentType: string,
  privilege: string[],
  schema: Schema,
  route: (request: ParsedRequest) => Promise<RouterResponse>
}

const routes: { [key: string]: Route } = {
 projectdelete: {
    method: ['DELETE'],
    contentType: "application/json",
    privilege: ['user'],
    schema: projectdeleteSchema,
    route: projectdeleteRoute 
  },
 projectstream: {
    method: ['GET'],
    contentType: "application/json",
    privilege: ['guest'],
    schema: projectstreamSchema,
    route: projectstreamRoute 
  },
 projectcreate: {
    method: ['POST'],
    contentType: "application/json",
    privilege: ['user'],
    schema: projectcreateSchema,
    route: projectcreateRoute 
  },
 themedelete: {
    method: ['DELETE'],
    contentType: "application/json",
    privilege: ['user'],
    schema: themedeleteSchema,
    route: themedeleteRoute 
  },
 themecreate: {
    method: ['POST'],
    contentType: "application/json",
    privilege: ['user'],
    schema: themecreateSchema,
    route: themecreateRoute 
  },
 theme: {
    method: ['GET'],
    contentType: "application/json",
    privilege: ['guest'],
    schema: themeSchema,
    route: themeRoute 
  },
 userdelete: {
    method: ['DELETE'],
    contentType: "application/json",
    privilege: ['user'],
    schema: userdeleteSchema,
    route: userdeleteRoute 
  },
 update: {
    method: ['POST'],
    contentType: "application/json",
    privilege: ['user'],
    schema: updateSchema,
    route: updateRoute 
  },
 shutdown: {
    method: ['POST'],
    contentType: "application/json",
    privilege: ['user'],
    schema: shutdownSchema,
    route: shutdownRoute 
  },
 maildelete: {
    method: ['DELETE'],
    contentType: "application/json",
    privilege: ['user'],
    schema: maildeleteSchema,
    route: maildeleteRoute 
  },
 maillist: {
    method: ['GET'],
    contentType: "application/json",
    privilege: ['user'],
    schema: maillistSchema,
    route: maillistRoute 
  },
 calchdusage: {
    method: ['GET'],
    contentType: "application/json",
    privilege: ['user'],
    schema: calchdusageSchema,
    route: calchdusageRoute 
  },
 mailopt: {
    method: ['POST'],
    contentType: "application/json",
    privilege: ['guest'],
    schema: mailoptSchema,
    route: mailoptRoute 
  },
 mailgencode: {
    method: ['POST'],
    contentType: "application/json",
    privilege: ['guest'],
    schema: mailgencodeSchema,
    route: mailgencodeRoute 
  },
 userpwdreset: {
    method: ['PATCH'],
    contentType: "application/json",
    privilege: ['guest'],
    schema: userpwdresetSchema,
    route: userpwdresetRoute 
  },
 usergencode: {
    method: ['POST'],
    contentType: "application/json",
    privilege: ['guest'],
    schema: usergencodeSchema,
    route: usergencodeRoute 
  },
 contactstream: {
    method: ['GET'],
    contentType: "application/json",
    privilege: ['user'],
    schema: contactstreamSchema,
    route: contactstreamRoute 
  },
 contactdelete: {
    method: ['DELETE'],
    contentType: "application/json",
    privilege: ['user'],
    schema: contactdeleteSchema,
    route: contactdeleteRoute 
  },
 contactcreate: {
    method: ['POST'],
    contentType: "application/json",
    privilege: ['guest'],
    schema: contactcreateSchema,
    route: contactcreateRoute 
  },
 userupdate: {
    method: ['PATCH'],
    contentType: "application/json",
    privilege: ['user'],
    schema: userupdateSchema,
    route: userupdateRoute 
  },
 userlist: {
    method: ['GET'],
    contentType: "application/json",
    privilege: ['user'],
    schema: userlistSchema,
    route: userlistRoute 
  },
 deletemedia: {
    method: ['DELETE'],
    contentType: "application/json",
    privilege: ['user'], //(config.ENVIRONMENT === 'DEVELOPMENT') ? ['guest', 'admin'] : ['admin'],
    schema: deletemediaSchema,
    route: deletemediaRoute 
  },
 uploadmedia: {
    method: ['POST'],
    contentType: "application/json",
    privilege: ['user'], //(config.ENVIRONMENT === 'DEVELOPMENT') ? ['guest', 'admin'] : ['admin'],
    schema: uploadmediaSchema,
    route: uploadmediaRoute 
  },
 medialist: {
    method: ['GET'],
    contentType: "application/json",
    privilege: ['guest'],
    schema: medialistSchema,
    route: medialistRoute 
  },
 login: {
    method: ["POST"],
    contentType: "application/json",
    privilege: ['guest'],
    schema: loginSchema,
    route: loginRoute 
  },
 register: {
    method: ["POST"],
    contentType: "application/json",
    privilege: (config.ENVIRONMENT === 'DEVELOPMENT') ? ['guest', 'user'] : ['user'],
    schema: registerSchema,
    route: registerRoute 
  },
}

export default routes;