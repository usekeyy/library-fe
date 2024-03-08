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
			company_id: '',
    },
    m_company: [],
    loadings: {
      company: false,
    },
    loading: false
  }

  componentDidMount(){
		this._isMounted = true;
    if(this._isMounted){
      this.showCompany()
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
      this.setOption(payload)
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
    sendDt.company_id = '';
    this.setState({ sendDt })
  }

  showByUUID = (id) => {
    if(this._isMounted){
      this.setState({loading: true})
      this.props.showPurchasingOrg(id)
      .then((resp) => {
        let data = resp.data.data;
        let sendDt = {...this.state.sendDt}
        sendDt.id = data.id;
        sendDt.name = data.name;
        sendDt.company_id = {value: data.company_id, label: data.company_name};
        this.setState({sendDt, loading: false})
      })
      .catch((resp) => {
        this.setState({loading: false})
        toastr.error(resp.data.message);
      });
    }
  }

  showCompany = () => {
    if(this._isMounted){
      let loadings = {...this.state.loadings}
      loadings.company = true;
      this.setState({loadings})
      this.props.fetchCompanies()
      .then((resp) => {
        let m_company = resp.data.data;
        let options = m_company.map((dt) => {
          return { value: dt.id, label: dt.name };
        })
        loadings.company = false;
        this.setState({m_company: options, loadings})
      })
      .catch((resp) => {
        loadings.company = false;
        this.setState({loadings})
        toastr.error(resp.data.message);
      });
    }
  }

  setOption(payload){
    let sendDt = {...this.state.sendDt}
    sendDt.id = payload.id;
    sendDt.name = payload.name;
    sendDt.company_id = payload.company_id.value;
    if(this._isMounted){
      this.setState({sendDt})
    }
  }
	
  render(){
    const {t} = this.props;
    return (
      <div>
				<Modal isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()}>
        <ModalHeader toggle={() => this.toggleClose()}> {this.props.uuid !== "" ?  t('purchasingOrg:modal.title-update') : t('purchasingOrg:modal.title-create')}  </ModalHeader>
          {this.state.loading && (
            <center>
              <br/>
              <ReactLoading type="cylon" color="#0f9e3e" />
              <br/>
            </center>
          )}
          {this.state.loading === false && 
            <Form
              m_company={this.state.m_company}
              loading={this.props.loading}
              loadings={this.state.loadings}
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

export default   withTranslation() (ModalForm);