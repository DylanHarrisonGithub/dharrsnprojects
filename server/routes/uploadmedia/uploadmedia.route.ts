import path from 'path';
import { RouterResponse } from '../../services/router/router.service';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';

import file from '../../services/file/file.service';
import { acceptedMediaExtensions } from '../../models/models';

import config from '../../config/config';

export default async (request: ParsedRequest): Promise<RouterResponse> => {

  const filename = Object.keys(request.files)[0];

  if (!filename) {
    return new Promise(res => res({
      code: 400, 
      json: { 
        success: false, 
        messages: [
          "SERVER - ROUTES - UPLOADMEDIA - Failed to upload file.",
          "SERVER - ROUTES - UPLOADMEDIA - No file was received."
        ]
      } 
    })); 
  }
  
  if (!(
    acceptedMediaExtensions.image.filter(accepted => filename.toLowerCase().endsWith(accepted)).length || 
    acceptedMediaExtensions.video.filter(accepted => filename.toLowerCase().endsWith(accepted)).length
  )) {
    return new Promise(res => res({
      code: 400, 
      json: { 
        success: false, 
        messages: [
          "SERVER - ROUTES - UPLOADMEDIA - Failed to upload file.",
          "SERVER - ROUTES - UPLOADMEDIA - File type not allowed.",
          //`SERVER - ROUTES - UPLOADMEDIA - Allowed file extensions: ${acceptedMediaExtensions.image + ", " + acceptedMediaExtensions.video}.`,
        ]
      } 
    })); 
  }

  const uploadRes = await (new Promise<{success: boolean, messages: string[]}>((uRes) => {
    request.files[Object.keys(request.files)[0]].mv(path.normalize(config.ROOT_DIR + '/public/media/') + Object.keys(request.files)[0], async (err: any) => {
      if (err) {
        uRes({
          success: false,
          messages: ["SERVER - ROUTES - UPLOADMEDIA - Failed to upload file."].concat(err.toString())
        });
      } else {
        uRes({
          success: true,
          messages: ["SERVER - ROUTES - UPLOADMEDIA - File uploaded successfully."]
        });
      }
    });
  }));

  if (!uploadRes.success) {
    return new Promise(res => res({
      code: 500,
      json: {
        success: false,
        messages: uploadRes.messages
      }
    }));
  }

  const fRead = await file.readDirectory('public/media');

  if (!fRead.success) {
    return new Promise(res => res({
      code: 207,
      json: {
        success: true,
        messages: [
          "SERVER - ROUTES - UPLOADMEDIA - Media successfully uploaded!",
          `Server - Routes - UPLOADMEDIA - Failed to load media list.`,
          ...fRead.messages
        ],
        body: []
      }
    }));
  }

  return new Promise(res => res({
    code: 200,
    json: {
      success: true,
      messages: [
        "SERVER - ROUTES - UPLOADMEDIA - Media successfully uploaded!",
        "SERVER - ROUTES - UPLOADMEDIA - Successfully loaded media list!"
      ],
      body: fRead.body
    }
  }));
  
};