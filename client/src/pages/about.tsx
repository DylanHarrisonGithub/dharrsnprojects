import React from "react";
import { StorageContext } from "../components/storage/storage-context";
import { Theme } from "../definitions/models/Theme/Theme";

const About: React.FC<any> = (props: any) => {

  const [storageContext, setStorageContext] = React.useContext(StorageContext);
  
  const [theme, setTheme] = React.useState<Theme | undefined>(undefined);

  React.useEffect(() => setTheme(storageContext.theme as Theme), [storageContext.theme]);

  return (
    <div className="py-16 px-4 mx-auto">
      <div className="container py-16 min-h-screen">
        <div className="md:flex items-center content-center p-16  md:mx-16 text-white bg-slate-900">
          <h1 className="text-white text-4xl w-full md:w-auto m-8">about</h1>
          <div className=" w-8 h-32 bg-slate-400 m-8 hidden md:block"></div>
          <div className=" w-full h-4 bg-slate-400 m-8 md:hidden"></div>
          <p className=" m-8">
            Freelance developer and motivated, independent learner with strong passion for Software Engineering. Bachelor of Science in
            Applied Mathematics and Computer Science. Focus on Node, Angular, and React, full stack development.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About;