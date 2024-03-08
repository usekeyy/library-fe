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
    user_length: [{
      index: 0
    }],
    loading: false
  }

  componentDidMount(){
		this._isMounted = true;
	}
	
	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }

  addUser = () => {
    let user_length = this.state.user_length
    user_length.push({index: user_length.length })
    this.setState({ user_length: user_length })
  }
  
  handleSave = (payload) => {
    let user_temp = []
    payload.sap_created_by.forEach(element => {
      if(element !== '') {
        user_temp.push(element)
      }      
    });

    payload.sap_created_by = user_temp.join(";")

    // console.log(payload)
    this.setState({ status_input: true })
    if(this._isMounted){
        this.props.sync(payload);
    }
  }

  toggleClose = () => {
    this.props.toggleClose()
  }

  render(){
    // const {t} = this.props;
    return (
      <div>
				<Modal isOpen={this.props.toggleSync} toggle={() => this.toggleClose()}>
					<ModalHeader toggle={() => this.toggleClose()}>
            Sync Data GR
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
              user_length={this.state.user_length}
              param_sync={this.props.param_sync}
              addUser={this.addUser}
              setOption={this.props.setOption}
              save={(payload) => this.handleSave(payload)}
              toggleClose={this.toggleClose}
					/>
          }
				</Modal>
			</div>
    );
  }
}

export default withTranslation() (ModalSync);