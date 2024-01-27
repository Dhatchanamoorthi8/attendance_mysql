import axios from 'axios';
import React, { useState, useRef } from 'react';
import "../Style/report.css"
import { CSVLink } from "react-csv";
import { HiOutlineDownload, } from "react-icons/hi";
import { BsFiletypePdf } from "react-icons/bs";
import ReactToPrint from 'react-to-print';
import { Pagination } from 'react-bootstrap';

function SalesReport() {

  const apiUrl = process.env.REACT_APP_API_BASE_URL

  console.log(apiUrl);

  const [Tabledatas, Settabledatas] = useState([])

  const [getData, setGetdata] = useState({
    fromDate: "",
    toDate: "",
  })

  const SearchData = () => {
    console.log(getData);
    axios.get(`${apiUrl}/sp_Salesreport`, {
      params: getData
    })
      .then((res) => {
        console.log(res.data);
        Settabledatas(res.data || [])
        const ReportRecord = res.data;
        const transformedData = ReportRecord.map((item) => ({
          Sno: item.Sno,
          Employeecode: item.Employeecode,
          CustomerName: item.CustomerName,
          MobileNo: item.MobileNo,
          TypeofPack: item.TypeofPack,
          Amount: item.Amount,
          Discount: item.Discount,
          Gst: item.Gst,
          TotalAmount: item.TotalAmount,
          ValidityFrom: item.Validityfrom,
          ValidityTo: item.Validityto,
        }));
        setexportdata(transformedData);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const [exportdata, setexportdata] = useState([])

  const ContentRef = useRef()

  const headers = [
    { label: "Sno", key: "Sno" },
    { label: "Employee Code", key: "Employeecode" },
    { label: "Customer Name", key: "CustomerName" },
    { label: "Mobile No", key: "MobileNo" },
    { label: "Type Of Pack", key: "TypeofPack" },
    { label: "Amount", key: "Amount" },
    { label: "Discount", key: "Discount" },
    { label: "Gst", key: "Gst" },
    { label: "Total Amount", key: "TotalAmount" },
    { label: "Validity From", key: "ValidityFrom" },
    { label: "Validity To", key: "ValidityTo" },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentActiveData = Tabledatas.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <div className="log-report">
    
        <div className="search-filter d-flex gap-10 justify-content-center mt-5">
          <div className="from-date">
            <label htmlFor="from-date" className=' form-label '>From Date</label>
            <input type="date" onChange={(e) => setGetdata({ ...getData, fromDate: e.target.value })} className=' form-control ' />
          </div>
          <div className="to-date">
            <label htmlFor="to-date" className=' form-label '>To Date</label>
            <input type="date" onChange={(e) => setGetdata({ ...getData, toDate: e.target.value })} className=' form-control ' />
          </div>
          <div className="to-date pt-2">
            <button type="submit" onClick={SearchData} className='btn btn-dark bg-dark mt-4 '>Search</button>
          </div>
        </div>




        <div className="print-button d-flex align-items-center justify-content-between   mt-4">
          <div className="total-amount">
            {<h1 className='text-2xl'>Total Amount: {Tabledatas.length > 0 ? Tabledatas[0].FinalAmount : "No data"}</h1>}
          </div>
          <div className="document d-flex gap-3">
            <CSVLink className='btn btn-success  d-flex gap-2 text-dark fw-semibold ' data={exportdata} headers={headers} filename={"SalesReport.csv"}><HiOutlineDownload style={{ fontSize: "20px" }} />Export Data</CSVLink >
            <ReactToPrint trigger={() => (<button className='btn btn-dark d-flex gap-2'><BsFiletypePdf style={{ fontSize: "18px", marginTop: "2px" }} />Save Pdf</button>)}
              content={() => ContentRef.current} />
          </div>

        </div>

        <div className="table-company-datas mt-32 mt-lg-32 mt-xl-5 mt-md-0" ref={ContentRef}>
        <div className="heading mt-3">
          <h1 className='text-4xl fw-semibold text-center mb-2'>Sales Report</h1>
          <hr />
        </div>
          <div className="overflow-auto rounded-lg shadow hidden d-flex ">

            <table className="w-full table-hover">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="w-10 p-3 text-sm font-semibold tracking-wide text-left">Sno</th>
                  <th className="w-15 p-3 text-sm font-semibold tracking-wide text-left">Employee Code</th>
                  <th className="w-15 p-3 text-sm font-semibold tracking-wide text-left">Customer Name</th>
                  <th className="w-25 p-3 text-sm font-semibold tracking-wide text-center">Mobile No</th>
                  <th className="w-30 p-3 text-sm font-semibold tracking-wide text-center">Type Of Pack</th>
                  <th className="w-10 p-3 text-sm font-semibold tracking-wide text-center">Amount</th>
                  <th className="w-10 p-3 text-sm font-semibold tracking-wide text-center">Discount</th>
                  <th className="w-10 p-3 text-sm font-semibold tracking-wide text-center">Gst</th>
                  <th className="w-10 p-3 text-sm font-semibold tracking-wide text-center">Total Amount</th>
                  <th className="w-10 p-3 text-sm font-semibold tracking-wide text-center">Validity From</th>
                  <th className="w-10 p-3 text-sm font-semibold tracking-wide text-center">Validity To</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Tabledatas.length > 0 ? (
                  currentActiveData.map((datas, index) => (
                    <tr className="bg-white">
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                        <p className="font-bold text-blue-500 hover:underline" key={index}>{datas.Sno}</p>
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                        {datas.Employeecode}
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                        {datas.CustomerName}
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap text-center">
                        {datas.MobileNo}
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap text-center">
                        {datas.TypeofPack}
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap text-center" key={index}>
                        {datas.Amount}
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap text-center" key={index}>
                        {datas.Discount}
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap text-center" key={index}>
                        {datas.Gst}
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap text-center" key={index}>
                        {datas.TotalAmount}
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap text-center" key={index}>
                        {datas.Validityfrom}
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap text-center" key={index}>
                        {datas.Validityto}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap text-center" colSpan="10">
                      <span className='text-xl'>No Data Found</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Pagination className="mt-3 justify-content-end text-black">
        {[...Array(Math.ceil(Tabledatas.length / itemsPerPage))].map((_, page) => (
          <Pagination.Item
            key={page + 1}
            active={page + 1 === currentPage}
            onClick={() => handlePageChange(page + 1)}
            className='w-10 text-center'>
            {page + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  )
}

export default SalesReport