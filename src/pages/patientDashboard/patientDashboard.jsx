/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import DoctorProfileCard from "../../components/DoctorProfileCard.jsx";
import WaitingListItemButton from "../../components/WaitingListItemButton";
import WaitingListItem from "../../components/WaitingListItem";
import Modal from "react-modal";
import DateTime from "../../components/DateTime";
import { HiLogout } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { getAllDoctorsAction } from "../../redux/actions/doctorsAction";
import {
  createAppointmentAction,
  getAppointmentAction,
  getTodayAppointmentAction,
} from "../../redux/actions/appointmentAction.js";
import {
  doctorLogout,
  patientLogout,
} from "../../redux/actions/userAuthAction.js";
import { useHistory } from "react-router";
import { getPatientProfile } from "../../redux/actions/getUserAction.js";
import { FadeLoader } from "react-spinners";
import DashBoardAnimation from "../../images/DashboardAnimation.json";
import SideBarAnimation from "../../images/SideBarAnimation.json";
import BookAppointmentAnimation from "../../images/BookAppointmentAnimation.json";
import { MdDashboard, MdFolder, MdPerson } from "react-icons/all";
import { convertTo12 } from "../../utils/time";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { child, onValue, ref } from "firebase/database";
import { dbs } from "../../services/firebase/index"
import moment from "moment"

