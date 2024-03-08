import React, {Component} from 'react';
import {toastr} from 'react-redux-toastr';
import { Modal, ModalHeader } from 'reactstrap';
import Form from './Form';
import ReactLoading from 'react-loading';
import { withTranslation } from 'react-i18next';
import {statusName} from '../../../../helpers/statusName';

class ModalForm extends Component {
	constructor(props) {
    super(props);
    this._isMounted = false;
	}
	
  state = {
    option_status: [
      {
        value: 'y',
        label: 'Actived',
      },
      {
        value: 'n',
        label: 'Inactived',
      },
    ],
    sendData: {
			id: '',
			code: '',
			name: '',
			flag: '',
			status: 'y',
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
			let sendData = {...this.state.sendData}
      sendData[e.target.id] = e.target.value;
      this.setState({ sendData })
		}
  }
  
  setOption(payload){
    let sendData = {...this.state.sendData}
    sendData.id = payload.id;
    sendData.name = payload.name;
    sendData.flag = null;
    if (payload.flag === 'MR/SR'){
      sendData.flag = 'MR/SR';
    }
    if(payload.status){
      sendData.status = payload.status.value;
    }
    if(this._isMounted){
      this.setState({sendData})
    }
  }

  handleSave = (payload) => {
		if(this._isMounted){
      this.setOption(payload)
      if(this.props.uuid !== ""){
        this.props.update(this.state.sendData, this.props.uuid);
      } else {
        this.props.save(this.state.sendData);
      }
    }
  }

  toggleClose = () => {
    this.props.toggleClose()
  }

  resetForm = () => {
    let sendData = {...this.state.sendData}
    sendData.id = '';
    sendData.code = '';
    sendData.name = '';
    sendData.flag = '';
    sendData.status = '';
    this.setState({ sendData })
  }

  showByUUID = (id) => {
    if(this._isMounted){
      this.setState({loading: true})
      this.props.showMaterialType(id)
      .then((resp) => {
        let data = resp.data.data;
        let sendData = {...this.state.sendData}
        sendData.id = data.id;
        sendData.code = data.code;
        sendData.name = data.name;
        sendData.flag = data.flag;
        sendData.status = {
          value: data.status,
          label: statusName(data.status),
        }
      this.setState({sendData, loading: false})
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
            {this.props.uuid!==""?  "Edit" : "Form"} Material Type
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
            data={this.state.sendData}
            uuid={this.props.uuid}
            m_status={this.state.option_status}
					/>
          }
				</Modal>
			</div>
    );
  }
}

export default withTranslation() (ModalForm);