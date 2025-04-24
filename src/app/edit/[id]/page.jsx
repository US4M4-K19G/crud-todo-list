'use client'
import React, { useState } from "react";
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';

export default function page() {
  const {id} = useParams()
  console.log('todoid',id)
  const[value,setValue]=useState({
    title:"",
    desc:""
})
const {push} =useRouter()
    const handelOnChange=(e)=>{
      setValue({
        ...value,
        [e.target.name]:e.target.value 
      })
    }
    const handelSubmit=async()=>{
     try {
      if (id) {
        const request= await axios.put(`/api/todo/${id}`,value)
      const respons=request.data
      if (request.status===200) {
        toast.success(respons.message)
        push('/')
      }
        
      }
     } catch (error) {
      console.log(error)
     }
    }
    return(
        <>
        <div className='flex justify-center  h-screen'>
               <div className='mt-8 flex gap-8 flex-col p-10 rounded-lg h-80 shadow-lg bg-black'>
                  <h1 className='text-white font-bold text-2xl'>Update Todo</h1>
               <label className="relative block">
    <span className="absolute inset-y-0 left-0 flex items-center pl-2">
    </span>
    <input value={value.title} onChange={handelOnChange}  className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder="Enter you title" type="text" 
      name='title'  />
  </label>
  <label className="relative block">
    <span className="absolute inset-y-0 left-0 flex items-center pl-2">
    </span>
    <input value={value.desc} onChange={handelOnChange} name='desc'  className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder="Enter you description" type="text"/>
  </label>
  
     <button className='rounded-lg bg-green-500 px-4 py-2 text-white font-bold' onClick={handelSubmit} >Submit</button>
               </div>
        </div>
     
     
     </>
    )
}