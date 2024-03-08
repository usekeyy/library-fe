import React, { Component } from "react";
import { toastr } from "react-redux-toastr";
import Form from "./Form";
import ReactLoading from "react-loading";
import SweetAlert from 'react-bootstrap-sweetalert';
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
      option_purchasing_org: [],
      loading: false,
      loadingSubmit: false,
      isConfirm: false
    };
  }

  componentDidMount() {
    this._isMounted = true;
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
    
  setOption(payload){
    let sendData = {...this.state.sendData}

    sendData.verification_note = payload.verification_note;
    sendData.purchasing_org_suspend = payload.purchasing_org_suspend.value;

    if(this._isMounted){
      this.setState({sendData})
    }
  }

  setStatus = (payload) => {
    let sendData = {...this.state.sendData}
    sendData.status = payload;
    this.setState({sendData})
  };

	toggleSweetAlert(name) {
		if(this._isMounted){
			switch(name) {
				case 'confirm':
          this.props.update(this.props.uuid, this.state.sendData);
					break;
				case 'cancel':
					this.setState(({ sendData }) => ({
						// sendData: { ...sendData, vendor_id: '', company_id: '' },
						isConfirm: false
					}));
					break;
				default:
					break;
			}
		}
	}

  handleSave = (payload) => {
    this.setOption(payload);
    if (this._isMounted) {
      this.setState({ isConfirm: true})
    }
  };

  getUUID() {
    if (this._isMounted) {
      this.setState({ loading: true });
      this.props.showPunishmentVendor(this.props.uuid)
        .then((resp) => {
          let data = resp.data.data;

          let option_company = [
            {value: 'All', label: 'All'},
            {value: data.created_by_company_id, label: data.created_by_company_id + ' - ' + data.created_by_company_name}    
          ]
          this.setState({ option_purchasing_org:option_company });
          
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
              { t("punishmentVendor:label.verification") + ' ' + t("punishmentVendor:label.punishment_vendor")}
            </b></h4>
            <br></br>
            <Form
              toggleClose={this.toggleClose}
              save={this.handleSave}
              errors={this.props.errors}
              data={this.state.sendData}
              uuid={this.props.uuid}
              m_purchasing_org={this.state.option_purchasing_org}
              setStatus={this.setStatus}
              load={this.state.load}
              loadingSubmit={this.props.loadingSubmit}
            />
            {(this.state.isConfirm &&
              <SweetAlert 
                warning
                showCancel
                confirmBtnText={"Konfirmasi"}
                cancelBtnText={t("common:delete.cancel")}
                confirmBtnBsStyle="primary"
                cancelBtnBsStyle="default"
                title={t("common:delete.title-delete")}
                onConfirm={() => this.toggleSweetAlert('confirm')}
                onCancel={() => this.toggleSweetAlert('cancel')}
              >
              </SweetAlert>
            )}
          </div>
        }
      </div>
    );
  }
}

export default withTranslation()(ModalForm);
