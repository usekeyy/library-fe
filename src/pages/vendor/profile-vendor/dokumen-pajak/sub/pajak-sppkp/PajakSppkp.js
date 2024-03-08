import React, { Component } from 'react'
import FormSppkp from './FormSppkp'
import { withTranslation } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';
import { fetchPajakSppkp, savePajakSppkp } from "../../../../../../store/actions/vendor/profile-vendor/pajakSppkpActions";
import { fileUpload } from '../../../../../../store/actions/uploadActions';
import NoteVerificationData from '../../../../verification-data/NoteVerificationData';
import TableVerificationData from '../../../../verification-data/TableVerificationData';
import {showVerificationItem, saveVerificationItem, saveVerificationLineItem, deleteVerificationLineItem, showLogHistory} from '../../../../../../store/actions/vendor/verifikasiDataActions';
import HistoryInternal from '../../../../verification-data/HistoryInternal';


class PajakSppkp extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false;
		this.child = React.createRef();

        this.state = {
            uuid: "",
            vendor_uuid: this.props.user.has_roles.includes("VNDR01") ? this.props.user.uuid : this.props.vendor.uuid,
			isVendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
            load: {
                loadForm: true
            },
            tempData: {
                sppkp_type: ''
            },
            sendData: {
                end_date: '',
                lifeTimeSPPKP: '',
                file: '',
                issued_by: '',
                number: '',
                start_date: '',
                type: '',
            },
            pajak_spppkp: {
				data: [],
				sendData: { },
				errors: [],
			},
            optionsType: [
                { value: "SPPKP", label: "SPPKP" },
                { value: "Non SPPKP", label: "Non SPPKP" }
            ],
            loadingSubmit: false,
            errors: {},
            verification: {
				note: '',
				errors: [],
				loadingButton: false,
                loading: false,
                verifLength: 0,
				loadingNote: true
			}
        }
    }

    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            this.showPayload(this.state.vendor_uuid)
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    setSPPKP = (type) => {
        this.setState(({ tempData }) => ({ 
            tempData: { ...tempData, sppkp_type: type }
        }));
    }

    showPayload = (vendor_id) => {
        let load = { ...this.state.load };
        load.loadForm = true;
        this.setState({ load });
        let params = this.props.isInternal ? {source : 'master'} : ''
        this.props.fetchPajakSppkp(vendor_id, params)
            .then((resp) => {
                var data = resp.data.data;
                this.setSPPKP(data.type)
                this.setState({ uuid: data.uuid });
                var setSendData = { ...this.state }
                setSendData.sendData.type = { value: data.type, label: data.type }
                setSendData.sendData.issued_by = data.issued_by;
                setSendData.sendData.end_date = data.end_date;
                setSendData.sendData.file = data.file;
                setSendData.sendData.lifeTimeSPPKP = data.lifetime;
                setSendData.sendData.number = data.number;
                setSendData.sendData.start_date = data.start_date;
                setSendData.sendData.status = data.status;
                setSendData.sendData.status_expired = data.status_expired;
                setSendData.sendData.attachment = data.attachment;
                setSendData.sendData.merk = data.merk;
                setSendData.sendData.tipe_verifikasi = data.tipe_verifikasi;
                // setSendData.uuid = uuid;
                // setSendData.load.loadForm = false;
                this.setState({ setSendData });
                let load = { ...this.state.load };
                load.loadForm = false;
                this.setState({ load });
            })
            .catch((resp) => {
                let load = { ...this.state.load };
                load.loadForm = false;
                this.setState({ load });
                // let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
                // toastr.error(message);
            });
    }

    savePayload = (payload) => {
        if (this._isMounted) {
            let formLoad = { ...this.state.load }
            formLoad.loadForm = true;
            this.setState({ formLoad, loadingSubmit: true });
            this.props.savePajakSppkp(this.state.vendor_uuid, payload)
                .then((resp) => {
                    this.setState({ loadingSubmit: false }, () => this.showPayload(this.state.vendor_uuid))
                    toastr.success(resp.data.message);
                })
                .catch(error => {
                    if (error !== undefined) {
                        toastr.error(error.data.message)
                        this.setState({ errors: error.data.errors, loadingSubmit: false })
                    } else {
                        this.setState({ loadingSubmit: false })
                        toastr.error('Opps Somethings Wrong')
                    }
                })
        }
    }

	// VERIFICATION
	saveVerificationItem = (uuid, path, payload) => {
		if(this._isMounted){
			this.setState(({ verification }) => ({ verification: { ...verification, loadingButton: true } }));
			this.props.saveVerificationItem(uuid, path, payload)
			.then((resp) => {
				this.setState(({ load }) => ({ load: { ...load, loadForm: true } }));
				this.setState(({ load, verification }) => ({ 
					verification: { ...verification, note: '', loadingButton: false, loadForm: false, errors: [], loadingNote: true },
					load: { ...load, loadForm: false } 
				}), () => {
                    setTimeout(() => {
						this.child.current.fetchData() && this.showPayload(this.state.vendor_uuid) && this.setState(({ verification }) => ({
							verification: { ...verification, loadingNote: false },
						}));
					}, 100)
				});
                toastr.success('Success Save Verification Data');
                this.props.collapse();
			})
			.catch((resp) => {
				this.setState(({ verification }) => ({ 
					verification: { ...verification, errors: resp.data.errors, loadingButton: false }, 
				}));
				toastr.error('Failed Save Verification Data');
			});
		}
    }
    
    checkStatusLog = (value) => {
		this.setState(({ verification }) => ({
			verification: { ...verification, loading: false, verifLength: value, loadingNote: false },
		}));
	}

    checkFileTemp = async (e,file) => {
        e.preventDefault()
        let url = `${process.env.REACT_APP_API_BASE_URL}files/vendor/${file}`
        let url2 = `${process.env.REACT_APP_API_BASE_URL}files/temp/${file}`
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        try {
            http.send();
            if (http.status!==404){
                window.open(url)
            }else{
                window.open(url2)
            }
        } catch (error) {
            window.open(url)
        } 
    }

    render() {
		const loading = this.state.load.loadForm;
        const {t} = this.props;
        return (
            <div>
				{loading && <center><br/><ReactLoading type="cylon" color="#0f9e3e" /><br/></center>}
                {!loading && this.state.isVendor && this.props.revisi !== undefined && this.props.revisi.status ==='n' && <p className="text-danger"> <b> {t("profileVendor:catatan-revisi")} </b> {this.props.revisi.note} </p>}
                {!loading &&
                    <FormSppkp
                        optionsType={this.state.optionsType}
                        uuid={this.state.uuid}
                        data={this.state.sendData}
                        save={this.savePayload}
                        upload={this.props.fileUpload}
                        loadingSubmit={this.state.loadingSubmit}
                        errors={this.state.errors}
                        isVendor={this.state.isVendor}
                        has_draft_verification={this.props.verification.has_draft_verification} has_verification={this.props.verification} parentState={this.state}
                        setSPPKP={this.setSPPKP}
                        checkPlaceFile = {this.checkFileTemp}
                    />
                }
                {!loading && this.state.verification.loadingNote && !this.state.isVendor && this.props.getId.verification_uuid !== false && <center><br/><ReactLoading type="cylon" color="#0f9e3e" /><br/></center>}
                {!loading && !this.state.isVendor && !this.state.verification.loadingNote && this.props.getId.verification_uuid !== false && this.state?.uuid !== null && <NoteVerificationData
                    status_vendor={this.props.verification.status_vendor} 
					data={this.state.verification} 
					vendor_uuid={this.state.vendor_uuid}
					verification_uuid={this.props.getId.verification_uuid}
					path={"vendor_sppkp"}
					access={this.props.access}
                    verification={this.saveVerificationItem}
                    status={this.state.sendData.status}
                    isVerifMultiple={true}
				/>}
				{!loading && !this.state.isVendor && this.props.getId.verification_uuid !== false && 
				<TableVerificationData 
					ref={this.child}
					vendor_uuid={this.state.vendor_uuid} 
					verification_uuid={this.props.getId.verification_uuid}
					path={"vendor_sppkp"}
					access={this.props.access}
					showVerification={this.props.showVerificationItem} 
					saveVerificationItem={this.props.saveVerificationLineItem}
                    deleteVerificationItem={this.props.deleteVerificationLineItem} 
                    title={this.props.title} 
                    isVerifMultiple={true}
                    checkStatusLog={this.checkStatusLog}
                    showLogHistory={this.props.showLogHistory}
				/>}
                {!loading && !this.state.isVendor && this.props.isInternal && <HistoryInternal 
                    vendor_uuid={this.state.vendor_uuid} 
                    path={"vendor_sppkp"}
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
        user: state.auth.user.data,
        vendor: state.vendorProfile.vendor,
        getId: state.vendorProfile,
        verification: state.verification.verification
    }
}

const dispatchToProps = dispatch => {
    return {
        fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
        fetchPajakSppkp: (id,params) => dispatch(fetchPajakSppkp(id,params)),
        savePajakSppkp: (vendor_uuid, params) => dispatch(savePajakSppkp(vendor_uuid, params)),
        showVerificationItem: (uuid, path, params) => dispatch(showVerificationItem(uuid, path, params)),
		saveVerificationItem: (uuid, path, payload) => dispatch(saveVerificationItem(uuid, path, payload)),
		saveVerificationLineItem: (uuid, item_uuid, path, payload) => dispatch(saveVerificationLineItem(uuid, item_uuid, path, payload)),
        deleteVerificationLineItem: (uuid, item_uuid, path) => dispatch(deleteVerificationLineItem(uuid, item_uuid, path)),
		showLogHistory: (uuid, path, params) => dispatch(showLogHistory(uuid, path, params)),
    }
}
export default connect(stateToProps, dispatchToProps)(withTranslation()(PajakSppkp));


