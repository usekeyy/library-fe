import React from "react";
import { Collapse, CardHeader, CardBody, Card } from "reactstrap";
import FormKompetensi from "./sub/FormKompetensi";
import TableKompetensi from './sub/TableKompetensi';
import ReactTable from "react-table";
import "react-table/react-table.css";
import ReactTablePagination from '../../../../components/paginations/ReactTablePagination';
import withFixedColumns from "react-table-hoc-fixed-columns";
import "react-table-hoc-fixed-columns/lib/styles.css";
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { withTranslation } from 'react-i18next';
import ReactLoading from 'react-loading';
import { fileUpload } from '../../../../store/actions/uploadActions';
import { fetchBidangUsaha } from '../../../../store/actions/master/bidangUsahaActions';
import { fetchSubBidangUsaha } from '../../../../store/actions/master/subBidangUsahaActions';
import { fetchTipeRekanan } from '../../../../store/actions/master/tipeRekananActions';
import { fetchKompetensi } from '../../../../store/actions/vendor/profile-vendor/kompetensiActions';
import SweetAlert from "react-bootstrap-sweetalert";

import {camelCase} from '../../../../helpers/camelCase';
import {statusKonfirmasiVerifikator} from '../../../../helpers/statusName';

const ReactTableFixedColumns = withFixedColumns(ReactTable);

