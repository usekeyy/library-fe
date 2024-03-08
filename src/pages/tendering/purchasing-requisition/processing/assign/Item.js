import React, {Component} from 'react';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { TabContent, TabPane, Nav, NavItem, NavLink, Button } from 'reactstrap';
import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
import classnames from 'classnames';
import {formatNumber} from '../../../../../helpers/formatNumber';


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

		render(){
			const { t } = this.props;
			const {items} = this.props.parentState.purchasing_requisition;
			// const {header} = this.props.parentState.purchasing_requisition;
			const {attachments} = this.props.parentState.purchasing_requisition;
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
											<td>{(dt.material_id==="" || dt.material_id===null) ? "" : parseInt(dt.material_id)}</td>
											<td>{dt.short_text}</td>
											<td>{dt.plant_id}</td>
											<td>{dt.qty}</td>
											<td>{dt.uom}</td>
											<td align="right">{formatNumber(dt.per, 2)}</td>
											<td align="right">{formatNumber(dt.valuation_price, 2)}</td>
											<td align="right">{formatNumber(dt.valuation_price * (dt.qty/dt.per), 2)}</td>
											<td>{(dt.outline_agreement==="" || dt.outline_agreement===null) ? "-" : dt.outline_agreement + "-" + formatNumber(dt.princ_agreement_item)}</td>
											<td>
													{/* {props.user.roles[0].id !==23 && props.user.roles[0].id!==24 && <button className="btn btn-xs btn-danger" onClick={(e) => handleDeleteItems(dt.no, e)} value={dt.no} ><i className="danger fa fa-trash"></i></button>}
													{(props.user.has_roles.includes("REQ002") || props.user.has_roles.includes("PLNRGN")) && <button className="btn btn-xs btn-warning" onClick={(e) => handleShowItem(dt, e)} value={dt.no} ><i className="danger fa fa-eye"></i></button> } */}
											</td>
									</tr>
							)
					})

					rows.push(
							<tr key={items.length + 1}>
									<td colSpan="9">Total Harga</td>
									<td align="right">{formatNumber(Total, 2)}</td>
									<td></td>
									<td></td>
							</tr>
					)
			} else {
					rows = (<RowEmpty colSpan='12'>Tidak ada data</RowEmpty>);
			}

			let rows_attactment;
			if (attachments.length > 0) {
					rows_attactment = attachments.map((dt, i) => {
							return (
									<tr key={i}>
											<td>{i + 1}</td>
											<td>{dt.number_pr}</td>
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
					rows_attactment = (<RowEmpty colSpan='8'>Tidak ada data</RowEmpty>);
			}
			
			return (
				<div>
					<Panel>
						<PanelHeader>Item</PanelHeader>
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
																				<th>Line Item</th>
																				<th>No Material</th>
																				<th>Description</th>
																				<th>Plant</th>
																				<th>QTY</th>
																				<th>Uom</th>
																				<th>Per</th>
																				<th>Harga Satuan</th>
																				<th>Total</th>
																				<th>Outl. Aggrement</th>
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
															<th>No PR</th>
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
						</PanelBody>}
					</Panel>
				</div>
			);
		}
}

export default withTranslation()(Item);
