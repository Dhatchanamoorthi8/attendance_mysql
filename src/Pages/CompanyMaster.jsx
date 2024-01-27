import React, { useEffect, useState } from 'react'
import '../Style/companymaster.css'
import axios from 'axios'
import { Pagination } from 'react-bootstrap';
import { IoIosClose } from "react-icons/io";
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';

import { Modal } from 'react-bootstrap';



const CompanyMaster = () => {

  const apiUrl = process.env.REACT_APP_API_BASE_URL

  console.log(apiUrl);



  const [companydata, setcompanydata] = useState({
    company_name: "",
    status: "",
  })

  const [Updatecompanydata, setUpdatecompanydata] = useState({
    company_name: '',
    status: '',
  })
  const [useridforcratedby, setuseridforcratedby] = useState({})

  const [tabledata, settabledata] = useState([])
  const [updateid, setupdateid] = useState("")
  const [loader, setloader] = useState(false)
  const [validation, setvalidation] = useState([])

  useEffect(() => {
    companytabledata()
    const storedUserData = JSON.parse(localStorage.getItem('userData'));
    if (storedUserData && storedUserData.userid) {
      setuseridforcratedby(storedUserData)
    }
    else {
      setuseridforcratedby({ message: "empty" })
    }

  }, [])


  const companytabledata = async () => {
    await axios.get(`${apiUrl}/getcompany_data`)
      .then((res) => {
        console.log(res)
        settabledata(res.data || [])
        setvalidation(res.data || [])
      })
      .catch((err) => console.log(err))
  }
  const createdBy = useridforcratedby.userid || useridforcratedby.message;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const activeData = tabledata.filter((data) => data.status === 'Active');
  const InactiveData = tabledata.filter((data) => data.status === 'InActive');

  const currentActiveData = activeData.slice(indexOfFirstItem, indexOfLastItem);


  // Function to handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };




  const handlesend = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (companydata.company_name === '') {
      // Handle empty designationname field
      Swal.fire({
        text: "Please enter a Designation Name!",
        icon: "warning"
      });
      return;
    }

    if (companydata.status === '') {
      // Handle empty status field
      Swal.fire({
        text: "Please select a Status!",
        icon: "warning"
      });
      return;
    }
    const isValidationSuccess = validation.some((item) => {
      return (
        item.companyname === companydata.company_name
      )
    })
    if (isValidationSuccess) {
      Swal.fire({
        text: "This Company Name is Already Exitsing",
        icon: "warning"
      });
      return;
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
            const alldata = { ...companydata, company_name: companydata.company_name.trim(), createdby: createdBy };
            axios.post(`${apiUrl}/post`, alldata)
              .then((res) => {
                console.log(res);
                setloader(false);
                setcompanydata({ ...companydata, company_name: "", status: "", });
                setUpdatecompanydata({ Updatecompanydata: 0 })
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
                companytabledata()
              })
          } catch (err) {
            console.log(err);
            setloader(false)
          }

        }, 1500)
      }
      else {
        setloader(false)
      }
    });

  };


  const handledelete = async (companyid) => {
    Swal.fire({
      title: 'Are you sure delete this data?',
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
            axios.delete(`${apiUrl}/delete_companymaster`, { data: { id: companyid, createdBy: createdBy } })
              .then((res) => {
                console.log(res);
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
                );
              })
              .then(() => {
                companytabledata()
              })
          } catch (err) {
            console.log(err);
            setloader(false);
          }
        }, 1500)
      }
      else {
        setloader(false)
      }
    });
  };

  const searchedit = (id) => {
    axios.get(`${apiUrl}/editcompany_data/` + id)
      .then(res => {
        const { companyname, status } = res.data[0];
        setUpdatecompanydata({ company_name: companyname, status: status });
      })
  }
  const [show, popup] = useState(false)

  const handelupdateid = (id, status) => {
    setupdateid(id)
    searchedit(id);
    console.log(id);
    popup(true)
  }

  const modalClose = () => popup(false)

