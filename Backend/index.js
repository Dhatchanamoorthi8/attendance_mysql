const express = require("express")
const cors = require("cors")
const mysql = require("mysql")
const multer = require('multer');
const XLSX = require('xlsx');
const Automail = require('./Automail');   /// Auto mail js file
const nodemailer = require("nodemailer"); /// node mail sender
const server = express()
server.use(cors())
server.use(express.json())

const upload = multer({ dest: 'uploads/' });

const dotenv = require('dotenv')


dotenv.config()

console.log('====================================');
console.log(process.env.Name)
console.log('====================================');  ///////// use case of env config 




setInterval(() => {
  Automail('John');  // Automail function call
}, 1000);




const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "gym_main"
})

const getDefaultImageBase64 = () => {
  const fs = require('fs');
  const defaultImageBuffer = fs.readFileSync('./uploads/emptyprofile.png');
  return defaultImageBuffer.toString('base64');
};





////// auto mail report

server.post('/auto-mail-report', (req, res) => {
  console.log("comeing");
  console.log(req.body.pdf, "indexjs");

  if (req.body.pdf) {

    try {
      const pdfBuffer = Buffer.isBuffer(req.body.pdf) ? req.body.pdf : Buffer.from(req.body.pdf, 'base64');
      let smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',  // Fix the typo here
        port: 587,
        secure: false,
        auth: {
          user: process.env.Emailaddress,
          pass: process.env.Emailpassword
        },
      });

      const emailContent = `
   <html>
    <head>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 20px;
        }
        h3 {
          color: #3498db;
        }
        p {
          color: #333;
        }
      </style>
    </head>
    <body>
      <h3>Reports From Attendance Application</h3>
      <p>Hello,</p>
      <p>Please find attached the reports from the Attendance Application.</p>
      <!-- Add any other content or dynamic data here -->
      <p>Thank you for using our service!</p>
    </body>
  </html>
`;

      smtpTransport.sendMail({
        from: {
          name: 'Report For Attendances',
          address: process.env.Emailaddress,
        },
        to: process.env.ToEmailaddress,
        subject: "Reports From Attendance Application",
        text: "Attendance Report",
        html: emailContent,
        attachments: [{
          content: pdfBuffer,
          filename: "Report Pdf",
          contentType: "application/pdf",
          contentDisposition: "attachment"
        }]
      }, function (error, res) {
        if (error) {
          console.log(error, "error");
          console.log("Mail has been sended to your email. Check your mail", error)
        }
        else {
          // res.send("Mail has been sended to your email. Check your mail")
          console.log("Mail has been sended to your email. Check your mail")
        }

      });
    }
    catch (error) {
      console.error('Error saving PDF:', error.message);
      res.status(500).send('Error saving PDF');
    }
  } else {
    console.error("Request Not Comming From Front end");
    res.status(500).send('Error PDF From frontend');
  }
});






// execute query

server.get('/totalpresentabsent-count', (req, res) => {
  db.query('CALL totalpresentabsentcount', (err, result) => {
    if (err)
      throw err
    else {
      res.send(result[0])
    }
  })
})


server.get('/profile-card-dashboard', (req, res) => {
  db.query(`
    SELECT empoloyeemaster.employeename, empoloyeemaster.empoloyeecode ,empoloyeemaster.photo
    FROM empoloyeemaster 
    JOIN lms_attendancedetails 
    ON empoloyeemaster.empoloyeecode = lms_attendancedetails.EmployeeCode 
    WHERE (CAST(lms_attendancedetails.InTime AS DATE) = CAST(CURDATE() AS DATE)) 
    ORDER BY lms_attendancedetails.InTime DESC 
    LIMIT 5
  `, (err, result) => {
    if (err) {
      throw err;
    } else {
      res.send(result);
    }
  });
});






//  Chart datas

server.get('/TotalAmount-Today', (req, res) => {
  db.query(`SELECT IFNULL(SUM(TotalAmount), 0) AS TotalAmount 
            FROM TransactionHistory 
            WHERE DATE(Createddate) = CURDATE();`, (err, result) => {
    if (err) throw err;
    else res.send(result);
  });
});

server.get('/TotalAmount-Month', (req, res) => {
  db.query(`SELECT IFNULL(SUM(TotalAmount), 0) AS TotalAmount 
            FROM TransactionHistory 
            WHERE MONTH(Createddate) = MONTH(CURDATE());`, (err, result) => {
    if (err) throw err;
    else res.send(result);
  });
});

server.get('/TotalAmount-Year', (req, res) => {
  db.query(`SELECT IFNULL(SUM(TotalAmount), 0) AS TotalAmount 
            FROM TransactionHistory 
            WHERE YEAR(Createddate) = YEAR(CURDATE());`, (err, result) => {
    if (err) throw err;
    else res.send(result);
  });
});

server.get('/TotalEnquiry-Count', (req, res) => {
  db.query(`SELECT IFNULL(COUNT(*), 0) AS EnquiryCount 
            FROM Enquiry 
            WHERE Status = 'P' AND Responseid = '2';`, (err, result) => {
    if (err) throw err;
    else res.send(result);
  });
});

server.get('/EnquiryAssignedTrainee-Count', (req, res) => {
  db.query(`SELECT IFNULL(COUNT(*), 0) AS EnquiryAssignedTraineeCount 
            FROM Enquiry 
            WHERE Status = 'P' AND Responseid = '2' AND AssignedUser IS NOT NULL;`, (err, result) => {
    if (err) throw err;
    else res.send(result);
  });
});

server.get('/EnquiryClose-Count', (req, res) => {
  db.query(`SELECT IFNULL(COUNT(*), 0) AS EnquiryCloseCount 
            FROM Enquiry 
            WHERE Status = 'C' AND Responseid = '1';`, (err, result) => {
    if (err) throw err;
    else res.send(result);
  });
});

server.get('/TotalEnquiry-Count-NullAssignedUser', (req, res) => {
  db.query(`SELECT IFNULL(COUNT(*), 0) AS EnquiryCount 
            FROM Enquiry 
            WHERE Status = 'P' AND Responseid = '2' AND AssignedUser IS NULL;`, (err, result) => {
    if (err) throw err;
    else res.send(result);
  });
});


