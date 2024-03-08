import React from 'react'
import axios from '../../config/axios'



function FileUploadInformation({idFileUpload,maxSize = "5MB",typeFile="PDF"}) {
    
    const mountedRef = React.useRef(true)

    async function getAddress (id) {
        let data =  await axios
            .get(`vendor_management/config_file_upload/${id}`)
        if (!mountedRef.current) return null
        if (data.status === 200){
            setData(data.data.data)
        }
    }

    React.useEffect(() => {
        if (idFileUpload){
            getAddress(idFileUpload)
        }
    },[idFileUpload])

    React.useEffect(() => {
        return () => { 
          mountedRef.current = false
        }
    }, [])

    let [data,setData] = React.useState({})
    return (
        <div>
            <p style={{marginBottom : "0px", fontSize : "10px",marginTop:"1px"}}>Type File : {data?.file_type?.toUpperCase()}, Maksimal : {data?.size?.toString().replace(".",",")} MB</p>
        </div>
    )
}



export default FileUploadInformation
