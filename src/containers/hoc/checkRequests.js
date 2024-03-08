import React, {useEffect} from "react";
import axios from "axios";

const checkRequests = Wrapped => {
    function CheckRequests(props) {
        useEffect(() => {
            axios.interceptors.response.use(function (response) {
                // Do something with response data
                // console.log(response.status);
                return response;
            }, function (error) {
                switch (error.response.status) {
                    case 401 :
                        props.history.push('/login') //we will redirect user into 503 page 
                        break
                    case 404 :
                        console.log("404")
                        break
                    case 500 :
                        console.log("404")
                        break
                    default :
                        console.log("console log")
                        break
                }
                // Do something with response error
                // console.log(error.response.status);
                return Promise.reject(error);
            });
        })

        return (
            <Wrapped {...props} />
        )
    }
    return CheckRequests
}

export default checkRequests