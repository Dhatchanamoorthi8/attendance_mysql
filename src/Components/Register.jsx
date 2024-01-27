import React, { useState } from 'react'
import "../Style/register.css"
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Register = () => {

 const[getdata,setgetdata]=useState({
  name:"",
  gender:"",
  mobile:"",
  email:"",
  course:"",
  payment_type:"",
  payment:"",
  address:"",
 })
const[initial,setinitial]=useState("")


const handlesubmit = (e) => {
 e.preventDefault();

 let isError = false;



 if (!isError) {
  
   const allData = {
     ...getdata,
     name: getdata.name + ' ' + initial,
     initial: initial
   };
   
   const functionThatReturnPromise = () => new Promise(resolve => setTimeout(resolve, 1500));
   toast.promise(
     functionThatReturnPromise,
     {
       pending: 'Insert Data is pending',
       success: 'You are Data Inserted Successfully',
     }
 )
   axios.post("http://localhost:3002/post",allData)
   .then((res)=>{
    console.log(res.data);
   })
   .catch((err)=>{
    console.log(err);
   })
 }else{
  const functionThatReturnPromise = () => new Promise((res,rej) => setTimeout(rej, 1500));
  toast.promise(
    functionThatReturnPromise,
    {
      pending: 'Insert Data is pending',
      error:'Your are Data not Inserted Successfully'
    })
 }
};



 return (
  <div>
   <div className="new-register-head">

    <div className="regiter-form d-flex align-items-center justify-content-center p-5">

  <form action="" className='forms border rounded  p-3 col-12 col-lg-8 col-xl-7 row' onSubmit={handlesubmit}>
      <h3 className=' text-3xl text-center'>New Traine Registration</h3>
      <hr className='mb-3 mt-1'/>
      <div className="name col-12 col-md-6 col-lg-6 col-xl-6">
       <label htmlFor="name" className='form-label'>Traine Name</label>
       <input 
       type="text"
       className='form-control mb-3'
       onChange={(e)=>setgetdata({...getdata,name:e.target.value})} 
        />
      </div>

      <div className="select col-12 col-md-6 col-lg-6 col-xl-6 d-flex flex-wrap">
       <div className="col">
        <label htmlFor="lastname" className='form-label'>Initial</label>
        <input type="text"
        className='form-control'
        onChange={(e)=>setinitial(e.target.value)}
          />
       </div>

       <div className="col-8 ms-2">
       <label htmlFor="gender" className='form-label'>Gender</label>
       <select name="gender" id="gender-select" className='form-select  mb-3' 
       onChange={(e)=>setgetdata({...getdata,gender:e.target.value})}>
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="FeMale">FeMale</option>
        <option value="Transgender">Transgender</option>
       </select>
       </div>

      </div>

      <div className="mobile-no col-12 col-md-6 col-lg-6 col-xl-6">
       <label htmlFor="name" className='form-label' >Mobile Number</label>
       <input type="tel"
       placeholder='+91'
        className='form-control mb-3 mobile'
        onChange={(e)=> setgetdata({...getdata,mobile:e.target.value})}
        />
      </div>

      <div className="email col-12 col-md-6 col-lg-6 col-xl-6">
       <label htmlFor="name" className='form-label'>Email</label>
       <input type="email"
       className='form-control mb-3'
       placeholder='example@gmail.com'
       onChange={(e)=> setgetdata({...getdata,email:e.target.value})}
       required
        />
      </div>

      <div className="selection-month col-12 col-md-6 col-lg-6 col-xl-6">
       <label htmlFor="gender" className='form-label'>Course Duration</label>
       <select name="Course" id="Course-select" className='form-select col-12 mb-3'
       onChange={(e)=> setgetdata({...getdata,course:e.target.value})}>
        <option value="">Select Duration Course</option>
        <option value="3 Months">3 Months</option>
        <option value="6 Months">6 Months</option>
        <option value="1 Year">1 Year</option>
       </select>
      </div>
      <div className="address col-12 col-md-6 col-lg-6 col-xl-6">
       <label htmlFor="name" className='form-label'>Address</label><br />
       <textarea type="text" 
       className='input-address mb-3'
       onChange={(e)=> setgetdata({...getdata,address:e.target.value})}
        />
      </div>

      <div className="upload-files col-12 col-md-6 col-lg-6 col-xl-6">
       <label htmlFor="image" className='form-label'>Upload Traine Image</label>
       <input type="file" className='form-control mb-3' />
      </div>

      <div className="payment col-12 col-md-6 col-lg-6 col-xl-6 d-flex flex-wrap">
       <label htmlFor="" className='form-label col-12'>Payment</label>
       <div className="col-8">
        <select name="payment" id="" className='form-select mb-3'
        onChange={(e)=> setgetdata({...getdata,payment_type:e.target.value})}>
         <option value="">Select Payment Method</option>
         <option value="offline">offline</option>
         <option value="online">online</option>
        </select>
       </div>

       <div className="col ms-1">
        <input 
        type="text"
        className=' form-control' 
        placeholder='₹' 
        onChange={(e)=> setgetdata({...getdata,payment:e.target.value})}/>
       </div>
      </div>
      <hr />
      <div className="submit-btn text-center mt-4">
       <button className='btn btn-success col-4'>Submit </button>
      </div>
     </form>
    </div>
   </div>




   <ToastContainer
   theme="colored" />
  </div>
 )
}

export default Register
