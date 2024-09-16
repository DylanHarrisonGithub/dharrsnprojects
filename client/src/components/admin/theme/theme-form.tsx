import React from "react";
import HttpService from "../../../services/http.service";
import { ModalContext } from "../../../components/modal/modal";
import { StorageContext } from "../../../components/storage/storage-context";

import MediaPicker from "../../../components/quick-form/media-picker";
import QuickForm, { QuickFormSchemaMetaType } from "../../../components/quick-form/quick-form";
import { Schema } from "../../../services/validation.service";
import ValidationService from "../../../services/validation.service";
import AspectContainer from "../../../components/aspect-container/aspect-container";

import Gallery2 from "../../../components/gallery/gallery2";
import { Theme } from "../../../definitions/models/Theme/Theme";

type ThemeForm = Omit<Theme, "id">;

const colors = {
  red: "bg-gradient-to-br from-red-200 via-red-300 to-red-300",
  orange: "bg-gradient-to-br from-orange-200 via-orange-300 to-orange-300",
  yellow: "bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-300",
  green: "bg-gradient-to-br from-green-200 via-green-300 to-green-300",
  blue: "bg-gradient-to-br from-blue-200 via-blue-300 to-blue-300",
  pink: "bg-gradient-to-br from-pink-200 via-pink-300 to-pink-200",
  purple: "bg-gradient-to-br from-indigo-200 via-purple-300 to-indigo-200",
  gold: "bg-gradient-to-br from-gold-200 via-gold-300 to-gold-300",
  white: "bg-gradient-to-br from-slate-50 via-slate-200 to-slate-100",
  black: "bg-gradient-to-br from-slate-700 via-slate-900 to-slate-700"
}

const themeFormSchema: Schema<QuickFormSchemaMetaType> = {
  herovideo: { 
    type: 'string', 
    attributes: { required: true, strLength: { minLength: 1, maxLength: 256 } },
    meta: { quickForm: { CustomInput: MediaPicker, customInputProps: { mediaType: 'video' } } }
  },
  heroimage: { 
    type: 'string', 
    attributes: { required: true, strLength: { minLength: 1, maxLength: 256 }}, 
    meta: { quickForm: { CustomInput: MediaPicker, customInputProps: { } }}
  },
  herotext: { 
    type: 'string', 
    attributes: { required: true, strLength: { maxLength: 2048 }},
    meta: { quickForm: { textArea: true, textAreaRows: 4, placeholder: 'Write your hero text here...' } }
  },
  threecard1title: { type: 'string', attributes: { required: true, strLength: { minLength: 1, maxLength: 256 }}},
  threecard1image: { 
    type: 'string', 
    attributes: { required: true, strLength: { minLength: 1, maxLength: 256 }},
    meta: { quickForm: { CustomInput: MediaPicker, customInputProps: { } } }
  },
  threecard1text: { 
    type: 'string', 
    attributes: { required: true, strLength: { maxLength: 2048 }},
    meta: { quickForm: { textArea: true, textAreaRows: 4, placeholder: 'Write your description here...' } }
  },
  threecard2title: { type: 'string', attributes: { required: true, strLength: { minLength: 1, maxLength: 256 }}},
  threecard2image: { type: 'string', attributes: { required: true, strLength: { minLength: 1, maxLength: 256 }},
    meta: {
      quickForm: {
        CustomInput: MediaPicker,
        customInputProps: { }
      }
    }
  },
  threecard2text: { type: 'string', attributes: { required: true, strLength: { maxLength: 2048 }}, 
    meta: {
      quickForm: {
        textArea: true, textAreaRows: 4,
        placeholder: 'Write your description here...'
      }
    }
  },
  threecard3title: { type: 'string', attributes: { required: true, strLength: { minLength: 1, maxLength: 256 }}},
  threecard3image: { type: 'string', attributes: { required: true, strLength: { minLength: 1, maxLength: 256 }},
    meta: {
      quickForm: {
        CustomInput: MediaPicker,
        customInputProps: { }
      }
    }
  },
  threecard3text: { type: 'string', attributes: { required: true, strLength: { maxLength: 2048 }},
    meta: {
      quickForm: {
        textArea: true, textAreaRows: 4,
        placeholder: 'Write your description here...'
      }
    }
  },
  about: { type: 'string', attributes: { required: true, strLength: { maxLength: 4096 }},
    meta: {
      quickForm: {
        textArea: true, textAreaRows: 4,
        placeholder: 'Write your description here...'
      }
    }
  },
  card1color: { type: [...Object.keys(colors)], attributes: { required: true, strLength: { minLength: 1, maxLength: 256 }}},
  card2color: { type: [...Object.keys(colors)], attributes: { required: true, strLength: { minLength: 1, maxLength: 256 }}},
  font: { type: 'string', attributes: { required: true, strLength: { minLength: 1, maxLength: 256 }}},
}

