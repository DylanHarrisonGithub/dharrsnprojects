import { RouterResponse } from '../../services/router/router.service';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';
import file from '../../services/file/file.service';

import config from '../../config/config';

export default async (request: ParsedRequest<{}>): Promise<RouterResponse> => { 

  const rootSize = await file.getDirectorySize('');
  const mediaSize = await file.getDirectorySize('public');

  //&& rootSize.body  && mediaSize.body 
  if (!(rootSize.success  && mediaSize.success)) {
    return new Promise(res => res({
      code: 500,
      json: {
        success: false, 
        messages: [ 
          `SERVER - ROUTES - CALCHDUSAGE - Error calculating hd usage.`,
          ...rootSize.messages,
          ...mediaSize.messages
        ]
      }
    }));
  }

  return new Promise(res => res({
    code: 200,
    json: {
      success: true, 
      messages: [ 
        `SERVER - ROUTES - CALCHDUSAGE - HD usage successfully calculated.`,
        ...rootSize.messages,
        ...mediaSize.messages
      ],
      body: {
        rootSizeBytes: rootSize.body,
        mediaSizeBytes: mediaSize.body,
        maxSizeGB: config.MAX_HD_SIZE_GB
      }
    }
  }));

}