import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toastr} from 'react-redux-toastr';
import 'react-table/react-table.css';
import Table from './sub/Table';
import { Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';

import {fetchDataVendor} from '../../../store/actions/vendor/vendorActions';
import {fetchProfileVendor} from '../../../store/actions/vendor/profile-vendor/perusahaanActions';
import {vendorResponse} from '../../../store/actions/vendor/profile-vendor/perusahaanActions';

class VendorApplicant extends Component {
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
		this.props.vendorResponse({type: false});
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
					<li className="breadcrumb-item active">Daftar Vendor Applicant</li>
				</ol>
				<h1 className="page-header">Daftar Vendor Applicant </h1>
				<Panel loading={false}>
					<PanelHeader>Daftar Vendor Applicant Table</PanelHeader>
					<PanelBody loading={false}>
						<Row>
							<Col sm="6">
							</Col>
							<Col sm="6">
							</Col>
						</Row>
						{!form && <Table 
							fetchDataVendor={this.props.fetchDataVendor}
							setLoading={this.setLoading}
							parentProps={this.props}
							fetchProfileVendor={this.props.fetchProfileVendor}
							history={this.props.history}
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
		vendorResponse: (params) => dispatch(vendorResponse(params)),
		fetchDataVendor: (params) => dispatch(fetchDataVendor(params)),
		fetchProfileVendor: (vendor_uuid, verif_uuid) => dispatch(fetchProfileVendor(vendor_uuid, verif_uuid)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (VendorApplicant));