// Admin Querys

server.get('/forgetpassword', (req, res) => {
  const value = "A"
  db.query(`select usercode from gym_main.usermaster where userstatus ='${value}'`, (err, result) => {
    if (err)
      throw err
    else {
      res.send(result)
    }
  })
})
server.put('/forgetpassword-change', (req, res) => {
  const { usercode, newpassword, confirmpassword } = req.body;
  db.query(
    `UPDATE gym_main.usermaster 
    SET password = '${newpassword}', confirmpassword = '${confirmpassword}' 
    WHERE usercode = '${usercode}'`,
    (err, result) => {
      if (err) {
        throw err;
      } else {
        res.send(result);
      }
    }
  );
});

server.get('/login', (req, res) => {
  const name = req.query.name;
  db.query(
    `SELECT * FROM usermaster um JOIN usertypemaster utype ON um.usertype = utype.usertypeid WHERE um.usercode = '${name}'`,
    (err, result) => {
      if (err) {
        console.log(err)
        throw err;
      } else {
        console.log(result);
        res.send(result);
      }
    }
  );
})

server.put('/changepassword', (req, res) => {
  const { newpassword, confirmpassword, usercode } = req.body
  db.query(`UPDATE gym_main.usermaster SET password = '${newpassword}', confirmpassword = '${confirmpassword}' WHERE usercode = '${usercode}'`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  })
});

// Select Querys

server.get('/getcompany_data', (req, res) => {
  db.query('SELECT * FROM gym_main.companymaster ORDER BY companyid Desc', (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error retrieving data');
    } else {
      console.log('success');
      res.send(result);
    }
  });
});

server.get('/getbranch_data', (req, res) => {
  db.query('SELECT * FROM gym_main.branchmaster ORDER BY branchid Desc', (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error retrieving data');
    } else {
      console.log('success');
      res.send(result);
    }
  });
});

server.get('/getdivison_data', (req, res) => {
  db.query('SELECT * FROM gym_main.divisionmaster ORDER BY divisionid Desc', (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error retrieving data');
    } else {
      console.log('success');
      res.send(result);
    }
  });
});

server.get('/getdepartment_data', (req, res) => {
  db.query('SELECT * FROM gym_main.departmentmaster ORDER BY departmentid DESC', (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error retrieving data');
    } else {
      console.log('success');
      res.send(result);
    }
  });
});

server.get('/getdesgination_data', (req, res) => {
  db.query('SELECT * FROM gym_main.designationmaster ORDER BY designationid DESC', (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error retrieving data');
    } else {
      console.log('success');
      res.send(result);
    }
  });
});

server.get('/getActiveEmployees', (req, res) => {
  const value = 'Active';
  db.query('SELECT * FROM gym_main.empoloyeemaster WHERE status = ? ORDER BY employeeid DESC', value, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error retrieving data');
    } else {
      console.log('success');
      res.send(result);
    }
  });
});


server.post('/searchEmployees', (req, res) => {
  const { employeename, employeecode, status } = req.body;
  const values = [status, employeecode, employeename];
  db.query('SELECT * FROM gym_main.empoloyeemaster WHERE status = ? AND (empoloyeecode = ? OR employeename = ?)', values, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error retrieving data');
    } else {
      console.log('success');
      res.send(result);
    }
  });
});

server.get('/EmployeeExportdata', (req, res) => {
  db.query('SELECT * FROM gym_main.empoloyeemaster', (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error retrieving data');
    } else {
      console.log('success');
      res.send(result);
    }
  });
});

server.get('/enquiry-datas', (req, res) => {
  db.query('SELECT row_number()over(order by Enquiryid desc) Sno,Enquiryid,CustomerName,Emailid,MobileNo,Remarks  FROM gym_main.enquiry', (err, result) => {
    if (err)
      throw err
    else {
      res.send(result)
    }
  })
})

server.get('/enquire-table-data', (req, res) => {
  const status = 'p';
  const responsid = '2'
  db.query(`SELECT row_number()over(order by Enquiryid desc) Sno,Enquiryid,CustomerName,Emailid,MobileNo,Remarks,AssignedUser FROM gym_main.enquiry where Status = '${status}' and Responseid = '${responsid}'`, (err, result) => {
    if (err)
      throw err
    else {
      res.send(result)
    }
  })
})

server.get('/select-traine-dropdown', (req, res) => {
  const responsid = 'TRAINEE';
  db.query(`SELECT empoloyeemaster.employeeid,employeename
  FROM empoloyeemaster
  JOIN designationmaster ON empoloyeemaster.designationid = designationmaster.designationid
  WHERE designationmaster.designationname = '${responsid}';`, (err, result) => {
    if (err)
      throw err
    else {
      res.send(result)
    }
  })
})


server.get("/select-typeofpack", (req, res) => {
  const status = 'a'
  const query = `SELECT row_number()over(order by packid desc) Sno,packid,TypeofPack,Amount,Gst FROM gym_main.packmaster where delstatus = '${status}'`
  db.query(query, (err, result) => {
    if (err)
      throw err
    else {
      res.send(result)
    }
  })

})


server.get('/search-employeecode-billing', (req, res) => {
  const value = req.query.value
  db.query(`SELECT empoloyeemaster.employeename,enquiry.MobileNo FROM gym_main.empoloyeemaster inner join enquiry on enquiry.CustomerName =  empoloyeemaster.employeename where empoloyeecode = '${value}' `, (err, result) => {
    if (err)
      throw err
    else {
      res.send(result)
      console.log(result);
    }

  })
})



server.get('/companyprofile', (req, res) => {
  const status = 'a'
  db.query(`SELECT row_number()over(order by Compinfoid desc) Sno,Compinfoid,Companyname,Address1,Address,Pincode,State,District,CompanyPhoto  FROM gym_main.companyprofileinfo where delstatus = '${status}'ORDER BY Compinfoid DESC LIMIT 1`, (err, result) => {
    if (err)
      throw err
    else {
      res.send(result)
    }
  })

})

