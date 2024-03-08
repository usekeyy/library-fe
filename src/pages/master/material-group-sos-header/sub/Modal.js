import React, { Component } from "react";
import { toastr } from "react-redux-toastr";
import { Modal, ModalHeader } from "reactstrap";
import RouteForm from "./Form";
import ReactLoading from "react-loading";
import { withTranslation } from 'react-i18next';
import {statusName} from '../../../../helpers/statusName';

class ModalForm extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      sendData: {
        // id: '',
        material_group_id: '',
        bidang_usaha_id: '',
        status: 'y',
      },
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
      loadings: {
        material_group: true,
        bidang_usaha: true,
      },
      m_material_group: [],
      m_bidang_usaha: [],
      loading: false,
      loadingSubmit: false
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.getMaterialGroup()
    this.getBidangUsaha()
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

  getMaterialGroup = (newValue) => {
    if (newValue === undefined || newValue !== "") {
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, material_group: true },
      }));
      let select_params = "";
        // newValue !== ""
        //   ? { start: 0, length: 10, select: newValue }
        //   : { start: 0, length: 10 };
      this.props.fetchMaterialGroup(select_params)
        .then((resp) => {
          let data = resp.data.data;
          // console.log(data);
          let options = data.map((data) => {
            return { value: data.id, label: data.id + ' - ' + data.name };
          });
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, material_group: false },
            m_material_group: options,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, material_group: false },
          }));
          toastr.error(resp.data.message);;
        });
    }
  };
  
  getBidangUsaha = (newValue) => {
    if (newValue === undefined || newValue !== "") {
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, bidang_usaha: true },
      }));
      let select_params = "";
        // newValue !== ""
        //   ? { start: 0, length: 10, select: newValue }
        //   : { start: 0, length: 10 };
      this.props.fetchBidangUsaha(select_params)
        .then((resp) => {
          let data = resp.data.data;
          // console.log(data);
          let options = data.map((data) => {
            return { value: data.id, label: data.id + ' - ' + data.name };
          });
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, bidang_usaha: false },
            m_bidang_usaha: options,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, bidang_usaha: false },
          }));
          toastr.error(resp.data.message);;
        });
    }
  };
  
  getUUID() {
    if (this._isMounted) {
      this.setState({ loading: true });
      this.props.showMaterialGroupSosHeader(this.props.uuid)
        .then((resp) => {
          let data = resp.data.data;
          console.log(data)
          let sendData = { ...this.state.sendData };
          // sendData.id = data.id;
          sendData.material_group_id = {
            value: data.material_group_id,
            label: data.material_group_id + ' - ' + data.material_group_name,
          }
          sendData.bidang_usaha_id = {
            value: data.bidang_usaha_id,
            label: data.bidang_usaha_id + ' - ' + data.bidang_usaha_name,
          }
          sendData.status = {
            value: data.status,
            label: statusName(data.status),
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
    // sendData.id = payload.id;
    sendData.material_group_id = payload.material_group_id.value;
    sendData.bidang_usaha_id = payload.bidang_usaha_id.value;
    if(payload.status){
      sendData.status = payload.status.value;
    }
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
            {this.props.uuid !== "" ? t("materialGroupSosHeader:modal.title-update") : t("materialGroupSosHeader:modal.title-create")}
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
              m_material_group={this.state.m_material_group}
              m_bidang_usaha={this.state.m_bidang_usaha}
              loadings={this.state.loadings}
              load={this.state.load}
              m_status={this.state.option_status}
            />
          )}
        </Modal>
      </div>
    );
  }
}

export default withTranslation()(ModalForm);
