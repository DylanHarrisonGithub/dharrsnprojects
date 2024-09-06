import React from "react";

import config from "../../config/config";
import { acceptedMediaExtensions } from "../../models/models";

export type MediaViewerProps = { filename: string }

const MediaViewer: React.FC<MediaViewerProps> = ({ filename }) => {
  return (
    <div className=" inline-block">
      {
        acceptedMediaExtensions.image.filter(accepted => filename.toLowerCase().endsWith(accepted)).length ?
          <img 
            // style={{height: window.innerHeight-100}}
            // height={ window.innerHeight - 100 }
            src={
              (
                filename.toUpperCase().startsWith('HTTP://') ||
                filename.toUpperCase().startsWith('HTTPS://') ||
                filename.toUpperCase().startsWith('WWW.')
              ) ?
                filename
              :
                config.ASSETS[config.ENVIRONMENT] + `media/${filename}`
            }
          >
          </img>
        :
          (
            filename.toUpperCase().startsWith('HTTP://') ||
            filename.toUpperCase().startsWith('HTTPS://') ||
            filename.toUpperCase().startsWith('WWW.')
          ) ?  
            <iframe 
              className=" w-full h-auto"
              src={filename} 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
          :
            <video
              // style={{height: window.innerHeight-100}}
              src={config.ASSETS[config.ENVIRONMENT] + `media/${filename}#t=0.1`}
              controls={true} autoPlay={false} muted={true} loop={true} preload={'metadata'}
            ></video>
      }
    </div>
  )
}

export default MediaViewer;