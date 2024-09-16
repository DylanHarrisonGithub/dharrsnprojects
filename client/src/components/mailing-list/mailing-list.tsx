import React from "react";

import QuickForm, { QuickFormSchemaMetaType } from "../quick-form/quick-form";

import { Schema, COMMON_REGEXES } from "../../services/validation.service";
import HttpService from "../../services/http.service";

import { ModalContext } from "../modal/modal";

import config from "../../config/config";
import { ServicePromise } from "../../services/services";

const MailSchema: Schema<QuickFormSchemaMetaType> = {
  email: {
    type: COMMON_REGEXES.EMAIL,
    attributes: { required: true, strLength: { minLength: 5, maxLength: 30 } },
    meta: {
      quickForm: {
        placeholder: 'Enter Email',
      }
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
}

const MailingList: React.FC<{}> = () => {

  const modalContext = React.useContext(ModalContext);

  const [email, setEmail] = React.useState<string>('');
  const [formErrors, setFormErrors] = React.useState<string[]>([]);

  return (
    <div>
      <div className="text-center p-6">
        <h1>Sign up for email alerts to stay up to date on {config.APP_NAME} news</h1>
        <div className="align-top p-4 m-4">
          <div className="inline-block w-full md:w-96">
            <QuickForm<{ email: string }> schema={MailSchema} onInput={(errors, model) => { setFormErrors(errors); setEmail(model.email); }} labelPlacement={"none"}/>
          </div>
          <div className="inline-block align-top mx-4">
            <button
              disabled={!!formErrors.length}
              className="btn btn-success mx-1"
              onClick={async () => {
                try {
                  const codegenRes = await HttpService.post<ServicePromise>('mailgencode', { email: email });
                  if (!codegenRes.success) {
                    codegenRes.messages.forEach(m => modalContext.toast!('error', m));
                    return;
                  }
                  try {
                    const modalRes = await (new Promise<{ code: string } | null>((res, rej) => modalContext.modal!({
                      node: (<CodeModal prompt={'Please enter code sent to your email to complete mailing list sign up process.'} resolve={res}/>),
                      resolve: res , reject: rej
                    })));
                    modalContext.modal!();
                    if (modalRes?.code) {
                      try {
                        const optRes = await HttpService.post<ServicePromise>('mailopt', { email: email, code: modalRes.code, opt: true });
                        optRes.messages.forEach(m => modalContext.toast!(optRes.success ? 'success' : 'error', m));
                      } catch { }
                    }
                  } catch { }
                } catch { }

              }}
            >Sign up</button>
            <button
              disabled={!!formErrors.length}
              className="btn btn-error mx-1"
              onClick={async () => {

                try {
                  const codegenRes = await HttpService.post<ServicePromise>('mailgencode', { email: email });
                  if (!codegenRes.success) {
                    codegenRes.messages.forEach(m => modalContext.toast!('error', m));
                    return;
                  }
                  try {
                    const modalRes = await (new Promise<{ code: string } | null>((res, rej) => modalContext.modal!({
                      node: (<CodeModal prompt={'Please enter code sent to your email to complete mailing list opt out process.'} resolve={res}/>),
                      resolve: res , reject: rej
                    })));
                    modalContext.modal!();
                    if (modalRes?.code) {
                      try {
                        const optRes = await HttpService.post<ServicePromise>('mailopt', { email: email, code: modalRes.code, opt: false });
                        optRes.messages.forEach(m => modalContext.toast!(optRes.success ? 'success' : 'error', m));
                      } catch { }
                    }
                  } catch { }
                } catch {}

              }}
            >Opt out</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MailingList