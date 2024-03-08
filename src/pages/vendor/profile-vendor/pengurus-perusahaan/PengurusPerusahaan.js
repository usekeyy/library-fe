import React from "react";
import { connect } from 'react-redux';
import { Collapse, CardHeader, CardBody, Card } from "reactstrap";
import ReactTablePagination from "../../../../components/paginations/ReactTablePagination";
import ReactTable from "react-table";
import "react-table/react-table.css";
import withFixedColumns from "react-table-hoc-fixed-columns";
import "react-table-hoc-fixed-columns/lib/styles.css";
import FormPengurusPerusahaan from './sub/FormPengurusPerusahaan';
import ProfileVendor from "../ProfileVendor";
import { toastr } from 'react-redux-toastr';
import { fileUpload } from '../../../../store/actions/uploadActions';
import SweetAlert from 'react-bootstrap-sweetalert';
import ReactLoading from 'react-loading';
import {camelCase} from '../../../../helpers/camelCase';
import {statusKonfirmasiVerifikator} from '../../../../helpers/statusName';

import { fetchPengurusPerusahaan, showPengurusPerusahaan, deletePengurusPerusahaan, savePengurusPerusahaan, updatePengurusPerusahaan } from '../../../../store/actions/vendor/profile-vendor/pengurusPerusahaanActions'
import { withTranslation } from 'react-i18next';
import { statusVerifikasi, statusName } from "../../../../helpers/statusName";
import NoteVerificationData from '../../verification-data/NoteVerificationData';
import TableVerificationData from '../../verification-data/TableVerificationData';
import {showVerificationItem, saveVerificationItem, saveVerificationLineItem, deleteVerificationLineItem, showLogHistory} from '../../../../store/actions/vendor/verifikasiDataActions';
import HistoryInternal from "../../verification-data/HistoryInternal";

const ReactTableFixedColumns = withFixedColumns(ReactTable);

