import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import RouteForm from './Form';
import { withTranslation } from 'react-i18next';
// import {statusName} from '../../../../helpers/statusName';

class ModalForm extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      options: [
        {
          value: 'free',
          label: 'Free Auction',
        },
        {
          value: 'eproc',
          label: 'Eproc Auction',
        },
      ],
      sendData: {
        type: '',
        rule: '',
      },
      errors: {},
      error: false,
      loading: false,
      loadings : {
        loading_get_data : true
      }
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
    this.setState(({ loadings }) => ({
        loadings: { ...loadings, loading_get_data: true },
        loading : true
    }));
    this.props.getDetailRulesAuction(this.props.uuid)
      .then((resp) => {
        let data = resp.data.data;
        let sendData = { ...this.state.sendData }
        sendData.uuid = data.uuid;
        sendData.type = (data.type==="free") ?  {
          value: 'free',
          label: 'Free Auction',
        } :  {
          value: 'eproc',
          label: 'Eproc Auction',
        };
        sendData.rule = data.rule;
        // sendData.status = {
        //   value: data.status,
        //   label: statusName(data.status),
        // }
        // this.setState({ sendData })
        // this.setState({ loading: false })
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, loading_get_data: false },
            loading : false,
            sendData : sendData
        }));
      })
      .catch((resp) => {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, loading_get_data: false },
            loading : false
        }));
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
      if (this.props.uuid === "") {
        this.props.save("save", {type :payload , rule : this.state.sendData.rule});
      } else {
        this.props.update("update", this.props.uuid, {type :payload , rule : this.state.sendData.rule});
      }
    }
  }

  setData = (payload) => {
    let sendData = {...this.state.sendData}
    sendData.rule = payload;
    this.setState({sendData})
  }

  render() {
    return (
      <div>
        <RouteForm
          toggleClose={this.toggleClose}
          save={(payload) => this.handleSave(payload)}
          setData={this.setData}
          errors={this.props.errors}
          isError={this.props.isError}
          loadingSubmit={this.props.loadingSubmit}
          data={this.state.sendData}
          loadings={this.state.loadings}
          uuid={this.props.uuid}
          loading={false}
          options={this.state.options}
        />
      </div>
    );
  }
}

export default withTranslation()(ModalForm);