import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import { Modal, ModalHeader } from 'reactstrap';
import RouteForm from './Form';
import ReactLoading from 'react-loading';
import { withTranslation } from 'react-i18next';

class ModalPersyaratanTambahan extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      sendData: {
        description: '',
        file: '',
        attachment: '',
        proposal_tender_id: this.props.proposal_tender_id,
      },
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
    if(this.props.uuid){
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
    this.props.showPraQualificationPersyaratanTambahan(this.props.uuid, {proposal_tender_id: this.props.proposal_tender_id})
      .then((resp) => {
        let data = resp.data.data;
        let sendData = { ...this.state.sendData };
        sendData.description = data.description;
        sendData.attachment = data.attachment;
        sendData.file = data.file;
        this.setState({ sendData, loading: false });
      })
      .catch((resp) => {
        this.setState({ loading: false })
        toastr.error(resp.data.message)
      });
  }

  setOption(payload){
    let sendData = {...this.state.sendData}
    // sendData.name = payload.name;
    sendData.description = payload.description;
    sendData.attachment = payload.attachment;
    sendData.file = payload.file_name;
    if(this._isMounted){
      this.setState({sendData})
    }
  }

  handleSave = (payload) => {
    if (this._isMounted) {
      this.setOption(payload)
      // console.log(this.state.sendData)
      if(this.props.uuid !== ''){
        this.props.updatePersyaratanDetail(this.state.sendData, this.props.uuid);
      }
      else{
        this.props.savePersyaratanDetail(this.state.sendData);
      }
    }
  }

  changeAttachment = (payload) => {
    let sendData = {...this.state.sendData}
    sendData.attachment = payload;
    this.setState({ sendData });
  }

  render() {
    // const {t} = this.props;
    return (
      <div>
        <Modal isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()}>
          <ModalHeader>Persyaratan Tambahan</ModalHeader>
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
              changeAttachment={this.changeAttachment}
              status_attachment_file={this.props.status_attachment_file}
              upload={this.props.fileUpload}
              save={this.handleSave}
              errors={this.props.errors}
              data={this.state.sendData}
              uuid={this.props.uuid}
              load={this.state.load}
              loadingSubmit={this.props.loadingSubmit}
            />
          )}
        </Modal>
      </div>
    );
  }
}

export default withTranslation()(ModalPersyaratanTambahan);