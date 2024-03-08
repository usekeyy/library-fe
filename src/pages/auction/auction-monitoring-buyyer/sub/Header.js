import React from 'react';
import { withTranslation } from 'react-i18next';
// import { Row, Col } from 'reactstrap';
import { Panel, PanelBody, PanelHeader } from '../../../../containers/layout/sub/panel/panel';
import { formatDate } from '../../../../helpers/formatDate';
import { statusAuction } from '../../../../helpers/statusName';
import Countdown from 'react-countdown';
// import moment from 'moment';
import ReactLoading from 'react-loading';


const Header = (props) => {
    const { t } = props;
		// const clockRef= useRef()
		const [isStart, setStart] = React.useState(true);
		const [isStop, setStop] = React.useState(false);

		const handleStart = () => {
			// clockRef.current.start()
            props.pauseResumeAuction()
			setStart(true);
		};

  	const handlePause = () => {
			// clockRef.current.pause()
            props.pauseResumeAuction()
            
			setStart(false)
		};

  	const handleStop = () => {
			// clockRef.current.pause()
            props.stopAuction()
			setStop(true)
			setStart(false)
		};

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Header</PanelHeader>
                <PanelBody>
                    {props.loadings.loading_header_panel &&
                        <PanelBody>
                            <center>
                                <br />
                                <ReactLoading type="cylon" color="#0f9e3e" />
                                <br />
                            </center>
                        </PanelBody>
                    }
                    {!props.loadings.loading_header_panel &&
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="row">
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
                                    <label className="col-sm-4 col-form-label">{t("auction:label.status")}</label>
                                    <div className="col-sm-8">
                                    <label className=" col-form-label">: {(props.data?.status !== undefined && props.data?.status !== null)? 
                                        (props.data.status==="p") ? (Date.now() < new Date(props.data.start_auction)) ? "Waiting" : (Date.now() > new Date(props.data.start_auction) && Date.now() < new Date(props.data.end_auction)) ? "Live" : "Done" : 
                                        statusAuction(props.data.status) : ''}
                                    </label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <table className="table-none" width="100%">
                                    <tbody>
                                        <tr style={{ padding: "10px" }} height="80">
                                            <td height="50" style={{ fontSize: "40px", fontWeight: "bold", textAlign: "center" }}>
																				
                                                <Countdown
                                                    daysInHours={true}
                                                    date={Date.now() + props.data.date}
													// ref={clockRef}
                                                />
                                            </td>
                                        </tr>
                                        {(props.data?.status !== "y" && props.data?.status !== "s") &&
                                            <tr>
                                                <td align="center">
                                                    {!isStop && <button className="btn btn-sm btn-white m-r-5"
                                                        type="button"
                                                        onClick={isStart ? handlePause : handleStart }
                                                    >
                                                        {isStart ? 'PAUSE' : 'START'}
                                            				</button>}
                                                    <button className="btn btn-sm btn-danger" type="button"
                                                        onClick={handleStop} disabled={isStop}
                                                    >
                                                        {isStop ? 'STOPPED' : 'STOP'}
                                            				</button>
                                                </td>
                                            </tr>
                                        }
                                        <tr>
                                            <td></td>
                                        </tr>
                                        {props.data?.status !== "y" &&
                                            <tr><td align="center">
                                                <button className="btn btn-sm btn-white "
                                                    type="button"
                                                    onClick={() => props.openModal()}>
                                                    Create Berita Acara
                                        </button>
                                            </td>
                                            </tr>
                                        }
                                        <tr><td></td></tr>
                                        <tr>
                                            <td align="center">
                                                {/* {props.data?.status !== "y" &&
                                                    <button className="btn btn-sm btn-white m-r-5"
                                                        type="button"
                                                        onClick={() => alert('Edit berita acara')}>
                                                        Edit Berita Acara
                                                </button>
                                                } */}
                                                <button className="btn btn-sm btn-white m-r-5"
                                                    type="button"
                                                    disabled={props.loadings.loading_download_berita_acara}
                                                    onClick={() => props.downloadBeritaAcara()}>
                                                    {props.loadings.loading_download_berita_acara && <i className="fa fa-spinner fa-spin"></i>}
                                                Download Berita Acara
                                        </button>
                                                {props.data?.status !== "y" &&
                                                    <button className="btn btn-sm btn-white m-r-5"
                                                        type="button"
                                                        disabled={props.loadings.loading_close_auction}
                                                        onClick={() => props.storeCloseAuction()}>
                                                        {props.loadings.loading_close_auction && <i className="fa fa-spinner fa-spin"></i>}
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
}

export default withTranslation()(Header);