server.get('/transcation_data', (req, res) => {
  const status = 'a'
  db.query(`SELECT row_number()over(order by transid desc) Sno,transid,Employeecode,CustomerName,MobileNo,TypeofPack,Amount,Discount,Gst,TotalAmount  FROM gym_main.transactionhistory where delstatus ='${status}'`, (err, result) => {
    if (err)
      throw err
    else {
      res.send(result)
    }
  })

})

server.get('/bill_printing_data', (req, res) => {
  const status = 'a';
  db.query(
    `SELECT row_number() over(order by transid desc) Sno,transid,Employeecode,CustomerName,MobileNo,TypeofPack,Amount,Discount,Gst,TotalAmount FROM gym_main.transactionhistory WHERE delstatus = '${status}' ORDER BY transid DESC LIMIT 1;`,
    (err, result) => {
      if (err) throw err;
      else {
        res.send(result);
      }
    }
  );
});


server.get('/total-amount', (req, res) => {
  db.query(`
    SELECT SUM(TotalAmount) AS TotalAmount
    FROM transactionhistory
    WHERE DATE_FORMAT(Createddate, '%d/%m/%Y') = DATE_FORMAT(NOW(), '%d/%m/%Y')
  `, (err, result) => {
    if (err) {
      throw err;
    } else {
      res.send(result);
    }
  });
});


// report query

server.get('/daily_monthly_report', (req, res) => {
  const { fromDate, toDate, mode, employeecode } = req.query;
  console.log(fromDate, toDate, mode, employeecode)
  db.query(`call daily_monthly_report ('${fromDate}','${toDate}','${mode}','${employeecode}')`, (err, result) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log(result);
      res.send(result[0])
    }
  })
});

server.get('/attendance_log_reports', (req, res) => {
  const { fromDate, toDate, mode, employeecode } = req.query;
  const formattedFromDate = formatDate(fromDate);
  const formattedToDate = toDate ? formatDate(toDate) : undefined;
  db.query(`call attendance_log_reports('${formattedFromDate}','${formattedToDate}','${mode}','${employeecode}')`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result[0]);
    }
  });
});

// Function to format date as DD-MM-YYYY
function formatDate(dateString) {
  const [year, month, day] = dateString.split('-');
  return `${day}-${month}-${year}`;
}

server.get('/sp_enquiryreport', (req, res) => {
  const { fromDate, toDate, mode } = req.query;
  const fromdateFormat = formatDate(fromDate)
  const todateFormat = formatDate(toDate)

  db.query(`call sp_enquiryreport ('${fromdateFormat}','${todateFormat}','${mode}')`, (err, result) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log(result);
      res.send(result[0])
    }
  })
});

server.get('/sp_Salesreport', (req, res) => {
  const { fromDate, toDate } = req.query;
  const fromdateFormat = formatDate(fromDate)
  const todateFormat = formatDate(toDate)
  db.query(`call sp_Salesreport('${fromdateFormat}','${todateFormat}')`, (err, result) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log(result);
      res.send(result[0])
    }
  })
});


// Insert Querys

server.post('/post', (req, res) => {
  const values = [
    req.body.company_name,
    req.body.status,
    req.body.createdby
  ];

  console.log('====================================');
  console.log(values);
  console.log('====================================');
  db.query(
    'INSERT INTO gym_main.companymaster(companyname,status,createdby) VALUES (?,?,?)', values, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error inserting data');
      } else {
        console.log(result);
        res.status(200).send('Data inserted successfully');
      }
    }
  );
});

server.post('/branch_post', (req, res) => {

  const values = [
    req.body.companyid,
    req.body.branchname,
    req.body.status,
    req.body.createdBy];

  db.query(
    'INSERT INTO gym_main.branchmaster(companyid,branchname,status,createdby) VALUES (?,?,?,?)',
    values,
    (err, result) => {
      if (err) {
        const errorMessage = `Error inserting data: ${err}`;
        console.log(errorMessage);
        const currentDate = new Date().toLocaleString();
        const logData = `${errorMessage}\n`;
        const date = `${currentDate}`
        db.query(
          'INSERT INTO gym_main.err_log(error_logs, date) VALUES (?, ?)',
          [logData, date],
          (error, Result) => {
            if (error) {
              console.error(error);
            }
          }
        );
        res.status(500).send('Error inserting data');
      } else {
        console.log(result);
        res.status(200).send('Data inserted successfully');
      }
    }
  );
});

server.post('/Divison_post', (req, res) => {

  const values = [
    req.body.Branchid,
    req.body.divisionname,
    req.body.status,
    req.body.createdBy
  ];

  db.query(
    'INSERT INTO gym_main.divisionmaster(branchid,divisionname,status,createdby) VALUES (?,?,?,?)',
    values,
    (err, result) => {
      if (err) {
        const errorMessage = `Error inserting data: ${err}`;
        console.log(errorMessage);
        const currentDate = new Date().toLocaleString();
        const logData = `${errorMessage}\n`;
        const date = `${currentDate}`
        db.query(
          'INSERT INTO gym_main.err_log(error_logs, date) VALUES (?, ?)',
          [logData, date],
          (error, Result) => {
            if (error) {
              console.error(error);
            }
          }
        );
        res.status(500).send('Error inserting data');
      } else {
        console.log(result);
        res.status(200).send('Data inserted successfully');
      }
    }
  );
});
server.post('/Department_post', (req, res) => {

  const values = [
    req.body.Divisonid,
    req.body.departmentname,
    req.body.status,
    req.body.createdBy
  ];

  db.query(
    'INSERT INTO gym_main.departmentmaster(divisionid,departmentname,status,createdby) VALUES (?,?,?,?)',
    values,
    (err, result) => {
      if (err) {
        const errorMessage = `Error inserting data: ${err}`;
        console.log(errorMessage);
        const currentDate = new Date().toLocaleString();
        const logData = `${errorMessage}\n`;
        const date = `${currentDate}`
        db.query(
          'INSERT INTO gym_main.err_log(error_logs, date) VALUES (?, ?)',
          [logData, date],
          (error, Result) => {
            if (error) {
              console.error(error);
            }
          }
        );
        res.status(500).send('Error inserting data');
      } else {
        console.log(result);
        res.status(200).send('Data inserted successfully');
      }
    }
  );
});

