import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ModalContext } from '../components/modal/modal';
import { StorageContext } from '../components/storage/storage-context';
import Gallery2 from '../components/gallery/gallery2';

import HttpService from '../services/http.service';
import config from '../config/config';
import Gallery3 from '../components/gallery/gallery3';
import QuickForm, { QuickFormSchemaMetaType } from '../components/quick-form/quick-form';
import { COMMON_REGEXES, Schema } from '../services/validation.service';
import { ServicePromise } from '../services/services';

type HD = {
  rootSizeBytes: number,
  mediaSizeBytes: number,
  tracksSizeBytes: number,
  maxSizeGB: number
};

const buttons: { title: string, route: string, svg: React.ReactElement<SVGElement> }[] = [
  { title: 'Users', route: '/admin/users', svg: (<svg xmlns="http://www.w3.org/2000/svg" height="4em" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>)},
  { title: 'Media', route: '/admin/media', svg: (<svg xmlns="http://www.w3.org/2000/svg" height="4em" viewBox="0 0 640 512"><path d="M256 0H576c35.3 0 64 28.7 64 64V288c0 35.3-28.7 64-64 64H256c-35.3 0-64-28.7-64-64V64c0-35.3 28.7-64 64-64zM476 106.7C471.5 100 464 96 456 96s-15.5 4-20 10.7l-56 84L362.7 169c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h80 48H552c8.9 0 17-4.9 21.2-12.7s3.7-17.3-1.2-24.6l-96-144zM336 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM64 128h96V384v32c0 17.7 14.3 32 32 32H320c17.7 0 32-14.3 32-32V384H512v64c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V192c0-35.3 28.7-64 64-64zm8 64c-8.8 0-16 7.2-16 16v16c0 8.8 7.2 16 16 16H88c8.8 0 16-7.2 16-16V208c0-8.8-7.2-16-16-16H72zm0 104c-8.8 0-16 7.2-16 16v16c0 8.8 7.2 16 16 16H88c8.8 0 16-7.2 16-16V312c0-8.8-7.2-16-16-16H72zm0 104c-8.8 0-16 7.2-16 16v16c0 8.8 7.2 16 16 16H88c8.8 0 16-7.2 16-16V416c0-8.8-7.2-16-16-16H72zm336 16v16c0 8.8 7.2 16 16 16h16c8.8 0 16-7.2 16-16V416c0-8.8-7.2-16-16-16H424c-8.8 0-16 7.2-16 16z"/></svg>)},
  { title: 'Tracks', route: '/admin/tracks', svg: (<svg xmlns="http://www.w3.org/2000/svg" height="4em" viewBox="0 0 512 512"><path d="M499.1 6.3c8.1 6 12.9 15.6 12.9 25.7v72V368c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V147L192 223.8V432c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V200 128c0-14.1 9.3-26.6 22.8-30.7l320-96c9.7-2.9 20.2-1.1 28.3 5z"/></svg>          )},
  { title: 'Events', route: '/admin/events', svg: (<svg xmlns="http://www.w3.org/2000/svg" height="4em" viewBox="0 0 448 512"><path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192h80v56H48V192zm0 104h80v64H48V296zm128 0h96v64H176V296zm144 0h80v64H320V296zm80-48H320V192h80v56zm0 160v40c0 8.8-7.2 16-16 16H320V408h80zm-128 0v56H176V408h96zm-144 0v56H64c-8.8 0-16-7.2-16-16V408h80zM272 248H176V192h96v56z"/></svg>          )},
  { title: 'Reviews', route: '/admin/reviews', svg: (<svg xmlns="http://www.w3.org/2000/svg" height="4em" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>        )},
  { title: 'Contacts', route: '/admin/contacts', svg: (<svg xmlns="http://www.w3.org/2000/svg" height="4em" viewBox="0 0 576 512"><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 256h64c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16c0-44.2 35.8-80 80-80zm-32-96a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zm256-32H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/></svg>       )},
  { title: 'News', route: '/admin/news', svg: (<svg xmlns="http://www.w3.org/2000/svg" height="4em" viewBox="0 0 448 512"><path d="M96 0C43 0 0 43 0 96V416c0 53 43 96 96 96H384h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V384c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H384 96zm0 384H352v64H96c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16zm16 48H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/></svg> )},
  { title: 'Mail List', route: '/admin/mail', svg: (<svg xmlns="http://www.w3.org/2000/svg" height="4em" viewBox="0 0 512 512"><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/></svg> )}
];

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

const Admin: React.FC<any> = (props: any) => {

  const modalContext = React.useContext(ModalContext);
  const [storageContext, setStorageContext] = React.useContext(StorageContext);
  const navigate = useNavigate();

  const [hd, setHD] = React.useState<HD | undefined>(undefined);

  const maintenanceButtons: { title: string, action: () => any, svg: React.ReactElement<SVGElement> }[] = [
    {
      title: 'Update',
      action: async () => {
        try {
          const user = storageContext.token ? JSON.parse(window.atob((storageContext.token).split('.')[1])) : undefined;
          if (!(user?.username)) {
            modalContext.toast!('error', 'Could not initiate update because user is not logged in.');
            navigate('/login');
            return;
          }
          const codegenRes = await HttpService.post('usergencode', { username: user.username });
          if (!codegenRes.success) {
            [
              `Could not send reset code for user ${user.username}!`,
              ...codegenRes.messages
            ].forEach(m => modalContext.toast!('error', m));
            return;
          }
          modalContext.toast!('success', `One-time passcode sent for user ${ user.username }!`);
          try {
            const modalRes = await (new Promise<{ code: string } | null>((res, rej) => modalContext.modal!({
              node: (<CodeModal prompt={'Warning: Updating will cause temporary site outage. Please enter code sent to your email below to proceed with update.'} resolve={res}/>),
              resolve: res , reject: rej
            })));
            modalContext.modal!();
            if (modalRes?.code) {
              try {
                const updateRes = await HttpService.post<ServicePromise>('update', { code: modalRes.code, username: user.username });
                updateRes.messages.forEach(m => modalContext.toast!(updateRes.success ? 'success' : 'error', m));
                if (!updateRes.success) { updateRes.messages.forEach(m => console.log(m)); }
              } catch { }
            }
          } catch { }
        } catch { }
      },
      svg: <svg xmlns="http://www.w3.org/2000/svg" height="4em" viewBox="0 0 512 512"><path d="M305.8 2.1C314.4 5.9 320 14.5 320 24V64h16c70.7 0 128 57.3 128 128V358.7c28.3 12.3 48 40.5 48 73.3c0 44.2-35.8 80-80 80s-80-35.8-80-80c0-32.8 19.7-61 48-73.3V192c0-35.3-28.7-64-64-64H320v40c0 9.5-5.6 18.1-14.2 21.9s-18.8 2.3-25.8-4.1l-80-72c-5.1-4.6-7.9-11-7.9-17.8s2.9-13.3 7.9-17.8l80-72c7-6.3 17.2-7.9 25.8-4.1zM104 80A24 24 0 1 0 56 80a24 24 0 1 0 48 0zm8 73.3V358.7c28.3 12.3 48 40.5 48 73.3c0 44.2-35.8 80-80 80s-80-35.8-80-80c0-32.8 19.7-61 48-73.3V153.3C19.7 141 0 112.8 0 80C0 35.8 35.8 0 80 0s80 35.8 80 80c0 32.8-19.7 61-48 73.3zM104 432a24 24 0 1 0 -48 0 24 24 0 1 0 48 0zm328 24a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg>
    },
    { 
      title: 'Shut Down',
      action: async () => {
        try {
          const user = storageContext.token ? JSON.parse(window.atob((storageContext.token).split('.')[1])) : undefined;
          if (!(user?.username)) {
            modalContext.toast!('error', 'Could not initiate shutdown because user is not logged in.');
            navigate('/login');
            return;
          }
          const codegenRes = await HttpService.post('usergencode', { username: user.username });
          if (!codegenRes.success) {
            [
              `Could not send reset code for user ${user.username}!`,
              ...codegenRes.messages
            ].forEach(m => modalContext.toast!('error', m));
            return;
          }
          modalContext.toast!('success', `One-time passcode sent for user ${ user.username }!`);
          try {
            const modalRes = await (new Promise<{ code: string } | null>((res, rej) => modalContext.modal!({
              node: (<CodeModal prompt={'Warning: App can not be restarted without direct server access. If you are sure you want to proceed, please enter code sent to your email below.'} resolve={res}/>),
              resolve: res , reject: rej
            })));
            modalContext.modal!();
            if (modalRes?.code) {
              try {
                const shutdownRes = await HttpService.post<ServicePromise>('shutdown',  { code: modalRes.code, username: user.username });
                shutdownRes.messages.forEach(m => modalContext.toast!(shutdownRes.success ? 'success' : 'error', m));
              } catch { }
            }
          } catch { }
        } catch { }
      },
      svg: <svg xmlns="http://www.w3.org/2000/svg" height="4em" viewBox="0 0 512 512"><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V256c0 17.7 14.3 32 32 32s32-14.3 32-32V32zM143.5 120.6c13.6-11.3 15.4-31.5 4.1-45.1s-31.5-15.4-45.1-4.1C49.7 115.4 16 181.8 16 256c0 132.5 107.5 240 240 240s240-107.5 240-240c0-74.2-33.8-140.6-86.6-184.6c-13.6-11.3-33.8-9.4-45.1 4.1s-9.4 33.8 4.1 45.1c38.9 32.3 63.5 81 63.5 135.4c0 97.2-78.8 176-176 176s-176-78.8-176-176c0-54.4 24.7-103.1 63.5-135.4z"/></svg>
    }
  ];

  React.useEffect(() => {
    (async () => {

      if (!(storageContext.token)) {
        navigate('/login');
      }

      const hd = await HttpService.get<HD>('calchdusage');
      if (hd.success && hd.body) {
        setHD(hd.body);
      }

    })();
  }, []);

  return (
    <div className='py-16 diamonds'>

      <h1 className="text-xl gold-text text-center align-middle inline-block ml-2 md:ml-8 mt-16">
        &nbsp;&nbsp;Admin&nbsp;&nbsp;
      </h1>

      <div className="text-center p-1 m-1 md:p-8 md:m-8 bg-gradient-to-br from-pink-200 via-pink-300 to-pink-200 bg-opacity-90 rounded-lg">
        <div className='p-4 md:p-8 m-1 rounded-lg bg-gradient-to-br from-pink-100 via-pink-200 to-pink-100'>
          <h1 className='py-8'>User</h1>
          {
            (() => {
              const u = storageContext.token ? JSON.parse(window.atob((storageContext.token).split('.')[1])) : '';

              return (
                <div className='flex justify-center'>
                  {/* {JSON.stringify(u)} */}
                  <div className="avatar p-5">
                    <div className="w-10 rounded-full">
                      {
                        (storageContext['token'] && storageContext.user?.avatar) &&
                          <img src={`${config.ASSETS[config.ENVIRONMENT]}media/${storageContext.user.avatar}`} />
                      }
                      {
                        !(storageContext['token'] && storageContext.user?.avatar) &&
                          <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" className="ml-2.5 mt-2" viewBox="0 0 448 512"><path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"/></svg>
                      }
                    </div>
                  </div>
                  <div className='inline-flex self-center p-5'>
                    { u.username }
                  </div>
                </div>
              )
            })()
          }
        </div>

        <div className='p-4 md:p-8 m-1 rounded-lg bg-gradient-to-br from-pink-100 via-pink-200 to-pink-100'>
          
          <h1 className='py-8'>Storage {hd ? `${((hd.rootSizeBytes) / 1073741824).toFixed(2)}gb / ${hd.maxSizeGB}gb` : ``}</h1>
          {
            !!hd && (
              <div className="relative mb-8 mx-1 md:mx-5 pt-1">

                <div className="mb-4 flex h-4 overflow-hidden rounded-lg bg-gray-100 text-xs">
                  <div 
                    className="bg-green-500 transition-all duration-500 ease-out text-center overflow-hidden" 
                    style={{width: `${(hd.mediaSizeBytes / 1073741824) / hd.maxSizeGB * 100}%`}}
                  >media</div>
                  <div 
                    className="bg-yellow-500 transition-all duration-500 ease-out text-center overflow-hidden"
                    style={{width: `${(hd.tracksSizeBytes / 1073741824) / hd.maxSizeGB * 100}%`}}
                  >music</div>
                  <div 
                    className="bg-red-500 transition-all duration-500 ease-out text-center overflow-hidden"
                    style={{width: `${((hd.rootSizeBytes - hd.mediaSizeBytes - hd.tracksSizeBytes) / 1073741824) / hd.maxSizeGB * 100}%`}}
                  >system</div>
                </div>
                <div className="mb-2 flex items-center justify-between text-xs">
                  <div className="text-gray-600">{`${((hd.rootSizeBytes / 1073741824) / hd.maxSizeGB * 100).toFixed(2)}%`}</div>
                  <div className="text-gray-600">100%</div>
                </div>

                <table className="table-auto mx-auto my-2 table-compact md:table-normal bg-slate-100 rounded-lg">
                  <thead>
                    <tr>
                      <th>Key</th>
                      <th>Category</th>
                      <th>Size</th>
                      <th>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><div className='bg-green-500 w-6 md:w-8 h-8 rounded-md inline-block'></div></td>
                      <td>Media</td>
                      <td>{`${(hd.mediaSizeBytes / 1073741824).toFixed(2)}gb`}</td>
                      <td>{`${((hd.mediaSizeBytes / 1073741824) / hd.maxSizeGB * 100).toFixed(2)}%`}</td>
                    </tr>
                    <tr>
                      <td><div className='bg-yellow-500 w-6 md:w-8 h-8 rounded-md inline-block'></div></td>
                      <td>Tracks</td>
                      <td>{`${(hd.tracksSizeBytes / 1073741824).toFixed(2)}gb`}</td>
                      <td>{`${((hd.tracksSizeBytes / 1073741824) / hd.maxSizeGB * 100).toFixed(2)}%`}</td>
                    </tr>
                    <tr>
                      <td><div className='bg-red-500 w-6 md:w-8 h-8 rounded-md inline-block'></div></td>
                      <td>System</td>
                      <td>{`${((hd.rootSizeBytes - hd.mediaSizeBytes - hd.tracksSizeBytes) / 1073741824).toFixed(2)}gb`}</td>
                      <td>{`${(((hd.rootSizeBytes - hd.mediaSizeBytes - hd.tracksSizeBytes) / 1073741824) / hd.maxSizeGB * 100).toFixed(2)}%`}</td>
                    </tr>
                    <tr>
                      <td>-</td>
                      <td>Total</td>
                      <td>{`${((hd.rootSizeBytes) / 1073741824).toFixed(2)}gb`}</td>
                      <td>{`${((hd.rootSizeBytes / 1073741824) / hd.maxSizeGB * 100).toFixed(2)}%`}</td>
                    </tr>
                  </tbody>
                </table>

              </div>
            )
          }
          {
            !hd && (
              <div className="text-center">
                <div className="lds-roller mx-auto"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
              </div>
            )
          }

        </div>

      </div>

      {/* <div className="text-center p-1 m-1 md:p-8 md:m-8 bg-slate-400 bg-opacity-90 rounded-lg">
        <h1 className='mb-8'>Content Management</h1>
        {
          buttons.map((b, i) => (
            <Link 
              key={i}
              className='inline-block relative glass  w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 mx-2 my-1 rounded-md shadow-lg hover:shadow-xl cursor-pointer'
              to={b.route}
            >
              <div className=" absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 m-0">

                {b.svg}
                <p className='mt-4'>{b.title}</p>
              </div>
            </Link>
          ))
        }
      </div> */}

      <div className='bg-gradient-to-br from-pink-200 via-pink-300 to-pink-200 bg-opacity-90 text-center rounded-lg p-1 m-1  md:p-8 md:m-8'>
        <h1 className='py-8'>Theme</h1>
        <Gallery2>
            <Link 
              className='flex relative bg-white aspect-1 w-full rounded-md shadow-lg hover:shadow-xl cursor-pointer m-1'
              to={`/admin/theme`}
            >
              <div className=" absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 m-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 64C0 28.7 28.7 0 64 0L352 0c35.3 0 64 28.7 64 64l0 64c0 35.3-28.7 64-64 64L64 192c-35.3 0-64-28.7-64-64L0 64zM160 352c0-17.7 14.3-32 32-32l0-16c0-44.2 35.8-80 80-80l144 0c17.7 0 32-14.3 32-32l0-32 0-90.5c37.3 13.2 64 48.7 64 90.5l0 32c0 53-43 96-96 96l-144 0c-8.8 0-16 7.2-16 16l0 16c17.7 0 32 14.3 32 32l0 128c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32l0-128z"/></svg>
                <p className='mt-4'>Theme</p>
              </div>
            </Link>
        </Gallery2>
      </div>

      <div className='bg-gradient-to-br from-pink-200 via-pink-300 to-pink-200 bg-opacity-90 text-center rounded-lg p-1 m-1  md:p-8 md:m-8'>
        <h1 className='py-8'>Content Management</h1>
        <Gallery2>
        {
          buttons.map((b, i) => (
            <Link 
              key={i}
              className='flex relative bg-white aspect-1 w-full rounded-md shadow-lg hover:shadow-xl cursor-pointer m-1'
              to={b.route}
            >
              <div className=" absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 m-0">

                {b.svg}
                <p className='mt-4'>{b.title}</p>
              </div>
            </Link>
          ))
        }
        </Gallery2>
      </div>

      <div className='bg-gradient-to-br from-rose-200 via-yellow-400 to-rose-200 text-center rounded-lg p-1 m-1  md:p-8 md:m-8'>
        <h1 className='py-8'>Site Maintenance v-1.02</h1>
        <Gallery2>
        {
          maintenanceButtons.map((b, i) => (
            <div 
              key={i}
              className='flex relative aspect-1 w-full rounded-md shadow-lg hover:shadow-xl cursor-pointer m-1 bg-red-500'
              onClick={b.action}
            >
              <div className=" absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 m-0">

                {b.svg}
                <p className='mt-4'>{b.title}</p>
              </div>
            </div>
          ))
        }
        </Gallery2>
      </div>

    </div>
  );
}

export default Admin;
