import React from "react";
import { useNavigate } from "react-router-dom";
import Media from "../../components/admin/media/media";

import { ModalContext } from "../../components/modal/modal";
import { StorageContext } from "../../components/storage/storage-context";
import HttpService from "../../services/http.service";

const AdminMedia: React.FC<any> = (props: any) => {

  const modalContext = React.useContext(ModalContext);

  const [storageContext, setStorageContext] = React.useContext(StorageContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!(storageContext.token)) {
      navigate('/login');
    }
  }, []);
  
  const [media, setMedia] = React.useState<string[]>([]);
  
  const quickGet = async <T = void,>(route: string, params?: any): Promise<T | void> => HttpService.get<T>(route, params).then(res => {
    if (res.success && res.body) {
      modalContext.toast!('success', `GET request to ${route} successful.`);
      //res.messages?.forEach(m => modalContext.toast!('success', m));
      //console.log(route, res.messages);
      return res.body;
    } else {
      modalContext.toast!('warning', `GET request to ${route} failed.`);
      //res.messages.forEach(m => modalContext.toast!('warning', m));
      console.log(route, res.messages);
    }
  });
  return (
    <div className="py-16 px-2 md:px-4 mx-auto diamonds">

      <div className="flex items-center justify-between">
        <h1 className="text-xl gold-text text-center inline-block ml-2 md:ml-8">
          &nbsp;&nbsp;Admin Media&nbsp;&nbsp;
        </h1>
        <div className="">
          <button 
            className="btn btn-circle btn-lg ml-auto border border-white mr-2 md:mr-8"
            onClick={() => navigate('/admin')}
          >
            Close
          </button>
        </div>
      </div>

      <div className="text-center mx-2 md:mx-8 px-2 md:px-8 py-8 my-8  bg-gradient-to-br from-pink-200 via-pink-300 to-pink-200 rounded-lg">
        <Media media={media} setMedia={setMedia} quickGet={quickGet}></Media>
      </div>
    </div>
  )
}

export default AdminMedia;