import React from 'react';

import { ModalContext } from '../../modal/modal';
import Gallery from '../../gallery/gallery';
import MediaViewer from '../../media-viewer/media-viewer';

import HttpService from '../../../services/http.service';

import config from '../../../config/config';
import { acceptedMediaExtensions } from '../../../definitions/data/data';


type Props = {
  media: string[],
  setMedia: React.Dispatch<React.SetStateAction<string[]>>,
  quickGet: <T = void>(route: string) => Promise<T | void>
};

const acceptedMediaTest = (name: string): boolean => !!(
  acceptedMediaExtensions.image.filter(accepted => name.toLowerCase().endsWith(accepted)).length ||
  acceptedMediaExtensions.video.filter(accepted => name.toLowerCase().endsWith(accepted)).length
);

const Media: React.FC<Props> = ({media, setMedia, quickGet}) => {

  const modalContext = React.useContext(ModalContext);
  const init = React.useRef(true);

  React.useEffect(() => {
    if (init.current) {
      quickGet<string[]>('medialist').then(res => setMedia(
        res ? [
          ...res.filter(m => acceptedMediaExtensions.image.filter(accepted => m.toLowerCase().endsWith(accepted)).length),
          ...res.filter(m => acceptedMediaExtensions.video.filter(accepted => m.toLowerCase().endsWith(accepted)).length)
        ] : []
      ));
      init.current = false;
    }
  }, [media]);

  return (
    <span>

      <div 
        className="flex items-center justify-center w-full mb-4"
        onDrop={(e) => {
          e.preventDefault();
          const file = Array.from(e.dataTransfer.files)?.[0];
          if (file && acceptedMediaTest(file.name)) {
            HttpService.upload<string[]>('uploadmedia', file).then(res => {
              (res.success && res.body) && (() => {
                setMedia(res.body);
                modalContext.toast!('success', 'Successfully loaded media filenames.');
                res.messages.forEach(m => modalContext.toast!('success', m));
              })();
              !(res.success) && (() => {
                res.messages.forEach(m => modalContext.toast!('warning', m));
                modalContext.toast!('warning', 'Unable to load media filenames. See console'); 
                console.log(res);
              })();
            })
          } else {
            modalContext.toast!('error', `${file.name.split('.')?.at(-1)} extension not accepted.`); 
          }
        }}
        onDragOver={(e) => {e.preventDefault()}}
      >
        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Accepted File Extensions:</p>
            <p className="text-xs text-gray-400 dark:text-gray-400">
              {
                [
                  ...acceptedMediaExtensions.image,
                  ...acceptedMediaExtensions.video
                ].reduce((a,v) => `${a}, ${v}`, ``).substring(2)
              }
            </p>
          </div>

          <input 
            id="dropzone-file"
            type="file"
            accept='video/*, image/*'
            className='hidden'
            onChange={e => {
              const file = e.target.files?.[0];
              if (file && acceptedMediaTest(file.name)) {
                HttpService.upload<string[]>('uploadmedia', file).then(res => {
                  (res.success && res.body) && (() => {
                    setMedia(res.body);
                    modalContext.toast!('success', 'Successfully loaded media filenames.');
                    res.messages.forEach(m => modalContext.toast!('success', m));
                  })();
                  !(res.success) && (() => {
                    res.messages.forEach(m => modalContext.toast!('warning', m));
                    modalContext.toast!('warning', 'Unable to load media filenames. See console'); 
                    console.log(res);
                  })();
                })
              } else {
                modalContext.toast!('error', `${file?.name.split('.')?.at(-1)} extension not accepted.`); 
              }
            }}
          />
        </label>
      </div> 

      <Gallery>
        {
          media.map(a => (
            <span key={a} className="relative">
              <p 
                className="absolute -right-3 -top-3 bg-red-500 p-1 rounded-full w-6 h-6 cursor-pointer border-2 border-black"
                onClick={() => (modalContext.modal!({prompt: `Are you sure you want to delete\n ${a}?`, options: ["yes", "no"]}))!.then(res => {
                  if (res === "yes") {
                    HttpService.delete<void>('deletemedia', { filename: a }).then(res => {
                      if (res.success) {
                        setMedia(mediaList => mediaList.filter(mediaListFilename => mediaListFilename !== a));
                        res.messages.forEach(m => modalContext.toast!('success', m));
                      } else {
                        modalContext.toast!('warning', `Unable to delete media ${a}`);
                        res.messages.forEach(m => modalContext.toast!('warning', m));
                      }
                    });
                  }
                }).catch(e => {})}
              >
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">X</span>
              </p>
              {
                acceptedMediaExtensions.image.filter(accepted => a.toLowerCase().endsWith(accepted)).length ?
                  <img 
                    className="inline-block cursor-pointer" 
                    width={64} 
                    height={64} 
                    src={
                      (
                        a.toUpperCase().startsWith('HTTP://') ||
                        a.toUpperCase().startsWith('HTTPS://') ||
                        a.toUpperCase().startsWith('WWW.')
                      ) ?
                        a
                      :
                        config.ASSETS[config.ENVIRONMENT] + `media/${a}`
                    }
                    onClick={() => {
                      (new Promise<any>((res, rej) => {
                        modalContext.modal!({
                          node: (<MediaViewer filename={a}/>), 
                          resolve: res, 
                          reject: rej
                        });
                      })).then(result => {
                        modalContext.modal!();
                      }).catch(err => {});
                    }}
                  >
                  </img>
                :
                  <video
                    className='cursor-pointer'
                    width={64} height={64}
                    src={
                      (
                        a.toUpperCase().startsWith('HTTP://') ||
                        a.toUpperCase().startsWith('HTTPS://') ||
                        a.toUpperCase().startsWith('WWW.')
                      ) ?
                        a
                      :
                        config.ASSETS[config.ENVIRONMENT] + `media/${a}#t=0.1`
                    }
                    autoPlay={false} muted={true} loop={true} preload={'metadata'}
                    onClick={() => {
                      (new Promise<any>((res, rej) => {
                        modalContext.modal!({
                          node: (<MediaViewer filename={a}/>), 
                          resolve: res, 
                          reject: rej
                        });
                      })).then(result => {
                        modalContext.modal!();
                      }).catch(err => {});
                    }}
                  ></video>
              }
            </span>
          ))
        }
      </Gallery>

    </span>
  );
}

export default Media;