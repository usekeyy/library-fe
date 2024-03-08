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
        required: "",
        country_id: "",
        length:""

      },
      loadings: {
        country: false,
      },
      isDisabled: {
        country: false,
      },
      countries: [],
      error: false,
      loading: false,
      load: {
        loadingCountries: false,
      },
      loadingSubmit:false
    };
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      if (this.props.uuid !== "") {
        this.getUUID();
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
        .showPostalCodeMapping(this.props.uuid)
        .then((resp) => {
          let data = resp.data.data;
          let sendData = { ...this.state.sendData };
          sendData.id = data.id;
          sendData.length = data.length;
          sendData.country_id = {
            value: data.country_id,
            label: data.country_id +' - '+ data.country_name,
          };
          sendData.required = {
            value: data.required,
            label: data.required +' - '+ (data.required === "y"? "Ya" : "Tidak"),
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
    // const {t} = this.props;
    return (
      <div>
        <Modal isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()}>
          <ModalHeader toggle={() => this.toggleClose()}>
          {this.props.uuid !== "" ? "Update Mapping Postal Code" : "Create Mapping Postal Code" }
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
              loadingSubmit={this.props.loadingSubmit}
              load={this.state.load}
            />
          )}
        </Modal>
      </div>
    );
  }
}

export default withTranslation() (ModalForm);
