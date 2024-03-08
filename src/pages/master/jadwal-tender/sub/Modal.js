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
      sendData: {
        id: '',
        name: '',
        metode_penyampaian_id: '',
        order: '',
        code: '',
        status: 'y',
      },
      loadings: {
        metode_penyampaian: true,
      },
      m_metode_penyampaian: [],
      loading: false,
      loadingSubmit: false
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.getMetodePenyampaian()
    if (this.props.uuid !== "") {
      this.getUUID();
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
    this.props.toggleClose();
  };

  getMetodePenyampaian = (newValue) => {
    if (newValue === undefined || newValue !== "") {
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, metode_penyampaian: true },
      }));
      let select_params = "";
        // newValue !== ""
        //   ? { start: 0, length: 10, select: newValue }
        //   : { start: 0, length: 10 };
      this.props.fetchMetodePenyampaian(select_params)
        .then((resp) => {
          let data = resp.data.data;
          // console.log(data);
          let options = data.map((data) => {
            return { value: data.id, label: data.name };
          });
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, metode_penyampaian: false },
            m_metode_penyampaian: options,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, metode_penyampaian: false },
          }));
          toastr.error(resp.data.message);;
        });
    }
  };
  
  getUUID() {
    if (this._isMounted) {
      this.setState({ loading: true });
      this.props.showJadwalTender(this.props.uuid)
        .then((resp) => {
          let data = resp.data.data;
          let sendData = { ...this.state.sendData };
          sendData.id = data.id;
          sendData.name = data.name;
          sendData.order = data.order;
          sendData.code = data.code;
          sendData.metode_penyampaian_id = {
            value: data.metode_penyampaian_id,
            label: data.metode_penyampaian_id + ' - ' + data.metode_penyampaian_name,
          }
          this.setState({ sendData, loading: false });
        })
        .catch((resp) => {
          this.setState({ loading: false });
          toastr.error(resp.data.message);;
        });
    }
  }
  
  setOption(payload){
    let sendData = {...this.state.sendData}
    sendData.id = payload.id;
    sendData.name = payload.name;
    sendData.order = payload.order;
    sendData.code = payload.code;
    sendData.metode_penyampaian_id = payload.metode_penyampaian_id.value;
    if(this._isMounted){
      this.setState({sendData})
    }
  }

  handleSave = (payload) => {
    if (this._isMounted) {
      this.setOption(payload);
      if (this.props.uuid !== "") {
        this.props.update(this.props.uuid, this.state.sendData);
      } else {
        this.props.save(this.state.sendData);
      }
    }
  };

  render() {
    const { t } = this.props;
    return (
      <div>
        <Modal isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()}>
          <ModalHeader toggle={() => this.toggleClose()}>
            {this.props.uuid !== "" ? t("jadwalTender:modal.title-update") : t("jadwalTender:modal.title-create")}
          </ModalHeader>
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
              data={this.state.sendData}
              uuid={this.props.uuid}
              loadingSubmit={this.props.loadingSubmit}
              m_metode_penyampaian={this.state.m_metode_penyampaian}
              loadings={this.state.loadings}
              load={this.state.load}
            />
          )}
        </Modal>
      </div>
    );
  }
}

export default withTranslation()(ModalForm);
