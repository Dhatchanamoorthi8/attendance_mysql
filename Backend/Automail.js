const { jsPDF } = require('jspdf');
const { autotable } = require('jspdf-autotable');
const { encode } = require('base64-arraybuffer');
const axios = require('axios');


function Automail(user) {
  // Fetch data and call generateAndPostPdf function
  fetchdata()
    .then((fetchedData) => {
      // console.log(fetchedData, "fetchedData");
      
      const systemTime = new Date();
      const defaultTime = '09:37:0';
      const hours = systemTime.getHours();
      const minutes = systemTime.getMinutes();
      const seconds = systemTime.getSeconds();

      const [targetHours, targetMinutes, targetSeconds] = defaultTime.split(':').map(Number);

      if (targetHours === hours && targetMinutes === minutes && targetSeconds === seconds) {

        let ifValue = 1   /// flag value for if condition check 
        if (1 === ifValue) {
          console.log("Successfuly  call automail");
          generateAndPostPdf(fetchedData);
        }
        else{
          console.log("generateAndPostPdf(fetchedData): This funcation not called");
        }
      } else {
          console.log("if condition not met");
      }
    })
    .catch((error) => console.error('Error fetching data:', error));

}

function generateAndPostPdf(data) {
  if (!Array.isArray(data)) {
    console.error('Invalid data format. Expected an array.');
    return;
  }

  const pdf = new jsPDF();
  pdf.text("Billing Details", 20, 10);
  pdf.autoTable({
    head: [
      ['Sno', 'Employee Code', 'Type of Pack', 'Amount', 'Discount', 'GST', 'Total Amount']
    ],
    body: data.map(item => [
      item.Sno,
      item.Employeecode,
      item.TypeofPack,
      item.Amount,
      item.Discount,
      `${item.Gst} %`,
      item.TotalAmount
    ]),
    startY: 20,
  });

  const pdfArrayBuffer = pdf.output('arraybuffer');
  const pdfUint8Array = new Uint8Array(pdfArrayBuffer);
  const pdfBase64 = encode(pdfUint8Array);
  try {
    const response = axios.post(`http://localhost:3002/auto-mail-report`, {
      pdf: pdfBase64
    });
    console.log(response.data, "automail send response");
  }
  catch (error) {
    console.error('Error:', error);
  }
}

function fetchdata() {
  return new Promise((resolve, reject) => {
    fetch('http://localhost:3002/transcation_data')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Network response was not ok: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}


module.exports = Automail;
