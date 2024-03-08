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
        district_id: ''
      },
      loadings: {
        country: false,
        region: false,
        district: false,
      },
      isDisabled: {
        country: false,
        region: true,
        district: true,
      },
      countries: [],
      regions: [],
      districts: [],
      errors: {},
      error: false,
      loading: false,
      load: {
        loadingRegions: false,
        loadingCountries: false,
        loadingDistrict: false
      },
      loadingSubmit: false
    };
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      
      if (this.props.uuid !== "") {
        this.getUUID();
      }else{
        this.getCountries();
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
        .showSubDistricts(this.props.uuid)
        .then((resp) => {
          let data = resp.data.data;
          let sendData = { ...this.state.sendData };
          sendData.id = data.id;
          sendData.name = data.name;
          sendData.country_id = {
            value: data.country_id,
            label: data.country_id + ' - ' + data.country_name,
          };
          sendData.region_id = {
            value: data.region_id,
            label: data.region_id + ' - ' + data.region_name,
          };
          sendData.district_id = {
            value: data.district_id,
            label: data.district_id + ' - ' + data.district_name,
          };
          this.getCountries();
          this.getRegions(data.country_id);
          this.getDistrict(data.region_id);
          this.setState({ sendData, loading: false });
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
      let select_params = "";
        // newValue !== ""
        //   ? { start: 0, length: 10, select: newValue }
        //   : { start: 0, length: 10 };
      this.props
        .fetchCountries(select_params)
        .then((resp) => {
          let data = resp.data.data;
          let options = data.map((data) => {
            return { value: data.id, label: data.id + ' - ' + data.name };
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
            return { value: data.id, label: data.id + ' - ' + data.name };
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

  getDistrict(payload) {
    if (this._isMounted) {
      this.setState(({ loadings, isDisabled, sendData }) => ({
        loadings: { ...loadings, district: true },
        isDisabled: { ...isDisabled, district: true },
        sendData,
      }));
      var params = {
        region_id: payload,
      };
      this.props
        .fetchDistricts(params)
        .then((resp) => {
          let data = resp.data.data;
          let options = data.map((data) => {
            return { value: data.id, label: data.id + ' - ' + data.name };
          });
          this.setState(({ loadings, isDisabled, districts, sendData }) => ({
            loadings: { ...loadings, district: false },
            isDisabled: { ...isDisabled, district: false },
            districts: options,
            sendData: sendData,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings, isDisabled }) => ({
            loadings: { ...loadings, district: false },
            isDisabled: { ...isDisabled, district: false },
          }));
          toastr.error(resp.data.message);;
        });
    }
  }

  handleSave = (payload) => {
    if (this._isMounted) {
      console.log(this.props.uuid !== "");
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
            {this.props.uuid !== "" ? t("subDistrict:modal.title-update") : t("subDistrict:modal.title-create")}
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
              districts={this.state.districts}
              loadingSubmit={this.props.loadingSubmit}
              load={this.state.load}
              getCountries={(payload) => this.getCountries(payload)}
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
