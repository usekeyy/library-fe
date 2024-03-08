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
    // console.log(this.props)
	}
	
  state = {
    data_reminder: [],
    // sendDt: {
		// 	id: '',
		// 	title: '',
		// 	content: '',
    // },
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
  
  // handleChange(e){
	// 	if(this._isMounted){
	// 		let sendDt = {...this.state.sendDt}
  //     sendDt[e.target.id] = e.target.value;
  //     this.setState({ sendDt })
	// 	}
  // }
  
  // handleSave = (payload) => {
	// 	if(this._isMounted){
  //     if(this.props.uuid !== ""){
  //       this.props.update(payload, this.props.uuid);
  //     } else {
  //       this.props.save(payload);
  //     }
  //   }
  // }

  toggleClose = () => {
    this.props.toggleClose()
  }

  showByUUID = (id) => {
    if(this._isMounted){
      this.setState({loading: true})
      this.props.showReminder(id)
      .then((resp) => {
        let datas = resp.data.data;
        this.setState({loading: false, data_reminder: datas})
      })
      .catch((resp) => {
        this.setState({loading: false})
        toastr.error(resp.data.message);
      });
    }
  }
	
  setData = (payload) => {
    let sendData = {...this.state.sendData}
    sendData.content = payload;
    this.setState({sendData})
  }

  render(){
    // const {t} = this.props;
    return (
      <div>
				<Modal className="modal-lg" isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()}>
					<ModalHeader toggle={() => this.toggleClose()}>{
            this.props.modalType === "edit" ? 'Edit' :
            this.props.modalType === "create" ? 'Create' :
            'Detail'} Reminder</ModalHeader>
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
            setData={this.setData}
            modalType={this.props.modalType}
            errors={this.props.errors}
						toggleClose={this.toggleClose}
						// save={(payload) => this.handleSave(payload)}
            // data={this.state.sendDt}
            data={this.state.data_reminder}
            uuid={this.props.uuid}
					/>
          }
				</Modal>
			</div>
    );
  }
}

export default withTranslation() (ModalForm);