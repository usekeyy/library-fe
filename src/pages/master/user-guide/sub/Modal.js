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
			code: '',
			path: '',
      description : ''
    },
    loading: false
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
        this.props.update(payload, this.props.uuid);
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
    sendDt.code = '';
    sendDt.path = '';
    sendDt.description = '';
    this.setState({ sendDt })
  }

  showByUUID = (id) => {
    if(this._isMounted){
      this.setState({loading: true})
      this.props.showUom(id)
      .then((resp) => {
        let data = resp.data.data;
        let sendDt = {...this.state.sendDt}
        sendDt.code = data.code;
        sendDt.path = data.path;
        sendDt.description = data.description;
        this.setState({sendDt, loading: false})
      })
      .catch((resp) => {
        this.setState({loading: false})
        toastr.error(resp.data.message);
      });
    }
  }
	
  render(){
    const {t} = this.props;
    return (
      <div>
				<Modal isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()}>
					<ModalHeader toggle={() => this.toggleClose()}>
            {this.props.uuid!==""?  t('userguide:modal.title-update') : t('userguide:modal.title-create')}
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
            upload={this.props.upload}
            uuid={this.props.uuid}
					/>
          }
				</Modal>
			</div>
    );
  }
}

export default withTranslation() (ModalForm);