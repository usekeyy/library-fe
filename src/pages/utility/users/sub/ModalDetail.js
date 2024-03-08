import React, {Component} from 'react';
import {toastr} from 'react-redux-toastr';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ReactLoading from 'react-loading';
import { withTranslation } from 'react-i18next';

class ModalDetail extends Component {
	constructor(props) {
    super(props);
    this._isMounted = false;
	}
	
  state = {
    sendDt: {
      name: '',
      username: '',
      email: '',
      satus: '',
      roles: {},
      created_at: '',
      updated_at: '',
      company_id: '',
      company_name: '',
      purchasing_org_id: '',
      purchasing_groups: '',
      purchasing_org_name: '',
      work_unit_id: '',
      work_unit_name: '',
      general_planner_id: '',
      general_planner_name: '',
      specific_planner_id: '',
      specific_planner_name: '',
    },
    loading: false,
  }

  componentDidMount(){
		this._isMounted = true;
    if(this._isMounted){
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
  

  toggleClose = () => {
    this.props.toggleClose()
  }

  showByUUID = (id) => {
    if(this._isMounted){ this.setState({loading: true}) }
    this.props.showUsers(id)
    .then((resp) => {
      let data = resp.data.data;
      let sendDt = {...this.state.sendDt}
      sendDt.name = data.name;
      sendDt.username = data.username;
      sendDt.email = data.email;
      sendDt.status = data.status;
      sendDt.created_at = data.created_at;
      sendDt.updated_at = data.updated_at;
      sendDt.work_unit_id = data.work_unit_id;
      sendDt.work_unit_name = data.work_unit_name;
      sendDt.company_id = data.company_id;
      sendDt.company_name = data.company_name;
      sendDt.purchasing_org_id = data.purchasing_org_id;
      sendDt.purchasing_org_name = data.purchasing_org_name;
      sendDt.general_planner_id = data.general_planner_id;
      sendDt.general_planner_name = data.general_planner_name;
      sendDt.specific_planner_id = data.specific_planner_id;
      sendDt.specific_planner_name = data.specific_planner_name;

      if(data.roles.length > 0){
        let data_roles = data.roles.map((dt) => {
          return { id: dt.id, name: dt.name }
        })
        sendDt.roles = data_roles;
      }

      if(data.purchasing_groups.length > 0){
        let purchasing_groups = data.purchasing_groups.map((dt) => {
          return { id: dt.id, name: dt.id + ' - ' + dt.name }
        })
        sendDt.purchasing_groups = purchasing_groups;
      }

      this.setState({sendDt, loading: false})
    })
    .catch((resp) => {
      this._isMounted = false && this.setState({loading: false})
      toastr.error(resp.data.message);
    });
  }
	
  render(){
    let purchasing_groups = this.state.sendDt.purchasing_groups
    const {t} = this.props;
    return (
      <div>
        <Modal isOpen={this.props.toggleDetail} toggle={() => this.toggleClose()}>
          <ModalHeader toggle={() => this.toggleClose()}>Detail User</ModalHeader>
          {(this.state.loading) && (
            <center>
            <br/>
            <ReactLoading type="cylon" color="#0f9e3e" />
            <br/>
            </center>
          )}
					{(!this.state.loading) && (
            <div>
              <ModalBody>
                <div className="form-group">
                  <label style={{marginBottom: 0.2}}><b>{t("users:Label.Nama") || '-'}</b></label>
                  <p>{this.state.sendDt.name || '-'}</p>
                </div>
                <div className="form-group">
                  <label style={{marginBottom: 0.2}}><b>{t("users:Label.Username")}</b></label>
                  <p>{this.state.sendDt.username || '-'}</p>
                </div>
                <div className="form-group">
                  <label style={{marginBottom: 0.2}}><b>{t("users:Label.Email")}</b></label>
                  <p>{this.state.sendDt.email || '-'}</p>
                </div>
                <div className="form-group">
                  <label style={{marginBottom: 0.2}}><b>Roles</b></label>
                  <p>
                  {this.state.sendDt.roles.length > 0 ?
                    this.state.sendDt.roles.map(function(item, index) {
                      return <span key={index}>{ (index ? ', ' : '') + item.name }</span>;
                    }) : '-'}
                  </p>
                </div>
                <div className="form-group">
                  <label style={{marginBottom: 0.2}}><b>Purchaisng Group</b></label>
                  <p>
                  {purchasing_groups.length > 0 ?
                    purchasing_groups.map(function(item, index) {
                      return <span key={index}>{item.name}{ (purchasing_groups[index + 1] ? <br /> : '')}</span>;
                    }) : '-'}
                  </p>
                </div>
                <div className="form-group">
                  <label style={{marginBottom: 0.2}}><b>{t("users:Label.Status")}</b></label>
                  <p>{this.state.sendDt.status || '-'}</p>
                </div>
                <div className="form-group">
                  <label style={{marginBottom: 0.2}}><b>{t("company:title")}</b></label>
                  <p>{this.state.sendDt.company_name || '-'}</p>
                </div>
                <div className="form-group">
                  <label style={{marginBottom: 0.2}}><b>{t("purchasingOrg:title")}</b></label>
                  <p>{this.state.sendDt.purchasing_org_name || '-'}</p>
                </div>
                <div className="form-group">
                  <label style={{marginBottom: 0.2}}><b>Work Unit</b></label>
                  <p>{this.state.sendDt.work_unit_name || '-'}</p>
                </div>
                <div className="form-group">
                  <label style={{marginBottom: 0.2}}><b>General Planner</b></label>
                  <p>{this.state.sendDt.general_planner_name || '-'}</p>
                </div>
                <div className="form-group">
                  <label style={{marginBottom: 0.2}}><b>Specific Planner</b></label>
                  <p>{this.state.sendDt.specific_planner_name || '-'}</p>
                </div>
                <div className="form-group">
                  <label style={{marginBottom: 0.2}}><b>{t("users:Label.Tanggal Dibuat")}</b></label>
                  <p>{this.state.sendDt.created_at || '-'}</p>
                </div>
                <div className="form-group">
                  <label style={{marginBottom: 0.2}}><b>{t("users:Label.Tanggal Diubah")}</b></label>
                  <p>{this.state.sendDt.updated_at || '-'}</p>
                </div>
              </ModalBody>
              <ModalFooter>
                <button type="button" className="btn btn-white" onClick={(e) => this.props.toggleClose(e)} disabled={this.props.loading}>Close</button>
              </ModalFooter>
            </div>
          )}

        </Modal>
      </div>
    );
  }
}

export default withTranslation() (ModalDetail);