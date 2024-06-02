import { Link } from 'react-router-dom';
import ErrorImage from '../assets/tornCard.svg';

function Error() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-white">
            <div className="grid grid-rows-3 justify-items-center text-center gap-4 max-w-[400px] p-8 text-[#333333] md:grid-cols-2 md:gap-2 md:gap-x-14 md:max-w-screen-xl lg:gap-x-20">
                <div className="flex flex-col justify-end">
                    <h1 className="text-[4rem] font-black lg:text-8xl">404</h1>
                    <h3 className="text-[2rem] font-black lg:text-[2.5rem]">
                        Page Not Found
                    </h3>
                </div>
                <img
                    className="max-w-[120px] md:max-w-[300px] md:[grid-area:1/1/3/2]"
                    src={ErrorImage}
                    alt="404"
                />
                <div className="grid gap-8 font-medium place-content-baseline md:max-w-[250px] lg:max-w-[300px]">
                    <p className="">
                        Sorry, the page you're looking for can't be found.
                        Please return to the Homepage!
                    </p>
                    <button className="p-4 outline-none border-none rounded-md text-white bg-[#FF2400] cursor-pointer transition-all duration-500 hover:bg-[#12a101]">
                        <Link to="home">Go back to Homepage</Link>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Error;
