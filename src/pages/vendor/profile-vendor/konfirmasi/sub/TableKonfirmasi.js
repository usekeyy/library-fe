import React, {Component} from 'react';
import 'react-table/react-table.css';
import {toastr} from 'react-redux-toastr';
import SweetAlert from 'react-bootstrap-sweetalert';
import {RowEmpty} from '../../../../../components/tableoptions/TableOptions';
import ReactLoading from 'react-loading';
import { Tooltip } from 'reactstrap';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';

class TableKonfirmasi extends Component {
    constructor(props) {
        super(props);
        this._isMounted = false;

        this.state = {
            tooltipOpen: [],
            data: [],
            options: {
                start: 0,
                length: 10,
                sorted_column: 1,
                order: 'asc',
                page: 0
            },
            isConfirm: false,
            loading: false,
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
        return path;
    }

    componentDidMount = () => {
        this._isMounted = true;
        if (this._isMounted) {
            this.fetchData()
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
        this.setState({loading: true})
        this.props.fetchKonfirmasi(this.props.user_uuid, params)
        .then((resp) => {
            if (this._isMounted) {
                this.setState({loading: false, data: resp.data});
            }
        })
        .catch((resp) => {
            this.setState({loading: false})
            let message = (typeof resp !== 'undefined')  ? resp.message  : 'Something Wrong';
            toastr.error(message);
        });
    }

    fetchData = () => {
        this.asyncData(this.state.options)
    }

    handleConfirm = (e, value) => {
        e.preventDefault();
        // console.log(value);
        this.setState({type: value, isConfirm: true})
    }

    toggleSweetAlert(name) {
        if (this._isMounted) {
            switch (name) {
                case 'confirm':
                    if(this.state.type !== ''){
                        this.setState({
                            isConfirm: false
                        }, () => {
                            if(this.state.type === 'submit'){ 
                                this.props.confirm({status: 'd'}) 
                                this.setState({type: ''});
                            }
                            if(this.state.type === 'batal'){ 
                                this.props.cancel();
                            }
                        });
                    }
                    break;
                case 'cancel':
                    this.setState({isConfirm: false, type: ''});
                    break;
                default:
                    break;
            }
        }
    }

    toggleTooltip = (e, val) => {
        e.preventDefault()
        const arr = []
        arr.push(val)
        this.setState({ tooltipOpen: arr })
    }

    checkChangeData = () => {
        let isChange = false;
        if (this.props.verification){
            for (const value of Object.values(this.props.verification)) {
                if(Array.isArray(value?.tipe_verifikasi)){
                    if(value.tipe_verifikasi.length > 0){
                        for(const values of value.tipe_verifikasi){
                            if (values === 'submit_pendaftaran' || values === 'update_data' || values === 'tambah_data' || values === 'hapus_data'){
                                isChange = true;
                            }
                        }
                        // value.tipe_verifikasi.map((data) => {

                        // })
                    }
                }else{
                    if(value.tipe_verifikasi === 'submit_pendaftaran' || value.tipe_verifikasi === 'update_data' || value.tipe_verifikasi === 'tambah_data' || value.tipe_verifikasi === 'hapus_data'){
                        isChange = true;
                    }
                }
            }
        }

        return isChange
    }

    render() {
        const {has_draft_verification} = this.props;
        let rows;
        let arr = [];
        let {data} = this.state;
        if (this.props.status_vendor === 'partner') {
            for (const [key, value] of Object.entries(data)) {
                // console.log(`${key}: ${value.errors.length} - ${value.type}`);
                var objPartner = {
                    name: key,
                    sifat: value.type,
                    status: value.status,
                    note: value.note,
                    errors: [],
                    tipe_verifikasi: value.tipe_verifikasi,
                }
                if(key !== 'has_draft_verification' && key !== 'expired_in_day' && key !== 'status_vendor' && key !== 'status_migrasi'){
                    arr.push(objPartner)
                }
            }
        } else {
            for (const [key, value] of Object.entries(data)) {
                // console.log(`${key}: ${value.errors.length} - ${value.type}`);
                var obj = {
                    name: key,
                    sifat: value.type,
                    status: value.errors.length,
                    errors: value.errors,
                    tipe_verifikasi: []
                }
                arr.push(obj)
            }
        }
        if(arr.length > 0){
            rows = arr.map((dt, i) => (
                <tr key={i}>
                    <td>
                        {/* <Route> */}
                            <Link to={{pathname: this.handleRedirect(dt.name), name : dt.name}} onClick={() => localStorage.setItem("pathConfirmVerifikator", dt.name)}>{dt.name}</Link>
                        {/* </Route> */}
                    </td>
                    <td>{dt.sifat}</td>
                    <td>
                    {this.props.status_vendor !== 'partner' && 
                    <i>
                        {
                        (dt.status > 0) ? 
                            <b className={dt.sifat === "Optional" ? "text-black-lighter set-pointer" : "text-red-lighter set-pointer"} id={`tooltip-konfirmasi${i}`}>
                            Belum Terisi
                            <Tooltip placement="left" isOpen={this.state.tooltipOpen.includes(i)} target={`tooltip-konfirmasi${i}`} toggle={(e) => this.toggleTooltip(e, i)}>
                                {(dt.errors !== undefined) ? dt.errors.length > 0 ? dt.errors.join(",") : 'Tidak Ditemukan Data' : '-'}
                            </Tooltip>
                            </b> 
                        : 
                            <b className="text-green-lighter">Terisi</b>
                        }
                    </i>}
    
                        {this.props.status_vendor === 'partner' && 
                            (dt.tipe_verifikasi !== null) 
                            ? 
                                (Array.isArray(dt.tipe_verifikasi)) 
                                ? 
                                    (dt.tipe_verifikasi.length > 0) 
                                    ? 
                                    <ul>
                                        {
                                            dt.tipe_verifikasi.map((item, key) => (
                                                <li key={key}>{item}</li>    
                                            ))
                                        }    
                                    </ul>
                                    : <ul><li>{dt.tipe_verifikasi}</li></ul>
                                : (typeof dt.tipe_verifikasi !== 'object') ? <ul><li>{dt.tipe_verifikasi}</li></ul> : <ul><li>{dt[0]}</li></ul>
                            : ''
                        }
                        
                        </td>
                        {this.props.status_vendor === 'partner' &&
                            <td>
                                <i>{dt.note}</i>
                            </td>
                        }
                    </tr>
                  )  
            )
        } else {
            rows = (<RowEmpty colSpan='2'>Tidak ada data</RowEmpty>);
        }

        return (
            <div>
				{(this.state.loading) && ( <center> <br/> <ReactLoading type="cylon" color="#0f9e3e" /> <br/> </center> )}
                {this.state.loading === false && 
                <div>
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped table-sm">
                                <thead>
                                    <tr>
                                        <th>Nama Dokumen</th>
                                        <th>Sifat Dokumen</th>
                                        <th>Status</th>
                                        {this.props.status_vendor === 'partner' && <td> Keterangan </td>}
                                    </tr>
                                </thead>
                                <tbody>{rows}</tbody>
                        </table>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="text-center m-t-10 m-b-10">
                                {this.props.isVendor && !has_draft_verification && this.props.verification_uuid !== false && this.props.expired_in_day && <button
                                    className="btn btn-sm btn-danger m-l-10"
                                    type="button"
                                    disabled={this.props.konfirmasi.loadingButton}
                                    onClick={(e) => this.handleConfirm(e, "batal")}>
                                {this.props.konfirmasi.loadingButton && <i className="fas fa-spinner fa-pulse"></i> }
                                    Batalkan Pendaftaran
                                </button>}
                                {this.props.isVendor && !has_draft_verification && this.props.verification_uuid !== false && this.checkChangeData() && <button
                                    className="btn btn-sm btn-success m-l-10"
                                    type="button"
                                    disabled={this.props.konfirmasi.loadingButton}
                                    onClick={(e) => this.handleConfirm(e, "submit")}>
                                {this.props.konfirmasi.loadingButton && <i className="fas fa-spinner fa-pulse"></i> }
                                    Submit Profil
                                </button>}
                            </div>
                        </div>
                    </div>
                </div>
                }
                {
                    (
                        this.state.type !== "" && this.state.isConfirm && <SweetAlert
                            warning
                            showCancel={true}
                            confirmBtnText="OK"
                            cancelBtnText="Cancel"
                            confirmBtnBsStyle={this.state.type === "submit"
                                ? "primary"
                                : "danger"}
                            cancelBtnBsStyle="default"
                            title="Konfirmasi"
                            onConfirm={() => this.toggleSweetAlert('confirm')}
                            onCancel={() => this.toggleSweetAlert('cancel')}>
                            {this.state.type === "submit" && 'Apakah anda yakin akan melakukan submit profil ?'}
                            {this.state.type === "batal" && 'Apakah anda yakin akan membatalkan pendaftaran ?'}
                        </SweetAlert>
                    )
                }
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