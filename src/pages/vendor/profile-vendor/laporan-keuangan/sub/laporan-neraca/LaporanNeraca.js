import React from 'react';
import {connect} from 'react-redux';
import { withTranslation } from 'react-i18next';
import {toastr} from 'react-redux-toastr';
import ReactLoading from 'react-loading';
import FormLaporanNeraca from './FormLaporanNeraca';
import TableLaporanNeraca from './TableLaporanNeraca';
import { fileUpload } from '../../../../../../store/actions/uploadActions';
import { fetchCurrencies } from '../../../../../../store/actions/master/currenciesActions';
import { showLaporanNeraca,
				fetchLaporanNeraca,
				createLaporanNeraca,
				updateLaporanNeraca,
				deleteLaporanNeraca } from '../../../../../../store/actions/vendor/profile-vendor/laporanKeuanganActions';
import NoteVerificationData from '../../../../verification-data/NoteVerificationData';
import TableVerificationData from '../../../../verification-data/TableVerificationData';
import {showVerificationItem, saveVerificationItem, saveVerificationLineItem, deleteVerificationLineItem, showLogHistory} from '../../../../../../store/actions/vendor/verifikasiDataActions';
import HistoryInternal from '../../../../verification-data/HistoryInternal';

const minOffset = -79;
const maxOffset = 60; 

