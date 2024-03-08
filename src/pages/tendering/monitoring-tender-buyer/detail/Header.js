import React from 'react';
// import { useFormContext, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
// import ReactLoading from 'react-loading';
// import Select from 'react-select';
import { formatNumber } from '../../../../helpers/formatNumber';
import { statusName } from '../../../../helpers/statusName';
// import makeAnimated from 'react-select/animated';
// const animatedComponents = makeAnimated();


const Header = (props) => {
        const { data, isBuyer } = props;
        const {loading} = props;
        const {paramType} = props.parentState;
        const {retender} = props.parentState;
    return (
			<div>
				<Panel>
					<PanelHeader>Header</PanelHeader>
					<PanelBody>
                        <Row>
                            <Col sm="12">
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label">Created By</label>
                                    <div className="col-sm-9">
                                        <input type="text" readOnly={true} name="number" className="form-control" placeholder="" defaultValue={data?.created_by_name}  />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label">Purchasing Group</label>
                                    <div className="col-sm-9">
                                        <input type="text" readOnly={true} name="number" className="form-control" placeholder="" defaultValue={data?.purchasing_group}  />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label">No Proposal Tender</label>
                                    <div className="col-sm-9">
                                        <input type="text" readOnly={true} name="number" className="form-control" placeholder="" defaultValue={data?.number}  />
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label">Referensi</label>
                                    <div className="col-sm-9">
                                        <input type="text" readOnly={true} name="document_type" className="form-control" placeholder="" defaultValue={data?.reference} />
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label">Judul Proposal Tender</label>
                                    <div className="col-sm-9">
                                        <input type="text" readOnly={true} name="description" className="form-control" placeholder="" defaultValue={data?.title}  />
                                        {/* {errors.des    cription && <span className="text-danger">{errors.description[0]}</span>} */}
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label">Nilai Tender</label>
                                    <div className="col-sm-9">
                                        <input type="text" readOnly={true} name="description" className="form-control" placeholder="" defaultValue={data.total_value!==undefined ? formatNumber(data.total_value,2) : ''} />
                                        {/* {errors .description && <span className="text-danger">{errors.description[0]}</span>} */}
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label">Status</label>
                                    <div className="col-sm-9">
                                        {paramType !== 'retender' && <input type="text" readOnly={true} name="status" className="form-control" placeholder="" defaultValue={data?.status === 'Cancel' ? statusName(props.parentState.monitoringTender.header.status_monitoring_abjad) : data?.status?.status} />}
                                        {paramType === 'retender' && <input type="text" readOnly={true} name="status" className="form-control" placeholder="" defaultValue={statusName(retender?.proposal_tender?.status)} />}
                                    </div>
                                </div>
                                {(paramType !== 'retender' && (data?.retender?.length > 0))&& <div className="form-group row">
                                    <label className="col-sm-3 col-form-label">Note</label>
                                    <div className="col-sm-7">
                                        <textarea readOnly={true} name="note" className="form-control" placeholder="" defaultValue={data?.retender?.[0]?.catatan} />
                                        {/* {errors .description && <span className="text-danger">{errors.description[0]}</span>} */}
                                    </div>
                                    {retender?.file !== null && <div className="col-sm-2">
                                        <a className="btn btn-primary" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/tendering/${data?.retender?.[0]?.dokumen_retender}`}> <i className="fa fa-file"></i> </a>
                                    </div>}
                                </div>}
                                {paramType === 'retender' && <div className="form-group row">
                                    <label className="col-sm-3 col-form-label">Note</label>
                                    <div className="col-sm-7">
                                        <textarea readOnly={true} name="note" className="form-control" placeholder="" defaultValue={retender?.note} />
                                        {/* {errors .description && <span className="text-danger">{errors.description[0]}</span>} */}
                                    </div>
                                    {retender?.file !== null && <div className="col-sm-2">
                                        <a className="btn btn-primary" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/tendering/${retender?.file}`}> <i className="fa fa-file"></i> </a>
                                    </div>}
                                </div>}
                                {isBuyer && <button onClick={(e) => props.download(e)} className="btn btn-sm btn-primary" style={{float : "right"}} disabled={loading.cetak}>{loading.cetak ? <i className="fa fa-spinner fa-spin"></i> : "Cetak"}</button>}
                                {isBuyer && paramType !== 'retender' && data.number!==undefined && props.parentState.monitoringTender.is_retender_itemize!=="p" && (props.parentState.monitoringTender.header.status_monitoring_abjad!=="b" && props.parentState.monitoringTender.header.status_monitoring_abjad!=="x") && data?.status?.status !== 'Closed' && <button onClick={(e) => props.modal('-', 'retender')} className="btn btn-danger btn-sm m-r-10" style={{float : "right"}} disabled={loading.retender}>{loading.retender && <i className="fa fa-spinner fa-spin"></i> } Retender</button>}
                                {isBuyer && paramType !== 'retender' && data.number!==undefined && props.parentState.monitoringTender.is_retender_itemize!=="p" && (props.parentState.monitoringTender.header.status_monitoring_abjad!=="b" && props.parentState.monitoringTender.header.status_monitoring_abjad!=="x") && data?.status?.status !== 'Closed' && <button onClick={(e) => props.modal('-', 'batal_tender')} className="btn btn-danger btn-sm m-r-10" style={{float : "right"}} disabled={loading.retender}>{loading.retender && <i className="fa fa-spinner fa-spin"></i> } Batal Tender</button>}
                            </Col>
                        </Row>
					</PanelBody>
				</Panel>
			</div>
    );
}

export default withTranslation()(Header);