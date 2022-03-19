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
import {child, get, ref, set, update} from "firebase/database"
import {dbs} from "../firebase/index"
import uuid from "react-uuid"

const dbRef = ref(dbs); // Create Database reference


export const SignupPatient = async (data) => {
  return new Promise(async (resolve, reject) => {
    
    // const hash = await bcrypt.hash(data.password,10);
    const id=uuid();
    get(child(dbRef,"Patient/"+data.phoneNo)).then(snapShot=>{
      if(snapShot.exists()){
        reject("User already exists");
      }else{
        set(child(dbRef,"Patient/"+data.phoneNo),{
          id:id,
          phoneno:data.phoneNo,
          password:data.password,
          createdAt:Date.now(),
          isregistered:false,
          isloggedin:false
        }).then((res)=>resolve({
          id:id,
          accessToken:null,
          phoneno:data.phoneNo,
          password:data.password,
          createdat:Date.now(),
          isregistered:false,
          isloggedin:false
        }))
      }
    })
  });
};

export const SignupDoctor = async (data) => {
  return new Promise(async (resolve, reject) => {
    await fetch(`${SIGNUP_DOCTOR_URL}`, {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) resolve(result.response);
        else reject(result.err);
      })
      .catch((err) => reject(err));
  });
};

export const loginPatient = async (data) => {
  return new Promise(async (resolve, reject) => {
    // console.log(data)
    get(child(dbRef,"Patient/"+data.phoneNo)).then(snapShot=>{
      // console.log(snapShot)
      if(!snapShot.exists()){
        reject("User doesn't exists,Please do signup");
      }else{
        const val=snapShot.val();
        if(val.password==data.password){
          var updates={};
          updates["/Patient/"+data.phoneNo+"/isloggedin"]=true;
          update(dbRef,updates).then(()=>{
            console.log("Updated")
            resolve({...val,isloggedin:true})
          });
      }else{
        reject("Incorrect credentials")
      }
    }
    })
    // await fetch(`${LOGIN_PATIENT_URL}`, {
    //   method: "POST",
    //   body: data,
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // })
    //   .then((response) => response.json())
    //   .then((result) => {
    //     if (result.success) resolve(result.response.data);
    //     else reject(result.err);
    //   })
    //   .catch((err) => reject(err));
  });
};

export const loginDoctor = async (data) => {
  return new Promise(async (resolve, reject) => {
    await fetch(`${LOGIN_DOCTOR_URL}`, {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) resolve(result.response.data);
        else reject(result.err);
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
    modifiedAt:Date.now()
  };
  return new Promise(async (resolve, reject) => {
    set(child(dbRef,"Patient/"+data.phone+"/Profile"),bodyObj).then(()=>{
      console.log("Set")
      var updates={}
      updates['/Patient/'+data.phone+'/isregistered']=true;
      update(dbRef,updates).then((res)=>{
        console.log(res,"Updated");
        resolve({...bodyObj,type:"patient"});
    }).catch((err)=>
      reject(err.message))
  }).catch((err)=> reject(err.message));
})
}

export const updatePatient = async (data) => {

  return new Promise(async (resolve, reject) => {
    var updates={};
    updates['address']=data.address;
    updates['age']=data.age;
    updates['bloodgp']=data.bloodGp;
    updates['city']=data.city;
    updates['dob']=data.dob;
    updates['email']=data.email;
    updates['gender']=data.gender;
    updates['name']=data.name;
    updates['phoneno']=data.phoneNo;
    updates['pincode']=data.pincode;
    updates['state']=data.state;
    update(child(dbRef,"Patient/"+data.phoneNo+"/Profile/"),updates).then(()=>resolve({...updates,type:"patient"})).catch(err=>reject(err.message));
  });
};

export const updateDoctor = async (data) => {

  return new Promise(async (resolve, reject) => {
    await fetch(`${UPDATE_DOCTOR_URL}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) resolve(result.response);
        else reject(result.err);
      })
      .catch((err) => {
        reject(err.message);
      });
  });
};

export const createDoctor = async (data) => {
  return new Promise(async (resolve, reject) => {
    await fetch(`${CREATE_DOCTOR_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) resolve(result.response);
        else reject(result.err);
      })
      .catch((err) => reject(err));
  });
};

export const logoutPatient = async (data) => {
  return new Promise(async (resolve, reject) => {
    await fetch(
      `${LOGOUT_PATIENT_URL}?` +
        new URLSearchParams({
          phoneNo: data.phoneno,
        }),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.success) resolve(result.response);
        else reject(result.err);
      });
  });
};

