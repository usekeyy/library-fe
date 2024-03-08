import React, { Component } from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelBody, PanelHeader } from '../../../../../containers/layout/sub/panel/panel';
import { formatDate } from '../../../../../helpers/formatDate';
import ReactLoading from 'react-loading';
// import moment from 'moment';
// import Countdown from 'react-countdown';
// import SecondCountDown from 'react-countdown';
import { statusAuction } from '../../../../../helpers/statusName';
import { formatNumber } from '../../../../../helpers/formatNumber';
class HeaderClassBase extends Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
        this.clockRef = React.createRef()
        this.state = {

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

    render() {
        const { t } = this.props;
        return (
            <div>
                <Panel className="margin-bot-false">
                    <PanelHeader>Header</PanelHeader>
                    {this.props.loadings.loading_data_header &&
                        <PanelBody>
                            <center>
                                <br />
                                <ReactLoading type="cylon" color="#0f9e3e" />
                                <br />
                            </center>
                        </PanelBody>
                    }
                    {!this.props.loadings.loading_data_header &&
                        <PanelBody>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="row">
                                        <input type="hidden" name="auction_id" value={this.props.data?.auctions_id} />
                                        <label className="col-sm-4 col-form-label">{t("auction:label.no-auction")}</label>
                                        <div className="col-sm-8">
                                            <label className=" col-form-label">: {this.props.data?.auction_number !== undefined ? this.props.data.auction_number : ''}</label>
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
                                        <label className="col-sm-4 col-form-label">Increment / Decrement</label>
                                        <div className="col-sm-8">
                                            <label className=" col-form-label">: {this.props.data?.increment_decrement !== undefined ? this.props.data.increment_decrement : ''}</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <label className="col-sm-4 col-form-label">Denominasi</label>
                                        <div className="col-sm-8">
                                            <label className=" col-form-label">: {this.props.data?.denominimilisasi !== undefined ? formatNumber(this.props.data.denominimilisasi,2) : ''}</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <label className="col-sm-4 col-form-label">Status</label>
                                        <div className="col-sm-8">
                                            <label className=" col-form-label">: {(this.props.data?.status !== undefined && this.props.data?.status !== null) ?
                                                (this.props.data.status === "p") ? (new Date(this.props.socket_timer) < new Date(this.props.data.start_auction)) ? "Waiting" : (new Date(this.props.socket_timer) > new Date(this.props.data.start_auction) && new Date(this.props.socket_timer) < new Date(this.props.data.end_auction)) ? "Live" : "Done" :
                                                    statusAuction(this.props.data.status) : ''}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <table className="table-bordered table-striped" width="100%">
                                        <tbody>
                                            {(this.props.data.status === "s" || this.props.data.status === "y" || new Date(this.props.socket_timer) > new Date(this.props.data.end_auction)) &&
                                                <tr>
                                                    <td colSpan="2" style={{ backgroundColor: "red", fontSize: "20px", fontWeight: "bold", color: "white", textAlign: "center" }}>
                                                        AUCTION TELAH BERAKHIR
                                                    </td>
                                                </tr>
                                            }
                                            {(this.props.data.is_pause === "y" && this.props.data.is_pause !== undefined) &&
                                                <tr>
                                                    <td colSpan="2" style={{ backgroundColor: "red", fontSize: "20px", fontWeight: "bold", color: "white", textAlign: "center" }}>
                                                        AUCTION DIPAUSE
                                                    </td>
                                                </tr>
                                            }
                                            {this.props.data.is_waiting && <tr style={{ padding: "10px" }} height="80">
                                                <td style={{ fontSize: "14px", textAlign: "center" }}>Waiting Time Auction</td>
                                                <td height="50" style={{ fontSize: "40px", fontWeight: "bold", textAlign: "center" }}>
                                                    {/* <Countdown
                                                        daysInHours={true}
                                                        onComplete={this.onCompleteWaitingTimes}
                                                        date={moment(this.props.data.waiting_times).format()}
                                                    /> */}
                                                    {this.props.waiting_socket_times}
                                                </td>
                                            </tr>
                                            }
                                            <tr style={{ padding: "10px" }} height="80">
                                                <td style={{ fontSize: "14px", textAlign: "center" }}>Waktu Sisa Auction</td>
                                                <td height="50" style={{ fontSize: "40px", fontWeight: "bold", textAlign: "center" }}>
                                                    {/* <Countdown
                                                        daysInHours={true}
                                                        onComplete={this.changeValue}
                                                        date={moment(this.props.data.count_down_timer).format()}
                                                        autoStart={this.props.data.timer_is_pause}
                                                    // onStop={this.props.data.timer_is_pause}
                                                    // ref={this.clockRef}
                                                    /> */}
                                                    {this.props.sisa_auction_socket_times}
                                                </td>
                                            </tr>
                                            <tr style={{ padding: "10px" }} height="30">
                                                <td style={{ fontSize: "14px", textAlign: "center" }}>Waktu Sisa Freeze</td>
                                                <td height="50" style={{ fontSize: "40px", fontWeight: "bold", textAlign: "center" }}>

                                                    {/* <SecondCountDown
                                                        daysInHours={true}
                                                        onComplete={this.changeValue}
                                                        autoStart={this.props.data.timer_is_pause}
                                                        date={moment(this.props.data.date).format()}
                                                    /> */}
                                                    {this.props.sisa_freeze_socket_times}
                                                </td>
                                            </tr>
                                            {this.props.data.is_vendor_banned === "b" &&
                                                <tr>
                                                    <td colSpan="2" style={{ backgroundColor: "red", fontSize: "18px", fontWeight: "bold", color: "white", textAlign: "center" }}>
                                                        BANNED
                                                    </td>
                                                </tr>
                                            }
                                            {this.props.data.is_freeze === "y" &&
                                                <tr>
                                                    <td colSpan="2" style={{ backgroundColor: "red", fontSize: "18px", fontWeight: "bold", color: "white", textAlign: "center" }}>
                                                        FREEZE
                                                    </td>
                                                </tr>
                                            }
                                            {(this.props.data.status !== "s" && this.props.data.status !== "y") &&
                                                <tr style={{ backgroundColor: "white" }}>
                                                    <td colSpan="2" align="center" className="m-t-10">
                                                        <button className="btn btn-xl btn-info" onClick={() => this.props.onRefreshButton()} >Refresh</button>
                                                    </td>
                                                </tr>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </PanelBody>
                    }
                </Panel>
            </div>
        );
    };
};


export default withTranslation()(HeaderClassBase);