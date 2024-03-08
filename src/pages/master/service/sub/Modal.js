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
      deletion_flag: '',
      uom_id: '',
      service_category_id: '',
      material_group_id: '',
    },
    loading: false

  }

  componentDidMount() {
    if (this.props.uuid !== "") {
      this.getUUID()
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }

  toggleClose = () => {
    this.props.toggleClose()
  }

  getUUID() {
    this.setState({ loading: true })
    this.props.showService(this.props.uuid)
      .then((resp) => {
        let data = resp.data.data;
        let sendData = { ...this.state.sendData }
        sendData.id = data.id;
        sendData.name = data.name;
        sendData.deletion_flag = data.deletion_flag;
        sendData.uom_id = { value: data.uom_id, label: data.uom_id + ' - ' + data.uom_name };
        sendData.service_category_id = { value: data.service_category_id, label: data.service_category_id + ' - ' + data.service_category_name };
        sendData.material_group_id = { value: data.material_group_id, label: data.material_group_id + ' - ' + data.material_group_name };
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
    // const { t } = this.props;
    return (
      <div>
        <Modal isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()}>
          <ModalHeader toggle={() => this.toggleClose()}>{this.props.uuid !== "" ? 'Update Service' : 'Create Service'}</ModalHeader>
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
              optionsUom={this.props.optionsUom}
              optionsMaterialGroup={this.props.optionsMaterialGroup}
              optionsServiceCategory={this.props.optionsServiceCategory}
              loading={false}
              loadings={this.props.loadings}
              getUom={(payload) => this.props.getUom(payload)}
              getServiceCategory={(payload) => this.props.getServiceCategory(payload)}
              getMaterialGroup={(payload) => this.props.getMaterialGroup(payload)}
            />
          )}
        </Modal>
      </div>
    );
  }
}

export default withTranslation()(ModalForm);