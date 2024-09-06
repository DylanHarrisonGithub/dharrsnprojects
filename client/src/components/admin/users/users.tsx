import React from 'react';
import { useNavigate } from 'react-router-dom';

import HttpService from '../../../services/http.service';
import StorageService from '../../../services/storage.service';

import { StorageContext } from '../../storage/storage-context';
import { ModalContext } from '../../modal/modal';

import config from '../../../config/config';

import { User } from '../../../models/models';
import UserForm from '../../user-form/user-form';
import { Schema, COMMON_REGEXES } from '../../../services/validation.service';
import QuickForm, { QuickFormSchemaMetaType } from '../../quick-form/quick-form';
import { ServicePromise } from '../../../services/services';

type Props = {
  users: User[],
  avatarImages: string[],
  setUsers: React.Dispatch<React.SetStateAction<User[]>>,
  quickGet: <T = void>(route: string) => Promise<T | void>
};

const CodeSchema: Schema<QuickFormSchemaMetaType> = {
  code: {
    type: COMMON_REGEXES.COMMON_WRITING,
    attributes: { required: true, strLength: { minLength: 1, maxLength: 16 }},
    meta: {
      quickForm: {
        placeholder: 'Enter Code'
      }
    }
  }
};

const CodeModal: React.FC<{ prompt: string, resolve: (value: {code: string } | null) => any }> = ({prompt, resolve}) => {

  const [code, setCode] = React.useState<string>('');
  const [formErrors, setFormErrors] = React.useState<string[]>([]);

  return (
    <div className="p-5">
      <h1>{prompt}</h1>
      <div className="align-top p-4">
        <div className="inline-block w-96">
          <QuickForm<{ code: string }> schema={CodeSchema} onInput={(errors, model) => { setFormErrors(errors); setCode(model.code); }} labelPlacement={"none"}/>
        </div>
        <div className="inline-block align-top mx-4">
          <button
            disabled={!!formErrors.length}
            className="btn btn-success mx-1"
            onClick={() => resolve({ code: code })}
          >Submit</button>
        </div>
      </div>
    </div>
  );
};

const Users: React.FC<Props> = ({users, avatarImages, setUsers, quickGet}) => {

  const navigate = useNavigate();

  const [storageContext, setStorageContext] = React.useContext(StorageContext);
  const modalContext = React.useContext(ModalContext);
  const init = React.useRef(true);

  React.useEffect(() => {
    if (init.current) {
      quickGet<User[]>('userlist').then(res => setUsers(res || []));
      init.current = false;
    }
    // const currentUser = users.find(u => u.id === storageContext.user.id);
    // currentUser && StorageService[config.APP_STORAGE_METHOD].store('user', { username: currentUser.username, id: currentUser.id, avatar: currentUser.avatar } );
  }, [users]);

  return (
    <span>
      <div className="container mx-auto p-4 text-center">
        {users.map((user) => (
          <div 
            key={user.id} 
            className={`shadow-lg glass  m-1 p-4 lg:p-8 rounded-lg text-black inline-block mx-auto text-left md:text-center border-solid ${
              user.id === storageContext.user?.id ? 'shadow-pink-600' : ''}`}
          >
            <label className='avatar'>
              <div className="w-16 rounded-full inline-block">
                <img 
                  src={config.ASSETS[config.ENVIRONMENT] + `media/${user.avatar}`}
                  alt={`Avatar for ${user.username}`}
                />
              </div>
            </label>
            <div className="m-4 md:m-2 inline-block">
              <strong>ID:</strong> {user.id}
            </div>
            <div className="m-2 inline-block">
              <strong>Username:</strong> {user.username}
            </div>
            <div className="m-2 inline-block">
              <strong>Privilege:</strong> {user.privilege}
            </div>
            <div className='text-center md:inline-block'>
              <button
                disabled={storageContext.user?.id === user.id}
                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 m-2 rounded mr-2 md:block md:w-full disabled:btn-disabled"
                onClick={async () => {
                  try {
                    const currentUser = storageContext.token ? JSON.parse(window.atob((storageContext.token).split('.')[1])) : undefined;
                    if (!(currentUser?.username)) {
                      modalContext.toast!('error', 'Could not initiate user deletion because user is not logged in.');
                      navigate('/login');
                      return;
                    }
                    if (storageContext.user?.id === user.id) { // should be unreacheable but for good measure
                      modalContext.toast!('error', 'Could not initiate user deletion because user is not allowed to delete themself.');
                      return;
                    }
                    const codegenRes = await HttpService.post('usergencode', { username: currentUser.username });
                    if (!codegenRes.success) {
                      [
                        `Could not send user deletion code for user ${currentUser.username}!`,
                        ...codegenRes.messages
                      ].forEach(m => modalContext.toast!('error', m));
                      return;
                    }
                    modalContext.toast!('success', `One-time passcode sent for user ${ currentUser.username }!`);
                    try {
                      const modalRes = await (new Promise<{ code: string } | null>((res, rej) => modalContext.modal!({
                        node: (<CodeModal prompt={`Please enter code sent to your email below to proceed with user ${user.username} deletion.`} resolve={res}/>),
                        resolve: res , reject: rej
                      })));
                      modalContext.modal!();
                      if (modalRes?.code) {
                        try {
                          const registerRes = await HttpService.delete<ServicePromise>('userdelete', { admin: currentUser.username, id: user.id, code: modalRes.code });
                          registerRes.messages.forEach(m => modalContext.toast!(registerRes.success ? 'success' : 'error', m));
                          if (!registerRes.success) { registerRes.messages.forEach(m => console.log(m)); }
                          if (registerRes.success) { init.current = false; quickGet<User[]>('userlist').then(res => setUsers(res || [])); }
                        } catch { }
                      }
                    } catch { }
                  } catch { }
                }}
              >
                Delete
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 m-2 rounded md:block md:w-full"
                onClick={() => {
                  (new Promise<User>((res, rej) => {
                    modalContext.modal!({node: (
                      <UserForm user={user} resolve={res} avatarList={avatarImages}/>
                    ), resolve: res, reject: rej});
                  })).then(async ({ id, ...rest }) => {
                    modalContext.modal!();
                    // const { id, ...rest } = result;
                    const updateResponse = await HttpService.patch<void>('userupdate', { id: user.id, update: rest});
                    updateResponse.messages.forEach(m => modalContext.toast!(updateResponse.success ? 'success' : 'warning', m));
                    if (updateResponse.success) {
                      quickGet<User[]>('userlist').then(res => setUsers(res || []));
                    }
                  }).catch(err => {});
                }}
              >
                Edit
              </button>
            </div>

          </div>
        ))}
      </div>
    </span>
  );
}

export default Users;