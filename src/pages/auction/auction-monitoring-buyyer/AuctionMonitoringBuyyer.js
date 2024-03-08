import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import ReactLoading from 'react-loading';
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import {
    editFreezeVendor, storeBeritaAcara, getDetailAuctionMonitoringBuyyer, getTabulationAuctionMonitoringBuyyer, getRangkingAuctionMonitoringBuyyer, storeCloseAuction, downloadBeritaAcara,
    getPanitiaAcara, AuctionBannedVendor, pauseResumeAuction, stopAuction
} from '../../../store/actions/auction/monitoringBuyyerActions';
import HeaderClassBase from './sub/HeaderClassBase';
import Peserta from './sub/Peserta';
import TabulationAuction from './sub/TabulationAuction';
import Rangking from './sub/Rangking';
import FormBeritaAcara from './sub/FormBeritaAcara';
import SweetAlert from 'react-bootstrap-sweetalert';
import { getDocumentHistoryVendorAuction, fetchChat, appendChat, getChatAuction, unreadChatVendor, unreadChatBuyer, clearChatState } from '../../../store/actions/auction/auctionActions';
import ChatBox from '../../../components/chatbox/ChatBox';
import moment from 'moment';

class AuctionMonitoringBuyyer extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.ClientUUID = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_URL}` + this.props.match.params.id);
        this.ClientTimer = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_URL}time/jakarta?interval=${process.env.REACT_APP_WEBSOCKET_INTERVAL}`);
        this.ClientChat = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_CHAT_URL}${this.props.match.params.id}/chat?token=${localStorage.getItem('token')}`);
        this.state = {
            data: [],
            loading: false,
            socket_url: `${process.env.REACT_APP_WEBSOCKET_URL}` + this.props.match.params.id,
            socket_timer: "",
            loadings: {
                loading_header_panel: true,
                loading_peserta_panel: true,
                loading_tabulation_panel: true,
                loading_rangking_panel: true,
                loading_data_modal_history: false,
                loading_close_auction: false,
                loading_download_berita_acara: false,
                loading_submit_create_berita_acara: false,
                loading_submit_berita_acara: false,
                loading_freeze_button_vendor: false,
                loading_load_berita_acara: true,
                loading_stop_auction: false,
                loading_pause_auction : false
            },
            modal_berita_acara: false,
            column_peserta: [],
            errors_berita_acara: [],
            isConfirmBanned: false,
            isConfirmFreeze: false,
            banned_vendor_id: "",
            payload_banned_vendor: "",
            freeze_vendor_id: "",
            payload_freeze_vendor: "",
            start_date_auction : "",
            end_date_auction :  "",
            socket_waiting_time : "",
            socket_count_down_time : "",
            isConfirmStop : false,
            isConfirmClose : false,
						loadchat: false,
						incomingChat: false,
						disableChat: false,
						hideInputChat: false,
						msgUnread: false,
						history_chat: {
							showChatbox: false,
							showIcon: true,
							messages: [],
						}
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.connect_websocket_page()
        this.connect_websocket_timer()
				this.connect_websocket_chat(true)
				this.props.clearChatState({type: true});
        setTimeout(() => {
            this.getUUID(); 
            this.getTabulation();
            this.getRangking();           
        }, 1500);
    }

    componentWillUnmount() {
        this._isMounted = false;
				this.ClientUUID.close()
				this.ClientTimer.close()
				this.ClientChat.close()
				this.props.fetchChat({type: false});
				// this.props.unreadChatBuyer({type: false});
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback) => {
            return;
        };
    }

    connect_websocket_page = () => {
        // let socket = new WebSocket(this.state.socket_url);
        var _this_page = this;
        _this_page.ClientUUID.binaryType = "arraybuffer"
        _this_page.ClientUUID.onmessage = (event) => {
            let tex = new TextDecoder("utf-8").decode(event.data)
            _this_page.handleWebsocket(tex)
        }

        _this_page.ClientUUID.onclose = function(e) {
            console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
            setTimeout(function() {
                _this_page.reconnect_page();
            }, 1000);
        };
    
        _this_page.ClientUUID.onerror = function(err) {
            console.error('Socket encountered error: ', err.message, 'Closing socket');
            _this_page.ClientUUID.close();
        };

    }

    connect_websocket_timer= () => {
        var _this=this
        // let timer_socket = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_URL}time/jakarta?interval=${process.env.REACT_APP_WEBSOCKET_INTERVAL}`);
        _this.ClientTimer.onmessage = (event) => {
            _this.handleSocketTimer(event.data)
            // console.log(event.data)
        }
      
        _this.ClientTimer.onclose = function(e) {
          console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
          setTimeout(function() {
            _this.reconnect_timer();
          }, 1000);
        };
      
        _this.ClientTimer.onerror = function(err) {
          console.error('Socket encountered error: ', err.message, 'Closing socket');
          _this.ClientTimer.close();
        };
    }

    connect_websocket_chat= (isRestart) => {
				var _this = this
				_this.setState({loadchat: isRestart})
        // let timer_socket = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_URL}time/jakarta?interval=${process.env.REACT_APP_WEBSOCKET_INTERVAL}`);
        _this.ClientChat.onmessage = (event) => {
            // _this.handleSocketTimer(event.data)
						_this.setState({incomingChat: true})
						this.props.unreadChatBuyer({type: true});
            const response = JSON.parse(event.data);
						// console.log(response);
						const dataDispatch = {type: true, response: response};
						
						if(typeof response === 'object' && response !== null) {
							if(Array.isArray(response)){
								this.props.fetchChat(dataDispatch);
								this.setNewDataChat()
							} else {
								this.props.appendChat(dataDispatch);
								this.props.unreadChatVendor({type: true});
								// _this.setState({msgUnread: true})
								this.setNewDataChat()
							}
						} else {
							this.props.fetchChat(dataDispatch);
							this.setNewDataChat()
						}
						_this.setState({loadchat: false, incomingChat: false, disableChat: false})
        }
      
        _this.ClientChat.onclose = function(e) {
          console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
          setTimeout(function() {
            _this.reconnect_chat();
						_this.setState({loadchat: false, disableChat: true})
          }, 1000);
        };
      
        _this.ClientChat.onerror = function(err) {
          console.error('Socket encountered error: ', err.message, 'Closing socket');
          _this.ClientChat.close();
					_this.setState({loadchat: false, disableChat: true})
        };
    }

		setMsgUnRead = () => {
			this.setState((prevState) => ({
      	msgUnread: !prevState
    	}));
		}

		toggleOpenChat = () => {
			this.setState(({ history_chat }) => ({ 
				history_chat : {
						...history_chat,
						showChatbox: !this.state.history_chat.showChatbox,
						showIcon: !this.state.history_chat.showIcon
				}
			}));
		}

		newMessage = (message) => {
			this.setState({
				...this.state.history_chat,
				messages: this.state.history_chat.messages.concat({
					author: {
						username: this.props.userDt.data.username,
						id: 1,
						avatarUrl: 'https://image.flaticon.com/icons/svg/2446/2446032.svg',
					},
					text: message,
					type: 'text',
					timestamp: +new Date(),
				}),
			});
		}

		setNewDataChat = () => {
			if(Array.isArray(this.props.chat) && this.props.chat.length > 0){
				const arr = [];
				
				var newArray = this.props.chat.filter(value => JSON.stringify(value) !== '{}');

				newArray.forEach((item, key) => {
					const setNewObj = {
						author: {
							username: item.name,
							id: (this.props.userDt.data.name === item.name) ? 1 : item.id,
							avatarUrl: 'https://image.flaticon.com/icons/svg/2446/2446032.svg',
						},
						text: item.message,
						type: 'text',
						timestamp: +new Date(item.created_at),
					};
					arr.push(setNewObj);
				})
				// arr.push(optBtn);

				this.setState(({ history_chat }) => ({ 
					history_chat : {
							...history_chat,
							messages: arr
					}
				}));
			} else {
				const arr2 = [];
				const obj = {
					text: 'You has joined the conversation, start a new conversation with others',
					timestamp: +new Date(),
					type: 'notification',
				};
				arr2.push(obj)
				this.setState(({ history_chat }) => ({ 
					history_chat : {
							...history_chat,
							messages: arr2
					}
				}));
			}
		}

    handleSocketTimer(data) {
        if(this.state.start_date_auction!==""){
            let swt = ""
            let auc_time = ""
            let auction_time=""
            let d_auc_time=""
            let d=""
            var ms = moment(new Date(this.state.start_date_auction),"DD/MM/YYYY HH:mm:ss").diff(moment(new Date(data),"DD/MM/YYYY HH:mm:ss"));

            // waiting time condition
            if(ms>0){
                auction_time = moment(new Date(this.state.end_date_auction),"DD/MM/YYYY HH:mm:ss").diff(moment(new Date(this.state.start_date_auction),"DD/MM/YYYY HH:mm:ss"));
                d_auc_time = moment.duration(auction_time);
                auc_time = Math.floor(d_auc_time.asHours()).toString().padStart(2, '0') + moment.utc(d_auc_time.as('milliseconds')).format(":mm:ss");
                d = moment.duration(ms);
                swt = Math.floor(d.asHours()).toString().padStart(2, '0') + moment.utc(d.as('milliseconds')).format(":mm:ss");
            }else{
                swt = "00:00:00"
                auction_time = moment(new Date(this.state.end_date_auction),"DD/MM/YYYY HH:mm:ss").diff(moment(new Date(data),"DD/MM/YYYY HH:mm:ss"));
                d_auc_time = moment.duration(auction_time);
                if(auction_time>0){
                    auc_time = Math.floor(d_auc_time.asHours()).toString().padStart(2, '0') + moment.utc(d_auc_time.as('milliseconds')).format(":mm:ss");
                }else{
                    auc_time="00:00:00"
                }
            }

            // condition status stop or complate
            if (this.state.data.header.status === "s" || this.state.data.header.status === "y") {
                swt="00:00:00"
                auc_time="00:00:00"
            }
            
            this.setState({
                socket_timer: data,
                socket_count_down_time : auc_time,
                socket_waiting_time : swt
            })
            // console.log(data)
        }
    }

    handleWebsocket(data) {
        let dt = JSON.parse(data)
        // console.log(dt)
        if (dt.type === "response_bid" ){
            this.getTabulation();
            this.getRangking();          
        }else if(dt.type === "freeze_vendor" ){
            // let temp = this.state.data.peserta
            let newArr = []
            this.state.data.peserta.forEach(element => {
                if(element['vendor_id']===dt.response_freeze.vendor_id){
                    element['is_freeze'] = dt.response_freeze.is_freeze   
                }
                newArr.push(element)
            });

            this.setState(({data}) =>({
                data: {...data, peserta : newArr}
            }))
        }else if(dt.type === "agreement_vendor" ){
            // let temp = this.state.data.peserta
            let newArr = []
            this.state.data.peserta.forEach(element => {
                if(element['vendor_id']===dt.response_agreement.vendor_id){
                    element['is_vendor_aggrement'] = dt.response_agreement.is_vendor_aggrement   
                }
                newArr.push(element)
            });

            this.setState(({data}) =>({
                data : {...data, peserta : newArr}
            }))
        }
    }

    reconnect_timer(){
        this.ClientTimer = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_URL}time/jakarta?interval=${process.env.REACT_APP_WEBSOCKET_INTERVAL}`);
        this.connect_websocket_timer()
    }

    reconnect_chat(){
				this.ClientChat = new WebSocket(`ws://151.106.113.125:4444/${this.props.match.params.id}/chat?token=${localStorage.getItem('token')}`);
        this.connect_websocket_chat(false)
    }

    reconnect_page(){
        this.ClientUUID = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_URL}` + this.props.match.params.id);
        this.connect_websocket_page()
    }

    getUUID() {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_header_panel: true, loading_peserta_panel: true },
            }));
            this.props.getDetailAuctionMonitoringBuyyer(this.props.match.params.id)
                .then((resp) => {
                    let datas = resp.data.data;
                    let now = (this.state.socket_timer === "") ? new Date(localStorage.getItem('times')) : this.state.socket_timer
                    
                    if (new Date(now) < new Date(datas.header.start_auction)) {
                        datas.header.timer_is_pause = false
                        datas.header.waiting_times = moment().add(moment(new Date(datas.header.start_auction), "DD/MM/YYYY HH:mm:ss").diff(moment(new Date(now), "DD/MM/YYYY HH:mm:ss"), 'seconds'), 'seconds')
                        datas.header.count_down_timer = moment().add(moment(new Date(datas.header.end_auction), "DD/MM/YYYY HH:mm:ss").diff(moment(new Date(datas.header.start_auction), "DD/MM/YYYY HH:mm:ss"), 'seconds'), 'seconds')
                    } else {
                        datas.header.timer_is_pause = true
                        datas.header.waiting_times = moment().format()
                        datas.header.count_down_timer = moment().add(moment(new Date(datas.header.end_auction), "DD/MM/YYYY HH:mm:ss").diff(moment(new Date(now), "DD/MM/YYYY HH:mm:ss"), 'seconds'), 'seconds')
                    }

                    if (datas.header.status === "s" || datas.header.status === "y") {
                        datas.header.waiting_times = moment().format()
                        datas.header.count_down_timer = moment().format()
                    }
										// status = P & start_auction < now , waiting
										// status = P & start_auction > now  & end_auction < now, Live
										// status = P & start_auction > now  & end_auction > now, Don
                    // console.log(datas.header)
                    // console.log(now)
										// new Date(`${value.end_date} ${value.end_time}`).getTime() > new Date().getTime()
										const waiting = (datas.header.status === 'p' && new Date(`${datas.header.start_auction}`).getTime() < new Date().getTime() );
										const live = (datas.header.status === 'p' && new Date(`${datas.header.start_auction}`).getTime() < new Date().getTime() && new Date(`${datas.header.end_auction}`).getTime() > new Date().getTime() );
										const done = (datas.header.status === 'p' && new Date(`${datas.header.start_auction}`).getTime() < new Date().getTime() && new Date(`${datas.header.end_auction}`).getTime() < new Date().getTime() );

										console.log(`waiting : ${waiting}`);
										console.log(`live : ${live}`);
										console.log(`done : ${done}`);
										console.log(`date_start : ${new Date(`${datas.header.start_auction}`).getTime()}`);
										console.log(`date_end : ${new Date(`${datas.header.end_auction}`).getTime()}`);
										console.log(`date_now : ${new Date().getTime()}`);
										console.log(`check date : ${new Date().getTime()}`);
										console.log(`status : ${datas.header.status}`);

                    this.setState(({ loadings }) => ({
												hideInputChat: (waiting || live || done) ? false : true,
                        loadings: { ...loadings, loading_header_panel: false, loading_peserta_panel: false },
                        data: datas ,
                        start_date_auction : datas.header.start_auction,
                        end_date_auction : datas.header.end_auction,
                    }));
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_header_panel: false, loading_peserta_panel: false },
                    }));
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    getTabulation() {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_tabulation_panel: true },
            }));
            this.props.getTabulationAuctionMonitoringBuyyer(this.props.match.params.id)
                .then((resp) => {
                    let datas = resp.data.data;
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_tabulation_panel: false },
                        tabulation: datas.detail_bid,
                    }));
                    // this.setState(({ loading: false, data: datas }));
                })
                .catch((resp) => {
                    // this.setState({ loading: false });
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_tabulation_panel: false },
                    }));
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    getRangking() {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_rangking_panel: true },
            }));
            this.props.getRangkingAuctionMonitoringBuyyer(this.props.match.params.id)
                .then((resp) => {
                    let datas = resp.data;
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_rangking_panel: false },
                        rangking: datas
                    }));
                    // this.setState(({ loading: false, data: datas }));
                })
                .catch((resp) => {
                    // this.setState({ loading: false });
                    toastr.error(resp.data.status, resp.data.message);
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_rangking_panel: false },
                    }));
                    
                });
        }
    }

    storeCloseAuction() {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_close_auction: true },
                errors: []
            }));
            this.props.storeCloseAuction(this.props.match.params.id, { status: 'y' })
                .then((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_close_auction: false },
                        errors: []
                    }));
                    this.getUUID();
                    toastr.success(resp.data.status, resp.data.message);
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_close_auction: false },
                        errors: resp.data?.errors
                    }));
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    storeBeritaAcara(payload) {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_submit_berita_acara: true },
                errors_berita_acara: []
            }));
            this.props.storeBeritaAcara(this.props.match.params.id, payload)
                .then((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_submit_berita_acara: false },
                        errors: [],
                        modal_berita_acara: false,
                        column_peserta: []
                    }));

                    toastr.success(resp.data.status, resp.data.message);
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_submit_berita_acara: false },
                        errors_berita_acara: resp.data?.errors
                    }));
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    editFreezeVendor(vendor_id, payload) {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_freeze_button_vendor: true },
                errors_berita_acara: []
            }));
            this.props.editFreezeVendor(this.props.match.params.id, vendor_id, { is_freeze: payload })
                .then((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_freeze_button_vendor: false },
                    }));
                    toastr.success(resp.data.status, resp.data.message);
                    this.getUUID();
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_freeze_button_vendor: false },
                    }));
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    downloadBeritaAcara = () => {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, loading_download_berita_acara: true },
        }));
        this.props.downloadBeritaAcara(this.props.match.params.id)
            .then((resp) => {
                const url = window.URL.createObjectURL(new Blob([resp.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `BA_AUCTION_${this.state.data?.header.auction_number}.pdf`); //or any other extension
                document.body.appendChild(link);
                link.click();
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loading_download_berita_acara: false },
                }));
            })
            .catch(error => {
                // this.setState(({ loadings }) => ({
                //     loadings: { ...loadings, loading_download_berita_acara: false },
                // }));
                toastr.error("Download Failed");
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loading_download_berita_acara: false },
                }));
            })
    }

    tonggleCloseModalItem = () => {
        this.setState({ modal_berita_acara: false })
    }

    openModal() {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_load_berita_acara: true },
                modal_berita_acara: true
            }));
            this.props.getPanitiaAcara(this.props.match.params.id)
                .then((resp) => {
                    this.setState(({ loadings, column_peserta }) => ({
                        loadings: { ...loadings, loading_load_berita_acara: false },
                        column_peserta: resp.data.data.data
                    }));
                    toastr.success(resp.data.status, resp.data.message);
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_load_berita_acara: false },
                    }));
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    addColumn() {
        if (this._isMounted) {
            let arr = this.state.column_peserta
            arr.push({
                "nama": "",
                "jabatan": "",
                "department": "",
            })
            this.setState({ column_peserta: arr })
            //console.log(arr)
        }
    }

    historyVendor = (vendor_id) => {
        this.props.history.push('/auction/monitoring-buyyer/' + this.props.match.params.id + '/history/' + vendor_id)
    }

    historyTabulationItems = (item_id) => {
        this.props.history.push('/auction/monitoring-buyyer/' + this.props.match.params.id + '/tabulation-history/' + item_id)
    }

    penawaranVendor = (vendor_id) => {
        this.props.history.push('/auction/monitoring-buyyer/' + this.props.match.params.id + '/buyer-input-bid/' + vendor_id)
    }

    AuctionBannedVendor = (vendor_id) => {
        if (this._isMounted) {
            this.props.AuctionBannedVendor(this.props.match.params.id, vendor_id, { status: this.state.payload_banned_vendor })
                .then(res => {
                    const response = res.data;
                    toastr.success(response.message);
                    
                    this.getUUID();
                    this.getTabulation();
                    this.getRangking(); 
                })
                .catch(error => {
                    const { message } = error.data;
                    if (typeof message === 'string') {
                        toastr.error('Something Wrong', message);
                    }
                    this._isMounted && this.setState({ error: true, errors: message, loading: false });
                })
        }
    }

    toggleConfirmBanned = (e, vendor_id, payload) => {
        if (this._isMounted) {
            e.preventDefault()
            //console.log(payload)
            this.setState({ isConfirmBanned: true, banned_vendor_id: vendor_id, payload_banned_vendor: payload })
        }
    }

    toggleSweetAlertBanned(name) {
        if (this._isMounted) {
            switch (name) {
                case 'confirm':
                    this.setState({ isConfirmBanned: false });
                    this.AuctionBannedVendor(this.state.banned_vendor_id, this.state.payload_banned_vendor)
                    break;
                case 'cancel':
                    this.setState({ isConfirmBanned: false, banned_vendor_id: '', payload_banned_vendor: '' });
                    break;
                default:
                    break;
            }
        }
    }

    toggleConfirmFreeze = (e, vendor_id, payload) => {
        if (this._isMounted) {
            e.preventDefault()
            this.setState({ isConfirmFreeze: true, freeze_vendor_id: vendor_id, payload_freeze_vendor: payload })
        }
    }

    toggleSweetAlertFreeze(name) {
        if (this._isMounted) {
            switch (name) {
                case 'confirm':
                    this.setState({ isConfirmFreeze: false });
                    this.editFreezeVendor(this.state.freeze_vendor_id, this.state.payload_freeze_vendor)
                    break;
                case 'cancel':
                    this.setState({ isConfirmFreeze: false, freeze_vendor_id: '', payload_freeze_vendor: '' });
                    break;
                default:
                    break;
            }
        }
    }

    downloadHistoryVendorAuction = () => {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, loading_download_history_auction: true },
        }));
        this.props.getDocumentHistoryVendorAuction(this.props.match.params.id)
            .then((resp) => {
                const url = window.URL.createObjectURL(new Blob([resp.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${this.state.data?.header.auction_number}.pdf`); //or any other extension
                document.body.appendChild(link);
                link.click();
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loading_download_history_auction: false },
                }));
            })
            .catch(error => {
                toastr.error("Download Failed");
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loading_download_history_auction: false },
                }));
            })
    }

    downloadHistoryChat = () => {
			this.setState(({ loadings }) => ({
					loadings: { ...loadings, loading_download_history_auction: true },
			}));
			this.props.getChatAuction(this.props.match.params.id)
			.then((resp) => {
					const url = window.URL.createObjectURL(new Blob([resp.data]));
					const link = document.createElement('a');
					link.href = url;
					link.setAttribute('download', `${this.state.data?.header.auction_number}.pdf`); //or any other extension
					document.body.appendChild(link);
					link.click();
					this.setState(({ loadings }) => ({
							loadings: { ...loadings, loading_download_history_auction: false },
					}));
			})
			.catch(error => {
					toastr.error("Download Failed");
					this.setState(({ loadings }) => ({
							loadings: { ...loadings, loading_download_history_auction: false },
					}));
			})
    }

    pauseResumeAuction = () => {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_pause_auction: true },
            }));
            this.props.pauseResumeAuction(this.props.match.params.id)
                .then(resp => {
                    let datas = resp.data.data;
                    let temp = this.state.data.header
                    temp.is_pause = datas.responses.is_pause

                    this.setState(({loadings, data}) =>({
                        loadings : {...loadings, loading_pause_auction: false, ...data, header : temp},
                        // loadings : {...data, header : temp},                        
                    }))
                    // this.getUUID()
                    // const response = res.data;
                    // toastr.success(response.message);
                    // this._isMounted && this.setState({}, () => this.getUUID());
                })
                .catch(resp => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_data_modal_history: false },
                    }));
                    toastr.error(resp.data.status, resp.data.message);
                })
        }
    }

    stopAuction = () => {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_stop_auction: true },
            }));
            this.props.stopAuction(this.props.match.params.id)
                .then(resp => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_stop_auction: false },
                    }));
                    this.getUUID()
                    toastr.success(resp.data.status, resp.data.message);
                })
                .catch(resp => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_stop_auction: false },
                    }));
                    toastr.error(resp.data.status, resp.data.message);
                })
        }
    }

    onCompleteWaitingTimes() {
        if (this._isMounted) {
            this.getUUID()
        }
    }

    toggleConfirmStop = () => {
        if (this._isMounted) {
            this.setState({ isConfirmStop: true})
        }
    }

    toggleSweetAlertStop(name) {
        if (this._isMounted) {
            switch (name) {
                case 'confirm':
                    this.setState({ isConfirmStop: false });
                    this.stopAuction()
                    break;
                case 'cancel':
                    this.setState({ isConfirmStop: false});
                    break;
                default:
                    break;
            }
        }
    }

    toggleConfirmClose = () => {
        if (this._isMounted) {
            this.setState({ isConfirmClose: true})
        }
    }

    toggleSweetAlertClose(name) {
        if (this._isMounted) {
            switch (name) {
                case 'confirm':
                    this.setState({ isConfirmClose: false });
                    this.storeCloseAuction()
                    break;
                case 'cancel':
                    this.setState({ isConfirmClose: false});
                    break;
                default:
                    break;
            }
        }
    }




    render() {
        const { t } = this.props;
				const { data } = this.props.userDt;
				const { messages } = this.state.history_chat;
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Auction</li>
                    <li className="breadcrumb-item">Monitoring Buyer</li>
                </ol>
                <h1 className="page-header">Proses auction</h1>
                <div className="row">
                    <div className="col-lg-12">
                        <HeaderClassBase
                            socket_waiting_time={this.state.socket_waiting_time}
                            socket_count_down_time={this.state.socket_count_down_time}
                            loadings={this.state.loadings}
                            socket_timer={this.state.socket_timer}
                            data={this.state.data.header}
                            toggleConfirmClose={() => this.toggleConfirmClose()}
                            downloadBeritaAcara={() => this.downloadBeritaAcara()}
                            openModal={() => this.openModal()}
                            pauseResumeAuction={() => this.pauseResumeAuction()}
                            toggleConfirmStop={() => this.toggleConfirmStop()}
                            onCompleteWaitingTimes={() => this.onCompleteWaitingTimes()}
                            parentState={this.state}
                            access={this.props.access}
                        />
                        <Peserta
                            access={this.props.access}
                            loadings={this.state.loadings}
                            data={this.state.data.peserta}
                            header={this.state.data.header}
                            socket_timer={this.state.socket_timer}
                            historyVendor={(data) => this.historyVendor(data)}
                            penawaranVendor={(data) => this.penawaranVendor(data)}
                            editFreezeVendor={(vendor_id, payload) => this.editFreezeVendor(vendor_id, payload)}
                            toggleConfirm={(e, vendor, payload) => this.toggleConfirmBanned(e, vendor, payload)}
                            toggleConfirmFreeze={(e, vendor, payload) => this.toggleConfirmFreeze(e, vendor, payload)}
                        />
                        <TabulationAuction
                            header={this.state.data.header}
                            loadings={this.state.loadings}
                            data={this.state.tabulation}
                            historyTabulationItems={(item_id) => this.historyTabulationItems(item_id)}
                            downloadHistoryVendorAuction={() => this.downloadHistoryVendorAuction()}
                            downloadHistoryChat={() => this.downloadHistoryChat()}
														parentState={this.state}
                        />
                        <Rangking
                            header={this.state.data?.header}
                            loadings={this.state.loadings}
                            data={this.state.rangking}
                        />
                    </div>
                </div>
								{!this.state.loadchat &&
								<ChatBox 
									users={data} 
									ws={this.ClientChat} 
									parentState={this.state} 
									toggleOpenChat={() => this.toggleOpenChat}
									newMessage={(msg) => this.newMessage(msg)}
									setMsgUnRead={() => this.setMsgUnRead}
									loadchat={this.state.incomingChat}
									messages={messages}
								/>}
                <Modal isOpen={this.state.modalHistory} toggle={() => this.tonggleCloseModalItem()} className="modal-lg">
                    <ModalHeader toggle={() => this.tonggleCloseModalItem()}>Detail History</ModalHeader>
                    <div className="col-lg-12 m-t-10 m-b-10">

                    </div>
                </Modal>

                <Modal isOpen={this.state.modal_berita_acara} toggle={() => this.tonggleCloseModalItem()} className="modal-lg">
                    <ModalHeader toggle={() => this.tonggleCloseModalItem()}>Berita Acara Auction</ModalHeader>
                    {this.state.loadings.loading_load_berita_acara &&
                        <ModalBody>
                            {/* <PanelBody> */}
                            <center>
                                <br />
                                <ReactLoading type="cylon" color="#0f9e3e" />
                                <br />
                            </center>
                            {/* </PanelBody> */}
                        </ModalBody>
                    }
                    {!this.state.loadings.loading_load_berita_acara &&
                        <div className="col-lg-12 m-t-10 m-b-10">
                            <FormBeritaAcara
                                data={this.state.column_peserta}
                                addColumn={() => this.addColumn()}
                                state={this.state}
                                storeBeritaAcara={(payload) => this.storeBeritaAcara(payload)}
                                loadings={this.state.loadings}
                                errors={this.state.errors_berita_acara}
                                toggleClose={() => this.tonggleCloseModalItem()}
                            />
                        </div>
                    }
                </Modal>

                {(this.state.isConfirmBanned &&
                    <SweetAlert
                        warning
                        showCancel
                        confirmBtnText={t("common:delete.approve-button")}
                        cancelBtnText={t("common:delete.cancel")}
                        confirmBtnBsStyle="success"
                        cancelBtnBsStyle="default"
                        title={t("common:delete.title-delete")}
                        onConfirm={() => this.toggleSweetAlertBanned('confirm')}
                        onCancel={() => this.toggleSweetAlertBanned('cancel')}
                    >
                    </SweetAlert>
                )}

                {(this.state.isConfirmFreeze &&
                    <SweetAlert
                        warning
                        showCancel
                        confirmBtnText={t("common:delete.unfreeze-button")}
                        cancelBtnText={t("common:delete.cancel")}
                        confirmBtnBsStyle="success"
                        cancelBtnBsStyle="default"
                        title={t("common:delete.title-delete")}
                        onConfirm={() => this.toggleSweetAlertFreeze('confirm')}
                        onCancel={() => this.toggleSweetAlertFreeze('cancel')}
                    >
                    </SweetAlert>
                )}

                {(this.state.isConfirmStop &&
                    <SweetAlert
                        warning
                        showCancel
                        confirmBtnText={t("common:delete.stop-auction-button")}
                        cancelBtnText={t("common:delete.cancel")}
                        confirmBtnBsStyle="success"
                        cancelBtnBsStyle="default"
                        title={t("common:delete.stop-auction-title")}
                        onConfirm={() => this.toggleSweetAlertStop('confirm')}
                        onCancel={() => this.toggleSweetAlertStop('cancel')}
                    >
                    </SweetAlert>
                )}

                {(this.state.isConfirmClose &&
                    <SweetAlert
                        warning
                        showCancel
                        confirmBtnText={t("common:delete.close-auction-button")}
                        cancelBtnText={t("common:delete.cancel")}
                        confirmBtnBsStyle="success"
                        cancelBtnBsStyle="default"
                        title={t("common:delete.close-auction-title")}
                        onConfirm={() => this.toggleSweetAlertClose('confirm')}
                        onCancel={() => this.toggleSweetAlertClose('cancel')}
                    >
                    </SweetAlert>
                )}

            </div>
        )
    }
}
const stateToProps = state => {
    return {
        sidebarDt: state.sidebarDt,
        access: state.sidebarDt.access,
        userDt: state.auth.user,
        chat: state.chat.history_chat,
    }
}

