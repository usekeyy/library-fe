import axios from '../config/axios';
import { toastr } from 'react-redux-toastr';

export default {
    setupInterceptors: store => {
        axios.interceptors.request.use(function (payload) {
            if (localStorage.getItem('token')) {
                payload.headers.authorization = 'bearer ' + localStorage.getItem('token')
            }
            payload.headers['Accept-Language'] = localStorage.getItem('i18nextLng') === "en-GB" ? "en" : localStorage.getItem('i18nextLng');
            return payload;
        }, (error) => {
            return Promise.reject(error);
        })
        axios.interceptors.response.use(function (response) {
            if (response.headers.authorization) {
                const { authorization } = response.headers;
                localStorage.setItem('token', authorization) 
                
            }            
            if(response.data.data?.timestamp!==undefined){
                localStorage.setItem('times', response.data.data.timestamp)
            }               
            return response
        }, function (error) {
						if (typeof error.response === 'undefined') { 
							// alert('A network error occurred. '
							// + 'This could be a CORS issue or a dropped internet connection. '
							// + 'It is not possible for us to know.')
							// window.location.assign("/error/404")
							console.log('A network error occurred. '
							+ 'This could be a CORS issue or a dropped internet connection. '
							+ 'It is not possible for us to know.');
						} else {
							const status = error.response.status;
							const { authorization } = error.response.headers;
							switch (status) {
									case 400:
											if (authorization) localStorage.setItem('token', authorization)
											break;
									case 401:
											const msg = error.response.data;
											toastr.error(msg.status, msg.message);
											localStorage.removeItem('token')
											localStorage.removeItem('access-control')
											localStorage.removeItem('persist:root')
											store.dispatch({ type: 'SUCCESS_LOGOUT_ACTION' })
											break;
									case 403:
											if (authorization) localStorage.setItem('token', authorization)
											// window.location.assign("/error/403")
											if (localStorage.getItem('token')) {
													// window.location.assign("/home")
											} else {
													// window.location.assign("/")
											}
											// localStorage.setItem('token', authorization)
											break;
									case 405:
											// localStorage.setItem('token', authorization)
											break;
									case 406 :
											const msgs = error.response.data;
											toastr.error(msgs.status, msgs.message);
											break;
									case 404:
											if (authorization) localStorage.setItem('token', authorization)
											// window.location.assign("/error/404")
											break;
									case 408:
											window.location.assign("/error/408")
											// localStorage.setItem('token', authorization)
											break;
									default:
											if (authorization) localStorage.setItem('token', authorization)
											// localStorage.removeItem('token')
											// localStorage.removeItem('access-control')
											// localStorage.removeItem('persist:root')
											// store.dispatch({type: 'SUCCESS_LOGOUT_ACTION'})
											break;
							}
						}
            
            return Promise.reject(error);
        });
    },
    refresh: (store) => {       
		const persist = localStorage.getItem('persist:root');
		var PersistJSON = ""

		try {
			PersistJSON = JSON.parse(persist);
			let userAuth = JSON.parse(PersistJSON.auth)
			if(PersistJSON.auth===undefined || userAuth?.user===null ) {
				localStorage.removeItem('access-control')
				localStorage.removeItem('token')
				localStorage.removeItem('i18nextLng')
				localStorage.removeItem('persist:root')
				localStorage.removeItem('times')
				store.dispatch({ type: 'SUCCESS_LOGOUT_ACTION' })
			}
		} catch(e) {
			localStorage.removeItem('access-control')
			localStorage.removeItem('token')
			localStorage.removeItem('i18nextLng')
			localStorage.removeItem('persist:root')
			localStorage.removeItem('times')
			store.dispatch({ type: 'SUCCESS_LOGOUT_ACTION' })
		}	
		
		const token = localStorage.getItem('token');
        if (token !== null && token !== undefined) {
            axios.get('fetch').then(resp => {
                localStorage.setItem('times' , resp.data.data.timestamp)
            }).catch(error => {
                const msg = (typeof error.response !== 'undefined') ? error.response.data : { message: "Failed to Fetch", status: "Fail" };
                toastr.error(msg.status, msg.message);
                if (msg.status === 'fail') {
                    localStorage.removeItem('access-control')
                    localStorage.removeItem('token')
                    localStorage.removeItem('persist:root')
                    store.dispatch({ type: 'SUCCESS_LOGOUT_ACTION' })
                }
            });
        }
    }
}