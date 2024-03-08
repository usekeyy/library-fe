import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import { Modal, ModalHeader } from 'reactstrap';
import RouteForm from './Form';
import ReactLoading from 'react-loading';
import { withTranslation } from 'react-i18next';

class ModalForm extends Component {
  // constructor(props) {
  //   super(props);
  // }
  state = {
    sendData: {
      id: '',
      name: '',
      description:'',
      coa_id:''
    },
    loading:false
    
  }

  componentDidMount() {
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
    this.props.showMaterialGroup(this.props.uuid)
      .then((resp) => {
        let data = resp.data.data;
        let sendData = { ...this.state.sendData }
        sendData.id = data.id;
        sendData.name = data.name;
        sendData.description = data.description;
        sendData.coa_id = {value: data.coa_id, label:data.coa_id + ' - ' +data.coa_name };
        this.setState({ sendData })
        this.setState({ loading: false })
      })
      .catch((resp) => {
        this.setState({ loading: false })
        toastr.error(resp.data.message);
      });
  }

  

  handleSave = (payload) => {
    if (this.props.uuid === "") {
      this.props.save(payload);
    } else {
      this.props.update(this.props.uuid, payload);
    }
  }

  render() {
    // const {t} = this.props;
    return (
      <div>
        <Modal isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()}>
          <ModalHeader toggle={() => this.toggleClose()}>{this.props.uuid !== "" ? 'Update Material Group' : 'Create Material Group'}</ModalHeader>
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
              save={(payload) => this.handleSave(payload)}
              errors={this.props.errors}
              isError={this.props.isError}
              loadingSubmit={this.props.loadingSubmit}
              data={this.state.sendData}
              uuid={this.props.uuid}
              loading={false}
            />
          )}
        </Modal>
      </div>
    );
  }
}

export default withTranslation()(ModalForm);