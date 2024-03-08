import React, { Component } from 'react'
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { toastr } from 'react-redux-toastr';
import 'react-table/react-table.css';
import { Button, Row } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';

import {showDetailPerformanceReport,downloadVPR} from '../../../../store/actions/vendor/performanceReportActions';

class ModalForm extends Component {
  constructor(props) {
    console.log(props.tes)
    super(props);
    this._isMounted = false;
    this.state = {
      dataTabel : [],
      loading: false,
      loadingSubmit: false,
      loadingDownload: false,
      isConfirm: false,
      totalNilai: 0,
      headerData: {},
    };

    this.columns = [
        {
            Header: () => this.props.t("performanceReport:detail-nilai.label.nomor"),
            id: "nomor",
            accessor: d => d.nomor,
            filterable: false,
            Cell : row => (
              <div>
                  <center>{row.value}</center>
              </div>
            ),
            sortable: false,

        },
        {
            Header: () => this.props.t("performanceReport:detail-nilai.label.item-penilaian"),
            id: "item_penilaian",
            filterable: false,
            sortable: false,
            accessor: d => (
                <div style={{textAlign:"center"}}>{d.item_penilaian}</div>),

        },
        {
            Header: () => this.props.t("performanceReport:detail-nilai.label.nilai-vpr-sap"),
            id: "nilai_vpr",
            filterable: false,
            sortable: false,
            accessor: d => (
                <div style={{textAlign:"center"}}>{d.nilai_vpr}</div>),

        },
        {
            Header: () => this.props.t("performanceReport:detail-nilai.label.bobot"),
            id: "bobot",
            filterable: false,
            sortable: false,
            accessor: d => (
                <div style={{textAlign:"center"}}>{d.bobot}%</div>),

        },
        {
          Header: () => this.props.t("performanceReport:detail-nilai.label.jumlah-po"),
          id: "jumlah_po",
          filterable: false,
          sortable: false,
          accessor: d => (
              d.jumlah_po !== 0 && <div style={{textAlign:"center"}}>{d.jumlah_po}</div>),

      },
        {
            Header: () => this.props.t("performanceReport:detail-nilai.label.bobot-qs"),
            id: "bobot_qs",
            filterable: false,
            sortable: false,
            accessor: d => (
                d.bobot_qs !== null && <div style={{textAlign:"center"}}>{d.bobot_qs}%</div>),
            Footer: columnProps => {
              return(
                <center>
                  <span>
                    <b>Total Nilai</b>
                  </span>
                </center>
              )
            }

        },
        {
            Header: () => this.props.t("performanceReport:detail-nilai.label.konversi-nilai"),
            id: "konversi",
            filterable: false,
            sortable: false,
            accessor: d => (
                <div style={{textAlign:"center"}}>{d.konversi}</div>),
            Footer: columnProps => {
              return(
                <center>
                  <span>
                    <b>{this.state.headerData.total}</b>
                  </span>
                </center>
              )
            }

        },
    ]
  }

  componentDidMount() {
    console.log(this.props.match.params.id)
    this._isMounted = true;
    if (this.props.match.params.id !== "" || this.props.match.params.id !== undefined) {
      this.getUUID();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
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
      this.props.showDetailPerformanceReport(this.props.match.params.id)
        .then((resp) => {
          let dataPlusNomor = resp.data.data.item;
          let sortData = dataPlusNomor.map((item)=> {
              return {...item, nomor : this.sortableData(item.item_penilaian)}
          })
          let filterData = sortData.filter((item)=>{
            return item.item_penilaian !== "Total"
          })
          this.setState({ headerData : resp.data.data.header, dataTabel: filterData, loading: false });
        })
        .catch((resp) => {
          this.setState({ loading: false });
          toastr.error(resp.data.message);;
        });
    }
  }

  downloadVPR = (e) => {
		e.preventDefault();
		this.setState(() => ({loadingDownload : true}));
		this.props.downloadVPR(this.props.match.params.id)
		.then((resp) => {
      this.setState(() => ({loadingDownload : false}));
			const url = window.URL.createObjectURL(new Blob([resp.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', `VPR_${this.state.headerData.vendor}.pdf`); //or any other extension
			document.body.appendChild(link);
			link.click();
		})
		.catch((resp) => {
      this.setState(() => ({loadingDownload : false}));
			toastr.error("Failed Download VPR");
			// this.setState({loading: false});
		});
	}

  render() {
    // const { t } = this.props;
    return (
      <div>
              <ol className="breadcrumb float-xl-right">
                  <li className="breadcrumb-item">Home</li>
                  <li className="breadcrumb-item">Vendor Management</li>
                  <li className="breadcrumb-item">Performance Report</li>
                  <li className="breadcrumb-item active">Detail</li>
              </ol>
              <h1 className="page-header">Detail Performance Report</h1>
              <Panel loading={false}>
                  <PanelHeader>Detail Performance Report</PanelHeader>
                  <PanelBody loading={false}>                     
                      <div style={{fontSize:"15px", padding:"20px"}}>
                        <Row>
                          <div className="col-sm-10">
                            <table>
                              <thead>
                                <tr>
                                    <td>{this.props.t("performanceReport:label.nama-vendor")}</td>
                                    <td style={{padding:"10px"}}>:</td>
                                    <td>{this.state.headerData.vendor}</td>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                    <td>Purchasing Organization</td>
                                    <td style={{padding:"10px"}}>:</td>
                                    <td>{this.state.headerData.pur_org}</td>
                                </tr>
                                <tr>
                                    <td>{this.props.t("performanceReport:label.total-nilai")}</td>
                                    <td style={{padding:"10px"}}>:</td>
                                    <td>{this.state.headerData.total}</td>
                                </tr>
                                <tr>
                                    <td>{this.props.t("performanceReport:label.ranking")}</td>
                                    <td style={{padding:"10px"}}>:</td>
                                    <td>{this.state.headerData.ranking}</td>
                                    {/* <td>{this.props.match.params.ranking}</td> */}
                                    
                                </tr>
                                <tr>
                                  <td>{this.props.t("performanceReport:label.kelompok")}</td>
                                    <td style={{padding:"10px"}}>:</td>
                                    <td style={{backgroundColor:this.state.headerData.kelompok_color, textAlign: "center"}}>{this.state.headerData.kelompok_name}</td>
                                </tr>
                                <tr>
                                    <td>{this.props.t("performanceReport:label.status")}</td>
                                    <td style={{padding:"10px"}}>:</td>
                                    <td>{this.state.headerData.status_name}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="col-sm-2">
                            <Button color="primary" size="sm" onClick={(e) => this.downloadVPR(e)} disabled={this.state.loadingDownload}>
                              {this.state.loadingDownload ? <i className="fas fa-spinner fa-pulse"></i> : "Download PDF"}
                              </Button>
                          </div>
                        </Row>
                        <br></br>
                        
                      
                      
                        <ReactTable
                            columns = {this.columns}
                            data = {this.state.dataTabel}
                            showPagination = {false}
                            defaultPageSize = {6}
                            className="-highlight"
                            defaultSorted={[
                              {
                                id: "nomor",
                              }
                            ]}
                        />
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
      showDetailPerformanceReport: (id) => dispatch(showDetailPerformanceReport(id)),
      downloadVPR : (uuid) => dispatch(downloadVPR(uuid))
      // syncVpr: (payload) => dispatch(syncVpr(payload)),
}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (ModalForm));

// export default withTranslation()(ModalForm);
