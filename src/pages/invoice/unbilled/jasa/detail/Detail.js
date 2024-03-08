import React from 'react';
// import { useForm, FormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from './../../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
import moment from 'moment';
import { formatNumber2 } from './../../../../../helpers/formatNumber';

const Detail = (props) => {

	// const methods = useForm();
	// const [status, setStatus] = React.useState('')

	// const onSubmit = data => {
    //     data.status = status
	// 	let payload = []
	// 	payload.status = status
	// 	payload.note = data.note
	// 	if (status === "o") {
	// 		props.savePurchaseOrder(payload);
	// 	}
	// };

	// const SubmitCheck = (e) => {
	// 	setStatus('o')
	// }
    let data = props.data

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Detail Service Acceptance</PanelHeader>
                <PanelBody>
                    <Row>
                        <Col sm="12">
                            <div className="form-group row">
                                <div className="col-md-6">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-striped table-sm text-wrap" align="left">
                                            <tbody>
                                                <tr>
                                                    <th style={{width:'1%'}}>No. Entry Sheet</th>
                                                    <td>{data.goods_receipt_number}</td>
                                                </tr>
                                                <tr>
                                                    <th>Fiscal Year</th>
                                                    <td>{data.goods_receipt_year}</td>
                                                </tr>
                                                <tr>
                                                    <th>Description</th>
                                                    <td>{data.short_text}</td>
                                                </tr>
                                                <tr>
                                                    <th>Vendor</th>
                                                    <td>{data.vendor_id} - {data.vendor_name}</td>
                                                </tr>
                                                <tr>
                                                    <th>Delivery Note</th>
                                                    <td>{data.service_line[0].reference}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="table-responsive" style={{overflow: "visible"}}>
                                        <table className="table table-bordered table-striped table-sm text-nowrap" align="left">
                                            <tbody>
                                                <tr>
                                                    <th style={{width:'1%'}}>Created By</th>
                                                    <td>{data.service_line[0].sap_created_by}</td>
                                                </tr>
                                                <tr>
                                                    <th>Created At</th>
                                                    <td>{data.sap_created_at !== undefined && data.sap_created_at !== null && moment(data.sap_created_at).format("DD-MM-YYYY")}</td>
                                                </tr>
                                                <tr>
                                                    <th>Posting Date</th>
                                                    <td>{data.post_date !== undefined && data.post_date !== null && moment(data.post_date).format("DD-MM-YYYY")}</td>
                                                </tr>
                                                <tr>
                                                    <th>Doc. Date</th>
                                                    <td>{data.doc_date !== undefined && data.doc_date !== null && moment(data.doc_date).format("DD-MM-YYYY")}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>No. PO (Eproc)</th>
                                            <th>No. PO (SAP)</th>
                                            <th>PO Item</th>
                                            <th>Acc. Assg Category</th>
                                            <th>Acc. Assg</th>
                                            <th>GL. Account</th>
                                            <th>Description</th>
                                            <th>Service Line</th>
                                            <th>Qty</th>
                                            <th>UOM</th>
                                            {/* <th>Gross Price</th> */}
                                            <th>Net Value</th>
                                            <th>Curr</th>
                                            {/* <th>Plant</th> */}
                                            <th>Penalty</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr key={0}>
                                            {data.service_line !== undefined &&
                                                <td rowSpan={data.service_line.length + 1} style={{verticalAlign: "middle"}} align="center">{data['po_eproc_number']}</td>
                                            }
                                            {data.service_line !== undefined &&
                                                <td rowSpan={data.service_line.length + 1} style={{verticalAlign: "middle"}} align="center">{data['po_sap_number']}</td>
                                            }
                                            {data.service_line !== undefined &&
                                                <td rowSpan={data.service_line.length + 1} style={{verticalAlign: "middle"}} align="center">{data['po_item_no']}</td>
                                            }
                                            {data.service_line !== undefined &&
                                                <td rowSpan={data.service_line.length + 1} style={{verticalAlign: "middle"}} align="center">{data['acc_assignment_category_id']}</td>
                                            }
                                            {data.service_line !== undefined &&
                                                <td rowSpan={data.service_line.length + 1} style={{verticalAlign: "middle"}} align="center">{data['acc_assignment_category_number']}</td>
                                            }
                                            {data.service_line !== undefined &&
                                                <td rowSpan={data.service_line.length + 1} style={{verticalAlign: "middle"}} align="center">{data['gl_account']}</td>
                                            }
                                            <td>{data['short_text']}</td>
                                            <td></td>
                                            <td align="right">{formatNumber2(data['qty'], 3)}</td>
                                            <td>{data['uom']}</td>
                                            <td align="right">{formatNumber2(data['amount'], 2)}</td>
                                            <td>{data['currency']}</td>
                                            <td align="right">{formatNumber2(data['penalty'], 2)}</td>
                                            <td>
                                                <button className="btn btn-xs btn-white" onClick={(e) => props.modalPenalty(e, data)}>Penalty</button>
                                            </td>
                                        </tr>
                                        {
                                            data.service_line.map(function(data_service, index_service) {
                                                return (
                                                    <tr key={0 + '-' +index_service}>
                                                        {/* <td>{index_service === 0 && data_service['goods_receipt_number']}</td> */}
                                                        <td>{data_service['short_text']}</td>
                                                        <td>{data_service['line_no']}</td>
                                                        <td align="right">{formatNumber2(data_service['qty'], 3)}</td>
                                                        <td>{data_service['uom']}</td>
                                                        <td align="right">{formatNumber2(data_service['amount_value'], 2)}</td>
                                                        <td>{data_service['currency']}</td>
                                                        <td></td>
                                                        <td></td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{paddingTop: "40px"}}>
                        <Col sm="12">
                            <h5><b>Penalty Calculation :</b></h5>
                            <div className="form-group row">
                                <div className="col-md-12">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-sm text-nowrap" align="left">
                                            <tbody>
                                                <tr>
                                                    <td style={{width:'60%'}}>Total Amount Jasa</td>
                                                    <td align="right">{formatNumber2(data.amount, 2)}</td>
                                                    <td style={{width:'1%'}}>{data.currency !== undefined ? data.currency : 'IDR'}</td>
                                                </tr>
                                                <tr>
                                                    <td>Total Penalty</td>
                                                    <td align="right" style={{color: 'red'}}>{formatNumber2(data.penalty, 2)}</td>
                                                    <td style={{width:'1%'}}>{data.currency !== undefined ? data.currency : 'IDR'}</td>
                                                </tr>
                                                <tr>
                                                    <td>Total Keseluruhan Amount</td>
                                                    <td align="right">{formatNumber2(data.total_akhir, 2)}</td>
                                                    <td style={{width:'1%'}}>{data.currency !== undefined ? data.currency : 'IDR'}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="12">
                            <div className="pull-right m-t-5 m-b-5">
                                <div>
                                    <button
                                        type="button"
                                        onClick={(e) => window.close()}
                                        disabled={props.loadingSubmit}
                                        className="btn btn-white m-r-5">
                                        Kembali
                                        </button>
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