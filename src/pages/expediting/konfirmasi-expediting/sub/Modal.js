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
    data_konfirmasi: [],
    sendDt: {
			id: '',
			po_id: '',
			comment: '',
			attachment: '',
			reply_to: '',
    },
    loading: true
  }

  componentDidMount(){
		this._isMounted = true;
    if(this._isMounted){
      if(this.props.uuid !== ''){
        this.showByUUID(this.props.uuid);
      }
    }
	}

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.statusUpdate !== prevProps.statusUpdate) {
      this.setState({loading: true}, () => {
        this.props.setStatusUpdate()
        this.componentDidMount()
      })
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
  

  saveKonfirmasi = (payload) => {
    this.props.saveKonfirmasi(payload)
      .then((resp) => {
          toastr.success(resp.data.message);
      })
      .catch(error => {
          if (error !== undefined) {
              this.setState({ errors: error.data.errors })
          } else {
              toastr.error('Opps Somethings Wrong')
          }
      })
  }

  handleSave = (payload) => {
    if(this._isMounted){
      let sendDt = this.state.sendDt
      sendDt.comment = payload.comment
      sendDt.po_id = this.state.data_konfirmasi.po_id
      this.props.save(sendDt);
    }
  }

  toggleClose = () => {
    this.props.toggleClose()
  }

  showByUUID = (id) => {
    if(this._isMounted){
      this.setState({loading: true})
      this.props.showKonfirmasi(id)
      .then((resp) => {
        let datas = resp.data.data;
        let reply = resp.data.data.reply;
        delete datas['reply']
        
        let new_data = []
        new_data.push(datas)
        reply.forEach(element => {          
          new_data.push(element)
        });

        datas['reply'] = new_data
        let sendDt = {...this.state.sendDt}
        sendDt.reply_to = datas.id;
        // console.log(resp)
        this.setState({loading: false, data_konfirmasi: datas, sendDt })
      })
      .catch((resp) => {
        this.setState({loading: false})
        toastr.error(resp.data.message);
      });
    }
  }

  setOptionKonfirmasi = (payload) => {
			let sendDt = {...this.state.sendDt}
      sendDt['attachment'] = payload;
      this.setState({ sendDt })
}
	
  render(){
    // const {t} = this.props;
    return (
      <div>
				<Modal className="modal-lg" isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()}>
					<ModalHeader toggle={() => this.toggleClose()}>{
            this.props.modalType === "edit" ? 'Edit' :
            this.props.modalType === "create" ? 'Create' :
            'Detail'} Konfirmasi Expediting</ModalHeader>
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
            upload={this.props.fileUpload}
						save={(payload) => this.handleSave(payload)}
            setOptionKonfirmasi={this.setOptionKonfirmasi}
            data_param={this.state.sendDt}
            data={this.state.data_konfirmasi}
            uuid={this.props.uuid}
					/>
          }
				</Modal>
			</div>
    );
  }
}

export default withTranslation() (ModalForm);