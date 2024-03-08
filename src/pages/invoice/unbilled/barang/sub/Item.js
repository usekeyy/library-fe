import React, {Component} from 'react';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { Button } from 'reactstrap';
import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
import { formatNumber2} from '../../../../../helpers/formatNumber';
import moment from 'moment';

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

	edits(e, value) {
		let data = this.props.parentState.data_invoice.items
		let index = data.findIndex(d => d.uuid === value)
		switch (data[index].category) {
			case 'Barang':
				const url = '/invoice/unbilled/barang/detail/' + value
				this.props.redirectDetail(url)				
				break;
			case 'Additional Cost':
				// console.log('ini additional cost')
				this.props.modalAdditionalCost(data[index])
				break;
			default:
				break;
		}
	}

	render(){
		const { t } = this.props;
		const {items} = this.props.parentState.data_invoice;
		const status_processing = this.props.parentState.status_processing;
		const status_barang = this.props.parentState.status_barang;
		const {uuid} = this.props.parentState;
		const {loadings} = this.props.parentState;
		let rows;

		if (items.length > 0) {
			let total_amount = 0;
			let total_penalty = 0;
			rows = items.map((dt, i) => {
				// total_amount += dt.amount * (dt.qty/dt.per)
				total_amount += parseFloat(dt.amount)
				total_penalty += parseFloat(dt.penalty)
				return (
					<tr key={i}>
						<td>{dt.category}</td>
						<td>{dt.company_id}</td>
						<td>{dt.company_name}</td>
						<td>{dt.po_eproc_number}</td>
						<td>{dt.po_sap_number}</td>
						<td>{dt.po_item_no}</td>
						<td>{dt.goods_receipt_number}</td>
						<td>{dt.item_no}</td>
						<td>{dt.short_text}</td>
						<td align="right">{formatNumber2(dt.qty, 3)}</td>
						<td>{dt.uom}</td>
						<td align="right">{formatNumber2(dt.amount, 2)}</td>
						<td align="right">{formatNumber2(dt.penalty, 2)}</td>
						<td>{dt.currency}</td>
						{/* <td>{(dt.assign_processing !== null && dt.assign_processing !== "") ? dt.assign_processing : (items_tender.length > 0) ? this.findProcessing(items_tender, dt.uuid) : '-' }</td> */}
						<td>{dt.post_date !== undefined && dt.post_date !== null && dt.post_date !== '' ? moment(dt.post_date).format("DD-MM-YYYY") : ''}</td>
						<td>{dt.doc_date !== undefined && dt.doc_date !== null && dt.doc_date !== '' ? moment(dt.doc_date).format("DD-MM-YYYY") : ''}</td>
						<td>{dt.plant}</td>
						<td>
							<button className="btn btn-xs btn-primary" onClick={(e) => this.edits(e, dt.uuid)} disabled={loadings.button} >Detail</button>
						</td>
					</tr>
				)
			})

			rows.push(
				<tr key={items.length + 1}>
					<td colSpan="11">Total Harga</td>
					<td align="right">{formatNumber2(total_amount.toFixed(2), 2)}</td>
					<td align="right">{formatNumber2(total_penalty.toFixed(2), 2)}</td>
					<td>{items[0].currency}</td>
					<td colSpan="4"></td>
				</tr>
			)
		} else {
			if(loadings.showItems){
				rows = (<RowEmpty colSpan='17'><i className="fas fa-spinner fa-pulse"></i>Loading</RowEmpty>);
			} else {
				rows = (<RowEmpty colSpan='17'>Tidak ada data</RowEmpty>);
			}
		}

		return (
			<div>
				<Panel>
					<PanelHeader>Selected Unbilled Invoice</PanelHeader>
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
												<th>Kategori</th>
												<th>Company Code</th>
												<th>Company Name</th>
												<th>No. PO (Eproc)</th>
												<th>No. PO (Sap)</th>
												<th>PO Item</th>
												<th>No. GR</th>
												<th>GR Item</th>
												<th>Description</th>
												<th>QTY</th>
												<th>UOM</th>
												<th>Amount</th>
												<th>Penalty</th>
												<th>Currency</th>
												<th>Post Date</th>
												<th>Doc. Date</th>
												<th>Plant</th>
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
												*Mohon pilih item dengan no. PO yang sama
											</span>
										}
										{status_barang &&
											<span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
												*Mohon pilih parent item barang dari additional cost yang dipilih
											</span>
										}
										<button
											type="button"
											className="btn btn-success m-r-5"
											onClick={(e) => this.props.submitUnbilled()}
											disabled={loadings.button}
										>
											{loadings.button && <i className="fas fa-spinner fa-pulse"></i> }{t('Button.Submit')}
										</button>
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
