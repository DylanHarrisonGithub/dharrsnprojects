import React from "react";
import { useNavigate } from "react-router-dom";

import HttpService from "../../services/http.service";
import { ModalContext } from "../../components/modal/modal";
import { StorageContext } from "../../components/storage/storage-context";
import { Mail } from "../../definitions/models/Mail/Mail";

const AdminMail: React.FC<{}> = () => {

  const modalContext = React.useContext(ModalContext);
  const [storageContext, setStorageContext] = React.useContext(StorageContext);
  const navigate = useNavigate();

  const [mail, setMail] = React.useState<Mail[]>([]);
  const [busy, setBusy] = React.useState<boolean>(true);
  const [search, setSearch] = React.useState<string>('');

  React.useEffect(() => {
    if (!(storageContext.token)) {
      navigate('/login');
    }
  }, []);

  React.useEffect(() => setBusy(false), [mail]);

  React.useEffect(() => {
    (async () => {
      setBusy(true);
      const mailRes = await HttpService.get<Mail[]>('maillist');
      if (mailRes.success && mailRes.body) {
        setMail(mailRes.body);
        modalContext.toast!('success', mailRes.messages[0]);
      } else {
        modalContext.toast!('error', mailRes.messages[0]);
        setBusy(false);
      }
    })();
  }, []);

  return (
    <div className="py-16 px-2 md:px-4 mx-auto diamonds">

      <div className="flex items-center justify-between">
        <h1 className="text-xl gold-text text-center inline-block ml-2 md:ml-8">
          &nbsp;&nbsp;Admin Mailing List&nbsp;&nbsp;
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

      <div className='block mx-2 md:mx-8 my-4'>
        <input
          className="bg-gray-200 text-left appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          type="text"
          placeholder="Search Emails"
          value={search}
          onInput={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        />
      </div>


      <div className="mx-auto py-8 my-8  bg-gradient-to-br from-pink-200 via-pink-300 to-pink-200 rounded-lg">
        { 
          !!busy &&
            <div className="flex justify-center my-40 m-2">
              <div className="lds-roller mx-auto"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div>
        }
        {
          (!busy && !mail.filter(m => search ? m.email.includes(search) : true).length) && (
            <div className="flex justify-center py-20 m-2">
              <div className="mx-auto">no subscribers{ search ? ` matching search "${search}"` : ``}</div>
            </div>
          )
        }
        {
          !!mail.filter(m => search ? m.email.includes(search) : true).length && (
            <div className="text-center">
              <table className="p-4 text-left inline-block">
                {
                  mail.filter(m => search ? m.email.includes(search) : true).map(m => (
                    <tr className="m-2 p-2 rounded-lg bg-gradient-to-br mb-1 from-fuchsia-100 via-fuchsia-200 to-fuchsia-100">
                      <td className="">
                        <div className="inline-block mx-2">{`id: ${m.id}`}</div>
                        <div className="inline-block mx-2">{`email: ${m.email}`}</div>
                        <div className="inline-block mx-2">{`verified: ${m.verified}`}</div>
                      </td>
                      <td className=" align-top">
                          <button
                            className="btn btn-error mr-0"
                            onClick={async () => {
                              const decision = await modalContext.modal!({ prompt: `Are you sure you want to delete ${m.email} from mailing list?`, options: ['yes', 'no']});
                              if (decision && decision === 'yes') {
                                const delRes = await HttpService.delete('maildelete', { id: m.id });
                                modalContext.toast!(delRes.success ? 'success' : 'error', delRes.messages[0]);
                              }
                            }}
                          >delete</button>
                      </td>
                    </tr>
                  ))
                }
              </table>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default AdminMail;
