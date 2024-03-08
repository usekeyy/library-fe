import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toastr} from 'react-redux-toastr';
// import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';
// import FilterStatus from '../../../../components/filterstatus/FilterStatus';

import {saveMigrasiVendor} from '../../../store/actions/vendor/migrasiVendorActions';

import { Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import { uploadMigrasi } from '../../../store/actions/uploadActions';
import FormMigrasi from './sub/FormMigrasi';
import SheetVendor from './sub/SheetVendor';
import SheetExtendCompany from './sub/SheetExtendCompany';
import SheetVendorPic from './sub/SheetVendorPic';
import SheetSiujk from './sub/SheetSiujk';
import SheetSuratIzinLain from './sub/SheetSuratIzinLain';
import SheetDokumenPajakFiskal from './sub/SheetDokumenPajakFiskal';
import SheetKompetensiVendor from './sub/SheetKompetensiVendor';
import SheetRekeningBank from './sub/SheetRekeningBank';
import Badge from 'reactstrap/lib/Badge';
// bro template migrasi yg baru dah selesai dan udah tak testing sm mas Ikhsan... aku minta tolong penyesuaian FE nya ya

// 1. tambahkan bintang merah pada form Nama Perusahaan di field Email Perusahaan
// 2. typo untuk nama accourdion Surat Izin Usaha Jasa Konstruksi (SIUJK)

// Pada Tabel Migrasi hilangkan kolom :
// 3. Tab Vendors : Direktur utama, email, website, npwp date, sppkp start date, sppkp end date, lembaga sppkp, siup star date, lembaga siup, recount account,
//    incoterm location, term of payment
// 4. Hilangkan tab extend company, rekening bank
// 5. Tab PIC : Jabatan
// 6. Tab SIUJK : start date, issued by, vendor qualification, status SIUJK, 
// 7. Tab Surat izin lain :  nama izin, start date, issued by
// 8. Tab Fiskal : issued by, start date, end date
// 9. Tab Kompetensi: merk 
// 10. Sesuaikan template migrasi pada download  migrasi dengan template yg baru
class MigrasiVendor extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
	
		this.state = {
      tab : "0",
      status_validasi : false,
      loadingButton : false,
      checkError : 0,
      checkErrorTab : []
		}
	}
	
  componentDidMount = () => {
    this._isMounted = true;
		if(this._isMounted){
		}
	}
	
	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }

  toggleTab = (tab) => {
    if(this.state.tab !== tab) this.setState({tab : tab});
  }

  redirectHistory = () => {
    this.props.history.push('/vendor/migration');
  }

  setStateTab = (value) => {
    // console.log(data)
    // this.checkIsError(data)
    this.setState({tab : value})
  }

  saveMigrasiVendor = () => {
    // console.log("tes")
    this.setState({
      loadingButton : true
    })
    this.props.saveMigrasiVendor()
    .then(() => {
      this.setState({
        loadingButton : false,
        tab : '0'
      })
      toastr.success("Sukses Migrasi Data");
      this.redirectHistory()
    })
    .catch((error)=>{
      this.setState({
        loadingButton : false
      })
      toastr.error("Gagal Migrasi Data",error.data.errors);
    })
  }

  checkIsError = (data) => {
    let temp = 0;
    // let temp_tab = [];
    for (const [key, value] of Object.entries(data)) {
      // console.log(key)
      if (key !== "error"){
        temp = temp + value
      }
      // temp_tab.push({name : key, value : value})
		}
    this.setState({checkError : temp, checkErrorTab : data})
  }

  checkErrorVendor = (data) => {
    // console.log(data)
    const a = data.filter((item) => {
      return (this.state.checkErrorTab[item] !== 0)
    })
    console.log(a)
    if (a.length > 0){
      return true
    }else{
      return false
    }
  }

  render(){

    const tab = [
      {
        nomor : '1',
        nama : 'Vendors',
        error : ['npwp','pakta_integritas','punishment','situ','siup','sppkp','tdp','vendor','vendor_address']
      },
      // {
      //   nomor : '2',
      //   nama : 'Extend Company',
      //   error : 'extend'
      // },
      {
        nomor : '3',
        nama : 'Vendor PIC',
        error : 'pic'
      },
      {
        nomor : '4',
        nama : 'SIUJK',
        error : 'siujk'
      },
      {
        nomor : '5',
        nama : 'Surat Izin Lain',
        error : 'lain'
      },
      {
        nomor : '6',
        nama : 'Pajak Fiskal',
        error : 'fiskal'
      },
      {
        nomor : '7',
        nama : 'Kompetensi Vendor',
        error : 'kompetensi'
      },
      // {
      //   nomor : '8',
      //   nama : 'Rekening Bank',
      //   error : 'rekening_bank'
      // },
    ]

    return (
      <div>
        <ol className="breadcrumb float-xl-right">
            <li className="breadcrumb-item">Home</li>
            <li className="breadcrumb-item">Vendor Management</li>
            <li className="breadcrumb-item active">Migrasi Vendor</li>
        </ol>
        <h1 className="page-header">Migrasi Vendor</h1>
        <Panel loading={false}>
                    <PanelHeader>Migrasi Vendor</PanelHeader>
                    <PanelBody loading={false}>
                        <Row>
                            <Col sm="12">
                                <FormMigrasi 
                                  upload= {this.props.uploadMigrasi}
                                  setStateTab = {this.setStateTab}
                                  checkIsError = {this.checkIsError} 
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12">
                               <hr></hr>
                            </Col>
                        </Row>
                        {this.state.tab !== '0' &&
                          <Row>
                            <Col sm="12">
                              <Nav>
                                {tab.map((item) => {
                                  return (
                                    <NavItem style={this.state.tab === item.nomor ? {backgroundColor : 'green',cursor : 'pointer'} : {backgroundColor : 'white', cursor : 'pointer'}} key={item.nomor}>
                                      <NavLink
                                        style={this.state.tab === item.nomor ? {color : 'white'} : {color : '#656f78'}}
                                        onClick={() => { this.toggleTab(item.nomor); }}
                                      >
                                        {item.nama + ' '} 
                                        {item.nama !== 'Vendors' ? 
                                          this.state.checkErrorTab[item.error] !== 0 && <sup><Badge color="danger">error</Badge></sup> 
                                          :this.checkErrorVendor(item.error) && <sup><Badge color="danger">error</Badge></sup> }
                                      </NavLink>
                                    </NavItem>
                                  )
                                })}
                              </Nav>
                              <br></br>
                              {/* content */}

                              {this.state.tab === '1' && <SheetVendor data = {this.state.data_vendor}/>}
                              {this.state.tab === '2' && <SheetExtendCompany />}
                              {this.state.tab === '3' && <SheetVendorPic />}
                              {this.state.tab === '4' && <SheetSiujk />}
                              {this.state.tab === '5' && <SheetSuratIzinLain />}
                              {this.state.tab === '6' && <SheetDokumenPajakFiskal />}
                              {this.state.tab === '7' && <SheetKompetensiVendor />}
                              {this.state.tab === '8' && <SheetRekeningBank />}
                            </Col>
                          </Row>
                        }
                        <br></br>
                          <button className="btn btn-white pull-right" onClick={this.redirectHistory}>kembali</button>
                          {this.state.tab !== '0'
                          && this.state.checkError === 0
                          && <button className="btn btn-success pull-right" style={{marginRight:"10px"}} onClick={this.saveMigrasiVendor} disabled={this.state.loadingButton}>
                            {this.state.loadingButton && <i className="fas fa-spinner fa-pulse"/>}submit
                          </button>}
                    </PanelBody>
                </Panel>
        </div>
    );
  }
}

const stateToProps = state => {
	return {
		sidebarDt: state.sidebarDt,
        access: state.sidebarDt.access,
        user : state.auth.user.data,
	}
}

const dispatchToProps = dispatch => {
	return {
    uploadMigrasi: (payload) => dispatch(uploadMigrasi(payload)),
    saveMigrasiVendor: () => dispatch(saveMigrasiVendor()),
    
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (MigrasiVendor));