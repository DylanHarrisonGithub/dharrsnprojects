import React from "react";
import { useNavigate } from "react-router-dom";
import Users from "../../components/admin/users/users";
import HttpService from "../../services/http.service";
import { ModalContext } from "../../components/modal/modal";
import { StorageContext } from "../../components/storage/storage-context";

import MediaPicker from "../../components/quick-form/media-picker";
import QuickForm, { QuickFormSchemaMetaType } from "../../components/quick-form/quick-form";
import ValidationService, { COMMON_REGEXES, Schema } from "../../services/validation.service";
import AspectContainer from "../../components/aspect-container/aspect-container";
import AdminThemeForm from "../../components/admin/theme/theme-form";

const AdminTheme: React.FC<any> = (props: any) => {

  const modalContext = React.useContext(ModalContext);
  const [storageContext, setStorageContext] = React.useContext(StorageContext);
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = React.useState<{ key: string, message: string }[]>([]);
  const [touched, setTouched] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!(storageContext.token)) {
      navigate('/login');
    }
  }, []);

  
  return (
    <div className="py-16 px-2 md:px-4 mx-auto diamonds bg-gradient-to-br from-sla">

      <div className="flex items-center justify-between">
        <h1 className="text-xl gold-text text-center inline-block ml-2 md:ml-8">
          &nbsp;&nbsp;Admin Theme&nbsp;&nbsp;
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


      {
        storageContext.theme && <AdminThemeForm initTheme={(({ id, ...rest }) => rest)(storageContext.theme)}></AdminThemeForm>
      }

      
    </div>
  )
}

export default AdminTheme;