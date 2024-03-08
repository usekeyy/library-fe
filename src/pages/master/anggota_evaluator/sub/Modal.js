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
        // user_id: '',
        user_id: '',
        status: '',
        evaluator_id : this.props.evaluator_id
      },
      loadings: {
        purchasing_group_id: '',
      },
      isDisabled: {
        user_id: true,
      },
      select_params: {
        start: 0,
        length: 10,
      },
      //nambah
      user: [],//nambah
      m_purchasing_org: [],
      errors: {},
      error: false,
      loading: false
    }
  }

  componentDidMount() {
    this._isMounted = true;
    this.fetchUsers(false);
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

  fetchUsers = (newValue) => {
    console.log(newValue)
    if(this._isMounted){
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, purchasing_group_id: true },
      }));
      let select_params = newValue !== false ? {start: 0, select: newValue} : this.state.select_params;

      this.props.fetchUsers(select_params)
      .then((resp) => {

        let data = resp.data.data;
        let options = data.map((dt) => {
          return { value: dt.uuid, label: dt.name };
        })
        this.setState(({ loadings }) => ({
          loadings: { ...loadings, purchasing_group_id: false },
          user: options,
        }));
      })
      .catch((resp) => {
        this.setState(({ loadings }) => ({
          loadings: { ...loadings, purchasing_group_id: false },
        }));
        toastr.error(resp.data.message);
      });
    }
  }

  statusLabel (value){
    switch (value) {
      case "y" :
        return "Ketua"
      case "n" :
        return "Anggota"
      default: 
        return ""
    }
  }

  getUUID() {
    this.setState({ loading: true })
    this.props.showAnggotaEvaluator(this.props.uuid)
      .then((resp) => {
        console.log(resp)
        let data = resp.data.data;

        let sendData = { ...this.state.sendData }
        sendData.user_id = {
          value : data.user_id,
          label : data.user_name
        }
        sendData.status = {
          value: data.status,
          label: this.statusLabel(data.status),
        }
        this.setState({ sendData, loading: false })
      })
      .catch((resp) => {
        this.setState({ loading: false })
        toastr.error(resp.data.message)
      });
  }

  setOption(payload){
    let sendData = {...this.state.sendData}
    sendData.evaluator_id = payload.evaluator_id;
    sendData.status = payload.status.value;
    sendData.user_id = payload.user_id.value;
    sendData.evaluator_id = this.props.evaluator_id
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
          <ModalHeader toggle={() => this.toggleClose()}>{this.props.uuid !== "" ? "Update Anggota Evaluator" : "Tambah Anggota Evaluator"}</ModalHeader>
          {this.state.loading && (
            <center>
              <br />
              <ReactLoading type="cylon" color="#0f9e3e" />
              <br />
            </center>
          )}
          {this.state.loading === false && (
            <RouteForm
              fetchUsers={this.fetchUsers}
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