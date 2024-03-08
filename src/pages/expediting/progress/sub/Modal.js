import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import { Modal, ModalHeader } from 'reactstrap';
import RouteForm from './Form';
import ReactLoading from 'react-loading';
import { withTranslation } from 'react-i18next';
// import {statusName, docCatName} from '../../../../helpers/statusName';

class ModalForm extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      sendData: {
        id: '',
        number: '',
        planning: '',
        realitation: '',
        progress_date: '',
        description: '',
        attachment: [],
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
    this.props.showProgress(this.props.uuid)
      .then((resp) => {
        let data = resp.data.data;
        // console.log(data)
        // return
        let sendData = { ...this.state.sendData }
        sendData.id = data.id;
        sendData.number = data.number;
        sendData.fealitation = data.fealitation;
        sendData.planning = data.planning;
        sendData.realitation = data.realitation;
        sendData.progress_date = data.progress_date;
        sendData.description = data.description;
        sendData.attachment = data.attachment;
        this.setState({ sendData, loading: false })
      })
      .catch((resp) => {
        this.setState({ loading: false })
        toastr.error(resp.data.message)
      });
  }

  setOption(payload){
    let sendData = {...this.state.sendData}
    if(this._isMounted){
      this.setState({sendData})
    }
  }

  handleSave = (payload) => {
    if (this._isMounted) {
      this.setOption(payload)
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
        <Modal isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()} className="modal-lg">
          <ModalHeader toggle={() => this.toggleClose()}>{
            this.props.modalType === "edit" ? 'Edit' :
            this.props.modalType === "create" ? 'Create' :
            'Detail'} Progress Barang & Jasa</ModalHeader>
          {this.state.loading && (
            <center>
              <br />
              <ReactLoading type="cylon" color="#0f9e3e" />
              <br />
            </center>
          )}
          {this.state.loading === false && (
            <RouteForm
              toggleClose={this.toggleClose}
              save={this.handleSave}
              loading={false}
              data={this.state.sendData}
              errors={this.props.errors}
              isError={this.props.isError}
              modalType={this.props.modalType}
              loadingSubmit={this.props.loadingSubmit}
            />
          )}
        </Modal>
      </div>
    );
  }
}

export default withTranslation()(ModalForm);