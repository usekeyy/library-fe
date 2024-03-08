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
        company_id: '',
        wbs_element: '',
        description: '',
        object_number: '',
        project_type: '',
        level: '',
      },
      payload: {},
      m_company: [],
      errors: {},
      error: false,
      loading: false,
      loadings: {
        company: true,
      },
      loadingSubmit: false
    };
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.getCompanies()
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
        .showWbsProject(this.props.uuid)
        .then((resp) => {
          let data = resp.data.data;
          let sendData = { ...this.state.sendData };
          sendData.id = data.id;
          sendData.company_id = {
            value: data.company_id,
            label: data.company_id + ' - ' + data.company_name,
          }
          sendData.wbs_element = data.wbs_element;
          sendData.description = data.description;
          sendData.object_number = data.object_number;
          sendData.project_type = data.project_type;
          sendData.level = data.level;
          this.setState({ sendData, loading: false });
        })
        .catch((resp) => {
          this.setState({ loading: false });
          toastr.error(resp.data.message);;
        });
    }
  }

  getCompanies = (newValue) => {
    if (newValue === undefined || newValue !== "") {
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, company: true },
      }));
      let select_params = "";
        // newValue !== ""
        //   ? { start: 0, length: 10, select: newValue }
        //   : { start: 0, length: 10 };
      this.props
        .fetchCompanies(select_params)
        .then((resp) => {
          let data = resp.data.data;
          // console.log(data);
          let options = data.map((data) => {
            return { value: data.id, label: data.id + ' - ' + data.name };
          });
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, company: false },
            m_company: options,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, company: false },
          }));
          toastr.error(resp.data.message);;
        });
    }
  };
  
  setOption(payload){
    let sendData = {...this.state.sendData}
    sendData.id = payload.id;
    sendData.company_id = payload.company_id.value;
    sendData.wbs_element = payload.wbs_element;
    sendData.description = payload.description;
    sendData.object_number = payload.object_number;
    sendData.project_type = payload.project_type;
    sendData.level = payload.level;
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
            {this.props.uuid !== "" ? t("wbsProject:modal.title-update") : t("wbsProject:modal.title-create")}
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
              m_company={this.state.m_company}
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
