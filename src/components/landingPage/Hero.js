import Lottie from "lottie-react";
import { useState } from "react";
import { Redirect } from "react-router";
import DoctorAnimation from "../../images/DoctorAnimation.json";

function Hero() {
  const [isClicked, setClicked] = useState(false);

  if (isClicked)
    return (
      <Redirect
        to={{
          pathname: "/signup",
          state: {
            type: "patient",
          },
        }}
      />
    );
  else
    return (
      <section className="text-gray-600 body-font sm:px- bg-primary">
        <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
        <div className="lg:max-w-xl md:max-w-lg lg:w-md md:w-1/2 w-5/6">
            <Lottie animationData={DoctorAnimation} />
          </div>
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <div className="title-font  mb-4 mt-4 font-medium text-gray-900">
              <span className="lg:text-3xl text-2xl"></span>
              <h1 className="text-white xl:text-7xl md:text-5xl text-4xl font-bold mt-2">
                VirQue Healthlines
              </h1>
              <br className="hidden lg:inline-block" />
              <span className="sm:text-2xl text-xl text-gray-500"></span>
            </div>
            <p className="mb-4 leading-relaxed text-white">
              Not to touch shared surfaces and breathe shared air which are
              beyond uncomfortable — they can be unsafe. Virtual waiting rooms
              enable social distancing to support a better patient experience
              and better outcomes.
            </p>
            <h3 className="mb-10 leading-relaxed text-white">
              We at VirQue Healthlines help improve patient experience and
              medical diagnosis with our virtual waiting rooms.
            </h3>
            <div className="flex justify-center">
              <button
                className="inline-flex text-primary font-semibold bg-white border-0 py-2 px-6 focus:outline-none cursor-pointer hover:opacity-80 rounded-md text-lg  hover:bg-black hover:text-white"
                onClick={(e) => setClicked(true)}
              >
                Get started
              </button>
              <a href="https://youtu.be/tjcLdrwBgHY">
                <button className="ml-4 inline-flex text-primary font-semibold bg-white border-0 py-2 px-6 focus:outline-none cursor-pointer  rounded-md text-lg  hover:bg-black hover:text-white">
                  Demo
                </button>
              </a>
            </div>
          </div>
          
        </div>
        {/* <div className="w-20 h-40 absolute bg-light rounded-md top-20 -left-10 transform -rotate-45 hidden md:block"></div> */}
        {/* <div className="w-28 h-32 absolute rounded-xl bg-light bottom-10 right-8 transform rotate-45 hidden md:block"></div> */}
      </section>
    );
}

export default Hero;
