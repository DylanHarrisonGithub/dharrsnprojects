// TODO: this context component should accept a generic type to strictly define the storage object
import React, { Children, ReactElement } from 'react';

import { ServicePromise } from '../../services/services';

import StorageService from '../../services/storage.service';
import AuthService from '../../services/auth.service';

import config from '../../config/config';

export type StorageProps2<T extends keyof any> = {
  children: React.ReactNode[] | React.ReactElement<any, any> | null,
  keys: T //| string[] 
}
export type StorageProps = {
  children: React.ReactNode[] | React.ReactElement<any, any> | null,
  keys: string[] 
}

export const StorageContext = React.createContext<[{ [key: string]: any }, React.Dispatch<React.SetStateAction<{ [key: string]: any }>> | undefined]>([{}, undefined]);

// const Storage = <T=void>({children, keys}: StorageProps<T>): ReactElement => {
const Storage : React.FC<StorageProps> = ({ children, keys }) => {

  const [storageObj, setStorageObj] = React.useState<{ [key: string]: any }>(async () => await keys.reduce(async (obj, k) => ({ ...(await obj), [k]: (await StorageService[config.AUTH_TOKEN_STORAGE_METHOD].retrieve(k)).body }), Promise.resolve({})));
  // const [storageObj, setStorageObj] = React.useState<T>(async () => await Object.keys(keys).reduce(async (obj, k) => (
  //   { ...(await obj), [k]: (await StorageService[config.AUTH_TOKEN_STORAGE_METHOD].retrieve(k)).body }
  // ), Promise.resolve({}) as T) as T);

  React.useEffect(() => {

    const handleStorageChange = async () => {
      //console.log('storageobj', await keys.reduce(async (obj, k) => ({ ...(await obj), [k]: (await StorageService[config.AUTH_TOKEN_STORAGE_METHOD].retrieve(k)).body }), Promise.resolve({})))
      const newStorage = await keys.reduce(async (obj, k) => ({ ...(await obj), [k]: (await StorageService[config.AUTH_TOKEN_STORAGE_METHOD].retrieve(k)).body }), Promise.resolve({}));
      // console.log('storage update', newStorage)
      setStorageObj(newStorage);
    };

    handleStorageChange();

    window.addEventListener('storage', handleStorageChange);
    return () => { window.removeEventListener('storage', handleStorageChange) };

  }, []);

  React.useEffect(() => {
    ({
      LOCAL: (() => localStorage.setItem(config.APP_NAME, JSON.stringify(storageObj))),
      SESSION: (() => sessionStorage.setItem(config.APP_NAME, JSON.stringify(storageObj))),
      COOKIE: (() => document.cookie = config.APP_NAME+'='+atob(JSON.stringify(storageObj))), 
      WINDOW: (() => ((window as any)[config.APP_NAME] = storageObj))
    })[config.AUTH_TOKEN_STORAGE_METHOD]();

  }, [storageObj]);

  return (<StorageContext.Provider value={[storageObj, setStorageObj]}>{children}</StorageContext.Provider>);
};

export default Storage;