class LaporanNeraca extends React.Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
		this._thisYear = (new Date()).getFullYear();

		this.child = React.createRef();
		this.state = {
			user_uuid: this.props.user.has_roles.includes("VNDR01") ? this.props.user.uuid : this.props.vendor.uuid,
			isVendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
			laporan_neraca: {
				data: [],
				sendData: {
					uuid: '',
					// tahun_laporan: { value: this._thisYear, label: this._thisYear },
					tahun_laporan: '',
					currency_id: '',
					aktiva_lancar: '',
					aktiva_tetap_selain_tanah: '',
					aktiva_tetap_tanah: '',
					aktiva_tetap_lain: '',
					hutang_jangka_pendek: '',
					hutang_jangka_panjang: '',
					hutang_lain: '',
					permodalan: '',
					nilai_aset: '',
				},
				years: [],
				errors: [],
				currencies: [],
				loading: false,
				loadingButton: false
			},
			loadings: {
				currency: false
			},
			verification: {
				note: '',
				errors: [],
				loadingButton: false,
				loading: false,
				btn_approve: '',
				verifLength: 0,
				loadingNote: true,
				verifyAll: true,
				dataLength : 0
			},
			isStatusDraftVerif : false
		};
	}

	setStatusDraftVerif = (status) => {
		this.setState({isStatusDraftVerif : status})
	}
	componentDidMount(){
		this._isMounted = true;
		if(this._isMounted){
			// console.log(this._thisYear);
			this.fetchCurrencies()
			this.setOptionData()
		}
	}

	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }

	checkStatus = (status, count, verify) => {
		this.setState(({ verification }) => ({
			verification: { ...verification, btn_approve: (status) ? 'n' : 'anjay', verifyAll: (count !== 0) ? count === verify : false, dataLength : count },
		}));
	}

	setLoadingForm = (type) => {
    this.setState(({ laporan_neraca }) => ({ laporan_neraca : { ...laporan_neraca, loading: type } }));
	}	

	checkStatusLog = (value) => {
		var setSendData = {...this.state.laporan_neraca.sendData}
		setSendData.status = 'd';
		this.setState(({ verification, laporan_neraca }) => ({
			verification: { ...verification, loading: false, verifLength: value, loadingNote: false },
			laporan_neraca: { ...laporan_neraca, sendData: setSendData },
		}));
	}

	setOptionData = () => {
		const options = []
    for (let i = minOffset; i <= maxOffset; i++) {
      const year = this._thisYear - i;
      options.push({value: year, label: year});
		}
		this.setState(({ laporan_neraca }) => ({ laporan_neraca: { ...laporan_neraca, years: options } }));
	}

	showLaporanNeraca = (vendor_id, uuid) => {
		this.setState(({ laporan_neraca }) => ({ laporan_neraca: { ...laporan_neraca, loading: true } }));
		this.props.showLaporanNeraca(vendor_id, uuid)
		.then((resp) => {
			var data = resp.data.data;
			var setSendData = {...this.state.laporan_neraca.sendData}
			if (data !== null) {
				// setSendData.tahun_laporan = {value: data.tahun_laporan, label: data.tahun_laporan}
				setSendData.tahun_laporan = data.tahun_laporan
				setSendData.currency_id = {value: data.currency_id, label: data.currency_id}
				setSendData.aktiva_lancar = data.aktiva_lancar
				setSendData.aktiva_tetap_selain_tanah = data.aktiva_tetap_selain_tanah
				setSendData.aktiva_tetap_tanah = data.aktiva_tetap_tanah
				setSendData.aktiva_tetap_lain = data.aktiva_tetap_lain
				setSendData.hutang_jangka_pendek = data.hutang_jangka_pendek
				setSendData.hutang_jangka_panjang = data.hutang_jangka_panjang
				setSendData.hutang_lain = data.hutang_lain
				setSendData.permodalan = data.permodalan
				setSendData.nilai_aset = data.nilai_aset
				setSendData.file = data.file
				setSendData.uuid = data.uuid
			}
			this.setState(({ laporan_neraca }) => ({
				laporan_neraca: { ...laporan_neraca, loading: false, data: data, errors: [], sendData: setSendData }
			}));
		})
		.catch((resp) => {
			this.setState(({ laporan_neraca }) => ({ laporan_neraca: { ...laporan_neraca, loading: false } }));
			let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
			toastr.error(message);
		});
	}

	fetchCurrencies = () => {
		this.setState(({ loadings }) => ({ loadings: { ...loadings, currency: true }}));
		this.props.fetchCurrencies()
		.then((resp) => {
			let currencies = resp.data.data;
			let options = currencies.map((dt) => {
				return { value: dt.id, label: dt.short_text+' - '+dt.long_text };
			})
			this.setState(({ laporan_neraca, loadings }) => ({ 
				laporan_neraca: { ...laporan_neraca, currencies: options },
				loadings: { ...loadings, currency: false },
			}));
		})
		.catch((resp) => {
			this.setState(({ laporan_neraca, loadings }) => ({ 
				laporan_neraca: { ...laporan_neraca, errors: resp.data.errors, },
				loadings: { ...loadings, currency: false },
			}));
			toastr.error(resp.data.message, resp.data.status);
		});
	}

	fetchLaporanNeraca = async () => {
		this.resetForm()
		setTimeout(() => {
			this.setState(({ laporan_neraca }) => ({ laporan_neraca: { ...laporan_neraca, loadingButton: false, loading: false, errors: [] } }), () => {
				this.child.current.fetchData();
			});
		}, 1)
	}

	createLaporanNeraca = (payload) => {
		if(this._isMounted){
			this.setState(({ laporan_neraca }) => ({ laporan_neraca: { ...laporan_neraca, loadingButton: true } }));
			this.props.createLaporanNeraca(this.state.user_uuid, payload)
			.then((resp) => {
				this.resetForm();
				this.setState(({ laporan_neraca }) => ({ laporan_neraca: { ...laporan_neraca, loadingButton: false, loading: false, errors: [] } }), () => {
					this.child.current.fetchData();
				});
				toastr.success('Success Save Data');
			})
			.catch((resp) => {
				this.setState(({ laporan_neraca }) => ({ laporan_neraca: { ...laporan_neraca, errors: resp.data.errors, loadingButton: false } }));
				toastr.error(resp.data.message, resp.data.errors);
			});
		}
	}
	
	updateLaporanNeraca = (id, payload) => {
		if(this._isMounted){
			this.setState(({ laporan_neraca }) => ({ laporan_neraca: { ...laporan_neraca, loadingButton: true } }));
			this.props.updateLaporanNeraca(this.state.user_uuid, id, payload)
			.then((resp) => {
				this.resetForm();
				this.setState(({ laporan_neraca }) => ({ laporan_neraca: { ...laporan_neraca, loadingButton: false, loading: false, errors: [] } }), () => {
					this.child.current.fetchData();
				});
				toastr.success('Success Save Data');
			})
			.catch((resp) => {
				this.setState(({ laporan_neraca }) => ({ laporan_neraca: { ...laporan_neraca, errors: resp.data.errors, loadingButton: false } }));
				toastr.error(resp.data.message, resp.data.errors);
			});
		}
	}

	deleteLaporanNeraca = (id) => {
		if(this._isMounted){
			this.setState(({ laporan_neraca }) => ({ laporan_neraca: { ...laporan_neraca, loadingButton: true } }));
			this.props.deleteLaporanNeraca(this.state.user_uuid, id)
			.then((resp) => {
				this.resetForm();
				this.setState(({ laporan_neraca }) => ({ laporan_neraca: { ...laporan_neraca, loadingButton: false, loading: false, errors: [] } }), () => {
					this.child.current.fetchData();
				});
				toastr.success('Success Delete Data');
			})
			.catch((resp) => {
				this.setState(({ laporan_neraca }) => ({ laporan_neraca: { ...laporan_neraca, errors: resp.data.errors, loadingButton: false } }));
				toastr.error(resp.data.message, resp.data.status);
			});
		}
	}

	resetForm = () => {
		var setSendData = {...this.state.laporan_neraca.sendData}
		setSendData.uuid = '';
		setSendData.tahun_laporan = '';
		setSendData.currency_id = '';
		setSendData.aktiva_lancar = '';
		setSendData.aktiva_tetap_selain_tanah = '';
		setSendData.aktiva_tetap_tanah = '';
		setSendData.aktiva_tetap_lain = '';
		setSendData.hutang_jangka_pendek = '';
		setSendData.hutang_jangka_panjang = '';
		setSendData.hutang_lain = '';
		setSendData.permodalan = '';
		setSendData.nilai_aset = '';
		setSendData.file = '';
		this.setState(({ laporan_neraca }) => ({ laporan_neraca: { ...laporan_neraca, sendData: setSendData, loading: true } }));
	}

	// VERIFICATION
	saveVerificationItem = (uuid, path, payload) => {
		if(this._isMounted){
			this.setState(({ verification }) => ({ verification: { ...verification, loadingButton: true } }));
			this.props.saveVerificationItem(uuid, path, payload)
			.then((resp) => {
				this.setState(({ laporan_neraca }) => ({ laporan_neraca: { ...laporan_neraca, loading: true } }));
				this.setState(({ laporan_neraca, verification }) => ({ 
					verification: { ...verification, note: '', loadingButton: false, loading: false, errors: [], loadingNote: true },
					laporan_neraca: { ...laporan_neraca, loading: false } 
				}), () => {
					this.child.current.fetchData() && this.setState(({ verification }) => ({
						verification: { ...verification, loadingNote: false },
					}));
				});
				toastr.success('Success Save Verification Data');
				this.props.collapse();
			})
			.catch((resp) => {
				this.setState(({ verification }) => ({ 
					verification: { ...verification, errors: resp.data.errors, loadingButton: false }, 
				}));
				toastr.error(resp?.data?.message, resp?.data?.errors);
			});
		}
	}

	saveVerificationLineItem = (uuid, item_uuid, path, payload) => {
		if(this._isMounted){
			this.setState(({ laporan_neraca, verification }) => ({ 
				verification: { ...verification, loadingButton: true, loading: true, errors: [] },
				laporan_neraca: { ...laporan_neraca, loadingButton: true } 
			}));
			this.props.saveVerificationLineItem(uuid, item_uuid, path, payload)
			.then((resp) => {
				this.setState(({ laporan_neraca, verification }) => ({ 
					verification: { ...verification, loadingButton: false, loading: false, errors: [] },
					laporan_neraca: { ...laporan_neraca, loadingButton: false } 
				}), () => {
					// this.child.current.fetchData();
					this.fetchLaporanNeraca()
				});
				toastr.success('Success Save Verification Data');
			})
			.catch((resp) => {
				this.setState(({ laporan_neraca, verification }) => ({ 
					verification: { ...verification, loadingButton: true, loading: false, errors: resp.data.errors },
					laporan_neraca: { ...laporan_neraca, loadingButton: false } 
				}));
				toastr.error('Failed Save Verification Data');
			});
		}
	}
	
	render() {
		const {loading} = this.state.laporan_neraca;
		const {t} = this.props;
		return (
			<div>
				{loading && <center><br/><ReactLoading type="cylon" color="#0f9e3e" /><br/></center>}
				{!loading && this.state.isVendor && this.props.revisi !== undefined && this.props.revisi.status ==='n' && <p className="text-danger"> <b> {t("profileVendor:catatan-revisi")} </b> {this.props.revisi.note} </p>}
				{!loading && this.state.isVendor &&
				<FormLaporanNeraca 
					laporan_neraca={this.state.laporan_neraca} 
					save={this.createLaporanNeraca}
					update={this.updateLaporanNeraca}
					fetchLaporanNeraca={this.fetchLaporanNeraca}
					upload={this.props.fileUpload}
					loadings={this.state.loadings}
					isVendor={this.state.isVendor}
					has_draft_verification={this.props.verification.has_draft_verification} has_verification={this.props.verification} parentState={this.state}
				/>}
				{!loading && <TableLaporanNeraca
					laporan_neraca={this.state.laporan_neraca} 
					// ref={this.child}
					childRef={ref => (this.child.current = ref)}
					verification={this.state.verification}
					access={this.props.access}
					data={this.state.laporan_neraca.data}
					fetchLaporanNeraca={this.props.fetchLaporanNeraca}
					showLaporanNeraca={this.showLaporanNeraca}
					delete={this.deleteLaporanNeraca}
					user_uuid={this.state.user_uuid}
					isVendor={this.state.isVendor}
					path={"laporan_keuangan_neraca"}
					saveVerificationItem={this.saveVerificationLineItem}
					checkStatus={this.checkStatus}
					has_draft_verification={this.props.verification.has_draft_verification} has_verification={this.props.verification} parentState={this.state}
					verification_uuid={this.props.getId.verification_uuid}
					status_vendor={this.props.verification.status_vendor}
					setLoadingForm={this.setLoadingForm}
					setStatusDraftVerif={this.setStatusDraftVerif}
					isInternal = {this.props.isInternal}
				/>}
				{this.state.verification.loadingNote && !this.state.isVendor && this.props.getId.verification_uuid !== false && <center><br/><ReactLoading type="cylon" color="#0f9e3e" /><br/></center>}
				{!loading && !this.state.isVendor && !this.state.verification.loadingNote && this.props.getId.verification_uuid !== false && this.state.verification.dataLength > 0 && <NoteVerificationData
					status_vendor={this.props.verification.status_vendor} 
					data={this.state.verification} 
					vendor_uuid={this.state.user_uuid}
					verification_uuid={this.props.getId.verification_uuid}
					path={"laporan_keuangan_neraca"}
					access={this.props.access}
					verification={this.saveVerificationItem}
					status={this.state.laporan_neraca.sendData.status}
					isVerifMultiple={true}
					isStatusDraftVerif={this.state.isStatusDraftVerif}
				/>}
				{!loading && !this.state.isVendor && this.props.getId.verification_uuid !== false &&
				<TableVerificationData 
					ref={this.child}
					vendor_uuid={this.state.user_uuid} 
					verification_uuid={this.props.getId.verification_uuid}
					path={"laporan_keuangan_neraca"}
					access={this.props.access}
					showVerification={this.props.showVerificationItem} 
					saveVerificationItem={this.props.saveVerificationLineItem}
					deleteVerificationItem={this.props.deleteVerificationLineItem} 
					title={this.props.title} 
					isVerifMultiple={true}
					checkStatusLog={this.checkStatusLog}
					fetchData={this.fetchLaporanNeraca}
					showLogHistory={this.props.showLogHistory}
				/>}
				{!loading && !this.state.isVendor && this.props.isInternal && <HistoryInternal 
					vendor_uuid={this.state.user_uuid} 
					path={"laporan_keuangan_neraca"}
					access={this.props.access}
					title={this.props.title} 
					showLogHistory={this.props.showLogHistory}
				/>}
			</div>
		)
	}
}

