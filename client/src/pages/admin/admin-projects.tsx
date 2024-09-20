import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import InfiniteContentScroller from "../../components/infinite-content-scroller/infinite-content-scroller";
import { Theme } from "../../definitions/models/Theme/Theme";
import { Project } from "../../definitions/models/Project/Project";
import ProjectModel from "../../definitions/models/Project/Project";
import { StorageContext } from "../../components/storage/storage-context";
import ProjectDetail from "../../components/project-detail";
import QuickForm, { QuickFormSchemaMetaType } from "../../components/quick-form/quick-form";
import { Schema } from "../../services/validation.service";
import ValidationService from "../../services/validation.service";
import HttpService from "../../services/http.service";
import { ModalContext } from "../../components/modal/modal";
import MediaPicker from "../../components/quick-form/media-picker";

const extendedProjectSchema: Schema<QuickFormSchemaMetaType> = (({ thumbnail, title, links, technologies, features, description, media, projectType }) => ({
  thumbnail: { ...thumbnail, meta: { quickForm: { CustomInput: MediaPicker, customInputProps: { } }}},
  title,
  links,
  technologies,
  features,
  description,
  media,
  projectType
}) as Schema<QuickFormSchemaMetaType>)(ProjectModel.schema);

const AdminProjects: React.FC<any> = (props: any) => {

  const modalContext = React.useContext(ModalContext);
  const [storageContext, setStorageContext] = React.useContext(StorageContext);
  const navigate = useNavigate();

  const [theme, setTheme] = React.useState<Theme | undefined>(undefined);
  const { id } = useParams();

  const [projects, setProjects] = React.useState<Project[]>([]);
  const [model, setModel] = React.useState<Project>({thumbnail: '', title: '', links: [], technologies: [], features: [], description: '', media: [], projecttype: 'app', id: -1, search: ''});
  const [formErrors, setFormErrors] = React.useState<{ key: string, message: string }[]>([]);
  const [touched, setTouched] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>('');

  React.useEffect(() => setTheme(storageContext.theme as Theme), [storageContext.theme]);

  const inputHandler = (err: string[], keyvalues: Partial<Pick<Project, "thumbnail" | "title" | "links" | "technologies" | "features" | "description" | "media" | "projecttype">>) => {
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
    <div className="py-16 px-4 mx-auto">

      <div>
        <QuickForm
          schema={extendedProjectSchema}
          onInput={inputHandler}
        />
        <button className={`btn my-4 float-right`}  onClick={() => {  
          (async () => {
            const res = await HttpService.post('projectcreate', model);
            if (res.success) {
              modalContext.toast?.('success', 'Message has been received!');
              setModel({thumbnail: '', title: '', links: [], technologies: [], features: [], description: '', media: [], projecttype: 'app', id: -1, search: ''});
              setTouched(false);
            } else {
              modalContext.toast?.('error', 'Failed submit message!');
              console.log(res.messages);
            }
          })();
        }}>Submit</button>
      </div>
      <div className="text-center p-1 m-3 mt-4">
        <div className='inline-block relative mx-2 my-4 align-top text-left w-11/12 md:w-4/12'>
          <div className="text-left">
            <h1 className="text-xl text-center align-middle inline-block text-white">
              &nbsp;&nbsp;Admin Projects&nbsp;&nbsp;
            </h1>
          </div>
        </div>

        <div className='inline-block relative mx-2 my-3 w-11/12 md:w-5/12 text-left'>
          <input
            className="bg-gray-200 text-left md:text-right appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-slate-400"
            type="text"
            placeholder="Search Projects"
            value={search}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className={`p-1 `}>
        <InfiniteContentScroller<Project> contentStreamingRoute={'projectstream'} content={projects} contentSetter={setProjects} search={search} id={id}>
          {
            projects.map((u, i) => (<ProjectDetail key={i} project={u} />))
          }
        </InfiniteContentScroller>
      </div>

    </div>
  );
}

export default AdminProjects;