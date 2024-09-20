import { RouterResponse } from '../../services/router/router.service';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';
import { Project } from '../../definitions/models/Project/Project';
import ProjectModel from '../../definitions/models/Project/Project';

import db from '../../services/db/db.service';

const requestFilter = [
  'thumbnail', 
  'title', 
  'links', 
  'technologies', 
  'features', 
  'description', 
  'media', 
  'projecttype' 
]

export default async (request: ParsedRequest<Project>): Promise<RouterResponse> => {

  // precaution to filter any additional params that were provided with request
  const filteredProject: Omit<Project, "id"> = {
    ...Object.fromEntries(Object.entries(request.params).filter(([key]) => requestFilter.includes(key))) as Omit<Project, "id" | "search">,
    search: ``
  };

  // assemble search string
  filteredProject.search = Object.keys(filteredProject).reduce((sum, key) => sum + JSON.stringify(filteredProject[key as keyof Omit<Project, "id">]), '');

  // flatten
  const flattenedProject: { [key: string]: string } = Object.keys(filteredProject).reduce((sum, key) => ({...sum, [key]: JSON.stringify(filteredProject[key as keyof Omit<Project, "id">])}), {});

  const dbres = await db.row.create('project', flattenedProject);

  return new Promise<RouterResponse>(resolve => resolve({
    code: dbres.success ? 200 : 400,
    json: {
      success: dbres.success,
      messages: dbres.messages    
    }
  }));
}