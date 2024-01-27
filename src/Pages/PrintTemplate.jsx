import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import ReactToPrint from 'react-to-print';
import '../Style/Billdesign.css'
import { Pagination } from 'react-bootstrap';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';


function PrintTemplate() {

  const apiUrl = process.env.REACT_APP_API_BASE_URL

  console.log(apiUrl);

  const [billdatas, setbilldatas] = useState([]);

  const [CompanyDatas, setCompanyDatas] = useState([])

  const [Billprintdata, setBillprintdata] = useState([])





  // const generatePdf = async () => {
  //   const pdf = new jsPDF();
  //   pdf.text("Billing Details", 20, 10);
  //   pdf.autoTable({
  //     head: [
  //       ['Sno', 'Employee Code', 'Type of Pack', 'Amount', 'Discount', 'GST', 'Total Amount']
  //     ],
  //     body: billdatas.map(data => [
  //       data.Sno,
  //       data.Employeecode,
  //       data.TypeofPack,
  //       data.Amount,
  //       data.Discount,
  //       `${data.Gst} %`,
  //       data.TotalAmount
  //     ]),
  //     startY: 20,
  //   });

  //   const pdfArrayBuffer = pdf.output('arraybuffer');
  //   const pdfUint8Array = new Uint8Array(pdfArrayBuffer);
  //   const pdfBase64 = encode(pdfUint8Array);

  //   try {
  //     const response = await axios.post(`${apiUrl}/auto-mail-report`, {
  //       pdf: pdfBase64
  //     });

  //     console.log('====================================');
  //     console.log(response.data);
  //     console.log('====================================');
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };


  // function encode(arrayBuffer) {
  //   const bytes = new Uint8Array(arrayBuffer);
  //   let binary = '';
  //   for (let i = 0; i < bytes.byteLength; i++) {
  //     binary += String.fromCharCode(bytes[i]);
  //   }
  //   return btoa(binary);
  // }


 
  let intervalId = setInterval(() => {
    const systemTime = new Date();
    const defaultTime = '15:24:0'; // Use a string to represent time in HH:mm:ss format

    // Extract hours, minutes, and seconds from systemTime
    const hours = systemTime.getHours();
    const minutes = systemTime.getMinutes();
    const seconds = systemTime.getSeconds();

    const [targetHours, targetMinutes, targetSeconds] = defaultTime.split(':').map(Number);

    // Check if the current time is after the target time
    if (
      hours > targetHours ||
      (hours === targetHours && minutes > targetMinutes) ||
      (hours === targetHours && minutes === targetMinutes && seconds >= targetSeconds)
    ) {
      generatePdf();
      // Clear the interval to prevent further calls
      clearInterval(intervalId);
      // Generate PDF only once
   
    } else {
      // Do nothing or handle other logic if needed
    }
  }, 1000);







  const fetchData = async () => {
    const baseURL = `${apiUrl}`;

    await axios.get(`${baseURL}/bill_printing_data`)
      .then((res) => {
        console.log(res.data);
        setBillprintdata(res.data || []);
      })
      .catch((err) => {
        console.log(err);
      })
    await axios.get(`${baseURL}/transcation_data`)
      .then((res) => {
        console.log(res.data)
        setbilldatas(res.data || []);
      })
      .catch((err) => {
        console.log(err);
      })
    await axios.get(`${baseURL}/companyprofile`)
      .then((res) => {
        setCompanyDatas(res.data || []);
      })
      .catch((err) => {
        console.log(err);
      })
  };


  useEffect(() => {
    fetchData();
    // Function to be executed every 10 seconds
    const intervalLoop = () => {
      fetchData();
    };
    const intervalId = setInterval(intervalLoop, 1000);
    // Clean up the interval when the component is unmounted
    return () => {
      fetchData();
      clearInterval(intervalId);
    };
  }, []);



  const ContentRef = useRef()

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentActiveData = billdatas.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <button onClick={generatePdf} className='btn btn-success '>Print</button>
      {/* Print Designs here */}
      <div ref={ContentRef} className="print-content col-xl-10 col-lg-10 col-12 d-flex justify-center align-items-center w-100 py-3">


        <div className="card">
          <div className="card-header border-bottom h-25 ">
            <div className="company-logo company-names">
              {CompanyDatas.map((datas, index) => (
                <div key={index} className='d-flex justify-between'>
                  <img src={`data:image/png;base64,${datas.CompanyPhoto}`} alt="bill-logo" className="bill-logo" />
                  <h1 className='fw-semibold text-uppercase text-6xl sm:text-1xl text-center text-wrap w-75'>{datas.Companyname}</h1>
                  <img src={`data:image/png;base64,${datas.CompanyPhoto}`} alt="bill-logo" className="bill-logo" />
                </div>
              ))}
            </div>

          </div>
          <div className="card-body">
            <div className="top-details d-flex justify-between mt-3 mb-3">
              <div className="left-contetn">
                {Billprintdata.map((datas, index) => (
                  <div key={index}>
                    <h1 className='mb-2'>Bill No: <span className='text-muted'>00{datas.transid}</span></h1>
                    <p className=''>Customer Name: <span className='text-muted'>{datas.CustomerName}</span></p>
                  </div>
                ))}
              </div>
              <div className="right-contetnt">
                {Billprintdata.map((datas, index) => (

                  <div key={index}>
                    <p className='mb-1'>Date: <span className='text-muted'>{`${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`},{new Date().toLocaleTimeString()}</span></p>
                    <p className=''>Phone No: <span className='text-muted'>+91 {datas.MobileNo}</span></p>
                  </div>
                ))}

              </div>
            </div>
            <div className="table-company-datas">
              <div className="overflow-auto rounded-lg hidden d-flex ">

                <table className="w-full table-hover border">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="w-10 p-3 text-sm font-semibold tracking-wide text-left">Sno</th>
                      <th className="w-15 p-3 text-sm font-semibold tracking-wide text-center">Employeecode</th>
                      <th className="w-25 p-3 text-sm font-semibold tracking-wide text-left">TypeofPack</th>
                      <th className="w-25 p-3 text-sm font-semibold tracking-wide text-left">Amount</th>
                      <th className="w-25 p-3 text-sm font-semibold tracking-wide text-left">Discount</th>
                      <th className="w-25 p-3 text-sm font-semibold tracking-wide text-left">Gst</th>
                      <th className="w-25 p-3 text-sm font-semibold tracking-wide text-left">TotalAmount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {Billprintdata.map((datas, index) => {
                      return (
                        <tr className="bg-white">
                          <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                            <span className='text-muted'>{datas.Sno}</span>
                          </td>
                          <td className="p-3 text-sm text-gray-700 whitespace-nowrap text-center">
                            <span className='text-muted'>{datas.Employeecode}</span>
                          </td>
                          <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                            <span className='text-muted'>{datas.TypeofPack}</span>
                          </td>
                          <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                            <span className='text-muted'>{datas.Amount}</span>
                          </td>
                          <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                            <span className='text-muted'>{datas.Discount}</span>
                          </td>
                          <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                            <span className='text-muted'>{datas.Gst} %</span>
                          </td>
                          <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                            <span className='text-muted'>{datas.TotalAmount}</span>
                          </td>
                        </tr>
                      )
                    })}



                  </tbody>
                </table>
              </div>
            </div>
            <div className="signature mt-20 d-flex justify-between mb-0">
              <p>Company Signature</p>
              <p>Customer Signature</p>
            </div>
          </div>

          <div className="card-footer border-none border-top mt-3">
            {CompanyDatas.map((datas, index) => (
              <div key={index} className='text-center'>
                <h1>Thank You For Visiting</h1>
                <p className='text-muted text-uppercase mt-3'>{datas.Address1} , {datas.Address} , {datas.Pincode} , {datas.State} , {datas.District}</p>
              </div>
            ))}
          </div>
        </div>

      </div>


      <div className="print-button d-flex align-items-center justify-end">
        <ReactToPrint trigger={() => (<button className='btn btn-danger btn-lg '> Print </button>)}
          content={() => ContentRef.current} />
      </div>




      {/* Table For data Showing */}

      <div className="table-data text-center">
        <h1 className='text-3xl'>Transcation Historys</h1>
      </div>

      <div className="overflow-auto rounded-lg shadow hidden d-flex ">
        <table className="w-full table-hover overflow-auto">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="w-10 p-3 text-sm font-semibold tracking-wide text-left">So.No</th>
              <th className="w-15 p-3 text-sm font-semibold tracking-wide text-center">Employeecode</th>
              <th className="w-15 p-3 text-sm font-semibold tracking-wide text-left">CustomerName</th>
              <th className="w-15 p-3 text-sm font-semibold tracking-wide text-left">MobileNo</th>
              <th className="w-25 p-3 text-sm font-semibold tracking-wide text-left">TypeofPack</th>
              <th className="w-25 p-3 text-sm font-semibold tracking-wide text-left">Amount</th>
              <th className="w-25 p-3 text-sm font-semibold tracking-wide text-left">Discount</th>
              <th className="w-25 p-3 text-sm font-semibold tracking-wide text-left">Gst</th>
              <th className="w-25 p-3 text-sm font-semibold tracking-wide text-left">TotalAmount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentActiveData.map((datas, index) => {
              return <tr className="bg-white">
                <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                  <p className="font-bold text-blue-500 hover:underline" key={index}>{datas.Sno}</p>
                </td>
                <td className="p-3 text-sm text-gray-700 whitespace-nowrap text-center" key={index}>
                  {datas.Employeecode}
                </td>
                <td className="p-3 text-sm text-gray-700 whitespace-nowrap" key={index}>
                  {datas.CustomerName}
                </td>
                <td className="p-3 text-sm text-gray-700 whitespace-nowrap" key={index}>
                  {datas.MobileNo}
                </td>
                <td className="p-3 text-sm text-gray-700 break-all text-wrap" key={index}>
                  {datas.TypeofPack}
                </td>
                <td className="p-3 text-sm text-gray-700 break-all text-wrap" key={index}>
                  {datas.Amount}
                </td>
                <td className="p-3 text-sm text-gray-700 break-all text-wrap" key={index}>
                  {datas.Discount}
                </td>
                <td className="p-3 text-sm text-gray-700 break-all text-wrap" key={index}>
                  {datas.Gst}
                </td>
                <td className="p-3 text-sm text-gray-700 break-all text-wrap" key={index}>
                  {datas.TotalAmount}
                </td>
              </tr>
            })}
          </tbody>
        </table>
      </div>




      <Pagination className="mt-3 justify-content-end text-black">
        {[...Array(Math.ceil(billdatas.length / itemsPerPage))].map((_, page) => (
          <Pagination.Item
            key={page + 1}
            active={page + 1 === currentPage}
            onClick={() => handlePageChange(page + 1)}
            className='w-10 text-center'>
            {page + 1}
          </Pagination.Item>
        ))}
      </Pagination>


    </>
  );
}

export default PrintTemplate;
