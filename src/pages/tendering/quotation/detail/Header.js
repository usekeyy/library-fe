import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
import ReactLoading from 'react-loading';
// import Select from 'react-select';
import {formatDate} from '../../../../helpers/formatDate';
// import makeAnimated from 'react-select/animated';
// const animatedComponents = makeAnimated();

const Header = (props) => {
		// const { t } = props;
		// const customStyles = { control: (base, state) => ({ ...base, borderColor: state.isFocused ? '#ddd' : 'red' })}
		// const { register, control } = useFormContext();
		const {header} = props.parentState.quotation;
		const {schedules} = props.parentState.quotation;
		const {errors} = props.parentState.quotation;
		const {loading} = props.parentState.quotation;
		// const {loadings} = props.parentState;
		// const {user} = props.parentProps;
		const metode_penyampaian_id = (header.metode_penyampaian_id !== undefined) ? header.metode_penyampaian_id : '';
		const jadwal_tender_code = (metode_penyampaian_id === '2t') ? (header.bid_administrasi === null) ? 'JT005' : 'JT006' : '';
		const last_schedule = (schedules && schedules.length > 0) ? schedules.slice(-1)[0] : '';
		const get_schedule = (schedules && schedules.length > 0) ? schedules.filter(i => i.jadwal_tender_code === jadwal_tender_code) : '';
		const end_date_time = (last_schedule !== '') ? formatDate(`${last_schedule?.end_date} ${last_schedule?.end_time}`, true) : '';
		const end_date_time_2t = (get_schedule !== '') ? formatDate(`${get_schedule[0]?.end_date} ${get_schedule[0]?.end_time}`, true) : '';
		let bid_open_date = ''
		if(metode_penyampaian_id === '2t'){
			bid_open_date = end_date_time_2t;
		} else {
			bid_open_date = end_date_time
		}
		
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
												<input type="text" readOnly={true} name="number" className={(errors['header.number']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={(header.uuid !== "") ? header.number : ''} />
												{/* {errors['header.number'] && <span className="text-danger"> {errors['header.number'][0]} </span>} */}
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Company</label>
										<div className="col-sm-10">
												<input type="text" readOnly={true} name="purchasing_org_id" className={(errors['header.purchasing_org_id']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={(header.uuid !== "") ? `${header.purchasing_org_id} - ${header.purchasing_org_name}` : ''} />
												{/* {errors['header.purchasing_org_id'] && <span className="text-danger"> {errors['header.purchasing_org_id'][0]} </span>} */}
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Judul Proposal Tender <span className="text-danger">*</span></label>
										<div className="col-sm-10">
												<input type="text" readOnly={true} name="title" className={(errors['header.title']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={(header.uuid !== "") ? header.title : ''} />
												{/* {errors['header.title'] && <span className="text-danger"> {errors['header.title'][0]} </span>} */}
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Tanggal Publish</label>
										<div className="col-sm-10">
												<input type="text" readOnly={true} name="created_at" className={(errors['header.created_at']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={(header.uuid !== "") ? formatDate(header.created_at, true) : ''} />
												{/* {errors['header.created_at'] && <span className="text-danger"> {errors['header.created_at'][0]} </span>} */}
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Tanggal Bid Open</label>
										<div className="col-sm-10">
												<input type="text" readOnly={true} name="bid_bond_date" className={(errors['header.bid_bond_date']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={(header.uuid !== "") ? bid_open_date : ''} />
												{/* {errors['header.bid_bond_date'] && <span className="text-danger"> {errors['header.bid_bond_date'][0]} </span>} */}
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