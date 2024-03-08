import React, { Component } from 'react'
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { toastr } from 'react-redux-toastr';
import 'react-table/react-table.css';
import { Button, Row } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';

import {showDetailSupplierPerformanceReport,downloadSupplierVPR} from '../../../../store/actions/vendor/performanceReportActions';
import { fetchVprPO } from '../../../../store/actions/master/vprActions';

import ReactTablePagination from '../../../../components/paginations/ReactTablePagination';
import { formatDate } from '../../../../helpers/formatDate';

class DetailSupplierPerformanceReport extends Component {
  constructor(props) {
    console.log(props.tes)
    super(props);
    this._isMounted = false;
    this.state = {
      dataTabel : [],
      dataList : [],
      params: {
        id: '',
        vendor_name: '',
        eproc_number: '',
        tipe : '',
        title : '',
        company_name : '',
        purc_org_name : '',
        purc_group_name : '',
        total : '',
        currency : '',
        status : '',
        created_at: '',
        updated_at: '',
        start: 0,
        length: 0,
        column: '',
        dir: '',
        report : "0"
    },
      defaultPageSize: 10,
      recordsFiltered: 0,
      recordsTotal: 0,
      pages: 0,
      column: 1,
      dir: '',
      page: 0,
      loading: false,
      loadingSubmit: false,
      loadingDownload: false,
      loadingTable: false,
      isConfirm: false,
      totalNilai: 0,
      headerData: {},
    };

    this.defaultSorted = [
        {
            id: "id",
            desc: false
        }
    ];

    this.columns = [
        {
            Header: () => this.props.t("performanceReport:detail-nilai.label.nomor"),
            id: "id",
            accessor: d => d.id,
            filterable: false,
            Cell : row => (
              <div>
                  <center>{this.state.params.start + row.index + 1}</center>
              </div>
            ),
            sortable: false,

        },
        {
            Header: "No PO",
            id: "eproc_number",
            accessor: d => (
                <div style={{textAlign:"center"}}>{d.eproc_number}</div>),

        },
        {
            Header: "Waktu Penilaian",
            id: "tgl_nilai",
            accessor: d => (
                <div style={{textAlign:"center"}}>{formatDate(d.tgl_nilai, 2)}</div>),

        },
        {
          Header: "Total Nilai",
          id: "score",
          accessor: d => (
              <div style={{textAlign:"center"}}>{d.score}</div>),
        },
        {
          Header: () => this.props.t("performanceReport:label.action"),
          filterable: false,
          sortable: false,
          accessor: 'uuid',
          // width : 250,
          Cell: ({ row,original }) => (
              <React.Fragment>
                <center>
                      {/* <button className="btn btn-xs btn-primary" value={row.uuid} onClick={(e) => this.detail(e, row.uuid, row.ranking)} >Detail Performa</button> */}
                      {original.status !== 'Open' && <button className="btn btn-xs btn-success" onClick={(e) => this.toDetailVerifikator(e, row.uuid)} >Detail Performa</button>}
                </center>
              </React.Fragment>
          )
        },
        
    ]
  }

  componentDidMount() {
    // console.log(this.props.match.params.id)
    this._isMounted = true;
    // if (this.props.match.params.id !== "" || this.props.match.params.id !== undefined) {
      // this.getUUID();
    // }
  }

  componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }

  toDetailVerifikator = (e,uuid) => {
      e.preventDefault()
      this.props.history.push({
          pathname: '/vendor/supplier-performance-report/detail/' +this.state.headerData.uuid + '/' + this.state.headerData.purc_org_id + '/' + uuid
      })
      // this.props.history.push('/vendor/approval-penilaian-vendor/' + uuid)
  }

  toggleClose = () => {
    this.props.toggleFormClose();
  };

  sortableData(item_penilaian){
    switch (item_penilaian) {
      case "Aspek Quality":
        return 4
      case "Aspek Delivery":
        return 3
      case "Aspek Respon RFQ":
        return 1
      case "Aspek Service":
        return 5
      case "Aspek Price PO":
        return 2
      case "Aspek Lainnya":
        return 6
      default: break;
    }
  }


  getUUID() {
    if (this._isMounted) {
      this.setState({ loading: true });
      // let total = data.reduce((sum, item) => sum + item.konversi_nilai, 0)
      this.props.showDetailSupplierPerformanceReport(this.props.match.params.id, this.props.match.params.purchorg)
        .then((resp) => {
          let dataPlusNomor = resp.data.data;
          // let sortData = dataPlusNomor.map((item)=> {
          //     return {...item, nomor : this.sortableData(item.item_penilaian)}
          // })
          // let filterData = sortData.filter((item)=>{
          //   return item.item_penilaian != "Total"
          // })
          console.log(resp.data)
          this.setState({ headerData : resp.data.header, dataTabel: dataPlusNomor, loading: false });
        })
        .catch((resp) => {
          this.setState({ loading: false });
          toastr.error(resp.data.message);;
        });
    }
  }
  downloadSupplierVPR = (e) => {
		e.preventDefault();
		this.setState({loadingDownload : true});
		this.props.downloadSupplierVPR(this.props.match.params.id, this.props.match.params.purchorg)
		.then((resp) => {
      this.setState({loadingDownload : false});
			const url = window.URL.createObjectURL(new Blob([resp.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', `SPR_${this.state.headerData.vendor_name}.pdf`); //or any other extension
			document.body.appendChild(link);
			link.click();
		})
		.catch((resp) => {
      this.setState({loadingDownload : false});
			toastr.error("Failed Download VPR");
			// this.setState({loading: false});
		});
	}

  onChanged(event) {
      var someProperty = { ...this.state.params }
      someProperty[event.target.name] = event.target.value
      someProperty.start = 0
      this.setState({
          params: someProperty,
          page: 0
      }, () => { this.req() });
  }

  customs(arr) {
      var state = (arr.pageSize = 0 ? 10 : arr.pageSize);
      var someProperty = { ...this.state }
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
          this.getUUID();
      }
  }

  getCheck = (check) => {
      let filters = { ...this.state.params }
      filters.start = 0;
      if (check.length > 0) {
          filters.status = check.join(";");
          this.setState({ params: filters }, () => this.asyncData())
      } else {
          filters.status = [];
          this.setState({ params: filters }, () => this.asyncData())
      }
  }

  toList = (e) => {
      this.props.history.push('/vendor/supplier-performance-report')
  }

  render() {
    // const { t } = this.props;
    return (
      <div>
              <ol className="breadcrumb float-xl-right">
                  <li className="breadcrumb-item">Home</li>
                  <li className="breadcrumb-item">Vendor Management</li>
                  <li className="breadcrumb-item">Supplier Performance Report</li>
                  <li className="breadcrumb-item active">Detail</li>
              </ol>
              <h1 className="page-header">Detail Supplier Performance Report</h1>
              <Panel loading={false}>
                  <PanelHeader>Detail Supplier Performance Report</PanelHeader>
                  <PanelBody loading={false}>                     
                      <div style={{fontSize:"15px", padding:"20px"}}>
                        <Row>
                          <div className="col-sm-10">
                            <table>
                              <thead>
                                <tr>
                                    <td>{this.props.t("performanceReport:label.nama-vendor")}</td>
                                    <td style={{padding:"10px"}}>:</td>
                                    <td>{this.state.headerData?.vendor_name}</td>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                    <td>No Registrasi</td>
                                    <td style={{padding:"10px"}}>:</td>
                                    <td>{this.state.headerData?.sap_code}</td>
                                </tr>
                                <tr>
                                    <td>Purchasing Organization</td>
                                    <td style={{padding:"10px"}}>:</td>
                                    <td>{this.state.headerData?.purc_org_id + ' - ' + this.state.headerData?.purc_org_name}</td>
                                </tr>
                                <tr>
                                    <td>{this.props.t("performanceReport:label.total-nilai")}</td>
                                    <td style={{padding:"10px"}}>:</td>
                                    <td>{this.state.headerData?.total_nilai}</td>
                                </tr>
                                <tr>
                                    <td>{this.props.t("performanceReport:label.ranking")}</td>
                                    <td style={{padding:"10px"}}>:</td>
                                    <td>{this.state.headerData?.ranking}</td>
                                    {/* <td>{this.props.match.params.ranking}</td> */}
                                    
                                </tr>
                                <tr>
                                  <td>{this.props.t("performanceReport:label.kelompok")}</td>
                                    <td style={{padding:"10px"}}>:</td>
                                    <td style={{backgroundColor:this.state.headerData?.color, textAlign: "center"}}>{this.state.headerData?.kelompok}</td>
                                </tr>
                                {/* <tr>
                                    <td>{this.props.t("performanceReport:label.status")}</td>
                                    <td style={{padding:"10px"}}>:</td>
                                    <td>{this.state.headerData.status_name}</td>
                                </tr> */}
                              </tbody>
                            </table>
                          </div>
                          <div className="col-sm-2">
                            <Button color="primary" size="sm" onClick={(e) => this.downloadSupplierVPR(e)} disabled={this.state.loadingDownload}>
                              {this.state.loadingDownload ? <i className="fas fa-spinner fa-pulse"></i> : "Download PDF"}
                              </Button>
                          </div>
                        </Row>
                        <br></br>
                        
                        <ReactTable
                              filterable loading={this.state.loading}
                              manual
                              minRows={1}
                              data={this.state.dataTabel}
                              PaginationComponent={ReactTablePagination}
                              columns={this.columns}
                              defaultPageSize={this.state.defaultPageSize}
                              defaultSorted={this.defaultSorted}
                              showPagination={true}
                              showPaginationTop={false}
                              showPaginationBottom={true}
                              pageSizeOptions={[10, 20, 25, 50, 100]}
                              className="-highlight"
                              recordsTotal={this.state.recordsTotal}
                              recordsFiltered={this.state.recordsFiltered}
                              onResetFilter={val => this.onResetFilter(val)}
                              options={this.state.params}
                              length={this.state.params.length}
                              start={this.state.params.start}
                              pages={this.state.pages}
                              page={this.state.page}
                              onFetchData={(state, instance) => {
                                  this.req(state);
                              }}
                          />
                          <br></br>
                          {/* <div className="row">
                              <div className="col-sm-12"> */}
                          <div className="pull-right m-t-5 m-b-5 p-">
                              <div>
                                <button className="btn btn-default m-r-5" type="button" onClick={(e) => this.toList(e)}>Kembali</button>  
                              </div>
                          </div>
                              {/* </div>
                          </div> */}
                      </div>
                  </PanelBody>
              </Panel>
          </div>
    );
  }
}

const stateToProps = state => {
  return {
      sidebarDt: state.sidebarDt,
      user: state.auth.user.data,
      access: state.sidebarDt.access
  }
}

const dispatchToProps = dispatch => {
return {
  // fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
  // fetchPeformanceReport: (params) => dispatch(fetchPeformanceReport(params)),
      // showPunishmentVendor: (id) => dispatch(showPunishmentVendor(id)),
      showDetailSupplierPerformanceReport: (id,purch_id) => dispatch(showDetailSupplierPerformanceReport(id,purch_id)),
      downloadSupplierVPR : (uuid,purchorg) => dispatch(downloadSupplierVPR(uuid,purchorg)),
      fetchVprPO: (params) => dispatch(fetchVprPO(params)),
      // syncVpr: (payload) => dispatch(syncVpr(payload)),
}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (DetailSupplierPerformanceReport));

// export default withTranslation()(ModalForm);
