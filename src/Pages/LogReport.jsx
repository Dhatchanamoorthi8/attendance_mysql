import React, { useState, useRef } from 'react'
import axios from 'axios';
import "../Style/report.css"
import ReactToPrint from 'react-to-print';
import { CSVLink } from "react-csv";
import { HiOutlineDownload,} from "react-icons/hi";
import { BsFiletypePdf } from "react-icons/bs";
import { Pagination } from 'react-bootstrap';

const LogReport = () => {

  const apiUrl = process.env.REACT_APP_API_BASE_URL

  console.log(apiUrl);

  const [Tabledatas, Settabledatas] = useState([])

  const [exportdata, setexportdata] = useState([])

  const [getData, setGetdata] = useState({
    fromDate: "",
    toDate: "",
    mode: "",
    employeecode: ""
  })

  const SearchData = () => {
    console.log(getData);
    axios.get(`${apiUrl}/attendance_log_reports`, {
      params: getData
    })
      .then((res) => {
        console.log(res.data);
        Settabledatas(res.data || [])
        setGetdata({ ...getData, employeecode: "" })
        const ReportRecord = res.data;
        const transformedData = ReportRecord.map((item) => ({
          Sno: item.Sno,
          EmpoloyeeCode: item.empoloyeecode,
          EmpoloyeeName: item.employeename,
          LogDate: item.LogDate,
        }));
        setexportdata(transformedData);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const ContentRef = useRef()

  const headers = [
    { label: "Sno", key: "Sno" },
    { label: "Empoloyee Code", key: "EmpoloyeeCode" },
    { label: "Empoloyee Name", key: "EmpoloyeeName" },
    { label: "Log Date", key: "LogDate" },
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
          <div className="select-mode">
            <label htmlFor="select">Select Type</label>
            <select name="mode-select" id="mode" className=' form-select mt-2' onChange={(e) => setGetdata({ ...getData, mode: e.target.value })}>
              <option value="">Select Type</option>
              <option value="all">All</option>
              <option value="individual">Individual</option>
            </select>
          </div>

          <div className="employee-code" style={{ display: getData.mode === "individual" ? "block" : 'none' }}>
            <label htmlFor="to-date" className=' form-label '>Employee Code</label>
            <input type="text" value={getData.employeecode} onChange={(e) => setGetdata({ ...getData, employeecode: e.target.value })} className=' form-control ' />
          </div>

          <div className="to-date pt-2">
            <button type="submit" onClick={SearchData} className='btn btn-dark bg-dark mt-4 '>Search</button>
          </div>
        </div>

        <div className="print-button d-flex align-items-center justify-end gap-3 mt-4">
          <CSVLink className='btn btn-success  d-flex gap-2 text-dark fw-semibold ' data={exportdata} headers={headers} filename={"LogReport.csv"}><HiOutlineDownload style={{ fontSize: "20px" }} />Export Data</CSVLink >
          <ReactToPrint trigger={() => (<button className='btn btn-dark d-flex gap-2'><BsFiletypePdf style={{ fontSize: "18px",marginTop:"2px" }}/>Save Pdf</button>)}
            content={() => ContentRef.current} />
        </div>
        
        <div className="table-company-datas mt-32 mt-lg-32 mt-xl-1 mt-md-0" ref={ContentRef}>
          <div className="heading mt-3">
            <h1 className='text-4xl fw-semibold text-center'>Log Report</h1>
            <hr className='mt-2 mb-2' />
          </div>
          <div className="overflow-auto rounded-lg shadow hidden d-flex ">

            <table className="w-full table-hover">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="w-10 p-3 text-sm font-semibold tracking-wide text-left">Sno</th>
                  <th className="w-25 p-3 text-sm font-semibold tracking-wide text-left">Empoloyee Code</th>
                  <th className="w-25 p-3 text-sm font-semibold tracking-wide text-left">Empoloyee Name</th>
                  <th className="w-10 p-3 text-sm font-semibold tracking-wide text-center">Log Date</th>
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
                        {datas.empoloyeecode}
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                        {datas.employeename}
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap text-center">
                        {datas.LogDate}
                      </td>
                    </tr>))
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

export default LogReport