const heroPartitionedFormSchema = (({ herovideo, heroimage, herotext }) => ({ herovideo, heroimage, herotext }))(themeFormSchema);

const AdminThemeForm: React.FC<{ initTheme: Theme }> = ({ initTheme }) => {

  const modalContext = React.useContext(ModalContext);
  const [storageContext, setStorageContext] = React.useContext(StorageContext);
  const [model, setModel] = React.useState<ThemeForm>(initTheme);
  const [formErrors, setFormErrors] = React.useState<{ key: string, message: string }[]>([]);
  const [touched, setTouched] = React.useState<boolean>(false);

  const inputHandler = (err: string[], keyvalues: Partial<ThemeForm>) => {

    // prepare new keyvalues and previous keyvalues for comparison
    let prevValueSorted = Object.keys(keyvalues).sort().reduce((accumulator, key) => ({ ...accumulator, [key]: model[key as keyof typeof model]}), {});
    let newValueSorted = Object.keys(keyvalues).sort().reduce((accumulator, key) => ({ ...accumulator, [key]: keyvalues[key as keyof typeof keyvalues]}), {});

    // avoid updating state without changes which triggers infinite loop
    if (JSON.stringify(prevValueSorted) !== JSON.stringify(newValueSorted)) {

      setModel(modl => ({ ...modl, ...keyvalues }));

      setFormErrors(fe => {
        Object.keys(keyvalues).forEach(k => {
          fe = fe.filter(fff => fff.key !== k)
        });
        err.forEach(e => {
          const key = e.split(' ')[0];
          fe = [ ...fe.filter(fff => fff.key !== key), { key: key, message: e }]
        })
        return fe;
      });

      setTouched(true);

    }

  };
  
  return (
    <div className="py-16 px-2 md:px-4 mx-auto">

      <div className={`py-8 bg-white`}>



        <div className=" flex mt-3 my-4 mx-8 px-8">
          {
            (touched && !!formErrors.length) &&
              <select 
                className="inline-block alert alert-error mr-2 h-12 pt-4 text-sm">
                { 
                  formErrors.map(err => (<option className="text-xs">{err.message}</option>))
                }
              </select>
          }
          <button className={`btn btn-primary mr-2 ml-auto`} disabled={!touched || !!Object.keys(formErrors).length} onClick={() => {  
            (async () => {
              
              const res = await HttpService.post('themecreate', model);
              
              if (res.success) {
                modalContext.toast?.('success', 'Theme updated!');
                setStorageContext?.(sc => ({ ...sc, theme: model }));
              } else {
                modalContext.toast?.('error', 'Failed to update theme');
                console.log(res.messages);
              }
            })();
          }}>Save</button>
          <button className="btn btn-warning mr-0" onClick={() => {  
            (async () => {
              const res = await HttpService.delete('themedelete');
              if (res.success && res.body) {
                setStorageContext?.(sc => ({ ...sc, theme: res.body }));
                setModel((({ id, ...rest }) => rest)(res.body as Theme));
                modalContext.toast?.('success', 'Theme reverted to previous configuration');
              } else {
                modalContext.toast?.('error', 'Failed to revert theme to previous configuration.');
                console.log(res.messages);
              }
            })()
          }}>Revert</button>
        </div>

      </div>

    </div>
  )
}

export default AdminThemeForm;