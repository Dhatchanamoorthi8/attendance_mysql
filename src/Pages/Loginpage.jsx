import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Style/login.css';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
AOS.init({});

function Login({ setLoggedIn }) {

  const apiUrl = process.env.REACT_APP_API_BASE_URL

  console.log(apiUrl);

  const [name, setname] = useState('');
  const [password, setPassword] = useState('');
  const [showpass, setshowpass] = useState(false)
  const [loader, setloader] = useState(false)
  const [formchange, setformchange] = useState('login')
  const [forgetpassword, setforgetpassword] = useState({
    usercode: "",
    newpassword: "",
    confirmpassword: ""
  })
  const [usercodematch, setusercodematch] = useState([])

  const navigate = useNavigate();

  const handlepassword = (e) => {
    setPassword(e.target.value)
  }

  useEffect(() => {
    axios.get(`${apiUrl}/forgetpassword`)
      .then((res) => {
        setusercodematch(res.data || [])
      })
  })


  const togglePasswordVisibility = (e) => {
    e.preventDefault()
    setshowpass(!showpass)
  }

  const checkLogin = async (e) => {
    e.preventDefault();
    if (name === '') {
      Swal.fire({
        text: "Please Enter User Code!",
        icon: "warning"
      });
      return;
    }

    if (password === '') {
      Swal.fire({
        text: "Please Enter Password!",
        icon: "warning"
      });
      return;
    }
    let isLoginSuccessful = false;
    try {
      const response = await axios.get(`${apiUrl}/login?name=${name}`)
      response.data.forEach((item) => {
        if (item.usercode === name && item.password === password && item.userstatus === 'A') {
          const localstoragevalue = {
            username: item.username,
            description: item.Description,
            userstatus: item.userstatus,
            userid: item.userid,
            password:item.password,
            usercode:item.usercode,
          }
          localStorage.setItem('userData', JSON.stringify(localstoragevalue));
          isLoginSuccessful = true;
          const functionThatReturnPromise = () => new Promise(resolve => setTimeout(resolve, 2500));
          setloader(true)
          toast.promise(
            functionThatReturnPromise,
            {
              pending: 'Login Your Account',
              success: 'You are Login Success',
            }
          )
        }
        else {
          Swal.fire({
            title: "Your Account Is InActive!",
            icon: "info",
            text: "Please Contact Your Admin.",
          });
        }

      })
      if(isLoginSuccessful) {
        setTimeout(() => {
          navigate('/dashboard');
          setLoggedIn(true);
          setloader(false);
        }, 3000)
      }
      else {
        setloader(true)
        const functionThatReturnPromise = () =>
          new Promise((resolve, rejected) => setTimeout(rejected, 2500));
        toast.promise(
          functionThatReturnPromise,
          {
            pending: 'Login Your Account',
            error: 'Login failed'
          }
        )
        setTimeout(() => {
          setloader(false);
        }, 2500);
      }

    }
    catch (err) {
      Swal.fire({
        text: "Login Not Matching name And password!",
        icon: "info",
        width:"30rem"
      });
    }
  }

  const handleForgetpassword = (e) => {
    e.preventDefault();
    if (forgetpassword.usercode === '') {
      Swal.fire({
        text: "Please Enter User Code!",
        icon: "warning"
      });
      return
    }
    if (forgetpassword.newpassword === '') {
      Swal.fire({
        text: "Please Enter Your New Password!",
        icon: "warning"
      });
      return
    }
    if (forgetpassword.confirmpassword === '') {
      Swal.fire({
        text: "Please Enter Your Confirm Password!",
        icon: "warning"
      });
      return
    }
    if (forgetpassword.newpassword !== forgetpassword.confirmpassword) {
      Swal.fire({
        text: "Please Confirm Your New Password And Confirm Password Not Same!",
        icon: "warning"
      });
      return
    }
    const checkValidUserCode = usercodematch.some((item) => item.usercode === forgetpassword.usercode);
    if (!checkValidUserCode) {
      Swal.fire({
        text: "Please Check Your User Code!",
        icon: "warning"
      })
      return
    }
    Swal.fire({
      title: 'Are you sure Save The Data? ',
      showDenyButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: 'No',
      position: "center",
      allowOutsideClick: false,
      width: '25em',
      heightAuto: true,
      customClass: {
        title: 'my-title-class',
        actions: 'logout-action',
        confirmButton: 'order-5',
        denyButton: 'order-6',
      },
    }).then((result) => {
      setloader(true);
      if (result.isConfirmed) {
        setTimeout(() => {
          try {
            axios.put(`${apiUrl}/forgetpassword-change`, forgetpassword)
              .then((res) => {
                console.log(res);
                setloader(false);
                setForm('login')
                setforgetpassword({...forgetpassword, usercode:'',newpassword:'',confirmpassword:''})
              })
              .catch((err) => {
                console.log(err);
              })
          }
          catch (err) {
            console.log(err);
          }
        }, 1500);
      }
      else {
        setloader(false);
      }
    })
  }

  const setForm = (formType) => {
    setformchange(formType);
  };

  const renderForm = () => {
    switch (formchange) {
      case 'login':
        return (
          <>
            <form className="form border rounded shadow p-3 col-12 col-lg-6 col-md-6 col-sm-6  row row-cols-2 position-relative " style={{ opacity: loader ? "0.1" : "1" }} autoComplete="off">
              <div className="col-lg-6 img-div">
                <img src={require("../img/2.png")} alt="body-building" className='login-side-img d-sm-none d-lg-flex d-xl-flex' />
              </div>
              <div className="input-values col-12 col-lg-6">
                <h2 className='text-center text-3xl font-semibold text-gray-200 '>Login</h2>
                <div className="username my-5">
                  <input
                    type="text"
                    name="usercode"
                    className="input-username"
                    placeholder="   "
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                    required
                    autoComplete="off" />
                  <label htmlFor="input-username" className=" text-black label-username">
                    Enter UserCode
                  </label>
                </div>
                <div className="input-password mt-2">

                  <div className="input-container">
                    <input
                      type={showpass ? 'text' : 'password'}
                      name="password"
                      className="form-controls"
                      placeholder="  "
                      id="input-pass"
                      value={password}
                      onChange={handlepassword}
                      style={{ display: showpass ? '!' : 'flex' }}
                      autoComplete="off"
                    />

                    <label htmlFor="input-pass" className="text-black label-passowrd">
                      Enter Password
                    </label>
                  </div>
                  <div className="forget-password mt-2 text-end position-absolute">
                    <p className='link-dark text-1xl underline cursor-pointer' onClick={() => setForm('forgetpassword')}
                      style={{ display: formchange === "forgetpassword" ? "none" : "flex" }}>Forget Password</p>
                  </div>
                  <div className="showpass-btn">
                    <button onClick={togglePasswordVisibility} className='showpass'>
                      {showpass ? <FaRegEye style={{ fontSize: "20px", zIndex: "500" }} /> : <FaRegEyeSlash style={{ fontSize: "20px", zIndex: "500" }} />}
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-success bg-green-800 col-12 mt-5"
                  onClick={checkLogin}>
                  Login
                </button>
              </div>

            </form>
          </>
        );

      case "forgetpassword":
        return (
          <>
            <form className="form border rounded shadow p-3 col-12 col-lg-6 col-sm-6 col-md-6 row row-cols-2" style={{ opacity: loader ? "0.1" : "1" }} autoComplete="off">
              <div className="col-lg-6 img-div">
                <img src={require("../img/2.png")} alt="body-building" className='login-side-img d-sm-none d-lg-flex d-xl-flex ' />
              </div>
              <div className="input-values col-12 col-lg-6">
                <h2 className='text-center text-3xl font-semibold text-gray-200 '>Forget Password</h2>
                <div className="username mt-4 mb-4">
                  <input
                    type="text"
                    name="text"
                    className="input-username"
                    placeholder="   "
                    onChange={(e) => setforgetpassword(prevState => ({ ...prevState, usercode: e.target.value }))}
                    required
                    autoComplete="off" />
                  <label htmlFor="input-username" className=" text-black label-username">
                    Enter UserCode
                  </label>
                </div>
                <div className="input-password">

                  <div className="input-container mt-4 mb-4">
                    <input
                      type={showpass ? 'text' : 'password'}
                      name="password"
                      className="form-controls"
                      placeholder="  "
                      id="input-pass"
                      value={forgetpassword.newpassword}
                      onChange={(e) => setforgetpassword(prevState => ({ ...prevState, newpassword: e.target.value }))}
                      style={{ display: showpass ? '!' : 'flex' }}
                      autoComplete="off" />
                    <label htmlFor="input-pass" className="text-black label-passowrd">
                      Enter New Password
                    </label>
                  </div>
                  <div className="input-password">
                    <div className="input-container">
                      <input
                        type={showpass ? 'text' : 'password'}
                        name="password"
                        className="form-controls"
                        placeholder="  "
                        id="input-pass"
                        value={forgetpassword.confirmpassword}
                        onChange={(e) => setforgetpassword(prevState => ({ ...prevState, confirmpassword: e.target.value }))}
                        style={{ display: showpass ? '!' : 'flex' }}
                        autoComplete="off"
                      />
                      <label htmlFor="input-pass" className="text-black label-passowrd">
                        Enter Confirm Password
                      </label>
                    </div>
                  </div>

                  <div className="showpass-btn">
                    <button onClick={togglePasswordVisibility} className='showpass'>
                      {showpass ? <FaRegEye style={{ fontSize: "20px", zIndex: "500" }} /> : <FaRegEyeSlash style={{ fontSize: "20px", zIndex: "500" }} />}
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-success bg-green-800 col-12 mt-4"
                  onClick={handleForgetpassword}>
                  Forget Password
                </button>
              </div>
            </form>

          </>
        );
      default:
        return alert("null")
    }
  }




  return (
    <div className='container-main '>

      <div className="login-head d-flex align-items-center justify-content-center p-5 position-relative " data-aos="fade-right">

        <div className="spiner-loader position-absolute">
          <div className="mesh-loader" style={{ display: loader ? "flex" : "none", zIndex: "1" }}>
            <div className="set-one">
              <div className="circle"></div>
              <div className="circle"></div>
            </div>
            <div className="set-two">
              <div className="circle"></div>
              <div className="circle"></div>
            </div>
          </div>
        </div>
        {renderForm()}
      </div>

      <ToastContainer
        theme="dark" />
    </div>
  );
}

export default Login;


