import React ,{useRef, useEffect} from 'react';
import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelBody, PanelHeader } from '../../../../../containers/layout/sub/panel/panel';
import { formatDate } from '../../../../../helpers/formatDate';
import ReactLoading from 'react-loading';
import moment from 'moment';
import Countdown from 'react-countdown';
import { statusAuction } from '../../../../../helpers/statusName';

const Header = (props) => {
    const { t } = props;

    const data = props
    const clockRef= useRef()
    useEffect(()=>{  
    },[data])
    // const [loading] = React.useState(false)
    const { register } = useFormContext();

    const changeValue = () => {
        props.changeFreeze()
    }

    const onCompleteWaitingTimes = () => {
        props.onCompleteWaitingTimes()
    }

    // clockRef.current.pause()

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Header</PanelHeader>
                {props.loadings.loading_data_header &&
                    <PanelBody>
                        <center>
                            <br />
                            <ReactLoading type="cylon" color="#0f9e3e" />
                            <br />
                        </center>
                    </PanelBody>
                }
                {!props.loadings.loading_data_header && 
                <PanelBody>
                    <div className="row">
                        <div className="col-sm-6">                           
                            <div className="row">
                                <input type="hidden" ref={register()} name="auction_id" value={props.data?.auctions_id} />
                                <label className="col-sm-4 col-form-label">{t("auction:label.no-auction")}</label>
                                <div className="col-sm-8">
                                    <label className=" col-form-label">: {props.data?.auction_number !== undefined ? props.data.auction_number : ''}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-4 col-form-label">{t("auction:label.no-proposal-tender")}</label>
                                <div className="col-sm-8">
                                    <label className=" col-form-label">: {props.data?.proposal_tender_no !== undefined ? props.data.proposal_tender_no : ''}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-4 col-form-label">{t("auction:label.buyyer-name")}</label>
                                <div className="col-sm-8">
                                    <label className=" col-form-label">: {props.data?.created_by_name !== undefined ? props.data.created_by_name : ''}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-4 col-form-label">{t("auction:label.description")}</label>
                                <div className="col-sm-8">
                                    <label className=" col-form-label">: {props.data?.auction_description !== undefined ? props.data.auction_description : ''}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-4 col-form-label">{t("auction:label.start-date-auction")}</label>
                                <div className="col-sm-8">
                                    <label className=" col-form-label">: {props.data?.start_auction !== undefined ? formatDate(props.data.start_auction, true) : ''}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-4 col-form-label">{t("auction:label.finish-date-auction")}</label>
                                <div className="col-sm-8">
                                    <label className=" col-form-label">: {props.data?.end_auction !== undefined ? formatDate(props.data.end_auction, true) : ''}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-4 col-form-label">Increment / Decrement</label>
                                <div className="col-sm-8">
                                    <label className=" col-form-label">: {props.data?.increment_decrement !== undefined ? props.data.increment_decrement : ''}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-4 col-form-label">Status</label>
                                <div className="col-sm-8">
                                    <label className=" col-form-label">: {(props.data?.status !== undefined && props.data?.status !== null)? 
                                        (props.data.status==="p") ? (new Date(props.socket_timer) < new Date(props.data.start_auction)) ? "Waiting" : (new Date(props.socket_timer) > new Date(props.data.start_auction) && new Date(props.socket_timer) < new Date(props.data.end_auction)) ? "Live" : "Done" : 
                                        statusAuction(props.data.status) : ''}
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <table className="table-bordered table-striped" width="100%">
                                <tbody>
                                {(props.data.status==="s" || props.data.status==="y" ) &&
                                    <tr>
                                        <td colSpan="2" style={{backgroundColor:"red", fontSize:"20px", fontWeight:"bold" , color:"white", textAlign:"center" }}>
                                            AUCTION TELAH BERAKHIR
                                        </td>
                                    </tr>
                                }
                                {props.data.is_waiting && <tr style={{padding:"10px"}} height="80">
                                    <td style={{fontSize:"14px" , textAlign:"center"}}>Waiting Time Auction</td>
                                    <td height="50" style={{fontSize:"40px" , fontWeight:"bold", textAlign:"center"}}>
                                            <Countdown 
                                                daysInHours={true} 
                                                date={moment(props.data.waiting_times).format()} 
                                                onComplete={onCompleteWaitingTimes}
                                            />                                         
                                    </td>
                                </tr>
                                }
                                <tr style={{padding:"10px"}} height="80">
                                    <td style={{fontSize:"14px" , textAlign:"center"}}>Waktu Sisa Auction</td>
                                    <td height="50" style={{fontSize:"40px" , fontWeight:"bold", textAlign:"center"}}>
                                            <Countdown 
                                                daysInHours={true} 
                                                onComplete={changeValue}
                                                // date={moment(data.data.count_down_timer).format()} 
                                                autoStart={data.data.timer_is_pause}
                                                now={moment(new Date()).format()}
                                                // onStop={data.data.timer_is_pause}
                                                ref={clockRef}
                                            />                                   
                                    </td>
                                </tr>
                                <tr style={{padding:"10px"}} height="30">
                                    <td style={{fontSize:"14px" , textAlign:"center"}}>Waktu Sisa Freeze</td>
                                    <td height="50" style={{fontSize:"40px" , fontWeight:"bold", textAlign:"center"}}>
                                            
                                            <Countdown 
                                                daysInHours={true}
                                                date={moment(data.data.date_auction).format()} 
                                                onComplete={changeValue}
                                                autoStart={data.data.timer_is_pause}
                                            />                                         
                                    </td>
                                </tr>
                                {props.data.is_vendor_banned==="b" &&
                                    <tr>
                                        <td colSpan="2" style={{backgroundColor:"red", fontSize:"18px", fontWeight:"bold" , color:"white", textAlign:"center" }}>
                                            BANNED
                                        </td>
                                    </tr>
                                }
                                {(props.data.status!=="s" && props.data.status!=="y") &&
                                <tr style={{backgroundColor:"white"}}>
                                    <td colSpan="2" align="center" className="m-t-10">
                                        <button className="btn btn-xl btn-info" onClick={()=>props.onRefreshButton()} >Refresh</button>
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
}

export default withTranslation()(Header);
