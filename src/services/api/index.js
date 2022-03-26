import {
  SIGNUP_PATIENT_URL,
  SIGNUP_DOCTOR_URL,
  CREATE_AP_URL,
  GET_AP_URL,
  CANCEL_AP_URL,
  CREATE_PATIENT_URL,
  GET_ALL_DOC,
  LOGIN_PATIENT_URL,
  LOGIN_DOCTOR_URL,
  CREATE_DOCTOR_URL,
  LOGOUT_PATIENT_URL,
  LOGOUT_DOCTOR_URL,
  GET_DOCTOR,
  GET_PATIENT,
  UPDATE_PATIENT_URL,
  UPDATE_DOCTOR_URL,
  UPDATE_AP_URL,
  SPARK_API_URL,
} from "../../utils/url";
import { getAuth, signOut } from "firebase/auth";

import {
  child,
  equalTo,
  get,
  limitToLast,
  orderByChild,
  ref,
  set,
  update,
  query,
  orderByKey,
  remove,
} from "firebase/database";
import { dbs } from "../firebase/index";
import uuid from "react-uuid";
import moment from "moment";
import { addTime } from "../../utils/time";

const dbRef = ref(dbs); // Create Database reference

export const SignupPatient = async (data) => {
  return new Promise(async (resolve, reject) => {
    // const hash = await bcrypt.hash(data.password,10);

    get(child(dbRef, "Patient/" + data.phoneNo)).then((snapShot) => {
      if (snapShot.exists()) {
        reject("User already exists");
      } else {
        set(child(dbRef, "Patient/" + data.phoneNo), {
          id: data.uid,
          accesstoken: data.accessToken,
          phoneno: data.phoneNumber,
          createdAt: Date.now(),
          isregistered: false,
          isloggedin: false,
        }).then(() =>
          resolve({
            id: data.uid,
            accessToken: data.accessToken,
            phoneno: data.phoneNumber,
            createdat: Date.now(),
            isregistered: false,
            isloggedin: false,
          })
        );
      }
    });
  });
};

export const SignupDoctor = async (data) => {
  return new Promise(async (resolve, reject) => {
    get(child(dbRef, "Doctor/" + data.phoneNo)).then((snapShot) => {
      if (snapShot.exists()) {
        reject("User already exists");
      } else {
        set(child(dbRef, "Doctor/" + data.phoneNo), {
          id: data.uid,
          accesstoken: data.accessToken,
          phoneno: data.phoneNumber,
          createdAt: Date.now(),
          isregistered: false,
          isloggedin: false,
        }).then((res) =>
          resolve({
            id: data.uid,
            accessToken: data.accessToken,
            phoneno: data.phoneNumber,
            createdat: Date.now(),
            isregistered: false,
            isloggedin: false,
          })
        );
      }
    });
  });
};

export const loginPatient = async (data) => {
  return new Promise(async (resolve, reject) => {
    get(child(dbRef, "Patient/" + data.phoneNumber)).then((snapShot) => {
      if (!snapShot.exists()) {
        set(child(dbRef, "Patient/" + data.phoneNumber), {
          id: data.uid,
          accesstoken: data.accessToken,
          phoneno: data.phoneNumber,
          createdAt: Date.now(),
          isregistered: false,
          isloggedin: true,
        }).then(() =>
          resolve({
            id: data.uid,
            accessToken: data.accessToken,
            phoneno: data.phoneNumber,
            createdat: Date.now(),
            isregistered: false,
            isloggedin: true,
          })
        );
      } else {
        const val = snapShot.val();

        var updates = {};
        updates["/Patient/" + data.phoneNo + "/isloggedin"] = true;
        update(dbRef, updates).then(() => {
          console.log("Updated");
          resolve({ ...val, isloggedin: true });
        });
      }
    });
  });
};

export const loginDoctor = async (data) => {
  return new Promise(async (resolve, reject) => {
    console.log(data)
    get(child(dbRef, "Doctor/" + data.phoneNumber)).then((snapShot) => {
      if (!snapShot.exists()) {
        set(child(dbRef, "Doctor/" + data.phoneNumber), {
          id: data.uid,
          accesstoken: data.accessToken,
          phoneno: data.phoneNumber,
          createdAt: Date.now(),
          isregistered: false,
          isloggedin: true,
        }).then((res) =>
          resolve({
            id: data.uid,
            accessToken: data.accessToken,
            phoneno: data.phoneNumber,
            createdat: Date.now(),
            isregistered: false,
            isloggedin: true,
          })
        );
      } else {
        const val = snapShot.val();

        var updates = {};
        updates["/Doctor/" + data.phoneNumber + "/isloggedin"] = true;
        update(dbRef, updates).then(() => {
          console.log("Updated");
          resolve({ ...val, isloggedin: true });
        });
      }
    });
  });
};

