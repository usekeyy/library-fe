import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toastr} from 'react-redux-toastr';
import 'react-table/react-table.css';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Link } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { fetchProfileVendor, showVendorSummary, downloadSLK } from '../../../../store/actions/vendor/profile-vendor/perusahaanActions';
import ReactLoading from 'react-loading';
import {statusName} from '../../../../helpers/statusName'

class Profile extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
		this.state = {
			uuid: this.props.location.pathname.split("/")[4],
			profile_vendor: {
				sendData: {
					company_type_name: '',
					bidang_usaha: '',
					created_at: '',
					id: '',
					merk_or_brand: '',
					name: '',
					status: '',
					sub_bidang_usaha: '',
					uuid: '',
					vendor_id: '',
					vendor_type_name: '',
					suap_file: '',
					sap_code: '',
					extend_company :''
				},
				loading: true
			},
		};
	}
	
  componentDidMount = () => {
    this._isMounted = true;
		if(this._isMounted){
			this.showVendorSummary(this.state.uuid)
		}
	}
	
	componentWillUnmount() {
		this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
	}

	showVendorSummary = (id) => {
		this.setState(({ profile_vendor }) => ({ profile_vendor: { ...profile_vendor, loading: true } }));
		this.props.showVendorSummary(id)
		.then((resp) => {
			var data = resp.data.data;
			var setSendData = {...this.state.profile_vendor.sendData}
			setSendData.sap_code = data.sap_code;
			setSendData.company_type_name = data.company_type_name;
			setSendData.bidang_usaha = data.bidang_usaha;
			setSendData.created_at = data.created_at;
			setSendData.id = data.id;
			setSendData.merk_or_brand = data.merk_or_brand;
			setSendData.name = data.name;
			setSendData.status = data.status;
			setSendData.sub_bidang_usaha = data.sub_bidang_usaha;
			setSendData.uuid = data.uuid;
			setSendData.vendor_id = data.vendor_id;
			setSendData.vendor_type_name = data.vendor_type_name;
			setSendData.suap_file = data.suap_file;
			setSendData.extend_company = data.extend_company;
			this.setState(({ profile_vendor }) => ({
				profile_vendor: { ...profile_vendor, loading: false, sendData: setSendData }
			}));
		})
		.catch((resp) => {
			this._isMounted = true && this.setState(({ profile_vendor }) => ({ profile_vendor: { ...profile_vendor, loading: false } }));
			toastr.error(resp.data.status, resp.data.message);
			this.props.history.push('/vendor/list')
		});
	}

	handleProcces = () => {
		this.props.history.push('/vendor/verification/profile')
	}

	showProfileVendor = (e, vendor_uuid, verif_uuid) => {
		e.preventDefault();
		this.setState(({ profile_vendor }) => ({ profile_vendor: { ...profile_vendor, loading: true } }));
		this.props.fetchProfileVendor(vendor_uuid, verif_uuid)
		.then((resp) => {
			this.setState(({ profile_vendor }) => ({ profile_vendor: { ...profile_vendor, loading: true } }));
			setTimeout(() => {
				this.setState({loading: false}, () => this.toProfileVendor());
			}, 100)
		})
		.catch((resp) => {
			toastr.error(resp.data.status, resp.data.message);
			this.setState({loading: false});
		});
	}
	
	downloadSLK = (e, uuid) => {
		e.preventDefault();
		// this.setState(({ profile_vendor }) => ({ profile_vendor: { ...profile_vendor, loading: true } }));
		this.props.downloadSLK(uuid)
		.then((resp) => {
			const url = window.URL.createObjectURL(new Blob([resp.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', 'SLK.pdf'); //or any other extension
			document.body.appendChild(link);
			link.click();
		})
		.catch((resp) => {
			toastr.error("Failed Download SLK");
			// this.setState({loading: false});
		});
	}

	toProfileVendor = () => {
		// this.props.history.push('/vendor/verification/profile')
		this.props.history.push('/vendor/list/daftar-vendor/profile')
	}

	toPunishmentVendor = (e, uuid) => {
		e.preventDefault()
		this.props.history.push(`/vendor/punishment-vendor/${uuid}`)
	}

  render(){
    return (
      <div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">Home</li>
					<li className="breadcrumb-item">Vendor Management</li>
					<li className="breadcrumb-item active">Profile Singkat Vendor</li>
				</ol>
				<h1 className="page-header">Profile Singkat Vendor </h1>
				<Panel loading={false}>
					<PanelHeader></PanelHeader>
					<PanelBody loading={false}>
					{this.state.profile_vendor.loading && <center><br/><ReactLoading type="cylon" color="#0f9e3e" /><br/></center>}
						{!this.state.profile_vendor.loading && 
						<div className="row">
							<div className="col-md-8">
							<table className="table table-bordered">
										<thead>
												<tr>
													<th colSpan="2">
														<h2 className="m-l-10 text-center">{`${(this.state.profile_vendor.sendData.company_type_name !== undefined && this.state.profile_vendor.sendData.company_type_name !== null) ? this.state.profile_vendor.sendData.company_type_name?.toUpperCase()+'.' : ''} ${this.state.profile_vendor.sendData.name?.toUpperCase()}`}</h2>
													</th>
												</tr>
										</thead>
										<tbody>
											<tr>
												<td>No Pendaftaran</td>
												<td>{this.state.profile_vendor.sendData.id}</td>
											</tr>
											<tr>
												<td>No ERP</td>
												<td>{this.state.profile_vendor.sendData.sap_code}</td>
											</tr>
											<tr>
												<td>Tipe Vendor</td>
												<td>{this.state.profile_vendor.sendData.vendor_type_name}</td>
											</tr>
											<tr>
												<td>Bidang Usaha</td>
												<td>{this.state.profile_vendor.sendData.bidang_usaha}</td>
											</tr>
											<tr>
												<td>Sub Bidang Usaha</td>
												<td>{this.state.profile_vendor.sendData.sub_bidang_usaha}</td>
											</tr>
											<tr>
												<td>Merk/Brand</td>
												<td>{
													(this.state.profile_vendor.sendData.merk_or_brand !== null && this.state.profile_vendor.sendData.merk_or_brand !== undefined && this.state.profile_vendor.sendData.merk_or_brand.indexOf(",") !== -1) ?
													this.state.profile_vendor.sendData.merk_or_brand.split(",").map((data, key) => {
														return <span key={key} className="label label-green m-r-5">{data}</span>
													})
													:
													this.state.profile_vendor.sendData.merk_or_brand
												}</td>
											</tr>
											<tr>
												<td>SIMAP File</td>
												<td>
													{this.state.profile_vendor.sendData.suap_file}
													{( this.state.profile_vendor.sendData.suap_file !== "" && this.state.profile_vendor.sendData.suap_file!==null) ? <a className="pull-right" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/vendor/${this.state.profile_vendor.sendData.suap_file}` } > {`Lihat File`} </a> : '' }
												</td>
											</tr>
											<tr>
												<td>Extend Company</td>
												<td>{this.state.profile_vendor.sendData.extend_company}</td>
											</tr>
											<tr>
												<td>Status</td>
												<td>{statusName(this.state.profile_vendor.sendData.status)}</td>
											</tr>
										</tbody>
								</table>
								<button className="btn btn-primary btn-sm m-l-10" type="button" onClick={() => window.history.back()} > 
									Kembali
								</button>
							</div>
							<div className="col-md-4">
								<div className="vertical-box with-grid inbox">
									<div className="vertical-box-column width-200 hidden-xs">
										<div className="vertical-box">
											<div className="wrapper text-center">
											<div className="nav-title"><b>Go To</b></div>
											</div>
											<div className={"vertical-box-row collapse d-lg-table-row " + (this.state.isMobileEmailNavOn ? 'show' : '') }>
												<div className="vertical-box-cell">
													<div className="vertical-box-inner-cell">
														<PerfectScrollbar className="height-full" options={{suppressScrollX: true}}>
															<div className="wrapper p-0 text-center">
																<ul className="nav nav-inbox">
																	<li><Link onClick={(e) => this.showProfileVendor(e, this.state.uuid, false)} to="/"><i className="fa fa-user fa-fw m-r-5"></i> Profil Vendor </Link></li>
																	<li><Link to={`/vendor/dokumen-expired/${this.state.uuid}`}><i className="fa fa-briefcase fa-fw m-r-5"></i> Dokumen Expired</Link></li>
																	{/* <li><Link to="/vendor/performance-report"><i className="fa fa-pencil-alt fa-fw m-r-5"></i> Penilaian Vendor</Link></li> */}
																	<li><Link to={{pathname: "/vendor/performance-report", sap_code : this.state.profile_vendor.sendData.sap_code}}><i className="fa fa-pencil-alt fa-fw m-r-5"></i> Penilaian Vendor</Link></li>
																	{/* <li><Link to="/" onClick={(e) => this.toPunishmentVendor(e, this.state.uuid)} ><i className="fa fa-flag fa-fw m-r-5"></i> Punishment Vendor</Link></li> */}
																	<li><Link to={{pathname: "/vendor/punishment-vendor", sap_code : this.state.profile_vendor.sendData.sap_code}}><i className="fa fa-flag fa-fw m-r-5"></i> Punishment Vendor</Link></li>
																	<li><Link onClick={(e) => this.downloadSLK(e, this.state.uuid)} to="/"><i className="fa fa-envelope fa-fw m-r-5"></i> SLK</Link></li>
																</ul>
															</div>
														</PerfectScrollbar>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>}
					</PanelBody>
				</Panel>
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
		showVendorSummary: (vendor_uuid) => dispatch(showVendorSummary(vendor_uuid)),
		fetchProfileVendor: (vendor_uuid, verif_uuid) => dispatch(fetchProfileVendor(vendor_uuid, verif_uuid)),
		downloadSLK: (uuid) => dispatch(downloadSLK(uuid)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (Profile));