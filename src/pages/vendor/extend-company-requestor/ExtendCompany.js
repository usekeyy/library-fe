import React, {Component} from 'react';
import {connect} from 'react-redux';
import 'react-table/react-table.css';
import Table from './sub/Table';
import Form from './sub/Form';
import { Button, Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';
import {showExtendCompany, saveExtendCompany} from '../../../store/actions/vendor/extendCompanyActions';
import {fetchExtendCompanyRequestor} from '../../../store/actions/vendor/extendCompanyRequestorActions';
import {fetchDataVendor} from '../../../store/actions/vendor/vendorActions';

class ExtendCompany extends Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
	}
	
	state = {
		company_id: this.props.user.company_id,
		data_vendor: [],
		loading: false,
		isOpen: {
			form: false,
			modal: false,
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
	}
	
	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
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
									{this.props.access.C && !form && <Button color="primary" size="sm" disabled={this.state.loading} onClick={(e) => this.toggleFormOpen(e)}>
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
							loadings={this.state.loadings} 
							company_id={this.state.company_id}
							errors={this.state.errors}
							close={this.toggleFormClose}
							fetchDataVendor={this.props.fetchDataVendor}
							handleSave={this.props.saveExtendCompany}
							showExtendCompany={this.props.showExtendCompany}
							setLoading={this.setLoading}
						/>}
						{!form && <Table 
							fetchExtendCompanyRequestor={this.props.fetchExtendCompanyRequestor}
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
		fetchExtendCompanyRequestor: (params) => dispatch(fetchExtendCompanyRequestor(params)),
		fetchDataVendor: (params) => dispatch(fetchDataVendor(params)),
		showExtendCompany: (vendor_uuid) => dispatch(showExtendCompany(vendor_uuid)),
		saveExtendCompany: (payload) => dispatch(saveExtendCompany(payload)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (ExtendCompany));