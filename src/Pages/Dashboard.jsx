import React from 'react'
import '../Style/dashboard.css'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { FaRupeeSign } from "react-icons/fa";
import { Chart as Chartjs, defaults } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2'
import { GoDotFill } from "react-icons/go";

const Dashboard = () => {

  const apiUrl = process.env.REACT_APP_API_BASE_URL

  console.log(apiUrl);

  const [TodaySellCount, SetTodaySellCount] = useState([])

  const [CardCount, SetCardCount] = useState([])

  const [ProfileCard, setProfileCard] = useState([])

  defaults.maintainAspectRatio = false;
  defaults.responsive = true;
  defaults.plugins.title.display = true;

  defaults.plugins.title.fullSize = 20
  defaults.plugins.title.color = 'black'
  defaults.plugins.title.align = "start"



  // Set interval to one minute




  const [chartData, setChartData] = useState({
    day: 0,
    month: 0,
    year: 0,
    TotalEnquiry: 0,
    EnquiryAssignedTrainee: 0,
    EnquiryClose: 0,
  });


  const profiledata = () => {
    axios.get(`${apiUrl}/profile-card-dashboard`)
      .then((res) => {
        console.log(res.data[0]);
        setProfileCard(res.data || [])
      })
      .catch((err) => {
        console.log(err);
      })
  }


  const totalamountGet = () => {
    axios.get(`${apiUrl}/total-amount`)
      .then((res) => {
        console.log(res.data);
        SetTodaySellCount(res.data || [])
      })
      .catch((err) => {
        console.log(err);
      })

    axios.get(`${apiUrl}/totalpresentabsent-count`)
      .then((res) => {
        console.log(res.data[0]);
        SetCardCount(res.data || [])
      })
      .catch((err) => {
        console.log(err);
      })



  }


  const chartdatas = () => {
    const baseURL = `${apiUrl}`; // Your server's base URL

    axios.get(`${baseURL}/TotalAmount-Today`)
      .then(response => {
        setChartData(prevData => ({ ...prevData, day: response.data[0] || 0 }));
      })
      .catch(error => {
        console.error('Error fetching TotalAmount Today:', error);
      });

    // TotalAmount Month
    axios.get(`${baseURL}/TotalAmount-Month`)
      .then(response => {
        setChartData(prevData => ({ ...prevData, month: response.data[0] || 0 }));
      })
      .catch(error => {
        console.error('Error fetching TotalAmount Month:', error);
      });

    // TotalAmount Year
    axios.get(`${baseURL}/TotalAmount-Year`)
      .then(response => {
        setChartData(prevData => ({ ...prevData, year: response.data[0] || 0 }));
      })
      .catch(error => {
        console.error('Error fetching TotalAmount Year:', error);
      });

    // TotalEnquiry Count
    axios.get(`${baseURL}/TotalEnquiry-Count`)
      .then(response => {
        console.log('TotalEnquiry Count:', response.data);
        setChartData(prevData => ({ ...prevData, TotalEnquiry: response.data[0] || 0 }));
      })
      .catch(error => {
        console.error('Error fetching TotalEnquiry Count:', error);
      });

    // EnquiryAssignedTrainee Count
    axios.get(`${baseURL}/EnquiryAssignedTrainee-Count`)
      .then(response => {
        console.log('EnquiryAssignedTrainee Count:', response.data);
        setChartData(prevData => ({ ...prevData, EnquiryAssignedTrainee: response.data[0] || 0 }));
      })
      .catch(error => {
        console.error('Error fetching EnquiryAssignedTrainee Count:', error);
      });

    // EnquiryClose Count
    axios.get(`${baseURL}/EnquiryClose-Count`)
      .then(response => {
        console.log('EnquiryClose Count:', response.data);
        setChartData(prevData => ({ ...prevData, EnquiryClose: response.data[0] || 0 }));
      })
      .catch(error => {
        console.error('Error fetching EnquiryClose Count:', error);
      });

    // TotalEnquiry Count with Null AssignedUser
    axios.get(`${baseURL}/TotalEnquiry-Count-NullAssignedUser`)
      .then(response => {
        console.log('TotalEnquiry Count with Null AssignedUser:', response.data);
      })
      .catch(error => {
        console.error('Error fetching TotalEnquiry Count with Null AssignedUser:', error);
      });
  };

  // Call the function
    useEffect(() => {

   // initial page load data
    totalamountGet();
    chartdatas();
    profiledata();

    // Function to be executed every 10 seconds
    const intervalLoop = () => {
      totalamountGet();
      chartdatas();
      profiledata();
    };

    const intervalId = setInterval(intervalLoop,1000);

    // Clean up the interval when the component is unmounted
    return () => {
      totalamountGet();
      chartdatas();
      profiledata();
      clearInterval(intervalId);
    };

  }, []); 
  
  
  return (
    <div>
      {/* Top Card  */}
      <div className="row row-col-4 flex-wrap d-flex justify-content-around">



        <div className="card col-12 col-lg-3 col-xl-3 ms-0 dashboard-card  mb-3 mb-lg-0 mb-xl-0 p-0" style={{ backgroundColor: "#ff8293" }}>
          <div className="card-body d-flex justify-between position-relative">
            <div className="col-7">
              <h1 className='text-1'>Total Count</h1>
              <h1 className='text-2xl font-bold total-values'>{CardCount[0]?.totlcount}</h1>
            </div>
            <div className="col-5">
              <img src={require("../img/trainer.png")} alt="total-member" className='member-img ms-3' />
            </div>
          </div>
        </div>


        <div className="card col-12 col-lg-2 col-xl-2  dashboard-card mb-3 mb-lg-0 mb-xl-0 p-0" style={{ backgroundColor: "#CD5C5C" }}>
          <div className="card-body d-flex justify-between position-relative">
            <div className="col">
              <h1 className='text-1'>Present</h1>
              <h1 className='text-2xl font-bold total-values'>{CardCount[0]?.presentcount}</h1>
            </div>
            <div className="col-3">
              <div className='member-img mt-0'><GoDotFill style={{ color: "#228B22", fontSize: "30px" }} /></div>
            </div>
          </div>
        </div>


        <div className="card col-12 col-lg-2 col-xl-2  dashboard-card  mb-3 mb-lg-0 mb-xl-0 p-0" style={{ backgroundColor: "#008B8B" }}>
          <div className="card-body d-flex justify-between position-relative">
            <div className="col">
              <h1 className='text-1'>Absent</h1>
              <h1 className='text-2xl font-bold total-values'>{CardCount[0]?.Absentcount}</h1>
            </div>
            <div className="col-3">
              <div className='member-img'><GoDotFill style={{ color: "#FF0000", fontSize: "30px" }} /></div>
            </div>
          </div>
        </div>





        <div className="card col-12 col-lg-3 col-xl-3  ms-0  bg-green-600 dashboard-card  mb-3 mb-lg-0 mb-xl-0 p-0" style={{ backgroundColor: "#4eb472" }}>
          <div className="card-body d-flex justify-between position-relative">
            <div className="col-7">
              <h1 className='text-1'>Today Sales</h1>
              {TodaySellCount.map((data, index) => {
                return <h1 className='text-2xl font-bold total-values d-flex justify-between' key={index}>{data.TotalAmount} <span className=' d-lg-inline-flex '><FaRupeeSign style={{ fontSize: "20px", marginTop: "10px" }} /></span></h1>
              })}
            </div>
            <div className="col-5">
              <img src={require("../img/money-bag.png")} alt="total-member" className='member-img ms-3 mt-2' />
            </div>
          </div>
        </div>


      </div>
      {/* Top Card End */}


      {/* profile Card top 5 */}
      <div className="row m-0 p-0">
        <div className="heading text-center mt-2 mb-2 rounded bg-transparent border ">
          <marquee className='mt-2 fw-semibold' scrollamount="5">TOP 5 LIVE ATTENDANCE</marquee>
        </div>
        {ProfileCard.map((item, index) => (
          <div className="card profile-card col-12 col-lg-2 ms-auto me-auto m-2 p-0" key={index}>
            <div className="card-body mt-2 p-3 ">
              <img
                src={`data:image/png;base64,${item.photo}`}
                alt="images"
                className='profile-img m-0 p-0' />
              <p className='text-center mt-2 profile-name'>{item.employeename}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Profile card end */}

      <div className="Bar-chart-component row gap-lg-0 gap-xl-0 gap-2 ">

        <div className="col-12 col-xl-6 col-lg-6 col-md-6">
          <div className="card chart-card p-3">

            <Bar
              data={{
                labels: ["Day", "Month", "Year"],
                datasets: [
                  {
                    label: "Day",
                    data: [chartData.day.TotalAmount, 0, 0],
                    backgroundColor: [
                      "rgb(0, 158, 115)",
                      "rgb(240, 228, 66)",
                      "rgb(213, 94, 0)",
                    ],
                    borderRadius: 5,
                  },
                  {
                    label: "Month",
                    data: [0, chartData.month.TotalAmount, 0],
                    backgroundColor: ["rgb(240, 228, 66)"],
                    borderRadius: 5,
                  },
                  {
                    label: "Year",
                    data: [0, 0, chartData.year.TotalAmount],
                    backgroundColor: ["rgb(213, 94, 0)"],
                    borderRadius: 5,
                  },
                ],
              }}
              options={{
                title: {
                  display: true,
                  text: 'Custom Chart Title',
                },
              }}
            />

          </div>

        </div>
        <div className="col-12 col-xl-6 col-lg-6 col-md-6">
          <div className="card chart-card p-3">

            <Bar
              data={{
                labels: ["EnquiryCount", "EnquiryAssignedTraineeCount", "EnquiryCloseCount"],
                datasets: [
                  {
                    label: "TotalEnquiry",
                    data: [chartData.TotalEnquiry.EnquiryCount, 0, 0],
                    backgroundColor: [
                      "rgb(0, 158, 115)",
                    ],
                    borderRadius: 5,
                  },
                  {
                    label: "EnquiryAssignedTrainee",
                    data: [0, chartData.EnquiryAssignedTrainee.EnquiryAssignedTraineeCount, 0],
                    backgroundColor: [
                      "rgb(	240, 228, 66)",

                    ],
                    borderRadius: 5,
                  },
                  {
                    label: "EnquiryClose",
                    data: [0, 0, chartData.EnquiryClose.EnquiryCloseCount],
                    backgroundColor: [
                      "rgb(213, 94, 0)",
                    ],
                    borderRadius: 5,
                  },
                ],
              }}
            />
          </div>
        </div>

      </div>

      {/* Bar chart */}

    </div>
  )
}

export default Dashboard