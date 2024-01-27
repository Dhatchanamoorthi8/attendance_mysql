import React, { useState } from "react"
import Loginpage from "./Pages/Loginpage";
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from "./Pages/Sidebar";
import Dashboard from "./Pages/Dashboard";
import BranchMaster from "./Pages/BranchMaster";
import CompanyMaster from "./Pages/CompanyMaster";
import Particlebg from "./Components/Particlebg";
import DesignationMaster from "./Pages/DesignationMaster";
import EmployeeMaster from "./Pages/EmployeeMaster";
import DivisonMaster from "./Pages/DivisonMaster";
import DepartmentMaster from "./Pages/DepartmentMaster";
import LogReport from './Pages/LogReport.jsx'
import AttendanceReport from './Pages/AttendanceReport.jsx'
import Enquiry from "./Pages/Enquiry.jsx";
import Followuppage from "./Pages/Followuppage.jsx";
import TypeofPack from "./Pages/TypeofPack.jsx";
import Billing from "./Pages/Billing.jsx";
import CompanyProfile from "./Pages/CompanyProfile.jsx";
import SalesReport from "./Pages/SalesReport.jsx";
import EnquiryReport from "./Pages/EnquiryReport.jsx";


import { driver } from "driver.js";
import "driver.js/dist/driver.css";



function App() {



  const storedLoggedIn = localStorage.getItem('loggedIn');
  const [loggedIn, setLoggedIn] = useState(storedLoggedIn === 'true');

  const handleLogin = () => {
    setLoggedIn(true);
    localStorage.setItem('loggedIn', 'true')
  }
  const handleLogout = () => {
    setLoggedIn(false)
    localStorage.setItem('loggedIn', 'fasle')
  }

  // var Debug = false;
  // if(!Debug){
  //   console.log = function(){};
  // }

  return (
    <Router>
      <>
        <Particlebg />

        <Routes>
          <Route path="/" element={
            !loggedIn ?
              (<Loginpage setLoggedIn={handleLogin} />) : (<Navigate to={'/dashboard'} />)
          }></Route>

          <Route path="/dashboard" element={loggedIn ?
            (<Sidebar onLogout={handleLogout}>
              <Dashboard onLogout={handleLogout}/>
            </Sidebar>) : (<Navigate to={"/"} />)
          }></Route>

          <Route path="/company" element={loggedIn ?
            (<Sidebar onLogout={handleLogout} >
              <CompanyMaster onLogout={handleLogout} />
            </Sidebar>) : (<Navigate to={'/'} />)
          }></Route>

          <Route path="/branch" element={loggedIn ?
            (<Sidebar onLogout={handleLogout}>
              <BranchMaster onLogout={handleLogout} />
            </Sidebar>) : (<Navigate to={'/'} />)
          }></Route>

          <Route path="/division" element={loggedIn ?
            (<Sidebar onLogout={handleLogout}>
              <DivisonMaster onLogout={handleLogout} />
            </Sidebar>) : (<Navigate to={'/'} />)
          }></Route>


          <Route path="/department" element={loggedIn ?
            (<Sidebar onLogout={handleLogout}>
              <DepartmentMaster onLogout={handleLogout} />
            </Sidebar>) : (<Navigate to={'/'} />)
          }></Route>


          <Route path="/designation" element={loggedIn ?
            (<Sidebar onLogout={handleLogout}>
              <DesignationMaster onLogout={handleLogout} />
            </Sidebar>) : (<Navigate to={'/'} />)
          }></Route>


          <Route path="/employee" element={loggedIn ?
            (<Sidebar onLogout={handleLogout}>
              <EmployeeMaster onLogout={handleLogout} />
            </Sidebar>) : (<Navigate to={'/'} />)
          }></Route>





          <Route path="/enquiry" element={loggedIn ?
            (<Sidebar onLogout={handleLogout}>
              <Enquiry onLogout={handleLogout} />
            </Sidebar>) : (<Navigate to={'/'} />)
          }></Route>


          <Route path="/followup" element={loggedIn ?
            (<Sidebar onLogout={handleLogout}>
              <Followuppage onLogout={handleLogout} />
            </Sidebar>) : (<Navigate to={'/'} />)
          }></Route>





          <Route path="/typeofpack" element={loggedIn ?
            (<Sidebar onLogout={handleLogout}>
              <TypeofPack onLogout={handleLogout} />
            </Sidebar>) : (<Navigate to={'/'} />)
          }></Route>


          <Route path="/billing" element={loggedIn ?
            (<Sidebar onLogout={handleLogout}>
              <Billing onLogout={handleLogout} />
            </Sidebar>) : (<Navigate to={'/'} />)
          }></Route>


          <Route path="/logreport" element={loggedIn ?
            (<Sidebar onLogout={handleLogout}>
              <LogReport onLogout={handleLogout} />
            </Sidebar>) : (<Navigate to={'/'} />)
          }></Route>

          <Route path="/attendancereport" element={loggedIn ?
            (<Sidebar onLogout={handleLogout}>
              <AttendanceReport onLogout={handleLogout} />
            </Sidebar>) : (<Navigate to={'/'} />)
          }></Route>


          <Route path="/company-profile" element={loggedIn ?
            (<Sidebar onLogout={handleLogout}>
              <CompanyProfile onLogout={handleLogout} />
            </Sidebar>) : (<Navigate to={'/'} />)
          }></Route>

          <Route path="/EnquiryReport" element={loggedIn ?
            (<Sidebar onLogout={handleLogout}>
              <EnquiryReport onLogout={handleLogout} />
            </Sidebar>) : (<Navigate to={'/'} />)
          }></Route>

          <Route path="/SalesReport" element={loggedIn ?
            (<Sidebar onLogout={handleLogout}>
              <SalesReport onLogout={handleLogout} />
            </Sidebar>) : (<Navigate to={'/'} />)
          }></Route>
        </Routes>
      </>
    </Router>
  );
}

export default App;
