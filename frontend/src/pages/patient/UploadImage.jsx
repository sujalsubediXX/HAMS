import React, { useState } from 'react'
import axios from "axios"
import API_BASE_URL from "../../config/api";
const UploadImage = () => {
    const [file,setfile]=useState("");
   const formdata=new FormData();
   formdata.append("image",file)

    const handleSubmit=async(e)=>{
        e.preventDefault();
        if(file?.name){
            try {
                const res=await axios.post(`${API_BASE_URL}/api/doctor/image`,formdata,{
                    headers:{
                        "Content-Type":"multipart/form-data"
                    }
                })
                if(res.status==201){
                    console.log(res.data.message);
                }
            } catch (error) {
                console.log("Error")
                console.log(error.message);
                
            }
        }else{
            console.log("Insert the image first.")
        }
      
    }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={(e)=>setfile(e.target.files)} name='image'/>
        <button type='submit'>InsertImage</button>
      </form>
    </div>
  )
}

export default UploadImage
