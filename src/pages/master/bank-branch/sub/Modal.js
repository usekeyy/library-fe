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
			bank_id: '',
			country_id: '',
			district_id: '',
			address: '',
    },
    loading: false
  }

  componentDidMount(){
		this._isMounted = true;
    if(this._isMounted){
      this.props.fetchBank()
      this.props.fetchCountries()
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
      if(this.props.uuid !== ""){
        this.props.update(this.props.uuid,payload);
      } else {
        this.props.save(payload);
      }
    }
  }

  toggleClose = () => {
    this.props.toggleClose()
  }

  resetForm = () => {
    let sendDt = {...this.state.sendDt}
    // sendDt.id = ''
    sendDt.bank_id = ''
    sendDt.country_id = ''
    sendDt.district_id = ''
    sendDt.address = ''
    this.setState({ sendDt })
  }

  showByUUID = (id) => {
    if(this._isMounted){
      this.setState({loading: true})
      this.props.showBankBranch(id)
      .then((resp) => {
        let data = resp.data.data;
        let sendDt = {...this.state.sendDt}
        sendDt.sap_code = data.sap_code;
        sendDt.name = data.name;
        sendDt.bank_id = { value: data.bank_id, label: `${data.bank_id} - ${data.bank_name}` };
        sendDt.country_id = { value: data.country_id, label: `${data.country_id} - ${data.country_name}` };
        sendDt.district_id = { value: data.district_id, label: `${data.district_id} - ${data.district_name}` };
        sendDt.address = data.address;
        this.setState({sendDt, loading: false}, () => {
          this.props.fetchDistricts({ country_id: data.country_id })
        })
      })
      .catch((resp) => {
        this.setState({loading: false})
        toastr.error(resp.data.message);
      });
    }
  }
	
  render(){
    // const {t} = this.props;
    return (
      <div>
				<Modal isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()}>
					<ModalHeader toggle={() => this.toggleClose()}>
            {this.props.uuid!==""?  "Edit" : "Form"} Bank Branch
          </ModalHeader>
          {this.state.loading && (
            <center>
              <br/>
              <ReactLoading type="cylon" color="#0f9e3e" />
              <br/>
            </center>
          )}
          {this.state.loading === false && 
            <Form
            loading={this.props.loading}
            errors={this.props.errors}
						toggleClose={this.toggleClose}
						save={(payload) => this.handleSave(payload)}
            data={this.state.sendDt}
            uuid={this.props.uuid}
            fetchBank={this.props.fetchBank}
            fetchCountries={this.props.fetchCountries}
            fetchDistricts={this.props.fetchDistricts}
            loadings={this.props.datas.loadings}
            parentState={this.props.datas}
					/>
          }
				</Modal>
			</div>
    );
  }
}

export default withTranslation() (ModalForm);