const stateToProps = state => {
	return {
		sidebarDt: state.sidebarDt,
		access: state.sidebarDt.access,
		vendor: state.vendorProfile.vendor,
		user: state.auth.user.data,
		getId: state.vendorProfile,
		verification: state.verification.verification
	}
}

const dispatchToProps = dispatch => {
	return {
		fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
		fetchCurrencies: (params) => dispatch(fetchCurrencies(params)),
		createLaporanNeraca: (vendor_id, payload) => dispatch(createLaporanNeraca(vendor_id, payload)),
		showLaporanNeraca: (vendor_id, id) => dispatch(showLaporanNeraca(vendor_id, id)),
		fetchLaporanNeraca: (vendor_id, payload) => dispatch(fetchLaporanNeraca(vendor_id, payload)),
		updateLaporanNeraca: (vendor_id, id, payload) => dispatch(updateLaporanNeraca(vendor_id, id, payload)),
		deleteLaporanNeraca: (vendor_id, id) => dispatch(deleteLaporanNeraca(vendor_id, id)),
		showVerificationItem: (uuid, path, params) => dispatch(showVerificationItem(uuid, path, params)),
		saveVerificationItem: (uuid, path, payload) => dispatch(saveVerificationItem(uuid, path, payload)),
		saveVerificationLineItem: (uuid, item_uuid, path, payload) => dispatch(saveVerificationLineItem(uuid, item_uuid, path, payload)),
		deleteVerificationLineItem: (uuid, item_uuid, path, payload) => dispatch(deleteVerificationLineItem(uuid, item_uuid, path, payload)),
		showLogHistory: (uuid, path, params) => dispatch(showLogHistory(uuid, path, params)),
	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(LaporanNeraca));