export const createPatient = async (data) => {
  const bodyObj = {
    id: data.id,
    name: data.name,
    age: data.age,
    city: data.city,
    address: data.address,
    state: data.state,
    pincode: data.pincode,
    dob: data.dob,
    phoneno: data.phone,
    gender: data.gender,
    bloodgp: data.bloodGp,
    email: data.email,
    modifiedAt: Date.now(),
  };
  return new Promise(async (resolve, reject) => {
    set(child(dbRef, "Patient/" + data.phone + "/Profile"), bodyObj)
      .then(() => {
        console.log("Set");
        var updates = {};
        updates["/Patient/" + data.phone + "/isregistered"] = true;
        update(dbRef, updates)
          .then((res) => {
            console.log(res, "Updated");
            resolve({ ...bodyObj, type: "patient" });
          })
          .catch((err) => reject(err.message));
      })
      .catch((err) => reject(err.message));
  });
};

export const updatePatient = async (data) => {
  return new Promise(async (resolve, reject) => {
    var updates = {};
    updates["address"] = data.address;
    updates["age"] = data.age;
    updates["bloodgp"] = data.bloodGp;
    updates["city"] = data.city;
    updates["dob"] = data.dob;
    updates["email"] = data.email;
    updates["gender"] = data.gender;
    updates["name"] = data.name;
    updates["phoneno"] = data.phoneNo;
    updates["pincode"] = data.pincode;
    updates["state"] = data.state;
    update(child(dbRef, "Patient/" + data.phoneNo + "/Profile/"), updates)
      .then(() => resolve({ ...updates, type: "patient" }))
      .catch((err) => reject(err.message));
  });
};

export const updateDoctor = async (data) => {
  return new Promise(async (resolve, reject) => {
    console.log(data)
    var updates = {};
    updates["name"] = data.name;
    updates["phoneno"] = data.phoneNo;
    updates["qualifications"] = data.qualifications;
    updates["email"] = data.email;
    updates["department"] = data.department;
    updates["hospital"] = data.hospitalName;
    updates["age"] = data.age;
    updates["specializations"] = data.specialisations;
    updates["address"] = data.address;
    updates["workingDays"] = data.workingDays;
    updates["workingHours"] = data.workingHrs;
    updates["modifiedAt"]=Date.now()
    update(child(dbRef, "Doctor/" + data.phoneNo + "/Profile/"), updates)
      .then(() => resolve({ ...updates, type: "doctor" }))
      .catch((err) => reject(err.message));
  });
};

export const createDoctor = async (data) => {
  console.log(data);
  const bodyObj = {
    id: data.id,
    name: data.name,
    phoneno: data.phoneNo,
    qualifications: data.qualifications,
    email: data.email,
    department: data.department,
    hospital: data.hospitalName,
    age: data.age,
    specializations: data.specialisations,
    address: data.address,
    workingDays: data.workingDays,
    workingHours: data.workingHrs,
    modifiedAt: Date.now(),
  };
  //console.log(bodyObj);
  return new Promise(async (resolve, reject) => {
    set(child(dbRef, "Doctor/" + data.phoneNo + "/Profile"), bodyObj)
      .then(() => {
        console.log("Set");
        var updates = {};
        updates["/Doctor/" + data.phoneNo + "/isregistered"] = true;
        update(dbRef, updates)
          .then((res) => {
            console.log(res, "Updated");
            resolve({ ...bodyObj, type: "doctor" });
          })
          .catch((err) => reject(err.message));
      })
      .catch((err) => reject(err.message));
  });
};

export const logoutPatient = async (data) => {
  return new Promise(async (resolve, reject) => {
    const auth = getAuth();
    signOut(auth).then(() => {
      var updates = {};
      updates["isloggedin"] = false;
      update(child(dbRef, "Patient/" + data.phoneno + "/"), updates)
        .then(() => {
          resolve("Logged out successfully");
        })
        .catch((err) => reject(err.message));
    });
  });
};

export const logoutDoctor = async (data) => {
  return new Promise(async (resolve, reject) => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        var updates = {};
        updates["isloggedin"] = false;
        update(child(dbRef, "Doctor/" + data.phoneno + "/"), updates)
          .then(() => {
            resolve("Logged out successfully");
          })
          .catch((err) => reject(err.message));
      })
      .catch((error) => {
        // An error happened.
        reject(error.message);
      });
  });
};

