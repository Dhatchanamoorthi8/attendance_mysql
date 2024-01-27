import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Pagination } from 'react-bootstrap';
import { IoIosClose } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2'
import { Modal } from 'react-bootstrap';

const DesignationMaster = () => {

  const apiUrl = process.env.REACT_APP_API_BASE_URL

  console.log(apiUrl);

  const [getdata, setgetdata] = useState([])

  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');


  const [tabledata, settabledata] = useState([])

  const [updateid, setupdateid] = useState("")


  const [validation, setvalidation] = useState([])

  const [InsertDatabsedata, setInsertDatabsedata] = useState({
    designationname: "",
    status: "",
  })
  const [UpdateDatabsedata, setUpdateDatabsedata] = useState({
    designationname: '',
    status: '',
    departmentid: ''
  })
  const [loader, setloader] = useState(false)
  const [useridforcratedby, setuseridforcratedby] = useState({})

  useEffect(() => {

    const storedUserData = JSON.parse(localStorage.getItem('userData'));
    if (storedUserData && storedUserData.userid) {
      setuseridforcratedby(storedUserData)
    }
    else {
      setuseridforcratedby({ message: "empty" })
    }

    axios.get(`${apiUrl}/drop-down-department`)
      .then((res) => {
        console.log(res.data)
        setgetdata(res.data || []);
      })
      .catch((err) => console.log(err))
    databasbetabledata()
  }, [])
  const createdBy = useridforcratedby.userid || useridforcratedby.message;

  const databasbetabledata = async () => {
    await axios.get(`${apiUrl}/getdesgination_data`)
      .then((res) => {
        console.log(res)
        settabledata(res.data || [])
        setvalidation(res.data || [])
      })
      .catch((err) => console.log(err))
  }

  const handlesubmit = (e) => {
    e.preventDefault();

    if (!(selectedDepartmentId && selectedDepartmentId.length > 0)) {
      Swal.fire({
        text: "Please select a Department Name!",
        icon: "warning"
      });
      return
    }
    if (InsertDatabsedata.designationname === '') {
      Swal.fire({
        text: "Please enter a Designation Name!",
        icon: "warning"
      });
      return;
    }

    if (InsertDatabsedata.status === '') {
      Swal.fire({
        text: "Please select a Status!",
        icon: "warning"
      });
      return;
    }
    const isValidationSuccess = validation.some((item) => {
      return (
        item.designationname === InsertDatabsedata.designationname
      );
    })
    if (isValidationSuccess) {
      Swal.fire({
        text: "This Designation Name is Already Exitsing",
        icon: "warning"
      });
      return;
    }
    Swal.fire({
      title: 'Are you sure to Save the data?',
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
            const alldata = { ...InsertDatabsedata,designationname:InsertDatabsedata.designationname.trim(),departmentid: selectedDepartmentId, createdBy: createdBy }
            axios.post(`${apiUrl}/Desgination_post`, alldata)
              .then((res) => {
                console.log(res)
                setloader(false);
                setInsertDatabsedata({ ...InsertDatabsedata, designationname: "", status: "" });
                setSelectedDepartmentId('');
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
                databasbetabledata()
              })
              .catch((err) => console.log(err))
          } catch (err) {
            console.log(err);
          }
        }, 1500);
      } else {
        setloader(false)
      }
    });
  };


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  // Pagination 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // active status table 
  const activeData = tabledata.filter((data) => data.status === 'Active');
  const InactiveData = tabledata.filter((data) => data.status === 'InActive');

  const currentActiveData = activeData.slice(indexOfFirstItem, indexOfLastItem);


  const handledelete = (designationid) => {

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
            axios.delete(`${apiUrl}/delete_designationmaster`, { data: { id: designationid } })
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
                databasbetabledata()
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


  const searchedit = (id) => {
    axios.get(`${apiUrl}/editdesignation_data/` + id)
      .then(res => {
        const { designationname, status, departmentid } = res.data[0];
        setUpdateDatabsedata({ designationname: designationname, status: status, departmentid: departmentid });
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
    if (UpdateDatabsedata.designationname === '') {
      Swal.fire({
        text: "Please enter a Designation Name!",
        icon: "warning"
      });
      return;
    }
    Swal.fire({
      title: 'Are you sure Update The Data?',
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
            const alldata = { ...UpdateDatabsedata,designationname:UpdateDatabsedata.designationname.trim(),createdBy: createdBy }
            axios.put(`${apiUrl}/updatedesginationdata/${updateid}`, alldata)
              .then((res) => {
                console.log(res);
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
                );
              })
              .then(() => {
                databasbetabledata()
                popup(false)
              })
              .catch((err) => {
                console.log(err);
                setloader(false);
              });
          } catch (err) {
            console.log(err);
            setloader(false);
          }
        }, 1500);
      } else {
        setloader(false);
      }
    });
  };

  return (
    <div>


      <div className="department-master">

        <div className="Department-form d-flex align-items-center justify-content-center p-5">
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
          <form action="" className='forms border rounded  p-3 col-20 col-lg-8 col-xl-7 row' onSubmit={handlesubmit} style={{ opacity: loader ? "0.1" : "1" }}>
            <h3 className=' text-3xl text-center'>Designation Registration</h3>
            <hr className='mb-3 mt-1' />
            <div className="company-id col-12 col-md-6 col-lg-6 col-xl-6">

              <label htmlFor="Branch" className='form-label'>Department Name</label>
              <select name="Branch" id="branch-select" className='form-select col-12 mb-3' onChange={(e) => setSelectedDepartmentId(e.target.value)}
                value={selectedDepartmentId}>
                <option value="">Select Department</option>
                {getdata && getdata.filter(data => data.status === "Active").map((data) => (
                  <option key={data.departmentid} value={data.departmentid}>
                    {data.departmentname}
                  </option>
                ))}
              </select>
            </div>
            <div className="branch-name col-12 col-md-6 col-lg-6 col-xl-6">
              <label htmlFor="branch-name" className='form-label'>Designation Name</label>
              <input
                type="text"
                className='form-control mb-3'
                value={InsertDatabsedata.designationname}
                placeholder='Enter Designation Name'
                onChange={(e) => {
                  const designationname = e.target.value.toUpperCase()
                  setInsertDatabsedata({ ...InsertDatabsedata, designationname: designationname });
                }} />

            </div>
            <div className="status col-12 col-md-6 col-lg-6 col-xl-6">
              <label htmlFor="status" className='form-label'>Status</label> <br />
              <div className="select-status d-flex gap-6 mt-1 ms-2">
                <div className="form-check">
                  <label htmlFor="Active">Active</label>
                  <input type="radio" className='form-check-input'
                    name='status'
                    value={'Active'}
                    checked={InsertDatabsedata.status === 'Active'}
                    onChange={(e) => setInsertDatabsedata({ ...InsertDatabsedata, status: e.target.value })} />
                </div>
                <div className="form-check">
                  <label htmlFor="Active">InActive</label>
                  <input type="radio" className='form-check-input'
                    name='status'
                    value={'InActive'}
                    checked={InsertDatabsedata.status === 'InActive'}
                    onChange={(e) => setInsertDatabsedata({ ...InsertDatabsedata, status: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="statu col-12 col-md-6 col-lg-6 col-xl-6 mt-6">
              <button className='btn btn-success col-12'>Submit</button>
            </div>

          </form>
        </div>

        <div className="table-company-datas mt-32 mt-lg-0 mt-xl-0 mt-md-0">
          <div className="overflow-auto rounded-lg shadow hidden d-flex ">

            <table className="w-full table-hover">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left">DesginationId</th>
                  <th className="p-3      text-sm font-semibold tracking-wide text-center">DesginationName</th>
                  <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">Status</th>
                  <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left">Update</th>
                  <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentActiveData.map((datas, index) => {
                  return <tr className="bg-white">
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      <p className="font-bold text-blue-500 hover:underline" key={index}>{datas.designationid}</p>
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap text-center" key={index}>
                      {datas.designationname}
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      <span
                        className={`p-1.5 text-xs font-medium uppercase tracking-wider rounded-lg bg-opacity-50 ${datas.status === 'Active'
                          ? 'text-green-800 bg-green-200'
                          : 'text-yellow-800 bg-red-500'
                          }`}
                        key={index}
                      >
                        {datas.status}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap btn-primary ">
                      <button className='btn btn-primary' onClick={() => handelupdateid(datas.designationid)}>Update</button></td>
                    <td className="p-3 whitespace-nowrap btn-danger ">
                      <button className='btn btn-danger' onClick={() => handledelete(datas.designationid)}>Delete</button></td>
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
                  <h1 className="modal-title fs-5" id="staticBackdropLabel">Update Designation Data</h1>
                  <button type="button" className="btn icon-link-hover" onClick={modalClose}><IoIosClose style={{ fontSize: "30px" }} /></button>
                </Modal.Header>
                <Modal.Body>
                  <form action="" className='row company-update-modal' onSubmit={handelupdate}>
                    <div className="company-id col-12 col-md-6 col-lg-6 col-xl-6">
                      <label htmlFor="Branch" className='form-label'>Department Name</label>
                      <select name="Branch" id="branch-select" className='form-select col-12 mb-3' onChange={(e) => setUpdateDatabsedata({ ...UpdateDatabsedata, departmentid: e.target.value })}
                        value={UpdateDatabsedata.departmentid} disabled>
                        <option value="">Select Branch</option>
                        {getdata && getdata.filter(data => data.status === "Active").map((data) => (
                          <option key={data.departmentid} value={data.departmentid}>
                            {data.departmentname}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="branch-name col-12 col-md-6 col-lg-6 col-xl-6">
                      <label htmlFor="branch-name" className='form-label'>Designation Name</label>
                      <input
                        type="text"
                        className='form-control mb-3'
                        value={UpdateDatabsedata.designationname}
                        placeholder='Enter Designation Name'
                        onChange={(e) => {
                          const designationname = e.target.value.toUpperCase()
                          setUpdateDatabsedata({ ...UpdateDatabsedata, designationname: designationname })
                        }} />
                    </div>
                    <div className="statu col-12 col-md-6 col-lg-6 col-xl-6 mb-3">
                      <label htmlFor="status" className='form-label'>Status</label> <br />
                      <div className="select-status d-flex gap-6 mt-1 flex-wrap">
                        <div className="form-check">
                          <label htmlFor="Active">Active</label>
                          <input
                            type="radio"
                            className='form-check-input'
                            name='status'
                            value={'Active'}
                            checked={UpdateDatabsedata.status === 'Active'}
                            onChange={(e) => setUpdateDatabsedata({ ...UpdateDatabsedata, status: e.target.value })}
                          />
                        </div>
                        <div className="form-check">
                          <label htmlFor="Active">InActive</label>
                          <input
                            type="radio"
                            className='form-check-input'
                            name='status'
                            value={'InActive'}
                            checked={UpdateDatabsedata.status === 'InActive'}
                            onChange={(e) => setUpdateDatabsedata({ ...UpdateDatabsedata, status: e.target.value })}
                            required />
                        </div>
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
                {[...Array(Math.ceil(Math.max(activeData.length, InactiveData.length) / itemsPerPage))].map((_, page) => (
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

            export default DesignationMaster
