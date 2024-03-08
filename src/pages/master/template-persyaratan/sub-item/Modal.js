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
        // id: '',
        template_persyaratan_id: this.props.template_persyaratan_id,
        description: '',
        status: 'y',
      },
      loading: false,
      loadingSubmit: false
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
    this.props.toggleClose();
  };

  getUUID() {
    if (this._isMounted) {
      this.setState({ loading: true });
      this.props.showTemplatePersyaratanItem(this.props.uuid)
        .then((resp) => {
          let data = resp.data.data;
          let sendData = { ...this.state.sendData };
          // sendData.id = data.id;
          sendData.description = data.description;
         this.setState({ sendData, loading: false });
        })
        .catch((resp) => {
          this.setState({ loading: false });
          toastr.error(resp.data.message);;
        });
    }
  }
  
  setOption(payload){
    let sendData = {...this.state.sendData}
    // sendData.id = payload.id;
    sendData.description = payload.description;
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
            {this.props.uuid !== "" ? t("templatePersyaratan:modal.title-update") : t("templatePersyaratan:modal.title-create")}
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
