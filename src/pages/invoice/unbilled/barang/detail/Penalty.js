import React from 'react';
// import { useForm, Controller } from 'react-hook-form';
import ReactLoading from 'react-loading';
import { withTranslation } from 'react-i18next';
import { ModalBody, ModalFooter } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
import { formatNumber, formatNumber2 } from '../../../../../helpers/formatNumber';

const Penalty = (props) => {
	// let {loadings} = props;
    const { t } = props;  
    let rows;

    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{index+1}</td>
                    <td>{props.data[key]['penalty_type']}</td>
                    <td align="right">{formatNumber2(props.data[key]['amount'], 2)}</td>
                    <td>{props.data[key]['currency']}</td>
                    <td>{props.data[key]['description']}</td>
                    <td>{props.data[key]['jenis_pembebanan']}</td>
                    <td>{props.data[key]['gl_account_name']}</td>
                    <td>{props.data[key]['acc_assigment_category_name']}</td>
                    <td>{props.data[key]['acc_assigment_category_number']}</td>
                    {/* <td>{props.data[key]['acc_assigment_category_number_name']}</td> */}
                    {/* <td>{props.data[key]['file']}</td> */}
                    <td>
                        {props.data[key]['file'] !== null &&
                            <a className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, props.data[key]['file'], `${process.env.REACT_APP_API_BASE_URL}files/invoice/${props.data[key]['file']}`)} href="/">lampiran</a>
                        }
                    </td>
                    <td>
                        <button className="btn btn-xs btn-danger" value={key} onClick={(e) => props.toggleDelete(e, key, 'penalty')} ><i className="fa fa-trash"></i></button>
                    </td>
                </tr>
            )
        });
    }

    return (
        <div>
                <ModalBody>
                    <Panel className="margin-bot-false">
                        <PanelBody >
                            <Row>
                                <Col sm="12">
                                    <div className="form-group row">
                                        <div className="col-md-6">
                                            <div className="table-responsive">
                                                <table className="table table-bordered table-striped table-sm text-wrap" align="left">
                                                    <tbody>
                                                        <tr>
                                                            <th style={{width:'1%', whiteSpace: 'nowrap'}}>No. PO SAP</th>
                                                            <td>{props.data_header.po_sap_number} / {props.data_header.po_item_no}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>No. GR</th>
                                                            <td>{props.data_header.goods_receipt_number} / {props.data_header.item_no}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Material</th>
                                                            <td>{props.data_header.material_no} - {props.data_header.short_text}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Qty</th>
                                                            <td style={{textAlign: "right"}}>{formatNumber(props.data_header.qty, 2)}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Amount</th>
                                                            <td style={{textAlign: "right"}}>{formatNumber2(props.data_header.amount_value, 2)}</td>
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
                                                            <th style={{width:'1%', whiteSpace: 'nowrap'}}>Vendor</th>
                                                            <td>{props.data_header.vendor_id} - {props.data_header.vendor_name}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Plant</th>
                                                            <td>{props.data_header.plant}</td>
                                                        </tr>
                                                        {/* <tr>
                                                            <th>Sloc</th>
                                                            <td>{props.data_header.sloc}</td>
                                                        </tr> */}
                                                        <tr>
                                                            <th>Delivery Note</th>
                                                            <td>{props.data_header.reference}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </PanelBody>
                        <PanelHeader>Add Penalty</PanelHeader>
                        <PanelBody >
                            <div className="row">
                                {props.loadings.loading_list_penalty && (
                                    <center>
                                    <br />
                                    <ReactLoading type="cylon" color="#0f9e3e" />
                                    <br />
                                    </center>
                                )}
                                {props.loadings.loading_list_penalty === false &&
                                    <div className="col-sm-12">
                                        <div className="table-responsive">
                                            <table className="table table-bordered table-striped table-sm text-nowrap">
                                                <thead>
                                                    <tr>
                                                        <th style={{widht:"1%"}}>No</th>
                                                        <th>Jenis Penalty</th>
                                                        <th>Nilai</th>
                                                        <th>Curr</th>
                                                        <th>Deskripsi</th>
                                                        <th>Pembebanan</th>
                                                        <th>GL Account</th>
                                                        <th>Acc. Assgnmt</th>
                                                        <th>Obj. Acc. Assgnmt</th>
                                                        <th>Lampiran</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>{rows}</tbody>
                                            </table>
                                        </div>
                                    </div>
                                }
                            </div>
                        </PanelBody>
                    </Panel>
                </ModalBody>
            <ModalFooter>
                <span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
                    {/* {props.status_detail_item.delivery_date && "* Mohon pilih Delivery Date"}
                    {props.status_detail_item.tax && "* Mohon Pilih Tax"} */}
                </span>
                {/* <button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {t("costCenter:button.submit")}</button> */}
                <button className="btn btn-white" onClick={(e) => props.toggleClose(e)}>{t("costCenter:button.close")}</button>
            </ModalFooter>
        </div>
    );
}

export default withTranslation()(Penalty);