class PengurusPerusahaan extends React.Component {
  constructor(props) {
    super(props);
		this.child = React.createRef();

    this.state = {
			vendor_uuid: this.props.user.has_roles.includes("VNDR01") ? this.props.user.uuid : this.props.vendor.uuid,		
			isVendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
      activeTab: "1",
      activePill: "1",
      collapse: [{ id: 1, collapse: true, alias: "Pengurus Perusahaan" }],
      data: [],
      isInternal: this.props.location.pathname.split("/")[2] === 'list' ? true : false,
      params: {
        the: this.props.user.uuid,
        id: "",
        name: "",
        ktp_no: "",
        ktp_file: "",
        jabatan: "",
        phone_no: "",
        email: "",
        start: 0,
        length: 0,
        column: "",
        dir: "",
        source : this.props.location.pathname.split("/")[2] === 'list' ? 'master' : ''
      },
      sendData: {
        name: '',
        ktp_no: '',
        ktp_file: '',
        jabatan: '',
        phone_no: '',
        email: '',
        status: '',
        tipe_verifikasi: ''
      },
      load: {
        loadForm: false,
      },
      defaultPageSize: 10,
      pages: 0,
      recordsTotal: 0,
      recordsFiltered: 0,
      column: 1,
      dir: "",
      page: 0,
      loading: false,
      modalOpen: false,
      isConfirm: false,
      uuid: "",
      delete_uuid : "",
      isError: false,
      errors: {},
      loadingSubmit: false,
      statusSearch: [
        { name: "Active", value: "y", isChecked: false },
        { name: "Inactive ", value: "n", isChecked: false },
        { name: "Suspend", value: "p", isChecked: false },
        { name: "Draft", value: "d", isChecked: false },
        { name: "Submitted", value: "s", isChecked: false },
      ],
      verification: {
				note: '',
				errors: [],
				loadingButton: false,
				loading: false,
				btn_approve: '',
        verifLength: 0,
        loadingNote: true,
        verifyAll: true
			},
			isStatusDraftVerif : false
    };
    this.toggleCollapse = this.toggleCollapse.bind(this);
    this.defaultSorted = [
      {
        id: "name",
        desc: false,
      },
    ];
    this.columns = [
      {
        Header: () => this.props.t("profileVendor:pengurus.nama"),
        accessor: "name",        
      },
      {
        Header: () => this.props.t("profileVendor:pengurus.nomor-identitas"),
        accessor: "ktp_no",        
      },
      {
        Header: () => this.props.t("profileVendor:pengurus.file-identitas"),
        accessor: "ktp_file",        
        Cell: ({original}) => (
					<React.Fragment>
            <a href="/" onClick={ (e) => this.checkFileTemp(e,original.ktp_file)}>{original.ktp_file}</a>
						{/* <a target="_blank" rel="noopener noreferrer" href={(original.tipe_verifikasi === 'sudah_diverifikasi' || original.tipe_verifikasi === 'tambah_data' || original.tipe_verifikasi === 'submit_pendaftaran') ? `${process.env.REACT_APP_API_BASE_URL}files/vendor/${original.ktp_file}` : `${process.env.REACT_APP_API_BASE_URL}files/temp/${original.ktp_file}`} > {original.ktp_file} </a> */}
					</React.Fragment>
				)
      },
      {
        Header: () => this.props.t("profileVendor:pengurus.jabatan"),
        accessor: "jabatan",        
      },
      {
        Header: () => this.props.t("profileVendor:pengurus.no-hp"),
        accessor: "phone_no",        
      },
      {
        Header: "Email",
        accessor: "email",        
      },
      {
        Header: "Status",
        id: "status",
        accessor: d => statusName(d.status),
      },
      {
        Header: () => this.props.t("profileVendor:status-verifikasi"),
        id: "tipe_verifikasi",
        accessor: d => statusVerifikasi(d.tipe_verifikasi),
      },
      {
        Header: "Action",
        id: "action",
        accessor: d => d,
        className: "sticky",
        headerClassName: "sticky",
        fixed: "right",
        filterable: false,
        sortable: false,
        Cell: ({ value }) => (
          <React.Fragment>
            {this.props.getId.verification_uuid !== false && <center>
              {this.props.access.U && this.state.isVendor && !this.props.verification.has_draft_verification && <button disabled={this.state.verification.verifLength > 0} className="btn btn-xs btn-warning" onClick={(e) => this.showPayload(this.state.vendor_uuid, value.uuid)} ><i className="fa fa-edit"></i></button>}
              {this.props.access.U && this.state.isVendor && !this.props.verification.has_draft_verification && <button disabled={this.state.verification.verifLength > 0} className="btn btn-xs btn-danger" onClick={(e) => this.toggleConfirm(e, value.uuid)} ><i className="fa fa-trash"></i></button>}
              {this.props.access.A && !this.state.isVendor && (value.status !== 'y') && <button disabled={value.status === 'y' || this.state.verification.verifLength > 0} className="btn btn-xs btn-primary" onClick={(e) => this.saveVerificationLineItem(this.state.vendor_uuid, value.uuid, 'pengurus_perusahaan', { status: 'y' })}><span className={ (this.state.verification.loadingButton) ? "fas fa-spinner fa-pulse" : "fas fa-check"} disabled={this.state.verification.loadingButton}></span> </button>}
							{this.props.access.A && !this.state.isVendor && (value.status !== 'y') && <button disabled={value.status === 'y' || this.state.verification.verifLength > 0} className="btn btn-xs btn-danger" onClick={(e) => this.saveVerificationLineItem(this.state.vendor_uuid, value.uuid, 'pengurus_perusahaan', { status: 'n' })}><span className={ (this.state.verification.loadingButton) ? "fas fa-spinner fa-pulse" : "fas fa-times"} disabled={this.state.verification.loadingButton}></span></button>}
            </center>}
          </React.Fragment>
        )
      },
    ];
  }

  setStatusDraftVerif = (status) => {
		this.setState({isStatusDraftVerif : status})
	}

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
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

  checkStatus = (status, count, verify) => {
		this.setState(({ verification }) => ({
			verification: { ...verification, btn_approve: (status) ? 'n' : 'anjay', verifyAll: (count !== 0) ? count === verify : false },
		}));
	}

	checkStatusLog = (value) => {
		this.setState(({ verification, sendData }) => ({
			verification: { ...verification, loading: false, verifLength: value, loadingNote: false  },
			sendData: { ...sendData, status: 'd' },
		}));
	}
  
