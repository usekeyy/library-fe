import React from 'react';
// import { useFormContext, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
import ReactLoading from 'react-loading';
// import Select from 'react-select';
import { formatDate } from '../../../../../helpers/formatDate';
// import makeAnimated from 'react-select/animated';

// const animatedComponents = makeAnimated();

const Header = (props) => {
		// const { t } = props;
		// const customStyles = { control: (base, state) => ({ ...base, borderColor: state.isFocused ? '#ddd' : 'red' })}
		// const { register, control } = useFormContext();
		const {header} = props.parentState.vendor_registration_tender;
		const {retender} = props.parentState.vendor_registration_tender;
		// const {items} = props.parentState.vendor_registration_tender;
		const {errors} = props.parentState.vendor_registration_tender;
		const {loading} = props.parentState.vendor_registration_tender;
		const {loadings} = props.parentState;
		// const {user} = props.parentProps;
		// const printRFQ = (e) => {
		// 	e.preventDefault();
		// 	alert("ee ee ee")
		// }
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
												{errors['header.number'] && <span className="text-danger"> {errors['header.number'][0]} </span>}
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Buyer</label>
										<div className="col-sm-10">
												<input type="text" readOnly={true} name="number" className={(errors['header.number']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={(header.uuid !== "") ? header.buyer_name : ''} />
												{errors['header.number'] && <span className="text-danger"> {errors['header.number'][0]} </span>}
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Company</label>
										<div className="col-sm-10">
												<input type="text" readOnly={true} name="purchasing_org_id" className={(errors['header.purchasing_org_id']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={(header.uuid !== "") ? header.company_name : ''} />
												{errors['header.purchasing_org_id'] && <span className="text-danger"> {errors['header.purchasing_org_id'][0]} </span>}
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Judul Proposal Tender <span className="text-danger">*</span></label>
										<div className="col-sm-10">
												<input type="text" readOnly={true} name="title" className={(errors['header.title']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={(header.uuid !== "") ? header.title : ''} />
												{errors['header.title'] && <span className="text-danger"> {errors['header.title'][0]} </span>}
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Tanggal Publish</label>
										<div className="col-sm-10">
												<input type="text" readOnly={true} name="created_at" className={(errors['header.created_at']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={(header.uuid !== "") ? formatDate(header.created_at, true) : ''} />
												{errors['header.created_at'] && <span className="text-danger"> {errors['header.created_at'][0]} </span>}
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Tanggal Bid Open</label>
										<div className="col-sm-10">
												<input type="text" readOnly={true} name="bid_bond_date" className={(errors['header.bid_bond_date']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={(header.uuid !== "") ? formatDate(header.bo_start_date, true) : ''} />
												{errors['header.bid_bond_date'] && <span className="text-danger"> {errors['header.bid_bond_date'][0]} </span>}
										</div>
								</div>
								{(header.status === 'c' || header.status === 'x') && header.is_retender === 'y' && <div className="form-group row">
									<label className="col-sm-2 col-form-label">Retender</label>
									<div className="col-sm-8">
											<textarea readOnly={true} name="retender_note" className="form-control" placeholder="" defaultValue={retender?.retender_note} />
											{/* {errors .description && <span className="text-danger">{errors.description[0]}</span>} */}
									</div>
									{retender?.retender_file !== null && <div className="col-sm-2">
											<a className="btn btn-primary" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/tendering/${retender?.retender_file}`}> <i className="fa fa-file"></i> </a>
									</div>}
								</div>}
								<div className="form-group row pull-right">
										<div className="col-sm-12">
												<button className="btn btn-primary" type="button" onClick={(e) => props.downloadRFQ(e)} disabled={loadings.button}>Print RFQ</button>
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