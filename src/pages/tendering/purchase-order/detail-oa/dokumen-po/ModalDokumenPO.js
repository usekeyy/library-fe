import React, { Component } from 'react';
import { Modal, ModalHeader } from 'reactstrap';
import FormDokumenPO from './FormDokumenPO';
import { withTranslation } from 'react-i18next';

class ModalDokumenPO extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      errors: {},
      error: false,
      loading: false
    }
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }

  toggleClose = (e) => {
    e.preventDefault()
    this.props.toggleClose()
  }

  render() {
    // const {t} = this.props;
    return (
      <div>
        <Modal isOpen={this.props.modalDokumenPO} toggle={(e) => this.toggleClose(e)}>
          <ModalHeader>Dokumen PO</ModalHeader>
          <FormDokumenPO
            toggleClose={this.toggleClose}
            status_dokumen_po={this.props.status_dokumen_po}
            upload={this.props.fileUpload}
            save={this.props.saveDokumenPO}
            errors={this.props.errors}
          />
        </Modal>
      </div>
    );
  }
}

export default withTranslation()(ModalDokumenPO);