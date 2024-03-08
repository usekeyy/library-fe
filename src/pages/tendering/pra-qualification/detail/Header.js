import React from 'react';
import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
import { formatNumber } from '../../../../helpers/formatNumber';
import moment from 'moment';

const Header = (props) => {
    // const { t } = props;
    const { register } = useFormContext();

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Header</PanelHeader>
                <PanelBody>
                    <Row>
                        {props.role_vendor ?
                            <Col sm="12">
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Company</label>
                                    <div className="col-sm-10">
                                        <input type="text" readOnly={true} name="company_name" ref={register({})} className="form-control" placeholder="" defaultValue={props.company_name!==undefined ? props.company_name : ''} />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">No Proposal Tender</label>
                                    <div className="col-sm-10">
                                        <input type="text" readOnly={true} name="number" ref={register({})} className="form-control" placeholder="" defaultValue={props.number!==undefined ? props.number : ''}  />
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Judul Proposal Tender</label>
                                    <div className="col-sm-10">
                                        <input type="text" readOnly={true} name="description" ref={register({})} className="form-control" placeholder="" defaultValue={props.title!==undefined ? props.title : ''}  />
                                        {/* {errors.description && <span className="text-danger">{errors.description[0]}</span>} */}
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Start Date Praqualification</label>
                                    <div className="col-sm-10">
                                        <input type="text" readOnly={true} name="pq_start_date" ref={register({})} className="form-control" style={{color: "red", fontWeight: "bold"}} placeholder="" defaultValue={props.pq_start_date !==undefined && props.pq_start_date !== null && props.pq_start_date !== '' ? moment(props.pq_start_date).format("DD-MM-YYYY") : ''} />
                                        {/* {errors .description && <span className="text-danger">{errors.description[0]}</span>} */}
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Finish Date Praqualification</label>
                                    <div className="col-sm-10">
                                        <input type="text" readOnly={true} name="pq_end_date" ref={register({})} className="form-control" style={{color: "red", fontWeight: "bold"}} placeholder="" defaultValue={props.pq_end_date !==undefined && props.pq_end_date !== null && props.pq_end_date !== '' ? moment(props.pq_end_date).format("DD-MM-YYYY") : ''} />
                                        {/* {errors .description && <span className="text-danger">{errors.description[0]}</span>} */}
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Status</label>
                                    <div className="col-sm-10">
                                        <input type="text" readOnly={true} name="status" ref={register({})} className="form-control" placeholder="" defaultValue={props.status_text!==undefined ? props.status_text : ''}  />
                                        {/* {errors .description && <span className="text-danger">{errors.description[0]}</span>} */}
                                    </div>
                                </div>
                            </Col>:
                            <Col sm="12">
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Created by</label>
                                    <div className="col-sm-10">
                                        <input type="text" readOnly={true} name="created_by_name" ref={register({})} className="form-control" placeholder="" defaultValue={props.created_by_name!==undefined ? props.created_by_name : ''} />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">No Proposal Tender</label>
                                    <div className="col-sm-10">
                                        <input type="text" readOnly={true} name="number" ref={register({})} className="form-control" placeholder="" defaultValue={props.number!==undefined ? props.number : ''}  />
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Judul Proposal Tender</label>
                                    <div className="col-sm-10">
                                        <input type="text" readOnly={true} name="description" ref={register({})} className="form-control" placeholder="" defaultValue={props.title!==undefined ? props.title : ''}  />
                                        {/* {errors.des    cription && <span className="text-danger">{errors.description[0]}</span>} */}
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Nilai Tender</label>
                                    <div className="col-sm-10">
                                        <input type="text" readOnly={true} name="description" ref={register({})} className="form-control" placeholder="" defaultValue={props.total_value!==undefined ? formatNumber(props.total_value,2) : ''} />
                                        {/* {errors .description && <span className="text-danger">{errors.description[0]}</span>} */}
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Status</label>
                                    <div className="col-sm-10">
                                        <input type="text" readOnly={true} name="status" ref={register({})} className="form-control" placeholder="" defaultValue={props.status_text!==undefined ? props.status_text : ''}  />
                                        {/* {errors .description && <span className="text-danger">{errors.description[0]}</span>} */}
                                    </div>
                                </div>
                            </Col>
                        }
                    </Row>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(Header);