function PatientDashboard() {
  const currentUser = useSelector((state) => state.authReducer);
  const userName = useSelector((state) => state.profileReducer);

  const doctorsList = useSelector(
    (state) => state.doctorReducer.doctors.doctors
  );
  const appointmentList = useSelector(
    (state) => state.appointmentReducer.appointments
  );
  const createdAppointment = useSelector(
    (state) => state.appointmentReducer.createdAppointment
  );

  const handleProfile = () => {
    history.push("/profile");
  };

  const handleDashboard = () => {
    history.push("/dashboard");
  };

  const handleInventory = () => {
    history.push("/inventory");
  };

  const todayAppointmentList = useSelector(
    (state) => state.todayAppointmentReducer.appointments
  );

  const [todayAppointment, setTodayAppointment] = useState([]); //CONTAINS THE QUEUE IF THERE

  const loadingApt = useSelector((state) => state.appointmentReducer.isLoading);

  const appointmentErr = useSelector(
    (state) => state.appointmentReducer.errMessage
  );
  const [loading, setLoading] = useState(false);
  // TODO: use these for the cancel appointment popup too
  const [appointmentDate, setAppointmentDate] = useState("");
  const [doctor, setDoctor] = useState(0);
  const [doctorNo, setDoctorNo] = useState(null);
  const [doctorDetails, setDoctorDetails] = useState({});
  const [symptoms, setSymptoms] = useState("");
  const [type, setType] = useState("appointment");
  const [error, setError] = useState(false);
  const [isAnyAppointment, setIsAnyAppointment] = useState(false); //TO CHECK IF THERE IS ANY QUEUE TODAY

  // const [todayDoctor, setTodayDoctor] = useState(null);
  const doctorsDropdownList = [];
  for (var d in doctorsList) {
    doctorsDropdownList.push(
      <option value={d} className={doctorsList[d].Profile?.name}>
        {doctorsList[d].Profile?.name}
      </option>
    );
  }

  const dispatch = useDispatch();
  const { date, time } = DateTime();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const modalStyle = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      position: "absolute",
      borderRadius: "10px",
      border: "none",
      padding: "3%",
      background: "white",
      boxShadow: "2px 2px 5px 2px lightGray",
    },
  };

  const history = useHistory();

  const dbRef=ref(dbs);

  
  useEffect(() => {
    if(!!doctorNo){
    const dt = moment(new Date()).format("YYYY-MM-DD");
    const unSubscribe = onValue(child(dbRef, `Appointment/${dt}/${doctorNo}/`),(ss) => {
      if (!ss.exists()) {
        return;
      }
      fetchAllAppointments();
    });
  }
  
    // return () => {
    //   unSubscribe();
    // }
  },[doctorNo])

  useEffect(() => {
    setLoading(true);

    if (!currentUser.isLoggedIn) history.push("/");
    if (currentUser.type === "doctor") history.goBack();
    dispatch(getAllDoctorsAction()); //-------------DOCTOR LIST IS FILLED IN REDUCER---------------------//
    fetchAllAppointments();

    if (currentUser.isLoggedIn && currentUser.isRegistered) {
      dispatch(getPatientProfile(currentUser.phoneno));
    }
    setLoading(false);
  }, []);

  console.log("Doctors List",doctorsList);

  useEffect(() => {
    if (todayAppointmentList.length > 0 && doctorsList.length > 0 && doctorNo) {
      setLoading(true);
      console.log("TODAY",todayAppointmentList)
      setDoctorDetails(getDoctorDetails(doctorNo)); //----------DOCTOR DETAILS FOR PROFILE CARD ADDED TO STATE----------------------//

      const newArray = todayAppointmentList.filter(
        (item) => item.status !== "completed"
      );
      newArray[0].status = "Ongoing";
      if (newArray.length > 1) newArray[1].status = "Upcoming";

      setTodayAppointment(newArray); //-------------------SETS THE QUEUE IF THERE IS AN APPOINTMENT TODAY---------------------//

      setIsAnyAppointment(true);
      setLoading(false); //------------INDICATES TO DISPLAY THE QUEUE IF TRUE-----------------------//
    }
  }, [todayAppointmentList, doctorsList]);

  useEffect(() => {
    setLoading(false);
    if (currentUser.isLogout) history.push("/");
  }, [currentUser]);

  useEffect(() => {
    setLoading(false);
    const todayDate = new Date().toJSON().slice(0, 10);
    const AllAppointment = appointmentDetails(todayDate);
    if (AllAppointment.length > 0) {
      const doctorPhoneno = AllAppointment[0].dphoneno;

      setDoctorNo(doctorPhoneno);

      // setTodayDoctor(doctorPhoneno);
      dispatch(
        getTodayAppointmentAction({
          status: "queued",
          forUser: "doctor",
          dphoneNo: doctorPhoneno,
        })
      );
    } else {
      setIsAnyAppointment(false); //---------------INDICATES TO DISPLAY THE NO APPOINTMENT  UI------------------//
    }
  }, [appointmentList, createdAppointment, appointmentErr]);

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleLogout = () => {
    setLoading(true);
    if (currentUser.type === "doctor")
      dispatch(doctorLogout(currentUser.access, currentUser.phoneno));
    else dispatch(patientLogout(currentUser.access, currentUser.phoneno));
  };

  const getDoctorDetails = (phone) => {
    //----------------FILTERS THE CURRENT DOCTOR ACCORDING TO TODAY'S APPOINTMENT ------------------------//
    console.log("GET DOC",phone)
    const selectedDoctor = doctorsList?.filter(
      (doctor) => doctor.phoneno === phone
    );

    console.log("Selected Doctor",selectedDoctor)
    if (selectedDoctor?.length > 0) return selectedDoctor[0];
    else return null;
  };
  console.log(doctorDetails)

  const appointmentDetails = (date) => {
    //-------------------FETCHES TODAY'S APPOINTMENT ,IF THERE, FROM LIST OF APPOINTMENT FOR PATIENT-------------------//
    const selectedAppointment = appointmentList.filter(
      (appointment) => appointment.apdate === date
    );
    return selectedAppointment;
  };

  // TODO: use this to cancel appointments
  const createNewAppointment = () => {
    if (appointmentDate !== "") {
      setError(false);
      const appointmentData = {
        apdate: appointmentDate,
        pphoneno: currentUser.phoneno,
        dphoneno: doctorsList[doctor].phoneno,
        symptoms: symptoms,
        type: type,
      };
      dispatch(createAppointmentAction(appointmentData));
      fetch(`http://localhost:4000/appointment?recipient=${currentUser.phoneno}`).catch(err=>console.log(err));
      setAppointmentDate("");
      setDoctor(0);
      setSymptoms("");
      setType("appointment");
      closeModal();
    } else {
      setError(true);
    }
  };


  const fetchAllAppointments = () => {
    //------------FETCHES LIST OF APPOINTMENT FOR THE CURRENT LOGGED IN PATIENT----------------------//
    const data = {
      pphoneNo: currentUser.phoneno,
      status: "queued",
      forUser: currentUser.type,
    };
    dispatch(getAppointmentAction(data));
  };

  if (loading) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FadeLoader color={"#3DA0DE"} loading={true} size={150} />
      </div>
    );
  } else
    return (
      <div className="main-dashboard">
        <aside id="sidenav-open" className="h-screen">
          <nav className="flex flex-col justify-between h-md p-5 bg-gray-50">
            <div className="sidebar-title self-center my-10 uppercase text-2xl tracking-widest2 font-bold text-primary">
              Virque
            </div>
            <div>
              <button
                onClick={handleDashboard}
                className="flex items-center p-3 mb-4 rounded-xl"
              >
                <MdDashboard className="mr-3 text-3xl text-primary" />
                <span className="text-primary text-xl">Dashboard</span>
              </button>

              <button
                onClick={handleProfile}
                className="flex items-center p-3 mb-4 rounded-xl"
              >
                <MdPerson className="mr-3 text-3xl text-primary" />
                <span className="text-primary text-xl">Profile</span>
              </button>

              <button
                onClick={handleInventory}
                className="flex items-center p-3 mb-4 rounded-xl"
              >
                <MdFolder className="mr-3 text-3xl text-primary" />
                <span className="text-primary text-xl">Inventory</span>
              </button>
            </div>

            <div className="grid justify-between w-64">
              <Lottie className="mx-2" animationData={SideBarAnimation} />
              <div className="flex mt-2 bg-primary text-white cursor-pointer mx-10 items-center justify-center rounded-md">
                <button
                  className="flex space-x-3 py-2 px-6 text-md items-center justify-center rounded-md"
                  onClick={handleLogout}
                >
                  <HiLogout className="text-lg" />
                  <p>Logout</p>
                </button>
              </div>
            </div>
          </nav>
          <a
            href="/dashboard"
            id="sidenav-close"
            title="Close Menu"
            aria-label="Close Menu"
          ></a>
        </aside>
        <main className="overflow-y-scroll h-screen">
          <header className="flex items-center justify-between p-4 sticky top-0 bg-white z-10">
            <div className="flex items-center justify-between">
              <a
                href="#sidenav-open"
                className="visible sm:hidden"
                title="Open Menu"
                aria-label="Open Menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 text-primary"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#2c3e50"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
              </a>
            </div>
          </header>
          <Modal
            isOpen={modalIsOpen}
            style={modalStyle}
            className="lg:w-1/2 w-3/4"
            onRequestClose={closeModal}
            contentLabel="Book a slot"
            ariaHideApp={false}
          >
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-col w-full space-y-3">
                <p className="text-xl font-bold mb-4 text-bg uppercase">
                  Book a new appointment
                </p>
                <p className="font-semibold">Pick a date :</p>
                <input
                  type="date"
                  className="text-sm mb-6 p-1"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                />
                {error ? (
                  <p className="text-red-600 text-xs">
                    Please specify an appointment date
                  </p>
                ) : null}
                <label htmlFor="doctor" className="font-semibold mb-1">
                  Pick a doctor :
                </label>
                <select
                  name="doctor"
                  id="doctor"
                  onChange={(e) => {
                    setDoctor(e.target.value);
                  }}
                  className="bg-white outline-none mb-4 p-1"
                >
                  {doctorsDropdownList}
                </select>
                <input
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  type="text"
                  placeholder="Symptoms"
                  className="text-sm mb-4 outline-none bg-lighter rounded-md py-2 px-2"
                />
                <div className="flex flex-row w-md items-div justify-evenly my-4">
                  <div className="flex flex-row items-div space-x-2">
                    <input
                      type="radio"
                      id="appointment"
                      name="type"
                      value="appointment"
                      className="self-center"
                      onChange={(e) => setType(e.target.value)}
                      checked
                    />
                    <label htmlFor="appointment">Appointment</label>
                  </div>
                  <div className="flex flex-row items-div space-x-2">
                    <input
                      type="radio"
                      id="test"
                      name="type"
                      value="test"
                      className="self-center"
                      onChange={(e) => setType(e.target.value)}
                    />
                    <label htmlFor="test">Test</label>
                  </div>
                </div>
                <button
                  onClick={createNewAppointment}
                  className="bg-primary py-2 text-white font-bold rounded-md outline-none"
                >
                  Book Now
                </button>
              </div>
              <div class="">
                <Lottie class="w-full h-full" animationData={BookAppointmentAnimation} />
              </div>
            </div>
          </Modal>
          <div className="md:flex grid items-center justify-between">
            <h1 className="mx-2 text-xl font-bold text-primary">
              <input
                type="text"
                className="md:w-96 w-82 text-sm md:text-md py-2.5 px-4 md:ml-5 rounded-md outline-none bg-gray-100"
                placeholder="Enter search keywords"
              />
            </h1>
            <p className="text-sm hidden md:flex md:text-xl">
              <span className="text-lg md:text-xl mr-6 text-primary p-1 px-4">{date}</span>
              <span className="text-lg md:text-xl md:mr-12 text-primary p-1 px-4">
                {time}
              </span>
            </p>
          </div>
          <section className="grid p-6">
            <span className="text-sm md:hidden mr-6 text-primary">{date}</span>
            <span className="text-sm md:hidden md:mr-12 text-primary">{time}</span>
            <h1 className="lg:text-4xl md:text-3xl text-xl font-semibold mt-4 text-primary">
              Welcome, {userName.name}
            </h1>
            <h4 className="md:text-lg text-md text-gray-600 mt-3">
              You have{" "}
              {appointmentList.length < 1 ? "no" : appointmentList.length}{" "}
              appointments scheduled for{" "}
              {appointmentList.length < 1
                ? ""
                : appointmentList[appointmentList.length - 1].apdate}
              .
            </h4>
            <p className="text-gray-400 pt-1 text-md">
              You are advised to visit the clinic during your assigned time
              schedule by referring to the following real-time virtual waiting
              queue.
            </p>
          </section>

          {isAnyAppointment ? (
            <section className="flex flex-wrap">
              <div className="w-full lg:w-2/3">
                <div className="flex flex-col w-full p-6">
                  <div className="grid md:flex flex-row w-full items-center mt-4 justify-between">
                    <h3 className="grid md:flex text-2xl text-md font-bold text-primary">
                      Waiting List
                    </h3>
                    <WaitingListItemButton
                      className="mx-0"
                      appointmentStatus="New Appointment"
                      onClickFunc={() => setModalIsOpen(true)}
                      loading={loadingApt}
                    />
                  </div>
                  <div className="flex flex-row items-center mt-8">
                    <div className="flex flex-col my-2 space-y-4 w-full overflow-x-auto">
                      {todayAppointment.map((item, index) => (
                        <WaitingListItem
                          key={index}
                          serialNo={item.serialno}
                          time={`${convertTo12(
                            item.aptime.start
                          )} - ${convertTo12(item.aptime.end)}`}
                          isUser={
                            item.pphoneno === currentUser.phoneno ? true : false
                          }
                          date={date}
                          appointmentStatus={item.status}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {isAnyAppointment ? (
                <div className="w-full lg:w-1/3">
                  <div className="flex flex-col w-full">
                    <div className="flex flex-col flex-grow lg:m-10 mx-auto my-10">
                      <h3 className="grid md:flex text-2xl text-md font-bold text-primary mb-6 pl-4">
                        Doctor's details
                      </h3>
                      {console.log("DOCTOR DETAILA",doctorDetails)}
                      <DoctorProfileCard
                        name={doctorDetails.Profile.name}
                        about={`${doctorDetails.Profile.specializations.join(
                          ","
                        )} Specialist`}
                        hospital={doctorDetails.Profile.hospital}
                        address={doctorDetails.Profile.address}
                        working_hrs={`${doctorDetails.Profile.workingHours.start.substr(
                          0,
                          5
                        )} - ${doctorDetails.Profile.workingHours.end.substr(0, 5)}`}
                      />
                    </div>
                  </div>
                </div>
              ) : null}
            </section>
          ) : (
            <section className="flex flex-wrap p-6 justify-evenly">
              <div className="items-center mt-4">
                <h3 className="mb-5 flex text-2xl text-md font-bold text-primary">
                  You can book your appointment here :
                </h3>
                <WaitingListItemButton
                  className="mx-0"
                  appointmentStatus="New Appointment"
                  onClickFunc={() => setModalIsOpen(true)}
                  loading={loadingApt}
                />
              </div>
              <div className="mt-5 md:mt-0 w-72">
                <Lottie animationData={DashBoardAnimation} />
              </div>
            </section>
          )}
        </main>
        <div>
          <ToastContainer
            position="top-right"
            autoClose={1000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </div>
    );
}

export default PatientDashboard;
