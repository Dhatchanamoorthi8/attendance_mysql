import React, { useEffect, useState } from 'react';
import { FaUser } from "react-icons/fa";
import { VscListSelection } from "react-icons/vsc";
import { FaLayerGroup } from "react-icons/fa6";
import { CgClose } from "react-icons/cg";
import { MdSpaceDashboard } from "react-icons/md";
import { NavLink } from 'react-router-dom';
import "../Style/sidebar.css"
import { CiLogout } from "react-icons/ci";
import { BsFillJournalBookmarkFill } from "react-icons/bs";
import { IoIosClose } from "react-icons/io";
import Swal from 'sweetalert2'
import { MdArrowRight } from "react-icons/md";
import axios from 'axios';
import { FaFileLines } from "react-icons/fa6";
import { FaRupeeSign } from "react-icons/fa";
import { Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';


const Sidebar = ({ children, onLogout, }) => {

    const apiUrl = process.env.REACT_APP_API_BASE_URL

    console.log(apiUrl);

    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const [subMenuIndex, setSubMenuIndex] = useState(null);
    const [sessiondatas, setSessiondatas] = useState({});
    const [oldpassword, setoldpassword] = useState("")
    const [changepassword, setchangepassword] = useState({
        newpassword: '',
        confirmpassword: '',
    })

    useEffect(() => {
        Getcompanydata()
        const storedUserData = JSON.parse(localStorage.getItem('userData'));
        if (storedUserData && storedUserData.username && storedUserData.description && storedUserData.password && storedUserData.usercode) {
            setSessiondatas(storedUserData);
        } else {
            setSessiondatas({ message: "" });
        }
    }, []);
    const [CompanyDatas, setCompanyDatas] = useState([])

    const Getcompanydata = () => {                                  // company data get logo image
        axios.get(`${apiUrl}/companyprofile`)
            .then((res) => {
                console.log(res.data);
                setCompanyDatas(res.data)
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handleLogout = () => {                       // LOG-OUT CODE

        Swal.fire({
            title: 'Do you want Logout The Page!',
            showDenyButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: 'No',
            position: "center",
            allowOutsideClick: false,
            width: '30em',
            heightAuto: true,
            customClass: {
                title: 'my-title-className',
                actions: 'logout-action',
                confirmButton: 'order-5',
                denyButton: 'order-6',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                onLogout();
                localStorage.clear()
                sessionStorage.clear();
                console.log("success");
                const Toast = Swal.mixin({
                    toast: true,
                    position: "center",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                    }
                });
                Toast.fire({
                    icon: "success",
                    title: "Account Logout Successfully"
                });
            }
            else if (result.isDenied) {
                Swal.fire('Your Account Not Logout', '', 'info');
            }
        })
    }
    const menuItems = [
        {
            name: 'Dashboard',
            icon: <MdSpaceDashboard style={{ fontSize: isOpen ? "20px" : "25px", margin: isOpen ? "0px 0px 0px 0px" : "5px 0px 5px 0px" }} />,
            path: '/dashboard',
        },
        {
            name: 'Master',
            icon: <FaLayerGroup style={{ fontSize: isOpen ? "20px" : "25px", margin: isOpen ? "0px 0px 0px 0px" : "5px 0px 5px 0px" }} />,
            subItems: [
                { name: 'Company', path: '/company', icon: <MdArrowRight style={{ fontSize: "30px" }} /> },
                { name: 'Branch', path: '/branch', icon: <MdArrowRight style={{ fontSize: "30px" }} /> },
                { name: 'Division', path: '/division', icon: <MdArrowRight style={{ fontSize: "30px" }} /> },
                { name: 'Department', path: '/department', icon: <MdArrowRight style={{ fontSize: "30px" }} /> },
                { name: 'Designation', path: '/designation', icon: <MdArrowRight style={{ fontSize: "30px" }} /> },
                { name: 'Employee', path: '/employee', icon: <MdArrowRight style={{ fontSize: "30px" }} /> },
            ],
        },
        {
            name: 'Enquiry',
            icon: <BsFillJournalBookmarkFill style={{ fontSize: isOpen ? "20px" : "25px", margin: isOpen ? "0px 0px 0px 0px" : "5px 0px 5px 0px" }} />,
            subItems: [
                { name: 'Enquiry', path: '/enquiry', icon: <MdArrowRight style={{ fontSize: "30px" }} /> },
                { name: 'Followup', path: '/followup', icon: <MdArrowRight style={{ fontSize: "30px" }} /> }
            ],
        },
        {
            name: 'Billing',
            icon: <FaRupeeSign style={{ fontSize: isOpen ? "20px" : "25px", margin: isOpen ? "0px 0px 0px 0px" : "5px 0px 5px 0px" }} />,
            subItems: [
                { name: 'Type Pack', path: '/typeofpack', icon: <MdArrowRight style={{ fontSize: "30px" }} /> },
                { name: 'Billing', path: '/billing', icon: <MdArrowRight style={{ fontSize: "30px" }} /> }
            ],
        },
        {
            name: 'Report',
            icon: <FaFileLines style={{ fontSize: isOpen ? "20px" : "25px", margin: isOpen ? "0px 0px 0px 0px" : "5px 0px 5px 0px" }} />,
            subItems: [
                { name: 'Log Report', path: '/logreport', icon: <MdArrowRight style={{ fontSize: "30px" }} /> },
                { name: 'Attendance Report', path: '/attendancereport', icon: <MdArrowRight style={{ fontSize: "30px" }} /> },
                { name: 'Enquiry Report', path: '/EnquiryReport', icon: <MdArrowRight style={{ fontSize: "30px" }} /> },
                { name: 'Sales Report', path: '/SalesReport', icon: <MdArrowRight style={{ fontSize: "30px" }} /> },
            ],
        },
        {
            name: 'Profile',
            icon: <FaUser style={{ fontSize: isOpen ? "20px" : "25px", margin: isOpen ? "0px 0px 0px 0px" : "5px 0px 5px 0px" }} />,
            subItems: [
                { name: 'Personal Info', path: '/company-profile', icon: <MdArrowRight style={{ fontSize: "30px" }} /> },
            ],
        },
    ];
    const handleSubMenuToggle = (index) => {
        setSubMenuIndex(subMenuIndex === index ? null : index);
    };
    const handlechangepassword = () => {
        if (oldpassword === "") {
            Swal.fire({
                text: "Please Enter Old Password!",
                icon: "warning"
            });
            return
        }
        if (changepassword.newpassword === "") {
            Swal.fire({
                text: "Please Enter New Password!",
                icon: "warning"
            });
            return
        }
        if (changepassword.confirmpassword === "") {
            Swal.fire({
                text: "Please Enter Confirm Password!",
                icon: "warning"
            });
            return
        }
        if (changepassword.newpassword !== changepassword.confirmpassword) {
            Swal.fire({
                text: "Please Confirm Your New Password And Confirm Password Not Same!",
                icon: "warning"
            });
            return
        }
        if (sessiondatas.password === changepassword.newpassword) {
            Swal.fire({
                text: "Old Password & New Password Same Please Change New Password!",
                icon: "warning"
            });
            return
        }

        Swal.fire({
            title: 'Are you sure Change The Password?',
            showDenyButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: 'No',
            position: "center",
            allowOutsideClick: false,
            width: '30em',
            heightAuto: true,
            customClass: {
                title: 'my-title-className',
                actions: 'logout-action',
                confirmButton: 'order-5',
                denyButton: 'order-6',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                setTimeout(() => {
                    try {
                        const alldata = { ...changepassword, usercode: sessiondatas.usercode }
                        console.log(alldata);
                        axios.put(`${apiUrl}/changepassword`,alldata)
                            .then((res) => {
                                popup(false)
                                console.log(res);
                                const functionThatReturnPromise = () =>
                                new Promise((resolve) => setTimeout(resolve, 500));
                              toast.promise(
                                functionThatReturnPromise,
                                {
                                  pending: 'Change Your Password',
                                  error: 'Data deletion failed',
                                  success: 'Your Password Change successfully',
                                }
                              )
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                    }
                    catch (err) {
                        console.log(err)

                    }
                }, 2000);

            }
        })

    }


    const [show, popup] = useState(false)
    const changepassword_btn = () => {
        popup(true)
    }
    const modalClose = () => popup(false)

    return (

        <div className="containers p-0" style={{ display: 'flex' }}>

            <div style={{ width: isOpen ? "200px" : "60px" }} className="sidebar border border-start-0 border-bottom-0 border-top-0  ">
                <div className="top_section d-flex flex-wrap">
                    {CompanyDatas.map((datas) => {
                        return <img
                            src={`data:image/png;base64,${datas.CompanyPhoto}`}
                            style={{ display: isOpen ? "block" : "none" }}
                            alt='logo' className="logo" />
                    })}
                    <div style={{ marginLeft: isOpen ? "70px" : "-2px" }} className="bars">
                        {isOpen ? (<CgClose onClick={toggle} />) : (<VscListSelection onClick={toggle} />)}
                    </div>
                    <div className="login-name bg-orange-600 p-1 w-full h-10 rounded mt-3 bg-opacity-30" style={{ display: isOpen ? 'flex' : 'none' }}>
                        <h1 className="text-center ms-auto me-auto text-uppercase mb-2 mt-2 text-wrap">
                            {sessiondatas.username ? sessiondatas.username : sessiondatas.message}
                        </h1>
                        <h3 className="text-center ms-auto me-auto text-uppercase mb-2 mt-2 text-wrap user-name text-orange-500">{sessiondatas.description ? sessiondatas.description : sessiondatas.description}</h3>
                    </div>
                </div>
                {menuItems.map((item, index) => (
                    <div key={index}>
                        {item.subItems ? (
                            <div>
                                <div className="link nav-link" onClick={() => handleSubMenuToggle(index)}>
                                    <div className="icon position-relative">{item.icon}</div>
                                    <div style={{ display: isOpen ? 'block' : 'none' }} className="link_text">
                                        {item.name}
                                    </div>
                                </div>
                                <div style={{ display: isOpen && subMenuIndex === index ? 'block' : 'none' }}>
                                    {item.subItems.map((subItem, subIndex) => (
                                        <NavLink to={subItem.path} key={subIndex} className="link nav-link drop-down-nav" activeclassName="active">
                                            <div className="icon position-relative" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title={subItem.name}>
                                                {subItem.icon}
                                            </div>
                                            <div className="link_text">{subItem.name}</div>
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <NavLink to={item.path} key={index} className="link nav-link" activeclassName="active">
                                <div className="icon position-relative" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title={item.name}>
                                    {item.icon}
                                </div>
                                <div style={{ display: isOpen ? 'block' : 'none' }} className="link_text">
                                    {item.name}
                                </div>
                            </NavLink>
                        )}
                    </div>
                ))}

                <div className="change-password">
                    <button className='btn btn-success ms-auto me-auto' style={{ display: isOpen ? "flex" : "none", marginTop: isOpen ? "50%" : "250%", }} onClick={changepassword_btn}>Change Password</button>
                </div>

                <div className="logout-btn">
                    <button className=" btn btn-outline-danger logout-btn icon"
                        type='button'
                        style={{ display: isOpen ? "block" : "block", marginTop: isOpen ? "5%" : "200%", padding: isOpen ? "5% 30% 5% 30%" : "28%" }}
                        onClick={handleLogout}
                        data-bs-toggle="tooltip"
                        data-bs-custom-className="custom-tooltip"
                        data-bs-placement="top"
                        data-bs-title="Logout Button"
                    ><CiLogout />
                    </button>
                </div>

            </div>
            <main style={{ flex: 1, height: '100vh', overflowY: 'auto' }}>
                <div className="main-navbar m-0 p-0">
                    {/* <Mainnavbar/> */}
                </div>
                <div className="child" style={{ padding: "20px" }}>
                    {children}
                </div>

            </main>




            <Modal show={show} animation={true} onHide={modalClose}>
                <Modal.Header>
                    <h1 className="modal-title fs-5" id="staticBackdropLabel">Change Password</h1>
                    <button type="button" className="btn icon-link-hover" onClick={modalClose}><IoIosClose style={{ fontSize: "30px" }} /></button>
                </Modal.Header>
                <Modal.Body>
                    <div className="old-password">
                        <label htmlFor="old-password" className='form-label'>Enter Old Password</label>
                        <input type="text" className='form-control' onChange={(e) => setoldpassword(e.target.value)} />
                    </div>
                    <div className="New-password">
                        <label htmlFor="old-password" className='form-label'>Enter New Password</label>
                        <input type="text"
                            className='form-control'
                            onChange={(e) => setchangepassword(preve => ({ ...preve, newpassword: e.target.value }))} />
                    </div>
                    <div className="Confirm-password">
                        <label htmlFor="old-password" className='form-label'>Enter Confirm Password</label>
                        <input type="text"
                            className='form-control'
                            onChange={(e) => setchangepassword(preve => ({ ...preve, confirmpassword: e.target.value }))} />
                    </div>
                    <div className="changepassword-btn col-12 mt-3">
                        <button tabIndex={true} type='button' className='btn btn-outline-primary col-12' onClick={handlechangepassword}>Change Passord</button>
                    </div>
                </Modal.Body>
            </Modal>
            <ToastContainer/>
        </div>
    );
};

export default Sidebar;