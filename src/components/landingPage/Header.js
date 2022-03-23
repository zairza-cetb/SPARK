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
              width="135"
              height="135"
              viewBox="0 0 135 135"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-white"
            >
              <rect
                x="0.275757"
                y="0.820618"
                width="134.138"
                height="134.14"
                fill="#1B87C4"
              />
              <path
                d="M54.5051 22.2263V28.6461H80.1842V22.2263C80.1842 18.6814 83.053 15.8065 86.604 15.8065C90.1549 15.8065 93.0237 18.6814 93.0237 22.2263V28.6461H102.653C107.97 28.6461 112.283 32.9573 112.283 38.2757V47.9054H22.4063V38.2757C22.4063 32.9573 26.7176 28.6461 32.0359 28.6461H41.6656V22.2263C41.6656 18.6814 44.5344 15.8065 48.0854 15.8065C51.6363 15.8065 54.5051 18.6814 54.5051 22.2263ZM22.4063 54.3251H112.283V108.893C112.283 114.21 107.97 118.523 102.653 118.523H32.0359C26.7176 118.523 22.4063 114.21 22.4063 108.893V54.3251Z"
                fill="white"
              />
              <path
                d="M40.0939 85.0769H22.6946L22.6946 90.894H44.5433L51.3538 78.1315L64.0151 101.007C64.0151 101.007 64.6817 102.114 66.9674 102.114C69.2531 102.114 69.9363 101.007 69.9363 101.007L81.1753 82.9279L86.2429 90.894H111.818V85.0769H90.2012C90.2012 85.0769 85.3673 75.831 83.91 74.7225C82.4527 73.6139 82.0548 73.6384 80.7356 73.7466C79.6889 73.8324 79.9084 73.3503 78.3262 74.7225C76.7439 76.0946 66.9674 92.5669 66.9674 92.5669C66.9674 92.5669 55.4293 70.6908 54.2318 69.2871C53.0343 67.8834 52.518 67.9129 51.134 67.8914C49.7001 67.869 48.9761 68.2788 47.891 69.2871C46.8058 70.2954 40.0939 85.0769 40.0939 85.0769Z"
                fill="#1B87C4"
                stroke="#1B87C4"
              />
            </svg>

            <span className="ml-3 text-xl hidden md:block font-semibold">
              VirQue
            </span>
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
