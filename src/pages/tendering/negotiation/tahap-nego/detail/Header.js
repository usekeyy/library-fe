import React from 'react';
import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
import ReactLoading from 'react-loading';
// import Select from 'react-select';
// import makeAnimated from 'react-select/animated';
import {formatNumber} from '../../../../../helpers/formatNumber';
// const animatedComponents = makeAnimated();

const Header = (props) => {
		// const { t } = props;
		// const customStyles = { control: (base, state) => ({ ...base, borderColor: state.isFocused ? '#ddd' : 'red' })}
		const { register } = useFormContext();
		const {header} = props.parentState.tahap_nego;
		// const {items} = props.parentState.tahap_nego;
		const {errors} = props.parentState.tahap_nego;
		// const {loading} = props.parentState.tahap_nego;
		const {loadings} = props.parentState;
		// const {user} = props.parentProps;
		const printBidTabulation = (e) => {
			e.preventDefault();
			props.downloadBidTabulation(header.negotiation_uuid)
		}
		const configAuction = (e) => {
			e.preventDefault();
			props.configAuction(header.auction_uuid)
		}
		const createAuction = (e) => {
			e.preventDefault();
			props.createAuction(header.uuid)
		}
    return (
			<div>
				<Panel>
					<PanelHeader>Header</PanelHeader>
					{loadings.page && <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>}
					{!loadings.page &&
					<PanelBody>
						<Row>
							<Col sm="12">
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Buyer</label>
										<div className="col-sm-10">
												<input type="text" readOnly={true} name="buyer" ref={register({})} className={(errors['header.buyer']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={(header.uuid !== "") ? header.buyer_name : ''} />
												<input type="hidden" name="header.proposal_tender_id" ref={register({})} className={"form-control"} defaultValue={header.id} />
												{errors['header.buyer'] && <span className="text-danger"> {errors['header.buyer'][0]} </span>}
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">No Proposal Tender</label>
										<div className="col-sm-10">
												<input type="text" readOnly={true} name="number" ref={register({})} className={(errors['header.number']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={(header.uuid !== "") ? header.number : ''} />
												{errors['header.number'] && <span className="text-danger"> {errors['header.number'][0]} </span>}
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Description <span className="text-danger">*</span></label>
										<div className="col-sm-10">
												<input type="text" readOnly={true} name="title" ref={register({})} className={(errors['header.title']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={(header.uuid !== "") ? header.title : ''} />
												{errors['header.title'] && <span className="text-danger"> {errors['header.title'][0]} </span>}
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">OE</label>
										<div className="col-sm-10">
												<input type="text" readOnly={true} name="oe" ref={register({})} className={(errors['header.oe']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={(header.uuid !== "") ? formatNumber(header.oe, 2) : ''} />
												{errors['header.oe'] && <span className="text-danger"> {errors['header.oe'][0]} </span>}
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Status</label>
										<div className="col-sm-10">
												<input type="text" readOnly={true} name="status" ref={register({})} className={(errors['status']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={(header.on_process) ? 'Proses Nego' : 'Tahap Nego'} />
												{errors['status'] && <span className="text-danger"> {errors['status'][0]} </span>}
										</div>
								</div>
								{ header.auction_uuid !== null && 
										<div className="form-group row pull-left">
										<div className="col-sm-12">
											<button className="btn btn-primary" type="button" onClick={(e) => configAuction(e)} disabled={loadings.button}>Config Auction</button>
										</div>
								</div>}
								{(header.auction_uuid === null ) && 
										<div className="form-group row pull-left">
										<div className="col-sm-12">
											<button className="btn btn-primary" type="button" onClick={(e) => createAuction(e)} disabled={loadings.button}>Create Auction</button>
										</div>
								</div>}
								{header.negotiation_uuid !== null && <div className="form-group row pull-right">
										<div className="col-sm-12">
											<button className="btn btn-primary" type="button" onClick={(e) => printBidTabulation(e)} disabled={loadings.button}>Resume Bid Tabulation</button>
										</div>
								</div>}
							</Col>
						</Row>
					</PanelBody>
					}
				</Panel>
			</div>
    );
}

export default withTranslation()(Header);
