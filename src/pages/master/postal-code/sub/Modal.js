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
        district_id :'',
        sub_district_id :''
      },
      loadings: {
        country: false,
        region: false,
        district : false,
        sub_district : false
      },
      isDisabled: {
        country: false,
        region: true,
        district : true,
      },
      countries: [],
      regions: [],
      districts: [],
      sub_districts:[],
      error: false,
      loading: false,
      load: {
        loadingRegions: false,
        loadingCountries: false,
        loadingDistrict:false,
        loadingSubDistrict : false
      },
      loadingSubmit:false
    };
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      if (this.props.uuid !== "") {
        this.getUUID();
        this.getSubDistrict(this.state.countries);
      }
      // else{
      //   this.getCountries();
      // }
      this.getCountries();
      // this.getSubDistrict();
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
        .showPostalCode(this.props.uuid)
        .then((resp) => {
          let data = resp.data.data;
          let sendData = { ...this.state.sendData };
          sendData.id = data.id;
          sendData.name = data.name;
          sendData.country_id = {
            value: data.country_id,
            label: data.country_id +' - '+ data.country_name,
          };
          sendData.sub_district_id = {
            value: data.sub_district_id,
            label: data.sub_district_id +' - '+ data.sub_districts_name,
          };
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

  getSubDistrict = (newValue,type,options) => {
    if (newValue !== "") {
      // console.log("if")
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, sub_district: true },
      }));
      let select_params = {start : 0, length : 30}
      if (type === "inputChange"){
        let getCountryName = newValue?.label.split(" ")
        select_params = {start : 0, length : 30, name : options, country_name:getCountryName[2]};
      }else if(type === "onChange"){
        let getCountryName = newValue.label.split(" ")
        select_params = {start : 0, length : 30, country_name:getCountryName[2]};
      }
      this.props
        .fetchSubDistricts(select_params)
        .then((resp) => {
          let data = resp.data.data;
          let options = data.map((data) => {
            return { value: data.id, label: data.id +' - '+ data.name };
          });
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, sub_district: false },
            sub_districts: options,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, sub_district: false },
          }));
          toastr.error(resp.data.message);;
        });
    }
  };

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
    const {t} = this.props;
    return (
      <div>
        <Modal isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()}>
          <ModalHeader toggle={() => this.toggleClose()}>
          {this.props.uuid !== "" ? t("postalCode:modal.title-update") : t("postalCode:modal.title-create") }
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
              sub_districts={this.state.sub_districts}
              loadingSubmit={this.props.loadingSubmit}
              getSubDistrict={this.getSubDistrict}
              load={this.state.load}
            />
          )}
        </Modal>
      </div>
    );
  }
}

export default withTranslation() (ModalForm);
