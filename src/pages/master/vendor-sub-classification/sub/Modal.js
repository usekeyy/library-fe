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
        id: "",
        vendor_classification_id: "",
        name: "",
      },
      payload: {},
      m_vendor_classification: [],
      errors: {},
      error: false,
      loading: false,
      loadings: {
        vendor_classification: true,
      },
      loadingSubmit: false
    };
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.getVendorClassification()
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
        .showVendorSubClassification(this.props.uuid)
        .then((resp) => {
          let data = resp.data.data;
          let sendData = { ...this.state.sendData };
          sendData.id = data.id;
          sendData.name = data.name;
          sendData.vendor_classification_id = {
            value: data.vendor_classification_id,
            label: data.vendor_classification_id + ' - ' + data.vendor_classification_name,
          }
          this.setState({ sendData, loading: false });
        })
        .catch((resp) => {
          this.setState({ loading: false });
          toastr.error(resp.data.message);;
        });
    }
  }

  getVendorClassification = (newValue) => {
    if (newValue === undefined || newValue !== "") {
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, vendor_classification: true },
      }));
      let select_params = "";
        // newValue !== ""
        //   ? { start: 0, length: 10, select: newValue }
        //   : { start: 0, length: 10 };
      this.props
        .fetchVendorClassification(select_params)
        .then((resp) => {
          let data = resp.data.data;
          // console.log(data);
          let options = data.map((data) => {
            return { value: data.id, label: data.id + ' - ' + data.name };
          });
          this.setState(({ loadings, m_vendor_classification }) => ({
            loadings: { ...loadings, vendor_classification: false },
            m_vendor_classification: options,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, vendor_classification: false },
          }));
          toastr.error(resp.data.message);;
        });
    }
  };
  
  setOption(payload){
    let sendData = {...this.state.sendData}
    sendData.id = payload.id;
    sendData.name = payload.name;
		sendData.vendor_classification_id = payload.vendor_classification_id.value;
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
            {this.props.uuid !== "" ? t("vendorClassification:modal.title-update") : t("vendorClassification:modal.title-create")}
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
              m_vendor_classification={this.state.m_vendor_classification}
              uuid={this.props.uuid}
              loadingSubmit={this.props.loadingSubmit}
              loadings={this.state.loadings}
              load={this.state.load}
            />
          )}
        </Modal>
      </div>
    );
  }
}

export default withTranslation()(ModalForm);