const handelupdate = async (e) => {
    e.preventDefault();
    if (Updatecompanydata.company_name === '') {
      Swal.fire({
        text: "Please enter a Company Name!",
        icon: "warning"
      });
      return;
    }

    if (Updatecompanydata.status === '') {
      Swal.fire({
        text: "Please select a Status!",
        icon: "warning"
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure to update this data?',
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
        const alldata = { ...Updatecompanydata, company_name: Updatecompanydata.company_name.trim(), createdBy: createdBy };

        axios.put(`${apiUrl}/updatecompanydata/${updateid}`, alldata)
          .then((res) => {
            setloader(false);
            const functionThatReturnPromise = () =>
              new Promise((resolve) => setTimeout(resolve, 500));
            toast.promise(
              functionThatReturnPromise,
              {
                pending: 'Updating Your Data',
                error: 'Data update failed',
                success: 'Your Data Updated successfully',
              }
            );
          })
          .then(() => {
            companytabledata();
            popup(false)
          })
          .catch((err) => {
            console.log(err);
            setloader(false);

          });
      } else {
        setloader(false);

      }
    });
  };
  return (
    <div>
      <div className="companymaster-head">
        <div className="company-form d-flex align-items-center justify-content-center p-5 mt-20 mt-lg-0 mt-xl-0 mt-md-0 position-relative ">
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

          <form action="" className='forms border rounded p-lg-0 p-xl-0 p-3 p-md-2 col-20 col-lg-5 col-xl-5 m-0' onSubmit={handlesend} style={{ opacity: loader ? "0.1" : "1" }}>
            <h3 className=' text-3xl text-center mb-3 mt-3'>Company Registration</h3>
            <hr className='mb-3 mt-1' />
            <div className="d-flex flex-wrap justify-content-center m-0">
              <div className="branch-name col-12 col-md-6 col-lg-6 col-xl-8">
                <label htmlFor="branch-name" className='form-label'>Company Name</label>
                <input type="text" className='form-control mb-4' placeholder='Enter Company Name'
                  value={companydata.company_name}
                  onChange={(e) => {
                    const CompanyName = e.target.value.toUpperCase()
                    setcompanydata({ ...companydata, company_name: CompanyName })
                  }} required />
              </div>
              <div className="status col-12 col-md-6 col-lg-6 col-xl-8 mb-3">
                <label htmlFor="status" className='form-label'>Status</label> <br />
                <div className="select-status d-flex gap-6 mt-1 flex-wrap">
                  <div className="form-check">
                    <label htmlFor="Active">Active</label>
                    <input type="radio" className='form-check-input'
                      name='status'
                      checked={companydata.status === 'Active'}
                      value={'Active'} onChange={(e) => setcompanydata({ ...companydata, status: e.target.value })} />
                  </div>
                  <div className="form-check">
                    <label htmlFor="Active">InActive</label>
                    <input type="radio" className='form-check-input radio-2'
                      name='status'
                      checked={companydata.status === 'InActive'}
                      value={'InActive'} onChange={(e) => setcompanydata({ ...companydata, status: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="created-by col-12 col-md-6 col-lg-5 col-xl-8  ms-auto  me-auto">
                <button className='btn btn-success mt-8 col-12 mb-3'>Submit</button>
              </div>
            </div>
          </form>
        </div>

        <div className="table-company-datas mt-32 mt-lg-0 mt-xl-0 mt-md-0" style={{ opacity: loader ? "0.1" : "1" }}>
          <div className="overflow-auto rounded-lg shadow hidden d-flex ">

            <table className="w-full table-hover overflow-auto">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left">CompanyId</th>
                  <th className="p-3 text-sm font-semibold tracking-wide text-center">CompanyName</th>
                  <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">Status</th>
                  <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left">Update</th>
                  <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentActiveData.map((datas, index) => {
                  return <tr className="bg-white">
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      <p className="font-bold text-blue-500 hover:underline" key={index}>{datas.companyid}</p>
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap text-center" key={index}>
                      {datas.companyname}
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
                    <td className="p-3 whitespace-nowrap btn-primary "><button className='btn btn-primary' onClick={() => handelupdateid(datas.companyid, datas.status)}>Update</button></td>
                    <td className="p-3 whitespace-nowrap btn-danger "><button className='btn btn-danger' onClick={() => handledelete(datas.companyid)}>Delete</button></td>
                  </tr>
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Update Modal */}
      <Modal show={show} animation={true} onHide={modalClose}>
          <Modal.Header >
            <h1 className="modal-title fs-5" id="staticBackdropLabel">Update Company Data</h1>
            <button type="button" className="btn icon-link-hover" onClick={modalClose}><IoIosClose style={{ fontSize: "30px" }} /></button>
          </Modal.Header>
          <Modal.Body>
            <form action="" className='row company-update-modal' onSubmit={handelupdate}>
              <div className="branch-name col-12 col-md-6 col-lg-6 col-xl-6">
                <label htmlFor="branch-name" className='form-label'>Company Name</label>
                <input
                  type="text"
                  className='form-control mb-3'
                  placeholder='Enter Company Name'
                  value={Updatecompanydata.company_name}
                  onChange={(e) => {
                    const CompanyName = e.target.value.toUpperCase()
                    setUpdatecompanydata({ ...Updatecompanydata, company_name: CompanyName })
                  }}/>
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
                      checked={Updatecompanydata.status === 'Active'}
                      onChange={(e) => setUpdatecompanydata({ ...Updatecompanydata, status: e.target.value })}
                    />
                  </div>
                  <div className="form-check">
                    <label htmlFor="Active">InActive</label>
                    <input
                      type="radio"
                      className='form-check-input'
                      name='status'
                      value={'InActive'}
                      checked={Updatecompanydata.status === 'InActive'}
                      onChange={(e) => setUpdatecompanydata({ ...Updatecompanydata, status: e.target.value })}
                      required
                    />
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

export default CompanyMaster