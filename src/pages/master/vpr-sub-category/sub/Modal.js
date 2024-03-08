import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import { Modal, ModalHeader } from 'reactstrap';
import RouteForm from './Form';
import ReactLoading from 'react-loading';
import { withTranslation } from 'react-i18next';
import {statusName} from '../../../../helpers/statusName';

class ModalForm extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      option_status: [
        {
          value: 'y',
          label: 'Actived',
        },
        {
          value: 'n',
          label: 'Inactived',
        },
      ],
      option_category : [],
      sendData: {
        vpr_category_id: '',
        description : '',
        status: 'y',
      },
      errors: {},
      error: false,
      loading: false,
      loading_category : false,
    }
  }

  componentDidMount() {
    this._isMounted = true;
    if (this.props.uuid !== "") {
      this.getUUID()
    }
    this.fetchCategory()
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

  
  fetchCategory() {
    this.setState({ loading_category: true })
    this.props.fetchVprCategory()
      .then((resp) => {
        let data = resp.data.data;
        console.log(data)
        const options = data.map((item) => {
          return {
            value : item.id,
            label : item.category
          }
        })
        this.setState({ option_category : options })
        this.setState({ loading_category: false })
      })
      .catch((resp) => {
        this.setState({ loading_category: false })
        toastr.error(resp.data.message)
      });
  }

  getUUID() {
    this.setState({ loading: true })
    this.props.showVprSubCategory(this.props.uuid)
      .then((resp) => {
        let data = resp.data.data;
        let sendData = { ...this.state.sendData }
        sendData.description = data.description;
        sendData.status = {
          value: data.status,
          label: statusName(data.status),
        }
        sendData.vpr_category_id = {
          value: data.vpr_category_id,
          label: data.category_name,
        }
        this.setState({ sendData })
        this.setState({ loading: false })
      })
      .catch((resp) => {
        this.setState({ loading: false })
        toastr.error(resp.data.message)
      });
  }

  setOption(payload){
    let sendData = {...this.state.sendData}
    sendData.description = payload.description;
    sendData.status = "y";
    if(payload.vpr_category_id){
      sendData.vpr_category_id = payload.vpr_category_id.value;
    }
    // if(payload.status){
    //   sendData.status = payload.status.value;
    // }
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
    return (
      <div>
        <Modal isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()}>
          <ModalHeader toggle={() => this.toggleClose()}>{this.props.uuid !== "" ? "Update VPR Sub Category" : "Create VPR Sub Category"}</ModalHeader>
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
              errors={this.props.errors}
              isError={this.props.isError}
              loadingSubmit={this.props.loadingSubmit}
              data={this.state.sendData}
              uuid={this.props.uuid}
              loading={false}
              m_status={this.state.option_status}
              m_category = {this.state.option_category}
              loading_category = {this.state.loading_category}
            />
          )}
        </Modal>
      </div>
    );
  }
}

export default withTranslation()(ModalForm);