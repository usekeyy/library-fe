import React, { Component } from "react";
import { toastr } from "react-redux-toastr";
import { Modal, ModalHeader } from "reactstrap";
import RouteForm from "./Form";
import ReactLoading from "react-loading";
import { withTranslation } from 'react-i18next';

class ModalForm extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      data: [],
      error: false,
      loading: false,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.getUUID();
  }

  componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }

  toggleClose = () => {
    this.props.toggleClose();
  };

  getUUID() {
    if (this._isMounted) {
      this.setState({ loading: true });
      this.props.fetchHistoryInvoice(this.props.uuid)
      .then((resp) => {
          console.log('masuk')
          let data = resp.data.data;
          this.setState({ data: data, loading: false });
        })
        .catch((resp) => {
          this.setState({ loading: false });
          toastr.error(resp.data.message);;
        });
    }
  }

  render() {
    // const {t} = this.props;
    return (
      <div>
        <Modal isOpen={this.props.toggleOpen} toggle={() => this.toggleClose()} className="modal-lg">
          <ModalHeader toggle={() => this.toggleClose()}>History Approval</ModalHeader>
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
              error={this.state.error}
              data={this.state.data}
              uuid={this.props.uuid}
            />
          )}
        </Modal>
      </div>
    );
  }
}

export default withTranslation() (ModalForm);
