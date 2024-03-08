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
      sendData: {
        id: '',
        name: '',
        company_id: '',
        kuorum: '',
        tender_umum: '',
        pra_qualification: '',
        max_limit: '',
      },
      loadings: {
        company_id: true,
      },
      m_company: [],
      loading:false
    }
  }

  componentDidMount() {
    this._isMounted = true;
    this.fetchCompany()
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
    this.props.showMetodePengadaan(this.props.uuid)
      .then((resp) => {
        let data = resp.data.data;
        let sendData = { ...this.state.sendData }
        // sendData.id = data.id;
        sendData.name = data.name;
        if(data.company_id !== null)
        {
          sendData.company_id = {
            value: data.company_id,
            label: data.company_id + ' - ' + data.company_name,
          }
        }
        sendData.kuorum = data.kuorum;
        sendData.tender_umum = data.tender_umum;
        sendData.pra_qualification = data.pra_qualification;
        sendData.max_limit = data.max_limit;

        this.setState({ sendData, loading: false })
      })
      .catch((resp) => {
        this.setState({ loading: false })
        toastr.error(resp.data.message);
      });
  }

  setOption(payload){
    let sendData = {...this.state.sendData}
    sendData.name = payload.name;
		sendData.company_id = payload.company_id.value;
    sendData.kuorum = payload.kuorum;
    sendData.tender_umum = payload.tender_umum;
    sendData.pra_qualification = payload.pra_qualification;
    sendData.max_limit = payload.max_limit;

    if(this._isMounted){
      this.setState({sendData})
    }
  }

  handleSave = (payload) => {
    this.setOption(payload)
    if (this.props.uuid === "") {
      this.props.save(this.state.sendData);
    } else {
      this.props.update(this.props.uuid, this.state.sendData);
    }
  }

  fetchCompany = (newValue) => {
    if (newValue === undefined || newValue !== "") {
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, company_id: true },
      }));
      let select_params = "";
      this.props.fetchCompanies(select_params)
        .then((resp) => {
          let data = resp.data.data;
          let options = data.map((data) => {
            return { value: data.id, label: data.id + ' - ' + data.name };
          });
          this.setState(({ loadings, m_company }) => ({
            loadings: { ...loadings, company_id: false },
            m_company: options,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, company_id: false },
          }));
          toastr.error(resp.data.message);;
        });
    }
  };

  render() {
    // const {t} = this.props;
    return (
      <div>
        <Modal isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()}>
          <ModalHeader toggle={() => this.toggleClose()}>Metode Pengadaan</ModalHeader>
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
              loading={false}
              loadings={this.state.loadings}
              m_company={this.state.m_company}
            />
          )}
        </Modal>
      </div>
    );
  }
}

export default withTranslation()(ModalForm);