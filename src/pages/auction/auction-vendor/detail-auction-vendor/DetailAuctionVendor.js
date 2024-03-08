// import { array } from 'prop-types'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import { Modal, ModalHeader } from 'reactstrap'
import ReactLoading from 'react-loading';
import { Panel, PanelBody, PanelFooter, PanelHeader } from '../../../../containers/layout/sub/panel/panel'
import { getScoreVendor,getDetailUpdateHarga, storeDetailUpdateHarga, storeAuctionVendorAggrement, getDetailAuctionVendor, getRangkingAuctionVendor, getTabulationAuctionVendor, getBidDetailAuctionVendor, storeBidDetailAuctionVendor, getHistoryAuctionVendor, storeAuctionVendorFreeze } from '../../../../store/actions/auction/auctionVendorActions';
import { fetchChat, appendChat, unreadChatBuyer, unreadChatVendor, clearChatState } from '../../../../store/actions/auction/auctionActions';
import Form from './Form'
import History from './detail/History'
// import Countdown from 'react-countdown';
import moment from 'moment'
import FormAgrement from './detail/FormAgrement'
import FormUpdatePenawaranJasa from './detail/FormUpdatePenawaranJasa'
// import { formatDate } from '../../../../helpers/formatDate';
import ChatBox from '../../../../components/chatbox/ChatBox';



