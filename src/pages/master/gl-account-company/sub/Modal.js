import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import { Modal, ModalHeader } from 'reactstrap';
import RouteForm from './Form';
import ReactLoading from 'react-loading';
import { withTranslation } from 'react-i18next';

class ModalForm extends Component {
  // constructor(props) {
  //   super(props);
  // }
  state = {
    sendData: {
      gl_account_id:'',
      currency_id:'',
      company_id:'',
    },
    loading: false

  }

  componentDidMount() {
    if (this.props.uuid !== "") {
      this.getUUID()
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }

  toggleClose = () => {
    this.props.toggleClose()
  }

  getUUID() {
    this.setState({ loading: true })
    this.props.showGlAccountCompany(this.props.uuid)
      .then((resp) => {
        let data = resp.data.data;
        let sendData = { ...this.state.sendData }
        sendData.gl_account_id = { value: data.gl_account_id, label: data.gl_account_id + ' - ' + data.gl_account_name };
        sendData.currency_id = { value: data.currency_id, label: data.currency_id + ' - ' + data.currency_name };
        sendData.company_id = { value: data.company_id, label: data.company_id + ' - ' + data.company_name };
        this.setState({ sendData })
        this.setState({ loading: false })
      })
      .catch((resp) => {
        this.setState({ loading: false })
        toastr.error(resp.data.message);
      });
  }



  handleSave = (payload) => {
    if (this.props.uuid === "") {
      this.props.save(payload);
    } else {
      this.props.update(this.props.uuid, payload);
    }
  }

  render() {
    const { t } = this.props;
    return (
      <div>
        <Modal isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()}>
          <ModalHeader toggle={() => this.toggleClose()}>{this.props.uuid !== "" ? t('glAccountCompany:modal.title-update') : t('glAccountCompany:modal.title-create')}</ModalHeader>
          {this.state.loading && (
            <center>
              <br />
              <ReactLoading type="cylon" color="#0f9e3e" />
              <br />
            </center>
          )}
          {this.state.loading === false && (
            <RouteForm
              toggleClose={this.toggleClose}
              save={(payload) => this.handleSave(payload)}
              errors={this.props.errors}
              isError={this.props.isError}
              loadingSubmit={this.props.loadingSubmit}
              optionsGlAccount={this.props.optionsGlAccount}
              optionsCompany={this.props.optionsCompany}
              optionsCurrency={this.props.optionsCurrency}
              data={this.state.sendData}
              uuid={this.props.uuid}
              loading={false}
              loadings={this.props.loadings}
              getGlAccount={(payload) => this.props.getGlAccount(payload)}
              getCompany={(payload) => this.props.getCompany(payload)}
              getCurrency={(payload) => this.props.getCurrency(payload)}
            />
          )}
        </Modal>
      </div>
    );
  }
}

export default withTranslation()(ModalForm);