import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import { Modal, ModalHeader } from 'reactstrap';
import RouteForm from './Form';
import FormDetail from './FormDetail';
import ReactLoading from 'react-loading';
import { withTranslation } from 'react-i18next';

class ModalForm extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      sendData: {
        name: '',
        chief: '',
        purchasing_org_id: '',
        purchasing_groups: '',
      },
      loadings: {
        purchasing_org_id: '',
        purchasing_groups: '',
        chief: '',
      },
      isDisabled: {
        chief: true,
      },
      select_params: {
        start: 0,
        length: 10,
      },
      purchasing_org_id: '',
      role_id: 'VNDR01', // role vendor
      m_purchasing_groups: [],
      m_purchasing_org: [],
      m_chief: [],
      errors: {},
      error: false,
      loading: false
    }
  }

  componentDidMount() {
    this._isMounted = true;
    this.fetchPurchasingOrg();
    this.fetchPurchasingGroup();
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
        loadings: { ...loadings, purchasing_groups: true },
      }));
      let select_params = (newValue !== '') ? {start: 0, length: 10, select: newValue} : this.state.select_params;
      this.props.fetchPurchasingGroup(select_params)
      .then((resp) => {
        // console.log(resp.data.data);
        let data = resp.data.data;
        let options = data.map((dt) => {
          return { value: dt.id, label: dt.id + ' - ' + dt.name };
        })
        this.setState(({ loadings }) => ({
          loadings: { ...loadings, purchasing_groups: false },
          m_purchasing_groups: options,
        }));
      })
      .catch((resp) => {
        this.setState(({ loadings }) => ({
          loadings: { ...loadings, purchasing_groups: false },
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

  fetchUsersRole = (newValue) => {
    if (this._isMounted) {
      if (this.state.purchasing_org_id !== '') {
        let select_params = (newValue !== '') ?
          {start: 0, length: 10, role_not: this.state.role_id, purchasing_org: this.state.purchasing_org_id, select: newValue} :
          {start: 0, length: 10, role_not: this.state.role_id, purchasing_org: this.state.purchasing_org_id};
        this.props.fetchUsersRole(select_params)
          .then((resp) => {
            let data = resp.data.data;
            let options = data.map((data) => {
              return { value: data.uuid, label: data.name };
            });
            this.setState(({ loadings, isDisabled }) => ({
              loadings: { ...loadings, chief: false },
              isDisabled: { ...isDisabled, chief: false },
              m_chief: options,
            }));
          })
          .catch((resp) => {
            this.setState(({ loadings, isDisabled }) => ({
              loadings: { ...loadings, chief: false },
              isDisabled: { ...isDisabled, chief: false },
            }));
            toastr.error(resp.data.message);;
          });
      }
      else{
        this.setState(({ loadings, isDisabled }) => ({
          loadings: { ...loadings, chief: true },
          isDisabled: { ...isDisabled, chief: true },
        }));  
      }
    }
  }

  getUUID() {
    this.setState({ loading: true })
    this.props.showDivision(this.props.uuid)
      .then((resp) => {
        let data = resp.data.data;
        this.fetchUsersRole(data.purchasing_org_id);        

        let sendData = { ...this.state.sendData }
        sendData.name = data.name;
        // sendData.chief = data.chief.value;
        sendData.chief = {
          value: data.chief,
          label: data.chief_name,
        }
        sendData.purchasing_org_id = {
          value: data.purchasing_org_id,
          label: data.purchasing_org_id + ' - ' + data.purchasing_org_name,
        }
        if(data.purchasing_groups_array.length > 0){
          let purchasing_groups = data.purchasing_groups_array.map((dt) => {
            return { value: dt.id, label: dt.id + ' - ' + dt.name }
          })
          sendData.purchasing_groups = purchasing_groups;
        }
        
        this.setPurchasingOrg(data.purchasing_org_id)
        this.setState({ sendData, loading: false })
      })
      .catch((resp) => {
        this.setState({ loading: false })
        toastr.error(resp.data.message)
      });
  }

  setOption(payload){
    let sendData = {...this.state.sendData}
    sendData.name = payload.name;
    sendData.chief = payload.chief.value;
    sendData.purchasing_org_id = payload.purchasing_org_id.value;
    if(payload.purchasing_groups.length > 0){
      const data = payload.purchasing_groups.map(dt => { return dt.value })
      sendData.purchasing_groups = data;
    }
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

  setPurchasingOrg = (newValue) => {
    this.setState({ purchasing_org_id: newValue }, this.fetchUsersRole );
  }

  render() {
    const {t} = this.props;
    return (
      <div>
        <Modal isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()}>
          <ModalHeader toggle={() => this.toggleClose()}>{!this.props.toggleDetail ? this.props.uuid !== "" ? t("division:modal.title-update") : t("division:modal.title-create") : t("division:modal.title-detail")}</ModalHeader>
          {this.state.loading && (
            <center>
              <br />
              <ReactLoading type="cylon" color="#0f9e3e" />
              <br />
            </center>
          )}
          {this.state.loading === false && (
            ! this.props.toggleDetail ? 
            <RouteForm
              setPurchasingOrg={this.setPurchasingOrg}
              fetchPurchasingGroup={this.fetchPurchasingGroup}
              fetchPurchasingOrg={this.fetchPurchasingOrg}
              fetchUsersRole={this.fetchUsersRole}
              toggleClose={this.toggleClose}
              save={this.handleSave}
              errors={this.props.errors}
              isError={this.props.isError}
              isDisabled={this.state.isDisabled}
              loadingSubmit={this.props.loadingSubmit}
              m_purchasing_groups={this.state.m_purchasing_groups}
              m_purchasing_org={this.state.m_purchasing_org}
              m_chief={this.state.m_chief}
              data={this.state.sendData}
              uuid={this.props.uuid}
              loading={false}
              loadings={this.state.loadings}
            /> : 
            <FormDetail
              toggleClose={this.toggleClose}
              data={this.state.sendData}
              uuid={this.props.uuid}
              loading={false}
            />
          )}
        </Modal>
      </div>
    );
  }
}

export default withTranslation()(ModalForm);