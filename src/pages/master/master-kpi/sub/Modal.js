import React, { Component } from "react";
import { toastr } from "react-redux-toastr";
import { Modal, ModalHeader } from "reactstrap";
import RouteForm from "./Form";
import ReactLoading from "react-loading";
import { withTranslation } from 'react-i18next';
// import { fetchPurchasingOrg } from "../../../../store/actions/master/purchasingOrgActions";

class ModalForm extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      sendData: {
        purchasing_org_id: "",
        value:""
      },
      loadings: {
        purchasing_org_id: false,
      },
      isDisabled: {
        purchasing_org_id: false,
      },
      purchasing_org: [],
      error: false,
      loading: false,
      load: {
        purchasing_org_id: false,
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
      this.fetchPurchasingOrg();
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
        .showMasterKpi(this.props.uuid)
        .then((resp) => {
          let data = resp.data.data;
          let sendData = { ...this.state.sendData };
          sendData.value = data.value;
          sendData.purchasing_org_id = {
            value: data.purchasing_org_id,
            label: data.purchasing_org_id +' - '+ data.purchasing_org_name,
          };
          this.setState({ sendData, loading: false });          
        })
        .catch((resp) => {
          this.setState({ loading: false });
          toastr.error(resp.data.message);;
        });
    }
  }

  fetchPurchasingOrg = (newValue) => {
    if (newValue === undefined || newValue !== "") {
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, purchasing_org_id: true },
      }));
      let select_params = "";
      this.props
        .fetchPurchasingOrg(select_params)
        .then((resp) => {
          let data = resp.data.data;
          let options = data.map((data) => {
            return { value: data.id, label: data.id +' - '+ data.name };
          });
          this.setState(({ loadings, purchasing_org }) => ({
            loadings: { ...loadings, purchasing_org_id: false },
            purchasing_org : options,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, purchasing_org_id: false },
          }));
          toastr.error(resp.data.message);;
        });
    }
  };

  handleSave = (payload) => {
    if (this._isMounted) {
      this.props.save("save",payload);
    }
  };

  render() {
    // const {t} = this.props;
    return (
      <div>
        <Modal isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()}>
          <ModalHeader toggle={() => this.toggleClose()}>
          {this.props.uuid !== "" ? "Update KPI Procurment" : "Create KPI Procurment" }
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
              purchasing_org={this.state.purchasing_org}
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
