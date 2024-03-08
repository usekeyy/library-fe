import React, {Component} from 'react';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Button } from 'reactstrap';
import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../components/tableoptions/TableOptions';
import {formatNumber2 } from '../../../../helpers/formatNumber';
import { formatDate } from '../../../../helpers/formatDate';


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

	modalChecklist(e, value, data) {
		e.preventDefault()
		this.props.modalChecklist(value, data)
		// const url = '/invoice/unbilled/barang/detail/' + value
		// this.props.redirectDetail(url)
	}

	edits(e, value) {
		// this.props.history.push({
		//     pathname: '/invoice/goods-receipt/detail/' + value,
		//     state: { status_detail: true }
		// })
        this.props.parentProps.history.push('/invoice/detail/' + value)
	}

	render(){
		const { t } = this.props;
		const {items} = this.props.parentState.data_invoice;
		const status_processing = this.props.parentState.status_processing;
		const {uuid} = this.props.parentState;
		const {loadings} = this.props.parentState;
		let rows;

		if (items.length > 0) {
				// let Total = 0;
				rows = items.map((dt, i) => {
						// Total += dt.valuation_price * (dt.qty/dt.per)
						return (
								<tr key={i}>
										<td>{dt.faktur_pajak_no}</td>
										<td>{formatDate(dt.faktur_tanggal, false)}</td>
										<td>{dt.number}</td>
										<td>{formatDate(dt.invoice_date, false)}</td>
										<td>{dt.category}</td>
										<td>{dt.vendor_id}</td>
										<td>{dt.vendor_name}</td>
										<td>{dt.purchase_order_number}</td>
										<td>{dt.note_vendor}</td>
										<td align="right">{formatNumber2(dt.total, 2)}</td>
										<td>{dt.currency}</td>
										<td>{dt.status_text}</td>
										<td>{dt.next_status}</td>
										<td>{formatDate(dt.created_at, false)}</td>
										<td>
											<button className="btn btn-xs btn-warning" value={dt.uuid} onClick={(e) => this.modalChecklist(e, dt.uuid, dt)} >View</button>
											<button className="btn btn-xs btn-lime" value={dt.uuid} onClick={(e) => this.edits(e, dt.uuid)} >Detail</button>
										</td>
								</tr>
						)
				})

				// rows.push(
				// 		<tr key={items.length + 1}>
				// 				<td colSpan="9">Total Harga</td>
				// 				<td align="right">{formatNumber(Total, 2)}</td>
				// 				<td align="right">{formatNumber(Total, 2)}</td>
				// 				<td>{items[0].currency}</td>
				// 				<td colSpan="5"></td>
				// 		</tr>
				// )
		} else {
			if(loadings.showItems){
				rows = (<RowEmpty colSpan='15'><i className="fas fa-spinner fa-pulse"></i>Loading</RowEmpty>);
			} else {
				rows = (<RowEmpty colSpan='15'>Tidak ada data</RowEmpty>);
			}
		}

		return (
			<div>
				<Panel>
					<PanelHeader>Selected Transmittal Document</PanelHeader>
					{(loadings.items) && <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>}
					{(!loadings.items) &&
					<PanelBody >
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
												<th>Faktur Pajak</th>
												<th>Tgl. Faktur Pajak</th>
												<th>No. Invoice</th>
												<th>Tgl. Invoice</th>
												<th>Jenis Invoice</th>
												<th>Vendor Code</th>
												<th>Vendor</th>
												<th>No. PO (Sap)</th>
												<th>Keterangan</th>
												<th>Nilai Invoice</th>
												<th>Currency</th>
												<th>Status</th>
												<th>Next Process</th>
												<th>Tgl. Status</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody>{rows}</tbody>
									</table>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-sm-12">
								<div className="pull-right m-t-5 m-b-5">
									<div>
										{status_processing &&
											<span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
												*Mohon pilih Invoice dengan <b>Next Process</b> yang sama
											</span>
										}
										{/* {(this.props.user.has_roles.includes("INVER1") || this.props.user.has_roles.includes("INVER2")) &&
											<button
												type="button"
												className="btn btn-white m-r-5"
												onClick={(e) => this.props.generateTransmittal(e)}
												disabled={loadings.button}
											>
												{loadings.button && <i className="fas fa-spinner fa-pulse"></i> }Print
											</button>
										} */}
										{(this.props.user.has_roles.includes("INVER1") || this.props.user.has_roles.includes("INVER2")) &&
											<button
												type="button"
												className="btn btn-success m-r-5"
												onClick={(e) => this.props.submitTransmittal()}
												disabled={loadings.button}
											>
												{loadings.button && <i className="fas fa-spinner fa-pulse"></i> }{t('Button.Submit')}
											</button>
										}
										<button
											type="button"
											className="btn btn-white m-r-5"
											// onClick={(e) => window.history.back()}
											onClick={(e) => window.location.reload()}
											disabled={loadings.button}
										>
											{t('Button.Batal')}
										</button>
									</div>
								</div>
							</div>
						</div>
					</PanelBody>}
				</Panel>
			</div>
		);
	}
}

export default Item;
