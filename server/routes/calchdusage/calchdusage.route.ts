import { RouterResponse } from '../../services/router/router.service';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';
import file from '../../services/file/file.service';

import config from '../../config/config';

export default async (request: ParsedRequest<{}>): Promise<RouterResponse> => { 

  const rootSize = await file.getDirectorySize('');
  const mediaSize = await file.getDirectorySize('public/media');
  const tracksSize = await file.getDirectorySize('public/tracks');

  //&& rootSize.body  && mediaSize.body  && tracksSize.body
  if (!(rootSize.success  && mediaSize.success && tracksSize.success)) {
    return new Promise(res => res({
      code: 500,
      json: {
        success: false, 
        messages: [ 
          `SERVER - ROUTES - CALCHDUSAGE - Error calculating hd usage.`,
          ...rootSize.messages,
          ...mediaSize.messages,
          ...tracksSize.messages
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
        ...mediaSize.messages,
        ...tracksSize.messages
      ],
      body: {
        rootSizeBytes: rootSize.body,
        mediaSizeBytes: mediaSize.body,
        tracksSizeBytes: tracksSize.body,
        maxSizeGB: config.MAX_HD_SIZE_GB
      }
    }
  }));

}