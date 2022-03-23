import React, { useState } from "react";
import Login from "../../images/Mobile-login-rafiki.png";
import authentication from "../../services/firebase/index";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

export default function SignUpPage() {
  const [phoneNumber, setPhoneNumber] = useState("");

  const [otp, setOTP] = useState("");

  const [toggleOTPCard, setToggleOTPCard] = useState(false);

  const handleNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleOTP = (e) => {
    setOTP(e.target.value);
  };

  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
      },
      authentication
    );
  };

  const sendOTP = () => {
    let number = "+91" + phoneNumber;
    if (number.length >= 12) {
      generateRecaptcha();
      let appVerifier = window.recaptchaVerifier;
      signInWithPhoneNumber(authentication, number, appVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          setOTP("");
          setToggleOTPCard(!toggleOTPCard);
          // ...
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const verifyOTP = () => {
    let otpValue = otp;
    if (otpValue.length === 6) {
      console.log(otpValue);
      let confirmationResult = window.confirmationResult;
      confirmationResult
        .confirm(otpValue)
        .then((result) => {
          const user = result.user;
          console.log(user);
        })
        .catch((error) => {
        });
    }
  };

  // const generateResendRecaptcha = () => {
  //   window.recaptchaVerifier = new RecaptchaVerifier(
  //     "resendOTP-container",
  //     {
  //       size: "invisible",
  //       callback: (response) => {
  //         // reCAPTCHA solved, allow signInWithPhoneNumber.
  //       },
  //     },
  //     authentication
  //   );
  // };

  const resendingOTP = () => {
    let number = "+91" + phoneNumber;
    console.log(number);

    let appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(authentication, number, appVerifier)
      .then((confirmationResult) => {
        console.log(true);
        window.confirmationResult = confirmationResult;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="overflow-hidden">
      {!toggleOTPCard ? (
        <div className="h-full bg-tertiary">
          <div className="flex overflow-hidden">
            <div className="lg:max-w-3xl md:max-w-xl lg:w-full w-1/4 mt-0 hidden lg:block flex flex-col justify-center items-center">
              <div className="flex justify-start ml-10 mt-5 text-xl text-primary font-semibold tracking-widest">
                VirQue
              </div>
              <div className="h-full flex flex-col justify-center items-center">
                <img src={Login} style={{ height: "500px" }} alt="Login" />
                <div className="text-xl text-primary font-semibold">
                  Let's get you setup!
                </div>
                <div className="text-xl text-primary font-semibold flex justify-center">
                  Enter the 10 digit phone number you want to link with your
                  account
                </div>
                <div className="flex justify-center mt-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    viewBox="0 0 20 20"
                    fill="#3DA0DE"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 ml-6 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#3DA0DE"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-primary max-w-5xl lg:max-w-3xl w-full h-full overflow-hidden h-screen">
              <div className="mx-auto max-w-lg p-8 md:p-12 rounded-xl">
                <section className="header mt-60">
                  <div className="flex justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-10 w-10 mb-5"
                      viewBox="0 0 20 20"
                      fill="white"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="absolute w-10 h-10 rounded-xl bg-light top-10 right-16 z-0 transform rotate-45 hidden md:block"></div>
                  <div className="absolute w-8 h-8 rounded-xl bg-light bottom-5 right-20 transform rotate-12 hidden md:block"></div>

                  <div className="number mb-6 pt-3 rounded-xl bg-light">
                    <input
                      placeholder="Enter your number"
                      type="number"
                      id="number"
                      value={phoneNumber}
                      onChange={(e) => handleNumberChange(e)}
                      className="bg-light rounded-full w-full text-gray-700 focus:outline-none focus:border-primary transition duration-500 px-3 pb-3 tracking-widest"
                    />
                  </div>

                  <div className="space-y-3 flex flex-col pointer">
                    <button
                      className="bg-white font-bold py-2 rounded hover:shadow-xl transition duration-200 text-primary"
                      onClick={sendOTP}
                    >
                      Next
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </div>
          <div id="recaptcha-container" />
        </div>
      ) : (
        <div className="h-full bg-tertiary">
          <div className="flex overflow-hidden">
            <div className="lg:max-w-3xl md:max-w-xl lg:w-full w-1/4 mt-0 hidden lg:block flex flex-col justify-center items-center">
              <div className="flex justify-start ml-10 mt-5 text-xl text-primary font-semibold tracking-widest">
                VirQue
              </div>
              <div className="h-full flex flex-col justify-center items-center">
                <img src={Login} style={{ height: "500px" }} alt="Login" />
                <div className="text-xl text-primary font-semibold">
                  Let's get you setup!
                </div>
                <div className="text-xl text-primary font-semibold flex justify-center">
                  Enter the 6 digit OTP
                </div>
                <div className="flex justify-center mt-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-6 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#3DA0DE"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    viewBox="0 0 20 20"
                    fill="#3DA0DE"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-primary max-w-5xl lg:max-w-3xl w-full h-full overflow-hidden h-screen">
              <div className="mx-auto max-w-lg p-8 md:p-12 rounded-xl">
                <section className="header mt-60">
                  <div className="flex justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-10 w-10 mb-5"
                      viewBox="0 0 20 20"
                      fill="white"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="absolute w-10 h-10 rounded-xl bg-light top-10 right-16 z-0 transform rotate-45 hidden md:block"></div>
                  <div className="absolute w-8 h-8 rounded-xl bg-light bottom-5 right-20 transform rotate-12 hidden md:block"></div>
                  <div className="absolute w-15 h-15 rounded-xl bg-light top-10 right-20 transform rotate-12 hidden md:block"></div>
                  <div className="otp mb-6 pt-3 rounded-xl bg-light">
                    <input
                      placeholder="Enter the OTP"
                      type="number"
                      id="otp"
                      value={otp}
                      onChange={(e) => handleOTP(e)}
                      className="bg-light rounded-full w-full text-gray-700 focus:outline-none focus:border-primary transition duration-500 px-3 pb-3 tracking-widest"
                    />
                  </div>

                  <div className="flex justify-between">
                    <div className="space-y-3 flex flex-col pointer">
                      <button
                        className="bg-white font-bold py-2 px-4 rounded hover:shadow-xl transition duration-200 text-primary"
                        onClick={verifyOTP}
                      >
                        Verify
                      </button>
                    </div>
                    <div className="space-y-3 flex flex-col pointer">
                      <button
                        className="bg-white font-bold py-2 px-4 rounded hover:shadow-xl transition duration-200 text-primary"
                        onClick={resendingOTP}
                      >
                        Resend OTP
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
          <div id="resendOTP-container" />
        </div>
      )}
    </div>
  );
}
