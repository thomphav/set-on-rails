import React from 'react';

export enum LoaderColors {
  black = "black",
  white = "white",
}

const Loader = ({ color }: { color?: LoaderColors }) => (
  <div className="flex items-center justify-center animate-spin">
    <svg
      height="21"
      viewBox="0 0 21 21"
      width="21"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
       fill="none" 
       fill-rule="evenodd" 
       stroke={color || "black"} 
       stroke-linecap="round" 
       stroke-linejoin="round"
      >
        <path d="m10.5 3.5v2"/>
        <path d="m15.5 5.5-1.5 1.5"/>
        <path d="m5.5 5.5 1.5 1.5"/>
        <path d="m10.5 17.5v-2"/>
        <path d="m15.5 15.5-1.5-1.5"/>
        <path d="m5.5 15.5 1.5-1.5"/>
        <path d="m3.5 10.5h2"/>
        <path d="m15.5 10.5h2"/>
      </g>
    </svg>
  </div>
);

export default Loader;