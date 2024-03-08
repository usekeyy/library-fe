import React, {Component} from 'react';
// import {toastr} from 'react-redux-toastr';
import { Modal, ModalHeader } from 'reactstrap';
import FormSync from './FormSync';
import ReactLoading from 'react-loading';
import { withTranslation } from 'react-i18next';

class ModalSync extends Component {
	constructor(props) {
    super(props);
    this._isMounted = false;
	}
	
  state = {
    sendDt: {
			// type: '',
			created_start: '',
			created_end: '',
			updated_start: '',
			updated_end: '',
    },
    status_input: true,
    loading: false
  }

  componentDidMount(){
		this._isMounted = true;
	}
	
	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.resetForm()
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
    this.setState({ status_input: true })
    if(this._isMounted){
      // let result = !Object.values(payload).every(o => o === '');
      // if (!result){
      //   this.setState({ status_input: false })
      // }
      // else{
        this.props.sync(payload);
      // }
    }
  }

  toggleClose = () => {
    this.props.toggleClose()
  }

  resetForm = () => {
    let sendDt = {...this.state.sendDt}
    // sendDt.type = '';
    sendDt.created_start = '';
    sendDt.created_end = '';
    sendDt.updated_start = '';
    sendDt.updated_end = '';
    this.setState({ sendDt })
  }

  render(){
    // const {t} = this.props;
    return (
      <div>
				<Modal isOpen={this.props.toggleSync} toggle={() => this.toggleClose()}>
					<ModalHeader toggle={() => this.toggleClose()}>
            Sync Data Sub Bidang Usaha (SAP)
          </ModalHeader>
          {this.state.loading && (
            <center>
              <br/>
              <ReactLoading type="cylon" color="#0f9e3e" />
              <br/>
            </center>
          )}
          {this.state.loading === false && 
            <FormSync
            loading={this.props.loading}
            errors={this.props.errors}
						toggleClose={this.toggleClose}
						save={(payload) => this.handleSave(payload)}
            data={this.state.sendDt}
            uuid={this.props.uuid}
            status_input={this.state.status_input}
            parentState={this.props.datas}
            // fetchMaterialType={this.props.fetchMaterialType}
					/>
          }
				</Modal>
			</div>
    );
  }
}

export default withTranslation() (ModalSync);