class DetailAuctionVendor extends Component {
    constructor(props) {
        super(props)
        this.ClientUUID = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_URL}` + this.props.match.params.id);
        this.ClientTimer = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_URL}time/jakarta?interval=${process.env.REACT_APP_WEBSOCKET_INTERVAL}`);
				this.ClientChat = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_CHAT_URL}${this.props.match.params.id}/chat?token=${localStorage.getItem('token')}`);
        this._isMounted = false;
        this.state = {
            socket_url: `${process.env.REACT_APP_WEBSOCKET_URL}` + this.props.match.params.id,
            socket_timer: "",
            uuid: this.props.match.params.id,
            headers: [],
            tabulations: [],
            rangkings: [],
            bids: [],
            akumulasi_ranking: "",
            loadings: {
                loading_data_modal_history: true,
                loading_data_header: true,
                loading_data_bid: true,
                loading_data_tabulation: true,
                loading_data_rangking: true,
                loading_submit_bid: false,
                loading_submit_aggrement: false,
                loading_data_price_update: true,
                loading_submit_unit_price: false,
                loading_data_score : true,
            },
            modalHistory: false,
            aggrementModal: false,
            dataAggrement: {
                rule: ""
            },
            errors: [],
            resultSocket: [],
            headerhistory: [],
            dataHistory: [],
            isFreeze: false,
            timeFreeze: 0,
            modal_update_penawaran_jasa: false,
            arrPenawaran: [
                { "id": 1, "name": "Item 1", specification: "specification 1", uom: "UOM", unit_price: "10000000", currency: "IDR", total_price: 10000000, data: [{ "id": 1, "name": "Service Line 1", qty: 1, uom: "UOM", currency: "IDR", unit_price: 50000 }, { "id": 2, "name": "Service Line 2", qty: 1, uom: "UOM", currency: "IDR", unit_price: 50000 }, { "id": 3, "name": "Service Line 3", qty: 1, uom: "UOM", currency: "IDR", unit_price: 50000 }] },
                { "id": 2, "name": "Item 2", specification: "specification 2", uom: "UOM", unit_price: "10000000", currency: "IDR", total_price: 10000000, data: [{ "id": 1, "name": "Service Line 1", qty: 2, uom: "UOM", currency: "IDR", unit_price: 50000 }, { "id": 2, "name": "Service Line 2", qty: 2, uom: "UOM", currency: "IDR", unit_price: 50000 }, { "id": 3, "name": "Service Line 3", qty: 2, uom: "UOM", currency: "IDR", unit_price: 50000 }] },
                { "id": 3, "name": "Item 3", specification: "specification 3", uom: "UOM", unit_price: "10000000", currency: "IDR", total_price: 10000000, data: [{ "id": 1, "name": "Service Line 1", qty: 3, uom: "UOM", currency: "IDR", unit_price: 50000 }, { "id": 2, "name": "Service Line 2", qty: 3, uom: "UOM", currency: "IDR", unit_price: 50000 }, { "id": 3, "name": "Service Line 3", qty: 3, uom: "UOM", currency: "IDR", unit_price: 50000 }] }
            ],
            copsHistory: [],
            waiting_socket_times: "",
            sisa_auction_socket_times : "",
            sisa_freeze_socket_times : "",
            bid_errors : [],
            increment_decrement_paket_discount : "",
            scores : [],
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
        this.connect_websocket_page()
        this.connect_websocket_timer()
        this.connect_websocket_chat(true)
				this.props.clearChatState({type: true});
        this._isMounted = true;
        setTimeout(() => {
            this.getUUID();
        }, 1000);
       
    }

    componentWillUnmount() {
				this._isMounted = false;
        this.ClientTimer.close()        
        this.ClientUUID.close()  
				this.ClientChat.close()
				this.props.fetchChat({type: false});
				// this.props.unreadChatVendor({type: false});
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback) => {
            return;
        };
    }

    connect_websocket_page = () => {
        var _this_page = this;
        _this_page.ClientUUID.binaryType = "arraybuffer"
        _this_page.ClientUUID.onmessage = (event) => {
            let tex = new TextDecoder("utf-8").decode(event.data)
            _this_page.handleWebsocket(tex)
        }

        _this_page.ClientUUID.onclose = () => {
            console.log('Socket For Page is closed. Reconnect will be attempted in 1 second.');
            setTimeout(() => {
                _this_page.reconnect_page()
            }, 1000);
        };
    
        _this_page.ClientUUID.onerror = () => {
            console.error('Socket Page encountered error: Closing socket');
            _this_page.ClientUUID.close();
        };
    }

    connect_websocket_timer= () => {
        var _this = this;
        console.log('connect')
        _this.ClientTimer.onmessage = (event) => {
            _this.handleSocketTimer(event.data)
        }
      
        _this.ClientTimer.onclose = function(e) {
            console.log('Socket Timer is closed. Reconnect will be attempted in 1 second.', e.reason);
            setTimeout(() => {
                _this.reconnect_timer()
                // this.ClientTimer = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_URL}time/jakarta?interval=${process.env.REACT_APP_WEBSOCKET_INTERVAL}`);
            }, 1000);
        };
      
        _this.ClientTimer.onerror = function(err) {
          console.error('Socket Timer encountered error: ', err.message, 'Closing socket');
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
						this.props.unreadChatVendor({type: true});
						const response = JSON.parse(event.data);
						// console.log(response);
						const dataDispatch = {type: true, response: response};

						if(typeof response === 'object' && response !== null) {
							if(Array.isArray(response)){
								this.props.fetchChat(dataDispatch);
								this.setNewDataChat()
							} else {
								this.props.appendChat(dataDispatch);
								// this.setState({msgUnread: true});
								this.props.unreadChatBuyer({type: true});
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
						_this.setState({loadchat: false, disableChat: true})
						_this.reconnect_chat();
					}, 1000);
				};
			
				_this.ClientChat.onerror = function(err) {
					console.error('Socket encountered error: ', err.message, 'Closing socket');
					_this.setState({loadchat: false, disableChat: true})
					_this.ClientChat.close();
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
                loadings: { ...loadings, loading_data_header: true },
            }));
            this.props.getDetailAuctionVendor(this.props.match.params.id)
                .then((resp) => {
                    let datas = resp.data.data;
                    datas.isFreeze = datas.is_freeze
                    datas.last_bid =( datas.last_bid===null) ? datas.start_auction : datas.last_bid
                    let now = this.state.socket_timer
                 
                    if (new Date(now) < new Date(datas.start_auction)) {
                        datas.is_waiting = true
                        datas.isFreeze = "y"
                    }
                    else {
                        datas.is_waiting = false
                    }

                    datas.denominimilisasi = parseFloat(datas.denominimilisasi)

										const waiting = (resp.data.data.status === 'p' && new Date(`${resp.data.data.start_auction}`).getTime() < new Date().getTime() );
										const live = (resp.data.data.status === 'p' && new Date(`${resp.data.data.start_auction}`).getTime() < new Date().getTime() && new Date(`${resp.data.data.end_auction}`).getTime() > new Date().getTime() );
										const done = (resp.data.data.status === 'p' && new Date(`${resp.data.data.start_auction}`).getTime() < new Date().getTime() && new Date(`${resp.data.data.end_auction}`).getTime() < new Date().getTime() );
										
                    this.setState(({ loadings, dataAggrement }) => ({
												hideInputChat: (waiting || live || done) ? false : true,
                        loadings: { ...loadings, loading_data_header: false },
                        headers: datas,
                        aggrementModal: ((datas.is_vendor_aggrement === null || datas.is_vendor_aggrement === "n" || datas.is_vendor_aggrement === "r") && datas.status === "p" && new Date(datas.end_auction) > new Date(now)) ? true : false,
                        dataAggrement: { ...dataAggrement, rule: datas.rule },
                        modal_update_penawaran_jasa: (datas.status === "y" && datas.is_service_proposal_tender === true && (datas.is_update === null || datas.is_update === "n")) ? true : false
                    }));
                    if (datas.source === "eproc" && this.state.modal_update_penawaran_jasa) {
                        this.getDetailUpdateHarga();
                    }
                    if(datas.metode_peringkat==="multivariate"){
                        this.getScoreVendor()
                    }
                    this.getRangkingAuctionVendor();
                    this.getBidDetailAuctionVendor();
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_data_header: false },
                    }));
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    getTabulationAuctionVendor() {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_data_tabulation: true },
            }));
            this.props.getTabulationAuctionVendor(this.props.match.params.id)
                .then((resp) => {
                    let datas = resp.data.data;
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_data_tabulation: false },
                        tabulations: datas.detail_bid
                    }));
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_data_tabulation: false },
                    }));
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    getRangkingAuctionVendor() {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_data_rangking: true },
            }));
            this.props.getRangkingAuctionVendor(this.props.match.params.id)
                .then((resp) => {
                    let datas = resp.data.data
                    // let arr = []
                    // datas.forEach((element, i) => {
                    //     if (element.vendor_id === this.props.user.username) {
                    //         arr.push(element)
                    //     }
                    // })
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_data_rangking: false },
                        rangkings: datas
                    }));
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_data_rangking: false },
                    }));
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    getRangkingAuctionVendorWithoutLoading() {
        if (this._isMounted) {
            this.props.getRangkingAuctionVendor(this.props.match.params.id)
                .then((resp) => {
                    let datas = resp.data.data
                    this.setState({rangkings: datas});
                })
                .catch((resp) => {
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    getBidDetailAuctionVendor() {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_data_bid: true },
            }));
            this.props.getBidDetailAuctionVendor(this.props.match.params.id, this.props.user.username)
                .then((resp) => {
                    let datas = resp.data.data;
                    let arr = []
                    let hitung_diskon_paket = ""
                    datas.detail_bid.forEach((element) => {
                        element.unit_price = parseFloat(element.unit_price) / parseFloat(this.state.headers.denominimilisasi)
                        arr.push(element)
                        if(this.state.headers.metode_penentuan_pemenang==="paket" && this.state.headers.price_calculation==="diskon"){
                            hitung_diskon_paket=element.diskon===""  ? 0 : parseFloat(element.diskon)
                        }
                    })
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_data_bid: false },
                        bids: arr,
                        akumulasi_ranking: datas.akumulasi_ranking,
                        increment_decrement_paket_discount : hitung_diskon_paket
                    }));
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_data_bid: false },
                    }));
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    getBidDetailAuctionVendorWithoutLoading() {
        if (this._isMounted) {
            this.props.getBidDetailAuctionVendor(this.props.match.params.id, this.props.user.username)
                .then((resp) => {
                    let datas = resp.data.data;
                    let arr = []
                    // let hitung_diskon_paket = ""
                    datas.detail_bid.forEach((element) => {
                        element.unit_price = parseFloat(element.unit_price) / parseFloat(this.state.headers.denominimilisasi)
                        arr.push(element)
                        if(this.state.headers.metode_penentuan_pemenang==="paket" && this.state.headers.price_calculation==="diskon"){
                            // hitung_diskon_paket=element.diskon===""  ? 0 : parseFloat(element.diskon)
                        }
                    })
                    this.setState(() => ({
                        // bids: arr,
                        akumulasi_ranking: datas.akumulasi_ranking,
                        // increment_decrement_paket_discount : hitung_diskon_paket
                    }));
                })
                .catch((resp) => {
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    getBidDetailAuctionVendorWithoutLoadingBids() {
        if (this._isMounted) {
            this.props.getBidDetailAuctionVendor(this.props.match.params.id, this.props.user.username)
                .then((resp) => {
                    let datas = resp.data.data;
                    let arr = []
                    // let hitung_diskon_paket = ""
                    datas.detail_bid.forEach((element) => {
                        element.unit_price = parseFloat(element.unit_price) / parseFloat(this.state.headers.denominimilisasi)
                        arr.push(element)
                        if(this.state.headers.metode_penentuan_pemenang==="paket" && this.state.headers.price_calculation==="diskon"){
                            // hitung_diskon_paket=element.diskon===""  ? 0 : parseFloat(element.diskon)
                        }
                    })
                    this.setState(() => ({
                        bids: arr,
                        // akumulasi_ranking: datas.akumulasi_ranking,
                        // increment_decrement_paket_discount : hitung_diskon_paket
                    }));
                })
                .catch((resp) => {
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }


    getDetailUpdateHarga() {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_data_price_update: true },
            }));
            this.props.getDetailUpdateHarga(this.props.match.params.id, this.props.user.username)
                .then((resp) => {
                    let datas = resp.data.data;
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_data_price_update: false },
                        arrPenawaran: datas.detail_item,
                    }));
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_data_price_update: false },
                    }));
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    getScoreVendor() {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_data_score: true },
            }));
            this.props.getScoreVendor(this.props.match.params.id, this.props.user.username)
                .then((resp) => {
                    let datas = resp.data.data;
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_data_score: false },
                        scores: datas,
                    }));
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_data_score: false },
                    }));
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    storeDetailUpdateHarga(payload) {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_submit_unit_price: true },
            }));
            this.props.storeDetailUpdateHarga(this.props.match.params.id, this.props.user.username, payload)
                .then((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_submit_unit_price: false },
                        modal_update_penawaran_jasa: false
                    }));
                    toastr.success(resp.data.status, resp.data.message)
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_submit_unit_price: false },
                    }));
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    storeBidDetailAuctionVendor(payload) {
        if (this._isMounted) {
            if (this.state.headers?.isFreeze === "y") {
                toastr.warning('waktu ada di frezee')
            } else {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loading_submit_bid: true },
                    bid_errors : []
                }));
                this.props.storeBidDetailAuctionVendor(this.props.match.params.id, this.props.user.username, payload)
                    .then((resp) => {
                        //console.log(resp)
                        this.setState(({ loadings, headers }) => ({
                            loadings: { ...loadings, loading_submit_bid: false },
                            headers: { ...headers, date: moment().add((this.state.headers?.freeze * 60), 'seconds').format() } //moment(new Date()).add(this.state.headers?.freeze, 'minutes')}
                        }));
                        if (resp.data.status === "fail") {
                            toastr.error(resp.data.status, resp.data.message)
                        } else {
                            toastr.success(resp.data.status, resp.data.message)
                        }
                    })
                    .catch((resp) => {
                        console.log(resp)
                        this.setState(({ loadings, headers }) => ({
                            loadings: { ...loadings, loading_submit_bid: false },
                            bid_errors : (resp.data?.data!==undefined) ? resp.data.errors : []
                        }));
                        toastr.error(resp.data.status, resp.data.message);
                    });
            }
        }
    }

    storeAuctionVendorAggrement(payload) {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_submit_aggrement: true },
            }));
            this.props.storeAuctionVendorAggrement(this.props.match.params.id, payload)
                .then((resp) => {
                    //console.log(resp)
                    this.setState(({ loadings, headers }) => ({
                        loadings: { ...loadings, loading_submit_aggrement: false }
                    }));
                    toastr.success(resp.data.status, resp.data.message)
                    if (payload.is_vendor_aggrement !== "y") {
                        this.props.history.push('/task-vendor/auctions')
                    } else {
                        this.getUUID()
                    }
                })
                .catch((resp) => {
                    this.setState(({ loadings, headers }) => ({
                        loadings: { ...loadings, loading_submit_aggrement: false },
                    }));
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    storeAuctionVendorFreeze() {
        if (this._isMounted) {
            this.props.storeAuctionVendorFreeze(this.props.match.params.id, this.props.user.username)
                .then((resp) => {
                    toastr.success(resp.data.status, resp.data.message)
                })
                .catch((resp) => {
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }



    tonggleCloseModalItem = () => {
        this.setState({ modalHistory: false })
    }

    tongleOpenHistory = (i) => {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_data_modal_history: true },
                modalHistory: true
            }));

            this.props.getHistoryAuctionVendor(this.props.match.params.id, this.state.bids[i]?.item_id, this.props.user.username)
                .then((resp) => {
                    //console.log(resp)
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_data_modal_history: false },
                        headerhistory: resp.data.data.detail_bid,
                        dataHistory: resp.data.data.history,
                        copsHistory: resp.data.data.header
                    }));
                    toastr.success(resp.data.status, resp.data.message)
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_data_modal_history: false },
                    }));
                    toastr.error(resp.data.status, resp.data.message);
                });
        }

    }

    handleSocketTimer(data) {
        this.setState({
            socket_timer: data
        })
        if (this.state.headers.uuid !== undefined) {
            let socket_is_waiting =""
            let swt = ""
            let auc_time = ""
            let auction_time = ""
            let d_auc_time = ""
            let d = ""
            let diff_sisa_freeze = ""
            let final_sisa_freeze = ""
            let diff_sisa_freeze_time = ""
            let isFreeze_auction = this.state.headers.isFreeze
           
            // waiting time condition
            if(this.state.headers.status==="y" || this.state.headers.status==="s")
            {
                auc_time = "00:00:00"
                final_sisa_freeze = "00:00:00"
                isFreeze_auction = "y"
            }else{
                var ms = moment(new Date(this.state.headers.start_auction), "DD/MM/YYYY HH:mm:ss").diff(moment(new Date(data), "DD/MM/YYYY HH:mm:ss"));
                // var calc_sisa_freeze = moment(new Date(this.state.headers.last_bid), "DD/MM/YYYY HH:mm:ss").diff(moment(new Date(data), "DD/MM/YYYY HH:mm:ss"));
                if (ms > 0) {
                    auction_time = moment(new Date(this.state.headers.end_auction), "DD/MM/YYYY HH:mm:ss").diff(moment(new Date(this.state.headers.start_auction), "DD/MM/YYYY HH:mm:ss"));
                    d_auc_time = moment.duration(auction_time);
                    auc_time = Math.floor(d_auc_time.asHours()).toString().padStart(2, '0') + moment.utc(d_auc_time.as('milliseconds')).format(":mm:ss");
                    d = moment.duration(ms);
                    swt = Math.floor(d.asHours()).toString().padStart(2, '0') + moment.utc(d.as('milliseconds')).format(":mm:ss");
                    socket_is_waiting= true

                    // selisih freeze ketika waiting
                    diff_sisa_freeze = moment(new Date(moment().add((this.state.headers.freeze * 60)+1,'seconds').format()), "DD/MM/YYYY HH:mm:ss").diff(moment(new Date(), "DD/MM/YYYY HH:mm:ss"));
                    if(diff_sisa_freeze>0){
                    diff_sisa_freeze_time = moment.duration(diff_sisa_freeze);
                    final_sisa_freeze = Math.floor(diff_sisa_freeze_time.asHours()).toString().padStart(2, '0') + moment.utc(diff_sisa_freeze_time.as('milliseconds')).format(":mm:ss");
                    }else{
                        final_sisa_freeze=  "00:00:00"
                        isFreeze_auction = "y"
                    }
                } else {
                    swt = "00:00:00"
                    socket_is_waiting= false
                    auction_time = moment(new Date(this.state.headers.end_auction), "DD/MM/YYYY HH:mm:ss").diff(moment(new Date(data), "DD/MM/YYYY HH:mm:ss"));
                    d_auc_time = moment.duration(auction_time);
                    if (auction_time > 0) {
                        auc_time = Math.floor(d_auc_time.asHours()).toString().padStart(2, '0') + moment.utc(d_auc_time.as('milliseconds')).format(":mm:ss");
                        diff_sisa_freeze = moment(new Date(moment(this.state.headers.last_bid).add((this.state.headers.freeze * 60),'seconds').format()), "DD/MM/YYYY HH:mm:ss").diff(moment(new Date(data), "DD/MM/YYYY HH:mm:ss"));
                        if(diff_sisa_freeze>0){
                            diff_sisa_freeze_time = moment.duration(diff_sisa_freeze);
                            final_sisa_freeze = Math.floor(diff_sisa_freeze_time.asHours()).toString().padStart(2, '0') + moment.utc(diff_sisa_freeze_time.as('milliseconds')).format(":mm:ss");
                        }else{
                            final_sisa_freeze=  "00:00:00"
                            isFreeze_auction = "y"
                        }
                    } else {
                        auc_time = "00:00:00"
                        final_sisa_freeze = "00:00:00"
                        isFreeze_auction = "y"
                    }

                    if(this.state.headers.is_freeze==="y"){
                        final_sisa_freeze =  "00:00:00"
                        isFreeze_auction = "y"
                    }
                }
            }            

            if(this.state.headers.is_vendor_banned==="b")
            {
                final_sisa_freeze =  "00:00:00"
                isFreeze_auction = "y"
            }
            
            if(this.state.headers.is_vendor_banned!=="b" && this.state.headers.is_freeze!=="y" && final_sisa_freeze==="00:00:00" && this.state.headers.status==="p")
            {
                this.storeAuctionVendorFreeze()
            }

            if(this.state.headers.is_vendor_banned!=="b" && this.state.headers.is_freeze!=="y" && swt==="00:00:00" && this.state.headers.status==="p")
            {
                isFreeze_auction="n"
            }
            if(this.state.headers.is_pause==="y"){
                isFreeze_auction="y"
            }

            this.setState(({ headers }) => ({
                headers: { ...headers, is_waiting: socket_is_waiting , isFreeze : isFreeze_auction},
                waiting_socket_times :  swt,
                sisa_auction_socket_times :  auc_time,
                sisa_freeze_socket_times : final_sisa_freeze
            }))
        }
    }

    handleWebsocket(data) {
        let dt = JSON.parse(data)
        console.log(dt)

        if (dt.type === "response_bid") {
            if (this.props.user.username === dt.response_bid.vendor.vendor_id) {
                let temp = this.state.headers
                temp.last_bid = new Date(dt.response_bid.vendor.last_bid)
                this.setState({headers: temp})
                if(this.state.headers.metode_peringkat==="multivariate"){
                    this.getScoreVendor();
                }
                // this.getBidDetailAuctionVendor();
                this.getBidDetailAuctionVendorWithoutLoadingBids();                         
            }
            this.getRangkingAuctionVendorWithoutLoading(); 
            this.getBidDetailAuctionVendorWithoutLoading(); 
        } else if (dt.type === "freeze_vendor") {
            if (this.props.user.username === dt.response_freeze.vendor_id) {
                let temp = this.state.headers
                temp.isFreeze = dt.response_freeze.is_freeze
                temp.is_freeze = dt.response_freeze.is_freeze
                temp.last_bid = new Date(dt.response_freeze.last_bid)
                if (dt.response_freeze.is_freeze === "n") {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_data_header: true },
                    }))

                }
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loading_data_header: false },
                    headers: temp
                }))
            }
        } else if (dt.type === "ban_vendor") {
            if (this.props.user.username === dt.response_ban.vendor_id) {
                let temp = this.state.headers
                if (dt.response_ban.is_vendor_banned === "b") {
                    temp.date = moment().format()
                    temp.is_vendor_banned = "b"
                    this.setState(({ loadings }) => ({
                        headers: temp
                    }))
                } else {
                    this.getUUID()
                }
            }
            this.getRangkingAuctionVendor()
            this.getBidDetailAuctionVendor()
        } else if (dt.type === "auction_pause") {
            let temp = this.state.headers
            if (dt.responses.is_pause === "y") {
                temp.isFreeze = "y"
                temp.is_pause = "y"
                this.setState({ headers: temp })
            } else if (dt.responses.is_pause === "n") {
                this.getUUID()
            }
        } else if (dt.type === "auction_stop") {
            this.getUUID()
        }



    }

    handleIncrement(i, data) {
        if (this._isMounted) {
            if (this.state.headers?.isFreeze === "y") {
                toastr.warning('waktu ada di frezee')
            } else {
                let arr = []
                let discount = this.state.increment_decrement_paket_discount
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loading_data_bid: true },
                }));
                this.state.bids.forEach((element, j) => {
                    if(i==="paket"){
                        element.settingvalue = element.settingvalue === undefined ? data : parseFloat(element.settingvalue) + parseFloat(data);
                        arr.push(element)
                    }else{
                        if (i === j) {
                            element.settingvalue = element.settingvalue === undefined ? data : parseFloat(element.settingvalue) + parseFloat(data);
                            arr.push(element)
                        } else {
                            arr.push(element)
                        }
                    }  
                    discount = element.settingvalue                  
                });
                setTimeout(() => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_data_bid: false },
                        bids: arr,
                        increment_decrement_paket_discount : discount
                    }));
                }, 100);
            }
        }
    }

    handleDecrement(i, data) {
        if (this._isMounted) {
            if (this.state.headers?.isFreeze === "y") {
                toastr.warning('waktu ada di frezee')
            } else {
                let arr = []
                let discount = this.state.increment_decrement_paket_discount
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loading_data_bid: true },
                }));
                this.state.bids.forEach((element, j) => {
                    if(i==="paket"){
                        element.settingvalue = element.settingvalue === undefined || element.settingvalue === 0 ? 0 : parseFloat(element.settingvalue) - parseFloat(data);
                        if (element.settingvalue <= 0) element.settingvalue = 0;
                        arr.push(element)
                        discount = element.settingvalue
                    }else{
                        if (i === j) {
                            element.settingvalue = element.settingvalue === undefined || element.settingvalue === 0 ? 0 : parseFloat(element.settingvalue) - parseFloat(data);
                            if (element.settingvalue <= 0) element.settingvalue = 0;
                            arr.push(element)
                        } else {
                            arr.push(element)
                        }
                        discount = element.settingvalue
                    }                    
                });
                setTimeout(() => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_data_bid: false },
                        bids: arr,
                        increment_decrement_paket_discount : discount
                    }));
                }, 100);
            }
        }
    }

    handleChange(i, data) {
        if (this._isMounted) {
            let arr = []
            this.state.bids.forEach((element, j) => {
                if(i==="paketdiscount"){
                    element.settingvalue = data.floatValue;
                    arr.push(element)
                }else{
                    if (i === j) {
                        element.settingvalue = data.floatValue;
                        arr.push(element)
                    } else {
                        arr.push(element)
                    }
                }
            });
            this.setState({
                bids: arr,
                increment_decrement_paket_discount : data.floatValue
            });            
        }
    }

    changeFreeze() {
        if (this._isMounted) {
            this.setState(({ headers }) => ({
                headers: { ...headers, isFreeze: "y" },
            }));
            if (this.state.headers.is_vendor_banned !== "b") {
                this.storeAuctionVendorFreeze()
            }
        }
    }

    onCompleteWaitingTimes() {
        if (this._isMounted) {
            this.getUUID()
        }
    }

    onRefreshButton() {
        if (this._isMounted) {
            this.getUUID()
            this.getRangkingAuctionVendor();
            this.getBidDetailAuctionVendor();
        }
    }

    render() {
        // let rows;
				const { data } = this.props.userDt;
				const { messages } = this.state.history_chat;

        return (
            <div>
                <Form
                    loadings={this.state.loadings}
                    headers={this.state.headers}
                    rangkings={this.state.rangkings}
                    tabulations={this.state.tabulations}
                    bids={this.state.bids}
                    onRefreshButton={() => this.onRefreshButton()}
                    akumulasi_ranking={this.state.akumulasi_ranking}
                    vendor_id={this.props.user}
                    handleIncrement={(i, data) => this.handleIncrement(i, data)}
                    handleDecrement={(i, data) => this.handleDecrement(i, data)}
                    handleChange={(i, data) => this.handleChange(i, data)}
                    tongleOpenHistory={(data) => this.tongleOpenHistory(data)}
                    storeBidDetailAuctionVendor={(payload) => this.storeBidDetailAuctionVendor(payload)}
                    changeFreeze={() => this.changeFreeze()}
                    onCompleteWaitingTimes={() => this.onCompleteWaitingTimes()}
                    waiting_socket_times={this.state.waiting_socket_times}
                    sisa_auction_socket_times={this.state.sisa_auction_socket_times}
                    sisa_freeze_socket_times={this.state.sisa_freeze_socket_times}
                    bid_errors = {this.state.bid_errors}
                    increment_decrement_paket_discount = {this.state.increment_decrement_paket_discount}
                    socket_timer= {this.state.socket_timer}
                    scores = {this.state.scores}
                    access={this.props.access}
                />

								{!this.state.loadchat &&
									<ChatBox 
										users={data} 
										ws={this.ClientChat} 
										parentState={this.state} 
										toggleOpenChat={() => this.toggleOpenChat}
										newMessage={(msg) => this.newMessage(msg)}
										loadchat={this.state.incomingChat}
										setMsgUnRead={() => this.setMsgUnRead}
										messages={messages}
									/>}

                <Modal isOpen={this.state.modalHistory} toggle={() => this.tonggleCloseModalItem()} className="modal-lg">
                    <ModalHeader toggle={() => this.tonggleCloseModalItem()}>History Bid</ModalHeader>
                    <div className="col-lg-12 m-t-10 m-b-10">
                        <Panel>
                            <PanelHeader>
                                Detail Item
                            </PanelHeader>
                            <PanelBody>
                                {this.state.loadings.loading_data_modal_history && (
                                    <center>
                                        <br />
                                        <ReactLoading type="cylon" color="#0f9e3e" />
                                        <br />
                                    </center>
                                )}
                                {!this.state.loadings.loading_data_modal_history &&
                                    <History
                                        headerhistory={this.state.headerhistory}
                                        data={this.state.dataHistory}
                                        header={this.state.copsHistory}
                                    />
                                }
                            </PanelBody>
                            <PanelFooter>
                                <button className="btn btn-sm btn-white pull-right" type="button" onClick={() => this.tonggleCloseModalItem()}>
                                    Back
                                </button>
                            </PanelFooter>
                        </Panel>
                    </div>
                </Modal>
                <Modal isOpen={this.state.aggrementModal} className="modal-lg">
                    <ModalHeader>Auction Agreement Type</ModalHeader>
                    <div className="col-lg-12 m-t-10 m-b-10">
                        <Panel>
                            <FormAgrement
                                data={this.state.dataAggrement}
                                loadings={this.state.loadings}
                                storeAuctionVendorAggrement={(payload) => this.storeAuctionVendorAggrement(payload)}
                            />
                        </Panel>
                    </div>
                </Modal>

                <Modal isOpen={this.state.modal_update_penawaran_jasa} className="modal-lg">
                    <ModalHeader>Update Penawaran</ModalHeader>
                    <div className="col-lg-12 m-t-10 m-b-10">
                        <Panel>
                            {this.state.loadings.loading_data_price_update && (
                                <center>
                                    <br />
                                    <ReactLoading type="cylon" color="#0f9e3e" />
                                    <br />
                                </center>
                            )}

                            {!this.state.loadings.loading_data_price_update &&
                                <FormUpdatePenawaranJasa
                                    data={this.state.arrPenawaran}
                                    loadings={this.state.loadings}
                                    storeDetailUpdateHarga={(payload) => this.storeDetailUpdateHarga(payload)}
                                />
                            }
                        </Panel>
                    </div>
                </Modal>
            </div>
        )
    }
}
const stateToProps = state => {
    return {
        sidebarDt: state.sidebarDt,
        access: state.sidebarDt.access,
        user: state.auth.user.data,
        chat: state.chat.history_chat,
		userDt: state.auth.user,
    }
}

