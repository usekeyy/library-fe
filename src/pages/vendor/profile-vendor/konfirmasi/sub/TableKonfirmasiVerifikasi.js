import React, {Component} from 'react';
import 'react-table/react-table.css';
import {toastr} from 'react-redux-toastr';
import SweetAlert from 'react-bootstrap-sweetalert';
import {Panel, PanelHeader, PanelBody} from '../../../../../containers/layout/sub/panel/panel';
import {RowEmpty} from '../../../../../components/tableoptions/TableOptions';
import ReactLoading from 'react-loading';
import { Modal, ModalHeader } from 'reactstrap';
import ModalConfirm from './ModalConfirm'
import FormSync from '../sync/FormSync';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';

class TableKonfirmasi extends Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
        this.statusMultipleIsPartner = this.statusMultipleIsPartner.bind(this);
        this.statusSingleIsPartner = this.statusSingleIsPartner.bind(this);
        this.state = {
            data: {},
            options: {
                start: 0,
                length: 10,
                sorted_column: 1,
                order: 'asc',
                page: 0
            },
            loadings: {
                loadingModal: false
            },
            modalOpen: false,
            isConfirm: false,
            isReject: false,
            loading: false,
            loading_sap: false,
            uuid: '',
            type: '',
            errors: [],
            total: 0,
            collapse: [
				{	
					id: 1, 
					name: 'Data Administrasi',
					collapse: false,
					children: [
						{ 
							id: 101, 
							name: 'Profil Perusahaan', 
							parent_id: 1, 
							path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile' : '/vendor/verification/profile',
							children: ["Nama Perusahaan", "Alamat Perusahaan"] 
						},
						{ 
							id: 102, 
							name: 'Informasi Legal', 
							parent_id: 1, 
							path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile/informasi-legal' : '/vendor/verification/informasi-legal',
							children: ["Akta Perusahaan","Nomor Pokok Wajib Pajak (NPWP)","Pakta Integritas"]
						},
						{ 
							id: 103, 
							name: 'Surat Izin Usaha', 
							parent_id: 1, 
							path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile/surat-izin-usaha' : '/vendor/verification/surat-izin-usaha',
							children: ["Surat Ijin Usaha Perdagangan (SIUP)","SITU/SKDU/Ijin Lokasi","Tanda Daftar Perusahan/TDP","Surat Ijin Usaha Jasa Konstruksi","Surat Ijin Lainnya"]
						},
						{ 
							id: 104, 
							name: 'Pemegang Saham', 
							parent_id: 1, 
							path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile/pemegang-saham' : '/vendor/verification/pemegang-saham',
							children:["Pemegang Saham"]
						},
						{ 
							id: 105, 
							name: 'Pengurus Perusahaan', 
							parent_id: 1, 
							path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile/pengurus-perusahaan' : '/vendor/verification/pengurus-perusahaan',
							children:["Pengurus Perusahaan"]
						},
						{ 
							id: 106, 
							name: 'PIC', 
							parent_id: 1, 
							path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile/profile-pic' : '/vendor/verification/profile-pic',
							children:["PIC"] 
						},
					] 
				},
				{	
					id: 2, 
					name: 'Kompetensi & Pengalaman Kerja',
					collapse: false,
					children: [
						{ 
							id: 201, 
							name: 'Alat/Mesin Perusahaan', 
							parent_id: 2, 
							path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile/alat-perusahaan' : '/vendor/verification/alat-perusahaan',
							children: ["Alat"]
						},
						{ 
							id: 202, 
							name: 'Tenaga Ahli', 
							parent_id: 2, 
							path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile/tanaga-ahli' : '/vendor/verification/tanaga-ahli',
							children: ["Tenaga Ahli"] 
						},
						{ 
							id: 203, 
							name: 'Kompetensi', 
							parent_id: 2, 
							path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile/kompetensi' : '/vendor/verification/kompetensi',
							children: ["Kompetensi"]
						},
						{ 
							id: 204, 
							name: 'Pengalaman Pekerjaan', 
							parent_id: 2, 
							path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile/pengalaman-kerja' : '/vendor/verification/pengalaman-kerja',
							children:["Pengalaman Kerja"]
						},
					] 
				},
				{	
					id: 3, 
					name: 'Data Keuangan',
					collapse: false,
					children: [
						{ 
							id: 301, 
							name: 'Rekening Bank', 
							parent_id: 3, 
							path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile/rekening-bank' : '/vendor/verification/rekening-bank',
							children:["Rekening Bank"]
						},
						{ 
							id: 302, 
							name: 'Laporan Keuangan', 
							parent_id: 3, 
							path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile/laporan-keuangan' : '/vendor/verification/laporan-keuangan',
							children:["Laporan Keuangan Neraca","Laporan Keuangan Laba Rugi","Laporan Keuangan Lainnya"]
						},
						{ 
							id: 303, 
							name: 'Dokumen Pajak', 
							parent_id: 3, 
							path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile/dokumen-pajak' : '/vendor/verification/dokumen-pajak',
							children:["SPPKP","SPT Tahunan","Surat Keterangan Fiskal"]
						},
					] 
				},
				{	
					id: 4, 
					name: 'Konfirmasi',
					collapse: false,
					children: [
						{ 
							id: 401, 
							name: 'Konfirmasi', 
							parent_id: 4, 
							path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile/konfirmasi' : '/vendor/verification/konfirmasi',
							children:[]
						},
					] 
				},
			]
        }
    }

    handleRedirect = (verificationName) => {
        let path = "/vendor/verification/profile";
        this.state.collapse.forEach((data) => {
            data.children.forEach((dataChild) => {
                if (dataChild.children.includes(verificationName)){
                    path = dataChild.path
                }
                
            })
        })
        // path = dataChildren?.path;
        // console.log(dataChildren)
        return path;
    }

    componentDidMount = () => {
        this._isMounted = true;
        if (this._isMounted) {
           if(this.props.verification_uuid !== false) {this.fetchData()}
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    asyncData = async (params) => {
        if(this._isMounted){
            if(!this.props.isVendor){
            this.setState({loading: true, loading_sap: true})
            this.props.fetchKonfirmasiVerifikasi(this.props.verification_uuid)
            .then((resp) => {
                if (this._isMounted) {
                    // let status_suap = '';
                    let gl_account_id = '';
                    let incoterm_id = '';
                    let vendor_acc_group_id = '';
                    let gl_account_name = '';
                    let incoterm_name = '';
                    let vendor_acc_group_name = '';
                    let search_terms_id = '';
                    let search_terms_description = '';
                    let incoterm_location = '';
                    let term_of_payment = '';
                    let term_of_payment_description = ''
                    for (const [key, value] of Object.entries(resp.data)) {
                        // console.log(`${key}: ${value.errors.length} - ${value.type}`);
                        if(key === 'suap_file'){ 
                            // status_suap = value;
                        } else if(key === 'gl_account_id'){ 
                            gl_account_id = value;
                        } else if(key === 'incoterm_id'){ 
                            incoterm_id = value;
                        } else if(key === 'vendor_acc_group_id'){ 
                            vendor_acc_group_id = value;
                        } else if(key === 'gl_account_name'){ 
                            gl_account_name = value;
                        } else if(key === 'incoterm_name'){ 
                            incoterm_name = value;
                        } else if(key === 'vendor_acc_group_name'){ 
                            vendor_acc_group_name = value;
                        } else if(key === 'search_terms_id'){ 
                            search_terms_id = value;
                        } else if(key === 'search_terms_description'){ 
                            search_terms_description = value;
                        } else if(key === 'incoterm_location'){ 
                            incoterm_location = value;
                        }else if(key === 'term_of_payment'){ 
                            term_of_payment = value;
                        }else if(key === 'term_of_payment_description'){ 
                            term_of_payment_description = value;
                        }
                    }
                    this.setState({loading: false, data: resp.data}, () => {
                        this.props.setData(gl_account_id, incoterm_id, vendor_acc_group_id, gl_account_name, incoterm_name, vendor_acc_group_name, search_terms_id, search_terms_description, incoterm_location, term_of_payment, term_of_payment_description)
                        setTimeout(() => {
                            this.setState({ loading_sap: false})
                        }, 1000)
                    });
                }
            })
            .catch((resp) => {
                    this.setState({loading: false, loading_sap: false})
                    let message = (typeof resp !== 'undefined')  ? resp.message  : 'Something Wrong';
                    toastr.error(message);
            });
            } 
        }
    }

    fetchData = () => {
        this.asyncData(this.state.options)
    }

    handleConfirm = (e, value, suap) => {
        e.preventDefault();
        if(value === 'batal'){
            this.setState({type: value, isReject: true})
        } else {
            if (this.props.parentState.searchterms_id === '' && value === 'submit'){
                toastr.error('Searchterms Harus Diisi');
            }else if(this.props.parentState.incoterm_id !== '' && this.props.parentState.incoterm_location === '' && value === 'submit'){
                toastr.error('Incoterm Location Harus Diisi Jika Incoterm Diisi');
            }else if(this.props.parentState.incoterm_id === '' && this.props.parentState.incoterm_location !== '' && value === 'submit'){
                toastr.error('Incoterm Harus Diisi Jika Incoterm Location Diisi');
            }else if(this.props.parentState.term_of_payment === '' && value === 'submit'){
                toastr.error('Term Of Payment Harus Diisi');
            }else {
                if(this.props.status_vendor !== 'partner' && value === 'submit' && suap === null){
                    this.setState({type: value, modalOpen: true})
                } else {
                    this.setState({type: value, isConfirm: true})
                }
            }
        }
    }

    toggleSweetAlert(name, reason) {
        if (this._isMounted) {
            switch (name) {
                case 'confirm':
                    if(this.state.type !== ''){
                        this.setState({
                            isConfirm: false,
                            isReject: false,
                            modalOpen: false,
                        }, () => {
                            if(this.state.type === 'submit'){ 
                                this.props.update({status: 'y'}) 
                                this.setState({type: ''});
                            }
                            if(this.state.type === 'batal'){ 
                                this.props.cancel(reason);
                                this.setState({type: ''});
                            }
                            if(this.state.type === 'revisi'){ 
                                this.props.update({status: 'n'});
                                this.setState({type: ''});
                            }
                        });
                    }
                    break;
                case 'cancel':
                    this.setState({isConfirm: false, type: '', isReject: false, modalOpen: false});
                    break;
                default:
                    break;
            }
        }
    }

    handleSaveSuap = (payload) => {
        this.setState({
            isConfirm: false,
            isReject: false,
            modalOpen: false,
        }, () => {
            this.props.update({status: 'y', suap_file: payload})
        });
    }

    toggleOpen = () => {
		this.setState({ modalOpen: true })
    }
    
    toggleClose = () => {
		this.setState({ modalOpen: false })
	}

    statusMultipleIsPartner(dt){
        const tipe = dt.tipe_verifikasi.filter( i => i === "sudah_diverifikasi");
        if (dt.tipe_verifikasi.length === tipe.length && dt.status === null) {
            const temp = dt.tipe_verifikasi.filter((item,index) => {
                if (item !== this.props.verification[dt.name]?.tipe_verifikasi[index]){
                    return item
                }
								return false
            })
            if (temp.length > 0){
                return (
                    <span className="text-black-lighter"><b>Update Profile</b></span>
                )
            }else{
                return (
                    <span className="text-black-lighter">Tidak Ada Perubahan</span>
                )
            }
        } else if (dt.tipe_verifikasi.length !== tipe.length && dt.status === null) {
            return (
                <b className="text-black-lighter">Update Profile</b>
            )
        } else if (dt.tipe_verifikasi.length !== tipe.length && dt.status !== null) {
            return (
                (dt.status === 'y') ? <span className="text-black-lighter">Sudah Diverifikasi</span> : <i className="text-black-lighter">Tolak Data</i>
            )
        } else if (dt.tipe_verifikasi.length === tipe.length && dt.status !== null) {
            return (
                (dt.status === 'y') ? <span className="text-black-lighter">Sudah Diverifikasi</span> : <i className="text-black-lighter">Tolak Data</i>
            )
        } 
    }

    statusSingleIsPartner(dt){
        if (dt.tipe_verifikasi === 'sudah_diverifikasi' && dt.status === null) {
            return (
                <span className="text-black-lighter">Tidak Ada Perubahan</span>
            )
        } else if (dt.tipe_verifikasi === 'sudah_diverifikasi' && dt.status !== null) {
            return (
                <span className="text-black-lighter">Tidak Ada Perubahan</span>
            )
        } else if (dt.tipe_verifikasi !== 'sudah_diverifikasi' && dt.status === null) {
            return (
                <b className="text-black-lighter">Update Profile</b>
            )
        } else if (dt.tipe_verifikasi !== 'sudah_diverifikasi' && dt.status !== null) {
            return (
                (dt.status === 'y') ? <span className="text-black-lighter">Sudah Diverifikasi</span> : <i className="text-black-lighter">Tolak Data</i>
            )
        } 
    }

    render() {
        let rows;
        let arr = [];
        let {data} = this.state;
        var size = Object.keys(data).length;
        let status_suap = null;
        // let gl_account_id = null;
        // let incoterm_id = null;
        // let vendor_acc_group_id = null;
        // let gl_account_name = null;
        // let incoterm_name = null;
        // let vendor_acc_group_name = null;
        if(size > 0){
            if (this.props.status_vendor === 'partner') {
                for (const [key, value] of Object.entries(data)) {
                    // console.log(`${key}: ${value.errors.length} - ${value.type}`);
                    if(key !== 'search_terms_id' && key !== 'search_terms_description' && key !== 'incoterm_location' && key !== 'suap_file' && key !== 'gl_account_id'  && key !== 'incoterm_id' && key !== 'vendor_acc_group_id' && key !== 'gl_account_name'  && key !== 'incoterm_name' && key !== 'vendor_acc_group_name' && key !== 'term_of_payment_description' && key !== 'term_of_payment'){ 
                        var objPartner = {
                            name: key,
                            sifat: value.type,
                            status: value.status,
                            note: value.note,
                            errors: [],
                            tipe_verifikasi: value.tipe_verifikasi,
                        }
                        if(key !== 'has_draft_verification' && key !== 'expired_in_day' && key !== 'status_vendor'){
                            arr.push(objPartner)
                        }
                    }
                }
            } else {
                for (const [key, value] of Object.entries(data)) {
                    // console.log(`${key}: ${value.errors.length} - ${value.type}`);
                    if(key === 'suap_file'){ 
                        status_suap = value;
                    } else if(key === 'gl_account_id'){ 
                        // gl_account_id = value;
                    } else if(key === 'incoterm_id'){ 
                        // incoterm_id = value;
                    } else if(key === 'vendor_acc_group_id'){ 
                        // vendor_acc_group_id = value;
                    } else if(key === 'gl_account_name'){ 
                        // gl_account_name = value;
                    } else if(key === 'incoterm_name'){ 
                        // incoterm_name = value;
                    } else if(key === 'vendor_acc_group_name'){ 
                        // vendor_acc_group_name = value;
                    } else if(key === 'search_terms_description'){ 
                        // vendor_acc_group_name = value;
                    }else if(key === 'search_terms_id'){ 
                        // vendor_acc_group_name = value;
                    }else if(key === 'incoterm_location'){ 
                        // vendor_acc_group_name = value;
                    }else if(key === 'term_of_payment_description'){ 
                        // vendor_acc_group_name = value;
                    }else if(key === 'term_of_payment'){ 
                        // vendor_acc_group_name = value;
                    }else {
                        var obj = {
                            name: key,
                            sifat: value.type,
                            status: value.status,
                            tipe_verifikasi: value.tipe_verifikasi,
                            note: value.note,
                        }
                        arr.push(obj)
                    }
                }
            }
            
            if(arr.length > 0){
                rows = arr.map((dt, i) => (
                    <tr key={i}>
                        <td>
                            {/* <Route> */}
                                <Link to={{pathname: this.handleRedirect(dt.name), state : {name : dt.name}}} target="_blank" onClick={() => localStorage.setItem("pathConfirmVerifikator", dt.name)}>{dt.name}</Link>
                            {/* </Route> */}
                        </td>
                        <td>{dt.sifat}</td>
                        {this.props.status_vendor !== 'partner' && <td>
                            {
                                (dt.status === null)
                            ? Array.isArray(dt.tipe_verifikasi) 
                                ? dt.tipe_verifikasi.length > 0 
                                    ? dt.tipe_verifikasi.map((item,i) => <b key ={i} style={{display: 'block'}}  className={item === 'tolak_data' || item === 'submit_pendaftaran' ? "text-orange" : item !== null ? "text-green-lighter" : "text-orange" }>{item === this.props?.verification[dt.name]?.tipe_verifikasi[i] ? item : ((this.props?.verification[dt.name]?.tipe_verifikasi[i]=== 'sudah_diverifikasi' || this.props?.verification[dt.name]?.tipe_verifikasi[i]=== 'tolak_data') ? 'submit_pendaftaran' : this.props?.verification[dt.name]?.tipe_verifikasi[i])}</b>) 
                                    : <b className="red-black-lighter"></b> 
                                    : (dt.tipe_verifikasi !== '' || dt.tipe_verifikasi !== null) 
                                    ?
                                    typeof dt.tipe_verifikasi !== 'object'? 
                                    <b className={dt.tipe_verifikasi === 'tolak_data' || dt.tipe_verifikasi === 'submit_pendaftaran' ? "text-orange" : "text-green-lighter"}>{dt.tipe_verifikasi}</b>
                                    // : console.log(Object.values(dt.tipe_verifikasi || {})) 
                                    : Object.values(dt.tipe_verifikasi || {}).map((item,i) => <b key ={i} style={{display: 'block'}}  className={item === 'tolak_data' || item === 'submit_pendaftaran' ? "text-orange" : item !== null ? "text-green-lighter" : "text-orange" }>{item === this.props?.verification[dt.name]?.tipe_verifikasi[i] ? item : ((this.props?.verification[dt.name]?.tipe_verifikasi[i]=== 'sudah_diverifikasi' || this.props?.verification[dt.name]?.tipe_verifikasi[i]=== 'tolak_data') ? 'submit_pendaftaran' : this.props?.verification[dt.name]?.tipe_verifikasi[i])}</b>)
                            : <b className="text-orange"></b>
                                : (dt.status === 'y')
                                    ? <b className="text-green-lighter">Diverifikasi</b>
                                    : <b className="text-red-lighter">Ditolak</b>
                            }
                        </td>}
                        {this.props.status_vendor === 'partner' && <td>
                            {
                                (dt.tipe_verifikasi !== null) 
                                ? 
                                    Array.isArray(dt.tipe_verifikasi) 
                                    ? 
                                        (dt.tipe_verifikasi.length > 0) 
                                        ? 
                                        this.statusMultipleIsPartner(dt)
                                        : (dt.status === null) ? 'Tidak Ada Perubahan' : (dt.status === 'y') ? 'Sudah Diverifikasi' : 'Blm Diverifikasi'
                                    : this.statusSingleIsPartner(dt)
                                : (dt.status === null) ? 'Tidak Ada Perubahan' : (dt.status === 'y') ? 'Sudah Diverifikasi' : 'Belum Diverifikasi'
                            }
                        </td>}
                        <td>{dt.note}</td>
                    </tr>
                ))
            } else {
                rows = (<RowEmpty colSpan='2'>Tidak ada data</RowEmpty>);
            }
        }

        return (
            <div>
				{(this.state.loading) && ( <center> <br/> <ReactLoading type="cylon" color="#0f9e3e" /> <br/> </center> )}
                {this.state.loading === false && this.state.loading_sap && <center><h5><i className="fas fa-spinner fa-pulse"></i> Loading Data SAP ...</h5></center>}
                {this.state.loading_sap === false && 
                // this.props.data_vendor.sap_code === null &&
                <FormSync
                    parentState={this.props.parentState}
                    t={this.props.t}
                    data_vendor={this.props.data_vendor}
                    handleChange={this.props.handleChange}
                    fetchIncoterms={this.props.fetchIncoterms}
                    fetchVendorAccGroup={this.props.fetchVendorAccGroup}
                    fetchGlAccount={this.props.fetchGlAccount}
                    fetchCurrencies={this.props.fetchCurrencies}
                    fetchSearchTerms={this.props.fetchSearchTerms}
                    fetchTermOfPayment={this.props.fetchTermOfPayment}
                    isApplicant={this.props.verification.status_vendor === 'applicant' ? true : false}
                />}
                {this.state.loading === false && 
                <Panel>
                    <PanelHeader> Konfirmasi Dokumen Profil Perusahaan</PanelHeader>
                    <PanelBody >
                        <div>
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm">
                                        <thead>
                                            <tr>
                                                <th>Nama Dokumen</th>
                                                <th>Sifat Dokumen</th>
                                                <th>Status</th>
                                                <th>Keterangan</th>
                                            </tr>
                                        </thead>
                                        <tbody>{rows}</tbody>
                                </table>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="text-center m-t-10 m-b-10">
                                        {this.props.status_vendor !== 'partner' && this.props.verification_uuid !== false && <button
                                            className="btn btn-sm btn-danger m-l-10"
                                            type="button"
                                            disabled={this.props.konfirmasi.loadingButton}
                                            onClick={(e) => this.handleConfirm(e, "batal")}>
                                        {this.props.konfirmasi.loadingButton && <i className="fas fa-spinner fa-pulse"></i> }
                                            Tolak Applicant
                                        </button>}
                                        {this.props.verification_uuid !== false && <button
                                            className="btn btn-sm btn-warning m-l-10"
                                            type="button"
                                            disabled={this.props.konfirmasi.loadingButton}
                                            onClick={(e) => this.handleConfirm(e, "revisi")}>
                                        {this.props.konfirmasi.loadingButton && <i className="fas fa-spinner fa-pulse"></i> }
                                            Revisi
                                        </button>}
                                        {this.props.verification_uuid !== false && <button
                                            className="btn btn-sm btn-success m-l-10"
                                            type="button"
                                            disabled={this.props.konfirmasi.loadingButton}
                                            onClick={(e) => this.handleConfirm(e, "submit", status_suap)}>
                                        {this.props.konfirmasi.loadingButton && <i className="fas fa-spinner fa-pulse"></i> }
                                            Approve
                                        </button>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </PanelBody>
                </Panel>
                }
                {
                    (
                        this.state.type !== "" && this.state.isConfirm && 
                        <SweetAlert
                            warning
                            showCancel={true}
                            confirmBtnText="OK"
                            cancelBtnText="Cancel"
                            confirmBtnBsStyle={this.state.type === "submit" ? "primary" : "danger"}
                            cancelBtnBsStyle="default"
                            title="Konfirmasi"
                            onConfirm={() => this.toggleSweetAlert('confirm')}
                            onCancel={() => this.toggleSweetAlert('cancel')}>
                            {this.state.type === "submit" && 'Apakah anda yakin akan melakukan submit profil ?'}
                            {this.state.type === "batal" && 'Apakah anda yakin akan membatalkan pendaftaran ?'}
                        </SweetAlert>
                    )
                }
                {
                    (
                        this.state.type !== "" && this.state.isReject && 
                        <SweetAlert
                            input
                            inputType="textarea"
                            placeHolder="Tulis Alasan"
                            showCancel={true}
                            confirmBtnText="Tolak"
                            cancelBtnText="Cancel"
                            confirmBtnBsStyle={this.state.type === "submit" ? "danger" : "danger"}
                            cancelBtnBsStyle="default"
                            title="Konfirmasi"
                            onConfirm={(response) => this.toggleSweetAlert('confirm', response)}
                            onCancel={() => this.toggleSweetAlert('cancel')}>
                            {this.state.type === "submit" && 'Apakah anda yakin akan melakukan submit profil ?'}
                            {this.state.type === "batal" && 'Apakah anda yakin akan membatalkan pendaftaran ?'}
                        </SweetAlert>
                    )
                }
                <Modal isOpen={this.state.modalOpen} toggle={() => this.toggleClose()} className="modal-lg">
                <ModalHeader toggle={() => this.toggleClose()}>Konfirmasi</ModalHeader>
                    {this.state.loadings.loadingModal && (
                        <center>
                        <br />
                        <ReactLoading type="cylon" color="#0f9e3e" />
                        <br />
                        </center>
                    )}
                        {this.state.loadings.loadingModal === false && (
                        <ModalConfirm
                        upload={this.props.upload}
                        parentState={this.state}
                        toggleClose={this.toggleClose}
                        save={this.handleSaveSuap}
                        />
                    )}
                </Modal>
            </div>
        );
    }
}

const stateToProps = state => {
	return {
		location: state.sidebarDt.location,
		access: state.sidebarDt.access,
		vendor: state.vendorProfile,
		user : state.auth.user.data,
		getId: state.vendorProfile,
		verification: state.verification.verification,
	}
}

export default connect(stateToProps)(TableKonfirmasi);