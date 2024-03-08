import React from 'react';
import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
// import { formatNumber } from '../../../../helpers/formatNumber';
// import moment from 'moment';

const Header = (props) => {
    // const { t } = props;
    const { register } = useFormContext();
	const handleChangeHeaderText = (e) => {
        props.setOption(e.target.value, 'header-text')
	}
    const { outline_agreement } = props.data

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Header</PanelHeader>
                <PanelBody>
                    <Row>
                        <Col sm="12">
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Vendor</label>
                                <div className="col-sm-10">
                                    <input type="text" readOnly={true} name="status" ref={register({})} className="form-control" placeholder="" defaultValue={(outline_agreement.vendor_id + ' - ' + outline_agreement.vendor_name)} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">No OA Eproc</label>
                                <div className="col-sm-10">
                                    <input type="text" readOnly={true} name="no_po" ref={register({})} className="form-control" placeholder="" defaultValue={outline_agreement.number || ''} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">No OA SAP</label>
                                <div className="col-sm-10">
                                    <input type="text" readOnly={true} name="no_po" ref={register({})} className="form-control" placeholder="" defaultValue={outline_agreement.sap_number || ''} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">No Proposal Tender</label>
                                <div className="col-sm-10">
                                    <input type="text" readOnly={true} name="no_po" ref={register({})} className="form-control" placeholder="" defaultValue={outline_agreement.proposal_tender_number !==undefined ? outline_agreement.proposal_tender_number : ''} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Header Text</label>
                                <div className="col-sm-10">
                                    {props.data.created_by === props.user.uuid && props.data.status === 'd' ? 
                                        <textarea onChange={(e) => handleChangeHeaderText(e)} name="header_text" ref={register({})} className="form-control" placeholder="" defaultValue={props.param_input.header_text}/> : 
                                        <textarea readOnly={true} name="header_text" ref={register({})} className="form-control" placeholder="" defaultValue={props.data.header_text}/>
                                    }
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Status</label>
                                <div className="col-sm-10">
                                    <input type="text" readOnly={true} name="status" ref={register({})} className="form-control" placeholder="" defaultValue={outline_agreement.status_text !==undefined ? outline_agreement.status_text : ''} />
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