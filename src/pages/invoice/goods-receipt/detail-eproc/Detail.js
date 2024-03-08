import React from 'react';
import { useForm } from 'react-hook-form';
// import { useForm, FormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from './../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
import Items from './Items';
import TotalNilai from './TotalNilai';

const Detail = (props) => {
	const { handleSubmit, register } = useForm({});
    // const { t } = props;  

	const onSubmitFetchGR = async data => {
		props.fetchEprocGRSA(data);
	};	

	const onSubmitGR = async data => {
		props.save(data);
	};
    
    return (
        <div>
            <div>
                <form onSubmit={handleSubmit(onSubmitFetchGR)}>
                    <Row>
                        <Col sm="12">
                            <div className="form-group row">
                                <label className="col-sm-1 col-form-label m-l-4">No PO (ERP) <span className="text-danger">*</span> </label>
                                <div className="col-sm-2">
                                    <input type="text" name="po_sap_number" ref={register({ required: true })} className="form-control" placeholder="" />
                                </div>
                                <button className="btn btn-info" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} Search</button>
                            </div>
                        </Col>
                    </Row>
                </form>
            </div>
            <Panel className="margin-bot-false">
                <PanelHeader>Detail Goods Receipt</PanelHeader>
                <form onSubmit={handleSubmit(onSubmitGR)}>
                    <PanelBody>
                        <Row>
                            <Col sm="12">
                                <div className="form-group row">
                                    <div className="col-md-6">
                                        <div className="table-responsive">
                                            <table className="table table-bordered table-striped table-sm text-nowrap" align="left">
                                                <tbody>
                                                    <tr>
                                                        <th style={{width:'1%'}}>No. GR</th>
                                                        <td></td>
                                                    </tr>
                                                    <tr>
                                                        <th>Fiscal Year</th>
                                                        <td>{new Date().getFullYear()}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Vendor</th>
                                                        <td>
                                                            {props.data.vendor_id !== undefined && (
                                                                props.data.vendor_add_cost && props.data.vendor_add_cost.some(i => i.sto?.includes('X')) ? 
                                                                props.data.vendor_add_cost.map(e => `${e.vendor_id} - ${e.name}`).join(", ") :
                                                                `${props.data.vendor_id} - ${props.data.vendor_name}`
                                                            )}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>Delivery Note <span className="text-danger">*</span></th>
                                                        <td>{
                                                            <input type="text" name="delivery_note" ref={register({required: false})} className="form-control" placeholder="" defaultValue=""/>
                                                        }</td>
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
                                                        <td></td>
                                                    </tr>
                                                    <tr>
                                                        <th>Created At</th>
                                                        <td></td>
                                                    </tr>
                                                    <tr>
                                                        <th>Doc. Date <span className="text-danger">*</span></th>
                                                        <td>
                                                            <input type="date" data-date-format="DD/MM/YYYY" ref={register({required: false})} name="document_date" className="form-control" defaultValue=""/>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>Posting Date <span className="text-danger">*</span></th>
                                                        <td>
                                                            <input type="date" data-date-format="DD/MM/YYYY" ref={register({required: false})} name="posting_date" className="form-control" defaultValue=""/>
                                                        </td>
                                                    </tr>
                                                </tbody>

                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Items 
                            loadings={props.loadings}
                            data={props.data}
                            checklist={props.checklist}
                            handleChecklist={props.handleChecklist}
                            handleCheckAll={props.handleCheckAll}
                            param_option={props.param_option}
                            setOptionItem={props.setOptionItem}
                            setOptionServiceLine={props.setOptionServiceLine}
                            user={props.user}
                            modalAdditionalCost={props.modalAdditionalCost}
                            modalPenalty={props.modalPenalty}
                            modalPenaltyAdditionalCost={props.modalPenaltyAdditionalCost}
                        />
                        <TotalNilai 
                            loadings={props.loadings}
                            data={props.data}
                            checklist={props.checklist}
                        />
                        <Row>
                            <Col sm="12">
                                <div className="pull-right m-t-5 m-b-5">
                                    <div>
                                        {props.data.items !== undefined && <button
                                            type="submit"
                                            className="btn btn-success m-r-5"
                                            // onClick={(e) => onSubmitGR()}
                                            disabled={props.loadingSubmit}
                                        >
                                        {props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Submit</button>}
                                        <button
                                            type="button"
                                            onClick={(e) => window.history.back()}
                                            disabled={props.loadingSubmit}
                                            className="btn btn-white m-r-5">
                                            Kembali
                                            </button>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </PanelBody>
                </form>
            </Panel>

        </div>
	);
}

export default withTranslation()(Detail);