import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toastr} from 'react-redux-toastr';
import 'react-table/react-table.css';
import Table from './sub/Table';
import Form from './sub/Form';
import { Button, Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';

import {fetchExtendCompany, showExtendCompany, saveExtendCompany} from '../../../store/actions/vendor/extendCompanyActions';
import {fetchVendor, fetchDataVendor} from '../../../store/actions/vendor/vendorActions';
import {fetchCompanies} from '../../../store/actions/master/companyActions';

class ExtendCompany extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
	}
	
  state = {
		data_vendor: [],
		param_vendor: {
			uuid: this.props.user.has_roles.includes("VNDR01") ? this.props.user.uuid : ''
		},
		vendor_uuid: this.props.user.has_roles.includes("VNDR01") ? this.props.user.uuid : '',
		isVendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
		loading: false,
		isOpen: {
			form: false,
			modal: false,
		},
		extend_company: {
			data: [],
			sendData: {
				name: '',
				number: '',
				registration_number: '',
				vendor_id: this.props.user.has_roles.includes("VNDR01") ? this.props.user.username : '',
				status: '',
			},
			errors: [],
			vendors: [],
			companies: [],
			loading: true,
			loadingButton: false
		},
		vendor: {
			vendor_uuid: '',
			loading: false,
			isOpen: false,
		},
		loadings: {
			vendor: false,
			company: false,
		},
  }

  componentDidMount = () => {
		this._isMounted = true;
		this.fetchVendor()
		this.fetchDataVendor(this.state.param_vendor)
	}
	
	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
	}
	
	fetchVendor = (newValue) => {
    if(this._isMounted){
			// console.log(newValue);
      let select_params = (newValue !== '') ? {start: 0, length: 5, select: newValue} : {start: 0, length: 5};
      this.setState(({ loadings, extend_company }) => ({
				loadings: { ...loadings, vendor: true },
				extend_company: { ...extend_company, vendors: [] }
			}));
      this.props.fetchVendor(select_params)
      .then((resp) => {
		let m_plant = resp.data.data;
        let options = m_plant.map((dt) => {
          return { value: dt.uuid, label: dt.id+' - '+dt.name, id: dt.id, vendor_name: dt.name, sap_code: dt.sap_code };
        })
        this.setState(({ loadings, extend_company }) => ({
					loadings: { ...loadings, vendor: false },
					extend_company: { ...extend_company, vendors: options }
				}));
      })
      .catch((resp) => {
        let message = (typeof resp !== 'undefined') ? resp.message : 'Error';
					toastr.error('Failed Load Countries', message);
					this.setState(({ loadings, extend_company }) => ({
						loadings: { ...loadings, vendor: false },
						extend_company: { ...extend_company, vendors: [] }
					}));
      });
    }
	}
	
	fetchDataVendor = (param_vendor) => {
		if(this._isMounted){
		  this.props.fetchDataVendor(param_vendor).then((resp) => {
			let data = resp.data.data;
			this.setState(() => ({
				data_vendor: data[0],
			}));
		  })
		}
	}
	
	fetchCompanies = (newValue) => {
    if(this._isMounted){
      let select_params = (newValue !== '') ? {start: 0, length: 5, select: newValue} : {start: 0, length: 5};
      this.setState(({ loadings, extend_company }) => ({
				loadings: { ...loadings, company: true },
				extend_company: { ...extend_company, companies: [] }
			}));
      this.props.fetchCompanies(select_params)
      .then((resp) => {
        let m_plant = resp.data.data;
        let options = m_plant.map((dt) => {
          return { value: dt.id, label: dt.id+' - '+dt.name };
        })
        this.setState(({ loadings, extend_company }) => ({
					loadings: { ...loadings, company: false },
					extend_company: { ...extend_company, companies: options }
				}));
      })
      .catch((resp) => {
        let message = (typeof resp !== 'undefined') ? resp.message : 'Error';
					toastr.error('Failed Load Countries', message);
					this.setState(({ loadings, extend_company }) => ({
						loadings: { ...loadings, company: false },
						extend_company: { ...extend_company, companies: [] }
					}));
      });
    }
	}
	
	toggleFormOpen = (e) => {
		e.preventDefault();
		this.setState(({ isOpen }) => ({
			isOpen: { ...isOpen, form: true },
		}));
	}

	toggleFormClose = (e) => {
		e.preventDefault();
		this.setState(({ isOpen }) => ({
			isOpen: { ...isOpen, form: false },
		}));
	}

	setLoading = (type) => {
		this.setState({ loading: type})
	}

  render(){
		// const {t} = this.props;
		const {form} = this.state.isOpen;
    return (
      <div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">Home</li>
					<li className="breadcrumb-item">Vendor Management</li>
					<li className="breadcrumb-item active">Extend Company</li>
				</ol>
				<h1 className="page-header">Extend Company </h1>
				<Panel loading={false}>
					<PanelHeader>Extend Company Table</PanelHeader>
					<PanelBody loading={false}>
						<Row>
							<Col sm="6">
							</Col>
							<Col sm="6">
								<div className="pull-right m-b-10">
									{this.props.access.C && !form && this.state.data_vendor?.status === 'y' && <Button color="primary" size="sm" disabled={this.state.loading} onClick={(e) => this.toggleFormOpen(e)}>
										{this.state.loading && <i className="fas fa-spinner fa-pulse"></i> }
										Extend
									</Button>}
									{this.props.access.C && form && <Button color="danger" size="sm" disabled={this.state.loading} onClick={(e) => this.toggleFormClose(e)}>
										{this.state.loading && <i className="fas fa-spinner fa-pulse"></i> }
										Kembali
									</Button>}
								</div>
							</Col>
						</Row>
						{form && <Form 
							data={this.state.extend_company} 
							data_vendor={this.state.vendor}
							loadings={this.state.loadings} 
							vendor_uuid={this.state.vendor_uuid} 
							isVendor={this.state.isVendor} 
							t={this.props.t} 
							handleInputVendor={this.fetchVendor}  
							handleInputCompany={this.fetchCompanies}
							close={this.toggleFormClose}
							handleSave={this.props.saveExtendCompany}
							showExtendCompany={this.props.showExtendCompany}
							setLoading={this.setLoading}
						/>}
						{!form && <Table 
							fetchExtendCompany={this.props.fetchExtendCompany}
							setLoading={this.setLoading}
						/>}
					</PanelBody>
				</Panel>
			</div>
    );
  }
}

const stateToProps = state => {
	return {
		sidebarDt: state.sidebarDt,
		access: state.sidebarDt.access,
		user: state.auth.user.data,
		vendor: state.vendorProfile.vendor,
		getId: state.vendorProfile,
		verification: state.verification.verification
	}
}

const dispatchToProps = dispatch => {
	return {
		fetchExtendCompany: (params) => dispatch(fetchExtendCompany(params)),
		fetchVendor: (params) => dispatch(fetchVendor(params)),
		fetchDataVendor: (params) => dispatch(fetchDataVendor(params)),
		fetchCompanies: (params) => dispatch(fetchCompanies(params)),
		showExtendCompany: (vendor_uuid) => dispatch(showExtendCompany(vendor_uuid)),
		saveExtendCompany: (payload) => dispatch(saveExtendCompany(payload)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (ExtendCompany));