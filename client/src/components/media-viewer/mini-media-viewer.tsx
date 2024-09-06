import React from "react";

import config from "../../config/config";

import { acceptedMediaExtensions } from "../../models/models";

export type MediaViewerProps = { filename: string }

const MiniMediaViewer: React.FC<any> = ({ filename }) => {
  return (
    <div>
     {
        acceptedMediaExtensions.image.filter(accepted => filename.toLowerCase().endsWith(accepted)).length ?
          <img
            className="inline-block"
            width={64} 
            height={64} 
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
              className="inline-block"
              width={64} 
              height={64} 
              src={filename} 

            ></iframe>
          :
            <video
              // style={{height: window.innerHeight-100}}
              className="inline-block"
              width={64} 
              height={64} 
              src={config.ASSETS[config.ENVIRONMENT] + `media/${filename}#t=0.1`}
              controls={true} autoPlay={false} muted={true} loop={true} preload="metadata"
            ></video>
      }
    </div>
  )
}

export default MiniMediaViewer;