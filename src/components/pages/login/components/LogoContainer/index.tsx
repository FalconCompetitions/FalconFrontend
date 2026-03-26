import Falcon from "@/components/_ui/icons/Falcon";
import React from "react";



const LogoContainer: React.FC = () => {

    return(
		<div className="hidden lg:flex w-1/2 bg-[#4f85a0] flex-col justify-center items-center">
            <Falcon className="max-w-md object-contain mb-4 w-60 xl:w-80 h-auto" />
            <p className="text-white text-4xl xl:text-[60px] font-bold tracking-wider ml-10">FHO</p>
        </div>
    );
}


export default LogoContainer;