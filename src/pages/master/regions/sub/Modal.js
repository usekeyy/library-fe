import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import { Modal, ModalHeader } from 'reactstrap';
import RouteForm from './Form';
import ReactLoading from 'react-loading';
import { withTranslation } from 'react-i18next';

class ModalForm extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
  }
  state = {
    sendData: {
      id: '',
      code: '',
      name: '',
      country_id: ''
    },
    countries: [],
    loading: false
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.getCountries()
      console.log('ppppp')
      if (this.props.uuid !== "") {
        this.getUUID()
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

  toggleClose = () => {
    this._isMounted = false;
    this.props.toggleClose()
  }

  getUUID() {
    this.setState({ loading: true })
    this.props.showRegions(this.props.uuid)
      .then((resp) => {
        let data = resp.data.data;
        let sendData = { ...this.state.sendData }
        sendData.id = data.id;
        sendData.name = data.name;
        sendData.code = data.code;
        sendData.country_id = { value: data.country_id, label: data.country_name };
        this.setState({ sendData })
        this.setState({ loading: false })
      })
      .catch((resp) => {
        this.setState({ loading: false })
        toastr.error(resp.data.message);
      });
  }


  getCountries = (newValue) => {
    if(newValue===undefined || newValue!==''){
    let select_params = (newValue !== '') ? { start: 0, length: 10, select: newValue } : { start: 0, length: 10 };
    this.props.fetchCountries(select_params)
      .then((resp) => {
        let data = resp.data.data;
        let options = data.map((data) => {
          return { value: data.id, label: data.id + ' - ' + data.name };
        })
        this.setState({ countries: options })
      })
      .catch((resp) => {
        toastr.error(resp.data.message);
      });
    }
  }

  handleSave = (payload) => {
    if (this.props.uuid === "") {
      this.props.save(payload);
    } else {
      this.props.update(this.props.uuid, payload);
    }
  }

  render() {
    const {t} = this.props;
    return (
      <div>
        <Modal isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()}>
          <ModalHeader toggle={() => this.toggleClose()}>{this.props.uuid !== "" ? t("region:modal.title-update") : t("region:modal.title-create") }</ModalHeader>
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
              data={this.state.sendData}
              uuid={this.props.uuid}
              countries={this.state.countries}
              loading={false}
              handleInputChange={this.getCountries}
            />
          )}
        </Modal>
      </div>
    );
  }
}

export default withTranslation() (ModalForm);