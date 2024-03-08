import React from 'react';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
import { formatDate } from '../../../../helpers/formatDate';

const HeaderVendor = (props) => {
    const { t } = props;

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Header</PanelHeader>
                <PanelBody>
                    <Row>
                        <Col sm="12">
                            {props.user.has_roles.includes("BYR001") &&
                            <div className="form-group row">
                                <label className="col-sm-3 col-form-label">{t("aanwijzing:label.created-by")}</label>
                                <div className="col-sm-9">
                                    <input type="text" readOnly className="form-control-plaintext" defaultValue={props.title===null? ":" : ": "+props.created_by_name}/>
                                </div>
                            </div>
                            }
                            <div className="form-group row">
                                <label className="col-sm-3 col-form-label">{t("aanwijzing:label.packet-number")}</label>
                                <div className="col-sm-9">
                                    <input type="text" readOnly className="form-control-plaintext" defaultValue={(props.proposal_tender_no===undefined || props.proposal_tender_no===null)? ":" : ": "+props.proposal_tender_no} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-3 col-form-label">{t("aanwijzing:label.packet-title")}</label>
                                <div className="col-sm-9">
                                    <input type="text" readOnly className="form-control-plaintext" defaultValue={props.title===null? ":" : ": "+props.title} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-3 col-form-label">{t("aanwijzing:label.start-date")}</label>
                                <div className="col-sm-9">
                                    <input type="text" readOnly className="form-control-plaintext" defaultValue={props.start_date===null? ":" : ": "+formatDate(props.start_date, true)} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-3 col-form-label">{t("aanwijzing:label.end-date")}</label>
                                <div className="col-sm-9">
                                    <input type="text" readOnly className="form-control-plaintext" defaultValue={props.end_date===null? ":" : ": "+formatDate(props.end_date, true)} />
                                </div>
                            </div>
                            {props.user.has_roles.includes("VNDR01") &&
                            <div className="form-group row">
                                <label className="col-sm-3 col-form-label">{t("aanwijzing:label.note-aanwijzing")}</label>
                                <div className="col-sm-9">
                                    <input type="text" readOnly className="form-control-plaintext" defaultValue={(props.note_aanwijzing===null || props.note_aanwijzing===undefined)? ":" : ": "+props.note_aanwijzing} />
                                </div>
                            </div>
                            }
                        </Col>
                    </Row>

                    {props.user.has_roles.includes("BYR001") &&
                    <Row>
                        <Col sm="12">
                        { props.status_aanwijzing!=="close" && <button type="button" onClick={()=> props.modalUpload()} className="m-r-10 btn btn-light">Upload Aanwijzing Manual</button>}
                        <button type="button" className="m-r-10 btn btn-light" onClick={(e) => props.downloadBeritaAcaraAanwijzing(e)} disabled={props.loadings.loading_preview_berita_acara}>
                            {props.loadings.loading_preview_berita_acara && <i className="fas fa-spinner fa-pulse"></i>}
                            Preview Berita Acara
                        </button>
                        { props.status_aanwijzing!=="close" &&  <button type="button" className="m-r-10 btn btn-light" onClick={(e)=> props.closeAanwijzing(e)} disabled={props.loadings.loading_close_aanwijzing}>
                            {props.loadings.loading_close_aanwijzing &&  <i className="fas fa-spinner fa-pulse"></i> }
                            Close And Publish Berita Acara
                        </button>}
                        </Col>
                    </Row>
                    }
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(HeaderVendor);