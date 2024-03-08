import React, {Component} from 'react';
import {toastr} from 'react-redux-toastr';
import { Modal, ModalHeader } from 'reactstrap';
import Form from './Form';
import ReactLoading from 'react-loading';
import { withTranslation } from 'react-i18next';

class ModalForm extends Component {
	constructor(props) {
    super(props);
    this._isMounted = false;
	}
	
  state = {
    sendData: {
			name: '',
			username: '',
			email: '',
			password: '',
      roles: '',
      purchasing_org_id: '',
      purchasing_groups: '',
      company_id: '',
      work_unit_id: '',
      general_planner_id: '',
      specific_planner_id: '',
    },
    payload: {},
    m_role: [],
    m_purchasing_org: [],
    m_purchasing_groups: [],
    m_company: [],
    m_work_unit: [],
    m_general_planner: [],
    m_specific_planner: [],
    loadings: {
      roles: true,
      company: true,
      purchasing_org: false,
      purchasing_groups: false,
      work_unit: false,
      general_planner: false,
      specific_planner: false,
    },
    isDisabled: {
      work_unit: false,
      company: false,
      purchasing_groups: false,
      purchasing_org: true,
      general_planner: true,
      specific_planner: true,
    },
    select_params: {
      start: 0,
      length: 10,
    },
		loading: false,
  }

  toggleClose = () => {
    this.props.toggleClose()
  }

