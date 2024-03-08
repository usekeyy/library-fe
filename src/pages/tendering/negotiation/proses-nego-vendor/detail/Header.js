import React from 'react';
// import { useFormContext, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
import ReactLoading from 'react-loading';
// import Select from 'react-select';
import {formatDate} from '../../../../../helpers/formatDate';
// import makeAnimated from 'react-select/animated';
// const animatedComponents = makeAnimated();

const Header = (props) => {
		// const { t } = props;
		// const customStyles = { control: (base, state) => ({ ...base, borderColor: state.isFocused ? '#ddd' : 'red' })}
		// const { register, control } = useFormContext();
		const {header} = props.parentState.proses_nego_vendor;
		const {dataTemp} = props.parentState.proses_nego_vendor;
		const {dataDetailNego} = props.parentState;
		const {errors} = props.parentState.proses_nego_vendor;
		const {loading} = props.parentState.proses_nego_vendor;
		// const {loadings} = props.parentState;
		// const {user} = props.parentProps;

    return (
			<div>
				<Panel>
					<PanelHeader>Header</PanelHeader>
					{loading && <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>}
					{!loading &&
					<PanelBody>
						<Row>
							<Col sm="12">
								{!props.parentState.detailNego && <React.Fragment>
									<div className="form-group row">
											<label className="col-sm-2 col-form-label">No Proposal Tender</label>
											<div className="col-sm-10">
													<input type="text" readOnly={true} name="number" className={(errors['header.number']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={(header.uuid !== "") ? header.number : ''} />
													{errors['header.number'] && <span className="text-danger"> {errors['header.number'][0]} </span>}
											</div>
									</div>
									<div className="form-group row">
											<label className="col-sm-2 col-form-label">Description </label>
											<div className="col-sm-10">
													<input type="text" readOnly={true} name="title" className={(errors['header.title']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={(header.uuid !== "") ? header.title : ''} />
													{errors['header.title'] && <span className="text-danger"> {errors['header.title'][0]} </span>}
											</div>
									</div>
									<div className="form-group row">
											<label className="col-sm-2 col-form-label">Start Nego</label>
											<div className="col-sm-10">
													<input type="text" readOnly={true} name="start_date" className={(errors['header.start_date']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={(header.uuid !== "") ? formatDate(`${dataTemp.start_date} ${dataTemp.start_time}`, true) : ''} />
													{errors['header.start_date'] && <span className="text-danger"> {errors['header.start_date'][0]} </span>}
											</div>
									</div>
									<div className="form-group row">
											<label className="col-sm-2 col-form-label">Close Nego</label>
											<div className="col-sm-10">
													<input type="text" readOnly={true} name="end_date" className={(errors['header.end_date']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={(header.uuid !== "") ? formatDate(`${dataTemp.end_date} ${dataTemp.end_time}`, true) : ''} />
													{errors['header.end_date'] && <span className="text-danger"> {errors['header.end_date'][0]} </span>}
											</div>
									</div>
									<div className="form-group row">
											<label className="col-sm-2 col-form-label">Status</label>
											<div className="col-sm-10">
													<input type="text" readOnly={true} name="status" className={(errors['header.status']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={(header.uuid !== "") ? 'Proses Nego' : ''} />
													{errors['header.status'] && <span className="text-danger"> {errors['header.status'][0]} </span>}
											</div>
									</div>
									<div className="form-group row">
											<label className="col-sm-2 col-form-label">Note</label>
											<div className="col-sm-10">
													<textarea className="form-control"
                                                        name="note"
                                                        defaultValue={header?.note}
                                                        disabled={true}
                                                    />
													{/* <input type="text" readOnly={true} name="status" className={(errors['header.status']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={(header.uuid !== "") ? 'Proses Nego' : ''} /> */}
													{/* {errors['header.status'] && <span className="text-danger"> {errors['header.status'][0]} </span>} */}
											</div>
									</div>
								</React.Fragment>}
								{props.parentState.detailNego && <React.Fragment>
									<div className="form-group row">
											<label className="col-sm-2 col-form-label">Vendor No</label>
											<div className="col-sm-10">
													<input type="text" readOnly={true} name="vendor_no" className={"form-control"} placeholder="" defaultValue={dataDetailNego.id} />
													{errors['header.status'] && <span className="text-danger"> {errors['header.status'][0]} </span>}
											</div>
									</div>
									<div className="form-group row">
											<label className="col-sm-2 col-form-label">Vendor Name</label>
											<div className="col-sm-10">
													<input type="text" readOnly={true} name="vendor_name" className={"form-control"} placeholder="" defaultValue={dataDetailNego.name} />
													{errors['header.status'] && <span className="text-danger"> {errors['header.status'][0]} </span>}
											</div>
									</div>
								</React.Fragment>}
							</Col>
						</Row>
					</PanelBody>
					}
				</Panel>
			</div>
    );
}

export default withTranslation()(Header);