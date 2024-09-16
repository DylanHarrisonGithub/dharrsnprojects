import React from "react";

export const ASPECT_RATIOS = {
  "1:1": "pt-[100%]",
  "10:9": "pt-[90%]",
  "7:6": "pt-[86%]",
  "6:5": "pt-[83.3%]",
  "5:4": `pt-[80%]`,
  "4:3": "pt-[75%]",
  "3:2": "pt-[67%]",
  "1.618:1": "pt-[61.8%]",
  "16:9": "pt-[56%]",
  "2:1": "pt-[50%]",
  "3:1": "pt-[33%]",
  "3:4": "pt-[133%]",
  "2:3": "pt-[150%]",
  "1:1.618" : "pt-[161.8%]",
  "9:16": "pt-[178%]",
  "1:2": "pt-[200%]",
  "1:3": "pt-[300%]",
};

/*
width of 120 units or height of 120 basis since 120 = 5! = 1*2*3*4*5 is evenly divisible by many whole numbers or 720??
120:120 = 1:1
60:120 = 1:2
40:120 = 1:3
30:120 = 1:4
20:120 = 1:5

or fibonacci rectangels
0     1    2    3    4    5      6
1x1, 1x2, 3x2, 3x5, 7x5, 7x10, 13x10
*/

const AspectContainer: React.FC<{ aspectRatio: keyof typeof ASPECT_RATIOS, children: React.ReactNode[] | React.ReactNode }> = ({ aspectRatio, children }) => {
  return (
    <div className={`bg-orange-500 relative w-full h-0 ${ASPECT_RATIOS[aspectRatio]}`}>
      <div className="absolute top-0 left-0 right-0 bottom-0 m-0 p-0 w-full h-full">
        { children }
      </div>
    </div>
  );
};

export default AspectContainer;