class Kompetensi extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.child = React.createRef();
    this.state = {
      activeTab: "1",
      activePill: "1",
      collapse: [{ id: 1, collapse: true, alias: 'Kompetensi' }],
      data: [],
      // paramId: this.props.location.pathname.split("/")[3],
      vendor_uuid: this.props.user.has_roles.includes("VNDR01") ? this.props.user.uuid : this.props.vendor.uuid,
			isVendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
      params: {
        the: this.props.user.has_roles.includes("VNDR01") ? this.props.user.uuid : this.props.vendor.uuid,
        start: 0,
        length: 0,
        column: "",
        dir: "",
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
      uuid_delete : "",
      isError: false,
      errors: {},
      subBidangUsaha: [],
      bidangUsaha: [],
      tipeRekanan: [],
      inputValue:'',
      merks:[],
      loadings: {
        subBidangUsaha: false,
        bidangUsaha: false,
        tipeRekanan: false,
        showItems: false
      },
      load: {
        loadForm: false,
      },
      sendData: {
        attachment : '',
        merk : '',
        bidang_usaha_id : '',
        sub_bidang_usaha_id : '',
        tipe_rekanan_id : '',
        tipe_verifikasi : '',
      },
      isDisabled: {
        subBidangUsaha: false,
        bidangUsaha: false,
        tipeRekanan: false,
      },
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
      loadingButton:false,
      loadingSubmit: false,
      statusSearch: [
        { name: "Active", value: "y", isChecked: false },
        { name: "Inactive ", value: "n", isChecked: false },
        { name: "Suspend", value: "p", isChecked: false },
        { name: "Draft", value: "d", isChecked: false },
        { name: "Submitted", value: "s", isChecked: false },
      ],
      tempData: {
        formData: {},
        tableData: []
      }
    };
    this.toggleCollapse = this.toggleCollapse.bind(this);
    this.defaultSorted = [
      {
        id: "id",
        desc: false,
      },
    ];
    this.columns = [
      {
        Header: "Bidang Usaha",
        id: "bidang_usaha_name",
        accessor: d => d.bidang_usaha_id + " - " + d.bidang_usaha_name,
      },
      {
        Header: "Sub Bidang Usaha",
        id : "sub_bidang_usaha_name",
        accessor: d => d.sub_bidang_usaha_id + " - " + d.sub_bidang_usaha_name,
      },
      {
        Header: "Tipe Rekanan",
        id : "tipe_rekanan_name",
        accessor : d => d.tipe_rekanan_id +" - "+ d.tipe_rekanan_name,
      },
      {
        Header: "Merk/Brand",
        accessor: "merk",
        Cell: ({value}) => (
          (value !== null) ? 
           value.split(";").map((data, i) => {
             return <span key={i} className="label label-green m-r-5">{data}</span>
           })
           : ''
        )
      },
      {
        Header: "Lampiran",
        accessor: "attachment",
        Cell: ({value}) => (
					<React.Fragment>
						{(value!=="" && value !==null)? <a target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/vendor/${value}` } > {value} </a> : ''}
					</React.Fragment>
				)
      },
    ];
  }

  componentDidMount = () => {
    this._isMounted = true;
    if (this._isMounted) {
      this.getTipeRekanan();
      this.getBidangUsaha();
      if (this.props.isRequestor && this.props.uuid !== ""){
        this.asyncData();
      }
      
    }
  }


  componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }

  asyncData = async () => {
    this.setState({ loading: true })
    this.setLoadingForm(false);
    this.props.fetchKompetensi(this.props.uuid, this.state.params)
      .then((resp) => {
        if(this.props.isRequestor){
          this.setKompetensiRequestor(resp.data.data)
        }else{
          this.setState({
            data: resp.data.data,
            pages: Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.params.length),
            recordsFiltered: resp.data.recordsFiltered,
            recordsTotal: resp.data.recordsTotal,
            loading: false
          }, () => {
            var found = false;
            const arr = [];
            for(var i = 0; i < this.state.data.length; i++) {
                if (this.state.data[i].status === 'y') {
                  arr.push(this.state.data[i].status)
                }
                if (this.state.data[i].status === 'n') {
                    found = true;
                    break;
                }
            }
            this.checkStatus(found, resp.data.data.length, arr.length)
            this.setLoadingForm(false);
          })
        }
      })
      .catch((resp) => {
        this.setState({ loading: false })
        let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
        toastr.error('Oops', message);
      });
  }

  setKompetensiRequestor = (data) => {
    let tempArr = data.map((item) => {
      return {
          bidang_usaha_id: {label : (item.bidang_usaha_id + ' - ' + item.bidang_usaha_name), value : item.bidang_usaha_id},
          sub_bidang_usaha_id: {label : (item.sub_bidang_usaha_id + ' - ' + item.sub_bidang_usaha_name), value : item.sub_bidang_usaha_id},
          tipe_rekanan_id: {label : (item.tipe_rekanan_id + ' - ' + item.tipe_rekanan_name), value : item.tipe_rekanan_id},
          merk: (item.merk ? item.merk.split(";").map((item) => {return {label : item, value : item}}) : ""),
          attachment: item.attachment,
      }
    })

    // this.setState({data : tempArr})
    this.saveItems(tempArr)
    
    // data.map
  }


  req(stateArr) {
    if (stateArr !== undefined) {
      this.customs(stateArr)
    } else {
      this.asyncData();
    }
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

  setLoadingForm = (type) => {
    this.setState(({ load }) => ({ load : { ...load, loadForm: type } }));
  }

  checkStatus = (status, count, verify) => {
		this.setState(({ verification }) => ({
			verification: { ...verification, btn_approve: (status) ? 'n' : 'anjay', verifyAll: (count !== 0) ? count === verify : false },
		}));
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

  getTipeRekanan(payload) {
    if (this._isMounted) {
      this.setState(({ loadings, isDisabled }) => ({
        loadings: { ...loadings, tipeRakanan: true },
        isDisabled: { ...isDisabled, tipeRakanan: true },
      }));
      this.props
        .fetchTipeRekanan({column: 'id',dir: 'asc'})
        .then((resp) => {
          let data = resp.data.data;
          let options = data.map((data) => {
            return { value: data.id, label: data.id + ' - ' + data.name };
          });
          this.setState(({ loadings, isDisabled }) => ({
            loadings: { ...loadings, tipeRekanan: false },
            isDisabled: { ...isDisabled, tipeRekanan: false },
            tipeRekanan: options,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings, isDisabled }) => ({
            loadings: { ...loadings, tipeRekanan: false },
            isDisabled: { ...isDisabled, tipeRekanan: false },
          }));
          toastr.error(resp.data.status, resp.data.message);
        });
    }
  }

  getBidangUsaha(payload) {
    if (this._isMounted) {
      this.setState(({ loadings, isDisabled, sendData }) => ({
        loadings: { ...loadings, bidangUsaha: true },
        isDisabled: { ...isDisabled, bidangUsaha: true },
      }));
      this.props
        .fetchBidangUsaha({column: 'id',dir: 'asc'})
        .then((resp) => {
          let data = resp.data.data;
          let options = data.map((data) => {
            return { value: data.id, label: data.id + ' - ' + data.name };
          });
          this.setState(({ loadings, isDisabled, regions, sendData }) => ({
            loadings: { ...loadings, bidangUsaha: false },
            isDisabled: { ...isDisabled, bidangUsaha: false },
            bidangUsaha: options,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings, isDisabled }) => ({
            loadings: { ...loadings, bidangUsaha: false },
            isDisabled: { ...isDisabled, bidangUsaha: false },
          }));
          toastr.error(resp.data.status, resp.data.message);
        });
    }
  }

  getSubBidangUsaha(payload) {
    if (this._isMounted) {
      if (payload !== null) {
        this.setState(({ loadings, isDisabled }) => ({
          loadings: { ...loadings, subBidangUsaha: true },
          isDisabled: { ...isDisabled, subBidangUsaha: true },
        }));
        let params = { bidang_usaha_id: payload ,'not-used' : true }
        this.props
          .fetchSubBidangUsaha(params)
          .then((resp) => {
            let data = resp.data.data;
            let options = data.map((data) => {
              return { value: data.id, label: data.id + ' - ' + data.name };
            });
            this.setState(({ loadings, isDisabled }) => ({
              loadings: { ...loadings, subBidangUsaha: false },
              isDisabled: { ...isDisabled, subBidangUsaha: false },
              subBidangUsaha: options,
            }));
          })
          .catch((resp) => {
            this.setState(({ loadings, isDisabled }) => ({
              loadings: { ...loadings, subBidangUsaha: false },
              isDisabled: { ...isDisabled, subBidangUsaha: false },
            }));
            toastr.error(resp.data.status, resp.data.message);
          });
      }
    }
  }

  savePayload = (payload) => {
    if (this._isMounted) {
      let formLoad = { ...this.state.load }
      formLoad.loadForm = true;
      this.setState({ formLoad, loadingSubmit: true , errors : {} });
      this.props.saveKompetensi(this.state.vendor_uuid, payload)
        .then((resp) => {
          this.resetForm()
          let load = { ...this.state.load };
          load.loadForm = false;
          this.setState({ load, loadingSubmit: false }, () => this.req())
          toastr.success(resp.data.message);
        })
        .catch(error => {
          if (error !== undefined) {
            toastr.error(error.data.message)
            if(error.data.errors.bidang_usaha_rule!==undefined){
              toastr.error( error.data.errors.bidang_usaha_rule[0])
            }
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
    this.setState({ load , errors : {} });
    this.props.showKompetensi(vendor_id, uuid)
      .then((resp) => {
        var data = resp.data.data;
        this.setState({ uuid: data.uuid });
        var setSendData = { ...this.state }
        let options = ''
        if(data.merk !== null && data.merk !== '' && data.merk !== undefined){
          let merkOptions= data.merk.split(',');
          options = merkOptions.map((data) => {
            return { value: data , label: data};
          });
        }
        // console.log(options)
        
        setSendData.sendData.attachment = data.attachment;
        setSendData.sendData.merk = options;
        setSendData.sendData.bidang_usaha_id = { value : data.bidang_usaha_id , label : data.sub_bidang_usaha_id +" "+ data.bidang_usaha_name};
        setSendData.sendData.sub_bidang_usaha_id = { value : data.sub_bidang_usaha_id , label : data.sub_bidang_usaha_id +" "+ data.sub_bidang_usaha_name};
        setSendData.sendData.tipe_rekanan_id = {value : data.tipe_rekanan_id , label : data.tipe_rekanan_id +" - "+ data.tipe_rekanan_name};
        setSendData.sendData.tipe_verifikasi = data.tipe_verifikasi;
        setSendData.sendData.uuid = data.uuid;
        setSendData.sendData.tipe_verifikasi = data.tipe_verifikasi;
        setSendData.uuid = uuid;
        setSendData.merks = options;
        setSendData.load.loadForm = false;
        this.getSubBidangUsaha(data.bidang_usaha_id);
        this.setState({ setSendData });
      })
      .catch((resp) => {
        let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
        toastr.error(message);
        this.setState(({ load }) => ({
					load: { ...load, loadForm: false },
				}));
      });
  }

  updatePayload = (id, payload) => {
    
  }

  toggleConfirm = (e, value) => {
    e.preventDefault();
    const uuid = (typeof value !== 'undefined') ? value : e.target.value;
    this.setState({ isConfirm: true, uuid_delete: uuid })
  }

  resetForm = () => {
    var setSendData = { ...this.state }
    setSendData.sendData.attachment = "";
    setSendData.sendData.created_at = "";
    setSendData.sendData.created_by = "";
    setSendData.sendData.id = "";
    setSendData.sendData.merk = "";
    setSendData.sendData.status = "";
    setSendData.sendData.bidang_usaha_id = "";
    setSendData.sendData.sub_bidang_usaha_id = "";
    setSendData.sendData.sub_bidang_usaha_name = "";
    setSendData.sendData.tipe_rekanan_id = "";
    setSendData.sendData.tipe_rekanan_name = "";
    setSendData.sendData.tipe_verifikasi = "";
    setSendData.sendData.updated_at = "";
    setSendData.sendData.updated_by = "";
    setSendData.sendData.uuid = "";
    setSendData.sendData.vendor_id = "";
    setSendData.uuid = '';
    setSendData.load.loadForm = true;
    setSendData.errors = {};
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

  deletePayload = (index) => {
    let data = this.state.data;
		let arr = []
		data.forEach((element, i) => {
			if (i !== index) {
				arr.push(element)
			}
    });
    this.props.deletePayload(arr)
		this.setState(prevState => ({
			...prevState,
			data: arr
		}))
  }

  saveItems = (payload) => {
    var joined = this.state.data.concat(payload);
    this.props.saveItems(joined)
    this.setState({ data: joined })
  }

  render() {
    const {t}  = this.props;
    const colorPanelBlack = {
			// 'background': 'black',
			// 'font-weight' : 'bold',
			'background': 'linear-gradient(270deg, rgba(2,106,103,1) 0%, rgba(2,121,44,1) 100%)',
		}

		const colorPanelRed = {
			'fontWeight' : 'bold',
			'background': 'linear-gradient(90deg, rgba(173,0,0,1) 0%, rgba(255,0,0,1) 100%)',
    }
    const loading = this.state.load.loadForm;

    // const note_revisi = (this.props.verification.has_draft_verification === false && this.props.verification['Kompetensi'].note !== null) ? true !== null : undefined;
    const note_revisi = (this.props.verification.has_draft_verification === false && this.props.verification['Kompetensi'].note !== null) ? (this.props.verification['Kompetensi'].status !== null && this.props.verification['Kompetensi'].status === 'y') ? undefined : true !== null : undefined;
    
    return (
      <div>
        <div className="row">
          <div className={"col-md-12"}>
            <div id="accordion" className="accordion">
              {this.state.collapse.map((value, i) => (
                <Card className="bg-white text-black" key={i}>
                  <CardHeader
                    style={(this.state.isVendor && this.props.verification.has_draft_verification !== undefined && this.props.verification.has_draft_verification === false && this.props.verification[value.alias] !== undefined && this.props.verification[value.alias]).status==="n" ? colorPanelRed : colorPanelBlack }
                    className={
                      "card-header bg-dark-darker text-white pointer-cursor " +
                      (!value.collapse ? "collapsed " : "")
                    }
                    onClick={() => this.toggleCollapse(value.id)}
                  >
                    <i className="fa fa-circle f-s-8 mr-2 text-white-lighter"></i> Kompetensi
                    {this.state.isVendor ?
                      <div style={{color:"yellow", fontWeight:"bold", float:"right"}}>({camelCase(this.props?.verification[value.alias]?.tipe_verifikasi?.[0])})</div>
                      :<div style={{color:"yellow", fontWeight:"bold", float:"right"}}>({statusKonfirmasiVerifikator(this.props?.verification?.status_vendor,this.props?.verification[value.alias])})</div>
                    }
                  </CardHeader>
                  <Collapse isOpen={value.collapse}>
                    <CardBody>
                      <div className="col-md-12">
                      {loading && <center><br/><ReactLoading type="cylon" color="#0f9e3e" /><br/></center>}
                      {!loading && this.state.isVendor && note_revisi !== undefined && <p className="text-danger"> <b> {t("profileVendor:catatan-revisi")} </b> {this.props.verification['Kompetensi'].note} </p>}
                      {!loading && this.props.isRequestor &&
                        <FormKompetensi
                          t={this.props.t}
                          loadings={this.state.loadings}
                          upload={this.props.fileUpload}
                          data={this.state.sendData}
                          getSubBidangUsaha={(payload) => this.getSubBidangUsaha(payload)}
                          optionsTipeRekanan={this.state.tipeRekanan}
                          optionsBidangUsaha={this.state.bidangUsaha}
                          optionsSubBidangUsaha={this.state.subBidangUsaha}
                          optionsMerk={this.state.merks}
                          save={this.savePayload}
                          update={this.updatePayload}
                          loadingSubmit={this.state.loadingSubmit}
                          uuid= {this.state.uuid}
                          errors= {this.state.errors}
                          cancelBtn={this.cancelBtn}
                          isVendor={this.state.isVendor}
                          saveItems={(payload) => this.saveItems(payload)}
                          has_draft_verification={this.props.verification.has_draft_verification} has_verification={this.props.verification} parentState={this.state}
                          inputValue={this.state.inputValue}
                        />
                      }
                      </div>
                      {this.props.isRequestor && <div className="col-md-12">
                        {!loading && <TableKompetensi parentState={this.state} t={this.props.t} deletePayload={this.deletePayload} />}
                      </div>}
                      {!this.props.isRequestor && <div className="col-md-12">
                        {!loading && <ReactTableFixedColumns
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
                        />}
                      </div>}
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
		vendor: state.vendorProfile.vendor,
		user: state.auth.user.data,
    getId: state.vendorProfile,
    verification: state.verification.verification
  }
}

const dispatchToProps = dispatch => {
  return {
    fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
    fetchBidangUsaha: (params) => dispatch(fetchBidangUsaha(params)),
    fetchSubBidangUsaha: (params) => dispatch(fetchSubBidangUsaha(params)),
    fetchTipeRekanan: (params) => dispatch(fetchTipeRekanan(params)),
    fetchKompetensi: (vendor_uuid, params) => dispatch(fetchKompetensi(vendor_uuid, params)),
  }
}
export default connect(stateToProps, dispatchToProps)(withTranslation()(Kompetensi));

