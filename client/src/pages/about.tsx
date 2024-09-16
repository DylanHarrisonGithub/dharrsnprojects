import React from "react";
import { StorageContext } from "../components/storage/storage-context";
import { Theme } from "../definitions/models/Theme/Theme";

const About: React.FC<any> = (props: any) => {

  const [storageContext, setStorageContext] = React.useContext(StorageContext);
  
  const [theme, setTheme] = React.useState<Theme | undefined>(undefined);

  React.useEffect(() => setTheme(storageContext.theme as Theme), [storageContext.theme]);

  return (
    <div className="py-16 px-4 mx-auto diamonds">
      <div className="container py-16 min-h-screen">
        <h1 className="text-xl gold-text text-center align-middle inline-block ml-8 pb-8">
          &nbsp;&nbsp;About&nbsp;&nbsp;
        </h1>
        <div className="flex items-center content-center p-16  md:mx-16 ">

        </div>
      </div>

    </div>
  )
}

export default About;