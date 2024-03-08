import React, {Component} from 'react';
import {connect} from 'react-redux';
import 'react-table/react-table.css';
import Table from './sub/Table';
import { Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';

import {	fetchPurchasingRequisition,
					showPurchasingRequisition,
					updatePurchasingRequisition, showPurchasingRequisitionListItem } from '../../../../store/actions/tendering/purchasingRequisitionActions';

class PurchasingRequisitionApprval extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
	}
	
  state = {
		loading: false,
		purchasing_requisition: {
			data: [],
			sendData: {
				
			},
			errors: [],
			loading: true,
			loadingButton: false
		},
  }

  componentDidMount = () => {
		this._isMounted = true;
		if(this._isMounted){
			
		}
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
    return (
      <div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">Home</li>
					<li className="breadcrumb-item">Tendering</li>
					<li className="breadcrumb-item active">Purchase Requisition Approval</li>
				</ol>
				<h1 className="page-header">Purchase Requisition Approval </h1>
				<Panel loading={false}>
					<PanelHeader>Purchase Requisition Approval Table</PanelHeader>
					<PanelBody loading={false}>
						<Row>
							<Col sm="6">
							</Col>
							<Col sm="6">
							</Col>
						</Row>
						<Table 
							fetchPurchasingRequisition={this.props.fetchPurchasingRequisition}
							setLoading={this.setLoading}
							parentProps={this.props}
						/>
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
	}
}

const dispatchToProps = dispatch => {
	return {
		fetchPurchasingRequisition: (params) => dispatch(fetchPurchasingRequisition(params)),
		showPurchasingRequisition: (id) => dispatch(showPurchasingRequisition(id)),
		updatePurchasingRequisition: (id, payload) => dispatch(updatePurchasingRequisition(id, payload)),
		showPurchasingRequisitionListItem: (payload) => dispatch(showPurchasingRequisitionListItem(payload)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (PurchasingRequisitionApprval));