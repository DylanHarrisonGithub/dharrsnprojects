import React from "react";

const LabeledSectionLeft: React.FC<{
  label: string,
  child: React.ReactNode,
  svg: React.ReactElement<SVGElement>,
  separatorColor?: string,
  targetID: string,
}> = ({ label, child, svg, separatorColor, targetID }) => {

  return (
    <div className="p-2 md:p-4 mx-auto h-screen flex md:flex-col snap-start">
      <div className=" md:p-4 md:mx-16 text-white bg-slate-900 flex-grow flex flex-wrap md:flex-nowrap items-center flex-column md:flex-row">
        
        <p className="text-4xl flex-1 md:flex-none my-8 ml-8 md:m-8 md:text-right md:w-[128px]">{ label }</p>
        <div className={` w-[1rem] self-stretch md:m-8 hidden md:block flex-none ${ separatorColor || "bg-slate-400" }`}></div>
        <div className={` w-full h-4 mb-8 ml-8 md:mx-8 md:m-8 md:hidden shrink-0 ${ separatorColor || "bg-slate-400" }`}></div>
        
        <div className="w-36 flex-1 ml-8 md:m-8 md:min-w-0 md:grow">
          { child }
        </div>

      </div>

      <div className="p-2 block bg-slate-900 md:mx-16 flex-none">
        <a className="text-center items-center" href={targetID}>
          { svg }
        </a>
      </div>

    </div>
  );

}

export default LabeledSectionLeft;
