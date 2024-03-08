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
			user_id: '',
			user_sap: '',
    },
    user : [],
    loading: false,
    loadings : {
      user : false
    }
  }

  componentDidMount(){
		this._isMounted = true;
    if(this._isMounted){
      if(this.props.uuid !== ''){
        this.showByUUID(this.props.uuid);
      }

      this.getUser()
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
      payload.user_id = payload.user_id.value;
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
    sendDt.id = '';
    sendDt.user_id = '';
    sendDt.user_sap = '';
    this.setState({ sendDt })
  }

  showByUUID = (id) => {
    if(this._isMounted){
      this.setState({loading: true})
      this.props.showUserSap(id)
      .then((resp) => {
        let data = resp.data.data;
        let sendDt = {...this.state.sendDt}
        sendDt.id = data.id;
        sendDt.user_id = {
          value : data.user_id,
          label : data.user_id +' - '+data.user_name
        };
        sendDt.user_sap = data.user_sap;
        this.setState({sendDt, loading: false})
      })
      .catch((resp) => {
        this.setState({loading: false})
        toastr.error(resp.data.message);
      });
    }
  }

  getUser = (newValue) => {
    if (newValue === undefined || newValue !== "") {
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, user: true },
      }));
      let select_params = "";
        // newValue !== ""
        //   ? { start: 0, length: 10, select: newValue }
        //   : { start: 0, length: 10 };
      this.props
        .fetchUser(select_params)
        .then((resp) => {
          let data = resp.data.data;
          let options = data.map((data) => {
            return { value: data.id, label: data.id +' - '+data.username };
          });
          this.setState(({ loadings, user }) => ({
            loadings: { ...loadings, user: false },
            user: options,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, user: false },
          }));
          toastr.error(resp.data.message);;
        });
    }
  };
	
  render(){
    // const {t} = this.props;
    return (
      <div>
				<Modal isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()}>
					<ModalHeader toggle={() => this.toggleClose()}>
            {this.props.uuid!==""?  "Edit" : "Form"} Mapping User SAP
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
            loadings={this.state.loadings}
            errors={this.props.errors}
						toggleClose={this.toggleClose}
						save={(payload) => this.handleSave(payload)}
            data={this.state.sendDt}
            user={this.state.user}
            uuid={this.props.uuid}
					/>
          }
				</Modal>
			</div>
    );
  }
}

export default withTranslation() (ModalForm);