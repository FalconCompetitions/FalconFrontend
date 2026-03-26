import { LoginContainerProps } from "./types"



const LoginContainer: React.FC<LoginContainerProps> = ({ children }) => {

    return(
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-10">
            {children}
        </div>
    );
}

export default LoginContainer;