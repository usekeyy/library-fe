import React from 'react';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
// import { formatNumber } from '../../../../../helpers/formatNumber'

const Header = (props) => {
    const { t } = props;

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Header</PanelHeader>
                <PanelBody>
                    <Row>
                        <Col sm="12">
                          
                            <div className="row">
                                <label className="col-sm-3 col-form-label">{t("evaluation:label.no-proposal-tender")}</label>
                                <div className="col-sm-9">
                                    <input type="text" readOnly className="form-control-plaintext" defaultValue={(props.proposal_tender_no===undefined || props.proposal_tender_no===null)? ":" : ": "+props.proposal_tender_no} />
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">{t("evaluation:label.description")}</label>
                                <div className="col-sm-9">
                                    <input type="text" readOnly className="form-control-plaintext" defaultValue={props.description===null? ":" : ": "+props.description} />
                                </div>
                            </div>

                            {props.vendor!==undefined && <div className="row">
                                <label className="col-sm-3 col-form-label">Vendor</label>
                                <div className="col-sm-9">
                                    <input type="text" readOnly className="form-control-plaintext" defaultValue={props.vendor_name===null? ":" : ": "+props.vendor_name} />
                                </div>
                            </div>
                            }
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Status</label>
                                <div className="col-sm-9">
                                    <input type="text" readOnly className="form-control-plaintext" defaultValue={props.status===null? ":" : ": "+props.status} />
                                </div>
                            </div>
                        </Col>
                    </Row>                    
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(Header);