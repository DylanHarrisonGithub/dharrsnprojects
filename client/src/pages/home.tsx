import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Hero from "../components/hero/hero";
import HttpService from "../services/http.service";
import { StorageContext } from "../components/storage/storage-context";
import { Theme } from "../definitions/models/Theme/Theme";
import { timeData } from "../definitions/data/data";
import Carousel from "../components/carousel/carousel";
import QuickForm, { QuickFormSchemaMetaType } from "../components/quick-form/quick-form";
import { Schema, COMMON_REGEXES } from "../services/validation.service";

import ContactModel, { Contact } from "../definitions/models/Contact/Contact";
import { ModalContext } from "../components/modal/modal";
import ProjectCard from "../components/project-card";

import { Project } from "../definitions/models/Project/Project";

import config from "../config/config";
import LabeledSectionLeft from "../components/labeled-section/labeled-section-left";
import LabeledSectionRight from "../components/labeled-section/labeled-section-right";

const dummyProjects: Project[] = [
  { id: 1, thumbnail: '', title: 'title', links: ['a'], technologies: ['a', 'b'], features: ['a','a'], description: 'frdgjires', media: ['sdfg'], projecttype: "app", search: 'asdf' },
  { id: 1, thumbnail: '', title: 'title', links: ['a'], technologies: ['a', 'b'], features: ['a','a'], description: 'frdgjires', media: ['sdfg'], projecttype: "app", search: 'asdf' },
  { id: 1, thumbnail: '', title: 'title', links: ['a'], technologies: ['a', 'b'], features: ['a','a'], description: 'frdgjires', media: ['sdfg'], projecttype: "app", search: 'asdf' },
  { id: 1, thumbnail: '', title: 'title', links: ['a'], technologies: ['a', 'b'], features: ['a','a'], description: 'frdgjires', media: ['sdfg'], projecttype: "app", search: 'asdf' },
  { id: 1, thumbnail: '', title: 'title', links: ['a'], technologies: ['a', 'b'], features: ['a','a'], description: 'frdgjires', media: ['sdfg'], projecttype: "app", search: 'asdf' },
  { id: 1, thumbnail: '', title: 'title', links: ['a'], technologies: ['a', 'b'], features: ['a','a'], description: 'frdgjires', media: ['sdfg'], projecttype: "app", search: 'asdf' },
  { id: 1, thumbnail: '', title: 'title', links: ['a'], technologies: ['a', 'b'], features: ['a','a'], description: 'frdgjires', media: ['sdfg'], projecttype: "app", search: 'asdf' },
];

