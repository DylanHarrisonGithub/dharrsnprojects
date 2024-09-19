import { RouterResponse } from '../../services/router/router.service';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';
import { Project } from '../../definitions/models/Project/Project';
import DB from '../../services/db/db.service';

export default async (request: ParsedRequest<{ 
  afterID: number, 
  numrows: number, 
  search?: string,
  id?: string
}>): Promise<RouterResponse> => {

  const { afterID, numrows, search, id } = { ...request.params, search: request.params.search?.replace(/'/g, `''`) };

  const dbRes = id ?
      await DB.row.read<any[]>('project', { id: id })
    :
      search ? 
        await DB.row.query(`SELECT * FROM "project" WHERE search ILIKE '%${search}%' AND id > ${afterID} ORDER BY id ASC LIMIT ${numrows};`)
      :
        await DB.row.stream<any[]>('project', afterID, numrows);

  if (dbRes.success) {

    const projects = (dbRes.body as any[]).map(proj => Object.keys((proj as Object)).reduce((sum, key) => ({...sum, [key]: JSON.parse(proj[key])}), {}));

    return new Promise(res => res({
      code: 200,
      json: {
        success: true,
        messages: [  
          `SERVER - ROUTES - PROJECTSTREAM - Projects streamed.`
        ].concat(dbRes.messages),
        body: projects
      }
    }));
  } else {
    return new Promise(res => res({
      code: 500,
      json: {
        success: false,
        messages: [  
          `SERVER - ROUTES - PROJECTSTREAM - Projects could not be streamed.`
        ].concat(dbRes.messages),
        body: request.params
      }
    }));
  }
};