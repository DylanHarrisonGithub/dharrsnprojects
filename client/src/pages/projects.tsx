import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import InfiniteContentScroller from "../components/infinite-content-scroller/infinite-content-scroller";
import { Theme } from "../definitions/models/Theme/Theme";
import { Project } from "../definitions/models/Project/Project";
import ProjectModel from "../definitions/models/Project/Project";
import { StorageContext } from "../components/storage/storage-context";
import ProjectDetail from "../components/project-detail";

const Projects: React.FC<any> = (props: any) => {

  const [storageContext, setStorageContext] = React.useContext(StorageContext);
  const navigate = useNavigate();

  const [theme, setTheme] = React.useState<Theme | undefined>(undefined);
  const { id } = useParams();

  const [projects, setProjects] = React.useState<Project[]>([]);
  const [search, setSearch] = React.useState<string>('');

  React.useEffect(() => setTheme(storageContext.theme as Theme), [storageContext.theme]);

  return (
    <div className="py-16 px-4 mx-auto">

      <div className="text-center p-1 m-3 mt-4">
        <div className='inline-block relative mx-2 my-4 align-top text-left w-11/12 md:w-4/12'>
          <div className="text-left">
            <h1 className="text-xl text-center align-middle inline-block text-white">
              &nbsp;&nbsp;Projects&nbsp;&nbsp;
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
        <InfiniteContentScroller<Project> contentStreamingRoute={'projectstream'} content={projects}  contentSetter={setProjects} search={search} id={id}>
          {
            projects.map((u, i) => (<ProjectDetail key={i} project={u} />))
          }
        </InfiniteContentScroller>
      </div>

    </div>
  );
}

export default Projects;