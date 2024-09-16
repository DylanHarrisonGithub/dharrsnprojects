import React from "react";

import AspectContainer from "../aspect-container/aspect-container";
import config from "../../config/config";

import { StorageContext } from "../storage/storage-context";

const ThreeCard: React.FC<{cards: { img: string, title: string, body: string }[]}> = ({ cards }) => {

  const [storageContext, setStorageContext] = React.useContext(StorageContext);

  return (
    <div className="text-center">
      <div className="inline-flex flex-col md:flex-row flex-wrap justify-center">
        {
          cards.map((c, i) => (
            <div key={i} className={`flex flex-col md:max-w-[20rem] p-4 m-4 border border-slate-600 bg-slate-800`}>
              <AspectContainer aspectRatio="1.618:1">
                <img src={config.ASSETS[config.ENVIRONMENT] + `media/${c.img}`} className=" object-cover w-full h-full" alt="missing image" />
              </AspectContainer>
              <h1 className="bg-slate-900 bg-opacity-10 text-left text-gray-200 mt-4 text-lg p-1">{ c.title }</h1>
              <div className=" bg-slate-900 bg-opacity-10 flex-1 text-left p-1 text-gray-400">
                { c.body }
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default ThreeCard;