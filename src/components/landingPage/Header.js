import { useState } from "react";
import { Redirect } from "react-router";

function Header() {
  const [isDoctor, setDoctor] = useState(false);
  const [isPatient, setPatient] = useState(false);

  if (isDoctor)
    return (
      <Redirect
        to={{
          pathname: "/signin",
          state: {
            type: "doctor",
          },
        }}
      />
    );
  else if (isPatient)
    return (
      <Redirect
        to={{
          pathname: "/signin",
          state: {
            type: "patient",
          },
        }}
      />
    );
  else
    return (
      <header className="text-gray-600 bg-primary body-font sm:px-20 fixed z-10 w-screen">
        <div className="container mx-auto flex flex-wrap p-5 flex-row items-center">
          <a
            className="flex title-font font-medium items-center text-white"
            href="/"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-10 h-10 text-white"
              viewBox="0 0 24 24"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
            <span className="ml-3 text-xl hidden md:block font-semibold">VirQue</span>
          </a>
          <nav className="ml-auto mr-auto flex flex-wrap items-center text-base justify-center"></nav>
          <button
            className="text-white font-normal inline-flex items-center mr-4 md:mr-5 text-sm cursor-pointer"
            onClick={(e) => setDoctor(true)}
          >
            Apply as Doctor
          </button>
          <a
            className="inline-flex items-center text-primary bg-white border-0 py-2 px-4 focus:outline-none hover:opacity-80 rounded-full font-semibold"
            href="/signin"
            onClick={(e) => setPatient(true)}
          >
            Sign in
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-4 h-4 ml-1 hidden md:inline-flex"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </header>
    );
}

export default Header;
