import React, { useEffect, useState } from 'react'
import "../Style/employee.css"
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2'
import { IoIosClose } from "react-icons/io";
import { Pagination } from 'react-bootstrap';
import { CSVLink } from "react-csv";
import { HiOutlineDownload, HiOutlineUpload } from "react-icons/hi";
import { Modal } from 'react-bootstrap';


const EmployeeMaster = () => {

  const apiUrl = process.env.REACT_APP_API_BASE_URL

  console.log(apiUrl);

  const [employeedatainsert, setemployeedatainsert] = useState({
    empolyeecode: "",
    empolyeename: "",
    dateofbirth: "",
    mobileno: "",
    email: "",
    dateofjoin: "",
    referenceno: "",
    status: "",
    companyid: "",
    branchid: "",
    divisonid: "",
    departmentid: "",
    designationid: "",
  })

  const [Updateemployeedata, setUpdateemployeedata] = useState({
    employeecode: "",
    employeename: "",
    dateofbirth: "",
    mobileno: "",
    email: "",
    dateofjoin: "",
    referenceno: "",
    status: "",
    companyid: "",
    branchid: "",
    divisionid: "",
    departmentid: "",
    designationid: "",
  })

  const [importcompanydata, setimportcompanydata] = useState({
    employeename: "",
    employeecode: ""
  })

  const [filterdata, setfilterdata] = useState({
    employeename: "",
    employeecode: "",
    status: '',
  })

  const [employeeimage, setemployeeimage] = useState("")
  const [employeeupdateimage, setemployeeupdateimage] = useState("")

  const [tabledata, settabledata] = useState([])

  const [dropdowndata, setDropdowndata] = useState([])

  const [updateid, setupdateid] = useState("")

  const [loader, setloader] = useState(false)
  const [exportdata, setexportdata] = useState([])

  const [validation, setvalidation] = useState([])

  const [useridforcratedby, setuseridforcratedby] = useState({})

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem('userData'));
    if (storedUserData && storedUserData.userid) {
      setuseridforcratedby(storedUserData)
    }
    else {
      setuseridforcratedby({ message: "empty" })
    }

    defaultimageload();
    axios.get(`${apiUrl}/EmployeeExportdata`)
      .then((res) => {
        setvalidation(res.data || [])
        const employeeRecords = res.data;
        const transformedData = employeeRecords.map((item) => ({
          employeeid: item.employeeid,
          empoloyeecode: item.empoloyeecode,
          employeename: item.employeename,
          dateofbirth: item.dateofbirth,
          dateofjoining: item.dateofjoining,
          referenceno: item.referenceno,
          status: item.status,
        }));
        setexportdata(transformedData);
      })
      .catch((err) => {
        console.log(err);
      });

  }, []);

  const headers = [
    { label: "Sno", key: "Sno" },
    { label: "Employee Id", key: "employeeid" },
    { label: "Empoloyee Code", key: "empoloyeecode" },
    { label: "EmployeeName", key: "employeename" },
    { label: "Date Of Birth", key: "dateofbirth" },
    { label: "Date Of Joining", key: "dateofjoining" },
    { label: "Referenceno", key: "referenceno" },
    { label: "Status", key: "status" },
  ];


  useEffect(() => {
    Promise.all([axios.get(`${apiUrl}/drop-down`)])
      .then((responses) => {
        const allData = responses.reduce((acc, response) => {
          if (response.data && Array.isArray(response.data)) {
            acc.push(...response.data);
          }
          return acc;
        }, []);
        const uniqueData = Array.from(new Set(allData));

        setDropdowndata(uniqueData);
      })
      .catch((err) => console.log(err));

    branchtabledata()
  }, [])

  const [branchdropdown, setbranchdropdown] = useState([])

  const hanlecompanydropdown = (e) => {
    const value = e.target.value;
    setemployeedatainsert(prevData => ({ ...prevData, companyid: value }))
    setUpdateemployeedata(prevData => ({ ...prevData, companyid: value }))

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

    setUpdateemployeedata(prevData => ({ ...prevData, branchid: value }))

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

    setUpdateemployeedata(prevData => ({ ...prevData, divisonid: value }))

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
    setUpdateemployeedata(prevData => ({ ...prevData, departmentid: value }))
    axios.get(`${apiUrl}/drop-down-designation/${value}`)
      .then((res) => {
        console.log(res.data);
        setdesignationdropdown(res.data || [])

      })
      .catch((err) => {
        console.error(err);
      });
  };

  const branchtabledata = async () => {
    await axios.get(`${apiUrl}/getActiveEmployees`)
      .then((res) => {
        console.log(res)
        settabledata(res.data || [])
      })
      .catch((err) => console.log(err))
  }

  const createdBy = useridforcratedby.userid || useridforcratedby.message;

  const handleSearchData = async (e) => {
    e.preventDefault();
    try {
      if (filterdata.employeecode.length === 0 && filterdata.employeename.length === 0) {
        Swal.fire({
          text: "Please Enter Any One Employee Code Or Name!",
          icon: "warning",
          button: "ok",
        })
      }
      else if (filterdata.status.length === 0) {
        Swal.fire({
          text: "Please Select One Active or Inactive Status!",
          icon: "warning"
        });
      }
      else {
        const res = await axios.post(`${apiUrl}/searchEmployees`, filterdata);
        console.log(res);
        settabledata(res.data || []);
        if (!res.data || res.data.length === 0) {
          setTimeout(() => {
            branchtabledata();
          }, 2000);
        }
      }

    } catch (err) {
      console.log(err);
      setTimeout(() => {
        branchtabledata();
      }, 2000);
    }
  };
  const handleEmployeeNameChange = (e) => {
    const value = e.target.value;
    setfilterdata({ ...filterdata, employeename: value });
    if (value.trim() === '') {
      branchtabledata();
    }
  };

  const handleEmployeeCodeChange = (e) => {
    const value = e.target.value;
    setfilterdata({ ...filterdata, employeecode: value });
    if (value.trim() === '') {
      branchtabledata();
    }
  };

  const handleEmployeestatusChange = (e) => {
    const value = e.target.value;
    setfilterdata({ ...filterdata, status: value });
    if (value.trim() === '') {
      branchtabledata();
    }
  };

  // insert database
  const handletableinsertdata = (e) => {
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
    if (employeedatainsert.mobileno === '') {
      Swal.fire({
        text: "Please enter a Valid Mobile Number !",
        icon: "warning"
      });
      return;
    }

    if (employeedatainsert.email === '') {
      Swal.fire({
        text: "Please enter a Valid Email Address !",
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
    const isCodeExists = validation.some((item) => {
      return item.empoloyeecode === employeedatainsert.empolyeecode;
    });

    const isNameExists = validation.some((item) => {
      return item.employeename === employeedatainsert.empolyeename;
    });

    if (isCodeExists) {
      console.log("error finded");
      Swal.fire({
        text: "This Employee Code Alread Presented Give Unique Code !",
        icon: "warning",
      })
      return
    }
    if (isNameExists) {
      Swal.fire({
        title: "This Employee Name Alread Presented Give Unique Name !",
        icon: "warning",
        text: 'Tip :If you Want Save Same Name Give initials',
        customClass: {
          title: 'titileforemployeename',
        }
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
              empolyeename: employeedatainsert.empolyeename.trim(), mobileno: employeedatainsert.mobileno.trim(), email: employeedatainsert.email.trim(), referenceno: employeedatainsert.referenceno.trim(),
              images: employeeimage, createdBy: createdBy
            }
            axios.post(`${apiUrl}/employee_post`, alldata)
              .then((res) => {
                console.log(res)
                setloader(false);
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
                setemployeeimage("");
                const functionThatReturnPromise = () =>
                  new Promise((resolve) => setTimeout(resolve, 500));
                toast.promise(
                  functionThatReturnPromise,
                  {
                    pending: 'Inserting Your Data',
                    error: 'Login failed',
                    success: "Your data Insert Successfully"
                  }
                )
              })
              .then(() => {
                branchtabledata()
                setemployeedatainsert({
                  ...employeedatainsert,
                  empolyeecode: "",
                  empolyeename: "",
                  dateofbirth: "",
                  mobileno: "",
                  email: "",
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
              .catch((err) => console.log(err))
          }
          catch (err) {
            console.log(err);
            setloader(false)
          }

        }, 1500);
      }
      else {
        setloader(false)
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
            setemployeeupdateimage(base64String);
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


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const pagesToShow = Math.ceil(tabledata.length / itemsPerPage);
  const visiblePages = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = tabledata.slice(indexOfFirstItem, indexOfLastItem);
  const searchedit = (id) => {
    axios.get(`${apiUrl}/editemployee_data/`+ id)
      .then(res => {
        const { empoloyeecode, employeename, dateofbirth, mobileno, email, dateofjoining, referenceno, status, companyid, branchid, divisionid, departmentid, designationid } = res.data[0];
        setUpdateemployeedata({
          employeecode: empoloyeecode, employeename: employeename, dateofbirth: dateofbirth, mobileno: mobileno,
          email: email, dateofjoin: dateofjoining, referenceno: referenceno, status: status, companyid: companyid, branchid: branchid, divisionid: divisionid, departmentid: departmentid, designationid: designationid
        });
      })
  }
  const [show, popup] = useState(false)

  const handelupdateid = (employeeid) => {
    setupdateid(employeeid)
    searchedit(employeeid);
    popup(true)
  }

  const modalClose = () =>{
    popup(false)
    SetImportmodal(false)
  }

  const [Importmodal, SetImportmodal] = useState(false)
  const Importdata = () => {
    SetImportmodal(true)
  }


  // delete 
  const handledelete = (employeeid) => {
    Swal.fire({
      title: 'Are you sure Delete Data ! ',
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
            axios.delete(`${apiUrl}/delete_employeemaster`, { data: { id: employeeid } })
              .then((res) => {
                console.log(res)
                setloader(false);
                const functionThatReturnPromise = () =>
                  new Promise((resolve) => setTimeout(resolve, 500));
                toast.promise(
                  functionThatReturnPromise,
                  {
                    pending: 'Deleting Your Data',
                    error: 'Data deletion failed',
                    success: 'Data deleted successfully',
                  }
                )
              })
              .then(() => {
                branchtabledata()
              })
              .catch((err) => console.log(err));
          }
          catch (err) {
            console.log(err);
          }


        }, 1500);

      } else {
        setloader(false)
      }


    })
  }
  // update datase
  const handelupdate = (e) => {
    e.preventDefault();
    if (Updateemployeedata.employeecode === '') {
      Swal.fire({
        text: "Please enter a Employee Code!",
        icon: "warning"
      });
      return;
    }
    if (Updateemployeedata.employeename === '') {
      Swal.fire({
        text: "Please enter a Employee Name!",
        icon: "warning"
      });
      return;
    }
    if (Updateemployeedata.dateofbirth === '') {
      Swal.fire({
        text: "Please enter a Employee Date of Birth !",
        icon: "warning"
      });
      return;
    }
    if (Updateemployeedata.mobileno === '') {
      Swal.fire({
        text: "Please enter a Valid Mobile Number!",
        icon: "warning"
      });
      return;
    }
    if (Updateemployeedata.email === '') {
      Swal.fire({
        text: "Please enter a Valid Email Address !",
        icon: "warning"
      });
      return;
    }
    if (Updateemployeedata.dateofjoin === '') {
      Swal.fire({
        text: "Please enter a Employee Date Of Join !",
        icon: "warning"
      });
      return;
    }
    if (Updateemployeedata.referenceno === '') {
      Swal.fire({
        text: "Please enter a Employee referenceno !",
        icon: "warning"
      });
      return;
    }
    if (Updateemployeedata.status === '') {
      Swal.fire({
        text: "Please select a Status!",
        icon: "warning"
      });
      return;
    }
    if (Updateemployeedata.companyid === '') {
      Swal.fire({
        text: "Please Select  Employee Companyname !",
        icon: "warning"
      });
      return;
    }

    if (Updateemployeedata.branchid === '') {
      Swal.fire({
        text: "Please Select  Employee BranchName !",
        icon: "warning"
      });
      return;
    }

    if (Updateemployeedata.divisonid === '') {
      Swal.fire({
        text: "Please Select  Employee DivisonName !",
        icon: "warning"
      });
      return;
    }
    if (Updateemployeedata.departmentid === '') {
      Swal.fire({
        text: "Please Select Employee DepartmentName !",
        icon: "warning"
      });
      return;
    }
    if (Updateemployeedata.designationid === '') {
      Swal.fire({
        text: "Please Select Employee DesignationName !",
        icon: "warning"
      });
      return;
    }
    Swal.fire({
      title: 'Are you sure Update The Data? ',
      showDenyButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: 'No',
      position: "center",
      allowOutsideClick: false,
      width: '25em',
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
            const alldatas = {
              ...Updateemployeedata, employeecode: Updateemployeedata.employeecode.trim(),
              empolyeename: Updateemployeedata.employeename.trim(), mobileno: Updateemployeedata.mobileno.trim(), email: Updateemployeedata.email.trim(), referenceno: Updateemployeedata.referenceno.trim(), images: employeeupdateimage, createdBy: createdBy
            }
            axios.put(`${apiUrl}/updateemployeedata/${updateid}`, alldatas)
              .then((res) => {
                console.log(res)
                setloader(false);
                const functionThatReturnPromise = () =>
                  new Promise((resolve) => setTimeout(resolve, 500));
                toast.promise(
                  functionThatReturnPromise,
                  {
                    pending: 'Updating Your Data',
                    error: 'Login failed',
                    success: "Your data Updated Successfully"
                  }
                )
              })
              .then(() => {
                branchtabledata()
                popup(false)
              })
              .catch((err) => console.log(err))
          }
          catch (err) {
            console.log(err);
            setloader(false)
          }

        }, 1500)

      }
      else {
        setloader(false)
      }
    })
  }
  //Upload database
  const handleUploadExcelSheet = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {

      const fileName = selectedFile.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();


      if (fileExtension === 'csv' || fileExtension === 'xls' || fileExtension === 'xlsx') {

        setimportcompanydata(selectedFile);
      } else {

        alert('Please select a CSV or Excel file.');

      }
    }
  };

  const handleuploaddata = (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Are you sure Upload The Data? ',
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
            const formData = new FormData();
            formData.append('file', importcompanydata);
            formData.append('createdBy', createdBy);
            axios.post(`${apiUrl}/upload-data`, formData)
              .then((response) => {
                console.log(response.data);
                setloader(false);
                const functionThatReturnPromise = () =>
                  new Promise((resolve) => setTimeout(resolve, 500));
                toast.promise(
                  functionThatReturnPromise,
                  {
                    pending: 'Updating Your Data',
                    error: 'Login failed',
                    success: "Your data Upload Successfully"
                  }
                )

              })
              .then(() => {
                branchtabledata()
                SetImportmodal(false)
              })
              .catch((error) => {
                console.error('Error uploading file:', error);
              });
          }
          catch (err) {
            console.log(err);
            setloader(false)
          }
        }, 1500);

      }
      else {
        setloader(false)
      }

    })

  }
  return (
    <div className='employee-container'>

      <div className="Employee-form d-flex align-items-center justify-content-center position-relative ">
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
        <form className='forms border rounded  p-3 col-20 col-lg-8 col-xl-10 row' onSubmit={handletableinsertdata} style={{ opacity: loader ? "0.1" : "1" }}>
          <h3 className=' text-3xl text-center'>Employee Registration</h3>
          <hr className='mb-3 mt-1' />


          <div className="employee-code col-12 col-md-6 col-lg-5 col-xl-4">
            <label htmlFor="employee-code" className='form-label'>Employee Code</label>
            <input type="text" className='form-control mb-3' placeholder='e.g. A1234' value={employeedatainsert.empolyeecode} onChange={(e) => {
              const inputvalue = e.target.value.toUpperCase()
              setemployeedatainsert({ ...employeedatainsert, empolyeecode: inputvalue })
            }} />
          </div>

          <div className="employee-name col-12 col-md-6 col-lg-5 col-xl-4">
            <label htmlFor="employee-name" className='form-label'>Employee Name</label>
            <input type="text" className='form-control mb-3' placeholder='e.g. Jhon' value={employeedatainsert.empolyeename} onChange={(e) => {
              const inputvalue = e.target.value.toUpperCase()
              setemployeedatainsert({ ...employeedatainsert, empolyeename: inputvalue })
            }} />
          </div>
          <div className="branch-name col-12 col-md-6 col-lg-5 col-xl-4">
            <label htmlFor="branch-name" className='form-label'>Date Of Birth</label>
            <input type="date" className='form-control mb-3' value={employeedatainsert.dateofbirth} onChange={(e) => setemployeedatainsert({ ...employeedatainsert, dateofbirth: e.target.value })} />
          </div>
          <div className="branch-name col-12 col-md-6 col-lg-5 col-xl-4">
            <label htmlFor="branch-name" className='form-label'>Mobile No</label>
            <input type="tel" maxLength={10} className='form-control mb-3' placeholder='e.g. 89XX-34XX-XX63' value={employeedatainsert.mobileno} onChange={(e) => { setemployeedatainsert({ ...employeedatainsert, mobileno: e.target.value }) }} />
          </div>

          <div className="branch-name col-12 col-md-6 col-lg-5 col-xl-4">
            <label htmlFor="branch-name" className='form-label'>Email</label>
            <input type="email" className='form-control mb-3' placeholder='e.g. jhon@gmail.com' value={employeedatainsert.email} onChange={(e) => { setemployeedatainsert({ ...employeedatainsert, email: e.target.value }) }} />
          </div>

          <div className="branch-name col-12 col-md-6 col-lg-5 col-xl-4">
            <label htmlFor="branch-name" className='form-label'>Date of Join</label>
            <input type="date" className='form-control mb-3' value={employeedatainsert.dateofjoin} onChange={(e) => { setemployeedatainsert({ ...employeedatainsert, dateofjoin: e.target.value }) }} />
          </div>

          <div className="branch-name col-12 col-md-6 col-lg-5 col-xl-4">
            <label htmlFor="branch-name" className='form-label'>Reference No</label>
            <input type="text" className='form-control mb-3' value={employeedatainsert.referenceno} placeholder='Enter Reference No'
              onChange={(e) => {
                const inputvalue = e.target.value.toUpperCase()
                setemployeedatainsert({ ...employeedatainsert, referenceno: inputvalue })
              }} />
          </div>

          <div className="status col-12 col-md-6 col-lg-5 col-xl-4">
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



          <div className="company-id col-12 col-md-6 col-lg-5 col-xl-4">
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

          <div className="company-id col-12 col-md-6 col-lg-5 col-xl-4">
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

          <div className="company-id col-12 col-md-6 col-lg-5 col-xl-4">
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

          <div className="company-id col-12 col-md-6 col-lg-5 col-xl-4">
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
          <div className="company-id col-12 col-md-6 col-lg-5 col-xl-4">
            <label htmlFor="Branch" className='form-label'>Designation Name</label>
            <select name="Branch" id="branch-select" className='form-select col-12 mb-3' value={employeedatainsert.designationid} onChange={(e) => setemployeedatainsert({ ...employeedatainsert, designationid: e.target.value })}>
              <option value="">Select Designation</option>
              {designationdropdown && designationdropdown
                .filter(data => data && typeof data.designationname === 'string' && data.designationname.trim().length > 0
                  && (data.designationname === "STAFF" || data.designationname === "TRAINEE"))
                .map(data => (
                  <option key={data.designationid} value={data.designationid}>
                    {data.designationname}
                  </option>
                ))
              }
            </select>
          </div>


          <div className="company-id col-12 col-md-6 col-lg-5 col-xl-4">
            <label htmlFor="Branch" className='form-label'>Select Employee Images</label>
            <input type="file" className='form-control' onChange={handleImageChange} />
          </div>


          <div className="submit-btn ms-auto me-auto col-7 mt-5">
            <button className='btn btn-success col-12'>Submit</button>
          </div>
        </form>
      </div>
      <div className="import-export gap-3 d-flex mt-3 justify-content-end ">
        <button className='btn btn-dark d-flex gap-2' onClick={Importdata}><HiOutlineUpload style={{ fontSize: "20px" }} />Upload Data</button>
        <CSVLink className='btn btn-success  d-flex gap-2 text-dark fw-semibold ' data={exportdata} headers={headers} filename={"EmployeeData.csv"}><HiOutlineDownload style={{ fontSize: "20px" }} />Export Data</CSVLink >
      </div>
      <div className="filter d-flex  ms-auto mb-2  mt-3">
        <form action="" onSubmit={handleSearchData} className=' d-inline-flex  ms-auto gap-2'>
          <input type="text" onChange={handleEmployeeNameChange} className='form-control' placeholder='Enter Employee Name' />
          <input type="text" onChange={handleEmployeeCodeChange} className='form-control' placeholder='Enter Employee Code' />
          <div className="status d-flex gap-2">

            <select name="status" id="status-search" onChange={handleEmployeestatusChange} className='form-select w-60'>
              <option value="">Select One Status</option>
              <option value="Active">Active</option>
              <option value="InActive">InActive</option>
            </select>

          </div>
          <button type="submit" className='btn btn-dark'>Search</button>
        </form>

      </div>

      <div className="table-company-datas mt-32 mt-lg-0 mt-xl-0 mt-md-0">

        <div className="overflow-auto rounded-lg shadow hidden d-flex ">

          <table className="w-full table-hover">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left">Employee ID</th>
                <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left">Employee Code</th>
                <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">Employee Name</th>
                <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left">Status</th>
                <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">Photo</th>
                <th className="w-10 p-3 text-sm font-semibold tracking-wide text-left">Update</th>
                <th className="w-10 p-3 text-sm font-semibold tracking-wide text-left">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentData.length > 0 ? (
                currentData.map((datas, index) => (
                  <tr className="bg-white" key={index}>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      <p className="font-bold text-blue-500 hover:underline">{datas.employeeid}</p>
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {datas.empoloyeecode}
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {datas.employeename}
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      <span
                        className={`p-1.5 text-xs font-medium uppercase tracking-wider rounded-lg bg-opacity-50 ${datas.status === 'Active'
                          ? 'text-green-800 bg-green-200'
                          : 'text-yellow-800 bg-red-500'
                          }`}
                      >
                        {datas.status}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      <img
                        src={`data:image/png;base64,${datas.photo}`}
                        alt=""
                        height={10}
                        className="border"
                      />
                    </td>
                    <td className="p-3 whitespace-nowrap btn-primary">
                      <button
                        className="btn btn-primary"
                        onClick={() => handelupdateid(datas.employeeid)}
                      >
                        Update
                      </button>
                    </td>
                    <td className="p-3 whitespace-nowrap btn-danger">
                      <button
                        className="btn btn-danger"
                        onClick={() => handledelete(datas.employeeid)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap text-center" colSpan="7">
                    Your Not Found
                  </td>
                </tr>
              )}
            </tbody>

          </table>

        </div>
      </div>

      {/* Update Modal */}

      <Modal show={show} animation={true} onHide={modalClose}>
        <Modal.Header>
          <h1 className="modal-title fs-5" id="staticBackdropLabel">Update Employee Data</h1>
          <button type="button" className="btn icon-link-hover" onClick={modalClose}><IoIosClose style={{ fontSize: "30px" }} /></button>
        </Modal.Header>
        <Modal.Body>
          <form action="#" className='company-update-modal' onSubmit={handelupdate}>
            <div className="row row-cols-6">
              <div className="branch-name col-12 col-md-6 col-lg-6 col-xl-6">
                <label htmlFor="branch-name" className='form-label'>Employee Code</label>
                <input type="text" className='form-control mb-3' value={Updateemployeedata.employeecode} onChange={(e) => { setUpdateemployeedata({ ...Updateemployeedata, employeecode: e.target.value }) }} required />
              </div>

              <div className="branch-name col-12 col-md-6 col-lg-6 col-xl-6">
                <label htmlFor="branch-name" className='form-label'>Employee Name</label>
                <input type="text" className='form-control mb-3' value={Updateemployeedata.employeename} onChange={(e) => setUpdateemployeedata({ ...Updateemployeedata, employeename: e.target.value.toUpperCase()})} required />
              </div>
              <div className="branch-name col-12 col-md-6 col-lg-6 col-xl-6">
                <label htmlFor="branch-name" className='form-label'>Date Of Birth</label>
                <input type="date" className='form-control mb-3' value={Updateemployeedata.dateofbirth} onChange={(e) => setUpdateemployeedata({ ...Updateemployeedata, dateofbirth: e.target.value })} required />
              </div>

              <div className="branch-name col-12 col-md-6 col-lg-6 col-xl-6">
                <label htmlFor="branch-name" className='form-label'>Mobile No</label>
                <input type="tel" className='form-control mb-3' maxLength={10} value={Updateemployeedata.mobileno} onChange={(e) => setUpdateemployeedata({ ...Updateemployeedata, mobileno: e.target.value })} required />
              </div>
              <div className="branch-name col-12 col-md-6 col-lg-6 col-xl-6">
                <label htmlFor="branch-name" className='form-label'>Email</label>
                <input type="email" className='form-control mb-3' value={Updateemployeedata.email} onChange={(e) => setUpdateemployeedata({ ...Updateemployeedata, email: e.target.value })} required />
              </div>

              <div className="branch-name col-12 col-md-6 col-lg-6 col-xl-6">
                <label htmlFor="branch-name" className='form-label'>Date of Join</label>
                <input type="date" className='form-control mb-3' value={Updateemployeedata.dateofjoin} onChange={(e) => setUpdateemployeedata({ ...Updateemployeedata, dateofjoin: e.target.value })} required />
              </div>

              <div className="branch-name col-12 col-md-6 col-lg-6 col-xl-6">
                <label htmlFor="branch-name" className='form-label'>Reference No</label>
                <input type="text" className='form-control mb-3' value={Updateemployeedata.referenceno} onChange={(e) => setUpdateemployeedata({ ...Updateemployeedata, referenceno: e.target.value })} required />
              </div>

              <div className="status col-12 col-md-6 col-lg-6 col-xl-6">
                <label htmlFor="status" className='form-label'>Status</label> <br />
                <div className="select-status d-flex gap-6 mt-1 ms-2">
                  <div className="form-check">
                    <label htmlFor="Active">Active</label>
                    <input type="radio" className='form-check-input' name='status' checked={Updateemployeedata.status === 'Active'} value={'Active'} onChange={(e) => setUpdateemployeedata({ ...Updateemployeedata, status: e.target.value })} />
                  </div>
                  <div className="form-check">
                    <label htmlFor="Active">InActive</label>
                    <input type="radio" className='form-check-input' name='status' checked={Updateemployeedata.status === 'InActive'} value={'InActive'} onChange={(e) => setUpdateemployeedata({ ...Updateemployeedata, status: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="company-id col-12 col-md-6 col-lg-6 col-xl-6">
                <label htmlFor="Branch" className='form-label'>Company Id</label>
                <select
                  name="Branch"
                  id="branch-select"
                  className='form-select col-12 mb-3'
                  value={Updateemployeedata.companyid}
                  onChange={hanlecompanydropdown}
                  required>
                  <option value="">Select Company</option>
                  {dropdowndata &&
                    dropdowndata
                      .filter(
                        data => typeof data.companyname === 'string' && data.companyname.trim().length > 0 && data.status === "Active")
                      .map(data => (
                        <option key={data.companyid} value={data.companyid}>
                          {data.companyname}
                        </option>
                      ))}
                </select>

              </div>

              <div className="company-id col-12 col-md-6 col-lg-6 col-xl-6">
                <label htmlFor="Branch" className='form-label'>Branch Id</label>
                <select name="Branch" id="branch-select" className='form-select col-12 mb-3' value={Updateemployeedata.branchid}
                  onChange={hanlebranchdropdown} required>
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
                <label htmlFor="Division" className='form-label'>Division Id</label>
                <select name="Division" id="division-select" className='form-select col-12 mb-3'
                  onChange={hanledivisondropdown} required>
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
                <label htmlFor="Department" className='form-label'>Department Id</label>
                <select
                  name="Department"
                  id="department-select"
                  className='form-select col-12 mb-3'
                  value={Updateemployeedata.departmentid}
                  onChange={hanledepartmentdropdown}
                  required>
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
                <label htmlFor="Branch" className='form-label'>Designation Id</label>
                <select name="Branch" id="branch-select" className='form-select col-12 mb-3' value={Updateemployeedata.designationid} onChange={(e) => setUpdateemployeedata({ ...Updateemployeedata, designationid: e.target.value })} required>
                  <option value="">Select Designation</option>
                  {designationdropdown && designationdropdown
                    .filter(data => data && typeof data.designationname === 'string' && data.designationname.trim().length > 0)
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
              <div className="statu col-12 col-md-6 col-lg-6 col-xl-6 mt-6">
                <button className='btn btn-success col-12'>Submit</button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>








      {/* Import data in database */}

      <Modal show={Importmodal} animation={true} onHide={modalClose}>
        <Modal.Header>
          <h1 className="modal-title fs-5" id="exampleModalLabel">Import Data</h1>
          <button type="button" className="btn" onClick={modalClose}><IoIosClose style={{ fontSize: "30px" }} /></button>
        </Modal.Header>
        <Modal.Body>
          <div className="import-input">
            <label htmlFor="importdata" className=' form-label '>Import Data</label>
            <input type="file" className=' form-control ' onChange={handleUploadExcelSheet} />
            <button className='btn btn-success mt-4' onClick={handleuploaddata}>Upload Data</button>
          </div>
          <hr className='mt-2' />
          <div className="download-sample-template text-center">
            <p>Important ⚠</p>
            <span className='text-danger'>Download The Below The Template That Colum Name Based Enter The Data Then Upload here</span>
            <div>
              <a href="/Sample_tem.xlsx" className=' nav-link text-decoration-underline ' download>Click to Download</a>
            </div>
          </div>
        </Modal.Body>

      </Modal>







      {/* Pagination component */}
      <Pagination className="mt-3 justify-content-end text-black">
        {[...Array(pagesToShow)].map((_, page) => {
          if (
            page < currentPage - Math.floor(visiblePages / 2) ||
            page >= currentPage + Math.ceil(visiblePages / 2)
          ) {
            return null;
          }
          return (
            <Pagination.Item
              key={page + 1}
              active={page + 1 === currentPage}
              onClick={() => handlePageChange(page + 1)}
              className='w-10 text-center'
            >
              {page + 1}
            </Pagination.Item>
          );
        })}
      </Pagination>
      <ToastContainer />
    </div>
  )
}

export default EmployeeMaster
