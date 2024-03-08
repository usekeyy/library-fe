import React, { Component } from "react";
import { toastr } from "react-redux-toastr";
import { Modal, ModalHeader } from "reactstrap";
import RouteForm from "./Form";
import ReactLoading from "react-loading";
import { withTranslation } from 'react-i18next';

class ModalForm extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      sendData: {
        id: '',
        name: '',
        penjualan_min: '',
        penjualan_max: '',
        asset_min: '',
        asset_max: '',
      },
      payload: {},
      errors: {},
      error: false,
      loading: false,
      loadingSubmit: false
    };
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      if (this.props.uuid !== "") {
        this.getUUID();
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
    this.props.toggleClose();
  };

  getUUID() {
    if (this._isMounted) {
      this.setState({ loading: true });
      this.props
        .showBusinessGroup(this.props.uuid)
        .then((resp) => {
          let data = resp.data.data;
          let sendData = { ...this.state.sendData };
          sendData.id = data.id;
          sendData.name = data.name;
          sendData.penjualan_min = data.penjualan_min;
          sendData.penjualan_max = data.penjualan_max;
          sendData.asset_min = data.asset_min;
          sendData.asset_max = data.asset_max;
          this.setState({ sendData, loading: false });
        })
        .catch((resp) => {
          this.setState({ loading: false });
          toastr.error(resp.data.message);
        });
    }
  }
  
  setOption(payload){
    let sendData = {...this.state.sendData}
    sendData.id = payload.id;
    sendData.name = payload.name;
    sendData.penjualan_min = payload.penjualan_min;
    sendData.penjualan_max = payload.penjualan_max;
    sendData.asset_min = payload.asset_min;
    sendData.asset_max = payload.asset_max;
    if(this._isMounted){
      this.setState({sendData})
    }
  }

  handleSave = (payload) => {
    if (this._isMounted) {
      this.setOption(payload);
      if (this.props.uuid !== "") {
        this.props.update(this.props.uuid, this.state.sendData);
      } else {
        this.props.save(this.state.sendData);
      }
    }
  };

  render() {
    const { t } = this.props;
    return (
      <div>
        <Modal isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()}>
          <ModalHeader toggle={() => this.toggleClose()}>
            {this.props.uuid !== "" ? t("businessGroup:modal.title-update") : t("businessGroup:modal.title-create")}
          </ModalHeader>
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
              save={this.handleSave}
              errors={this.props.errors}
              error={this.state.error}
              data={this.state.sendData}
              uuid={this.props.uuid}
              loadingSubmit={this.props.loadingSubmit}
              load={this.state.load}
            />
          )}
        </Modal>
      </div>
    );
  }
}

export default withTranslation()(ModalForm);
