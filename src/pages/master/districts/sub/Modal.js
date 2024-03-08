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
        region_id: "",
        country_id: "",
      },
      loadings: {
        country: false,
        region: false,
      },
      isDisabled: {
        country: false,
        region: true,
      },
      countries: [],
      regions: [],
      errors: {},
      error: false,
      loading: false,
      load: {
        loadingRegions: false,
        loadingCountries: false,
      },
      loadingSubmit:false
    };
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.getCountries();
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
        .showDistricts(this.props.uuid)
        .then((resp) => {
          let data = resp.data.data;
          let sendData = { ...this.state.sendData };
          sendData.id = data.id;
          sendData.name = data.name;
          sendData.country_id = {
            value: data.country_id,
            label: data.country_id +' - '+ data.country_name,
          };
          sendData.region_id = {
            value: data.region_id,
            label: data.region_id+' - '+data.region_name,
          };
          this.setState({ sendData, loading: false });
          this.getRegions(data.country_id);
        })
        .catch((resp) => {
          this.setState({ loading: false });
          toastr.error(resp.data.message);;
        });
    }
  }

  getCountries = (newValue) => {
    if (newValue === undefined || newValue !== "") {
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, country: true },
      }));
      let select_params =
        newValue !== ""
          ? { start: 0, length: 10, select: newValue }
          : { start: 0, length: 10 };
      this.props
        .fetchCountries(select_params)
        .then((resp) => {
          let data = resp.data.data;
          let options = data.map((data) => {
            return { value: data.id, label: data.id +' - '+ data.name };
          });
          this.setState(({ loadings, countries }) => ({
            loadings: { ...loadings, country: false },
            countries: options,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, country: false },
          }));
          toastr.error(resp.data.message);;
        });
    }
  };

  getRegions(payload) {
    if (this._isMounted) {
      this.setState(({ loadings, isDisabled, sendData }) => ({
        loadings: { ...loadings, region: true },
        isDisabled: { ...isDisabled, region: true },
        sendData,
      }));
      var params = {
        country_id: payload,
      };
      this.props
        .fetchRegions(params)
        .then((resp) => {
          let data = resp.data.data;
          let options = data.map((data) => {
            return { value: data.id, label: data.id+' - '+data.name };
          });
          this.setState(({ loadings, isDisabled, regions, sendData }) => ({
            loadings: { ...loadings, region: false },
            isDisabled: { ...isDisabled, region: false },
            regions: options,
            sendData: sendData,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings, isDisabled }) => ({
            loadings: { ...loadings, region: false },
            isDisabled: { ...isDisabled, region: false },
          }));
          toastr.error(resp.data.message);;
        });
    }
  }

  handleSave = (payload) => {
    if (this._isMounted) {
      this.setOption(payload);
      console.log(this.props.uuid !== "");
      if (this.props.uuid !== "") {
        this.props.update(this.props.uuid, this.state.sendData);
      } else {
        this.props.save(this.state.sendData);
      }
    }
  };

  setOption(payload) {
    let sendData = { ...this.state.sendData };
    sendData.id = payload.id;
    sendData.name = payload.name;
    sendData.country_id =
      typeof payload.country_id !== "undefined" ? payload.country_id.value : "";
    sendData.region_id =
      typeof payload.region_id !== "undefined" ? payload.region_id.value : "";
    if (this._isMounted) {
      this.setState({ sendData });
    }
  }

  render() {
    const {t} = this.props;
    return (
      <div>
        <Modal isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()}>
          <ModalHeader toggle={() => this.toggleClose()}>
          {this.props.uuid !== "" ? t("district:modal.title-update") : t("district:modal.title-create") }
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
              loadings={this.state.loadings}
              isDisabled={this.state.isDisabled}
              countries={this.state.countries}
              regions={this.state.regions}
              loadingSubmit={this.props.loadingSubmit}
              load={this.state.load}
              getRegions={(payload) => this.getRegions(payload)}
            />
          )}
        </Modal>
      </div>
    );
  }
}

export default withTranslation() (ModalForm);
