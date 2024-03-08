import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toastr} from 'react-redux-toastr';
import 'react-table/react-table.css';
import Table from './sub/Table';
import { Button, Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';

import {fetchRegistrasiVendor, showRegistrasiVendor, saveRegistrasiVendor} from '../../../store/actions/vendor/registrasiVendorActions';
// import {fetchVendor} from '../../../store/actions/vendor/vendorActions';
// import {fetchCompanies} from '../../../store/actions/master/companyActions';

class RegistrasiVendor extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
	}
	
  state = {
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
		// this.fetchVendor()
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
					toastr.error(resp.data.status, resp.data.message);
					this.setState(({ loadings, extend_company }) => ({
						loadings: { ...loadings, vendor: false },
						extend_company: { ...extend_company, vendors: [] }
					}));
      });
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
					toastr.error(resp.data.status, resp.data.message);
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
					<li className="breadcrumb-item active">Registrasi Vendor Oleh Requestor</li>
				</ol>
				<h1 className="page-header">Registrasi Vendor Oleh Requestor </h1>
				<Panel loading={false}>
					<PanelHeader>Registrasi Vendor Oleh Requestor Table</PanelHeader>
					<PanelBody loading={false}>
						<Row>
							<Col sm="6">
							</Col>
							<Col sm="6">
								<div className="pull-right m-b-10">
									{<Button color="primary" size="sm" disabled={this.state.loading} onClick={(e) => this.props.history.push('/vendor/registration/form')}>
										{this.state.loading && <i className="fas fa-spinner fa-pulse"></i> }
										Registrasi
									</Button>}
								</div>
							</Col>
						</Row>
						{!form && <Table 
							fetchRegistrasiVendor={this.props.fetchRegistrasiVendor}
							setLoading={this.setLoading}
							parentProps={this.props}
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
		fetchRegistrasiVendor: (params) => dispatch(fetchRegistrasiVendor(params)),
		showRegistrasiVendor: (vendor_uuid) => dispatch(showRegistrasiVendor(vendor_uuid)),
		saveRegistrasiVendor: (payload) => dispatch(saveRegistrasiVendor(payload)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (RegistrasiVendor));