import React, { Component } from "react";
import { Modal, ModalHeader } from "reactstrap";
import FormNote from "./FormNote";
import ReactLoading from "react-loading";
import { withTranslation } from 'react-i18next';

class ModalForm extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      sendData: {
        account_group: '',
        recont_account: '',
        company_code: '',
        purchasing_org_id: '',
        currency: '',
        term_of_payment: '',
        incoterm_id: '',
        witholding_tax: '',
        status: '',
        note: '',
      },
      options: {},
      errors: {},
      error: false,
      loading: false,
      loadingSubmit: false
    };
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

  toggleClose = () => {
    this.props.toggleClose();
  };

  setOption(payload){
    let sendData = {...this.state.sendData}
    sendData.note = payload.note;
    sendData.status = this.props.approval.status;
    sendData.account_group = (this.props.parentState.account_group !== '') ? this.props.parentState.account_group.value : '';
    sendData.recont_account = (this.props.parentState.recont_account !== '') ? this.props.parentState.recont_account.value : '';
    sendData.company_code = (this.props.parentState.company_code !== '') ? this.props.parentState.company_code.value : '';
    sendData.purchasing_org_id = (this.props.parentState.purchasing_org_id !== '') ? this.props.parentState.purchasing_org_id.value : '';
    sendData.currency = (this.props.parentState.currency !== '') ? this.props.parentState.currency.value : '';
    sendData.term_of_payment = (this.props.parentState.term_of_payment !== '') ? this.props.parentState.term_of_payment.value : '';
    sendData.incoterm_id = (this.props.parentState.incoterm_id !== '') ? this.props.parentState.incoterm_id.value : '';
    sendData.witholding_tax = (this.props.parentState.witholding_tax !== '') ? this.props.parentState.witholding_tax.value : '';
    sendData.search_term = (this.props.parentState.search_terms_id !== '') ? this.props.parentState.search_terms_id.value : '';
    sendData.incoterm_location = (this.props.parentState.incoterm_location !== '') ? this.props.parentState.incoterm_location : '';
    if(this._isMounted){
      this.setState({sendData})
    }
  }
  
  handleSave = (payload) => {
    if (this._isMounted) {
        this.setOption(payload);
        this.props.updatePayload(this.props.uuid, this.state.sendData);
    }
  };

  render() {
    // const { t } = this.props;
    return (
      <div>
        <Modal isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()}>
          <ModalHeader toggle={() => this.toggleClose()}>
            {this.props.approval.name}
          </ModalHeader>
          {this.state.loading && (
            <center>
              <br />
              <ReactLoading type="cylon" color="#0f9e3e" />
              <br />
            </center>
          )}
          {this.state.loading === false && (
            <div>
              <FormNote
                toggleClose={this.toggleClose}
                save={this.handleSave}
                errors={this.props.errors}
                error={this.state.error}
                data={this.state.sendData}
                uuid={this.props.uuid}
                loadingSubmit={this.props.parentState.loadingSubmit}
                load={this.state.load}
                parentState={this.props.parentState}
                t={this.props.t}
                data_vendor={this.props.data_vendor}
                handleChange={this.props.handleChange}
                fetchIncoterms={this.props.fetchIncoterms}
                fetchVendorAccGroup={this.props.fetchVendorAccGroup} 
                fetchGlAccount={this.props.fetchGlAccount}
                fetchCurrencies={this.props.fetchCurrencies}
                fetchSearchTerms={this.props.fetchSearchTerms}
                fetchTermOfPayment={this.props.fetchTermOfPayment}
                approval={this.props.approval}
              />
            </div>
          )}
        </Modal>
      </div>
    );
  }
}

export default withTranslation()(ModalForm);
