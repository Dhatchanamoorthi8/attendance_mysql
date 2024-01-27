import React, { useEffect, useState } from 'react'
import '../Style/enquiry.css'
import Swal from 'sweetalert2'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import { IoIosClose } from "react-icons/io";
import { Pagination } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
function Enquiry() {

  const apiUrl = process.env.REACT_APP_API_BASE_URL

  console.log(apiUrl);

  const [enquirycollection, setenquirycollection] = useState({
    username: '',
    email: '',
    phoneno: '',
    remarks: '',
  })
  const [useridforcratedby, setuseridforcratedby] = useState({})

  const [tabledatas, settabledatas] = useState([])

  const [updateid, setupdateid] = useState("")

  const [loader, setloader] = useState(false)

  const [Updateenquirydata, setUpdateenquirydata] = useState({
    username: '',
    email: '',
    phoneno: '',
    remarks: '',
  })

  useEffect(() => {
    enquiryfetchdata()
    validationforemployee()
    const storedUserData = JSON.parse(localStorage.getItem('userData'));
    if (storedUserData && storedUserData.userid) {
      setuseridforcratedby(storedUserData)
    }
    else {
      setuseridforcratedby({ message: "empty" })
    }


  }, [])

  const createdBy = useridforcratedby.userid || useridforcratedby.message;


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const [currentPage, setCurrentPage] = useState(1);


  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentActiveData = tabledatas.slice(indexOfFirstItem, indexOfLastItem);


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


  const handlesubmit = async (e) => {
    e.preventDefault()
    if (enquirycollection.username === "") {
      Swal.fire({
        text: "Please Enter Your Name",
        icon: "warning"
      })
      return
    }
    if (enquirycollection.email === "") {
      Swal.fire({
        text: "Please Enter Your Email Address",
        icon: "warning"
      })
      return
    }
    if (enquirycollection.phoneno === "" || enquirycollection.phoneno.length !== 10) {
      Swal.fire({
        text: "Please Enter Valid  Phone Number",
        icon: "warning"
      })
      return
    }
    if (enquirycollection.phoneno.length > 10) {
      Swal.fire({
        text: "Please Enter Your Phone No 10 Digit only",
        icon: "warning"
      })
      return
    }
    if (enquirycollection.remarks === "") {
      Swal.fire({
        text: "Please Give Your Remarks",
        icon: "warning"
      })
      return
    }
    const isNameExists = validation.some((item) => {
      return item.employeename === enquirycollection.username;
    });

    if (isNameExists) {
      Swal.fire({
        title: "This Employee Name Already Presented Give Unique Name !",
        icon: "warning",
        text: 'Tip :If you Want Save Same Name Give initials',
        customClass: {
          title: 'titileforemployeename',
        }
      })
      return
    }


    Swal.fire({
      title: 'Are you sure you Save this data !',
      showDenyButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: 'No',
      position: 'center',
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
            const alldatas = {
              ...enquirycollection, username: enquirycollection.username.trim(), email: enquirycollection.email.trim(),
              remarks: enquirycollection.remarks.trim(), createdby: createdBy
            }
            console.log(alldatas);
            axios.post(`${apiUrl}/enquiry_insert`, alldatas)
              .then((res) => {
                setenquirycollection({ ...enquirycollection, email: "", phoneno: "", username: "", remarks: "" })
                console.log(res);
                setloader(false);
                const functionThatReturnPromise = () =>
                  new Promise((resolve) => setTimeout(resolve, 500));
                toast.promise(
                  functionThatReturnPromise,
                  {
                    pending: 'Inserting Your Data',
                    error: 'Login failed',
                    success: "Your data Save Successfully"
                  }
                )
              })
              .then(() => {
                enquiryfetchdata()
              })
              .catch((err) => {
                console.log(err);
                setloader(false);
              })
          }
          catch (err) {
            alert(err)
            setloader(false);
          }
        }, 1500)
      }
      else {
        setloader(false);
      }

    })


  }

  const enquiryfetchdata = () => {
    axios.get(`${apiUrl}/enquiry-datas`)
      .then((res) => {
        console.log(res.data);
        settabledatas(res.data || [])
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const searchedit = (id) => {
    axios.get(`${apiUrl}/editenquiry_data/` + id)
      .then(res => {
        const { CustomerName, Emailid, MobileNo, Remarks } = res.data[0];
        setUpdateenquirydata({ username: CustomerName, email: Emailid, phoneno: MobileNo, remarks: Remarks });
      })
  }

  const [show, popup] = useState(false)

  const handelupdateid = (id) => {
    setupdateid(id)
    searchedit(id);
    popup(true)
  }

  const modalClose = () => popup(false)


  const handelupdate = (e) => {
    e.preventDefault();
    if (Updateenquirydata.username === '') {
      Swal.fire({
        text: "Please Enter Customer Name!",
        icon: "warning"
      });
      return;
    }
    if (Updateenquirydata.email === '') {
      Swal.fire({
        text: "Please Enter Email Address!",
        icon: "warning"
      });
      return;
    }
    if (Updateenquirydata.phoneno === '') {
      Swal.fire({
        text: "Please Enter Phone No!",
        icon: "warning"
      });
      return;
    }
    if (Updateenquirydata.remarks === '') {
      Swal.fire({
        text: "Please Enter Your Remarks!",
        icon: "warning"
      });
      return;
    }
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
            const alldata = { ...Updateenquirydata, createdBy: createdBy }
            axios.put(`${apiUrl}/updateenquirydata/${updateid}`, alldata)
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
                enquiryfetchdata();
                popup(false)
              })
              .catch((err) => console.log(err))
          }
          catch (err) {
            console.log(err);
            // setloader(false)
          }

        }, 1500)

      }
      else {
        // setloader(false)
      }
    })
  }
  return (
    <div>
      <div className="enquiry-container d-flex  align-items-center justify-content-center position-relative ">
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
        <form action="post" className='bg-transparent border rounded  p-3 col-20 col-lg-8 col-xl-7 row' onSubmit={handlesubmit} style={{ opacity: loader ? "0.1" : "1" }}>
          <div className="head text-center ">
            <h1 className='text-2xl '>Enquiry Form</h1>
            <hr className='mb-2' />
          </div>
          <div className="input-name col-12 col-md-6 col-lg-6 col-xl-6 mb-1" >
            <label htmlFor="name" className=' form-label '>Your Name</label>
            <input type="text" className=' form-control' value={enquirycollection.username} placeholder='Enter Name'
              onChange={(e) => {
                const inputvalue = e.target.value.toUpperCase()
                setenquirycollection({ ...enquirycollection, username: inputvalue })
              }} />
          </div>
          <div className="input-email col-12 col-md-6 col-lg-6 col-xl-6 mb-2">
            <label htmlFor="name" className=' form-label '>Email Address</label>
            <input type="email" className=' form-control' value={enquirycollection.email} placeholder='Enter Email Address'
              onChange={(e) => setenquirycollection({ ...enquirycollection, email: e.target.value })} />
          </div>

          <div className="input-phone-no col-12 col-md-6 col-lg-6 col-xl-6 mt-3 position-relative ">
            <label htmlFor="name" className='form-label'>Phone Number</label>
            <input type="tel" className='form-control' maxLength={10} placeholder='Enter Phone No' value={enquirycollection.phoneno}
              onChange={(e) => {
                const inputValue = e.target.value.replace(/\D/g, '');
                if (inputValue.length <= 10) {
                  setenquirycollection({ ...enquirycollection, phoneno: inputValue });
                }
              }} />

            <div className="submit-btn col-12 col-md-6 col-lg-11  d-none d-md-flex  d-lg-flex d-xl-flex  d-xxl-flex  position-absolute top-2/3">
              <button className='btn btn-outline-dark col-12' type='submit'>Submit</button>
            </div>
          </div>
          <div className="input-name col-12 col-md-6 col-lg-6 col-xl-6 mt-3">
            <label htmlFor="name" className=' form-label '>Remarks</label>
            <textarea name="" id="addresss" cols="50" rows="5" className=' form-control' placeholder='Enter Valid Remarks' value={enquirycollection.remarks}
              onChange={(e) => setenquirycollection({ ...enquirycollection, remarks: e.target.value })}></textarea>
          </div>
          <div className="submit-btn col-12 col-md-6 col-lg-6 col-xl-6 d-md-none d-lg-none d-xl-none d-xxl-none mt-3">
            <button className='btn btn-outline-dark col-12' type='submit'>Submit</button>
          </div>

        </form>
      </div>

      <div className="table-company-datas mt-32 mt-lg-0 mt-xl-0 mt-md-0">
        <div className="overflow-auto rounded-lg shadow hidden d-flex ">

          <table className="w-full table-hover overflow-auto">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="w-10 p-3 text-sm font-semibold tracking-wide text-left">So.No</th>
                <th className="w-15 p-3 text-sm font-semibold tracking-wide text-center">Name</th>
                <th className="w-15 p-3 text-sm font-semibold tracking-wide text-left">Email</th>
                <th className="w-15 p-3 text-sm font-semibold tracking-wide text-left">Phone No</th>
                <th className="w-25 p-3 text-sm font-semibold tracking-wide text-left break-all">Remarks</th>
                <th className="w-15 p-3 text-sm font-semibold tracking-wide text-left">Update</th>
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
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap" key={index}>
                    {datas.Emailid}
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap" key={index}>
                    {datas.MobileNo}
                  </td>
                  <td className="p-3 text-sm text-gray-700 break-all text-wrap" key={index}>
                    {datas.Remarks}

                  </td>
                  <td className="p-3 whitespace-nowrap btn-primary ">
                    <button className='btn btn-primary' onClick={() => handelupdateid(datas.Enquiryid)}>Update</button></td>
                  {/* <td className="p-3 whitespace-nowrap btn-danger "><button className='btn btn-danger' onClick={() => handledelete(datas.Enquiryid)}>Delete</button></td> */}
                </tr>
              })}
            </tbody>
          </table>
        </div>
      </div>



      {/* Update Modal */}

      <Modal show={show} animation={true} onHide={modalClose}>
        <Modal.Header>
          <h1 className="modal-title fs-5" id="staticBackdropLabel">Update Enquiry Data</h1>
          <button type="button" className="btn icon-link-hover" onClick={modalClose}><IoIosClose style={{ fontSize: "30px" }} /></button>
        </Modal.Header>
        <Modal.Body>
          <form action="" className='row company-update-modal' onSubmit={handelupdate}>

            <div className="input-name col-12 col-md-6 col-lg-6 col-xl-6 mb-1" >
              <label htmlFor="name" className=' form-label '>Customer Name</label>
              <input type="text" className='form-control' value={Updateenquirydata.username}
                onChange={(e) => setUpdateenquirydata({ ...Updateenquirydata, username: e.target.value.toUpperCase() })} />
            </div>

            <div className="input-email col-12 col-md-6 col-lg-6 col-xl-6 mb-2">
              <label htmlFor="name" className=' form-label '>Email Address</label>
              <input type="email" className=' form-control' value={Updateenquirydata.email}
                onChange={(e) => setUpdateenquirydata({ ...Updateenquirydata, email: e.target.value })} />
            </div>

            <div className="input-phone-no col-12 col-md-6 col-lg-6 col-xl-6 mb-2 mt-3">
              <label htmlFor="name" className='form-label'>Phone Number</label>
              <input type="phone" className='form-control' value={Updateenquirydata.phoneno}
                onChange={(e) => {
                  const inputValue = e.target.value.replace(/\D/g, '');
                  if (inputValue.length <= 10) {
                    setUpdateenquirydata({ ...Updateenquirydata, phoneno: inputValue })
                  }
                }
                } />
            </div>

            <div className="input-name col-12 col-md-6 col-lg-6 col-xl-6">
              <label htmlFor="name" className=' form-label '>Remarks</label>
              <textarea name="" id="addresss" cols="50" rows="3" className=' form-control ' value={Updateenquirydata.remarks}
                onChange={(e) => setUpdateenquirydata({ ...Updateenquirydata, remarks: e.target.value })}></textarea>
            </div>
            <div className="btn-update d-flex justify-content-lg-end gap-6 mt-3">
              <button type="submit" className="btn btn-outline-success">Update</button>
            </div>
          </form>
        </Modal.Body>
      </Modal>











      {/* Pagination component */}
      <Pagination className="mt-3 justify-content-end text-black">
        {[...Array(Math.ceil(tabledatas.length / itemsPerPage))].map((_, page) => (
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

export default Enquiry