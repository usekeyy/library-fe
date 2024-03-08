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
        vendor_name: '',
        vendor_sap_code: '',
        vendor_npwp: '',
        punishment_vendor_id: '',
        punishment_vendor_uuid: '',
        punishment_vendor_punishment_type: '',
        punishment_vendor_suspend_type: '',
        punishment_vendor_start_date: '',
        punishment_vendor_end_date: '',
        punishment_vendor_reason_note: '',
        punishment_vendor_verification_note: '',
        punishment_vendor_purchasing_org_suspend: '',
        punishment_vendor_file: '',
        open_date: '',
        reason_note: '',
        verification_note: '',
        file: '',
        status: 's',
      },
      loadings: {
        punishment_vendor_uuid: true,
      },
      m_punishment_vendor_uuid: [],
      loading: false,
      loadingSubmit: false
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.fetchPunishmentVendor()
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

  fetchPunishmentVendor = (newValue) => {
    if (newValue === undefined || newValue !== "") {
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, punishment_vendor_uuid: true },
      }));
      let select_params = {status: 'y', purchasing_org_suspend: this.props.user.company_id};
      this.props.fetchPunishmentVendor(select_params)
        .then((resp) => {
          let data = resp.data.data;
          let options = data.map((data) => {
            return { value: data.uuid, label: data.vendor_id + ' - ' + data.vendor_name };
          });
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, punishment_vendor_uuid: false },
            m_punishment_vendor_uuid: options,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, punishment_vendor_uuid: false },
          }));
          toastr.error(resp.data.message);;
        });
    }
  };
  
  showPunishmentVendor = (id) => {
    this.props.showPunishmentVendor(id)
    .then((resp) => {
      let data = resp.data.data;

      // set state punishment vendor
      let sendData = { ...this.state.sendData };
      sendData.vendor_id = data.vendor_id;
      sendData.vendor_name = data.vendor_name;
      sendData.vendor_sap_code = data.vendor_sap_code;
      sendData.vendor_npwp = data.vendor_npwp;
      sendData.punishment_vendor_id = data.id;
      sendData.punishment_vendor_punishment_type = data.punishment_type;
      sendData.punishment_vendor_suspend_type = data.suspend_type;
      sendData.punishment_vendor_reason_note = data.reason_note;
      sendData.punishment_vendor_start_date = data.start_date;
      sendData.punishment_vendor_end_date = data.end_date;
      sendData.punishment_vendor_verification_note = data.verification_note;
      sendData.punishment_vendor_purchasing_org_suspend = data.purchasing_org_suspend;
      sendData.punishment_vendor_file = data.file;

      this.setState({ sendData });
    })
    .catch((resp) => {
      toastr.error(resp.data.message);;
    });
  }
  
  setOption(payload){
    let sendData = {...this.state.sendData}

    sendData.punishment_vendor_uuid = payload.punishment_vendor_uuid;
    sendData.reason_note = payload.reason_note;
    sendData.open_date = payload.open_date;
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
      this.props.showOpenPunishmentVendor(this.props.uuid)
        .then((resp) => {
          let data = resp.data.data;
          let sendData = { ...this.state.sendData };
          sendData.punishment_vendor_uuid = {
            value: data.punishment_vendor_uuid,
            label: data.vendor_id + ' - ' + data.vendor_name,
          };
          sendData.id = data.id;
          sendData.vendor_id = data.vendor_id;
          sendData.vendor_name = data.vendor_name;
          sendData.vendor_sap_code = data.vendor_sap_code;
          sendData.vendor_npwp = data.vendor_npwp;
          sendData.punishment_vendor_id = data.punishment_vendor_id;
          sendData.punishment_vendor_punishment_type = data.punishment_vendor_punishment_type;
          sendData.punishment_vendor_suspend_type = data.punishment_vendor_suspend_type;
          sendData.punishment_vendor_reason_note = data.punishment_vendor_reason_note;
          sendData.punishment_vendor_start_date = data.punishment_vendor_start_date;
          sendData.punishment_vendor_end_date = data.punishment_vendor_end_date;
          sendData.punishment_vendor_verification_note = data.punishment_vendor_verification_note;
          sendData.punishment_vendor_purchasing_org_suspend = data.punishment_vendor_purchasing_org_suspend;
          sendData.punishment_vendor_file = data.punishment_vendor_file;
          sendData.reason_note = data.reason_note;
          sendData.open_date = data.open_date;
          sendData.file = data.file;
          sendData.status = 'u';

          this.fetchPunishmentVendor();
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
              {this.props.toggleDetail ? t("openPunishmentVendor:label.open_punishment_vendor_detail") :
                this.props.uuid !== "" ? t("openPunishmentVendor:modal.title-update") : t("openPunishmentVendor:modal.title-create") } {t("openPunishmentVendor:label.open_punishment_vendor")}
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
                m_punishment_vendor_uuid={this.state.m_punishment_vendor_uuid}
                fetchPunishmentVendor={this.fetchPunishmentVendor}
                showPunishmentVendor={this.showPunishmentVendor}
                loadings={this.state.loadings}
                load={this.state.load}
                loadingSubmit={this.props.loadingSubmit}
              /> : 
              <FormDetail
                toggleDetail={this.props.toggleDetail}
                toggleClose={this.toggleClose}
                data={this.state.sendData}
                uuid={this.props.uuid}
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