const dispatchToProps = dispatch => {
    return {
        getDetailAuctionMonitoringBuyyer: (id) => dispatch(getDetailAuctionMonitoringBuyyer(id)),
        getTabulationAuctionMonitoringBuyyer: (id) => dispatch(getTabulationAuctionMonitoringBuyyer(id)),
        getRangkingAuctionMonitoringBuyyer: (id) => dispatch(getRangkingAuctionMonitoringBuyyer(id)),
        downloadBeritaAcara: (id) => dispatch(downloadBeritaAcara(id)),
        getPanitiaAcara: (id) => dispatch(getPanitiaAcara(id)),
        pauseResumeAuction: (id) => dispatch(pauseResumeAuction(id)),
        stopAuction: (id) => dispatch(stopAuction(id)),
        getDocumentHistoryVendorAuction: (id) => dispatch(getDocumentHistoryVendorAuction(id)),
        getChatAuction: (id) => dispatch(getChatAuction(id)),
        storeCloseAuction: (id, payload) => dispatch(storeCloseAuction(id, payload)),
        storeBeritaAcara: (id, payload) => dispatch(storeBeritaAcara(id, payload)),
        AuctionBannedVendor: (id, vendor_id, payload) => dispatch(AuctionBannedVendor(id, vendor_id, payload)),
        editFreezeVendor: (id, vendor_id, payload) => dispatch(editFreezeVendor(id, vendor_id, payload)),
        fetchChat: (payload) => dispatch(fetchChat(payload)),
        appendChat: (payload) => dispatch(appendChat(payload)),
        unreadChatVendor: (payload) => dispatch(unreadChatVendor(payload)),
        unreadChatBuyer: (payload) => dispatch(unreadChatBuyer(payload)),
        clearChatState: (payload) => dispatch(clearChatState(payload)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(AuctionMonitoringBuyyer));
