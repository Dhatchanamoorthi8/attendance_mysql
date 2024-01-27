import axios from 'axios';
import React, { useState, useEffect } from 'react';
import "../Style/report.css"
import { GoSearch } from "react-icons/go";
import { ToastContainer, toast } from 'react-toastify';

const Report = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState({
    name: "",
    phonenumber: ""
  });

  const handleNameChange = (e) => {
    setSearch({ ...search, name: e.target.value });
  };

  const handlePhoneNumberChange = (e) => {
    setSearch({ ...search, phonenumber: e.target.value });
  };

  const handleSearch = () => {
    axios.get('http://localhost:3002/get', {
      params: {
        name: search.name,
        phonenumber: search.phonenumber
      }
    })
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };


  const fetchDefaultData = () => {
    axios.get('http://localhost:3002/default-data')
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };


  useEffect(() => {
    fetchDefaultData();
  }, []);


  const printContent = (datas) => {
    const tableData = [
      { field: 'Name', value: `${datas.name}` },
      { field: 'Address', value: `${datas.address}` },
      { field: 'Mobile No', value: `${datas.mobile}` },
      { field: 'Amount Paied', value: `${datas.payment}` },
      { field: 'Payment Method', value: `${datas.payment_type}` },
      { field: 'Payment Method', value: `${datas.course_duration}` },
      
    ];
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write('<html><head><title>Print</title></head><body>');
      newWindow.document.write('<table border="1" cellspacing="0" cellpadding="5">');
      newWindow.document.write('<tr><th>Field</th><th>Value</th></tr>');
  
      tableData.forEach((data) => {
        newWindow.document.write(`<tr><td>${data.field}</td><td>${data.value}</td></tr>`);
      });
      newWindow.document.write('</table>');
      newWindow.document.write('</body></html>');
      newWindow.document.close();
      newWindow.print();
    } else {
      alert("Pop-up blocked. Please allow pop-ups for this site.");
    }
  };
  







  const sendEmail = (emailContent, email) => {
    if (email) {
      window.location.href = `mailto:${email}?subject=Pay Slip&body=${encodeURIComponent(emailContent)}`;

      const functionThatReturnPromise = () => new Promise(resolve => setTimeout(resolve, 1500));
      toast.promise(
        functionThatReturnPromise,
        {
          pending: 'Send Bill to Email',
          success: 'Email Send Successfully',
        }
    )
    } else {
      console.log("Email address not found");
      const functionThatReturnPromise = () => new Promise((resolve,reject) => setTimeout(reject, 1500));
      toast.promise(
        functionThatReturnPromise,
        {
          pending: 'Send Bill to Email',
          error:'Email Address not found'
        }
    )
    }
  };
  const getEmailContent = (datas) => {
    const emailContent =
      `
      Name: ${datas.name}
      Address: ${datas.address}
      Mobile No: ${datas.mobile}
      Amount Paid: ${datas.payment}
      Payment Method: ${datas.payment_type}
      Course Duration: ${datas.course_duration}
      Date: ${datas.date}
    `;

    return emailContent;

  };


  return (
    <div style={{width:"90vw"}}>
      <div className="payslip">

        <div className="inputs d-flex justify-content-end flex-wrap gap-0 mb-5">
          <div className="input-name">
            <input type="text" onChange={handleNameChange}
              placeholder="Name" className='search-name' />
          </div>
          <div className="input-number position-relative ">
            <input type="text" onChange={handlePhoneNumberChange} placeholder="Phone Number"
              className='search-number' />
            <div className="serach-button ">
              <button type='button' onClick={handleSearch} className='search-btn'><GoSearch /></button>
            </div>
          </div>

        </div>

        {data.map((datas, index) => (
          <div key={index} className="card ">
             <h1 className=' text-3xl text-center mt-2 mb-2'>Pay Slip </h1>
            <hr />
            <div className="card-body d-flex col-12 flex-wrap gap-20 pay-slips position-relative " id="contentToPrint">
      
            <p>Name : <span>{datas.name}</span></p>
                 <p>Address : <span>{datas.address}</span></p>
                 <p>Mobile No : <span>{datas.mobile}</span></p>
                 <p>Amount Paid : <span>{datas.payment}</span></p>
                 <p>Payment Method : <span>{datas.payment_type}</span></p>
                 <p>Course Duration : <span>{datas.course_duration}</span></p>
                 <p>Date: <span>{datas.course_duration}</span></p>
                 <p>Email: <span>{datas.email}</span></p>
            </div>
            <div className="send-btn gap-10 d-flex justify-content-end  me-5 mb-2">
              <button className='btn btn-danger' onClick={() => printContent(datas)}>Print</button>
                <button className='btn btn-primary' onClick={() => sendEmail(getEmailContent(datas), datas.email)}>Send Mail</button>
              </div>
          </div>

          

        ))}
      </div>
      <ToastContainer
      theme="dark"/>
    </div>
  )
}

export default Report;
