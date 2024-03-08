import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import ReactLoading from 'react-loading';
// import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import { getPenawaranVendor , storePenawaranVendor } from '../../../../store/actions/auction/monitoringBuyyerActions';
import HeaderClassBase from './sub/HeaderClassBase';
import Peserta from './sub/Peserta';
// import TabulationAuction from './sub/TabulationAuction';
import Penawaran from './sub/Penawaran';
import { PanelBody, Panel } from '../../../../containers/layout/sub/panel/panel';
import moment from 'moment';

class BuyerInputBid extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            loading: false,
            socket_url: `${process.env.REACT_APP_WEBSOCKET_URL}` + this.props.match.params.id,
            socket_timer: new Date(localStorage.getItem('times')),
            loadings: {
                loading_header_panel: true,
                loading_submit_bid: false,
            },

        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.getUUID();

        let socket = new WebSocket(this.state.socket_url);
        socket.binaryType = "arraybuffer"
        socket.onmessage = (event) => {
            let tex = new TextDecoder("utf-8").decode(event.data)
            this.handleWebsocket(tex)
        }

        let timer_socket = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_URL}time/jakarta`);
        timer_socket.onmessage = (event) => {
            this.handleSocketTimer(event.data)
            // //console.log(event.data)
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback) => {
            return;
        };
    }

    handleSocketTimer(data) {
        //    if(this.state.socket_timer===""){
        this.setState({
            socket_timer: data
        })
        //    }
    }

    getUUID() {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_header_panel: true, loading_peserta_panel: true },
            }));
            this.props.getPenawaranVendor(this.props.match.params.id, this.props.match.params.vendor_id)
                .then((resp) => {
                    let datas = resp.data.data;
                    console.log(datas)
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
                    console.log(datas.header)
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_header_panel: false, loading_peserta_panel: false },
                        data: datas
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

    onCompleteWaitingTimes() {
        if (this._isMounted) {
            this.getUUID()
        }
    }

    storePenawaranVendor = (payload) => {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_submit_bid: true },
            }));
            this.props.storePenawaranVendor(this.props.match.params.id, this.props.match.params.vendor_id, payload)
                .then(resp => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_submit_bid: false },
                    }));
                    this.getUUID()
                    toastr.success(resp.data.status, resp.data.message);
                })
                .catch(resp => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_submit_bid: false },
                    }));
                    toastr.error(resp.data.status, resp.data.message);
                })
        }
    }

    back = () => {
        this.props.history.push('/auction/monitoring-buyyer/' + this.props.match.params.id)
    }


    render() {
        // const { t } = this.props;
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Auction</li>
                    <li className="breadcrumb-item">Monitoring Buyer</li>
                </ol>
                <h1 className="page-header">Proses auction</h1>

                {this.state.loadings.loading_header_panel &&
                    <div className="row">
                        <div className="col-sm-12">
                            <Panel>
                                <PanelBody>
                                    <center>
                                        <br />
                                        <ReactLoading type="cylon" color="#0f9e3e" />
                                        <br />
                                    </center>
                                </PanelBody>
                            </Panel>
                        </div>
                    </div>
                }
                {!this.state.loadings.loading_header_panel &&
                    <div className="row">
                        <div className="col-lg-12">
                            <HeaderClassBase
                                loadings={this.state.loadings}
                                socket_timer={this.state.socket_timer}
                                data={this.state.data.header}
                                onCompleteWaitingTimes={() => this.onCompleteWaitingTimes()}
                            />
                            <Peserta
                                loadings={this.state.loadings}
                                data={this.state.data.list_peserta}
                                header={this.state.data.header}
                            />

                            <Penawaran
                                loadings={this.state.loadings}
                                data={this.state.data.detail_item}
                                header={this.state.data.header}
                                socket_timer={this.state.socket_timer}
                                storePenawaranVendor={(payload) => this.storePenawaranVendor (payload)}
                                back={() => this.back ()}
                            />
                        </div>
                    </div>
                }
            </div>
        )
    }
}
const stateToProps = state => {
    return {
        sidebarDt: state.sidebarDt,
        access: state.sidebarDt.access
    }
}

const dispatchToProps = dispatch => {
    return {
        getPenawaranVendor: (id, vendor_id) => dispatch(getPenawaranVendor(id, vendor_id)),
        storePenawaranVendor: (id, vendor_id, payload) => dispatch(storePenawaranVendor(id, vendor_id, payload)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(BuyerInputBid));
