import React, { Component } from 'react'
import { connect } from 'react-redux';
// import ReactTable from 'react-table';
import { toastr } from 'react-redux-toastr';
import 'react-table/react-table.css';
// import { Button, Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';
import ReactLoading from 'react-loading';
import Form from './FormDetailPunishment'

import {showDetailPerformanceReport} from '../../../../store/actions/vendor/performanceReportActions';
import {showPunishmentVendor} from '../../../../store/actions/vendor/punishmentVendorActions';

class DetailPunhisment extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      sendData: {
        vendor_id: '',
        vendor_name: '',
        vendor_sap_code: '',
        vendor_npwp: '',
        punishment_type: '',
        suspend_type: '',
        start_date: '',
        end_date: '',
        reason_note: '',
        file: '',
        purchasing_org_suspend: '',
        verification_note: '',
        status: '',
      },
      dataHeader : '',
      loading: false,
      loadingSubmit: false,
      isConfirm: false
    };
  }

  componentDidMount() {
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

  getUUID() {
    if (this._isMounted) {
      this.setState({ loading: true });
      this.props.showDetailPerformanceReport(this.props.match.params.id_vendor)
        .then((resp) => {
          let {data} = resp.data;
          this.setState({dataHeader : data.header})
        })
        .catch((resp)=> {
          this.setState({ loading: false });
          toastr.error(resp.data.status, resp.data.message);
        })
      this.props.showPunishmentVendor(this.props.match.params.id)
        .then((resp) => {
          let data = resp.data.data;
          let sendData = { ...this.state.sendData };
          sendData.vendor_id = data.vendor_id;
          sendData.vendor_name = data.vendor_name;
          sendData.vendor_sap_code = data.vendor_sap_code;
          sendData.vendor_npwp = data.vendor_npwp;
          sendData.vendor_name = data.vendor_name;
          sendData.punishment_type = data.punishment_type;
          if(sendData.punishment_type === 'Suspend'){
            sendData.suspend_type = data.suspend_type; 
          }
          sendData.start_date = data.start_date;
          sendData.end_date = data.end_date;
          sendData.reason_note = data.reason_note;
          sendData.file = data.file;
          sendData.verification_note = data.verification_note;
          sendData.purchasing_org_suspend = data.purchasing_org_suspend;

          this.setState({ sendData, loading: false });
        })
        .catch((resp) => {
          this.setState({ loading: false });
          toastr.error(resp.data.message);;
        });
    }
  }

  render() {
    // const { t } = this.props;
    return (
      <div>
        <ol className="breadcrumb float-xl-right">
            <li className="breadcrumb-item">Home</li>
            <li className="breadcrumb-item">Vendor Management</li>
            <li className="breadcrumb-item">Performance Report</li>
            <li className="breadcrumb-item active">Detail Punishment</li>
        </ol>
        <h1 className="page-header">Detail Punishment</h1>
        <Panel loading={false}>
        <PanelHeader>Detail Punishment</PanelHeader>
        <PanelBody loading={false}>  
          {(this.state.loading) && ( <center> <br/> <ReactLoading type="cylon" color="#0f9e3e" /> <br/> </center> )}
          {!this.state.loading &&
            <div style={{fontSize:"15px"}}>
              <table>
                <thead>
                  <tr>
                      <td>{this.props.t("performanceReport:label.nomor-pendaftaran")}</td>
                      <td style={{padding:"10px"}}>:</td>
                      <td>{this.state.dataHeader.sap_code}</td>
                  </tr>
                </thead>
                <tbody>

                  <tr>
                      <td>{this.props.t("performanceReport:label.nama-vendor")}</td>
                      <td style={{padding:"10px"}}>:</td>
                      <td>{this.state.dataHeader.vendor_name}</td>
                  </tr>
                  <tr>
                      <td>Purchasing Organization</td>
                      <td style={{padding:"10px"}}>:</td>
                      <td>{this.state.dataHeader.purchasing_org_name}</td>
                  </tr>
                  <tr>
                      <td>{this.props.t("performanceReport:label.total-nilai")}</td>
                      <td style={{padding:"10px"}}>:</td>
                      <td>{this.state.dataHeader.total}</td>
                  </tr>
                  <tr>
                      <td>{this.props.t("performanceReport:label.ranking")}</td>
                      <td style={{padding:"10px"}}>:</td>
                      <td>{this.state.dataHeader.ranking}</td>
                  </tr>
                  <tr>
                      <td>{this.props.t("performanceReport:label.kelompok")}</td>
                      <td style={{padding:"10px"}}>:</td>
                      <td style={{backgroundColor:this.state.dataHeader.color, textAlign: "center"}}>{this.state.dataHeader.kelompok}</td>
                  </tr>
                  <tr>
                      <td>{this.props.t("performanceReport:label.status")}</td>
                      <td style={{padding:"10px"}}>:</td>
                      <td>{this.state.dataHeader.status_name}</td>
                  </tr>
                </tbody>
              </table>
              <br></br>
              <Form
                toggleClose={this.toggleClose}
                data={this.state.sendData}
                load={this.state.load}
                loadingSubmit={this.props.loadingSubmit}
              />
            </div>
          }
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
      showPunishmentVendor: (id) => dispatch(showPunishmentVendor(id)),
      showDetailPerformanceReport: (id) => dispatch(showDetailPerformanceReport(id)),
      // syncVpr: (payload) => dispatch(syncVpr(payload)),
}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (DetailPunhisment));