const dispatchToProps = dispatch => {
    return {
        getDetailAuctionVendor: (id) => dispatch(getDetailAuctionVendor(id)),
        getTabulationAuctionVendor: (id) => dispatch(getTabulationAuctionVendor(id)),
        getRangkingAuctionVendor: (id) => dispatch(getRangkingAuctionVendor(id)),
        getBidDetailAuctionVendor: (id, vendor_id) => dispatch(getBidDetailAuctionVendor(id, vendor_id)),
        storeAuctionVendorAggrement: (id, payload) => dispatch(storeAuctionVendorAggrement(id, payload)),
        storeAuctionVendorFreeze: (id, vendor_id) => dispatch(storeAuctionVendorFreeze(id, vendor_id)),
        getDetailUpdateHarga: (id, vendor_id) => dispatch(getDetailUpdateHarga(id, vendor_id)),
        getScoreVendor: (id, vendor_id) => dispatch(getScoreVendor(id, vendor_id)),
        storeBidDetailAuctionVendor: (id, vendor_id, payload) => dispatch(storeBidDetailAuctionVendor(id, vendor_id, payload)),
        getHistoryAuctionVendor: (id, vendor_id, payload) => dispatch(getHistoryAuctionVendor(id, vendor_id, payload)),
        storeDetailUpdateHarga: (id, vendor_id, payload) => dispatch(storeDetailUpdateHarga(id, vendor_id, payload)),
				fetchChat: (payload) => dispatch(fetchChat(payload)),
        appendChat: (payload) => dispatch(appendChat(payload)),
        unreadChatBuyer: (payload) => dispatch(unreadChatBuyer(payload)),
        unreadChatVendor: (payload) => dispatch(unreadChatVendor(payload)),
        clearChatState: (payload) => dispatch(clearChatState(payload)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(DetailAuctionVendor));
