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
        bidang_usaha_id :""
      },
      errors: {},
      optionBidangUsaha : [],
      error: false,
      loading: false,
      loadingSubmit: false,
      loadings : {
        bidang_usaha_id : false
      },
      isDisabled : {
          bidang_usaha_id : false
      }
    };
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.getBidangUsaha();
      if (this.props.uuid !== "") {
        this.getUUID();
      }
    }
  }

  getBidangUsaha = (newValue) => {
    if (newValue === undefined || newValue !== "") {
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, bidang_usaha_id: true },
      }));
      let select_params = "";
        // newValue !== ""
        //   ? { start: 0, length: 10, select: newValue }
        //   : { start: 0, length: 10 };
      this.props
        .fetchBidangUsaha(select_params)
        .then((resp) => {
          let data = resp.data.data;
          let options = data.map((data) => {
            return { value: data.id, label: data.id + ' - ' + data.name };
          });
          this.setState(({ loadings, countries }) => ({
            loadings: { ...loadings, bidang_usaha_id: false },
            optionBidangUsaha: options,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, bidang_usaha_id: false },
          }));
          toastr.error(resp.data.message);;
        });
    }
  };

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
        .showSubBidangUsaha(this.props.uuid)
        .then((resp) => {
          let data = resp.data.data;
          let sendData = { ...this.state.sendData };
          sendData.id = data.id;
          sendData.name = data.name;
          sendData.bidang_usaha_id = { value: data.bidang_usaha_id, label: data.bidang_usaha_id +' - '+data.bidang_usaha_name };
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
              loadings={this.state.loadings}
              isDisabled={this.state.isDisabled}
              uuid={this.props.uuid}
              optionBidangUsaha = {this.state.optionBidangUsaha}
              loadingSubmit={this.props.loadingSubmit}
              getRegions={(payload) => this.getRegions(payload)}
              getDistrict={(payload) => this.getDistrict(payload)}
            />
          )}
        </Modal>
      </div>
    );
  }
}

export default withTranslation()(ModalForm);