const svgs = {
  up: (<svg className="h-12 mx-auto block rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="#e6e6e6" d="M2 334.5c-3.8 8.8-2 19 4.6 26l136 144c4.5 4.8 10.8 7.5 17.4 7.5s12.9-2.7 17.4-7.5l136-144c6.6-7 8.4-17.2 4.6-26s-12.5-14.5-22-14.5l-72 0 0-288c0-17.7-14.3-32-32-32L128 0C110.3 0 96 14.3 96 32l0 288-72 0c-9.6 0-18.2 5.7-22 14.5z"/></svg>),
  down: (<svg className="h-12 mx-auto block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="#e6e6e6" d="M2 334.5c-3.8 8.8-2 19 4.6 26l136 144c4.5 4.8 10.8 7.5 17.4 7.5s12.9-2.7 17.4-7.5l136-144c6.6-7 8.4-17.2 4.6-26s-12.5-14.5-22-14.5l-72 0 0-288c0-17.7-14.3-32-32-32L128 0C110.3 0 96 14.3 96 32l0 288-72 0c-9.6 0-18.2 5.7-22 14.5z"/></svg>),
  downblack: (<svg className=" h-12 mx-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M2 334.5c-3.8 8.8-2 19 4.6 26l136 144c4.5 4.8 10.8 7.5 17.4 7.5s12.9-2.7 17.4-7.5l136-144c6.6-7 8.4-17.2 4.6-26s-12.5-14.5-22-14.5l-72 0 0-288c0-17.7-14.3-32-32-32L128 0C110.3 0 96 14.3 96 32l0 288-72 0c-9.6 0-18.2 5.7-22 14.5z"/></svg>)
}

const extendedContactSchema: Schema<QuickFormSchemaMetaType> = (({ email, subject, message }) => ({
  email: { ...email, meta: { quickForm: { placeholder: `youremail@domain.com`, inputClassName: `input input-bordered w-full mb-2` } }},
  subject: { ...subject, meta: { quickForm: { placeholder: `Subject`, inputClassName: `input input-bordered w-full my-2`  } }},
  message: { ...message, meta: { quickForm: { textArea: true, placeholder: `Type your message here..`, inputClassName: `textarea textarea-bordered resize-none w-full my-2`  } }},
} as Schema<QuickFormSchemaMetaType>))(ContactModel.schema);

const Home: React.FC<any> = (props: any) => {

  const navigate = useNavigate();
  const modalContext = React.useContext(ModalContext);
  const [storageContext, setStorageContext] = React.useContext(StorageContext);
  const [model, setModel] = React.useState<Pick<Contact, "email" | "subject" | "message">>({ email: "", subject: "", message: "" });
  const [formErrors, setFormErrors] = React.useState<{ key: string, message: string }[]>([]);
  const [touched, setTouched] = React.useState<boolean>(false);

  const [webApps, setWebApps] = React.useState<Project[]>([]);
  const [webDemos, setWebDemos] = React.useState<Project[]>([]);
  const [apps, setApps] = React.useState<Project[]>([]);

  React.useEffect(() => {
    (async () => {
      const pRes = await HttpService.get<Project[]>('projectstream', { afterID: 0, numrows: 500 });
      if (pRes && pRes.success && pRes.body) {
        
        const temp: { [key in Project['projecttype']]: Project[] } = {
          app: [],
          demo: [],
          webapp: []
        };
        pRes.body.forEach(proj => temp[proj.projecttype].push(proj));

        setWebApps(temp.webapp); setWebDemos(temp.demo); setApps(temp.app);

      } else {
        modalContext.toast?.('alert', 'Failed to load projects data. see console');
        console.log('Project data fetch errors: ', pRes);
      }
    })();
  },[]);

  const inputHandler = (err: string[], keyvalues: Partial<Pick<Contact, "email" | "subject" | "message">>) => {
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
    <div className="h-screen overflow-y-scroll relative snap-y snap-mandatory">

      <div className="p-0 m-0 snap-start" id="top">
        <Hero image="stars.jpg">
          <div>
            <p className=" text-2xl m-4">dharrsnprojects</p>
            <a className="text-center items-center" href="#webApps">
              { svgs.downblack }
            </a>
          </div>
        </Hero>
      </div>

      <div id="webApps">
        <LabeledSectionLeft
          label="web apps" 
          targetID="#webDemos"
          child={
            <Carousel >
              {
                (webApps.map((v, i) => (
                  <div key={i}>
                    <ProjectCard project={v}/> 
                  </div>
                )))
              }
            </Carousel>  
          }
          svg={svgs.down}
        />
      </div>


      <div id="webDemos">
        <LabeledSectionRight
          label="web demos" 
          targetID="#apps"
          child={ 
            <Carousel> 
              {webDemos.map((v,i) => (
                <div key={i}>
                  <ProjectCard project={v}/> 
                </div>
              ))} 
            </Carousel> 
          }
          svg={svgs.down}
        />
      </div>

      <div id="apps">
        <LabeledSectionLeft
          label="apps" 
          targetID="#about"
          child={
            <Carousel >
              {
                (apps.map((v, i) => (
                  <div key={i}>
                    <ProjectCard project={v}/> 
                  </div>
                )))
              }
            </Carousel>  
          }
          svg={svgs.down}
        />
      </div>

      <div id="about">
        <LabeledSectionRight
          label="about" 
          targetID="#contact"
          child={
            <p className="h-[60vh] md:h-auto">
              Freelance developer and motivated, independent learner with strong passion for Software Engineering. Bachelor of Science in
              Applied Mathematics and Computer Science. Focus on Node, Angular, and React, full stack development.
            </p>
          }
          svg={svgs.down}
        />
      </div>

      <div id="contact">
        <LabeledSectionLeft
          label="contact" 
          targetID="#top"
          child={
            <div className="h-[60vh]">
              <div className="text-black">
                <QuickForm
                  labelPlacement="none"
                  schema={extendedContactSchema}
                  init={model}
                  onInput={inputHandler}
                />
              </div>
              <button className={`btn my-4 float-right`} disabled={!touched || !!Object.keys(formErrors).length} onClick={() => {  
                (async () => {
                  const res = await HttpService.post('contactcreate', model);
                  if (res.success) {
                    modalContext.toast?.('success', 'Message has been received!');
                    setModel({ email: "", subject: "", message: "" });
                    setTouched(false);
                  } else {
                    modalContext.toast?.('error', 'Failed submit message!');
                    console.log(res.messages);
                  }
                })();
              }}>Submit</button>
            </div>
          }
          svg={svgs.up}
        />
      </div>

    </div>
  )
}

export default Home;