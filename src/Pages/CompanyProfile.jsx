import axios from 'axios';
import React, { useState } from 'react'
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import { IoIosClose } from "react-icons/io";

function CompanyProfile() {

  const apiUrl = process.env.REACT_APP_API_BASE_URL

  console.log(apiUrl);

  const [loader, setloader] = useState(false)

  const [insertdata, setinsertdata] = useState({
    Companyname: "",
    Address1: "",
    Address: "",
    Pincode: "",
    State: "",
    District: "",
    CompanyPhoto: "",
  })

  const [updatedata, setupdatedata] = useState({
    Companyname: "",
    Address1: "",
    Address: "",
    Pincode: "",
    State: "",
    District: "",
    CompanyPhoto: "",
  })

  const [updateid, setupdateid] = useState("")

  const [tabledata, settabledata] = useState([])


  const tabledatas = () => {
    axios.get(`${apiUrl}/companyprofile`)
      .then((res) => {
        console.log(res.data)
        settabledata(res.data)
      })
      .catch((err) => {
        console.log(err);
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
            setinsertdata({ ...insertdata, CompanyPhoto: base64String });
            setupdatedata({ ...updatedata, CompanyPhoto: base64String })
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

  const [useridforcratedby, setuseridforcratedby] = useState({})

  useEffect(() => {

    tabledatas()  // table data retrive from database
    const storedUserData = JSON.parse(localStorage.getItem('userData'));
    if (storedUserData && storedUserData.userid) {
      setuseridforcratedby(storedUserData)
    }
    else {
      setuseridforcratedby({ message: "empty" })
    }
  }, [])
  const createdBy = useridforcratedby.userid || useridforcratedby.message;

  const handleInsertdata = (e) => {
    e.preventDefault()
    if (insertdata.Companyname === "") {
      Swal.fire({
        text: "Please Enter Company Name!",
        icon: "warning"
      })
      return
    }
    if (insertdata.Address1 === "") {
      Swal.fire({
        text: "Please Enter Valid Address 1 !",
        icon: "warning"
      })
      return
    }
    if (insertdata.Address === "") {
      Swal.fire({
        text: "Please Enter Valid Address !",
        icon: "warning"
      })
      return
    }
    if (insertdata.Pincode === "") {
      Swal.fire({
        text: "Please Enter Valid Pincode !",
        icon: "warning"
      })
      return
    }
    if (insertdata.State === "") {
      Swal.fire({
        text: "Please Enter Valid State !",
        icon: "warning"
      })
      return
    }
    if (insertdata.District === "") {
      Swal.fire({
        text: "Please Enter Valid District !",
        icon: "warning"
      })
      return
    }
    if (insertdata.CompanyPhoto === "") {
      Swal.fire({
        text: "Please Enter Valid CompanyPhoto (or) Logo !",
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
              ...insertdata, Companyname: insertdata.Companyname.trim(), Address1: insertdata.Address1.trim(),
              Address: insertdata.Address.trim(), Pincode: insertdata.Pincode.trim(), State: insertdata.State.trim(),
              District: insertdata.District.trim(),
              createdBy: createdBy
            }
            axios.post(`${apiUrl}/CompanyProfile_post`, alldatas)
              .then((res) => {
                setinsertdata({
                  ...insertdata,
                  Address: "",
                  Address1: "",
                  Companyname: "",
                  CompanyPhoto: "",
                  District: "",
                  State: "",
                  Pincode: ""
                })
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
                tabledatas()
                setloader(false);
                console.log(res);
              })
              .catch((err) => {
                console.log(err);
                setloader(false);
              })

          }
          catch (err) {
            console.log(err);
            setloader(false);
          }


        }, 1500)

      }
      else {
        setloader(false);
      }
    })

  }

  const searchedit = (id) => {
    axios.get(`${apiUrl}/editcompanyprofile_data/` + id)
      .then(res => {
        const { Companyname, Address1, Address, Pincode, State, District } = res.data[0];
        setupdatedata({ Companyname: Companyname, Address1: Address1, Address: Address, Pincode: Pincode, State: State, District: District });
      })
  }


  const [show, popup] = useState(false)

  const handelupdateid = (id) => { // update id
    setupdateid(id)
    searchedit(id);
    popup(true)
  }

  const modalClose = () => popup(false)

  const handledelete = (Compinfoid) => {       // delete

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
            axios.delete(`${apiUrl}/delete_companyprofile`, { data: { id: Compinfoid } })
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
                tabledatas()
              })
              .catch((err) => console.log(err));
          }
          catch (err) {
            console.log(err);
            setloader(false)
          }


        }, 1500);

      } else {
        setloader(false)
      }
    })

  }

  const hanldeupdate = (e) => {
    e.preventDefault();
    if (updatedata.Companyname === "") {
      Swal.fire({
        text: "Please Enter Company Name!",
        icon: "warning"
      })
      return
    }
    if (updatedata.Address1 === "") {
      Swal.fire({
        text: "Please Enter Valid Address 1 !",
        icon: "warning"
      })
      return
    }
    if (updatedata.Address === "") {
      Swal.fire({
        text: "Please Enter Valid Address !",
        icon: "warning"
      })
      return
    }
    if (updatedata.Pincode === "") {
      Swal.fire({
        text: "Please Enter Valid Pincode !",
        icon: "warning"
      })
      return
    }
    if (updatedata.State === "") {
      Swal.fire({
        text: "Please Enter Valid State !",
        icon: "warning"
      })
      return
    }
    if (updatedata.District === "") {
      Swal.fire({
        text: "Please Enter Valid District !",
        icon: "warning"
      })
      return
    }
    if (updatedata.CompanyPhoto === "") {
      Swal.fire({
        text: "Please Enter Valid CompanyPhoto (or) Logo !",
        icon: "warning"
      })
      return
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
            const alldata = {
              ...updatedata, Companyname: updatedata.Companyname.trim(), Address1: updatedata.Address1.trim(),
              Address: updatedata.Address.trim(), Pincode: updatedata.Pincode.trim(), State: updatedata.State.trim(),
              District: updatedata.District.trim(), createdBy: createdBy
            }
            axios.put(`${apiUrl}/updatecompanyprofile/${updateid}`, alldata)
              .then((res) => {
                popup(false)
                console.log(res);
                setloader(false);
                tabledatas()
                const functionThatReturnPromise = () =>
                new Promise((resolve) => setTimeout(resolve, 500));
              toast.promise(
                functionThatReturnPromise,
                {
                  pending: 'Updating Your Company Profile',
                  error: 'Login failed',
                  success: "Your Data Updated Successfully"
                }
              )
              })
              .catch((err) => {
                console.log(err)
                setloader(false);
              })

          }
          catch (err) {
            setloader(false);
          }
        }, 1500);
      } else {
        setloader(false);
      }
    })
  }

  return (
    <div>

      <div className="branchmaster-head">
        <div className="branch-form d-flex align-items-center justify-content-center p-5 position-relative ">
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
          <form action="" className='forms border rounded  p-3 col-20 col-lg-8 col-xl-7 row' style={{ opacity: loader ? "0.1" : "1" }} tab-tabIndex={true}>
            <h3 className=' text-3xl text-center'>Profile Registration</h3>
            <hr className='mb-3 mt-1' />
            <div className="company-id col-12 col-md-6 col-lg-6 col-xl-6 mb-3">
              <label htmlFor="typeofpack" className='form-label'>Enter Companyname</label>
              <input type='text' className='form-control' placeholder='e.g. Google' value={insertdata.Companyname} onChange={(e) => setinsertdata({ ...insertdata, Companyname: e.target.value })} />
            </div>
            <div className="select-duration col-12 col-md-6 col-lg-6 col-xl-6 mb-3">
              <label htmlFor="typeofpack" className='form-label'>Address1</label>
              <input type='text' className='form-control' placeholder='e.g. Anna Nagar(63)' value={insertdata.Address1} onChange={(e) => setinsertdata({ ...insertdata, Address1: e.target.value })} />
            </div>
            <div className="amount col-12 col-md-6 col-lg-6 col-xl-6 mb-2">
              <label htmlFor="amount" className='form-label'>Address</label>
              <input type='text' className='form-control' placeholder='e.g. Complete Address' value={insertdata.Address} onChange={(e) => setinsertdata({ ...insertdata, Address: e.target.value })} />
            </div>
            <div className="type-of-gst col-12 col-md-6 col-lg-6 col-xl-6 mb-2">
              <label htmlFor="gst" className='form-label'>Pincode</label>
              <input type="tel" maxLength={6} className='form-control' placeholder='e.g. 608010' value={insertdata.Pincode} onChange={(e) => setinsertdata({ ...insertdata, Pincode: e.target.value })} />
            </div>
            <div className="type-of-gst col-12 col-md-6 col-lg-6 col-xl-6 mb-2">
              <label htmlFor="gst" className='form-label'>State</label>
              <input type="text" className='form-control' placeholder='e.g. Tamil Nadu' value={insertdata.State} onChange={(e) => setinsertdata({ ...insertdata, State: e.target.value })} />
            </div>
            <div className="type-of-gst col-12 col-md-6 col-lg-6 col-xl-6 mb-2">
              <label htmlFor="gst" className='form-label'>District</label>
              <input type="text" className='form-control'placeholder='e.g. Erode' value={insertdata.District} onChange={(e) => setinsertdata({ ...insertdata, District: e.target.value })} />
            </div>
            <div className="type-of-gst col-12 col-md-6 col-lg-6 col-xl-6 mb-2">
              <label htmlFor="gst" className='form-label'>CompanyPhoto</label>
              <input type="file" className='form-control' onChange={handleImageChange} />
            </div>
            <div className="submit-btn col-12 col-md-6 col-lg-6 col-xl-6 mt-4 pt-2">
              <button className='btn btn-success bg-success col-12 ' type='submit' onClick={handleInsertdata}>Register</button>
            </div>
          </form>
        </div>




        <div className="table-company-datas mt-32 mt-lg-0 mt-xl-0 mt-md-0">
          <div className="overflow-auto rounded-lg shadow hidden d-flex ">

            <table className="w-full table-hover overflow-auto">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="w-10 p-3 text-sm font-semibold tracking-wide text-left">So.No</th>
                  <th className="w-15 p-3 text-sm font-semibold tracking-wide text-center">Company Name</th>
                  <th className="w-15 p-3 text-sm font-semibold tracking-wide text-left break-all">Address 1</th>
                  <th className="w-15 p-3 text-sm font-semibold tracking-wide text-left break-all">Address</th>
                  <th className="w-15 p-3 text-sm font-semibold tracking-wide text-left">Pincode</th>
                  <th className="w-15 p-3 text-sm font-semibold tracking-wide text-left">State</th>
                  <th className="w-15 p-3 text-sm font-semibold tracking-wide text-left">District</th>
                  <th className="w-15 p-3 text-sm font-semibold tracking-wide text-left">CompanyPhoto</th>
                  <th className="w-15 p-3 text-sm font-semibold tracking-wide text-left">Update</th>
                  <th className="w-15 p-3 text-sm font-semibold tracking-wide text-left">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tabledata.map((datas, index) => {
                  return <tr className="bg-white">
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      <p className="font-bold text-blue-500 hover:underline" key={index}>{datas.Sno}</p>
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap text-center" key={index}>
                      {datas.Companyname}
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap" key={index}>
                      {datas.Address1}
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap" key={index}>
                      {datas.Address}
                    </td>
                    <td className="p-3 text-sm text-gray-700 break-all text-wrap" key={index}>
                      {datas.Pincode}
                    </td>
                    <td className="p-3 text-sm text-gray-700 break-all text-wrap" key={index}>
                      {datas.State}
                    </td>
                    <td className="p-3 text-sm text-gray-700 break-all text-wrap" key={index}>
                      {datas.District}
                    </td>
                    <td className="p-3 text-sm text-gray-700 break-all text-wrap" key={index}>
                      <img
                        src={`data:image/png;base64,${datas.CompanyPhoto}`}
                        alt=""
                        height={100}
                        width={100}
                        className="border rounded-5 "
                      />
                    </td>


                    <td className="p-3 whitespace-nowrap btn-primary ">
                      <button className='btn btn-primary' onClick={() => handelupdateid(datas.Compinfoid)}>Update</button></td>
                    <td className="p-3 whitespace-nowrap btn-danger "><button className='btn btn-danger' onClick={() => handledelete(datas.Compinfoid)}>Delete</button></td>
                  </tr>
                })}
              </tbody>
            </table>
          </div>
        </div>


      </div>




      {/* Update Modal */}

      <Modal show={show} animation={true} onHide={modalClose}>
        <Modal.Header>
          <h1 className="modal-title fs-5" id="staticBackdropLabel">Company Profile Update</h1>
          <button type="button" className="btn icon-link-hover " onClick={modalClose}>
            <IoIosClose style={{ fontSize: "30px" }} /></button>
        </Modal.Header>
        <Modal.Body>
          <form action="" className='row company-update-modal' onSubmit={hanldeupdate}>

            <div className="input-name col-12 col-md-6 col-lg-6 col-xl-6 mb-1" >
              <label htmlFor="name" className=' form-label '>Company Name</label>
              <input type="text" className='form-control' value={updatedata.Companyname} onChange={(e) => setupdatedata({ ...updatedata, Companyname: e.target.value })} />
            </div>

            <div className="input-email col-12 col-md-6 col-lg-6 col-xl-6 mb-2">
              <label htmlFor="name" className=' form-label '>Address 1</label>
              <input type="text" className=' form-control' value={updatedata.Address1} onChange={(e) => setupdatedata({ ...updatedata, Address1: e.target.value })} />
            </div>

            <div className="input-phone-no col-12 col-md-6 col-lg-6 col-xl-6 mb-2 mt-3">
              <label htmlFor="name" className='form-label'>Address</label>
              <input type="phone" className='form-control' value={updatedata.Address} onChange={(e) => setupdatedata({ ...updatedata, Address: e.target.value })} />
            </div>


            <div className="input-phone-no col-12 col-md-6 col-lg-6 col-xl-6 mb-2 mt-3">
              <label htmlFor="name" className='form-label'>Pincode</label>
              <input type="phone" className='form-control' value={updatedata.Pincode} onChange={(e) => setupdatedata({ ...updatedata, Pincode: e.target.value })} />
            </div>

            <div className="input-phone-no col-12 col-md-6 col-lg-6 col-xl-6 mb-2 mt-3">
              <label htmlFor="name" className='form-label'>State</label>
              <input type="phone" className='form-control' value={updatedata.State} onChange={(e) => setupdatedata({ ...updatedata, State: e.target.value })} />
            </div>

            <div className="input-phone-no col-12 col-md-6 col-lg-6 col-xl-6 mb-2 mt-3">
              <label htmlFor="name" className='form-label'>District</label>
              <input type="phone" className='form-control' value={updatedata.District} onChange={(e) => setupdatedata({ ...updatedata, District: e.target.value })} />
            </div>

            <div className="input-phone-no col-12 col-md-6 col-lg-6 col-xl-6 mb-2 mt-3">
              <label htmlFor="name" className='form-label'>CompanyPhoto</label>
              <input type="file" className='form-control' onChange={handleImageChange} />
            </div>

            <div className="btn-update d-flex justify-content-lg-end gap-6 mt-3">
              <button type="submit" className="btn btn-outline-success">Update</button>
            </div>
          </form>
        </Modal.Body>
      </Modal>














      <ToastContainer />
    </div>
  )
}

export default CompanyProfile
