import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { ToastContainer, toast } from 'react-toastify';
import { Pagination } from 'react-bootstrap';
import { IoIosClose } from "react-icons/io";
import { Modal } from 'react-bootstrap';

function TypeofPack() {

  const apiUrl = process.env.REACT_APP_API_BASE_URL

  console.log(apiUrl);

  const [useridforcratedby, setuseridforcratedby] = useState({})

  useEffect(() => {
    tabledatas()
    const storedUserData = JSON.parse(localStorage.getItem('userData'));
    if (storedUserData && storedUserData.userid) {
      setuseridforcratedby(storedUserData)
    }
    else {
      setuseridforcratedby({ message: "empty" })
    }
  }, [])

  const createdBy = useridforcratedby.userid || useridforcratedby.message;

  const [loader, setloader] = useState(false)

  const [insertdata, setinsertdata] = useState({
    count: '',
    duration: '',
    amount: '',
    gst: ''
  })

  const [updatedata, setupdatedata] = useState({
    count: '',
    amount: '',
    gst: ''
  })
  const [updateid, setupdateid] = useState("")

  const [tabledata, settabledata] = useState([])



  const tabledatas = () => {
    axios.get(`${apiUrl}/select-typeofpack`)
      .then((res) => {
        console.log(res.data);
        settabledata(res.data || [])
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentActiveData = tabledata.slice(indexOfFirstItem, indexOfLastItem);


  const searchedit = (id) => {
    axios.get(`${apiUrl}/edittypeofpack_data/` + id)
      .then(res => {
        const { TypeofPack, Amount, Gst } = res.data[0];
        setupdatedata({ count: TypeofPack, amount: Amount, gst: Gst });

      })
  }

  const handlesubmit = (e) => {
    e.preventDefault()
    if (insertdata.count === "") {
      Swal.fire({
        text: "Please Enter Type Of Pack",
        icon: "warning",
        customClass: "sweet-alert-text"
      })
      return
    }
    if (insertdata.duration === "") {

      Swal.fire({
        text: "Please Select Duration",
        icon: "warning",
        customClass: "sweet-alert-text"
      })
      return
    }

    if (insertdata.amount === "") {
      Swal.fire({
        text: "Please Enter Valid Amount Based On Pack",
        icon: "warning",
        customClass: "sweet-alert-text"
      })
      return
    }

    if (insertdata.gst === "") {
      Swal.fire({
        text: "Please Enter Valid Gst Based On Amount",
        icon: "warning",
        customClass: "sweet-alert-text"
      })
      return
    }

    Swal.fire({
      title: 'Are you sure you Save this data!',
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
            const value = insertdata.count + insertdata.duration;

            const alldata = { ...insertdata, value, createdBy: createdBy }

            console.log(alldata);

            axios.post(`${apiUrl}/typeofpack_insert`, alldata)
              .then((res) => {
                console.log(res.data);
                setinsertdata({ ...insertdata, amount: " ", count: " ", gst: " ", duration: " " })
                setloader(false);
                tabledatas()
                const functionThatReturnPromise = () =>
                  new Promise((resolve) => setTimeout(resolve, 1000));
                toast.promise(
                  functionThatReturnPromise,
                  {
                    pending: 'Inserting Your Data',
                    error: 'Login failed',
                    success: "Your data Save Successfully"
                  }
                )
              })
              .catch((err) => {
                console.log(err)
                setloader(false);
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

  const [show, popup] = useState(false)

  const handelupdateid = (id) => {
    setupdateid(id)
    searchedit(id);
    popup(true)
  }
  const modalClose = () => popup(false)

  const handelupdate = (e) => {
    e.preventDefault()
    if (updatedata.count === '') {
      Swal.fire({
        text: "Please Enter Type Of Pack!",
        icon: "warning",
        customClass: "sweet-alert-text"
      });
      return;
    }
    if (updatedata.amount === '') {
      Swal.fire({
        text: "Please Enter Valid Amount!",
        icon: "warning",
        customClass: "sweet-alert-text"
      });
      return;
    }
    if (updatedata.gst === '') {
      Swal.fire({
        text: "Please Enter Valid Gst Based On Amount!",
        icon: "warning",
        customClass: "sweet-alert-text"
      });
      return;
    }
    Swal.fire({
      title: 'Are you sure you Save this data!',
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
            const alldata = { ...updatedata, createdBy: createdBy }
            axios.put(`${apiUrl}/typeofpack_update/${updateid}`, alldata)
              .then((res) => {
                popup(false)
                console.log(res)
                tabledatas()
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


          }
          catch (err) {
            console.log(err)
          }

        }, 1500);


      }
      else {
        setloader(false);
      }
    })

  }

  const handledelete = (packid) => {
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
            axios.delete(`${apiUrl}/delete_packmaster`, { data: { id: packid } })
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
          }


        }, 1500);

      } else {
        setloader(false)
      }


    })
  }
  const handleKeyDown = (e) => {
    if (
      !/^\d$/.test(e.key) &&
      e.key !== 'Backspace' &&
      e.key !== 'ArrowLeft' &&
      e.key !== 'ArrowRight' &&
      e.key !== 'Delete' &&
      e.key !== 'Tab'
    ) {
      e.preventDefault();
    }

    if (e.key === 'Tab') {
      const nextInput = e.target.parentElement.nextElementSibling.querySelector('input');
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

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
          <form action="" className='forms border rounded  p-3 col-20 col-lg-8 col-xl-7 row' onSubmit={handlesubmit} style={{ opacity: loader ? "0.1" : "1" }} tab-tabIndex={true}>
            <h3 className=' text-3xl text-center'>Type Of Plan Registration</h3>
            <hr className='mb-3 mt-1' />
            <div className="company-id col-12 col-md-6 col-lg-6 col-xl-6 mb-3">
              <label htmlFor="typeofpack" className='form-label'>Enter Type Of Count</label>
              <input type="text" className="type-of-no form-control" placeholder='Enter Type Of Count' maxLength={6} onKeyDown={handleKeyDown} value={insertdata.count}
                onChange={(e) => setinsertdata({ ...insertdata, count: e.target.value })}
              />
            </div>
            <div className="select-duration col-12 col-md-6 col-lg-6 col-xl-6 mb-3">
              <label htmlFor="typeofpack" className='form-label'>Select Mode For Duration</label>
              <select name="select-duration" id="" className='form-select' value={insertdata.duration} onChange={(e) => setinsertdata({ ...insertdata, duration: e.target.value })}>
                <option value="">Select Duration</option>
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
            </div>
            <div className="amount col-12 col-md-6 col-lg-6 col-xl-6 mb-2">
              <label htmlFor="amount" className='form-label'>Enter Amount</label>
              <input type='text' placeholder='Enter Valid Amount' maxLength={6} onKeyDown={handleKeyDown} value={insertdata.amount}
                className='form-control' onChange={(e) => setinsertdata({ ...insertdata, amount: e.target.value })} />
            </div>
            <div className="type-of-gst  col-12 col-md-6 col-lg-6 col-xl-6 mb-2">
              <label htmlFor="gst" className='form-label'>Gst</label>
              <div className="input-group">
                <input type="text" placeholder='Enter Valid Gst' maxLength={2} className='form-control' aria-describedby="basic-addon1" value={insertdata.gst}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setinsertdata({ ...insertdata, gst: e.target.value })} />
                <span className="input-group-text" id="basic-addon1">%</span>
              </div>
            </div>
            <div className="submit-btn mt-4 text-center">
              <button className='btn btn-success col-6'>Submit</button>
            </div>
          </form>
        </div>

        <div className="table-company-datas mt-32 mt-lg-0 mt-xl-0 mt-md-0">
          <div className="overflow-auto rounded-lg shadow hidden d-flex ">

            <table className="w-full table-hover">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="w-10 p-3 text-sm font-semibold tracking-wide text-left">Sno</th>
                  <th className="w-25 p-3 text-sm font-semibold tracking-wide text-center">Plan</th>
                  <th className="w-25 p-3 text-sm font-semibold tracking-wide text-left">Amount</th>
                  <th className="w-25 p-3 text-sm font-semibold tracking-wide text-left">Gst</th>
                  <th className="w-10 p-3 text-sm font-semibold tracking-wide text-left">Update</th>
                  <th className="w-10 p-3 text-sm font-semibold tracking-wide text-left">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentActiveData.map((datas, index) => {
                  return <tr className="bg-white">
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      <p className="font-bold text-blue-500 hover:underline" key={index}>{datas.Sno}</p>
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap text-center" key={index}>
                      {datas.TypeofPack}
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {datas.Amount + "  " + "₹"}
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {datas.Gst + "%"}
                    </td>
                    <td className="p-3 whitespace-nowrap btn-primary ">
                      <button className='btn btn-primary' onClick={() => handelupdateid(datas.packid)}>Update</button></td>
                    <td className="p-3 whitespace-nowrap btn-primary ">
                      <button className='btn btn-danger' onClick={() => handledelete(datas.packid)}>Delete</button></td>
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
          <h1 className="modal-title fs-5" id="staticBackdropLabel">Update Plan Data</h1>
          <button type="button" className="btn icon-link-hover " onClick={modalClose}>
            <IoIosClose style={{ fontSize: "30px" }} /></button>
        </Modal.Header>
        <Modal.Body>
          <form action="" className='row company-update-modal' onSubmit={handelupdate}>
            <div className="company-id col-12 col-md-6 col-lg-6 col-xl-6 mb-3">
              <label htmlFor="typeofpack" className='form-label'>Enter Type Of Pack</label>
              <input type="text" className="type-of-no form-control" maxLength={15}
                value={updatedata.count}
                onChange={(e) => setupdatedata({ ...updatedata, count: e.target.value })}
              />
            </div>
            <div className="amount col-12 col-md-6 col-lg-6 col-xl-6 mb-2">
              <label htmlFor="amount" className='form-label'>Enter Amount</label>
              <input type='text' maxLength={6} onKeyDown={handleKeyDown} value={updatedata.amount}
                className='form-control' onChange={(e) => setupdatedata({ ...updatedata, amount: e.target.value })} />
            </div>
            <div className="type-of-gst  col-12 col-md-6 col-lg-6 col-xl-6 mb-2">
              <label htmlFor="gst" className='form-label'>Gst</label>
              <div className="input-group">
                <input type="text" maxLength={2} className='form-control' aria-describedby="basic-addon1" onKeyDown={handleKeyDown}
                  value={updatedata.gst}
                  onChange={(e) => setupdatedata({ ...updatedata, gst: e.target.value })} />
                <span className="input-group-text" id="basic-addon1">%</span>
              </div>
            </div>
            <div className="btn-update d-flex justify-content-lg-end gap-6 mt-3">
              <button type="submit" className="btn btn-outline-success">Update</button>
            </div>
          </form>
        </Modal.Body>
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

export default TypeofPack
