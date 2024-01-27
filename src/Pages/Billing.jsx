import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import PrintTemplate from './PrintTemplate'


const Billing = () => {

  const apiUrl = process.env.REACT_APP_API_BASE_URL

  console.log(apiUrl);



  const [useridforcratedby, setuseridforcratedby] = useState({})
  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem('userData'));   // local storage datas 
    if (storedUserData && storedUserData.userid) {
      setuseridforcratedby(storedUserData)
    }
    else {
      setuseridforcratedby({ message: "empty" })
    }
  }, [])
  const createdBy = useridforcratedby.userid || useridforcratedby.message;       // set createdby user


  // Database Insert set datas

  const [Insertdata, SetInsertdata] = useState({
    Employeecode: '',
    CustomerName: '',
    MobileNo: '',
    Discount: '',
    TypeofPack: '',
    Amount: '',
    Gst: 0,
    TotalAmount: '',
    Validityfrom: '',
    Validityto: ''
  })


  //  Withs Gst Calculation

  const [Amountvalues, SetAmountValues] = useState({
    amount: 0,
    gst: 0
  });

  const [TemporyAmt, SetTemporyAmt] = useState(0)

  const [GstActualAmount, SetGstActualAmount] = useState(0);

  const [TotalAmountWithGst, SetTotalAmountWithGst] = useState(0);

  const [TotalGstValue, SetTotalGstValue] = useState(0);

  const hanletypeofpackchange = (e) => {
    const value = e.target.value;
    const valuesObject = value.split(" ").reduce((acc, item) => {
      const [key, val] = item.split(':');
      acc[key] = !isNaN(val) ? parseFloat(val) : val;
      return acc;
    }, {});

    const { packtype, amount, gst } = valuesObject;

    console.log(packtype);


    SetAmountValues(prevValues => ({ ...prevValues, amount: parseFloat(amount) || 0, gst: parseFloat(gst) || 0 }));
    SetInsertdata(prevValues => ({ ...prevValues, TypeofPack: packtype }))
    SetTemporyAmt(parseFloat(amount))
  };



  const handleWithGstdiscount = (e) => {
    const discountValue = parseFloat(e.target.value);
    SetInsertdata((prevValues) => ({ ...prevValues, Discount: discountValue }));

    if (!isNaN(discountValue)) {
      const totalValueAfterDiscount = Amountvalues.amount - discountValue;
      if (discountValue === 0 || discountValue === " ") {
        SetAmountValues((prevValues) => ({ ...prevValues, amount: TemporyAmt }));
      } else {
        SetAmountValues((prevValues) => ({ ...prevValues, amount: totalValueAfterDiscount }));
      }
    } else {
      SetAmountValues((prevValues) => ({ ...prevValues, amount: TemporyAmt }));
    }
  };


  const WithGst_totalamt = () => {
    const actualAmount = Amountvalues.amount;
    const gstAmount = Amountvalues.gst;
    const gstcaluclation = actualAmount * gstAmount / 100

    const totalAmount = gstcaluclation + actualAmount

    SetTotalGstValue(gstcaluclation)

    SetTotalAmountWithGst(totalAmount);

    SetGstActualAmount(gstAmount);

    SetInsertdata((prevValues) => ({ ...prevValues, Gst: gstAmount, Amount: actualAmount, TotalAmount: totalAmount, }));
  };

  useEffect(() => {
    WithGst_totalamt();
  }, [Amountvalues.amount, Amountvalues.gst]);


  //  Withs Gst Calculation End

  const [loader, setloader] = useState(false)

  const [SelectGst, SetSelectGst] = useState('')

  const [employeedatas, setemployeedatas] = useState([])

  const handlesearchemployee = (e) => {
    const value = e.target.value.trim();
    SetInsertdata({ ...Insertdata, Employeecode: value });
    axios.get(`${apiUrl}/search-employeecode-billing?value=${value}`)
      .then((res) => {
        console.log(res.data);
        if (res.data && res.data.length > 0) {
          const firstEmployee = res.data[0];
          SetInsertdata((prevValues) => ({
            ...prevValues, CustomerName: firstEmployee.employeename || '',
            MobileNo: firstEmployee.MobileNo || ''
          }));
          setemployeedatas(firstEmployee);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };


  const [typeofpack, settypeofpack] = useState([])
  const dropdowntypeofpack = () => {
    axios.get(`${apiUrl}/select-typeofpack`)
      .then((res) => {
        console.log(res.data);
        settypeofpack(res.data || [])
      })
      .catch((err) => {
        console.log(err);
      })
  }


  // With out Gst Calculations
  const [NullGstActualAmount, SetNullGstActualAmount] = useState(0)

  const [TotalAmountWithoutGst, SetTotalAmountWithoutGst] = useState(0)

  const [DiscountAmountWithoutGst, SetDiscountAmountWithoutGst] = useState(0)

  const handlewithoutGstActualamount = (e) => {
    const value = e.target.value
    SetNullGstActualAmount(value)
    SetTotalAmountWithoutGst(value)
    SetInsertdata({ ...Insertdata, Amount: value })
  }

  const handlewithoutGstDiscount = (e) => {
    const value = e.target.value

    SetDiscountAmountWithoutGst(value)

    SetInsertdata((prevValues) => ({
      ...prevValues, Discount: value, TotalAmount: value === 0 ? NullGstActualAmount : NullGstActualAmount - value,
    }));

    const totalValue = NullGstActualAmount - value
    if (value === 0) {
      SetTotalAmountWithoutGst(NullGstActualAmount)
    } else {
      SetTotalAmountWithoutGst(totalValue)
    }
  }

  useEffect(() => {
    dropdowntypeofpack()
  }, [])


  // Insert Function 
  const hanldeinsert = (e) => {
    e.preventDefault()
    if (Insertdata.Employeecode === "") {
      Swal.fire({
        text: "Please Enter Valid EmployeeCode",
        icon: "warning",
        customClass: "sweet-alert-text"
      })
      return
    }
    if (Insertdata.Validityfrom === "") {
      Swal.fire({
        text: "Please Enter Valid ValidityFrom Date",
        icon: "warning",
        customClass: "sweet-alert-text"
      })
      return
    }
    if (Insertdata.Validityto === "") {
      Swal.fire({
        text: "Please Enter Valid ValidityTo Date",
        icon: "warning",
        customClass: "sweet-alert-text"
      })
      return
    }
    if (SelectGst === "") {
      Swal.fire({
        text: "Please Enter Select One Mode",
        icon: "warning",
        customClass: "sweet-alert-text"
      })
      return
    }
    if (Insertdata.TypeofPack === "" && SelectGst === "gst") {
      Swal.fire({
        text: "Please Enter Select one Pack",
        icon: "warning",
        customClass: "sweet-alert-text"
      })
      return
    }
    if (Insertdata.Amount === 0) {
      Swal.fire({
        text: "Please Enter Valid Amount",
        icon: "warning",
        customClass: "sweet-alert-text"
      })
      return
    }
    if (Insertdata.Discount === "") {
      Swal.fire({
        text: "Please Enter Valid Discount Like 0",
        icon: "warning",
        customClass: "sweet-alert-text"
      })
      return
    }
    Swal.fire({
      title: 'Are you sure you Save this data!',
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
            const alldata = { ...Insertdata, createdBy: createdBy }
            axios.post(`${apiUrl}/transaction_insert`, alldata)
              .then((res) => {
                console.log(res);
                SetInsertdata({
                  ...Insertdata,
                  Employeecode: '',
                  CustomerName: '',
                  Validityfrom: '',
                  Validityto: '',
                  Discount: 0
                })
                SetAmountValues({ ...Amountvalues, amount: "", gst: 0 })
                SetTotalAmountWithGst("")
                SetTotalAmountWithGst(" ")
                SetNullGstActualAmount(" ")
                SetTotalAmountWithoutGst(" ")
                setemployeedatas(" ")
                SetDiscountAmountWithoutGst(" ")
                setloader(false);
              })
              .catch((err) => {
                console.log(err);
                setloader(false);
              })
          }
          catch (err) {
            console.log(err);
            setloader(false);
          }

        }, 1500);

      } else {
        setloader(false);
      }
    })



  }



  return (
    <div>

      <div className="enquiry-container d-flex align-items-center justify-content-center position-relative ">
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
        <form action="" className='bg-transparent border rounded  p-3 col-20 col-lg-8 col-xl-7 row' style={{ opacity: loader ? "0.1" : "1" }} onSubmit={hanldeinsert}>
          <div className="head text-center ">
            <h1 className='text-2xl mb-1 '>Billing</h1>
            <hr className='mb-2' />
          </div>
          <div className="input-name col-12 col-md-6 col-lg-6 col-xl-6 mb-1" >
            <label htmlFor="name" className=' form-label '>Employee Code</label>
            <input type="text" className='form-control' value={Insertdata.Employeecode} onChange={handlesearchemployee} />
          </div>
          <div className="input-em-name col-12 col-md-6 col-lg-6 col-xl-6 mb-2">
            <label htmlFor="name" className='form-label'>Employee Name</label>
            <input type="text" className='form-control'
              value={employeedatas && employeedatas.employeename ? employeedatas.employeename : ""} readOnly={true} />
          </div>


          <div className="input-phone-no col-12 col-md-6 col-lg-6 col-xl-6 mt-3 d-flex gap-1">
            <div className="form-date col-6">
              <label htmlFor="fromdate" className='form-label'>Validity From</label>
              <input type="date" name="date" id="fromdate" className='form-control' value={Insertdata.Validityfrom}
                onChange={(e) => SetInsertdata({ ...Insertdata, Validityfrom: e.target.value })} />
            </div>
            <div className="to-date col-6">
              <label htmlFor="todate" className='form-label'>Validity To</label>
              <input type="date" name="date" id="todate" className='form-control' value={Insertdata.Validityto}
                onChange={(e) => SetInsertdata({ ...Insertdata, Validityto: e.target.value })} />
            </div>
          </div>


          <div className="select-gst-mode col-12 col-md-6 col-lg-6 col-xl-6 mt-3">
            <label htmlFor="name" className='form-label'>Select Amount Mode</label>
            <select name="gst" id="" className='form-select' onChange={(e) => SetSelectGst(e.target.value)} >
              <option value="">Select Gst Or Without Gst</option>
              <option value="gst">With Gst</option>
              <option value="withoutgst">WithOut Gst</option>
            </select>
          </div>


          {/* With Gst Code  */}
          <div className={`select-pack col-12 col-md-6 col-lg-6 col-xl-6 mt-3 ${SelectGst === "gst" ? "d-inline-grid col-12" : "d-none "}`}>
            <label htmlFor="name" className='form-label'>Select Plan From Type Pack</label>
            <select name="gst" id="" className='form-select' onChange={hanletypeofpackchange}>
              <option value="">Select Pack</option>
              {typeofpack.map((datas) => {
                return (
                  <option value={`id:${datas.packid} packtype:${datas.TypeofPack} amount:${datas.Amount} gst:${datas.Gst}`} key={datas.Sno}>{datas.TypeofPack}</option>
                )
              })}
            </select>
          </div>


          <div className={`select-pack col-12 col-md-6 col-lg-6 col-xl-6 mt-3 ${SelectGst === "gst" ? "d-inline-grid col-12" : "d-none "}`}>
            <label htmlFor="name" className='form-label'>Actual Amount</label>
            <input type="text" className='form-control' value={Amountvalues.amount ? Amountvalues.amount : ""} readOnly={true} />
          </div>

          <div className={`select-pack col-12 col-md-6 col-lg-6 col-xl-6 mt-3 ${SelectGst === "gst" ? "d-inline-grid col-12" : "d-none "}`}>
            <label htmlFor="name" className=' form-label '>Gst</label>
            <input type="text" className='form-control' value={Amountvalues.gst ? Amountvalues.gst : ""} readOnly={true} />
          </div>

          <div className={`select-pack col-12 col-md-6 col-lg-6 col-xl-6 mt-3 ${SelectGst === "gst" ? "d-inline-grid col-12" : "d-none "}`}>
            <label htmlFor="name" className=' form-label '>DisCount</label>
            <input type="text" className='form-control' placeholder="0" onChange={handleWithGstdiscount} />
          </div>
          <div className={`select-pack col-12 col-md-6 col-lg-6 col-xl-6 mt-3 ${SelectGst === "gst" ? "d-inline-grid col-12" : "d-none "}`}>
            <label htmlFor="name" className=' form-label'>Total Amount</label>
            <div className="input-group">
              <input type="text" className='form-control' value={TotalAmountWithGst} readOnly={true} />
              <span className="input-group-text" id="basic-addon1">GST : {TotalGstValue}</span>
            </div>
          </div>

          {/* With Gst Code  End */}

          {/* With out Gst Code  */}

          <div className={`select-pack col-12 col-md-6 col-lg-6 col-xl-6 mt-3 ${SelectGst === "withoutgst" ? "d-inline-grid col-12" : "d-none "}`}>
            <label htmlFor="name" className=' form-label'>Actual Amount</label>
            <input type="text" className='form-control' value={NullGstActualAmount} onChange={handlewithoutGstActualamount} />
          </div>

          <div className={`select-pack col-12 col-md-6 col-lg-6 col-xl-6 mt-3 ${SelectGst === "withoutgst" ? "d-inline-grid col-12" : "d-none "}`}>
            <label htmlFor="name" className=' form-label'>Discount</label>
            <input type="text" className='form-control' value={DiscountAmountWithoutGst} onChange={handlewithoutGstDiscount} />
          </div>

          <div className={`select-pack col-12 col-md-6 col-lg-6 col-xl-6 mt-3 ${SelectGst === "withoutgst" ? "d-inline-grid col-12" : "d-none "}`}>
            <label htmlFor="name" className=' form-label'>Total Amount</label>
            <div className="input-group">
              <input type="text" className='form-control' value={TotalAmountWithoutGst} readOnly={true} />
            </div>
          </div>

          <div className="submit-btn col-12 col-md-6 col-lg-6 col-xl-6 mt-5">
            <button className='btn btn-outline-dark col-12' type='submit'>Submit</button>
          </div>

        </form>
      </div>

      <div className="table-company-datas mt-32 mt-lg-0 mt-xl-0 mt-md-0">
        <PrintTemplate />
      </div>
    </div>
  )
}

export default Billing