  componentDidMount(){
		this._isMounted = true;
    if(this._isMounted){
      this.fetchRole()
      this.fetchCompany()
      this.fetchWorkUnit()
      this.fetchPurchasingGroup()
      if(this.props.uuid !== ''){
        this.showByUUID(this.props.uuid);
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
    
  fetchRole = (newValue) => {
    if(this._isMounted){
      let select_params = (newValue !== '') ? {start: 0, length: 10, select: newValue} : this.state.select_params;
      let loadings = {...this.state.loadings}
      loadings.roles = true;
      if(this._isMounted){ this.setState({loadings}) }
      this.props.fetchRole(select_params)
      .then((resp) => {
        // console.log(resp.data.data);
        let roles = resp.data.data;
        let options = roles.map((dt) => {
          return { value: dt.id, label: dt.name };
        })
        this.setState(({ loadings }) => ({
          loadings: { ...loadings, roles: false },
          m_role: options,
        }));
      })
      .catch((resp) => {
        loadings.work_unit = false;
        this.setState(({ loadings }) => ({
          loadings: { ...loadings, roles: false },
        }));
        toastr.error(resp.data.message);
      });
    }
  }

  fetchCompany = (newValue) => {
    if (newValue === undefined || newValue !== "") {
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, company: true },
      }));
      let select_params = (newValue !== '') ? {start: 0, length: 10, select: newValue} : this.state.select_params;
      this.props.fetchCompanies(select_params)
        .then((resp) => {
          let data = resp.data.data;
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

  fetchWorkUnit = (newValue) => {
    if (newValue === undefined || newValue !== "") {
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, work_unit: true },
      }));
      let select_params = (newValue !== '') ? {start: 0, length: 10, select: newValue} : this.state.select_params;
      this.props.fetchWorkUnits(select_params)
        .then((resp) => {
          let data = resp.data.data;
          let options = data.map((data) => {
            return { value: data.id, label: data.id + ' - ' + data.name };
          });
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, work_unit: false },
            m_work_unit: options,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, work_unit: false },
          }));
          toastr.error(resp.data.message);;
        });
    }
  }

  fetchPurchasingGroup = (newValue) => {
    if (newValue === undefined || newValue !== "") {
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, purchasing_groups: true },
      }));
      let select_params = (newValue !== '') ? {start: 0, length: 10, select: newValue} : this.state.select_params;
      this.props.fetchPurchasingGroup(select_params)
        .then((resp) => {
          let data = resp.data.data;
          let options = data.map((data) => {
            return { value: data.id, label: data.id + ' - ' + data.name };
          });
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, purchasing_groups: false },
            m_purchasing_groups: options,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, purchasing_groups: false },
          }));
          toastr.error(resp.data.message);;
        });
    }
  }

  fetchPurchasingOrg = (newValue) => {
    if (this._isMounted) {
      this.setState(({ loadings, isDisabled, sendData }) => ({
        loadings: { ...loadings, purchasing_org: true },
        isDisabled: { ...isDisabled, purchasing_org: true },
        sendData,
      }));
      let company_id = this.state.sendData.company_id;
      let select_params = (newValue !== '') ?
        {start: 0, length: 10, company_id: company_id, select: newValue} : 
        {start: 0, length: 10, company_id: company_id};
      this.props.fetchPurchasingOrg(select_params)
        .then((resp) => {
          let data = resp.data.data;
          let options = data.map((data) => {
            return { value: data.id, label: data.id + ' - ' + data.name };
          });
          this.setState(({ loadings, isDisabled, sendData }) => ({
            loadings: { ...loadings, purchasing_org: false },
            isDisabled: { ...isDisabled, purchasing_org: false },
            m_purchasing_org: options,
            sendData: sendData,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings, isDisabled }) => ({
            loadings: { ...loadings, purchasing_org: false },
            isDisabled: { ...isDisabled, purchasing_org: false },
          }));
          toastr.error(resp.data.message);;
        });
    }
  }

  fetchGeneralPlanner = (newValue) => {
    if (this._isMounted) {
      this.setState(({ loadings, isDisabled, sendData }) => ({
        loadings: { ...loadings, general_planner: true },
        isDisabled: { ...isDisabled, general_planner: true },
        sendData,
      }));
      let company_id = this.state.sendData.company_id;
      let select_params = (newValue !== '') ?
        {start: 0, length: 10, company_id: company_id, select: newValue} : 
        {start: 0, length: 10, company_id: company_id};
      this.props.fetchGeneralPlanner(select_params)
        .then((resp) => {
          let data = resp.data.data;
          let options = data.map((data) => {
            return { value: data.id, label: data.id + ' - ' + data.name };
          });
          this.setState(({ loadings, isDisabled, sendData }) => ({
            loadings: { ...loadings, general_planner: false },
            isDisabled: { ...isDisabled, general_planner: false },
            m_general_planner: options,
            sendData: sendData,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings, isDisabled }) => ({
            loadings: { ...loadings, general_planner: false },
            isDisabled: { ...isDisabled, general_planner: false },
          }));
          toastr.error(resp.data.message);;
        });
    }
  }

  fetchSpecificPlanner = (newValue) => {
    if (this._isMounted) {
      this.setState(({ loadings, isDisabled, sendData }) => ({
        loadings: { ...loadings, specific_planner: true },
        isDisabled: { ...isDisabled, specific_planner: true },
        sendData,
      }));
      let general_planner_id = this.state.sendData.general_planner_id;
      let select_params = (newValue !== '') ?
        {start: 0, length: 10, general_planner_id: general_planner_id, select: newValue} : 
        {start: 0, length: 10, general_planner_id: general_planner_id};
      this.props.fetchSpecificPlanner(select_params)
        .then((resp) => {
          let data = resp.data.data;
          let options = data.map((data) => {
            return { value: data.id, label: data.id + ' - ' + data.name };
          });
          this.setState(({ loadings, isDisabled, sendData }) => ({
            loadings: { ...loadings, specific_planner: false },
            isDisabled: { ...isDisabled, specific_planner: false },
            m_specific_planner: options,
            sendData: sendData,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings, isDisabled }) => ({
            loadings: { ...loadings, specific_planner: false },
            isDisabled: { ...isDisabled, specific_planner: false },
          }));
          toastr.error(resp.data.message);;
        });
    }
  }

  showByUUID = (id) => {
    if(this._isMounted){ this.setState({loading: true}) }
    this.props.showUsers(id)
    .then((resp) => {
      // console.log(resp)
      let data = resp.data.data;
      let sendData = {...this.state.sendData}
      sendData.name = data.name;
      sendData.username = data.username;
      sendData.email = data.email;
      sendData.password = data.password;
      if(data.company_id !== null){
        sendData.company_id = {
          value: data.company_id,
          label: data.company_id + ' - ' + data.company_name,
        }
      }
      if(data.work_unit_id !== null){
        sendData.work_unit_id = {
          value: data.work_unit_id,
          label: data.work_unit_id + ' - ' + data.work_unit_name,
        }        
      }
      if(data.purchasing_org_id !== null){
        sendData.purchasing_org_id = {
          value: data.purchasing_org_id,
          label: data.purchasing_org_id + ' - ' + data.purchasing_org_name,
        }          
      }
      if(data.general_planner_id !== null){
        sendData.general_planner_id = {
          value: data.general_planner_id,
          label: data.general_planner_id + ' - ' + data.general_planner_name,
        }  
      }
      if(data.specific_planner_id !== null){
        sendData.specific_planner_id = {
          value: data.specific_planner_id,
          label: data.specific_planner_id + ' - ' + data.specific_planner_name,
        }          
      }

      if(data.roles.length > 0){
        let data_roles = data.roles.map((dt) => {
          return { value: dt.id, label: dt.name }
        })
        sendData.roles = data_roles;
      }

      if(data.purchasing_groups.length > 0){
        let purchasing_groups = data.purchasing_groups.map((dt) => {
          return { value: dt.id, label: dt.id + ' - ' + dt.name }
        })
        sendData.purchasing_groups = purchasing_groups;
      }

      this.setState({sendData, loading: false})
      console.log(this.state.sendData)
      this.setCompany(data.company_id);
      this.setGeneralPlanner(data.general_planner_id);
    })
    .catch((resp) => {
      this._isMounted = false && this.setState({loading: false})
      toastr.error(resp.data.message);
    });
  }
	
  handleSave = (payload) => {
		if(this._isMounted){
      this.setOption(payload);
      console.log(payload)
      console.log(this.state)
      if(this.props.uuid !== ""){
        this.props.update(this.state.sendData, this.props.uuid);
      } else {
        this.props.save(this.state.sendData);
      }
    }
  }

  setOption(payload){
    let sendData = {...this.state.sendData}
    sendData.name = payload.name;
		sendData.username = payload.username;
		sendData.email = payload.email;
		sendData.password = payload.password;
		sendData.purchasing_org_id = payload.purchasing_org_id.value;
		sendData.company_id =  (payload.company_id) ? payload.company_id.value : '';
		sendData.work_unit_id = (payload.work_unit_id) ? payload.work_unit_id.value : '';
		sendData.general_planner_id = (payload.general_planner_id) ? payload.general_planner_id.value : '';
		sendData.specific_planner_id = (payload.specific_planner_id) ? payload.specific_planner_id.value : '';
    if(payload.roles.length > 0){
      const roles = payload.roles.map(role => {
        return role.value;
      })
      sendData.roles = roles;
    } else {
      delete sendData.roles;
    }
    if(payload.purchasing_groups.length > 0){
      const purchasing_groups = payload.purchasing_groups.map(purchasing_groups => {
        return purchasing_groups.value;
      })
      sendData.purchasing_groups = purchasing_groups;
    }

    if(this._isMounted){
      this.setState({sendData})
    }
  }

  setCompany = (payload) => {
    let sendData = {...this.state.sendData}
    sendData.company_id = payload;
    this.setState({sendData}, 
      () => {
        this.fetchPurchasingOrg('');
        this.fetchGeneralPlanner('');
     }
    );
  }

  setGeneralPlanner = (payload) => {
    let sendData = {...this.state.sendData}
    sendData.general_planner_id = payload;
    this.setState({sendData}, 
      () => {
        this.fetchSpecificPlanner('');
     }
    );
  }

  resetForm = () => {
    let sendData = {...this.state.sendData}
    sendData.name = '';
		sendData.username = '';
		sendData.email = '';
		sendData.password = '';
    sendData.roles = '';
    sendData.purchasing_org_id = '';
    sendData.purchasing_groups = '';
    sendData.company_id = '';
    sendData.work_unit_id = '';
    sendData.general_planner_id = '';
    sendData.specific_planner_id = '';
    if(this._isMounted){
      this.setState({ sendData })
    }
  }

  render(){
    return (
      <div>
				<Modal isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()}>
					<ModalHeader toggle={() => this.toggleClose()}>Form Users</ModalHeader>
          {(this.state.loading) && (
            <center>
              <br/>
              <ReactLoading type="cylon" color="#0f9e3e" />
              <br/>
            </center>
          )}
					{(!this.state.loading) && (
            <Form
              fetchRole={this.fetchRole}
              fetchCompany={this.fetchCompany}
              fetchWorkUnit={this.fetchWorkUnit}
              fetchPurchasingGroup={this.fetchPurchasingGroup}
              fetchPurchasingOrg={this.fetchPurchasingOrg}
              fetchGeneralPlanner={this.fetchGeneralPlanner}
              fetchSpecificPlanner={this.fetchSpecificPlanner}
              setGeneralPlanner={this.setGeneralPlanner}
              setCompany={this.setCompany}
              loadings={this.state.loadings}
              loading={this.props.loading}
              isDisabled={this.state.isDisabled}
              errors={this.props.errors}
              toggleClose={this.toggleClose}
              save={(payload) => this.handleSave(payload)}
              data={this.state.sendData}
              m_role={this.state.m_role}
              m_company={this.state.m_company}
              m_work_unit={this.state.m_work_unit}
              m_purchasing_groups={this.state.m_purchasing_groups}
              m_purchasing_org={this.state.m_purchasing_org}
              m_general_planner={this.state.m_general_planner}
              m_specific_planner={this.state.m_specific_planner}
              uuid={this.props.uuid}
            />
          )}
				</Modal>
			</div>
    );
  }
}

export default withTranslation() (ModalForm);