server.post('/Desgination_post', (req, res) => {

  const values = [
    req.body.departmentid,
    req.body.designationname,
    req.body.status,
    req.body.createdBy];

  db.query(
    'INSERT INTO gym_main.designationmaster(departmentid,designationname,status,createdby) VALUES (?,?,?,?)',
    values,
    (err, result) => {
      if (err) {
        const errorMessage = `Error inserting data: ${err}`;
        const currentDate = new Date().toLocaleString();
        const logData = `${errorMessage}\n`;
        const date = `${currentDate}`
        db.query(
          'INSERT INTO gym_main.err_log(error_logs, date) VALUES (?, ?)',
          [logData, date],
          (error, Result) => {
            if (error) {
              console.error(error);
            }
          }
        );
        res.status(500).send('Error inserting data');
      } else {
        console.log(result);
        res.status(200).send('Data inserted successfully');
      }
    }
  );
});

server.post('/employee_post', (req, res) => {

  const values = [
    req.body.empolyeecode,
    req.body.empolyeename,
    req.body.dateofbirth,
    req.body.dateofjoin,
    req.body.referenceno,
    req.body.status,
    req.body.companyid,
    req.body.branchid,
    req.body.divisonid,
    req.body.departmentid,
    req.body.designationid,
    req.body.createdBy,
    req.body.images,
    req.body.mobileno,
    req.body.email,
  ];

  db.query(
    'INSERT INTO gym_main.empoloyeemaster(empoloyeecode, employeename, dateofbirth, dateofjoining, referenceno, status, companyid, branchid, divisionid, departmentid, designationid,createdby,photo,mobileno,email) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    values,
    (err, result) => {
      if (err) {
        const errorMessage = `Error inserting data: ${err}`;
        console.log(errorMessage);
        const currentDate = new Date().toLocaleString();
        const logData = `${errorMessage}\n`;
        const date = `${currentDate}`
        db.query(
          'INSERT INTO gym_main.err_log(error_logs, date) VALUES (?, ?)',
          [logData, date],
          (error, Result) => {
            if (error) {
              console.error(error);
            }
          }
        );
        console.log(err);
        res.status(500).send('Error inserting data');
      } else {
        console.log(result);
        res.status(200).send('Data inserted successfully');
      }
    }
  );
});



server.post('/enquiry_insert', (req, res) => {
  const status = 'P';
  const responseid = '2';
  const values = [req.body.username, req.body.email, req.body.phoneno, req.body.remarks, req.body.createdby, status, responseid]

  db.query('INSERT INTO gym_main.enquiry (CustomerName,Emailid,MobileNo,Remarks,Createdby,Status ,Responseid) VALUES(?,?,?,?,?,?,?)',
    values, (err, result) => {
      if (err) {
        const errorMessage = `Error inserting data: ${err}`;
        const currentDate = new Date().toLocaleString();
        const logData = `${errorMessage}\n`;
        const date = `${currentDate}`
        db.query(
          'INSERT INTO gym_main.err_log(error_logs, date) VALUES (?, ?)',
          [logData, date],
          (error, Result) => {
            if (error) {
              console.error(error);
            }
          }
        );
        res.status(500).send('Error inserting data');
      }
      else {
        console.log(result);
        res.send(result)
      }
    })
})



server.post('/typeofpack_insert', (req, res) => {
  const { value, amount, gst, createdBy } = req.body;
  const status = 'a'
  const query = `INSERT INTO gym_main.packmaster (TypeofPack, Amount, Gst, Createdby, delstatus) 
  VALUES ('${value}', '${amount}', '${gst}', '${createdBy}','${status}')`;
  db.query(query, (err, result) => {
    if (err) {
      const errorMessage = `Error inserting data: ${err}`;
      const currentDate = new Date().toLocaleString();
      const logData = `${errorMessage}\n`;
      const date = `${currentDate}`
      db.query(
        'INSERT INTO gym_main.err_log(error_logs, date) VALUES (?, ?)',
        [logData, date],
        (error, Result) => {
          if (error) {
            console.error(error);
          }
        }
      );
      res.status(500).send('Error inserting data');
    } else {
      res.send(result);
      console.log(result)
    }
  });
});

server.post('/transaction_insert', (req, res) => {

  const status = 'a'
  const { Employeecode, CustomerName, MobileNo, TypeofPack, Amount, Discount, Gst, TotalAmount, createdBy, Validityfrom, Validityto } = req.body
  const query = `INSERT INTO gym_main.transactionhistory(Employeecode,CustomerName,MobileNo,TypeofPack,Amount,Discount,Gst,TotalAmount,Createdby,Validityfrom,Validityto,delstatus) 
  VALUES('${Employeecode}','${CustomerName}','${MobileNo}','${TypeofPack}','${Amount}','${Discount}','${Gst}',
  '${TotalAmount}','${createdBy}','${Validityfrom}','${Validityto}','${status}')`

  db.query(query, (err, result) => {
    if (err)
      throw err
    else {
      res.send(result)
    }
  })

})

server.post('/CompanyProfile_post', (req, res) => {

  const status = 'a'
  const { Companyname, Address1, Address, Pincode, State, District, CompanyPhoto, createdBy } = req.body

  const query = `INSERT INTO gym_main.companyprofileinfo(Companyname,Address1,Address,Pincode,State,District,CompanyPhoto,Createdby,delstatus) VALUES('${Companyname}','${Address1}','${Address}','${Pincode}','${State}','${District}','${CompanyPhoto}','${createdBy}','${status}')`

  db.query(query, (err, result) => {
    if (err)
      throw err
    else {
      res.send(result)
    }
  })



})


// Updates Querys

server.put('/updatecompanydata/:id', (req, res) => {
  const id = req.params.id
  const date = new Date().toLocaleString();
  const { company_name, status, createdBy } = req.body
  db.query('UPDATE gym_main.companymaster SET companyname = ? , status = ? , updatedate = ?, createdby = ? where companyid = ?',
    [company_name, status, date, createdBy, id], (err, result) => {
      if (err) throw err;
      else {
        console.log(result);
        res.send(result)
      }
    })
})

