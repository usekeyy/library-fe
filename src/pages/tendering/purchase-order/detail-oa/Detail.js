import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
// import { formatNumber } from '../../../../helpers/formatNumber';

const Detail = (props) => {
    // const { t } = props;
    // const { register } = useFormContext();
    const thStyle = {
        width: '30%',
    };

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Purchase Order</PanelHeader>
                <PanelBody>
                    <Row>
                        <Col sm="12">
                            <div className="form-group row">
                                <div className="col-md-6">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-striped table-sm text-nowrap" align="left">
                                            <tbody>
                                                <tr>
                                                    <th style={thStyle}>No. Tender</th>
                                                    <td>
                                                        <a target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}tendering/monitoring-tender-buyer/detail/${props.data.proposal_tender_uuid}`} >{props.data.proposal_tender_number}</a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th style={thStyle}>Judul Tender</th>
                                                    <td>{props.data.proposal_tender_title}</td>
                                                </tr>
                                                <tr>
                                                    <th style={thStyle}>Vendor</th>
                                                    <td>{props.data.vendor_id} - {props.data.vendor_name}</td>
                                                </tr>
                                                <tr>
                                                    <th style={thStyle}>Incoterm</th>
                                                    <td>{props.data.incoterm_id} - {props.data.incoterm_name}</td>
                                                </tr>
                                                <tr>
                                                    <th style={thStyle}>Deskripsi Incoterm</th>
                                                    <td>{props.data.incoterm_detail}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-striped table-sm text-nowrap" align="left">
                                            <tbody>
                                                <tr>
                                                    <th style={thStyle}>Purch. Org</th>
                                                    <td>{props.data.purchasing_org_id} - {props.data.purchasing_org_name}</td>
                                                </tr>
                                                <tr>
                                                    <th style={thStyle}>Purch. Group</th>
                                                    <td>{props.data.purchasing_group_id} - {props.data.purchasing_group_name}</td>
                                                </tr>
                                                <tr>
                                                    <th style={thStyle}>Tipe PO</th>
                                                    <td>{props.data.tipe_po}</td>
                                                </tr>
                                            </tbody>

                                        </table>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(Detail);