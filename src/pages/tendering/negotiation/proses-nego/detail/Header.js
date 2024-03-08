import React from 'react';
import { useFormContext } from 'react-hook-form';
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
		const { register } = useFormContext();
		const {header} = props.parentState.proses_nego_vendor;
		const {dataTemp} = props.parentState.proses_nego_vendor;
		// const {items} = props.parentState.proses_nego_vendor;
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
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">No Proposal Tender</label>
										<div className="col-sm-10">
												<input type="text" readOnly={true} name="number" ref={register({})} className={(errors['header.number']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={(header.uuid !== "") ? header.number : ''} />
												{errors['header.number'] && <span className="text-danger"> {errors['header.number'][0]} </span>}
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Description </label>
										<div className="col-sm-10">
												<input type="text" readOnly={true} name="title" ref={register({})} className={(errors['header.title']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={(header.uuid !== "") ? header.title : ''} />
												{errors['header.title'] && <span className="text-danger"> {errors['header.title'][0]} </span>}
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Start Nego</label>
										<div className="col-sm-10">
												<input type="text" readOnly={true} name="ambang_batas" ref={register({})} className={(errors['header.ambang_batas']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={(header.uuid !== "") ? formatDate(`${dataTemp.start_date} ${dataTemp.start_time}`, true) : ''} />
												{errors['header.ambang_batas'] && <span className="text-danger"> {errors['header.ambang_batas'][0]} </span>}
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Close Nego</label>
										<div className="col-sm-10">
												<input type="text" readOnly={true} name="ambang_batas" ref={register({})} className={(errors['header.ambang_batas']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={(header.uuid !== "") ? formatDate(`${dataTemp.end_date} ${dataTemp.end_time}`, true) : ''} />
												{errors['header.ambang_batas'] && <span className="text-danger"> {errors['header.ambang_batas'][0]} </span>}
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Status</label>
										<div className="col-sm-10">
												<input type="text" readOnly={true} name="status" ref={register({})} className={(errors['header.status']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={(header.uuid !== "") ? 'Proses Nego' : ''} />
												{errors['header.status'] && <span className="text-danger"> {errors['header.status'][0]} </span>}
										</div>
								</div>
							</Col>
						</Row>
					</PanelBody>
					}
				</Panel>
			</div>
    );
}

export default withTranslation()(Header);