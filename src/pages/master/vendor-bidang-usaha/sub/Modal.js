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
        name: "",
        tipe: "",
        construction : ""
      },
      tipeOptions: [
        { value: "jasa", label: "Jasa" },
        { value: "barang", label: "Barang" },
      ],
      constructionOptions: [
        { value: "y", label: "Ya" },
        { value: "n", label: "Tidak" },
      ],
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
        .showBidangUsaha(this.props.uuid)
        .then((resp) => {
          let data = resp.data.data;
          let sendData = { ...this.state.sendData };
          sendData.id = data.id;
          sendData.name = data.name;
          sendData.tipe = (data.tipe===null || data.tipe==="")? null : data.tipe==="jasa" ? { value: "jasa", label: "Jasa" } : { value: "barang", label: "Barang" };
          sendData.construction = (data.construction===null || data.construction==="")? null : data.construction==="y" ? { value: "y", label: "Ya" } : { value: "n", label: "Tidak" };
          this.setState({ sendData, loading: false });
        })
        .catch((resp) => {
          this.setState({ loading: false });
          toastr.error(resp.data.message);;
        });
    }
  }

  handleSave = (payload) => {
    if (this._isMounted) {
      if (this.props.uuid !== "") {
        this.props.update(this.props.uuid, payload);
      } else {
        this.props.save(payload);
      }
    }
  };

  render() {
    const { t } = this.props;
    return (
      <div>
        <Modal isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()}>
          <ModalHeader toggle={() => this.toggleClose()}>
            {this.props.uuid !== "" ? t("vendorBidangUsaha:modal.title-update") : t("vendorBidangUsaha:modal.title-create")}
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
              tipeOptions={this.state.tipeOptions}
              constructionOptions={this.state.constructionOptions}
            />
          )}
        </Modal>
      </div>
    );
  }
}

export default withTranslation()(ModalForm);