export const logoutDoctor = async (data) => {
  return new Promise(async (resolve, reject) => {
    await fetch(
      `${LOGOUT_DOCTOR_URL}?` +
        new URLSearchParams({
          phoneNo: data.phoneno,
        }),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.success) resolve(result.response);
        else reject(result.err);
      });
  });
};

export const getAllDoctors = async () => {
  return new Promise(async (resolve, reject) => {
    await fetch(`${GET_ALL_DOC}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if(result.success)
        resolve(result.response);
        else
        reject(result.err)
      })
      .catch((err) => reject(err));
  });
};

export const getDoctor = async (phoneno) => {
  return new Promise(async (resolve, reject) => {
    await fetch(
      `${GET_DOCTOR}?` +
        new URLSearchParams({
          phoneno: phoneno,
        }),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.success) resolve(result.response);
        else reject(result.err);
      })
      .catch((err) => reject(err.message));
  });
};

export const getPatient = async (phoneno) => {
  return new Promise(async (resolve, reject) => {
    get(child(dbRef,"Patient/"+phoneno+"/Profile")).then(snapShot=>{
      if(!snapShot.exists()){
        reject("No such patient exists with this phone number")
      }else{
        const val=snapShot.val();
        resolve({...val,type:"patient"});
      }
    })
  });
};

export const createAppointment = async (data) => {
  return new Promise(async (resolve, reject) => {
    await fetch(`${CREATE_AP_URL}`, {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if(result.success)
        resolve(result);
        else
        reject(result.err)
      })
      .catch((err) => reject(err));
  });
};

export const getAppointment = async (data) => {
  return new Promise(async (resolve, reject) => {
    if (data.forUser === "doctor") {
      const url = data.status?GET_AP_URL +
      `all?forUser=doctor&status=${data.status}&dphoneNo=${data.dphoneNo}`:
      GET_AP_URL +
          `all?forUser=doctor&dphoneNo=${data.dphoneNo}`
      await fetch(
        url,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          if(result.success)
          resolve(result);
          else
          reject(result.response)
        })
        .catch((err) => reject(err));
    } else if(data.forUser === 'patient'){
      const url = data.status?GET_AP_URL +
      `all?forUser=patient&status=${data.status}&pphoneNo=${data.pphoneNo}`:
      GET_AP_URL +
          `all?forUser=patient&pphoneNo=${data.pphoneNo}`
      await fetch(
        url,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
      
          if(result.success)
          resolve(result);
          else
          reject(result.response)
        })
        .catch((err) => reject(err));
    }
    else return;
  });
};


export const getTodayAppointment = async (data) => {
  return new Promise(async (resolve,reject) => {

    const url = GET_AP_URL +
    `all?forUser=doctor&dphoneNo=${data.dphoneNo}&status=${data.status}`
    await fetch(
      url,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((result) => {
        if(result.success)
        resolve(result);
        else
        reject(result)
      })
      .catch((err) => reject(err));

  })
}
export const cancelAppointment = async (data) => {
  return new Promise(async (resolve, reject) => {
    await fetch(`${CANCEL_AP_URL}`, {
      method: "DELETE",
      body: data,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if(result.success)
        resolve(result);
        else
        reject(result.err)
      })
      .catch((err) => reject(err));
  });
};

export const updateAppointment = async (data) => {
  return new Promise(async (resolve,reject) => {
    await fetch(`${UPDATE_AP_URL}`,{
      method:'PUT',
      body:data,
      headers:{
        'Content-Type':'application/json'
      }
    })
    .then(response => response.json())
    .then((result) => {
      if(result.success)
      resolve(result.response)
      else
      reject(result.err)
    })
    .catch(err => reject(err.message))
  })
}
export const testRoute = async () => {
  return new Promise(async (resolve,reject) => {
    await fetch(`${SPARK_API_URL}`,{
      method:'get',
      headers:{
        'Content-Type':'application/json'
      }
    })
    .then(result => resolve(result))
    .catch(err => reject(err))
  })
}