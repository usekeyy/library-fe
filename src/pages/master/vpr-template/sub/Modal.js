import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import { Modal, ModalHeader } from 'reactstrap';
import RouteForm from './Form';
import ReactLoading from 'react-loading';
import { withTranslation } from 'react-i18next';

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
        name: '',
        sub_category_id : ''
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
    this.props.fetchCategory()
    this.props.fetchSubCategory()
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
    this.props.showVprTemplate(this.props.uuid)
      .then((resp) => {
        let data = resp.data.data;
        let tempCategory = []
        for (const [key, value] of Object.entries(data.category)) {
          tempCategory.push({value : parseInt(key), label : value})
        }
        

        let sendData = { ...this.state.sendData }
        
        sendData.name = data.name;
        sendData.category = tempCategory
        sendData.sub_category_id = data.subcategory.map((data) => {
          return {
            value : data.vpr_subcategory_id,
            label : data.category + " - " + data.description,
            category_id : data.category_id
          }
        })
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
    sendData.name = payload.name;
    let tempSubCategoryId = []
    payload.subCategory.map((data) => {
        tempSubCategoryId.push(data.value)
    })
    sendData.sub_category_id = tempSubCategoryId
    // sendData.status = "y";
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
        <Modal isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()} size="lg">
          <ModalHeader toggle={() => this.toggleClose()}>{this.props.uuid !== "" ? "Update VPR Template" : "Create VPR Template"}</ModalHeader>
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
              propsState={this.props.propsState}
              loadings = {this.props.loadings}
            />
          )}
        </Modal>
      </div>
    );
  }
}

export default withTranslation()(ModalForm);