server.put('/updatebranchdata/:id', (req, res) => {
  const id = req.params.id
  const date = new Date().toLocaleString();
  const { branch_name, status, companyid, createdBy } = req.body
  db.query('UPDATE gym_main.branchmaster SET companyid = ?, branchname = ? , status = ? , updatedate = ? ,createdby = ? where branchid = ?',
    [companyid, branch_name, status, date, createdBy, id], (err, result) => {
      if (err) throw err;
      else {
        console.log(result);
        res.send(result)
      }
    })
})

server.put('/updatedivisondata/:id', (req, res) => {
  const id = req.params.id
  const date = new Date().toLocaleString();
  const { divisionname, status, branchid, createdBy } = req.body
  db.query('UPDATE gym_main.divisionmaster SET branchid = ?, divisionname = ? , status = ? , updatedate = ?, createdby = ? where divisionid = ?',
    [branchid, divisionname, status, date, createdBy, id], (err, result) => {
      if (err) throw err;
      else {
        console.log(result);
        res.send(result)
      }
    })
})


server.put('/updatedepartmentdata/:id', (req, res) => {
  const id = req.params.id
  const date = new Date().toLocaleString();
  const { departmentname, status, divisionid, createdBy } = req.body
  db.query('UPDATE gym_main.departmentmaster SET divisionid = ?, departmentname = ? , status = ? , updatedate = ? , createdby = ? where departmentid = ?',
    [divisionid, departmentname, status, date, createdBy, id], (err, result) => {
      if (err) throw err;
      else {
        console.log(result);
        res.send(result)
      }
    })
})

server.put('/updatedesginationdata/:id', (req, res) => {
  const id = req.params.id
  const date = new Date().toLocaleString();
  const { designationname, status, departmentid, createdBy } = req.body
  db.query('UPDATE gym_main.designationmaster SET departmentid = ?, designationname = ?, status = ?, updatedate = ?, createdby = ? WHERE designationid = ?', [departmentid, designationname, status, date, createdBy, id], (err, result) => {
    if (err) {
      const errorMessage = `Error inserting data: ${err}`;
      console.log(errorMessage);
      const currentDate = new Date().toLocaleString();
      const logData = `${errorMessage}\n`;
      const date = `${currentDate}`
      db.query(
        'INSERT INTO gym_main.err_log(error_logs, date) VALUES (?, ?)',
        [logData, date],
        (error, Result) => {
          if (error) {
            console.error(error);
          }
        }
      );
      res.status(500).send('Error inserting data');
    }
    else {
      console.log(result);
      res.send(result)
    }
  })
})


server.put('/updateemployeedata/:id', (req, res) => {
  const id = req.params.id;
  const {
    employeecode,
    employeename,
    dateofbirth,
    dateofjoin,
    referenceno,
    status,
    companyid,
    branchid,
    divisonid,
    departmentid,
    designationid,
    createdBy,
    images,
    mobileno,
    email
  } = req.body;


  let updateQuery = `UPDATE gym_main.empoloyeemaster SET empoloyeecode = '${employeecode}',employeename = '${employeename}',dateofbirth = '${dateofbirth}',dateofjoining = '${dateofjoin}',
referenceno = '${referenceno}',status = '${status}',companyid = '${companyid}',branchid = ${branchid},divisionid = ${divisonid},departmentid = ${departmentid},designationid = ${designationid},createdby = '${createdBy}',mobileno = '${mobileno}',email = '${email}'`;

  if (images !== undefined && images !== null && images !== '') {
    updateQuery += `, photo = '${images}'`;
  }
  updateQuery += ` WHERE employeeid = ${id}`;

  db.query(updateQuery, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error updating data');
    } else {
      console.log(result);
      res.send(result);
    }
  });
});



server.put('/updateenquirydata/:id', (req, res) => {
  const id = req.params.id
  const { username, email, phoneno, remarks, createdBy } = req.body
  db.query('UPDATE gym_main.enquiry SET CustomerName = ?, Emailid = ?, MobileNo = ?, Remarks = ?, createdby = ? WHERE Enquiryid = ?', [username, email, phoneno, remarks, createdBy, id], (err, result) => {
    if (err) {
      const errorMessage = `Error inserting data: ${err}`;
      console.log(errorMessage);
      const currentDate = new Date().toLocaleString();
      const logData = `${errorMessage}\n`;
      const date = `${currentDate}`
      db.query(
        'INSERT INTO gym_main.err_log(error_logs, date) VALUES (?, ?)',
        [logData, date],
        (error, Result) => {
          if (error) {
            console.error(error);
          }
        }
      );
      res.status(500).send('Error inserting data');
    }
    else {
      console.log(result);
      res.send(result)
    }
  })
})


server.put('/enquire-assign/:id', (req, res) => {
  const id = req.params.id;
  const { createdBy, assignvale } = req.body;
  const values = [
    req.body.empolyeecode,
    req.body.empolyeename,
    req.body.dateofbirth,
    req.body.dateofjoin,
    req.body.referenceno,
    req.body.status,
    req.body.companyid,
    req.body.branchid,
    req.body.divisonid,
    req.body.departmentid,
    req.body.designationid,
    req.body.createdBy,
    req.body.images,
    req.body.mobileno,
    req.body.email
  ];

  db.beginTransaction((err) => {
    if (err) {
      handleDatabaseError(err, res, 'Error starting transaction');
      return;
    }

    const updateQuery = `
      UPDATE gym_main.enquiry 
      SET Createdby = ?, AssignedUser = ? 
      WHERE Enquiryid = ?`;

    db.query(updateQuery, [createdBy, assignvale, id], (updateErr, updateResult) => {
      if (updateErr) {
        handleRollbackAndError(updateErr, res, 'Error updating enquiry');
        return;
      }

      const insertQuery = `
        INSERT INTO gym_main.empoloyeemaster (
          empoloyeecode, employeename, dateofbirth, dateofjoining, 
          referenceno, status, companyid, branchid, divisionid, 
          departmentid, designationid, createdby, photo,mobileno,email) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)`;

      db.query(insertQuery, values, (insertErr, insertResult) => {
        if (insertErr) {
          handleRollbackAndError(insertErr, res, 'Error inserting into empoloyeemaster');
          return;
        }

        db.commit((commitErr) => {
          if (commitErr) {
            handleRollbackAndError(commitErr, res, 'Error committing transaction');
            return;
          }

          console.log('Transaction completed.');
          res.send({ enquiryUpdate: updateResult, empoloyeemasterInsert: insertResult });
        });
      });
    });
  });
});

