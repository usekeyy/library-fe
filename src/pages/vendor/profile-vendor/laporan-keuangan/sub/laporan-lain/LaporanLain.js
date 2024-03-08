import React from 'react';
import {connect} from 'react-redux';
import { withTranslation } from 'react-i18next';
import {toastr} from 'react-redux-toastr';
import ReactLoading from 'react-loading';
import FormLaporanLain from './FormLaporanLain';
import TableLaporanLain from './TableLaporanLain';
import { fileUpload } from '../../../../../../store/actions/uploadActions';
import { fetchCurrencies } from '../../../../../../store/actions/master/currenciesActions';
import { showLaporanLain,
				fetchLaporanLain,
				createLaporanLain,
				updateLaporanLain,
				deleteLaporanLain } from '../../../../../../store/actions/vendor/profile-vendor/laporanKeuanganActions';
import NoteVerificationData from '../../../../verification-data/NoteVerificationData';
import TableVerificationData from '../../../../verification-data/TableVerificationData';
import {showVerificationItem, saveVerificationItem, saveVerificationLineItem, deleteVerificationLineItem, showLogHistory} from '../../../../../../store/actions/vendor/verifikasiDataActions';
import HistoryInternal from '../../../../verification-data/HistoryInternal';

const minOffset = -79;
const maxOffset = 60; 