export const getAllDoctors = async () => {
  return new Promise(async (resolve, reject) => {
    get(child(dbRef, "Doctor/"))
      .then((ss) => {
        if (!ss.exists()) {
          reject("No data exists");
        } else {
          const d = ss.val();
          const d_arr = [];
          Object.keys(d).forEach((k) => {
            d_arr.push(d[k]);
          });
          console.log(d_arr);
          resolve(d_arr);
        }
      })
      .catch((err) => {
        reject(err.message);
      });
  });
};

export const getDoctor = async (phoneno) => {
  return new Promise(async (resolve, reject) => {
    console.log("Get Doctor Called",phoneno);
    get(child(dbRef,`Doctor/${phoneno}`)).then(ss=>{
      if(!ss.exists()){
        reject("The doctor with this phone number doesnt exists");
      }
      const val=ss.val();
      resolve(val.Profile);
    }).catch((err)=>reject(err.message))
  });
};

export const getPatient = async (phoneno) => {
  return new Promise(async (resolve, reject) => {
    get(child(dbRef, "Patient/" + phoneno + "/Profile")).then((snapShot) => {
      if (!snapShot.exists()) {
        reject("No such patient exists with this phone number");
      } else {
        const val = snapShot.val();
        resolve({ ...val, type: "patient" });
      }
    });
  });
};

export const createAppointment = async (data) => {
  return new Promise(async (resolve, reject) => {
    const dt = moment(new Date()).format("YYYY-MM-DD");
    console.log(data);
    get(
      query(
        child(dbRef, `Appointment/${data.apdate}/${data.dphoneno}`),
        orderByChild("pphoneno"),equalTo(data.pphoneno)
      )
    ).then((snapShot) => {
      if (snapShot.exists()) {
        console.log(snapShot.val())
        reject(
          "You have already booked an appointment with this doctor on this date"
        );
      } else {
        get(child(dbRef, `Doctor/${data.dphoneno}/Profile`)).then((ss) => {
          if (!ss.exists()) {
            reject("No such doctor exists");
            return;
          } else {
            const dval = ss.val();
            console.log(dval);
            console.log({
              start: dval.workingHours.start.toString().slice(0, 5),
              end: addTime(dval.workingHours.start.toString().slice(0, 5)),
            });
            var weekday = new Array(7);
            weekday[0] = "Sunday";
            weekday[1] = "Monday";
            weekday[2] = "Tuesday";
            weekday[3] = "Wednesday";
            weekday[4] = "Thursday";
            weekday[5] = "Friday";
            weekday[6] = "Saturday";
            const day = weekday[new Date(dt).getDay()].toLowerCase();
            if (!dval.workingDays.includes(day)) {
              reject(`${dval.name} is not available in this day`);
              return;
            }
            get(
              query(
                child(dbRef, `Appointment/${data.apdate}/${data.dphoneno}`)
              ),
              limitToLast(1)
            ).then((snapS) => {
              if (!snapS.exists()) {
                var ts=Date.now();
                set(
                  child(
                    dbRef,
                    `Appointment/${data.apdate}/${data.dphoneno}/${ts}`
                  ),
                  {
                    apdate: data.apdate,
                    dphoneno: data.dphoneno,
                    pphoneno: data.pphoneno,
                    id: uuid(),
                    symptoms: data.symptoms,
                    type: data.type,
                    status: "queued",
                    aptime: {
                      start: dval.workingHours.start.toString().slice(0, 5),
                      end: addTime(
                        dval.workingHours.start.toString().slice(0, 5)
                      ),
                    },
                    createdat:ts
                  }
                )
                  .then(() => {
                    resolve({
                      status: 200,
                      response: {
                        apdate: data.apdate,
                        dphoneno: data.dphoneno,
                        pphoneno: data.pphoneno,
                        id: uuid(),
                        symptoms: data.symptoms,
                        type: data.type,
                        status: "queued",
                        aptime: {
                          start: dval.workingHours.start.toString().slice(0, 5),
                          end: addTime(
                            dval.workingHours.start.toString().slice(0, 5)
                          ),
                        },
                        createdat:ts
                      },
                    });
                  })
                  .catch((err) => reject(err.message));
              } else {
                const v = Object.values(snapS.val())[0];
                const ts = Date.now();
                set(
                  child(
                    dbRef,
                    `Appointment/${data.apdate}/${data.dphoneno}/${ts}`
                  ),
                  {
                    apdate: data.apdate,
                    dphoneno: data.dphoneno,
                    pphoneno: data.pphoneno,
                    id: uuid(),
                    symptoms: data.symptoms,
                    type: data.type,
                    status: "queued",
                    aptime: { start: v.aptime.end, end: addTime(v.aptime.end) },
                    createdat: ts,
                  }
                )
                  .then(() => {
                    resolve({
                      success: 200,
                      response: {
                        apdate: data.apdate,
                        dphoneno: data.dphoneno,
                        pphoneno: data.pphoneno,
                        id: uuid(),
                        symptoms: data.symptoms,
                        type: data.type,
                        status: "queued",
                        aptime: {
                          start: v.aptime.end,
                          end: addTime(v.aptime.end),
                        },
                        createdAt: ts,
                      },
                    });
                  })
                  .catch((err) => reject(err.message));
              }
            });
          }
        });
      }
    });
  });
};

