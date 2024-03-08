import React, {Component} from 'react';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { TabContent, TabPane, Nav, NavItem, NavLink, Button } from 'reactstrap';
import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../components/tableoptions/TableOptions';
import classnames from 'classnames';
import {formatNumber} from '../../../../helpers/formatNumber';


class Item extends Component {
		constructor(props) {
			super(props);
			this._isMounted = false;
			this._data = []
			this.state = {
				activePill: '1',
			}
		}
		
		componentDidMount = () => {
			this._isMounted = true;
			if(this._isMounted){
				
			}
		}
		
		componentWillUnmount() {
			this._isMounted = false;
			// fix Warning: Can't perform a React state update on an unmounted component
			this.setState = (state,callback)=>{
					return;
			};
		}

		togglePill = (pill) => {
			if (this.state.activePill !== pill) {
				this.setState({
					activePill: pill
				});
			}
		}
		
		findProcessing = (arr, key) => {
			let data
			arr.forEach((items, i) => {
				if(items.id === key){
					data = items.name
				}
			})
			return data
		}

		details = (e, data) => {
			e.preventDefault()
			this.props.modals(data, 'items')
		}

		// modalConfirm = (e) => {
		// 	e.preventDefault()
		// 	this.props.modalConfirm()
		// }

		render(){
			const { t } = this.props;
			const {items} = this.props.parentState.purchasing_requisition;
			// const {header} = this.props.parentState.purchasing_requisition;
			const status_processing = this.props.parentState.status_processing;
			const {attachments} = this.props.parentState.purchasing_requisition;
			// const {items_tender} = this.props.parentState.purchasing_requisition;
			// const {items_oa} = this.props.parentState.purchasing_requisition;
			const {uuid} = this.props.parentState;
			const {errors} = this.props.parentState.purchasing_requisition;
			const {loadings} = this.props.parentState;
			let rows;

			if (items.length > 0) {
					let Total = 0;
					rows = items.map((dt, i) => {
							Total += dt.valuation_price * (dt.qty/dt.per)
							return (
									<tr key={i}>
											<td>{dt.purchasing_requisition_number}</td>
											<td>{dt.item_no}</td>
											<td>{parseInt(dt.outline_agreement)}</td>
											<td>{dt.princ_agreement_item}</td>
											<td>{dt.fixed_vendor}</td>
											<td>{dt.vendor_name}</td>
											<td>{dt.material_id !== null && dt.material_id !== '' ? parseInt(dt.material_id) : ''}</td>
											<td>{dt.short_text}</td>
											<td>{dt.plant_id}</td>
											<td>{formatNumber(dt.qty, 2)}</td>
											<td>{dt.uom}</td>
											<td align="right">{formatNumber(dt.per, 2)}</td>
											<td align="right">{formatNumber(dt.valuation_price, 2)}</td>
											<td align="right">{formatNumber((parseFloat(dt.qty)/parseFloat(dt.per)) * parseFloat(dt.valuation_price), 2)}</td>
											<td>{dt.currency}</td>
											{/* <td>{(dt.assign_processing !== null && dt.assign_processing !== "") ? dt.assign_processing : (items_tender.length > 0) ? this.findProcessing(items_tender, dt.uuid) : '-' }</td> */}
											<td>
												<button className="btn btn-xs btn-primary" onClick={(e) => this.details(e,i)} disabled={loadings.button} >Detail</button>
											</td>
									</tr>
							)
					})

					rows.push(
							<tr key={items.length + 1}>
									<td colSpan="13">Total Harga</td>
									<td align="right">{formatNumber(Total, 2)}</td>
									<td colSpan="2"></td>
							</tr>
					)
			} else {
				if(loadings.showItems){
					rows = (<RowEmpty colSpan='16'><i className="fas fa-spinner fa-pulse"></i>Loading</RowEmpty>);
				} else {
					rows = (<RowEmpty colSpan='16'>Tidak ada data</RowEmpty>);
				}
			}

			let rows_attactment;
			if (attachments.length > 0) {
					rows_attactment = attachments.map((dt, i) => {
							return (
									<tr key={i}>
											<td>{i + 1}</td>
											<td>{dt.type}</td>
											<td>{dt.description}</td>
											<td>{dt.created_by_name}</td>
											<td>{dt.created_at}</td>
											<td>
												{(dt.file !== "") ? <a className="pull-right" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/tendering/${dt.file}` } > {dt.file} </a> : dt.file }	
											</td>
											<td>
													{/* {uuid !== '' && <button className="btn btn-xs btn-danger" onClick={(e) => handleDeleteLampiran(e, i)} value={i} ><i className="danger fa fa-trash"></i></button> } */}
											</td>
									</tr>
							)
					})
			} else {
					rows_attactment = (<RowEmpty colSpan='7'>Tidak ada data</RowEmpty>);
			}
			
			return (
				<div>
					<Panel>
						<PanelHeader>Selected Purchase Requisition - Outline Agreement</PanelHeader>
						{(loadings.items) && <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>}
						{(!loadings.items) &&
						<PanelBody >
							{errors.items && <p className="text-danger"> * {errors.items[0]} </p>}
							<Nav className="mb-3" pills>
								<NavItem>
									<NavLink
										className={classnames({ active: this.state.activePill === '1' })}
										onClick={() => { this.togglePill('1'); }}
									>
										<span className="d-sm-none">PR Items</span>
										<span className="d-sm-block d-none">Tab PR Items</span>
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink
										className={classnames({ active: this.state.activePill === '2' })}
										onClick={() => { this.togglePill('2'); }}
									>
										<span className="d-sm-none">Document</span>
										<span className="d-sm-block d-none">Document Tab</span>
									</NavLink>
								</NavItem>
							</Nav>
							<TabContent className="p-15 rounded bg-white mb-4" activeTab={this.state.activePill}>
								<TabPane tabId="1">
									{uuid === '' &&
									<div className="row">
										{this.props.errors.items && <span className="text-danger"> {this.props.errors.items[0]}  </span>}
										<div className="col-sm-12">
												<div className="pull-right m-t-10 m-b-10">
														<Button color="primary" className="btn btn-sm btn-primary" value='' >{t("company:button.add")}</Button>
												</div>
										</div>
									</div>
									}
									<div className="row">
										<div className="col-sm-12">
												<div className="table-responsive">
														<table className="table table-bordered table-striped table-sm text-nowrap">
																<thead>
																		<tr>
																				<th>No PR</th>
																				<th>Item PR</th>
																				<th>No OA</th>
																				<th>Item OA</th>
																				<th>Vendor</th>
																				<th>Vendor Name</th>
																				<th>No Material</th>
																				<th>Description</th>
																				<th>Plant</th>
																				<th>QTY</th>
																				<th>Uom</th>
																				<th>Per</th>
																				<th>Harga Satuan</th>
																				<th>Total Harga</th>
																				<th>Currency</th>
																				<th>Action</th>
																		</tr>
																</thead>
																<tbody>{rows}</tbody>
														</table>
												</div>
										</div>
									</div>
								</TabPane>
								<TabPane tabId="2">
									<div className="row">
										<div className="col-sm-12">
											<div className="table-responsive">
												<table className="table table-bordered table-striped table-sm text-nowrap">
													<thead>
														<tr>
															<th>No</th>
															<th>Tipe Lampiran</th>
															<th>Description</th>
															<th>Uploaded By</th>
															<th>Uploaded At</th>
															<th>File</th>
															<th>Action</th>
														</tr>
													</thead>
													<tbody>{rows_attactment}</tbody>
												</table>
											</div>
										</div>
									</div>
								</TabPane>
							</TabContent>
							<div className="pull-right m-t-10">
								{status_processing &&
									<span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
										*Mohon pilih item PR no OA yang sama
									</span>
								}
								<button className="btn btn-white m-r-10" type="button" onClick={(e) => window.location.reload()} disabled={loadings.button}>{t('Button.Batal')}</button>
								<button className="btn btn-success m-l-10" onClick={(e) => this.props.submitPraProposalTender()} type="button" disabled={loadings.button}> 
									{loadings.button && <i className="fas fa-spinner fa-pulse"></i> }
									{t('Button.Submit')}
								</button>
							</div>
						</PanelBody>}
					</Panel>
				</div>
			);
		}
}

export default Item;