  asyncData = async () => {
    this.setState({ loading: true })
    this.setLoadingForm(false);
    this.props.fetchPengurusPerusahaan(this.state.vendor_uuid, this.state.params)
      .then((resp) => {
        this.setState({
          data: resp.data.data,
          pages: Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.params.length),
          recordsFiltered: resp.data.recordsFiltered,
          recordsTotal: resp.data.recordsTotal,
          loading: false
        }, () => {
          var found = false;
          const arr = [];
          let temp = false;
          for(var i = 0; i < this.state.data.length; i++) {
              if (this.state.data[i].status === 'y') {
                  arr.push(this.state.data[i].status)
              }
              if (this.state.data[i].status === 'n') {
                  // console.log("ooke");
                  found = true;
                  break;
              }

              if (this.state.data[i].tipe_verifikasi === 'update_data' || this.state.data[i].tipe_verifikasi === 'submit_pendaftaran' || this.state.data[i].tipe_verifikasi === 'tambah_data' || this.state.data[i].tipe_verifikasi === 'hapus_data'){
                this.setStatusDraftVerif(true)
                temp = true
              }else{
                  !temp && this.setStatusDraftVerif(false)
              }
          }
          this.checkStatus(found, resp.data.data.length, arr.length)
					this.setLoadingForm(false);
				})
			})
			.catch((resp) => {
				this.setState({ loading: false })
toastr.error(resp.data.status, resp.data.message);
			});
	}

	setLoadingForm = (type) => {
    this.setState(({ load }) => ({ load : { ...load, loadForm: type } }));
	}

  onChanged(event) {
    var someProperty = { ...this.state.params }
    someProperty[event.target.name] = event.target.value
    someProperty.start = 0;
    this.setState({
      params: someProperty,
      page: 0
    }, () => { this.req() });
  }

  customs(arr) {
    var state = (arr.pageSize = 0 ? 10 : arr.pageSize);
    var someProperty = { ...this.state }
    someProperty.page = arr.page
    someProperty.params.start = (arr.page * state)
    someProperty.params.length = state;
    someProperty.defaultPageSize = state;
    someProperty.params.column = arr.sorted[0].id
    someProperty.params.dir = (arr.sorted[0].desc ? 'desc' : 'asc')
    this.setState({ page: arr.page })
    this.setState({
      someProperty
    }, () => { this.req() });
  }

  req(stateArr) {
    if (stateArr !== undefined) {
      this.customs(stateArr)
    } else {
      this.asyncData();
    }
  }

  savePayload = (payload) => {
    if (this._isMounted) {
      let formLoad = { ...this.state.load }
      formLoad.loadForm = true;
      this.setState({ formLoad, loadingSubmit: true });
      this.props.savePengurusPerusahaan(this.state.vendor_uuid, payload)
        .then((resp) => {
          this.resetForm()
          let load = { ...this.state.load };
          load.loadForm = false;
          this.setState({ load ,loadingSubmit: false }, () => this.req())
          toastr.success(resp.data.message);
        })
        .catch(error => {
          if (error !== undefined) {
            toastr.error(error.data.message)
            this.setState({ errors: error.data.errors, loadingSubmit: false })
          } else {
            toastr.error('Opps Somethings Wrong')
          }
        })
    }
  }

  showPayload = (vendor_id, uuid) => {
    let load = { ...this.state.load };
    load.loadForm = true;
    this.setState({ load , errors : {}});
    this.props.showPengurusPerusahaan(vendor_id, uuid)
      .then((resp) => {
        var data = resp.data.data;
        this.setState({ uuid: data.uuid });
        var setSendData = { ...this.state }
        setSendData.sendData.name = data.name;
        setSendData.sendData.ktp_no = data.ktp_no;
        setSendData.sendData.ktp_file = data.ktp_file;
        setSendData.sendData.jabatan = data.jabatan;
        setSendData.sendData.phone_no = data.phone_no;
        setSendData.sendData.email = data.email;
        setSendData.sendData.status = data.status;
        setSendData.sendData.tipe_verifikasi = data.tipe_verifikasi;
        setSendData.uuid = uuid;
        setSendData.load.loadForm = false;
        this.setState({ setSendData });
      })
      .catch((resp) => {
        let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
        toastr.error(message);
      });
  }

  updatePayload = (id, payload) => {
    if (this._isMounted) {
      this.setState({ loadingSubmit: true , errors : {}});
      this.props.updatePengurusPerusahaan(this.state.vendor_uuid, id, payload)
        .then((resp) => {
          this.resetForm();
          toastr.success(resp.data.message);
          this.setState(({load, loadingSubmit, uuid}) => ({  load : {...load , loadForm : false } ,uuid: '', loadingSubmit:false}), () => this.req())
        })
        .catch((error) => {
          this.setState({ errors: error.data.errors,loadingSubmit: false });
        })
    }
  }

  deletePayload = (vendor_uuid, uuid) => {
    this.props.deletePengurusPerusahaan(vendor_uuid, uuid)
      .then((resp) => {
        toastr.success(resp.data.message);
        this.setState({ isConfirm: false });
        this.req()
      })
      .catch((error) => {
        if (error !== undefined) {
          toastr.error(error.data.message)
          this.setState({ isError: true, errors: error.data.errors, loadingSubmit: false })
        } else {
          toastr.error('Opps Somethings Wrong')
        }
      })
  }

  toggleConfirm = (e, value) => {
    e.preventDefault();
    const uuid = (typeof value !== 'undefined') ? value : e.target.value;
    this.setState({ isConfirm: true, delete_uuid: uuid })
  }

  toggleSweetAlert(name) {
    switch (name) {
      case 'confirm':
        this.deletePayload(this.state.vendor_uuid, this.state.delete_uuid)
        break;
      case 'cancel':
        this.setState({ isConfirm: false, delete_uuid: '' });
        break;
      default:
        this.setState({ isConfirm: false, delete_uuid: '' });
        break;
    }
  }

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  togglePill(pill) {
    if (this.state.activePill !== pill) {
      this.setState({
        activePill: pill,
      });
    }
  }

  resetForm = () => {
    var setSendData = { ...this.state }
    setSendData.sendData.name = '';
    setSendData.sendData.ktp_no = '';
    setSendData.sendData.ktp_file = '';
    setSendData.sendData.jabatan = '';
    setSendData.sendData.phone_no = '';
    setSendData.sendData.email = '';
    setSendData.sendData.status = '';
    setSendData.load.loadForm = true;
    this.setState({ setSendData });
  }

  cancelBtn = async () => {
		this.resetForm()
		setTimeout(() => {
      var setSendData = { ...this.state }
      setSendData.load.loadForm = false;
      setSendData.uuid = '';
			this.setState(setSendData);
		}, 1)
	}

  toggleCollapse(index) {
    var newArray = [];
    for (let collapseObj of this.state.collapse) {
      if (collapseObj.id === index) {
        collapseObj.collapse = !collapseObj.collapse;
      } else {
        collapseObj.collapse = false;
      }
      newArray.push(collapseObj);
    }

    this.setState({
      collapse: newArray,
    });
  }

  // VERIFICATION
	saveVerificationItem = (uuid, path, payload) => {
		if(this._isMounted){
			this.setState(({ verification }) => ({ verification: { ...verification, loadingButton: true } }));
			this.props.saveVerificationItem(uuid, path, payload)
			.then((resp) => {
				this.setState(({ load }) => ({ load: { ...load, loadForm: true } }));
				this.setState(({ load, verification }) => ({ 
					verification: { ...verification, note: '', loadingButton: false, loading: false, errors: [], loadingNote: true },
					load: { ...load, loadForm: false }
				}), () => {
          this.child.current.fetchData() && this.setState(({ verification }) => ({
						verification: { ...verification, loadingNote: false },
					}));
				});
        toastr.success('Success Save Verification Data');
        this.toggleCollapse(1)
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
			this.setState(({ verification }) => ({ 
				verification: { ...verification, loadingButton: true }, 
			}));

			this.props.saveVerificationLineItem(uuid, item_uuid, path, payload)
			.then((resp) => {
				this.setState(({ verification }) => ({ 
					verification: { ...verification, note: '', loadingButton: false, errors: [] },
				}), () => {
					this.req();
				});
				toastr.success('Success Save Verification Data');
			})
			.catch((resp) => {
				this.setState(({ verification }) => ({ 
					verification: { ...verification, errors: resp.data.errors, loadingButton: false }, 
				}));
				toastr.error('Failed Save Verification Data');
			});
		}
	}

  render() {
    const colorPanelBlack = {
			// 'background': 'black',
			// 'font-weight' : 'bold',
			'background': 'linear-gradient(90deg, rgba(87, 174, 229, 1) 0%, rgba(97, 188, 246, 1) 100%)',
		}

		const colorPanelRed = {
			'fontWeight' : 'bold',
			'background': 'linear-gradient(90deg, rgba(173,0,0,1) 0%, rgba(255,0,0,1) 100%)',
		}
    const { t } = this.props
		const loading = this.state.load.loadForm;
    const note_revisi = (this.props.verification.has_draft_verification === false && this.props.verification['Pengurus Perusahaan'].note !== null) ? (this.props.verification['Pengurus Perusahaan'].status !== null && this.props.verification['Pengurus Perusahaan'].status === 'y') ? undefined : true !== null : undefined;
    
    return (
      <div>
        <ol className="breadcrumb float-xl-right">
          <li className="breadcrumb-item">Home</li>
          <li className="breadcrumb-item">Vendor Management</li>
          <li className="breadcrumb-item active">{t("profileVendor:sub-accordion.pengurus-perusahaan")}</li>
        </ol>
        <h1 className="page-header">Profil Vendor </h1> 
        <div className="row">
          <div className="col-md-3">
            <ProfileVendor />
          </div>
          <div className="col-md-9">
            <div id="accordion" className="accordion">
              {this.state.collapse.map((value, i) => (
                <Card className="bg-white text-black" key={i}>
                  <CardHeader style={(this.state.isVendor && this.props.verification.has_draft_verification !== undefined && this.props.verification.has_draft_verification === false && this.props.verification[value.alias] !== undefined && this.props.verification[value.alias]).status==="n" ? colorPanelRed : colorPanelBlack }
                    className={
                      "card-header bg-dark-darker text-white pointer-cursor " +
                      (!value.collapse ? "collapsed " : "")
                    }
                    onClick={() => this.toggleCollapse(value.id)}
                  >
                    <i className="fa fa-circle f-s-8 mr-2 text-white-lighter"></i>{" "}
                    {t("profileVendor:sub-accordion.pengurus-perusahaan")}
                    {this.state.isInternal ? '' : (this.state.isVendor ?
                      <div style={{color:"yellow", fontWeight:"bold", float:"right"}}>({camelCase(this.props?.verification[value.alias]?.tipe_verifikasi?.[0])})</div>
                      :<div style={{color:"yellow", fontWeight:"bold", float:"right"}}>({statusKonfirmasiVerifikator(this.props?.verification?.status_vendor,this.props?.verification[value.alias])})</div>
                    )
                    }
                  </CardHeader>
                  <Collapse isOpen={value.collapse}>
                    <CardBody>
                      <div className="col-md-12">
                        {loading && <center><br/><ReactLoading type="cylon" color="#0f9e3e" /><br/></center>}
				                {!loading && this.state.isVendor && note_revisi !== undefined && <p className="text-danger"> <b> {t("profileVendor:catatan-revisi")} </b> {this.props.verification['Pengurus Perusahaan'].note} </p>}
                        {!loading && this.state.isVendor &&
                          <FormPengurusPerusahaan
                            uuid={this.state.uuid}
                            data={this.state.sendData}
                            upload={this.props.fileUpload}
                            save={this.savePayload}
                            update={this.updatePayload}
                            cancelBtn={this.cancelBtn}
                            errors={this.state.errors}
                            loadingSubmit={this.state.loadingSubmit}
                            has_draft_verification={this.props.verification.has_draft_verification} has_verification={this.props.verification} parentState={this.state}
                            isVendor={this.state.isVendor}
                          />}
                      </div>

                      {!loading && <div className="col-md-12 m-t-10">
                        <ReactTableFixedColumns
                          filterable={false}
                          loading={this.state.loading}
                          manual
                          minRows={1}
                          PaginationComponent={ReactTablePagination}
                          data={this.state.data}
                          columns={this.columns}
                          defaultPageSize={this.state.defaultPageSize}
                          defaultSorted={this.defaultSorted}
                          showPagination={true}
                          showPaginationTop={false}
                          showPaginationBottom={true}
                          pageSizeOptions={[10, 20, 25, 50, 100]}
                          recordsTotal={this.state.recordsTotal}
                          recordsFiltered={this.state.recordsFiltered}
                          length={this.state.params.length}
                          start={this.state.params.start}
                          page={this.state.page}
                          offResetFilter={true}
                          className="-highlight"
                          pages={this.state.pages}
                          onFetchData={(state, instance) => {
                            this.req(state);
                          }}
                        />
                      </div>}
                      {this.state.verification.loadingNote && !this.state.isVendor && this.props.getId.verification_uuid !== false && <center><br/><ReactLoading type="cylon" color="#0f9e3e" /><br/></center>}
                      {!loading && !this.state.verification.loadingNote && !this.state.isVendor && this.props.getId.verification_uuid !== false && this.state.data.length > 0 && <NoteVerificationData
                        status_vendor={this.props.verification.status_vendor} 
                        data={this.state.verification} 
                        vendor_uuid={this.state.vendor_uuid}
                        verification_uuid={this.props.getId.verification_uuid}
                        path={"pengurus_perusahaan"}
                        access={this.props.access}
                        verification={this.saveVerificationItem}
                        status={this.state.sendData.status}
					              isVerifMultiple={true}
                        isStatusDraftVerif={this.state.isStatusDraftVerif}
                      />}
                      {!loading && !this.state.isVendor && this.props.getId.verification_uuid !== false &&
                      <TableVerificationData 
                        ref={this.child}
                        vendor_uuid={this.state.vendor_uuid} 
                        verification_uuid={this.props.getId.verification_uuid}
                        path={"pengurus_perusahaan"}
                        access={this.props.access}
                        showVerification={this.props.showVerificationItem} 
                        saveVerificationItem={this.props.saveVerificationLineItem}
                        deleteVerificationItem={this.props.deleteVerificationLineItem} 
                        title={this.props.title} 
                        isVerifMultiple={true}
                        checkStatusLog={this.checkStatusLog}
                        fetchData={this.asyncData}
                        showLogHistory={this.props.showLogHistory}
                      />}
                      {!loading && !this.state.isVendor && this.state.isInternal && <HistoryInternal 
                        vendor_uuid={this.state.vendor_uuid} 
                        path={"pengurus_perusahaan"}
                        access={this.props.access}
                        title={this.props.title} 
                        showLogHistory={this.props.showLogHistory}
                      />}
                    </CardBody>
                  </Collapse>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <SweetAlert
          warning
          show={this.state.isConfirm}
          showCancel
          confirmBtnText={t("common:delete.approve-delete")}
          cancelBtnText={t("common:delete.cancel")}
          confirmBtnBsStyle="danger"
          cancelBtnBsStyle="default"
          title={t("common:delete.title-delete")}
          onConfirm={() => this.toggleSweetAlert('confirm')}
          onCancel={() => this.toggleSweetAlert('cancel')}
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
    vendor: state.vendorProfile.vendor,
    getId: state.vendorProfile,
    verification: state.verification.verification
  }
}

const dispatchToProps = dispatch => {
  return {
    fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
    fetchPengurusPerusahaan: (vendor_uuid, params) => dispatch(fetchPengurusPerusahaan(vendor_uuid, params)),
    showPengurusPerusahaan: (vendor_uuid, params) => dispatch(showPengurusPerusahaan(vendor_uuid, params)),
    deletePengurusPerusahaan: (vendor_uuid, params) => dispatch(deletePengurusPerusahaan(vendor_uuid, params)),
    savePengurusPerusahaan: (vendor_uuid, params) => dispatch(savePengurusPerusahaan(vendor_uuid, params)),
    updatePengurusPerusahaan: (vendor_uuid, id, params) => dispatch(updatePengurusPerusahaan(vendor_uuid, id, params)),
    showVerificationItem: (uuid, path, params) => dispatch(showVerificationItem(uuid, path, params)),
		saveVerificationItem: (uuid, path, payload) => dispatch(saveVerificationItem(uuid, path, payload)),
		saveVerificationLineItem: (uuid, item_uuid, path, payload) => dispatch(saveVerificationLineItem(uuid, item_uuid, path, payload)),
    deleteVerificationLineItem: (uuid, item_uuid, path) => dispatch(deleteVerificationLineItem(uuid, item_uuid, path)),
		showLogHistory: (uuid, path, params) => dispatch(showLogHistory(uuid, path, params)),
  }
}
export default connect(stateToProps, dispatchToProps)(withTranslation()(PengurusPerusahaan));
