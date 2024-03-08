import React from 'react';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
import { formatNumber } from '../../../../helpers/formatNumber';

const Header = (props) => {
   const {t} = props

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Header</PanelHeader>
                <PanelBody>
                    <Row>
                        <Col sm="12">
                            {props.user.has_roles.includes("BYR001") &&
                            <div className="row">
                                <label className="col-sm-3 col-form-label">{t("bidOpening:label.created-by")}</label>
                                <div className="col-sm-9">
                                    <input type="text" readOnly className="form-control-plaintext" defaultValue={props.created_by_name===undefined? ":" : ": "+props.created_by_name}/>
                                </div>
                            </div>
                            }
                            <div className="row">
                                <label className="col-sm-3 col-form-label">No Proposal Tender</label>
                                <div className="col-sm-9">
                                    <input type="text" readOnly className="form-control-plaintext" defaultValue={(props.proposal_tender_no===undefined || props.proposal_tender_no===null)? ":" : ": "+props.proposal_tender_no} />
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">{t("bidOpening:label.reference")}</label>
                                <div className="col-sm-9">
                                    <input type="text" readOnly className="form-control-plaintext" defaultValue={props.reference===null? ":" : ": "+props.reference} />
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">{t("bidOpening:label.proposal-tender-title")}</label>
                                <div className="col-sm-9">
                                    <input type="text" readOnly className="form-control-plaintext" defaultValue={props.title===null? ":" : ": "+props.title} />
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">{t("bidOpening:label.proposal-tender-value")}</label>
                                <div className="col-sm-9">
                                    <input type="text" readOnly className="form-control-plaintext" defaultValue={props.total_value===null? ":" : ": "+formatNumber(props.total_value,2)} />
                                </div>
                            </div>
                        </Col>
                    </Row>

                    {props.user.has_roles.includes("BYR001") &&
                    <Row>
                        <Col sm="12">              
                        {(new Date(localStorage.getItem("times")).getTime()/1000 > new Date(props.closing_date).getTime()/1000) && props.metode_penyampaian_id ==="1s" && (props.bid_administrasi===null && props.bid_comersil===null) && <button disabled={props.loadings.loadingOpenBid}  type="button" className="m-r-10 btn btn-light" onClick={(e)=> props.OpenBid(e)}> {props.loadings.loadingOpenBid && <i className="fa fa-spinner fa-spin"></i> } Open Bid</button>}
                        {(new Date(localStorage.getItem("times")).getTime()/1000 > new Date(props.closing_date).getTime()/1000) && props.metode_penyampaian_id ==="1t" && (props.bid_administrasi===null && props.bid_comersil===null) && <button disabled={props.loadings.loadingOpenBid}  type="button" className="m-r-10 btn btn-light" onClick={(e)=> props.OpenBid(e)}> {props.loadings.loadingOpenBid && <i className="fa fa-spinner fa-spin"></i> } Open Bid</button>}
                        {(new Date(localStorage.getItem("times")).getTime()/1000 > new Date(props.closing_date).getTime()/1000) && props.metode_penyampaian_id ==="2s" && (props.bid_administrasi===null && props.bid_comersil===null) && <button type="button" className="m-r-10 btn btn-light"  onClick={(e)=> props.OpenBid(e)}>Open Bid Technical</button>}
                        {(new Date(localStorage.getItem("times")).getTime()/1000 > new Date(props.closing_date).getTime()/1000) && props.metode_penyampaian_id ==="2s" && (props.bid_administrasi!==null && props.bid_comersil===null) && <button type="button" className="m-r-10 btn btn-light"  onClick={(e)=> props.OpenBid(e)}>Open Bid Commersial</button>}
                        {(new Date(localStorage.getItem("times")).getTime()/1000 > new Date(props.closing_date).getTime()/1000) && props.metode_penyampaian_id ==="2t" && (props.bid_administrasi===null && props.bid_comersil===null) && <button type="button" className="m-r-10 btn btn-light"  onClick={(e)=> props.OpenBid(e)}>Open Bid Technical</button>}
                        {(new Date(localStorage.getItem("times")).getTime()/1000 > new Date(props.closing_date).getTime()/1000) && props.metode_penyampaian_id ==="2t" && (props.bid_administrasi!==null && props.bid_comersil===null) && <button type="button" className="m-r-10 btn btn-light"  onClick={(e)=> props.OpenBid(e)}>Open Bid Commersial</button>}
                        { (props.bid_administrasi!==null && props.bid_comersil!==null) && <button type="button" className="m-r-10 btn btn-light" onClick={(e)=> props.downloadBapp(e)}>Preview Berita Acara</button>}
                        { (props.bid_administrasi!==null && props.bid_comersil!==null) && <button type="button" disabled={props.bid_opening_bapp ==="publish" ? true : false} className="m-r-10 btn btn-light" onClick={(e)=> props.publishBidOpening(e)}>  {props.loadings.loading_publish_bid_opening && <i className="fa fa-spinner fa-spin"></i> } Publish Berita Acara</button>}
                        <button type="button" disabled={!props.retender_isactive} className="m-r-10 btn btn-light" onClick={(e)=> props.modalRetenderOpen(e)}> {props.loadings.loadingReTender && <i className="fa fa-spinner fa-spin"></i> } Retender</button> 
                        </Col>
                    </Row>
                    }
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(Header);