function handleRollbackAndError(error, res, errorMessage) {
  db.rollback(() => {
    const currentDate = new Date().toLocaleString();
    const logData = `${errorMessage}: ${error}\n`;
    db.query(
      'INSERT INTO gym_main.err_log(error_logs, date) VALUES (?, ?)',
      [logData, currentDate],
      (logError) => {
        if (logError) {
          console.error(logError);
        }
        res.status(500).send(errorMessage);
      }
    );
  });
}

function handleDatabaseError(err, res, errorMessage) {
  const currentDate = new Date().toLocaleString();
  const logData = `${errorMessage}: ${err}\n`;
  db.query(
    'INSERT INTO gym_main.err_log(error_logs, date) VALUES (?, ?)',
    [logData, currentDate],
    (error, Result) => {
      if (error) {
        console.error(error);
      }
      res.status(500).send(errorMessage);
    }
  );
}

server.post('/updatefollowuppage', async (req, res) => {
  const { id, name, phoneno, datetime, remarks, mode } = req.body;
  try {
    if (!datetime || datetime === '') {
      const value = {
        Status: "c",
        Responseid: "1"
      };

      await db.query(`UPDATE gym_main.enquiry SET Status = '${value.Status}', Responseid = '${value.Responseid}' WHERE Enquiryid = ${id}`, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Error updating enquiry' });
        } else {
          console.log(result);
          res.status(200).json({ message: 'Enquiry updated' });
        }
      });
    } else {
      const value = {
        Status: "P",
        Responseid: "2"
      };

      await db.query(`UPDATE gym_main.enquiry SET Status = '${value.Status}', Responseid = '${value.Responseid}' WHERE Enquiryid = ${id}`, async (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Error updating enquiry' });
        } else {
          try {
            await db.query(`INSERT INTO gym_main.courtesycallhistory (CustomerName, MobileNo, CallStatus, Status, Responseid, Callbackdatetime, Remarks) VALUES ('${name}', '${phoneno}', '${mode}', '${value.Status}', '${value.Responseid}', '${datetime}', '${remarks}')`);
            res.status(200).json({ message: 'Enquiry updated and inserted into courtesy call history' });
          } catch (insertErr) {
            console.error(insertErr);
            res.status(500).json({ error: 'Error inserting into courtesy call history' });
          }
        }
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while processing the request' });
  }
});



server.put('/typeofpack_update/:id', (req, res) => {
  const id = req.params.id
  const { count, amount, gst, createdBy } = req.body
  db.query('UPDATE gym_main.packmaster SET TypeofPack = ?, Amount = ?, Gst = ?, createdby = ? WHERE packid = ?', [count, amount, gst, createdBy, id], (err, result) => {
    if (err) {
      const errorMessage = `Error inserting data: ${err}`;
      console.log(errorMessage);
      const currentDate = new Date().toLocaleString();
      const logData = `${errorMessage}\n`;
      const date = `${currentDate}`
      db.query(
        'INSERT INTO gym_main.err_log(error_logs, date) VALUES (?, ?)',
        [logData, date],
        (error, Result) => {
          if (error) {
            console.error(error);
          }
        }
      );
      res.status(500).send('Error inserting data');
    }
    else {
      console.log(result);
      res.send(result)
    }
  })
})


server.put('/updatecompanyprofile/:id', (req, res) => {
  const id = req.params.id;
  const { Companyname, Address1, Address, Pincode, State, District, CompanyPhoto, createdBy } = req.body;

  let updateQuery = `UPDATE gym_main.companyprofileinfo SET Companyname = '${Companyname}',Address1 = '${Address1}',
  Address = '${Address}',Pincode = '${Pincode}',State = '${State}',District = '${District}',Createdby = '${createdBy}'`;
  // Check if CompanyPhoto is not empty, then include it in the update query
  if (CompanyPhoto !== undefined && CompanyPhoto !== null && CompanyPhoto !== '') {
    updateQuery += `, CompanyPhoto = '${CompanyPhoto}'`;
  }

  updateQuery += ` WHERE Compinfoid = ${id}`;

  db.query(updateQuery, (err, result) => {
    if (err) {
      const errorMessage = `Error updating data: ${err}`;
      console.log(errorMessage);
      const currentDate = new Date().toLocaleString();
      const logData = `${errorMessage}\n`;
      const date = `${currentDate}`;
      db.query(
        'INSERT INTO gym_main.err_log(error_logs, date) VALUES (?, ?)',
        [logData, date],
        (error, Result) => {
          if (error) {
            console.error(error);
          }
        }
      );
      res.status(500).send('Error updating data');
    } else {
      console.log(result);
      res.send(result);
    }
  });
});



// Delete Querys

server.delete('/delete_companymaster', (req, res) => {
  const id = req.body.id
  const createdBy = req.body.createdBy
  const value = "InActive"
  db.query('UPDATE gym_main.companymaster SET Status = ? , createdby = ? where companyid = ?', [value, createdBy, id], (err, response) => {
    if (err) throw err
    else {
      console.log(response);
      res.send(response)
    }
  })
})
server.delete('/delete_branchmaster', (req, res) => {
  const id = req.body.id
  const value = "InActive"
  db.query('UPDATE gym_main.branchmaster SET Status = ? where branchid = ?', [value, id], (err, response) => {
    if (err) throw err
    else {
      console.log(response);
      res.send(response)
    }
  })
})
server.delete('/delete_divisonmaster', (req, res) => {
  const id = req.body.id
  const value = "InActive"
  db.query('UPDATE gym_main.divisionmaster SET status = ? where divisionid = ?', [value, id], (err, response) => {
    if (err) throw err
    else {
      console.log(response);
      res.send(response)
    }
  })
})

