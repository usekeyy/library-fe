import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toastr} from 'react-redux-toastr';
import { Col } from 'reactstrap';
import 'react-table/react-table.css';
import {RowEmpty} from '../../../../components/tableoptions/TableOptions';
import InputVendor from './InputVendor';
import ReactLoading from 'react-loading';
import SweetAlert from 'react-bootstrap-sweetalert';
import { withTranslation } from 'react-i18next';
import {debounce} from '../../../../helpers/debounce';

class ExtendCompany extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
	
		this.state = {
			data: [],
			data_vendor: [],
			vendor_uuid: '',
			company_id: this.props.company_id,
			loading: false,
			isConfirm: false,
			errors: [],
			sendData: {
				vendor_id: '',
				company_id: '',
			},
			options: {

			},
			m_vendor: [],
			loadings: {
				vendor: true,
			},
		}
	}

	debounced = debounce((e) => this.getDataVendor(e));

	
  componentDidMount = () => {
    this._isMounted = true;
		if(this._isMounted){
			this.getDataVendor();
		}
	}
	
	componentWillUnmount() {
		this._isMounted = false;
		// fix Warning: Can't perform a React state update on an unmounted component
		this.setState = (state,callback)=>{
			return;
		};
	}

	changeInputDataVendor = (param) => {
		this.setState(({ loadings }) => ({
			loadings: { ...loadings, vendor: true },
		}));
		this.debounced(param)
	}
	

	getDataVendor = async (param) => {
		this.setState(({ loadings }) => ({
			loadings: { ...loadings, vendor: true },
		}));
		let select_params = param==='' ? {status: 'y', length: 10, start:0} : {status: 'y', length: 10, start:0, select : param} ;

		this.props.fetchDataVendor(select_params)
			.then((resp) => {
				let data = resp.data.data;
				let options = data.map((data) => {
					return { value: data.uuid, label: data.id + ' - ' + data.name };
				});
				this.setState(({ loadings, m_vendor }) => ({
					loadings: { ...loadings, vendor: false },
					m_vendor: options,
				}));
			})
			.catch((resp) => {
				this.setState(({ loadings }) => ({
					loadings: { ...loadings, vendor: false },
				}));
				toastr.error(resp.data.message);;
			});
	};
	
	handleChangeVendor = (e) => {
		let selected_value = e;
		this.setState({ vendor_uuid: selected_value });
		this.filterVendor(selected_value)
		this.asyncData(selected_value, this.state.options)
	}

	asyncData = async (vendor_uuid, params) => {
		this.setState({loading: true})
		this.props.showExtendCompany(vendor_uuid, params)
			.then((resp) => {
				if(this._isMounted){
					this.setState({loading: false, data: resp.data.data});
					console.log(this.state)
				}
			})
			.catch((resp) => {
				this._isMounted = false && this.setState({loading: false})
toastr.error(resp.data.status, resp.data.message);
			});
	}

	filterVendor(uuid) {
		this.props.fetchDataVendor({uuid: uuid})
			.then((resp) => {
				let data = resp.data.data;
				this.setState({ data_vendor: data[0] })
			})
			.catch((resp) => {
			});
	}

	handleDaftar = (e, value) => {
		e.preventDefault();
		this.setState(({ sendData }) => ({
			sendData: { ...sendData, vendor_id: this.state.data_vendor.id, company_id: value },
			isConfirm: true
		}));
	}


	toggleSweetAlert(name) {
		if(this._isMounted){
			switch(name) {
				case 'confirm':
					this.handleSave(this.state.sendData)
					break;
				case 'cancel':
					this.setState(({ sendData }) => ({
						// sendData: { ...sendData, vendor_id: '', company_id: '' },
						isConfirm: false
					}));
					break;
				default:
					break;
			}
		}
	}

	handleSave = (payload) => {
		if(this._isMounted){
			this.setState({loading: true, isConfirm: false})
			this.props.setLoading(true);
			this.props.save(payload)
			.then(res => {
				const response = res.data;
				toastr.success(response.message);
				this.setState(({ sendData }) => ({
					sendData: { ...sendData, vendor_id: '', company_id: '' },
					isConfirm: false, loading: false, errors: []
				}), () => {
					this.asyncData(this.state.vendor_uuid, this.state.options)
					this.props.setLoading(false);
				});
			})
			.catch(error => {
				let msg_errors;
				this.props.setLoading(false);
				const {message} = (typeof error !== 'undefined') ? error.data : 'Error';
				this._isMounted && this.setState(({ sendData }) => ({
					sendData: { ...sendData, vendor_id: '', company_id: '' },
					isConfirm: false, loading: false, errors: error.data.errors
				}), () => {
					for (const [value] of Object.entries(this.state.errors)) {
						msg_errors = value[0]
        	}
				});
				toastr.error(message, msg_errors);
			})
		}
	}
	
  render(){
		const {t} = this.props;
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
							<td> 
								{ (dt.id === this.state.company_id && (dt.vendor_status === 'Unregistered' || dt.vendor_status === 'unregistered')) &&
									<button type="button" className="btn btn-primary btn-sm" onClick={(e) => this.handleDaftar(e, dt.id)}>Daftar</button>
								}
							</td>
						</tr>
				))
		} else {
				rows = (<RowEmpty colSpan='5'>Tidak ada data</RowEmpty>);
		}
    return (
      <div>
				<Col sm="4" style={{ padding : 0}}>
					<InputVendor
						loadings={this.state.loadings}
						m_vendor={this.state.m_vendor}
						errors={this.state.errors}
						handleChangeVendor={this.handleChangeVendor}
						getDataVendor={(e)=>this.changeInputDataVendor(e)}
					/>
				</Col>
				{(this.state.loading) && ( <center> <br/> <ReactLoading type="cylon" color="#0f9e3e" /> <br/> </center> )}
				{!this.state.loading && <div className="table-responsive">
					<h4>Nama Vendor : {this.state.data_vendor ? this.state.data_vendor.name : ''}</h4>
					<h4>No Vendor : {this.state.data_vendor ? this.state.data_vendor.id : ''}</h4>
					<h4>No ERP : {this.state.data_vendor ? this.state.data_vendor.sap_code : ''}</h4>
					<br></br>

					<table className="table table-bordered table-striped table-sm">
						<thead>
							<tr>
								<th>Purchasing Org</th>
								<th>Tanggal Pengajuan</th>
								<th>Tanggal Verifikasi</th>
								<th>Status</th>
								<th>Catatan Verifikasi</th>
								<th>Aksi</th>
							</tr>
						</thead>
						<tbody>{rows}</tbody>
					</table>
				</div>}
				{(this.state.isConfirm &&
					<SweetAlert 
						warning
						showCancel
						confirmBtnText={"Konfirmasi"}
						cancelBtnText={t("common:delete.cancel")}
						confirmBtnBsStyle="primary"
						cancelBtnBsStyle="default"
						title={t("common:delete.title-delete")}
						onConfirm={() => this.toggleSweetAlert('confirm')}
						onCancel={() => this.toggleSweetAlert('cancel')}
					>
					</SweetAlert>
				)}
			</div>
    );
  }
}

const stateToProps = state => {
	return {
		sidebarDt: state.sidebarDt,
		access: state.sidebarDt.access
	}
}

const dispatchToProps = dispatch => {
	return {
		
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (ExtendCompany));