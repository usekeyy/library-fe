import React, { Component } from "react";
import { toastr } from "react-redux-toastr";
import Form from "./Form";
import FormDetail from "./FormDetail";
import ReactLoading from "react-loading";
import { withTranslation } from 'react-i18next';

class ModalForm extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      sendData: {
        vendor_id: '',
        punishment_type: '',
        suspend_type: '',
        start_date: '',
        end_date: '',
        reason_note: '',
        verification_note: '',
        file: '',
        status: 's',
      },
      status_punishment: '',
      option_suspend: [
        {
            label: 'Lokal',
            value: 'Lokal',
        },
        {
            label: 'All Company',
            value: 'All Company',
        },
      ],
      option_punishment: [
        {
            label: 'Suspend',
            value: 'Suspend',
        },
        {
            label: 'Blacklist',
            value: 'Blacklist',
        },
      ],
      loadings: {
        vendor: true,
      },
      detail_vendor: [{
          id: '',
          sap_code: '',
          npwp_nomor: '',
      }],
      m_vendor: [],
      loading: false,
      loadingSubmit: false
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.getVendor()
    if (this.props.uuid !== "") {
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

  getVendor = (newValue) => {
    if (newValue === undefined || newValue !== "") {
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, vendor: true },
      }));
      let select_params = {vendor_status: 'y'};
      this.props.fetchDataVendor(select_params)
        .then((resp) => {
          let data = resp.data.data;
          let options = data.map((data) => {
            return { value: data.vendor_id, label: data.vendor_id + ' - ' + data.vendor_name };
          });
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, vendor: false },
            m_vendor: options,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, vendor: false },
          }));
          toastr.error(resp.data.message);;
        });
    }
  };
  
  getDetailVendor = (payload) => {
    this.props.fetchDataVendor({vendor_id: payload, vendor_status: 'y'})
    .then((resp) => {
      let data = resp.data.data[0];
      this.setState(({ detail_vendor }) => ({
        detail_vendor: { ...detail_vendor, 
          id: data?.vendor_id, 
          name: data?.vendor_name, 
          sap_code: data?.vendor_sap_code, 
          npwp_nomor: data?.vendor_npwp },
      }));
    })
    .catch((resp) => {
      toastr.error(resp.data.message);;
    });
  }

  getDetailVendorPunish = (payload) => {
    this.props.fetchPunishmentVendor({vendor_id: payload, vendor_status: 'y'})
    .then((resp) => {
      let data = resp.data.data[0];
      this.setState(({ detail_vendor }) => ({
        detail_vendor: { ...detail_vendor, 
          id: data?.vendor_id, 
          name: data?.vendor_name, 
          sap_code: data?.vendor_sap_code, 
          npwp_nomor: data?.vendor_npwp },
      }));
    })
    .catch((resp) => {
      toastr.error(resp.data.message);;
    });
  }
  
  setStatusPunishment = (payload) => {
    this.setState({ status_punishment: payload })
  }
  
  setOption(payload){
    let sendData = {...this.state.sendData}

    sendData.vendor_id = payload.vendor_id.value;
    sendData.punishment_type = payload.punishment_type.value;
    if(payload.punishment_type.value === 'Suspend'){
        sendData.suspend_type = payload.suspend_type.value;
    }
    sendData.start_date = payload.start_date;
    sendData.end_date = payload.end_date;
    sendData.reason_note = payload.reason_note;
    sendData.file = payload.file_name;

    if(this._isMounted){
      this.setState({sendData})
    }
  }

  handleSave = (payload) => {
    this.setOption(payload);
      if (this.props.uuid !== "") {
        this.props.update(this.props.uuid, this.state.sendData);
      } else {
        this.props.save(this.state.sendData);
      }
  };

  getUUID() {
    if (this._isMounted) {
      this.setState({ loading: true });
      this.props.showPunishmentVendor(this.props.uuid)
        .then((resp) => {
          let data = resp.data.data;
          let sendData = { ...this.state.sendData };
          sendData.vendor_id = {
            value: data.vendor_id,
            label: data.vendor_id + ' - ' + data.vendor_name,
          };
          sendData.punishment_type = {
            value: data.punishment_type,
            label: data.punishment_type,
          };
          if(data.punishment_type === 'Suspend'){
            this.setStatusPunishment(data.punishment_type);
            if(data.suspend_type !== null){
              sendData.suspend_type = {
                value: data.suspend_type,
                label: data.suspend_type,
              };
            }
          }
          sendData.start_date = data.start_date;
          sendData.end_date = data.end_date;
          sendData.reason_note = data.reason_note;
          sendData.file = data.file;
          sendData.verification_note = data.verification_note;
          sendData.status = 'u';
          sendData.id = data.vendor_id;
          // sendData.sap_code = data.vendor_sap_code;
          // sendData.npwp_nomor = data.vendor_npwp;
          // sendData.name = data.vendor_name;
          // this.getVendor();
          this.getDetailVendorPunish(data.vendor_id);
          this.setState({ sendData, loading: false });
        })
        .catch((resp) => {
          this.setState({ loading: false });
          toastr.error(resp.data.message);;
        });
    }
  }

  render() {
    const { t } = this.props;
    return (
      <div>
				{(this.state.loading) && ( <center> <br/> <ReactLoading type="cylon" color="#0f9e3e" /> <br/> </center> )}
				{!this.state.loading &&
          <div>
            <h4><b>
              {this.props.toggleDetail ? t("punishmentVendor:title.punishment_vendor_ajuan_detail") :
                this.props.uuid !== "" ? t("punishmentVendor:modal.title-update") : t("punishmentVendor:modal.title-create") } {t("punishmentVendor:label.punishment_vendor_ajuan")}
            </b></h4>
            <br></br>
            {!this.props.toggleDetail ?
              <Form
                toggleDetail={this.props.toggleDetail}
                toggleClose={this.toggleClose}
                upload={this.props.upload}
                save={this.handleSave}
                errors={this.props.errors}
                data={this.state.sendData}
                uuid={this.props.uuid}
                m_vendor={this.state.m_vendor}
                option_punishment={this.state.option_punishment}
                option_suspend={this.state.option_suspend}
                getDetailVendor={this.getDetailVendor}
                detail_vendor={this.state.detail_vendor}
                setStatusPunishment={this.setStatusPunishment}
                status_punishment={this.state.status_punishment}
                loadings={this.state.loadings}
                load={this.state.load}
                loadingSubmit={this.props.loadingSubmit}
              /> : 
              <FormDetail
                toggleDetail={this.props.toggleDetail}
                toggleClose={this.toggleClose}
                data={this.state.sendData}
                uuid={this.props.uuid}
                getDetailVendor={this.getDetailVendor}
                detail_vendor={this.state.detail_vendor}
                loadings={this.state.loadings}
                load={this.state.load}
                loadingSubmit={this.props.loadingSubmit}
              />
            }
          </div>}
      </div>
    );
  }
}

export default withTranslation()(ModalForm);
