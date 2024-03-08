import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import { Modal, ModalHeader } from 'reactstrap';
import RouteForm from './Form';
import ReactLoading from 'react-loading';
import { withTranslation } from 'react-i18next';

class ModalForm extends Component {
  constructor(props) {
    
    super(props);
    console.log(this.props.evaluator_id)
    this._isMounted = false;
    this.state = {
      sendData: {
        id : '',
        description : '',
        type : ''
      },
    //   isDisabled: {
    //     user_id: true,
    //   },
      select_params: {
        start: 0,
        length: 10,
      },
      errors: {},
      error: false,
      loading: false
    }
  }

  componentDidMount() {
    this._isMounted = true;
    if (this.props.uuid !== "") {
      this.getUUID()
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }

  toggleClose = () => {
    this.props.toggleClose()
  }

  getUUID() {
    this.setState({ loading: true })
    this.props.showConditionType(this.props.uuid)
      .then((resp) => {
        console.log(resp)
        let data = resp.data.data;

        let sendData = { ...this.state.sendData }
        sendData.id = data.id
        sendData.description = data.description
        sendData.type = data.type
        this.setState({ sendData, loading: false })
      })
      .catch((resp) => {
        this.setState({ loading: false })
        toastr.error(resp.data.message)
      });
  }

  setOption(payload){
    let sendData = {...this.state.sendData}
    sendData.id = payload.id;
    sendData.description = payload.description;
    sendData.type = payload.type;
    if(this._isMounted){
      this.setState({sendData})
    }
  }

  handleSave = (payload) => {
    if (this._isMounted) {
      this.setOption(payload)
      // console.log(this.state.sendData)
      if (this.props.uuid === "") {
        this.props.save("save", this.state.sendData);
      } else {
        this.props.update("update", this.props.uuid, this.state.sendData);
      }
    }
  }

  render() {
    // const {t} = this.props;
    return (
      <div>
        <Modal isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()}>
          <ModalHeader toggle={() => this.toggleClose()}>{this.props.uuid !== "" ? "Update Condition Type" : "Tambah Condition Type"}</ModalHeader>
          {this.state.loading && (
            <center>
              <br />
              <ReactLoading type="cylon" color="#0f9e3e" />
              <br />
            </center>
          )}
          {this.state.loading === false && (
            <RouteForm
            //   fetchUsers={this.fetchUsers}
              toggleClose={this.toggleClose}
              save={this.handleSave}
              errors={this.props.errors}
              isError={this.props.isError}
              isDisabled={this.state.isDisabled}
              loadingSubmit={this.props.loadingSubmit}
              user={this.state.user}
              data={this.state.sendData}
              uuid={this.props.uuid}
              loading={false}
              loadings={this.state.loadings}
            />
          )}
        </Modal>
      </div>
    );
  }
}

export default withTranslation()(ModalForm);