server.delete('/delete_departmentnmaster', (req, res) => {
  const id = req.body.id
  const value = "InActive"
  db.query('UPDATE gym_main.departmentmaster SET status = ? where departmentid = ?', [value, id], (err, response) => {
    if (err) throw err
    else {
      console.log(response);
      res.send(response)
    }
  })
})
server.delete('/delete_designationmaster', (req, res) => {
  const id = req.body.id
  const value = "InActive"
  db.query('UPDATE gym_main.designationmaster SET status = ? where designationid = ?', [value, id], (err, response) => {
    if (err) throw err
    else {
      console.log(response);
      res.send(response)
    }
  })
})

server.delete('/delete_employeemaster', (req, res) => {
  const id = req.body.id
  const value = "InActive"
  db.query('UPDATE gym_main.empoloyeemaster SET status = ? where employeeid = ?', [value, id], (err, response) => {
    if (err) throw err
    else {
      console.log(response);
      res.send(response)
    }
  })
})

server.delete('/delete_packmaster', (req, res) => {
  const id = req.body.id
  const value = "i"
  db.query('UPDATE gym_main.packmaster SET delstatus = ? where packid = ?', [value, id], (err, response) => {
    if (err) throw err
    else {
      console.log(response);
      res.send(response)
    }
  })
})


server.delete('/delete_companyprofile', (req, res) => {
  const id = req.body.id
  const value = "i"
  db.query('UPDATE gym_main.companyprofileinfo SET delstatus = ? where Compinfoid = ?', [value, id], (err, response) => {
    if (err) throw err
    else {
      console.log(response);
      res.send(response)
    }
  })
})

// Edit Querys

server.get('/editcompany_data/:id', (req, res) => {
  const id = req.params.id
  db.query('SELECT * FROM gym_main.companymaster where companyid  = ?', id, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error retrieving data');
    } else {
      console.log('success');
      res.send(result);
    }
  });
});

server.get('/editbranch_data/:id', (req, res) => {
  const id = req.params.id
  db.query('SELECT * FROM gym_main.branchmaster where branchid  = ?', id, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error retrieving data');
    } else {
      console.log('success');
      res.send(result);
    }
  });
});

server.get('/editdivison_data/:id', (req, res) => {
  const id = req.params.id
  db.query('SELECT * FROM gym_main.divisionmaster where divisionid  = ?', id, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error retrieving data');
    } else {
      console.log('success');
      res.send(result);
    }
  });
});

server.get('/editdepartment_data/:id', (req, res) => {
  const id = req.params.id
  db.query('SELECT * FROM gym_main.departmentmaster where departmentid  = ?', id, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error retrieving data');
    } else {
      console.log('success');
      res.send(result);
    }
  });
});

server.get('/editdesignation_data/:id', (req, res) => {
  const id = req.params.id
  db.query('SELECT * FROM gym_main.designationmaster where designationid  = ?', id, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error retrieving data');
    } else {
      console.log('success');
      res.send(result);
    }
  });
});

server.get('/editemployee_data/:id', (req, res) => {
  const id = req.params.id
  db.query('SELECT * FROM gym_main.empoloyeemaster where employeeid  = ?', id, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error retrieving data');
    } else {
      console.log('success');
      res.send(result);
    }
  });
});

server.get('/editenquiry_data/:id', (req, res) => {
  const id = req.params.id
  db.query('SELECT * FROM gym_main.enquiry where Enquiryid  = ?', id, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error retrieving data');
    } else {
      console.log('success');
      res.send(result);
    }
  });
});

server.get('/edittypeofpack_data/:id', (req, res) => {
  const id = req.params.id
  db.query('SELECT * FROM gym_main.packmaster where packid  = ?', id, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error retrieving data');
    } else {
      console.log('success');
      res.send(result);
    }
  });
})

server.get('/editcompanyprofile_data/:id', (req, res) => {
  const id = req.params.id
  db.query('SELECT * FROM gym_main.companyprofileinfo where Compinfoid  = ?', id, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error retrieving data');
    } else {
      console.log('success');
      res.send(result);
    }
  });
});

// DropDown Quers

server.get('/drop-down', (req, res) => {
  db.query('SELECT * FROM gym_main.companymaster;', (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error retrieving data');
    } else {
      console.log('success');
      res.send(result);
    }
  });
});
server.get('/drop-down-branch', (req, res) => {
  db.query('SELECT * FROM gym_main.branchmaster;', (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error retrieving data');
    } else {
      console.log('success');
      res.send(result);
    }
  });
});

server.get('/drop-down-divison', (req, res) => {
  db.query('SELECT * FROM gym_main.divisionmaster;', (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error retrieving data');
    } else {
      console.log('success');
      res.send(result);
    }
  });
});

server.get('/drop-down-department', (req, res) => {
  db.query('SELECT * FROM gym_main.departmentmaster;', (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error retrieving data');
    } else {
      console.log('success');
      res.send(result);
    }
  });
});

server.get('/drop-down-designation', (req, res) => {
  db.query('SELECT * FROM gym_main.designationmaster;', (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error retrieving data');
    } else {
      console.log('success');
      res.send(result);
    }
  });
});

server.get('/drop-down-branchid/:value', (req, res) => {
  const id = req.params.value;
  const value = 'Active'
  db.query('SELECT branchname,branchid FROM gym_main.branchmaster WHERE companyid = ? and status = ?', [id, value], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error retrieving data');
    } else {
      console.log('success');
      res.send(result);
    }
  });
});

