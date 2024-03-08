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
    sendDt: {
			id: '',
			name: '',
			address: '',
			postal_code: '',
			district_id: '',
			purchasing_org_id: '',
    },
    m_purchasing_org: [],
    m_districts: [],
    loadings: {
      purchasing_org: false,
      districts: false,
    },
    loading: false
  }

  componentDidMount(){
		this._isMounted = true;
    if(this._isMounted){
      this.showDistricts()
      this.showPurchasingOrg()
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
  
  handleChange(e){
		if(this._isMounted){
			let sendDt = {...this.state.sendDt}
      sendDt[e.target.id] = e.target.value;
      this.setState({ sendDt })
		}
  }
  
  handleSave = (payload) => {
		if(this._isMounted){
      this.setOption(payload);
      if(this.props.uuid !== ""){
        this.props.update(this.state.sendDt, this.props.uuid);
      } else {
        this.props.save(this.state.sendDt);
      }
    }
  }

  toggleClose = () => {
    this.props.toggleClose()
  }

  resetForm = () => {
    let sendDt = {...this.state.sendDt}
    sendDt.id = '';
    sendDt.name = '';
    sendDt.address = '';
    sendDt.postal_code = '';
    sendDt.district_id = '';
    sendDt.purchasing_org_id = '';
    this.setState({ sendDt })
  }

  showByUUID = (id) => {
    if(this._isMounted){
      this.setState({loading: true})
      this.props.showPlant(id)
      .then((resp) => {
        let data = resp.data.data;
        let sendDt = {...this.state.sendDt}
        sendDt.id = data.id;
        sendDt.name = data.name;
        sendDt.address = data.address;
        sendDt.postal_code = data.postal_code;
        sendDt.district_id = {value: data.district_id, label: data.district_name};
        sendDt.purchasing_org_id = {value: data.purchasing_org_id, label: data.purchasing_org_name};
        this.setState({sendDt, loading: false})
      })
      .catch((resp) => {
        this.setState({loading: false})
        toastr.error(resp.data.message);
      });
    }
  }

  showPurchasingOrg = () => {
    if(this._isMounted){
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, purchasing_org: true }
      }));
      this.props.fetchPurchasingOrg()
      .then((resp) => {
        let m_purchasing_org = resp.data.data;
        let options = m_purchasing_org.map((dt) => {
          return { value: dt.id, label: dt.name };
        })
        this.setState(({ loadings }) => ({
          m_purchasing_org: options,
          loadings: { ...loadings, purchasing_org: false }
        }));
      })
      .catch((resp) => {
        this.setState(({ loadings }) => ({
          loadings: { ...loadings, purchasing_org: false }
        }));
        toastr.error(resp.data.message);
      });
    }
  }
  
  showDistricts = () => {
    if(this._isMounted){
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, districts: true }
      }));
      this.props.fetchDistricts()
      .then((resp) => {
        let m_districts = resp.data.data;
        let options = m_districts.map((dt) => {
          return { value: dt.id, label: dt.name };
        })
        this.setState(({ loadings }) => ({
          m_districts: options,
          loadings: { ...loadings, districts: false }
        }));
      })
      .catch((resp) => {
        this.setState(({ loadings }) => ({
          loadings: { ...loadings, districts: false }
        }));
        toastr.error(resp.data.message);
      });
    }
  }

  setOption(payload){
    let sendDt = {...this.state.sendDt}
    sendDt.id = payload.id;
    sendDt.name = payload.name;
    sendDt.address = payload.address;
    sendDt.postal_code = payload.postal_code;
    sendDt.district_id = payload.district_id.value;
    sendDt.purchasing_org_id = payload.purchasing_org_id.value;
    if(this._isMounted){
      this.setState({sendDt})
    }
  }
	
  render(){
    const {t} = this.props;
    return (
      <div>
				<Modal isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()}>
					<ModalHeader toggle={() => this.toggleClose()}> {this.props.uuid !=="" ?  t('plant:modal.title-update') : t('plant:modal.title-create')} </ModalHeader>
          {this.state.loading && (
            <center>
              <br/>
              <ReactLoading type="cylon" color="#0f9e3e" />
              <br/>
            </center>
          )}
          {this.state.loading === false && 
            <Form
            m_purchasing_org={this.state.m_purchasing_org}
            m_districts={this.state.m_districts}
            loadings={this.state.loadings}
            loading={this.props.loading}
            errors={this.props.errors}
						toggleClose={this.toggleClose}
						save={(payload) => this.handleSave(payload)}
            data={this.state.sendDt}
            uuid={this.props.uuid}
					/>
          }
				</Modal>
			</div>
    );
  }
}

export default withTranslation() (ModalForm);