import React from 'react';
import { connect } from 'react-redux';
import 'react-table/react-table.css';
import Table from './sub/Table';
import Sync from './sub/Sync';
import { Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';

import {
	fetchPurchasingRequisition,
	showPurchasingRequisition,
	updatePurchasingRequisition, showPurchasingRequisitionListItem,
	SyncPurchasingRequisitionAssign,
	HistoriesPurchasingRequisition
} from '../../../../store/actions/tendering/purchasingRequisitionActions';
import { toastr } from 'react-redux-toastr';

class PurchasingRequisition extends React.Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
		this.child = React.createRef();
		this.state = {
			loading: false,
			purchasing_requisition: {
				data: [],
				sendData: {

				},
				errors: [],
				loading: true,
				loadingButton: false
			},
			m_tipe_lampiran: [
				{ value: "tor", label: "TOR" },
				{ value: "oe", label: "OE" },
				{ value: "rks", label: "RKS" },
				{ value: "lainnya", label: "LAINNYA" }
			],
			loadings: {
				sync: false
			},
			m_data_pr : []
		}
	}

	componentDidMount = () => {
		this._isMounted = true;
		if (this._isMounted) {
			this.fetchDataPr()
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
		// fix Warning: Can't perform a React state update on an unmounted component
		this.setState = (state, callback) => {
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
		this.setState({ loading: type })
	}

	fetchDataPr = async (params = {start : 0, length : 10}) => {
		this.setState({ loadingDataPr: true })
		this.props.fetchPurchasingRequisition(params)
			.then((resp) => {
				if (this._isMounted) {
					let dataPr = []
					resp.data.data.forEach(data => {
						dataPr.push({value : data.number, label : data.number})
					});
					this.setState({ m_data_pr: dataPr, loadingDataPr: false })
				}
			})
			.catch((resp) => {
				this.setState({ loadingDataPr: false })
				toastr.error(resp.data.status, resp.data.message);
			});
	}

	syncPr = (data) => {
		// console.log(data);
		if (this._isMounted) {
			this.setState(({ loadings }) => ({
				loadings: { ...loadings, sync: true },
			}))
			this.props.SyncPurchasingRequisitionAssign(data)
				.then((resp) => {
					toastr.success(resp.data.message);
					this.setState(({ loadings , purchasing_requisition}) => ({
						loadings: { ...loadings, sync: false },
						purchasing_requisition: { ...purchasing_requisition, errors: []},
					}))
					// toastr.success("Sync Data Success")
					this.child.current.fetchData();
					console.log("wkwkwk");
				})
				.catch((error) => {
					if (error !== undefined) {
						toastr.error(error?.data?.message)
						if (error && Array.isArray(error?.data?.errors)) {
							// console.log(error.data.errors)
							this.setState(({ loadings, purchasing_requisition }) => ({
								loadings: { ...loadings, sync: false },
								purchasing_requisition: { ...purchasing_requisition, errors: error.data.errors },
							}))
						} else {
							this.setState(({ loadings , purchasing_requisition}) => ({
								loadings: { ...loadings, sync: false },
								purchasing_requisition: { ...purchasing_requisition, errors: error.data.errors },
							}))
						}
					} else {
						toastr.error('Opps Somethings Wrong')
					}
				})
		}
		// toastr.success("Sync Data Success")
		// this.child.current.fetchData();
	}

	toCreate = () => {
		this.props.history.push(`/tendering/purchasing-requisition-procsi/create-header`);
	}

	render() {
		const { t } = this.props;
		return (
			<div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">Home</li>
					<li className="breadcrumb-item">Tendering</li>
					<li className="breadcrumb-item active">Purchase Requisition</li>
				</ol>
				<h1 className="page-header">Purchase Requisition </h1>
				<Panel loading={false}>
					<PanelHeader>Purchase Requisition Table</PanelHeader>
					<PanelBody loading={false}>
						<Row>
							<Col sm="12">
								<Sync parentState={this.state} sync={this.syncPr} toCreate={this.toCreate} />
							</Col>
						</Row>
						{<Table
							ref={this.child}
							t={t}
							fetchPurchasingRequisition={this.props.fetchPurchasingRequisition}
							HistoriesPurchasingRequisition={this.props.HistoriesPurchasingRequisition}
							setLoading={this.setLoading}
							parentProps={this.props}
							parentState={this.state}
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
	}
}

const dispatchToProps = dispatch => {
	return {
		fetchPurchasingRequisition: (params) => dispatch(fetchPurchasingRequisition(params)),
		SyncPurchasingRequisitionAssign: (params) => dispatch(SyncPurchasingRequisitionAssign(params)),
		HistoriesPurchasingRequisition: (id) => dispatch(HistoriesPurchasingRequisition(id)),
		showPurchasingRequisition: (id) => dispatch(showPurchasingRequisition(id)),
		updatePurchasingRequisition: (id, payload) => dispatch(updatePurchasingRequisition(id, payload)),
		showPurchasingRequisitionListItem: (payload) => dispatch(showPurchasingRequisitionListItem(payload)),
	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(PurchasingRequisition));