server.get('/drop-down-divisonid/:value', (req, res) => {
  const id = req.params.value;
  const value = 'Active'
  db.query('SELECT divisionname,divisionid FROM gym_main.divisionmaster where branchid = ? and status = ?', [id, value], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error retrieving data');
    } else {
      console.log('success');
      res.send(result);
    }
  });
});
server.get('/drop-down-departmentid/:value', (req, res) => {
  const id = req.params.value;
  const value = 'Active'
  db.query('SELECT departmentname,departmentid FROM gym_main.departmentmaster where divisionid = ? and status = ?', [id, value], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error retrieving data');
    } else {
      console.log('success');
      res.send(result);
    }
  });
});

server.get('/drop-down-designation/:value', (req, res) => {
  const id = req.params.value;
  const value = 'Active'
  db.query('SELECT designationname,designationid FROM gym_main.designationmaster where departmentid = ? and status = ?', [id, value], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error retrieving data');
    } else {
      console.log('success');
      res.send(result);
    }
  });
});

// Upload data from front to backend


server.post('/upload-data', upload.single('file'), async (req, res) => {
  const createdBy = req.body.createdBy;

  try {
    await new Promise((resolve, reject) => {
      db.query(`TRUNCATE TABLE gym_main.importdatatemp`, (truncateErr, truncateResult) => {
        if (truncateErr) {
          reject(truncateErr);
        } else {
          resolve(truncateResult);
        }
      });
    });

    if (!req.file) {
      return res.status(400).send('No files were uploaded.');
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const excelData = XLSX.utils.sheet_to_json(worksheet);

    const totalFiles = excelData.length; // Total number of files to be uploaded
    let uploadedCount = 0;

    const insertQueries = [];
    const selectPromises = [];

    excelData.forEach((data, index) => {

      const {
        empoloyeecode,
        employeename,
        dateofbirth,
        dateofjoining,
        referenceno,
        status,
        companyname,
        branchname,
        divisionname,
        departmentname,
        designationname,
        createdate,
      } = data;

      const convertExcelDateToJSDate = (excelSerialDate) => {
        const baseDate = new Date('1900-01-01');

        const millisecondsPerDay = 24 * 60 * 60 * 1000;

        const daysOffset = excelSerialDate - 1;

        const totalMilliseconds = daysOffset * millisecondsPerDay;

        const resultDate = new Date(baseDate.getTime() + totalMilliseconds);

        resultDate.setHours(0, 0, 0, 0);

        return resultDate;
      };

      const originalDateOfBirth = convertExcelDateToJSDate(dateofbirth).toISOString().split('T')[0]
      const originalDateOfJoining = convertExcelDateToJSDate(dateofjoining).toISOString().split('T')[0]


      const trimString = (value) => {
        return typeof value === 'string' ? value.trim() : value;
      };

      const trimmedEmpoloyeecode = trimString(empoloyeecode);
      const trimmedEmployeename = trimString(employeename);

      const query = `INSERT INTO gym_main.importdatatemp(empoloyeecode, employeename, dateofbirth, dateofjoining, referenceno, status, companyid, branchid, divisionid, departmentid, designationid, createdby, createdate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const queryParams = [
        trimmedEmpoloyeecode,
        trimmedEmployeename,
        originalDateOfBirth,
        originalDateOfJoining,
        trimString(referenceno),
        trimString(status),
        trimString(companyname),
        trimString(branchname),
        trimString(divisionname),
        trimString(departmentname),
        trimString(designationname),
        createdBy,
        trimString(createdate),
      ];

      insertQueries.push({ query, queryParams });

      const selectPromise = new Promise((resolve, reject) => {
        db.query(
          `SELECT 
            cm.companyid, bm.branchid, dm.divisionid, dem.departmentid, desm.designationid 
          FROM 
            gym_main.companymaster cm 
            JOIN gym_main.branchmaster bm ON cm.companyid = bm.companyid 
            JOIN gym_main.divisionmaster dm ON bm.branchid = dm.branchid 
            JOIN gym_main.departmentmaster dem ON dm.divisionid = dem.divisionid 
            JOIN gym_main.designationmaster desm ON dem.departmentid = desm.departmentid 
          WHERE 
            cm.companyname = ? 
            AND bm.branchname = ? 
            AND dm.divisionname = ? 
            AND dem.departmentname = ? 
            AND desm.designationname = ?`,
          [companyname, branchname, divisionname, departmentname, designationname],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              const [ids] = result;
              const {
                companyid,
                branchid,
                divisionid,
                departmentid,
                designationid
              } = ids;

              const bulkInsertQuery = `INSERT INTO gym_main.empoloyeemaster (empoloyeecode, employeename, dateofbirth, dateofjoining, referenceno, status, companyid, branchid, divisionid, departmentid, designationid, createdate, createdby, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

              const bulkInsertParams = [
                trimmedEmpoloyeecode,
                trimmedEmployeename,
                dateofbirth,
                dateofjoining,
                trimString(referenceno),
                trimString(status),
                companyid,
                branchid,
                divisionid,
                departmentid,
                designationid,
                createdate,
                createdBy,
                getDefaultImageBase64()
              ];

              db.query(bulkInsertQuery, bulkInsertParams, (insertErr, insertResult) => {
                if (insertErr) {
                  reject(insertErr);
                } else {
                  console.log(`Uploaded file ${index + 1} of ${totalFiles}`);
                  resolve(insertResult, uploadedCount++);
                  uploadedCount++;
                  count = `Uploaded file ${index + 1} of ${totalFiles}`
                }
              });
            }
          }
        );
      });
      selectPromises.push(selectPromise);
    });

    const selectResults = await Promise.all(selectPromises);

    const insertPromises = insertQueries.map(({ query, queryParams }) => {
      return new Promise((resolve, reject) => {
        db.query(query, queryParams, (error, results) => {
          if (error) {
            reject(error);
          } else {
            console.log("Uploaded data successfully");
            resolve(results);
          }
        });
      });
    });

    const insertResults = await Promise.all(insertPromises);
    const successfulUploads = insertResults.length;
    console.log(totalFiles)

    res.json({
      message: 'File uploaded and data stored successfully',
      successfulUploads: successfulUploads
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading or fetching data');
  }

});

let count = 0;

server.get('/upload-data-progress', (req, res) => {
  res.json({ progress: count });
})

server.listen(3002, () => {
  console.log("server is connected 3002");
})