class LaporanLain extends React.Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
		this._thisYear = (new Date()).getFullYear();

		this.child = React.createRef();
		this.state = {
			user_uuid: this.props.user.has_roles.includes("VNDR01") ? this.props.user.uuid : this.props.vendor.uuid,
			isVendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
			laporan_lain: {
				data: [],
				sendData: {
					uuid: '',
					tahun_laporan: '',
					jenis_laporan: '',
					file: '',
				},
				years: [],
				errors: [],
				jenis_laporans: [],
				loading: false,
				loadingButton: false
			},
			loadings: {
				jenis_laporan: false
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
				dataLength: 0
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
			this.fetchJenisLaporan()
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

	setOptionData = () => {
		const options = []
    for (let i = minOffset; i <= maxOffset; i++) {
      const year = this._thisYear - i;
      options.push({value: year, label: year});
		}
		this.setState(({ laporan_lain }) => ({ laporan_lain: { ...laporan_lain, years: options } }));
	}

	checkStatus = (status, count, verify) => {
		this.setState(({ verification }) => ({
			verification: { ...verification, btn_approve: (status) ? 'n' : 'anjay', verifyAll: (count !== 0) ? count === verify : false, dataLength : count },
		}));
	}

	setLoadingForm = (type) => {
    this.setState(({ laporan_lain }) => ({ laporan_lain : { ...laporan_lain, loading: type } }));
	}	

	checkStatusLog = (value) => {
		var setSendData = {...this.state.laporan_lain.sendData}
		setSendData.status = 'd';
		this.setState(({ verification, laporan_lain }) => ({
			verification: { ...verification, loading: false, verifLength: value, loadingNote: false },
			laporan_lain: { ...laporan_lain, sendData: setSendData },
		}));
	}

	showLaporanLain = (vendor_id, uuid) => {
		this.setState(({ laporan_lain }) => ({ laporan_lain: { ...laporan_lain, loading: true } }));
		this.props.showLaporanLain(vendor_id, uuid)
		.then((resp) => {
			var data = resp.data.data;
			var setSendData = {...this.state.laporan_lain.sendData}
			if (data !== null) {
				setSendData.tahun_laporan = data.tahun_laporan
				setSendData.uuid = data.uuid
				setSendData.file = data.file
				setSendData.jenis_laporan = {value: data.jenis_laporan, label: data.jenis_laporan}
			}
			this.setState(({ laporan_lain }) => ({
				laporan_lain: { ...laporan_lain, loading: false, data: data, errors: [], sendData: setSendData }
			}));
		})
		.catch((resp) => {
			this.setState(({ laporan_lain }) => ({ laporan_lain: { ...laporan_lain, loading: false } }));
			let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
			toastr.error(message);
		});
	}

	fetchJenisLaporan = () => {
		// this.setState(({ loadings }) => ({ loadings: { ...loadings, jenis_laporan: true }}));
		const options = [
			// { value: 'Laporan Laba Rugi', label: 'Laporan Laba Rugi'},
			{ value: 'Laporan Perubahan Modal', label: 'Laporan Perubahan Modal'},
			// { value: 'Neraca', label: 'Neraca'},
			{ value: 'Arus Kas', label: 'Arus Kas'},
		]
		this.setState(({ laporan_lain, loadings }) => ({ 
			laporan_lain: { ...laporan_lain, jenis_laporans: options },
			loadings: { ...loadings, jenis_laporan: false },
		}));
		// this.props.fetchCurrencies()
		// .then((resp) => {
		// 	let currencies = resp.data.data;
		// 	let options = currencies.map((dt) => {
		// 		return { value: dt.id, label: dt.short_text+' - '+dt.long_text };
		// 	})
		// 	this.setState(({ laporan_lain, loadings }) => ({ 
		// 		laporan_lain: { ...laporan_lain, currencies: options },
		// 		loadings: { ...loadings, jenis_laporan: false },
		// 	}));
		// })
		// .catch((resp) => {
		// 	this.setState(({ laporan_lain, loadings }) => ({ 
		// 		laporan_lain: { ...laporan_lain, errors: resp.data.errors, },
		// 		loadings: { ...loadings, jenis_laporan: false },
		// 	}));
		// 	toastr.error(resp.data.message, resp.data.status);
		// });
	}

	fetchLaporanLain = async () => {
		this.resetForm()
		setTimeout(() => {
			this.setState(({ laporan_lain }) => ({ laporan_lain: { ...laporan_lain, loadingButton: false, loading: false, errors: [] } }), () => {
				this.child.current.fetchData();
			});
		}, 1)
	}

	createLaporanLain = (payload) => {
		if(this._isMounted){
			this.setState(({ laporan_lain }) => ({ laporan_lain: { ...laporan_lain, loadingButton: true } }));
			this.props.createLaporanLain(this.state.user_uuid, payload)
			.then((resp) => {
				this.resetForm();
				this.setState(({ laporan_lain }) => ({ laporan_lain: { ...laporan_lain, loadingButton: false, loading: false, errors: [] } }), () => {
					this.child.current.fetchData();
				});
				toastr.success('Success Save Data');
			})
			.catch((resp) => {
				this.setState(({ laporan_lain }) => ({ laporan_lain: { ...laporan_lain, errors: resp.data.errors, loadingButton: false } }));
				toastr.error(resp.data.message, resp.data.status);
			});
		}
	}
	
	updateLaporanLain = (id, payload) => {
		if(this._isMounted){
			this.setState(({ laporan_lain }) => ({ laporan_lain: { ...laporan_lain, loadingButton: true } }));
			this.props.updateLaporanLain(this.state.user_uuid, id, payload)
			.then((resp) => {
				this.resetForm();
				this.setState(({ laporan_lain }) => ({ laporan_lain: { ...laporan_lain, loadingButton: false, loading: false, errors: [] } }), () => {
					this.child.current.fetchData();
				});
				toastr.success('Success Save Data');
			})
			.catch((resp) => {
				this.setState(({ laporan_lain }) => ({ laporan_lain: { ...laporan_lain, errors: resp.data.errors, loadingButton: false } }));
				toastr.error(resp.data.message, resp.data.status);
			});
		}
	}

	deleteLaporanLain = (id) => {
		if(this._isMounted){
			this.setState(({ laporan_lain }) => ({ laporan_lain: { ...laporan_lain, loadingButton: true } }));
			this.props.deleteLaporanLain(this.state.user_uuid, id)
			.then((resp) => {
				this.resetForm();
				this.setState(({ laporan_lain }) => ({ laporan_lain: { ...laporan_lain, loadingButton: false, loading: false, errors: [] } }), () => {
					this.child.current.fetchData();
				});
				toastr.success('Success Delete Data');
			})
			.catch((resp) => {
				this.setState(({ laporan_lain }) => ({ laporan_lain: { ...laporan_lain, errors: resp.data.errors, loadingButton: false } }));
				toastr.error(resp.data.message, resp.data.status);
			});
		}
	}

	resetForm = () => {
		var setSendData = {...this.state.laporan_lain.sendData}
		setSendData.uuid = '';
		setSendData.tahun_laporan = '';
		setSendData.jenis_laporan = '';
		setSendData.file = '';
		this.setState(({ laporan_lain }) => ({ laporan_lain: { ...laporan_lain, sendData: setSendData, loading: true } }));
	}

	// VERIFICATION
	saveVerificationItem = (uuid, path, payload) => {
		if(this._isMounted){
			this.setState(({ verification }) => ({ verification: { ...verification, loadingButton: true } }));
			this.props.saveVerificationItem(uuid, path, payload)
			.then((resp) => {
				this.setState(({ laporan_lain }) => ({ laporan_lain: { ...laporan_lain, loading: true } }));
				this.setState(({ laporan_lain, verification }) => ({ 
					verification: { ...verification, note: '', loadingButton: false, loading: false, errors: [], loadingNote: true },
					laporan_lain: { ...laporan_lain, loading: false } 
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
			this.setState(({ laporan_lain, verification }) => ({ 
				verification: { ...verification, loadingButton: true, loading: true, errors: [] },
				laporan_lain: { ...laporan_lain, loadingButton: true } 
			}));
			this.props.saveVerificationLineItem(uuid, item_uuid, path, payload)
			.then((resp) => {
				this.setState(({ laporan_lain, verification }) => ({ 
					verification: { ...verification, loadingButton: false, loading: false, errors: [] },
					laporan_lain: { ...laporan_lain, loadingButton: false } 
				}), () => {
					// this.child.current.fetchData();
					this.fetchLaporanLain()
				});
				toastr.success('Success Save Verification Data');
			})
			.catch((resp) => {
				this.setState(({ laporan_lain, verification }) => ({ 
					verification: { ...verification, loadingButton: true, loading: false, errors: resp.data.errors },
					laporan_lain: { ...laporan_lain, loadingButton: false } 
				}));
				toastr.error('Failed Save Verification Data');
			});
		}
	}
	
	render() {
		const {loading} = this.state.laporan_lain;
		const {t} = this.props;
		return (
			<div>
				{loading && <center><br/><ReactLoading type="cylon" color="#0f9e3e" /><br/></center>}
				{!loading && this.state.isVendor && this.props.revisi !== undefined && this.props.revisi.status ==='n' && <p className="text-danger"> <b> {t("profileVendor:catatan-revisi")} </b> {this.props.revisi.note} </p>}
				{!loading && this.state.isVendor &&
				<FormLaporanLain 
					laporan_lain={this.state.laporan_lain} 
					save={this.createLaporanLain}
					update={this.updateLaporanLain}
					fetchLaporanLain={this.fetchLaporanLain}
					upload={this.props.fileUpload}
					loadings={this.state.loadings}
					isVendor={this.state.isVendor}
					has_draft_verification={this.props.verification.has_draft_verification} has_verification={this.props.verification} parentState={this.state}
				/>}
				{!loading && <TableLaporanLain
					laporan_lain={this.state.laporan_lain} 
					// ref={this.child}
					childRef={ref => (this.child.current = ref)}
					verification={this.state.verification}
					access={this.props.access}
					data={this.state.laporan_lain.data}
					fetchLaporanLain={this.props.fetchLaporanLain}
					showLaporanLain={this.showLaporanLain}
					delete={this.deleteLaporanLain}
					user_uuid={this.state.user_uuid}
					isVendor={this.state.isVendor}
					path={"laporan_keuangan_lain"}
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
				{!loading && !this.state.verification.loadingNote && !this.state.isVendor && this.props.getId.verification_uuid !== false && this.state.verification.dataLength > 0 && <NoteVerificationData
					status_vendor={this.props.verification.status_vendor} 
					data={this.state.verification} 
					vendor_uuid={this.state.user_uuid}
					verification_uuid={this.props.getId.verification_uuid}
					path={"laporan_keuangan_lain"}
					access={this.props.access}
					verification={this.saveVerificationItem}
					status={this.state.laporan_lain.sendData.status}
					isVerifMultiple={true}
					isStatusDraftVerif={this.state.isStatusDraftVerif}
				/>}
				{!loading && !this.state.isVendor && this.props.getId.verification_uuid !== false &&
				<TableVerificationData 
					ref={this.child}
					vendor_uuid={this.state.user_uuid} 
					verification_uuid={this.props.getId.verification_uuid}
					path={"laporan_keuangan_lain"}
					access={this.props.access}
					showVerification={this.props.showVerificationItem} 
					saveVerificationItem={this.props.saveVerificationLineItem}
					deleteVerificationItem={this.props.deleteVerificationLineItem} 
					title={this.props.title} 
					isVerifMultiple={true}
					checkStatusLog={this.checkStatusLog}
					fetchData={this.fetchLaporanLain}
					showLogHistory={this.props.showLogHistory}
				/>}
				{!loading && !this.state.isVendor && this.props.isInternal && <HistoryInternal 
					vendor_uuid={this.state.user_uuid} 
					path={"laporan_keuangan_lain"}
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
		createLaporanLain: (vendor_id, payload) => dispatch(createLaporanLain(vendor_id, payload)),
		showLaporanLain: (vendor_id, id) => dispatch(showLaporanLain(vendor_id, id)),
		fetchLaporanLain: (vendor_id, payload) => dispatch(fetchLaporanLain(vendor_id, payload)),
		updateLaporanLain: (vendor_id, id, payload) => dispatch(updateLaporanLain(vendor_id, id, payload)),
		deleteLaporanLain: (vendor_id, id) => dispatch(deleteLaporanLain(vendor_id, id)),
		showVerificationItem: (uuid, path, params) => dispatch(showVerificationItem(uuid, path, params)),
		saveVerificationItem: (uuid, path, payload) => dispatch(saveVerificationItem(uuid, path, payload)),
		saveVerificationLineItem: (uuid, item_uuid, path, payload) => dispatch(saveVerificationLineItem(uuid, item_uuid, path, payload)),
		deleteVerificationLineItem: (uuid, item_uuid, path, payload) => dispatch(deleteVerificationLineItem(uuid, item_uuid, path, payload)),
		showLogHistory: (uuid, path, params) => dispatch(showLogHistory(uuid, path, params)),
	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(LaporanLain));