export const getAppointment = async (data) => {
  console.log("Get Appointment Called", data);
  return new Promise(async (resolve, reject) => {
    const dt = moment(new Date()).format("YYYY-MM-DD");
    console.log(data);
    if (data.forUser === "doctor") {
      if (!data.status) {
        get(child(dbRef, `Appointment/${dt}/${data.dphoneNo}`))
          .then((ss) => {
            if (!ss.exists()) {
              reject("No appointments are found for this doctor at this date");
            } else {
              resolve({ status: 200, response: ss.val() });
            }
          })
          .catch((err) => reject(err.message));
      } else {
        get(
          query(
            child(`Appointment/${dt}/${data.dphoneNo}`),
            orderByChild("status"),
            equalTo(data.status)
          )
        ).then((ss) => {
          if (!ss.exists()) {
            reject("No appointments left today");
          } else {
            console.log(ss.val());
          }
        });
      }
    } else if (data.forUser == "patient") {
      if (!data.status) {
        get(child(dbRef, `Appointment/`)).then((ss) => {
          if (!ss.exists()) {
            resolve([]);
            return;
          }
          var PatientArray = [];
        
          Object.values(ss.val()).map((dno) => {
            const allPatient = Object.values(dno);
            console.log(allPatient)
            allPatient.map((ppn) => {
              const patient = Object.values(ppn);
              console.log(patient)
              patient.map(pt=>{
                if (pt.pphoneno == data.pphoneNo) {
                  PatientArray.push(pt);
                }
              })
              
            });
          });

          resolve({ status: 200, response: PatientArray });
        });
      } else {
        get(child(dbRef, `Appointment`))
          .then((ss) => {
            var PatientArray = [];
            Object.values(ss.val()).map((dno) => {
              const allPatient = Object.values(dno);
              allPatient.map((ppn) => {
                const patient = Object.values(ppn);
                patient.map((pt)=>{
                  if (
                    pt.status == data.status &&
                    pt.pphoneno == data.pphoneNo
                  ) {
                    PatientArray.push(pt);
                  }
                })
                
              });
            });
            console.log("PatientArray", PatientArray);
            resolve({ status: 200, response: PatientArray });
          })
          .catch((err) => reject(err.message));
      }
    } else return;
  });
};

export const getTodayAppointment = async (data) => {
  return new Promise(async (resolve, reject) => {
    console.log(data)
    const dt = moment(new Date()).format("YYYY-MM-DD");
    get(child(dbRef, `Appointment/${dt}/${data.dphoneNo}`))
      .then((ss) => {
        if (!ss.exists()) {
          reject("No appointments are found for this doctor at this date");
        } else {
          var r=Object.values(ss.val())
          r=r.filter(rp=>rp.status==data.status)
          resolve({status:200,response:r})
        }
      })
      .catch((err) => reject(err.message));
  });
};
export const cancelAppointment = async (data) => {
  return new Promise(async (resolve, reject) => {
    set(
      query(
        child(dbRef, `Appointment/${data.aptdate}/${data.dphoneno}/`),
        orderByChild("pphoneno"),
        equalTo(data.pphoneno)
      ),
      null
    )
      .then(() => resolve({ response: "Successfully deleted", status: 200 }))
      .catch((err) => reject(err.message));
  });
};

export const updateAppointment = async (data) => {
  return new Promise(async (resolve, reject) => {
    console.log(data)
    var updates={};
    updates[`Appointment/${data.apdate}/${data.dphoneno}/${data.createdat}/status`]=data.status;
    update(dbRef,updates).then(ss=>{
      get(child(dbRef,`Appointment/${data.apdate}/${data.dphoneno}/${data.createdat}`)).then(snapShot=>{
        resolve({
          status:200, 
          message:"Successfully Updated",
          data:snapShot.val()
        })
      }).catch(err=>{
        reject(err.message)
      })
    }).catch(err=>{
      reject(err.message)
    });
  });
};
export const testRoute = async () => {
  return new Promise(async (resolve, reject) => {
    await fetch(`${SPARK_API_URL}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};
