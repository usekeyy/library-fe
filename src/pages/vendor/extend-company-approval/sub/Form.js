import React, {Component} from 'react';
import {toastr} from 'react-redux-toastr';
import 'react-table/react-table.css';
import {RowEmpty} from '../../../../components/tableoptions/TableOptions';
import ReactLoading from 'react-loading';
import { withTranslation } from 'react-i18next';
import ModalForm from './Modal'
import {withRouter} from "react-router-dom";

class Form extends Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
		this.state = {
			data: [],
			isConfirm: false,
			loading: false,
			error: false,
			errors: [],
			params: {
				id: '',
				name: '',
			},
			uuid_verif: false,
			approval: {
				status: '',
				name: '',
			},
			uuid: '',
			options: {},
			options_verif: {
				vendor_id: this.props.data.vendor_id,
			},
		}
	}
	

	componentDidMount = () => {
		this._isMounted = true;
		if (this._isMounted){
			// this.getCompanies();
			this.props.fetchIncoterms('')
			this.props.fetchVendorAccGroup('')
			this.props.fetchGlAccount('')
			this.props.fetchCurrencies('')
			this.props.fetchSearchTerms('')
			this.props.fetchTermOfPayment('')
			this.asyncData(this.props.data.vendor_uuid, this.state.options)
		}
	}
	
	componentWillUnmount() {
		this._isMounted = false;
		// fix Warning: Can't perform a React state update on an unmounted component
		this.setState = (state,callback)=>{
			return;
		};
	}

	toggleClose = () => {
			this.setState({ isConfirm:false })
	}

	handleShow = (vendor_uuid, verif_uuid) => {
		this.setState({loading: true});
		if(!verif_uuid){
			verif_uuid = false;
		}
		this.props.fetchProfileVendor(vendor_uuid, verif_uuid).then((resp) => {
			this.setState({loading: false}, () => this.handleProcces());
		})
		.catch((resp) => {
			toastr.error(resp.data.status, resp.data.message);
			this.setState({loading: false});
		});
	}

	handleProcces = () => {
		// this.handleShow(value, 'vendor_address')
		const win = window.open("/vendor/verification/profile", "_blank");
		win.focus();		
	}
	
	asyncData = async (uuid, params) => {
		this.setState({ loading: true })
		this.props.fetchVerificationList(this.state.options_verif)
		.then((resp) => {
			if( resp.data.data.length ){
				this.setState({
					uuid_verif: resp.data.data[0].uuid,
				})
			}
			})
			.catch((resp) => {
					let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
					toastr.error('Oops', message);
			})
			.then(() => {
					this.setState({ loading: false })
		})

		this.props.showApprovalExtendCompany(uuid, params)
			.then((resp) => {
					this.setState({
							data: resp.data.data,
							// pages: Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.params.length)
					})
			})
			.catch((resp) => {
					let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
					toastr.error('Oops', message);
			})
			.then(() => {
					this.setState({ loading: false })
		})
	}

	setLoading = (type) => {
		this.setState({ loading: type }, () => {
			this.props.setLoading(type)
		})
	}
	
	handleApprove = (e, status, name, dt) => {
		e.preventDefault();
		this.props.setPuchaseOrg(dt);
		this.setState(({ approval }) => ({
			isConfirm: true,
			modalOpen: true,
			approval: { ...approval, status: status, name: name },
		}));
	}

	render(){
		// const {t} = this.props;
		let rows;
		let {data} = this.state;

		if(data.length > 0){
			rows = data.map((dt, i) => (
				<tr key={i}>
					<td>{ dt.name }</td>
					<td>{ dt.created_at }</td>
					<td>{ dt.approved_at }</td>
					<td>{ dt.vendor_status }</td>
					<td>{ dt.note }</td>
					{ !this.props.toggleDetail &&
						( dt.id === this.props.data.company_id ?
						<td> 
							<button type="button" className="btn btn-primary btn-sm" onClick={(e) => this.handleApprove(e, 's', 'Approve', dt)}>Approve</button>
							<button type="button" className="btn btn-danger btn-sm" onClick={(e) => this.handleApprove(e, 'r', 'reject', dt)}>Reject</button>
							<button type="button" className="btn btn-primary btn-sm" onClick={(e) => this.handleShow(this.props.data.vendor_uuid, this.state.veruf_uuid)}>Pofile</button>
						</td> : <td></td> )
					}
				</tr>
			))
		} else {
			rows = (<RowEmpty colSpan='5'>Tidak ada data</RowEmpty>);
		}

		// const {status} = this.props.parentState.data;

		return (
			<div>
				{(this.state.loading) && ( <center> <br/> <ReactLoading type="cylon" color="#0f9e3e" /> <br/> </center> )}
				{!this.state.loading && <div className="table-responsive">
					<div className="row">
						<div className="col-md-12">
							<div className="form-group row">
								<label className="col-sm-2 col-form-label">Nama Vendor</label>
								<div className="col-sm-10">
									<input type="text" name="vendor_name" className="form-control" value={this.props.data.vendor_name} disabled={true} />
								</div>
							</div>
							<div className="form-group row">
								<label className="col-sm-2 col-form-label">No Vendor</label>
								<div className="col-sm-10">
									<input type="text" name="vendor_id" className="form-control" value={this.props.data.vendor_id} disabled={true} />
								</div>
							</div>
							<div className="form-group row">
								<label className="col-sm-2 col-form-label">No ERP</label>
								<div className="col-sm-10">
									<input type="text" name="sap_number" className="form-control" value={this.props.data.sap_number} disabled={true} />
								</div>
							</div>
						</div>
					</div>
					<br></br>
					<table className="table table-bordered table-striped table-sm">
						<thead>
							<tr>
								<th>Purchasing Org</th>
								<th>Tanggal Pengajuan</th>
								<th>Tanggal Approve</th>
								<th>Status</th>
								<th>Catatan Verifikasi</th>
								{ !this.props.toggleDetail && <th>Aksi</th> }
								
							</tr>
						</thead>
						<tbody>{rows}</tbody>
					</table>
				</div>}
				{(this.state.isConfirm &&
					<ModalForm
							parentState={this.props.parentState}
							errors={this.state.errors}
							toggleAdd={this.state.modalOpen}
							uuid={this.props.data.uuid}
							approval={this.state.approval}
							loadingSubmit={this.state.loadingSubmit}
							updatePayload={this.props.updatePayload}
							toggleClose={this.toggleClose}
							t={this.props.t}
							data_vendor={this.props.data_vendor}
							handleChange={this.props.handleChange}
							fetchIncoterms={this.props.fetchIncoterms}
							fetchVendorAccGroup={this.props.fetchVendorAccGroup} 
							fetchGlAccount={this.props.fetchGlAccount}
							fetchCurrencies={this.props.fetchCurrencies}
							fetchSearchTerms={this.props.fetchSearchTerms}
							fetchTermOfPayment={this.props.fetchTermOfPayment}
					/>
				)}
			</div>
		);
  }

}

export default withRouter(withTranslation() (Form));