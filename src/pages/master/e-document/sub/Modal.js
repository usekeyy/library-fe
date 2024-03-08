import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import RouteForm from './Form';
// import ReactLoading from 'react-loading';
import { withTranslation } from 'react-i18next';
// import {statusName} from '../../../../helpers/statusName';

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
      sendData: {
        id: '',
        title: '',
        content: '',
        status: 'y',
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
    this.props.showEDocument(this.props.uuid)
      .then((resp) => {
        let data = resp.data.data;
        let sendData = { ...this.state.sendData }
        sendData.id = data.id;
        sendData.title = data.title;
        sendData.content = data.content;
        // sendData.status = {
        //   value: data.status,
        //   label: statusName(data.status),
        // }
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
    sendData.id = payload.id;
    sendData.title = payload.title;
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

  setData = (payload) => {
    let sendData = {...this.state.sendData}
    sendData.content = payload;
    this.setState({sendData})
  }

  render() {
    return (
      <div>
        <RouteForm
          toggleClose={this.toggleClose}
          save={this.handleSave}
          setData={this.setData}
          errors={this.props.errors}
          isError={this.props.isError}
          loadingSubmit={this.props.loadingSubmit}
          data={this.state.sendData}
          uuid={this.props.uuid}
          loading={false}
          m_status={this.state.option_status}
        />
      </div>
    );
  }
}

export default withTranslation()(ModalForm);