import React from "react";
import { useNavigate } from 'react-router-dom';

import ValidationService, { Schema, COMMON_REGEXES } from "../services/validation.service";
import HttpService from "../services/http.service";

import AuthService from "../services/auth.service";

import { ModalContext } from "../components/modal/modal";
import { StorageContext } from '../components/storage/storage-context';
import QuickForm, { QuickFormSchemaMetaType } from "../components/quick-form/quick-form";
import { ServicePromise } from "../services/services";

const userSchema = {
  username: {
    required: true,
    type: 'string',
    minLength: 8,
    isusername: true
  },
  password: {
    required: true,
    type: 'string',
    minLength: 8,
    isPassword: true
  }
}

const userSchema2: Schema = {
  username: {
    type: "string",
    attributes: {
      required: true,
      strLength: { minLength: 8, maxLength: 40 }
    }
  },
  password: {
    type: COMMON_REGEXES.PASSWORD_STRONGEST,
    attributes: {
      required: true,
      strLength: { minLength: 8, maxLength: 40 }
    }
  },
  password2: {
    type: "string",
    attributes: {
      required: true,
      tests: [
        ((root, input) => {
          let t = root.password === input;
          if (t) {
            return { success: true } 
          } else {
            return { success: false, message: ` Passwords do not match!`}
          }
        })
      ]
    }
  }
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

const Register: React.FC<any> = (props: any) => {

  const [form, setForm] = React.useState<{username: string, password: string, password2: string}>({username: "", password: "", password2: ""});
  const [errors, setErrors] = React.useState<{username?: string[], password?: string[], password2?: string[]}>({});

  const modalContext = React.useContext(ModalContext);
  const [storageContext, setStorageContext] = React.useContext(StorageContext);
  const navigate = useNavigate();

  const updateForm = (key: string, value: string) => setForm({ ...form, [key]: value });

  React.useEffect(() => {
    if (!(storageContext.token)) {
      navigate('/login');
    }
  }, []);

  React.useEffect(() => {
    // useeffect function can't be directly async??
    (async () => {
      const errs = (await ValidationService.validate({ username: form.username, password: form.password, password2: form.password2 }, userSchema2)).body;
      const usernameErrs = errs?.filter(e => e.includes('username'));
      const passwordErrs = errs?.filter(e => (e.includes('password') && !(e.includes('password2'))));
      const password2Errs = errs?.filter(e => e.includes(`Passwords do not match!`)).map(e => e.replace('password2', ''));
      // const password2Errs = form.password === form.password2 ? [] : ['passwords do not match'];
      setErrors({
        username: form.username.length > 0 ? usernameErrs : undefined,
        password: form.password.length > 0 ? passwordErrs : undefined,
        password2: (form.password2.length > 0 || form.password.length > 0) ? password2Errs : undefined
      });
    })();

  }, [form]);

  const submit = () => {
    (async () => {
      try {
        const user = storageContext.token ? JSON.parse(window.atob((storageContext.token).split('.')[1])) : undefined;
        if (!(user?.username)) {
          modalContext.toast!('error', 'Could not initiate registration because user is not logged in.');
          navigate('/login');
          return;
        }
        const codegenRes = await HttpService.post('usergencode', { username: user.username });
        if (!codegenRes.success) {
          [
            `Could not send registration code for user ${user.username}!`,
            ...codegenRes.messages
          ].forEach(m => modalContext.toast!('error', m));
          return;
        }
        modalContext.toast!('success', `One-time passcode sent for user ${ user.username }!`);
        try {
          const modalRes = await (new Promise<{ code: string } | null>((res, rej) => modalContext.modal!({
            node: (<CodeModal prompt={'Please enter code sent to your email below to proceed with new user registration.'} resolve={res}/>),
            resolve: res , reject: rej
          })));
          modalContext.modal!();
          if (modalRes?.code) {
            try {
              const registerRes = await HttpService.post<ServicePromise>('register', { admin: user.username, username: form.username, password: form.password, code: modalRes.code });
              registerRes.messages.forEach(m => modalContext.toast!(registerRes.success ? 'success' : 'error', m));
              if (!registerRes.success) { registerRes.messages.forEach(m => console.log(m)); }
              if (registerRes.success) { navigate('/admin/users') }
            } catch { }
          }
        } catch { }
      } catch { }
    })();
  };

  return (
    <div className="py-16 fan">
      <div className="card w-96 bg-base-100 shadow-xl mx-auto mt-16 glass-light">
        <div className="card-body">
          <h2 className="card-title text-white">Register</h2>
          <div className="divider"></div>
          <div className="form-control">

            <label className="label">
              <span className="label-text text-white">Your Username</span>
            </label>
            <label className="input-group input-group-vertical">
              <span>Username</span>
              <input 
                type="text" placeholder="myusername" className="input input-bordered" value={form.username}
                onInput={(event: React.ChangeEvent<HTMLInputElement>) => updateForm('username', event.target.value)}
              />
              {
                (errors.username && errors.username.length > 0) && 
                <ul className="alert-error shadow-lg list-disc list-inside">
                  {
                    errors.username.map((e, i) => <li className="pl-4" key={i}>{e}</li>)
                  }
                </ul>
              }
            </label>

            <label className="label">
              <span className="label-text text-white">Your Password</span>
            </label>
            <label className="input-group input-group-vertical">
              <span>Password</span>
              <input 
                type="password" placeholder="password" className="input input-bordered" value={form.password}
                onInput={(event: React.ChangeEvent<HTMLInputElement>) => updateForm('password', event.target.value)}
              />
              {
                (errors.password && errors.password.length > 0) && 
                <ul className="alert-error shadow-lg list-disc list-inside">
                  {
                    errors.password.map((e, i) => <li className="pl-4" key={i}>{e}</li>)
                  }
                </ul>
              }
            </label>

            <label className="label">
              <span className="label-text">Confirm Password</span>
            </label>
            <label className="input-group input-group-vertical">
              <span>Password</span>
              <input 
                type="password" placeholder="password" className="input input-bordered" value={form.password2}
                onInput={(event: React.ChangeEvent<HTMLInputElement>) => updateForm('password2', event.target.value)}
              />
              {
                (errors.password2 && errors.password2.length > 0) && 
                <ul className="alert-error shadow-lg list-disc list-inside">
                  {
                    errors.password2.map((e, i) => <li className="pl-4" key={i}>{e}</li>)
                  }
                </ul>
              }
            </label>

            <button className="btn btn-wide mx-auto mt-8" 
              disabled={
                ((errors.username && !!(errors.username.length)) || !form.username.length) ||
                ((errors.password && !!(errors.password.length)) || !form.password.length) ||
                ((errors.password2 && !!(errors.password2.length)) || !form.password2.length)
              } 
              onClick={submit}
            >Submit</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register;