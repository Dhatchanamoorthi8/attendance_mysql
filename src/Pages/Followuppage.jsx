import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { Pagination } from 'react-bootstrap';
import { IoIosClose } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';

function Followuppage() {

  const apiUrl = process.env.REACT_APP_API_BASE_URL

  console.log(apiUrl);

  useEffect(() => {
    tabeldatas()
    selecttrainedropdown()
    companydropdown()
    defaultimageload()
    validationforemployee()

    const storedUserData = JSON.parse(localStorage.getItem('userData'));
    if (storedUserData && storedUserData.userid) {
      setuseridforcratedby(storedUserData)
    }
    else {
      setuseridforcratedby({ message: "empty" })
    }

  }, [])

  const validationforemployee = () => {
    axios.get(`${apiUrl}/EmployeeExportdata`)
      .then((res) => {
        setvalidation(res.data || [])
      })
      .catch((err) => {
        console.log(err)
      })
  }
  // Use states .....................
  const [validation, setvalidation] = useState([])

  const [tabledata, settabledata] = useState([])
  const [assigndropdown, setassigndropdown] = useState([])

  const [assignvale, setassignvalue] = useState("")

  const [useridforcratedby, setuseridforcratedby] = useState({})

  const [assignid, setassignid] = useState('')

  const [loader, setloader] = useState(false)

  const [dropdowndata, setDropdowndata] = useState([])

  const [employeedatainsert, setemployeedatainsert] = useState({
    empolyeecode: "",
    empolyeename: "",
    dateofbirth: "",
    dateofjoin: "",
    referenceno: "",
    status: "",
    companyid: "",
    branchid: "",
    divisonid: "",
    departmentid: "",
    designationid: "",
  })

  const [GetContactData, setGetContactData] = useState({
    MobileNo: "",
    email: ""
  })


  const [employeeimage, setemployeeimage] = useState("")

  const [followup, setfollowup] = useState({
    mode: "",
    datetime: "",
    remarks: ""
  })

  const [updatefollowup, setupdatefollowup] = useState({
    id: "",
    name: "",
    phoneno: ""
  })

  const createdBy = useridforcratedby.userid || useridforcratedby.message;


  const tabeldatas = () => {
    axios.get(`${apiUrl}/enquire-table-data`)
      .then((res) => {
        console.log(res.data.MobileNo, "mobile no");
        settabledata(res.data || [])
        res.data.map((data) => {
          return setGetContactData({ ...GetContactData, MobileNo: data.MobileNo, email: data.Emailid })
        })
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const companydropdown = () => {
    axios.get(`${apiUrl}/drop-down`)
      .then((res) => {
        console.log(res.data);
        setDropdowndata(res.data)
      })
  }

  const selecttrainedropdown = () => {
    axios.get(`${apiUrl}/select-traine-dropdown`)
      .then((res) => {
        console.log(res);
        setassigndropdown(res.data || [])
      })
      .catch((err) => {
        console.log(err);
      })
  }
  const [branchdropdown, setbranchdropdown] = useState([])

  const hanlecompanydropdown = (e) => {
    const value = e.target.value;
    setemployeedatainsert(prevData => ({ ...prevData, companyid: value }))
    console.log(value);
    axios.get(`${apiUrl}/drop-down-branchid/${value}`)
      .then((res) => {
        console.log(res.data);
        setbranchdropdown(res.data || [])
        // Handle the retrieved data as needed
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const [divisondropdown, setdivisondropdown] = useState([])

  const hanlebranchdropdown = (e) => {

    const value = e.target.value;
    setemployeedatainsert(prevData => ({ ...prevData, branchid: value }))

    axios.get(`${apiUrl}/drop-down-divisonid/${value}`)
      .then((res) => {
        console.log(res.data);
        setdivisondropdown(res.data || [])

      })
      .catch((err) => {
        console.error(err);
      });
  };
  const [departmentdropdown, setdepartmentdropdown] = useState([])
  const hanledivisondropdown = (e) => {
    const value = e.target.value;
    setemployeedatainsert(prevData => ({ ...prevData, divisonid: value }))

    axios.get(`${apiUrl}/drop-down-departmentid/${value}`)
      .then((res) => {
        console.log(res.data);
        setdepartmentdropdown(res.data || [])

      })
      .catch((err) => {
        console.error(err);
      });
  };

  const [designationdropdown, setdesignationdropdown] = useState([])
  const hanledepartmentdropdown = (e) => {
    const value = e.target.value;
    setemployeedatainsert(prevData => ({ ...prevData, departmentid: value }))
    axios.get(`${apiUrl}/drop-down-designation/${value}`)
      .then((res) => {
        console.log(res.data);
        setdesignationdropdown(res.data || [])

      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleassigntraine = (e) => {
    e.preventDefault();
    if (employeedatainsert.empolyeecode === '') {
      Swal.fire({
        text: "Please enter a Employee Code!",
        icon: "warning"
      });
      return;
    }
    if (employeedatainsert.empolyeename === '') {
      Swal.fire({
        text: "Please enter a Employee Name!",
        icon: "warning"
      });
      return;
    }
    if (employeedatainsert.dateofbirth === '') {
      Swal.fire({
        text: "Please enter a Employee Date of Birth !",
        icon: "warning"
      });
      return;
    }
    if (employeedatainsert.dateofjoin === '') {
      Swal.fire({
        text: "Please enter a Employee Date Of Join !",
        icon: "warning"
      });
      return;
    }
    if (employeedatainsert.referenceno === '') {
      Swal.fire({
        text: "Please enter a Employee referenceno !",
        icon: "warning"
      });
      return;
    }
    if (employeedatainsert.status === '') {
      Swal.fire({
        text: "Please select a Status!",
        icon: "warning"
      });
      return;
    }
    if (employeedatainsert.companyid === '') {
      Swal.fire({
        text: "Please Select  Employee Companyname !",
        icon: "warning"
      });
      return;
    }

    if (employeedatainsert.branchid === '') {
      Swal.fire({
        text: "Please Select  Employee BranchName !",
        icon: "warning"
      });
      return;
    }

    if (employeedatainsert.divisonid === '') {
      Swal.fire({
        text: "Please Select  Employee DivisonName !",
        icon: "warning"
      });
      return;
    }
    if (employeedatainsert.departmentid === '') {
      Swal.fire({
        text: "Please Select Employee DepartmentName !",
        icon: "warning"
      });
      return;
    }
    if (employeedatainsert.designationid === '') {
      Swal.fire({
        text: "Please Select Employee DesignationName !",
        icon: "warning"
      });
      return;
    }
    if (assignvale === '') {
      Swal.fire({
        text: "Please Select Assign Trainee!",
        icon: "warning"
      });
      return;
    }


    const isCodeExists = validation.some((item) => {
      return item.empoloyeecode === employeedatainsert.empolyeecode;
    });

    if (isCodeExists) {
      console.log("error finded");
      Swal.fire({
        text: "This Employee Code Alread Presented Give Unique Code !",
        icon: "warning",
      })
      return
    }
    e.preventDefault();
    Swal.fire({
      title: 'Are you sure Assign The Trainee',
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
      setloader(true);
      if (result.isConfirmed) {
        setTimeout(() => {
          try {
            const alldata = {
              ...employeedatainsert, empolyeecode: employeedatainsert.empolyeecode.trim(),
              empolyeename: employeedatainsert.empolyeename.trim(), referenceno: employeedatainsert.referenceno.trim(),
              images: employeeimage, createdBy: createdBy, assignvale,
              mobileno: GetContactData.MobileNo, email: GetContactData.email
            }
            axios.put(`${apiUrl}/enquire-assign/${assignid}`, alldata)
              .then((res) => {
                popup(false)
                console.log(res.data);
                tabeldatas()
                setloader(false);
                const functionThatReturnPromise = () =>
                  new Promise((resolve) => setTimeout(resolve, 500));
                toast.promise(
                  functionThatReturnPromise,
                  {
                    pending: 'Assign Employee',
                    error: 'Login failed',
                    success: "Your Assign User Successfully"
                  }
                )
                setemployeedatainsert({
                  ...employeedatainsert,
                  empolyeecode: "",
                  empolyeename: "",
                  dateofbirth: "",
                  dateofjoin: "",
                  referenceno: "",
                  status: "",
                  companyid: "",
                  branchid: "",
                  divisonid: "",
                  departmentid: "",
                  designationid: "",
                })
              })
              .catch((err) => {
                console.log(err);
              })
          } catch (err) {
            console.log(err);
            console.log("catch condition");
            setloader(false);
          }
        }, 1500);

      }
      else {
        setloader(false);
      }
    })

  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const [currentPage, setCurrentPage] = useState(1);


  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentActiveData = tabledata.slice(indexOfFirstItem, indexOfLastItem);

  const [show, popup] = useState(false)

  const handleassign = (id, name) => {
    console.log(id);
    setassignid(id)
    console.log(name);
    setemployeedatainsert({ ...employeedatainsert, empolyeename: name })
    popup(true)
  }
  const [followupmodal, setfollowupmodal] = useState(false)

  const modalClose = () => {
    popup(false)
    setfollowupmodal(false)
  }

  const handelupdateid = (id, name, phonenumber) => {
    setfollowupmodal(true)
    setupdatefollowup(prevState => ({ ...prevState, id: id, name: name, phoneno: phonenumber }));
  }



  const handleupdate = () => {

    if (followup.mode === "") {
      Swal.fire({
        text: "Please select One Mode!",
        icon: "warning"
      });
      return
    }

    if (followup.mode === "Follow-up" && followup.datetime === "") {
      Swal.fire({
        text: "Please Fill Date And Time!",
        icon: "warning"
      });
      return;
    }

    if (followup.remarks === "") {
      Swal.fire({
        text: "Please Fill Remarks!",
        icon: "warning"
      });
      return
    }
    Swal.fire({
      title: 'Are you sure Save The Data? ',
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
      setloader(true);
      if (result.isConfirmed) {
        setTimeout(() => {
          try {
            const alldatas = { ...updatefollowup, datetime: followup.datetime, remarks: followup.remarks, mode: followup.mode }
            axios.post(`${apiUrl}/updatefollowuppage`, alldatas)
              .then((res) => {
                setfollowupmodal(false)
                console.log(res)
                setfollowup({ ...followup, mode: '', datetime: '', remarks: '' })
                setloader(false);
                tabeldatas()
              })
              .catch((err) => {
                console.log(err)
              })
          }
          catch (err) {
            console.log(err);
            setloader(false);
          }

        }, 1500);
      } else {
        setloader(false);
      }

    })

  }


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    if (file) {
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        reader.onloadend = () => {
          const base64String = reader.result.split(',')[1];
          if (file.size <= 50000) {
            setemployeeimage(base64String);
          } else {
            alert('Please select an image smaller than 50KB.');
            e.target.value = null;
          }
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select a valid JPEG or PNG image.');
        e.target.value = null;
      }
    }
  };


  const defaultimageload = () => {
    const defaultImage = new Image(); // Creating an image object
    defaultImage.src = require("../img/emptyprofile.png"); // Set the source of the image

    defaultImage.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = defaultImage.width;
      canvas.height = defaultImage.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(defaultImage, 0, 0);

      const base64String = canvas.toDataURL('image/png').split(',')[1];
      setemployeeimage(base64String);
    };
  };


  return (
    <div>
      <div className="followup-container">

        <div className="table-company-datas mt-32 mt-lg-0 mt-xl-0 mt-md-0">
          <div className="overflow-auto rounded-lg shadow hidden d-flex ">
            <div className="spiner-loader position-absolute end-50 top-50">
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
            <table className="w-full table-hover overflow-auto" style={{ opacity: loader ? "0.1" : "1" }}>
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="w-10 p-3 text-sm font-semibold tracking-wide text-left border ">So.no</th>
                  <th className="w-20 p-3 text-sm font-semibold tracking-wide text-center border ">CustomerName</th>
                  <th className="w-24 p-3 text-sm font-semibold tracking-wide text-center border ">Phone</th>
                  <th className="w-24 p-3 text-sm font-semibold tracking-wide text-center border ">Email Id</th>
                  <th className="w-25 p-3 text-sm font-semibold tracking-wide text-center border">Assigned User</th>
                  <th className="w-18 p-3 text-sm font-semibold tracking-wide text-center border ">Assign</th>
                  <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left border ">Upadate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentActiveData.map((datas, index) => {
                  return <tr className="bg-white">
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      <p className="font-bold text-blue-500 hover:underline" key={index}>{datas.Sno}</p>
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap text-center" key={index}>
                      {datas.CustomerName}
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap text-center" key={index}>
                      {datas.MobileNo}
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap text-center" key={index}>
                      {datas.Emailid}
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap text-center" key={index} >
                      <span style={{ color: !datas.AssignedUser ? "#EF5350" : "#4CAF50" }} className='text-xl fw-bolder '>
                        {datas.AssignedUser}
                      </span>
                    </td>

                    <td className="p-3 whitespace-nowrap btn-danger text-center">
                      <button className='btn btn-success' onClick={() => handleassign(datas.Enquiryid, datas.CustomerName)}>Assign Trainee</button></td>

                    <td className="p-3 whitespace-nowrap btn-primary ">
                      <button className='btn btn-primary' onClick={() => handelupdateid(datas.Enquiryid, datas.CustomerName, datas.MobileNo)} disabled={!datas.AssignedUser}>Update</button></td>
                  </tr>
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>





      {/* Assign User modal */}

      <Modal show={show} animation={true} onHide={modalClose} className='p-0 m-0'>
        <Modal.Header>
          <h1 className="modal-title fs-5" id="staticBackdropLabel">Assign Employee Data</h1>
          <button type="button" className="btn icon-link-hover" onClick={modalClose}><IoIosClose style={{ fontSize: "30px" }} /></button>
        </Modal.Header>
        <Modal.Body className=' bg-transparent '>
          <form className='forms' onSubmit={handleassigntraine}>
            <div className="row row-cols-6 ">
              <div className="branch-name col-12 col-md-6 col-lg-6 col-xl-6">
                <label htmlFor="branch-name" className='form-label'>Employee Code</label>
                <input type="text" className='form-control mb-3' value={employeedatainsert.empolyeecode} onChange={(e) => {
                  const inputvalue = e.target.value.toUpperCase()
                  setemployeedatainsert({ ...employeedatainsert, empolyeecode: inputvalue })
                }} />
              </div>

              <div className="branch-name col-12 col-md-6 col-lg-6 col-xl-6">
                <label htmlFor="branch-name" className='form-label'>Employee Name</label>
                <input type="text" className='form-control mb-3' value={employeedatainsert.empolyeename} readOnly onChange={(e) => {
                  const inputvalue = e.target.value.toUpperCase()
                  setemployeedatainsert({ ...employeedatainsert, empolyeename: inputvalue })
                }} />
              </div>
              <div className="branch-name col-12 col-md-6 col-lg-6 col-xl-6">
                <label htmlFor="branch-name" className='form-label'>Date Of Birth</label>
                <input type="date" className='form-control mb-3' value={employeedatainsert.dateofbirth} onChange={(e) => setemployeedatainsert({ ...employeedatainsert, dateofbirth: e.target.value })} />
              </div>
              <div className="branch-name col-12 col-md-6 col-lg-6 col-xl-6">
                <label htmlFor="branch-name" className='form-label'>Date of Join</label>
                <input type="date" className='form-control mb-3' value={employeedatainsert.dateofjoin} onChange={(e) => { setemployeedatainsert({ ...employeedatainsert, dateofjoin: e.target.value }) }} />
              </div>

              <div className="branch-name col-12 col-md-6 col-lg-6 col-xl-6">
                <label htmlFor="branch-name" className='form-label'>Reference No</label>
                <input type="text" className='form-control mb-3' value={employeedatainsert.referenceno} onChange={(e) => {
                  const inputvalue = e.target.value.toUpperCase()
                  setemployeedatainsert({ ...employeedatainsert, referenceno: inputvalue })
                }} />
              </div>

              <div className="status col-12 col-md-6 col-lg-6 col-xl-6">
                <label htmlFor="status" className='form-label'>Status</label> <br />
                <div className="select-status d-flex gap-6 mt-1 ms-2">
                  <div className="form-check">
                    <label htmlFor="Active">Active</label>
                    <input type="radio" className='form-check-input' name='status'
                      checked={employeedatainsert.status === 'Active'}
                      value={'Active'} onChange={(e) => setemployeedatainsert({ ...employeedatainsert, status: e.target.value })} />
                  </div>
                  <div className="form-check">
                    <label htmlFor="Active">InActive</label>
                    <input type="radio" className='form-check-input' name='status' value={'InActive'}
                      checked={employeedatainsert.status === 'InActive'}
                      onChange={(e) => setemployeedatainsert({ ...employeedatainsert, status: e.target.value })} />
                  </div>
                </div>
              </div>



              <div className="company-id col-12 col-md-6 col-lg-6 col-xl-6">
                <label htmlFor="Branch" className='form-label'>Company Name</label>
                <select name="Branch" id="branch-select" className='form-select col-12 mb-3' value={employeedatainsert.companyid} onChange={hanlecompanydropdown}>
                  <option value="">Select Company</option>
                  {dropdowndata && dropdowndata
                    .filter(data => data && typeof data.companyname === 'string' && data.companyname.trim().length > 0 && data.status === "Active")
                    .map(data => (
                      <option key={data.companyid} value={data.companyid}>
                        {data.companyname}
                      </option>
                    ))
                  }
                </select>
              </div>

              <div className="company-id col-12 col-md-6 col-lg-6 col-xl-6">
                <label htmlFor="Branch" className='form-label'>Branch Name</label>
                <select name="Branch" id="branch-select" className='form-select col-12 mb-3' value={employeedatainsert.branchid} onChange={hanlebranchdropdown}>
                  <option value="">Select Branch</option>
                  {branchdropdown && branchdropdown
                    .filter(data => data && typeof data.branchname === 'string' && data.branchname.trim().length > 0)
                    .map(data => (
                      <option key={data.branchid} value={data.branchid}>
                        {data.branchname}
                      </option>
                    ))
                  }
                </select>
              </div>

              <div className="company-id col-12 col-md-6 col-lg-6 col-xl-6">
                <label htmlFor="Division" className='form-label'>Division Name</label>
                <select name="Division" id="division-select" className='form-select col-12 mb-3' value={employeedatainsert.divisonid} onChange={hanledivisondropdown}>
                  <option value="">Select Divison</option>
                  {divisondropdown && divisondropdown
                    .filter(data => data && typeof data.divisionname === 'string' && data.divisionname.trim().length > 0)
                    .map(data => (
                      <option key={data.divisionid} value={data.divisionid}>
                        {data.divisionname}
                      </option>
                    ))
                  }
                </select>
              </div>

              <div className="company-id col-12 col-md-6 col-lg-6 col-xl-6">
                <label htmlFor="Department" className='form-label'>Department Name</label>
                <select
                  name="Department"
                  id="department-select"
                  className='form-select col-12 mb-3'
                  onChange={hanledepartmentdropdown}
                  value={employeedatainsert.departmentid}
                >
                  <option value="">Select Department</option>
                  {departmentdropdown && departmentdropdown
                    .filter(data => data && typeof data.departmentname === 'string' && data.departmentname.trim().length > 0)
                    .map(data => (
                      <option key={data.departmentid} value={data.departmentid}>
                        {data.departmentname}
                      </option>
                    ))
                  }
                </select>
              </div>
              <div className="company-id col-12 col-md-6 col-lg-6 col-xl-6">
                <label htmlFor="Branch" className='form-label'>Designation Name</label>
                <select name="Branch" id="branch-select" className='form-select col-12 mb-3' value={employeedatainsert.designationid} onChange={(e) => setemployeedatainsert({ ...employeedatainsert, designationid: e.target.value })}>
                  <option value="">Select Designation</option>
                  {designationdropdown && designationdropdown
                    .filter(data => data && typeof data.designationname === 'string' && data.designationname.trim().length > 0 &&
                      data.designationname === "CUSTOMER")
                    .map(data => (
                      <option key={data.designationid} value={data.designationid}>
                        {data.designationname}
                      </option>
                    ))
                  }
                </select>
              </div>


              <div className="company-id col-12 col-md-6 col-lg-6 col-xl-6">
                <label htmlFor="Branch" className='form-label'>Select Employee Images</label>
                <input type="file" className='form-control' onChange={handleImageChange} />
              </div>

              <div className="company-id col-12 col-md-6 col-lg-6 col-xl-6">
                <label htmlFor="select-traineee" className='form-label'>Assign trainee</label>
                <select name="traine" id="" className='form-select' value={assignvale} onChange={(e) => setassignvalue(e.target.value)}>
                  <option value="" selected>Select One Traine</option>
                  {assigndropdown.map((item, index) => {
                    return (
                      <option value={item.employeename} key={index}>
                        {item.employeename}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="submit-btn ms-auto me-auto col-7 mt-5">
                <button className='btn btn-outline-success col-12' type='submit'>Submit</button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>





      {/* Update modal */}

      <Modal show={followupmodal} animation={true} onHide={modalClose}>
        <Modal.Header>
          <h1 className="modal-title fs-5" id="staticBackdropLabel">Followp/Closed Update Status</h1>
          <button type="button" className="btn icon-link-hover" onClick={modalClose}><IoIosClose style={{ fontSize: "30px" }} /></button>
        </Modal.Header>
        <Modal.Body>
          <div className="drop-down">
            <label htmlFor="Select" className='form-label'>Select Mode</label>
            <select name="mde" id="" className='form-select' onChange={(e) => setfollowup({ ...followup, mode: e.target.value })}>
              <option value="">Select Mode</option>
              <option value="Follow-up">Follow Up</option>
              <option value="Cloesd">Closed</option>
            </select>
          </div>
          <div className={`date-and-time ${followup.mode === "Follow-up" ? " d-inline-grid col-12 mt-2" : "d-none "}`} style={{ display: followup.mode === "Follow-up" ? "flex" : "none" }}>
            <label htmlFor="date&time" className='form-label'>DATE & TIME</label>
            <input type="datetime-local" name="date" className=' form-control' value={followup.datetime} onChange={(e) => setfollowup({ ...followup, datetime: e.target.value })} />
          </div>
          <div className="remarks">
            <label htmlFor="date&time" className='form-label'>Remarks</label>
            <textarea name="" id="addresss" cols="10" rows="5" className='form-control' value={followup.remarks} onChange={(e) => setfollowup({ ...followup, remarks: e.target.value })}></textarea>
          </div>

        </Modal.Body>
        <Modal.Footer className='d-flex gap-4'>
          <button type="button" className="btn btn-outline-secondary px-4" onClick={modalClose} >Close</button>
          <button type="button" className="btn btn-outline-success px-4" onClick={handleupdate}>Save</button>
        </Modal.Footer>
      </Modal>










      {/* Pagination component */}
      <Pagination className="mt-3 justify-content-end text-black">
        {[...Array(Math.ceil(tabledata.length / itemsPerPage))].map((_, page) => (
          <Pagination.Item
            key={page + 1}
            active={page + 1 === currentPage}
            onClick={() => handlePageChange(page + 1)}
            className='w-10 text-center'>
            {page + 1}
          </Pagination.Item>
        ))}
      </Pagination>


      <ToastContainer />
    </div>
  )
}

export default Followuppage