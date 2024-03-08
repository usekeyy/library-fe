import React, { Component } from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelBody, PanelHeader } from '../../../../containers/layout/sub/panel/panel';
import ReactLoading from 'react-loading';
// import moment from 'moment';
// import Countdown from 'react-countdown';
// import SecondCountDown from 'react-countdown';
import { statusAuction } from '../../../../helpers/statusName';
import { formatDate } from '../../../../helpers/formatDate';

class HeaderClassBase extends Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
        this.clockRef = React.createRef()
        this.state = {
            isStart: false,
            isStop: false,
        }
    }

    componentDidMount = () => {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback) => {
            return;
        };
    }

    changeValue = () => {
        this.props.changeFreeze()
    }

    onCompleteWaitingTimes = () => {
        this.props.onCompleteWaitingTimes()
    }

    handleStart = () => {
        // clockRef.current.start()
        this.props.pauseResumeAuction()
        // setStart(true);
        this.setState({ isStart: true })
    };

    handlePause = () => {
        // clockRef.current.pause()
        this.props.pauseResumeAuction()
        this.setState({ isStart: false })
        // setStart(false)
    };

    handleStop = () => {
        // clockRef.current.pause()
        this.props.toggleConfirmStop()
        // setStop(true)
        // setStart(false)
        this.setState({ isStop: true, isStart: false })
    };

    handleToDetail=()=> {
        alert('Detail')
    }


    render() {
        const { t } = this.props;
        return (
            <div>
                <Panel className="margin-bot-false">
                    <PanelHeader>Header</PanelHeader>
                    <PanelBody>
                        {this.props.loadings.loading_header_panel &&
                            <PanelBody>
                                <center>
                                    <br />
                                    <ReactLoading type="cylon" color="#0f9e3e" />
                                    <br />
                                </center>
                            </PanelBody>
                        }
                        {!this.props.loadings.loading_header_panel &&
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="row">
                                        <label className="col-sm-4 col-form-label">{t("auction:label.no-auction")}</label>
                                        <div className="col-sm-8">
                                            <label className=" col-form-label">: <a href={`${process.env.REACT_APP_API_BASE_URL}auction/parameter-auction/${this.props.data.uuid}`} >{this.props.data?.auction_number !== undefined ? this.props.data.auction_number : ''}</a></label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <label className="col-sm-4 col-form-label">{t("auction:label.no-proposal-tender")}</label>
                                        <div className="col-sm-8">
                                            <label className=" col-form-label">: {this.props.data?.proposal_tender_no !== undefined ? this.props.data.proposal_tender_no : ''}</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <label className="col-sm-4 col-form-label">{t("auction:label.buyyer-name")}</label>
                                        <div className="col-sm-8">
                                            <label className=" col-form-label">: {this.props.data?.created_by_name !== undefined ? this.props.data.created_by_name : ''}</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <label className="col-sm-4 col-form-label">{t("auction:label.description")}</label>
                                        <div className="col-sm-8">
                                            <label className=" col-form-label">: {this.props.data?.auction_description !== undefined ? this.props.data.auction_description : ''}</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <label className="col-sm-4 col-form-label">{t("auction:label.start-date-auction")}</label>
                                        <div className="col-sm-8">
                                            <label className=" col-form-label">: {this.props.data?.start_auction !== undefined ? formatDate(this.props.data.start_auction, true) : ''}</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <label className="col-sm-4 col-form-label">{t("auction:label.finish-date-auction")}</label>
                                        <div className="col-sm-8">
                                            <label className=" col-form-label">: {this.props.data?.end_auction !== undefined ? formatDate(this.props.data.end_auction, true) : ''}</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <label className="col-sm-4 col-form-label">{t("auction:label.status")}</label>
                                        <div className="col-sm-8">
                                            <label className=" col-form-label">: {(this.props.data?.status !== undefined && this.props.data?.status !== null) ?
                                                (this.props.data.status === "p") ? (new Date(this.props.socket_timer) < new Date(this.props.data.start_auction)) ? "Waiting" : (new Date(this.props.socket_timer) > new Date(this.props.data.start_auction) && new Date(this.props.socket_timer) < new Date(this.props.data.end_auction)) ? "Live" : "Done" :
                                                    statusAuction(this.props.data.status) : ''}
                                            </label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <label className="col-sm-4 col-form-label">{"Denominasi"}</label>
                                        <div className="col-sm-8">
                                            <label className=" col-form-label">:
																							{this.props.parentState.data?.detail?.denominimilisasi}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <table className="table-bordered table-striped" width="100%">
                                        <tbody>
                                            <tr style={{ padding: "10px" }} height="80">
                                                <td style={{ fontSize: "14px", textAlign: "center" }}>Waiting Time Auction</td>
                                                <td height="50" style={{ fontSize: "40px", fontWeight: "bold", textAlign: "center" }}>
                                                    {this.props.socket_waiting_time}
                                                </td>
                                            </tr>
                                            <tr style={{ padding: "10px" }} height="80">
                                                <td style={{ fontSize: "14px", textAlign: "center" }}>Waktu Sisa Auction</td>
                                                <td height="50" style={{ fontSize: "40px", fontWeight: "bold", textAlign: "center" }}>
                                                    {this.props.socket_count_down_time}
                                                    {/* {this.props.socket_waiting_time==="00:00:00" && this.props.data?.status !== "y" && this.props.data?.status !== "s" && this.onCompleteWaitingTimes} */}
                                                </td>
                                            </tr>
                                            {/* <tr style={{ padding: "10px" }} height="80">
                                                <td style={{ fontSize: "14px", textAlign: "center" }}>Waiting Time Auction</td>
                                                <td height="50" style={{ fontSize: "40px", fontWeight: "bold", textAlign: "center" }}>

                                                    <Countdown
                                                        daysInHours={true}
                                                        onComplete={this.onCompleteWaitingTimes}
                                                        date={moment(this.props.data.waiting_times).format()}
                                                        ref={this.clockRef}
                                                    />
                                                </td>
                                            </tr>
                                            <tr style={{ padding: "10px" }} height="80">
                                                <td style={{ fontSize: "14px", textAlign: "center" }}>Waktu Sisa Auction</td>
                                                <td height="50" style={{ fontSize: "40px", fontWeight: "bold", textAlign: "center" }}>
                                                    <Countdown
                                                        daysInHours={true}
                                                        onComplete={this.onCompleteWaitingTimes}
                                                        autoStart={this.props.data.timer_is_pause}
                                                        date={moment(this.props.data.count_down_timer).format()}
                                                    />
                                                </td>
                                            </tr> */}
                                        </tbody>
                                    </table>
                                    <table className="table-none m-t-10" width="100%">
                                        <tbody>
                                             
                                            {(this.props.data?.status !== "y" && this.props.data?.status !== "s" && (new Date(this.props.socket_timer) < new Date(this.props.data.end_auction))) &&
                                                <tr>
                                                    
                                                    <td align="center" colSpan="2">
                                                        {(this.props.access.U || this.props.access.C) &&
                                                        <button className="btn btn-sm btn-white m-r-5"
                                                            type="button"
                                                            disabled={this.props.loadings.loading_pause_auction}
                                                            onClick={this.props.data.is_pause === "y" ? () => this.handlePause() : () => this.handleStart()}
                                                        >
                                                            {this.props.loadings.loading_pause_auction && <i className="fa fa-spinner fa-spin"></i>}
                                                            {this.props.data.is_pause === "y" ? 'START' : 'PAUSE'}
                                                        </button>
                                                        }
                                                        {(this.props.access.U || this.props.access.C) &&
                                                        <button className="btn btn-sm btn-danger" type="button"
                                                            onClick={() => this.handleStop()}
                                                            disabled={this.state.isStop}
                                                            // disabled={this.props.loadings.loading_stop_auction}
                                                        >
                                                            {this.props.loadings.loading_stop_auction && <i className="fa fa-spinner fa-spin"></i>}
                                                             STOP
                                                        </button>
                                                        }
                                                    </td>
                                                </tr>
                                            }
                                            <tr>
                                                <td colSpan="2">
                                                    <br></br>
                                                </td>
                                            </tr>
                                            {this.props.data?.status !== "n" && this.props.data?.status !== "y" && (this.props.socket_count_down_time==="00:00:00") &&
                                                <tr>
                                                    <td align="center" colSpan="2">
                                                    {(this.props.access.U || this.props.access.C) &&
                                                        <button className="btn btn-sm btn-white "
                                                            type="button"
                                                            onClick={() => this.props.openModal()}>
                                                            Create Berita Acara
                                                        </button>
    }
                                                    </td>
                                                </tr>
                                            }
                                            <tr>
                                                <td colSpan="2">
                                                    <br></br>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center" colSpan="2">
                                                    {/* {this.props.data?.status !== "y" &&
                                                <button className="btn btn-sm btn-white m-r-5"
                                                    type="button"
                                                    onClick={() => alert('Edit berita acara')}>
                                                    Edit Berita Acara
                                            </button>
                                            } */}
                                                    {this.props.data?.status !== "n"  && (this.props.socket_count_down_time==="00:00:00") &&
                                                        <button className="btn btn-sm btn-white m-r-5"
                                                                type="button"
                                                                disabled={this.props.loadings.loading_download_berita_acara}
                                                                onClick={() => this.props.downloadBeritaAcara()}>
                                                                {this.props.loadings.loading_download_berita_acara && <i className="fa fa-spinner fa-spin"></i>}
                                                            Download Berita Acara
                                                    </button>
                                                    }
                                                    {(this.props.access.U || this.props.access.C) && (this.props.data?.status === "s" || (new Date(this.props.socket_timer) > new Date(this.props.data.end_auction))) && this.props.data?.status !== "y" && 
                                                        <button className="btn btn-sm btn-white m-r-5"
                                                            type="button"
                                                            disabled={this.props.loadings.loading_close_auction}
                                                            onClick={() => this.props.toggleConfirmClose()}>
                                                            {this.props.loadings.loading_close_auction && <i className="fa fa-spinner fa-spin"></i>}
                                                            Close Auction
                                                    </button>
                                                    }
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        }
                    </PanelBody>
                </Panel>
            </div>
        );
    };
};


export default withTranslation()(HeaderClassBase);