import React, {Component} from 'react';
import {connect} from 'react-redux';
import 'react-table/react-table.css';
import { withTranslation } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import { fileUpload } from '../../../../store/actions/uploadActions';
import { saveVendorRegistrationTender } from '../../../../store/actions/tendering/vendorRegistrationTenderActions';
import { getProposalTender } from '../../../../store/actions/tendering/proposalTenderActions';
import Form from './sub/Form';

class RegistrasiUndanganTender extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
		this.state = {
			paramId: this.props.location.pathname.split("/")[4],
			vendor_registration_tender: {
				header: {
					ambang_batas: '',
					approved_at: '',
					bid_bond: '',
					bid_bond_value: '',
					bobot_komersil: '',
					bobot_teknis: '',
					created_at: '',
					created_by: '',
					delivery_location: '',
					delivery_time: '',
					id: '',
					incoterm_id: '',
					lingkup_pekerjaan: '',
					masa_berlaku: '',
					metode_aanwijzing_id: '',
					metode_evaluasi: '',
					metode_negosiasi: '',
					metode_pengadaan_id: '',
					metode_penyampaian_id: '',
					multiwinner: '',
					note_external: '',
					note_internal: '',
					number: '',
					order_placement: '',
					pra_qualification: '',
					purchasing_group_id: '',
					purchasing_org_id: '',
					reference: '',
					status: '',
					status_aanwijzing: '',
					status_text: '',
					title: '',
					updated_at: '',
					updated_by: '',
					uuid: '',
					visibilitas_bid_open: '',
					bo_start_date: '',
					company_name: '',
					metode_aanwijzing: {},
					metode_pengadaan: {},
					metode_penyampaian: {},
				},
				items: [],
				schedules: [],
				terms: [],
				errors: [],
			},
			loadings: {
				button: false,
				pages: false,
				items: false
			}
		}
	}
	
  componentDidMount = () => {
		this._isMounted = true;
		if(this._isMounted){
			this.getProposalTender(this.state.paramId)
		}
	}
	
	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
	}

	getProposalTender = (uuid, params) => {
		if(this._isMounted){
			this.setState(({ loadings }) => ({ loadings: { ...loadings, pages: true, button: true } }));
			this.props.getProposalTender(uuid, params)
			.then((resp) => {
				const data = resp.data.data;
				if (data.registration_status !== null && data.registration_status !== undefined && data.registration_status !== ''){
					toastr.error('Akses Denied')
					this.props.history.push(`/task-vendor/undangan-tender-aktif`)
				}else{
					const setHeader = {...this.state.vendor_registration_tender.header}
					setHeader.ambang_batas = data.ambang_batas;
					setHeader.approved_at = data.approved_at;
					setHeader.bid_bond = data.bid_bond;
					setHeader.bid_bond_value = data.bid_bond_value;
					setHeader.bobot_komersil = data.bobot_komersil;
					setHeader.bobot_teknis = data.bobot_teknis;
					setHeader.created_at = data.created_at;
					setHeader.created_by = data.created_by;
					setHeader.delivery_location = data.delivery_location;
					setHeader.delivery_time = data.delivery_time;
					setHeader.id = data.id;
					setHeader.incoterm_id = data.incoterm_id;
					setHeader.lingkup_pekerjaan = data.lingkup_pekerjaan;
					setHeader.masa_berlaku = data.masa_berlaku;
					setHeader.metode_aanwijzing_id = data.metode_aanwijzing_id;
					setHeader.metode_evaluasi = data.metode_evaluasi;
					setHeader.metode_negosiasi = data.metode_negosiasi;
					setHeader.metode_pengadaan_id = data.metode_pengadaan_id;
					setHeader.metode_penyampaian_id = data.metode_penyampaian_id;
					setHeader.multiwinner = data.multiwinner;
					setHeader.note_external = data.note_external;
					setHeader.note_internal = data.note_internal;
					setHeader.number = data.number;
					setHeader.order_placement = data.order_placement;
					setHeader.pra_qualification = data.pra_qualification;
					setHeader.purchasing_group_id = data.purchasing_group_id;
					setHeader.purchasing_org_id = data.purchasing_org_id;
					setHeader.reference = data.reference;
					setHeader.status = data.status;
					setHeader.status_aanwijzing = data.status_aanwijzing;
					setHeader.status_text = data.status_text;
					setHeader.title = data.title;
					setHeader.updated_at = data.updated_at;
					setHeader.updated_by = data.updated_by;
					setHeader.uuid = data.uuid;
					setHeader.visibilitas_bid_open = data.visibilitas_bid_open;
					setHeader.metode_aanwijzing = data.metode_aanwijzing;
					setHeader.metode_pengadaan = data.metode_pengadaan;
					setHeader.metode_penyampaian = data.metode_penyampaian;
					setHeader.company_name = data.company_name;
					setHeader.bo_start_date = `${data.bo_start_date?.end_date} ${data.bo_start_date?.end_time}`;
	
					this.setState(({ loadings, vendor_registration_tender }) => ({ 
						loadings: { ...loadings, button: false },
						vendor_registration_tender : {
								...vendor_registration_tender,
								errors: [],
								items: data.items.sort((a,b) => a.item_no-b.item_no).sort((a,b) => a.purchasing_requisition_number-b.purchasing_requisition_number),
								schedules: data.schedules,
								terms: data.terms,
								header: setHeader
						}
					}));
				}
				console.log(data);
			})
			.catch((resp) => {
				this.setState(({ loadings }) => ({ loadings: { ...loadings, pages: false, button: false } }));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}

	saveVendorRegistrationTender = (params) => {
		if(this._isMounted){
			this.setState(({ loadings }) => ({ loadings: { ...loadings, pages: true, button: true } }));
			this.props.saveVendorRegistrationTender(this.state.paramId, params)
			.then((resp) => {
				toastr.success("Success", "Data Has Been Saved");
				this.setState(({ loadings, vendor_registration_tender }) => ({ 
					loadings: { ...loadings, button: false },
					vendor_registration_tender : { ...vendor_registration_tender, errors: [] }
				}));
				this.props.history.push(`/task-vendor/undangan-tender-aktif`)
			})
			.catch((resp) => {
				this.setState(({ loadings, vendor_registration_tender }) => ({ 
					loadings: { ...loadings, button: false },
					vendor_registration_tender : { ...vendor_registration_tender, errors: resp.data.errors }
				}));
				toastr.error(resp.data.status, resp.data.message);
				toastr.error("Belum memasuki jadwal registrasi");
			});
		}
	}

  render(){
		// const {t} = this.props;
    return (
      <div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">Home</li>
					<li className="breadcrumb-item">Task Vendor</li>
					<li className="breadcrumb-item active">Registrasi Undangan Tender</li>
				</ol>
				<h1 className="page-header">Registrasi Undangan Tender </h1>
				<Form
						parentState={this.state}
						parentProps={this.props}
						upload={this.props.fileUpload}
						saveVendorRegistrationTender={this.saveVendorRegistrationTender}
					/>
			</div>
    );
  }
}

const stateToProps = state => {
	return {
		sidebarDt: state.sidebarDt,
    access: state.sidebarDt.access,
		user: state.auth.user.data,
		temporary: state.temporary
	}
}

const dispatchToProps = dispatch => {
	return {
		fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
		getProposalTender: (uuid, params) => dispatch(getProposalTender(uuid, params)),
		saveVendorRegistrationTender: (uuid, params) => dispatch(saveVendorRegistrationTender(uuid, params)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (RegistrasiUndanganTender));