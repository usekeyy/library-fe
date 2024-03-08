import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import { Modal, ModalHeader } from 'reactstrap';
import RouteForm from './Form';
import ReactLoading from 'react-loading';
import { withTranslation } from 'react-i18next';

class ModalForm extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      sendData: {
        user_id: '',
        role_id: '',
        purchasing_org_id: '',
        purchasing_group_id: '',
        value_from: '',
        value_to: '',
        order : '',
        type : '',
        approver : '',
      },
      loadings: {
        purchasing_org_id: '',
        purchasing_group_id: '',
        user_id: '',
        role_id: '',
      },
      isDisabled: {
        user_id: true,
      },
      purchasing_org_id: '',
      role_id: '',
      m_user: [],
      m_role: [],
      select_params: {
        start: 0,
        length: 10,
      },
      m_purchasing_group: [],
      m_purchasing_org: [],
      errors: {},
      error: false,
      loading: false
    }
  }

  componentDidMount() {
    this._isMounted = true;
    this.fetchPurchasingOrg();
    this.fetchPurchasingGroup();
    this.fetchRole();
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

  fetchPurchasingGroup = (newValue) => {
    if(this._isMounted){
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, purchasing_group_id: true },
      }));
      let select_params = (newValue !== '') ? {start: 0, length: 10, select: newValue} : this.state.select_params;

      this.props.fetchPurchasingGroup(select_params)
      .then((resp) => {

        let data = resp.data.data;
        let options = data.map((dt) => {
          return { value: dt.id, label: dt.id + ' - ' + dt.name };
        })
        this.setState(({ loadings }) => ({
          loadings: { ...loadings, purchasing_group_id: false },
          m_purchasing_group: options,
        }));
      })
      .catch((resp) => {
        this.setState(({ loadings }) => ({
          loadings: { ...loadings, purchasing_group_id: false },
        }));
        toastr.error(resp.data.message);
      });
    }
  }

  fetchPurchasingOrg = (newValue) => {
    if(this._isMounted){
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, purchasing_org_id: true },
      }));
      let select_params = (newValue !== '') ? {start: 0, length: 10, select: newValue} : this.state.select_params;
      // let select_params = '';
      this.props.fetchPurchasingOrg(select_params)
      .then((resp) => {
        // console.log(resp.data.data);
        let data = resp.data.data;
        let options = data.map((dt) => {
          return { value: dt.id, label: dt.id + ' - ' + dt.name };
        })
        this.setState(({ loadings }) => ({
          loadings: { ...loadings, purchasing_org_id: false },
          m_purchasing_org: options,
        }));
      })
      .catch((resp) => {
        this.setState(({ loadings }) => ({
          loadings: { ...loadings, purchasing_org_id: false },
        }));
        toastr.error(resp.data.message);
      });
    }
  }

  fetchRole = (newValue) => {
    if(this._isMounted){
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, role_id: true },
      }));
      let select_params = (newValue !== '') ? {start: 0, length: 10, select: newValue} : this.state.select_params;

      this.props.fetchRole(select_params)
      .then((resp) => {
        // console.log(resp.data.data);
        let data = resp.data.data;
        let options = data.map((dt) => {
          return { value: dt.id, label: dt.name };
        })
        this.setState(({ loadings }) => ({
          loadings: { ...loadings, role_id: false },
          m_role: options,
        }));
      })
      .catch((resp) => {
        this.setState(({ loadings }) => ({
          loadings: { ...loadings, role_id: false },
        }));
        toastr.error(resp.data.message);
      });
    }
  }

  fetchUsersRole = (newValue) => {
    if (this._isMounted) {
      if (this.state.purchasing_org_id !== '' && this.state.role_id !== '') {
        let select_params = (newValue !== '') ?
          {start: 0, length: 10, purchasing_org: this.state.purchasing_org_id, role: this.state.role_id, select: newValue} :
          {start: 0, length: 10, purchasing_org: this.state.purchasing_org_id, role: this.state.role_id};
        this.props.fetchUsersRole(select_params)
          .then((resp) => {
            // console.log(resp)
            let data = resp.data.data;
            let options = data.map((data) => {
              return { value: data.uuid, label: data.name };
            });
            this.setState(({ loadings, isDisabled }) => ({
              loadings: { ...loadings, user_id: false },
              isDisabled: { ...isDisabled, user_id: false },
              m_user: options,
            }));
          })
          .catch((resp) => {
            this.setState(({ loadings, isDisabled }) => ({
              loadings: { ...loadings, user_id: false },
              isDisabled: { ...isDisabled, user_id: false },
            }));
            toastr.error(resp.data.message);;
          });
      }
      else {
        this.setState(({ loadings, isDisabled }) => ({
          loadings: { ...loadings, user_id: true },
          isDisabled: { ...isDisabled, user_id: true },
        }));
      }
    }
  }

  setPurchasingOrg = (newValue) => {
    this.setState({ purchasing_org_id: newValue }, this.fetchUsersRole );
  }

  setRole = (newValue) => {
    this.props.fetchRole({id: newValue})
    .then((resp) => {
      console.log(resp.data.data[0])
      this.setState({ role_id: resp.data.data[0].code }, this.fetchUsersRole );
    })
  }

  getUUID() {
    this.setState({ loading: true })
    this.props.showMappingValueApproval(this.props.uuid)
      .then((resp) => {
        console.log(resp)
        let data = resp.data.data;

        let sendData = { ...this.state.sendData }
        sendData.value_from = data.value_from;
        sendData.value_to = data.value_to;
        sendData.order = data.order;
        sendData.type = {
          value : data.type,
          label : data.type.toUpperCase()
        }
        sendData.purchasing_org_id = {
          value: data.purchasing_org_id,
          label: data.purchasing_org_id + ' - ' + data.purchasing_org_name,
        }
        sendData.purchasing_group_id = {
          value: data.purchasing_group_id,
          label: data.purchasing_group_id + ' - ' + data.purchasing_group_name,
        }
        sendData.role_id = {
          value: data.role_id,
          label: data.role_name,
        }
        this.setPurchasingOrg(data.purchasing_org_id)
        this.setRole(data.role_id)

        sendData.user_id = {
          value: data.user_id,
          label: data.user_name,
        }

        sendData.approver = {
          value : data.approver ? data.approver : '',
          label : data.approver ? (data.approver === 'y' ?  "VP" : (data.approver === 'x' ? "Direksi" : "")) : ""
        }
        this.setState({ sendData, loading: false })
      })
      .catch((resp) => {
        this.setState({ loading: false })
        toastr.error(resp.data.message)
      });
  }

  setOption(payload){
    let sendData = {...this.state.sendData}
    sendData.purchasing_org_id = payload.purchasing_org_id.value;
    sendData.purchasing_group_id = payload.purchasing_group_id.value;
    sendData.role_id = payload.role_id.value;
    sendData.user_id = payload.user_id.value;
    sendData.value_from = payload.value_from;
    sendData.value_to = payload.value_to;
    sendData.order = payload.order;
    sendData.type = payload.type.value;
    sendData.approver = payload.approver==null ? null : payload.approver.value;
    if(this._isMounted){
      this.setState({sendData})
    }
  }

  handleSave = (payload) => {
    if (this._isMounted) {
      
      this.setOption(payload)
      // console.log(this.state.sendData)
      if (this.props.uuid === "") {
        this.props.save("save", this.state.sendData);
      } else {
        this.props.update("update", this.props.uuid, this.state.sendData);
      }
    }
  }

  render() {
    const {t} = this.props;
    return (
      <div>
        <Modal isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()}>
          <ModalHeader toggle={() => this.toggleClose()}>{this.props.uuid !== "" ? t("mappingValueApproval:modal.title-update") : t("mappingValueApproval:modal.title-create")}</ModalHeader>
          {this.state.loading && (
            <center>
              <br />
              <ReactLoading type="cylon" color="#0f9e3e" />
              <br />
            </center>
          )}
          {this.state.loading === false && (
            <RouteForm
              fetchPurchasingGroup={this.fetchPurchasingGroup}
              fetchPurchasingOrg={this.fetchPurchasingOrg}
              fetchRole={this.fetchRole}
              fetchUsersRole={this.fetchUsersRole}
              setPurchasingOrg={this.setPurchasingOrg}
              setRole={this.setRole}
              toggleClose={this.toggleClose}
              save={this.handleSave}
              errors={this.props.errors}
              isError={this.props.isError}
              isDisabled={this.state.isDisabled}
              loadingSubmit={this.props.loadingSubmit}
              m_purchasing_group={this.state.m_purchasing_group}
              m_purchasing_org={this.state.m_purchasing_org}
              m_role={this.state.m_role}
              m_user={this.state.m_user}
              data={this.state.sendData}
              uuid={this.props.uuid}
              loading={false}
              loadings={this.state.loadings}
            />
          )}
        </Modal>
      </div>
    );
  }
}

export default withTranslation()(ModalForm);