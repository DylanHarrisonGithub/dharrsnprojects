import React from "react";
import { useNavigate } from 'react-router-dom';

import QuickForm, { QuickFormSchemaMetaType } from "../components/quick-form/quick-form";
import { Schema, COMMON_REGEXES } from "../services/validation.service";

import HttpService from "../services/http.service";
import AuthService from "../services/auth.service";
import StorageService from "../services/storage.service";

import { ModalContext } from "../components/modal/modal";

import config from "../config/config";


const resetSchema: Schema<QuickFormSchemaMetaType> = {
  code: { type: 'string', attributes: { required: true, strLength: { minLength: 6, maxLength: 6 } }, meta: {
    quickForm: {
      placeholder: 'CODE'
    }
  }},
  password1: { type: COMMON_REGEXES.PASSWORD_STRONGEST, attributes: { required: true }, meta: {
    quickForm: {
      placeholder: 'Password'
    }
  }},
  password2: { type: COMMON_REGEXES.PASSWORD_STRONGEST, attributes: { required: true, tests: [(ir, i,) => ({
    success: i === ir.password1,
    message: i === ir.password1 ? undefined : `Passwords do not match!`
  })] }, meta: {
    quickForm: {
      placeholder: 'Re-type password'
    }
  }}
};

const PwdResetModal: React.FC<{ username: string, resolve: (value: {code: string, password: string} | null) => any }> = ({ username, resolve }) => {
  
  const [model, setModel] = React.useState<{ code: string, password: string }>({ code: '', password: ''});
  const [errors, setErrors] = React.useState<string[]>([]);
  const [touched, setTouched] = React.useState<boolean>(false);

  return (
    <div>
      <div className="text-center p-5">
        <label >Password reset for {username}</label>
      </div>
      <QuickForm<{ code: string, password1: string }> labelPlacement="none" schema={resetSchema} onInput={(errs, model2) => { setErrors(errs); setModel({ code: model2.code, password: model2.password1 }); setTouched(true); }}/>
      <button
        className={'btn btn-primary float-right'}
        disabled={!touched || !!errors.length}
        onClick={() => resolve({code: model.code, password: model.password})}
      >
        Submit
      </button>
    </div>
  );
}

const Login: React.FC<any> = (props: any) => {

  const [form, setForm] = React.useState<{username: string, password: string}>({username: "", password: ""});

  const updateForm = (key: string, value: string) => setForm({ ...form, [key]: value });

  const modalContext = React.useContext(ModalContext);

  const navigate = useNavigate();

  const submit = () => {
    HttpService.post<{ token: string, user: any }>('login', { username: form.username, password: form.password }).then(async res => {     

      // console.log(res);
      if (!res.success) {
        modalContext.toast?.('error', 'Error occured attempting to login.');
        res.messages.forEach(m => modalContext.toast!('warning', m));
      } else {
        console.log(res);
        if (res.body?.token) {
          res.messages.forEach(m => modalContext.toast?.('success', m));
          await AuthService.storeToken(res.body.token);
          await StorageService[config.APP_STORAGE_METHOD].store('user', res.body.user );
          navigate('/admin');
        } else {
          modalContext.toast?.('error', 'Error occured attempting to login.');
          res.messages.forEach(m => modalContext.toast?.('error', m));
        }
      }
    }).catch(err => {
      console.log(err);
      modalContext.toast?.('error', 'Unknown error occured attempting to login.');
      modalContext.toast?.('error', err.toString());
    });
  };

  return (
    <div className="py-16">
      <div className="card w-96 bg-base-100 shadow-xl mx-auto mt-16 glass-light">
        <div className="card-body">
          <h2 className="card-title text-white">Login</h2>
          <div className="divider"></div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-white">Your Username</span>
            </label>
            <label className="input-group input-group-vertical">
              <span>Username</span>
              <input type="text" placeholder="myusername" className="input input-bordered"
                value={form.username}
                onInput={(event: React.ChangeEvent<HTMLInputElement>) => updateForm('username', event.target.value)}
              />
            </label>
            <label className="label">
              <span className="label-text text-white">Your Password</span>
            </label>
            <label className="input-group input-group-vertical">
              <span>Password</span>
              <input type="password" placeholder="password" className="input input-bordered" 
                value={form.password}
                onInput={(event: React.ChangeEvent<HTMLInputElement>) => updateForm('password', event.target.value)}
              />
            </label>
            <button className="btn btn-wide mx-auto mt-8"
              disabled={!(form.username.length && form.password.length)}
              onClick={submit}
            >Submit</button>

            <button
              className="btn btn-wide mx-auto mt-8"
              disabled={!form.username.length}
              onClick={() => {
                HttpService.post('usergencode', { username: form.username }).then(res => res.success ? 
                    modalContext.toast!('success', `Password reset code sent for user ${form.username}!`)
                  :
                    [
                      `Could not send reset code for user ${form.username}!`,
                      ...res.messages
                    ].forEach(m => modalContext.toast!('error', m))
                );
                (new Promise<{ code: string, password: string} | null>((res, rej) => modalContext.modal!({
                  node: (<PwdResetModal username={form.username} resolve={res}/>),
                  resolve: res , reject: rej
                }))).then(res => {
                  modalContext.modal!();
                  // console.log(res);
                  HttpService.patch('userpwdreset', { username: form.username, code: res?.code, password: res?.password }).then(res => res.success ? 
                    modalContext.toast!('success', `Password reset for user ${form.username}!`)
                  :
                    [
                      `Could not reset password for user ${form.username}!`,
                      ...res.messages
                    ].forEach(m => modalContext.toast!('error', m))
                );
                }).catch(err => {});
              }}
            >
              Forgot password
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;