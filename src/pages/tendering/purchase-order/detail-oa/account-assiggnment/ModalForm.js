import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import { Modal, ModalHeader } from 'reactstrap';
import ReactLoading from "react-loading";
import Form from './Form'

import { fetchGlAccount } from '../../../../../store/actions/master/glAccountActions'
import { fetchAccAssignmentCategory } from '../../../../../store/actions/master/accAssignmentCategoryActions'
import { fetchCostCenter } from '../../../../../store/actions/master/costCenterActions'
import { fetchWbsProject } from '../../../../../store/actions/master/wbsProjectActions'
import { fetchAssets } from '../../../../../store/actions/master/assetsActions'


class ModalForm extends Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      GlAccount: [],
      cost_center: [],
      wbs_element: [],
      assets: [],
      accAssgnCategory: [],
      sendData: {
        account_category_id: '',
        account_category_name: '',
        account_category_number: '',
        gl_account: '',
      },
      loadings: {
        glaccount: false,
        acc_assgn_category: false,
        cost_center: false,
        wbs_element: false,
        assets: false,
      },
      loading: true,
      paramPlant: {
        start: 0,
        length: 10,
        id: '',
        select: ''
      },
    }
  }

  componentDidMount = () => {
    this._isMounted = true
    if (this._isMounted) {
      if (this.props.data[0].acc_assignment_category_id !== null) {
        this.getUUID()
      }
      else {
        this.setState({ loading: false }, () => {
          this.fetchAssets();
          this.fetchCostCenter();
          this.fetchWbsProject();
          this.fetchGlAccount();
          this.fetchAccAssignmentCategory();
        })
      }
    }
  }

  toggleClose = () => {
    this.props.toggleClose();
  };

  componentWillUnmount = () => {
    this._isMounted = false
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }

  toggleClose = () => {
    this.props.toggleClose()
  }

  getUUID() {
    let data = this.props.data;
    let sendData = { ...this.state.sendData };
    if (data[0].gl_account !== null) {
      sendData.gl_account = {
        value: data[0].gl_account,
        label: data[0].gl_account + ' - ' + data[0].gl_account_name
      };
    }
    if (data[0].acc_assignment_category_id !== null) {
      sendData.account_category_id = {
        value: data[0].acc_assignment_category_id,
        label: data[0].acc_assignment_category_id + ' - ' + data[0].acc_assignment_category_name
      };
    }
    if (data[0].acc_assignment_category_id !== null) {
      if (data[0].acc_assignment_category_id === 'K' && data[0].acc_assignment_category_number !== null) {
        this.props.fetchCostCenter({id: data[0].acc_assignment_category_number})
          .then((resp) => {
            let datas = resp.data.data;
            sendData.account_category_number = {
              value: datas[0].id,
              label: datas[0].id + ' - ' + datas[0].name
            };
            this.setState({ sendData, loading: false }, () => {
              this.fetchAssets();
              this.fetchCostCenter();
              this.fetchWbsProject();
              this.fetchGlAccount();
              this.fetchAccAssignmentCategory();
            });
          })
      }
      else if (data[0].acc_assignment_category_id === 'A' && data[0].acc_assignment_category_number !== null) {
        this.props.fetchAssets({id: data[0].acc_assignment_category_number})
          .then((resp) => {
            let datas = resp.data.data;
            sendData.account_category_number = {
              value: datas[0].id,
              label: datas[0].id + ' - ' + datas[0].name
            };
            this.setState({ sendData }, () => {
              this.fetchAssets();
              this.fetchCostCenter();
              this.fetchWbsProject();
              this.fetchGlAccount();
              this.fetchAccAssignmentCategory();
            });
          })
      }
      else if ((data[0].acc_assignment_category_id === 'P' || data[0].acc_assignment_category_id === 'Q') && data[0].acc_assignment_category_number !== null) {
        this.props.fetchWbsProject({id: data[0].acc_assignment_category_number})
          .then((resp) => {
            let datas = resp.data.data;
            sendData.account_category_number = {
              value: datas[0].id,
              label: datas[0].id + ' - ' + datas[0].name
            };
            this.setState({ sendData }, () => {
              this.fetchAssets();
              this.fetchCostCenter();
              this.fetchWbsProject();
              this.fetchGlAccount();
              this.fetchAccAssignmentCategory();
            });
          })
      }
      else if ((data[0].acc_assignment_category_id === 'F' || data[0].acc_assignment_category_id === 'N') && data[0].acc_assignment_category_number !== null) {
        sendData.account_category_number = data[0].acc_assignment_category_number
        this.setState({ sendData }, () => {
          this.fetchAssets();
          this.fetchCostCenter();
          this.fetchWbsProject();
          this.fetchGlAccount();
          this.fetchAccAssignmentCategory();
        });
      }
    }
    else {
      this.setState({ sendData }, () => {
        this.fetchAssets();
        this.fetchCostCenter();
        this.fetchWbsProject();
        this.fetchGlAccount();
        this.fetchAccAssignmentCategory();
      });
    }
  }

  fetchAssets = (params) => {
    if (this._isMounted) {
      if (params !== undefined) {
        this.setState(({ loadings, assets }) => ({
          loadings: { ...loadings, assets: true },
          assets: []
        }));
      }
      let select_params =
        (params !== undefined && params.select !== '') ?
          { start: 0, length: 10, select: params.selected, company_id: this.props.user.company_id }
          : { start: 0, length: 10, company_id: this.props.user.company_id };
      this.props
        .fetchAssets(select_params)
        .then((resp) => {
          let data = resp.data.data;
          let options = data.map((data) => {
            return { value: data.id, label: data.id + " - " + data.description };
          });
          this.setState(({ loadings, assets }) => ({
            loadings: { ...loadings, assets: false },
            assets: options,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, assets: false },
          }));
          toastr.error("FAILED LOAD DATA ASSETS");
        });
    }
  }

  fetchCostCenter = (params) => {
    if (this._isMounted) {
      if (params !== undefined) {
        this.setState(({ loadings, cost_center }) => ({
          loadings: { ...loadings, cost_center: true },
          cost_center: []
        }));
      }
      let select_params =
        (params !== undefined && params.select !== '') ?
          { start: 0, length: 10, select: params.selected, company_id: this.props.user.company_id }
          : { start: 0, length: 10, company_id: this.props.user.company_id };
      this.props
        .fetchCostCenter(select_params)
        .then((resp) => {
          let data = resp.data.data;
          let options = data.map((data) => {
            return { value: data.id, label: data.id + " - " + data.description };
          });
          this.setState(({ loadings, cost_center }) => ({
            loadings: { ...loadings, cost_center: false },
            cost_center: options,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, cost_center: false },
          }));
          toastr.error("FAILED LOAD DATA COST CENTER");
        });
    }
  }

  fetchWbsProject = (params) => {
    if (this._isMounted) {
      if (params !== undefined) {
        this.setState(({ loadings, wbs_element }) => ({
          loadings: { ...loadings, wbs_element: true },
          wbs_element: []
        }));
      }
      let select_params =
        (params !== undefined && params.select !== '') ?
          { start: 0, length: 10, select: params.selected, company_id: this.props.user.company_id }
          : { start: 0, length: 10, company_id: this.props.user.company_id };
      this.props
        .fetchWbsProject(select_params)
        .then((resp) => {
          let data = resp.data.data;
          let options = data.map((data) => {
            return { value: data.id ,label: data.id + " - " + data.description };
          });
          this.setState(({ loadings, wbs_element }) => ({
            loadings: { ...loadings, wbs_element: false },
            wbs_element: options,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, wbs_element: false },
          }));
          toastr.error("FAILED LOAD DATA WBS ELEMENT");
        });
    }
  }

  fetchGlAccount = (newValue) => {
    if (newValue === undefined || newValue !== "") {
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, glaccount: true },
      }));
      let select_params =
        newValue !== ""
          ? { start: 0, length: 10, select: newValue }
          : { start: 0, length: 10 };
      this.props
        .fetchGlAccount(select_params)
        .then((resp) => {
          let data = resp.data.data;
          let options = data.map((data) => {
            return { value: data.id, label: data.id + " - " + data.name };
          });
          this.setState(({ loadings, glaccount }) => ({
            loadings: { ...loadings, glaccount: false },
            GlAccount: options,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, glaccount: false },
          }));
          toastr.error("FAILED LOAD DATA GL ACCOUNT");
        });
    }
  }

  fetchAccAssignmentCategory = (newValue) => {
    if (newValue === undefined || newValue !== "") {
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, acc_assgn_category: true },
      }));
      this.props
        .fetchAccAssignmentCategory()
        .then((resp) => {
          let data = resp.data.data;
          let options = data.map((data) => {
            return { value: data.id, label: data.id + " - " + data.name };
          });
          this.setState(({ loadings, acc_assgn_category }) => ({
            loadings: { ...loadings, acc_assgn_category: false },
            accAssgnCategory: options,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, acc_assgn_category: false },
          }));
          toastr.error("FAILED LOAD DATA ACC ASSIGMENT CATEGORY");
        });
    }
  }

  save = (payload) => {
    let param_number = null
    Object.keys(payload).forEach((key) => {
      if (key !== 'account_category_id' && key !== 'account_category_name' && key !== 'gl_account_id') {
        if (payload[key] !== null && payload[key] !== '') {
          param_number = payload[key]
        }
      }
    });
    
    let param = {
      po_item_id: this.props.po_item_id,
      acc_assignment_category_id: payload.account_category_id,
      acc_assignment_category_name: payload.account_category_name,
      acc_assignment_category_number: param_number,
      gl_account: payload.gl_account_id,
    }
    // console.log(param)
    this.props.updateAccountAssignment(param)
  }

  render() {
    // const { t } = this.props;
    return (
      <div>
        <Modal isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()}>
          <ModalHeader toggle={() => this.toggleClose()}>Modal Account Assignment</ModalHeader>
          {this.state.loading && (
            <center>
              <br />
              <ReactLoading type="cylon" color="#0f9e3e" />
              <br />
            </center>
          )}
          {this.state.loading === false && (
            <Form
              optionsAssets={this.state.assets}
              optionsWbs_element={this.state.wbs_element}
              optionsCost_center={this.state.cost_center}
              optionsAccAssgnCategory={this.state.accAssgnCategory}
              optionsGlAccount={this.state.GlAccount}
              toggleClose={this.toggleClose}
              getGlAccount={(payload) => this.fetchGlAccount(payload)}
              getAssets={(payload) => this.fetchAssets(payload)}
              getCostCenter={(payload) => this.fetchCostCenter(payload)}
              getWbsProject={(payload) => this.fetchWbsProject(payload)}
              isLoading={this.state.loadings}
              save={(payload) => this.save(payload)}
              disableModal={this.props.disableModal}
              data={this.state.sendData}
            />
          )}
        </Modal>
      </div>
    );
  }
}
const stateToProps = state => {
  return {
    user: state.auth.user.data,
  }
}

const dispatchToProps = dispatch => {
  return {
    fetchCostCenter: (params) => dispatch(fetchCostCenter(params)),
    fetchWbsProject: (params) => dispatch(fetchWbsProject(params)),
    fetchAssets: (params) => dispatch(fetchAssets(params)),
    fetchGlAccount: (params) => dispatch(fetchGlAccount(params)),
    fetchAccAssignmentCategory: (params) => dispatch(fetchAccAssignmentCategory(params)),
  }
}

export default connect(stateToProps, dispatchToProps)((ModalForm));
