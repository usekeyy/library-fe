import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toastr} from 'react-redux-toastr';
import 'react-table/react-table.css';
import {RowEmpty} from '../../../../components/tableoptions/TableOptions';
import ReactLoading from 'react-loading';
import SweetAlert from 'react-bootstrap-sweetalert';
import { withTranslation } from 'react-i18next';
import { formatDate } from '../../../../helpers/formatDate';


class ExtendCompany extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
	
		this.state = {
			data: [],
			loading: false,
			isConfirm: false,
			errors: [],
			sendData: {
				vendor_id: '',
				company_id: '',
			},
			options: {

			},
		}
	}

	
  componentDidMount = () => {
    this._isMounted = true;
		if(this._isMounted){
			this.fetchData();
		}
	}
	
	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
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

	fetchData = () => {
		if(this._isMounted){
			this.asyncData(this.props.vendor_uuid, this.state.options)
		}
	}

	handleDaftar = (e, value) => {
		e.preventDefault();
		this.setState(({ sendData }) => ({
			sendData: { ...sendData, vendor_id: this.props.vendor_id, company_id: value },
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
					this.fetchData()
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
							<td>{ formatDate(dt.created_at, true) }</td>
							<td>{ formatDate(dt.approved_at, true) }</td>
							<td>{ dt.vendor_status }</td>
							<td>{ dt.note }</td>
							<td> 
								{ (dt.vendor_status === 'Unregistered' || dt.vendor_status === 'unregistered') &&
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
				{(this.state.loading) && ( <center> <br/> <ReactLoading type="cylon" color="#0f9e3e" /> <br/> </center> )}
				{!this.state.loading && <div className="table-responsive">
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