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
        pr_number : '',
        detail_pr : ''
      },
      loadings: {
        pr_number : false,
        detail_pr : false
      },
      isDisabled: {
        pr_number : false,
        detail_pr : false
      },
      pr_number : [],
      detail_pr : [],
      error: false,
      loading: false,
      load: {
        loadingPrNumber : false,
        loadingDetailPr : false
      },
      loadingSubmit:false
    };
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      if (this.props.uuid !== "") {
        this.getUUID();
        this.getPR();
        // this.getDocumentTpe();
        // this.getSubDistrict(this.state.countries);
      }
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

  getUUID() {
    if (this._isMounted) {
      this.setState({ loading: true });
      this.props
        .showMonitoringMrsr(this.props.uuid)
        .then((resp) => {
          let data = resp.data.data;
          let sendData = { ...this.state.sendData };
          if (data.purchasing_requisition_id !== null){
            sendData.pr_number = {
              value: data.pr_uuid,
              label: data.pr_number,
            };
            sendData.detail_pr = data.purchasing_requisition_item_id;
            this.getDetailPR({value : data.pr_uuid})
          }

          this.setState({ sendData, loading: false });     
        })
        .catch((resp) => {
          this.setState({ loading: false });
          toastr.error(resp.data.message);;
        });
    }
  }

  getDocumentTpe() {
    let select_params = {start : 0, length : 10, company_id : this.props.company_id}
    this.props
      .fetchDocumentType(select_params)
      .then((resp) => {
        let data = resp.data.data;
        console.log(data)
        this.getPR(data[0].id);
        // let options = data.map((data) => {
        //   return { value: data.uuid, label: data.number };
        // }) 
        // this.setState({pr_number : options})        
      })
      .catch((resp) => {
        toastr.error(resp.data.status, resp.data.message);
      });
}

  getPR() {
      this.setState({ loading: true });
      // let select_params = {documentType : data}
      // if (data != "" || data != undefined){
      //     select_params = {documentType : data};
      // }
      this.props
        .fetchPR()
        .then((resp) => {
          let data = resp.data.data;
          let options = data.map((data) => {
            return { value: data.uuid, label: data.number };
          })
          this.setState({loading: false });  
          this.setState({pr_number : options})        
        })
        .catch((resp) => {
          this.setState({ loading: false });
          toastr.error(resp.data.message);;
        });
  }

  // getCountries = (newValue) => {
  //   if (newValue === undefined || newValue !== "") {
  //     this.setState(({ loadings }) => ({
  //       loadings: { ...loadings, country: true },
  //     }));
  //     let select_params = "";
  //     this.props
  //       .fetchCountries(select_params)
  //       .then((resp) => {
  //         let data = resp.data.data;
  //         let options = data.map((data) => {
  //           return { value: data.id, label: data.id +' - '+ data.name };
  //         });
  //         this.setState(({ loadings, countries }) => ({
  //           loadings: { ...loadings, country: false },
  //           countries: options,
  //         }));
  //       })
  //       .catch((resp) => {
  //         this.setState(({ loadings }) => ({
  //           loadings: { ...loadings, country: false },
  //         }));
  //         toastr.error(resp.data.message);;
  //       });
  //   }
  // };

  getDetailPR = (data) => {
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, detail_pr: true },
      }));
      this.props
        .showDetailPR(data.value)
        .then((resp) => {
          let data = resp.data.data;
          this.setState(({ loadings, detail_pr }) => ({
            loadings: { ...loadings, detail_pr: false },
            detail_pr: data.items,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, detail_pr: false },
          }));
          toastr.error(resp.data.message);;
        });
  };

  handleSave = (payload) => {
    if (this._isMounted) {
      if (this.props.uuid !== "") {
        this.props.update(this.props.uuid, payload);
      } else {
        // this.props.save(payload);
      }
    }
  };

  render() {
    // const {t} = this.props;
    return (
      <div>
        <Modal isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()} size="lg">
          <ModalHeader toggle={() => this.toggleClose()}>
            MSR-PR Relations
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
              error={this.state.error}
              data={this.state.sendData}
              uuid={this.props.uuid}
              loadings={this.state.loadings}
              isDisabled={this.state.isDisabled}
              pr_number={this.state.pr_number}
              detail_pr={this.state.detail_pr}
              loadingSubmit={this.props.loadingSubmit}
              getDetailPR={this.getDetailPR}
              getPR={this.getPR}
              load={this.state.load}
            />
          )}
        </Modal>
      </div>
    );
  }
}

export default withTranslation() (ModalForm);
