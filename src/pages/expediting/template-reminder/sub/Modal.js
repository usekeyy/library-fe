import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import { Modal, ModalHeader } from 'reactstrap';
import RouteForm from './Form';
import ReactLoading from 'react-loading';
import { withTranslation } from 'react-i18next';
// import {statusName, docCatName} from '../../../../helpers/statusName';

class ModalForm extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      sendData: {
        id: '',
        title: '',
        purchasing_org_id: this.props.user.has_roles.includes("ADM001") ?
          '' :
          {
            value:this.props.user.purchasing_org_id,
            label: this.props.user.purchasing_org_id + ' - ' + this.props.user.purchasing_org_id ,
          },
        status: '',
        content: '',
      },
      m_purchasing_org: [],
      errors: {},
      error: false,
      loadings: {
        purchasing_org: true,
      },
      loading: false
    }
  }

  componentDidMount() {
    this._isMounted = true;
    this.fetchPurchasingOrg()
    if (this.props.uuid !== "") {
      this.getUUID()
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
    this.props.toggleClose()
  }

  getUUID() {
    this.setState({ loading: true })
    this.props.showTemplateReminder(this.props.uuid)
      .then((resp) => {
        let data = resp.data.data;
        let sendData = { ...this.state.sendData }
        sendData.id = data.id;
        sendData.title = data.title;
        sendData.content = data.content;
        sendData.purchasing_org_id = {
          label: data.purchasing_org_id + ' - ' + data.purchasing_org_name,
          value: data.purchasing_org_id,
        };
        if (data.status === 'y') {
          sendData.status = {
            label: 'Active',
            value: data.status,
          };
        }
        else if (data.status === 'n') {
          sendData.status = {
            label: 'Inctive',
            value: data.status,
          };
        }
        this.setState({ sendData })
        this.setState({ loading: false })
      })
      .catch((resp) => {
        this.setState({ loading: false })
        toastr.error(resp.data.message)
      });
  }

  fetchPurchasingOrg = (newValue) => {
    if (newValue === undefined || newValue !== "") {
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, purchasing_org: true },
      }));
      let select_params = newValue !== ""
          ? { start: 0, length: 10, select: newValue }
          : { start: 0, length: 10 };
      this.props
        .fetchPurchasingOrg(select_params)
        .then((resp) => {
          let data = resp.data.data;
          // console.log(data);
          let options = data.map((data) => {
            return { value: data.id, label: data.id + ' - ' + data.name };
          });
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, purchasing_org: false },
            m_purchasing_org: options,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, purchasing_org: false },
          }));
          toastr.error(resp.data.message);
        });
    }
  };

  setOption(payload){
    let sendData = {...this.state.sendData}
    sendData.title = payload.title;
    // sendData.content = payload.content;
    sendData.purchasing_org_id = payload.purchasing_org_id.value;
    sendData.status = payload.status.value;
    if(this._isMounted){
      this.setState({sendData})
    }
  }

  handleSave = (payload) => {
    if (this._isMounted) {
      this.setOption(payload)
      if (this.props.uuid === "") {
        this.props.save("save", this.state.sendData);
      } else {
        this.props.update("update", this.props.uuid, this.state.sendData);
      }
    }
  }

  setData = (payload) => {
    let sendData = {...this.state.sendData}
    sendData.content = payload;
    this.setState({sendData})
  }

  render() {
    const {t} = this.props;
    return (
      <div>
        <Modal isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()} className="modal-lg">
          <ModalHeader toggle={() => this.toggleClose()}>{
            this.props.modalType === "edit" ? t("templateReminder:modal.title-update") :
            this.props.modalType === "create" ? t("templateReminder:modal.title-create") :
            t("templateReminder:modal.title-detail")}</ModalHeader>
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
              setData={this.setData}
              save={this.handleSave}
              user={this.props.user}
              errors={this.props.errors}
              isError={this.props.isError}
              loadingSubmit={this.props.loadingSubmit}
              modalType={this.props.modalType}
              fetchPurchasingOrg={this.fetchPurchasingOrg}
              data={this.state.sendData}
              uuid={this.props.uuid}
              loading={false}
              loadings={this.state.loadings}
              m_purchasing_org={this.state.m_purchasing_org}
            />
          )}
        </Modal>
      </div>
    );
  }
}

export default withTranslation()(ModalForm);