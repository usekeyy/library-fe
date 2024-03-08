import React, {Component} from 'react';
import {connect} from 'react-redux';
import { withTranslation } from 'react-i18next';
import 'react-table/react-table.css';
import Table from './sub/Table';
import { Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import {fetchVendorNegotiation} from '../../../../store/actions/tendering/negotiationActions';

class ProsesNegoList extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
		this.state = {
			loading: false,
			isRole: this.props.user.has_roles.includes("VNDR01") ? 'vendor' : 'buyer',
		}
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

	setLoading = (type) => {
		this.setState({ loading: type })
	}

	toDetail = (uuid) => {
		// this.props.history.push(`/tendering/negotiation/detail/${uuid}`)
		this.props.history.push(`/tendering/negotiation-process/detail/${uuid}`)
	}
	
  render(){
		const {t} = this.props;
    return (
      <div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">Home</li>
					<li className="breadcrumb-item">Tendering</li>
					<li className="breadcrumb-item active">Proses Nego</li>
				</ol>
				<h1 className="page-header">Proses Nego </h1>
				<Panel loading={false}>
					<PanelHeader>Proses Nego Table</PanelHeader>
					<PanelBody loading={false}>
						<Row>
							<Col sm="6">
							</Col>
							<Col sm="6">
							</Col>
						</Row>
						<Table
							t={t}
							isRole={this.state.isRole}
							fetchVendorNegotiation={this.props.fetchVendorNegotiation}
							setLoading={this.setLoading}
							toDetail={this.toDetail}
						/>
					</PanelBody>
				</Panel>
			</div>
    );
  }
}

const stateToProps = state => {
	return {
		user : state.auth.user.data,
	}
}

const dispatchToProps = dispatch => {
	return {
		fetchVendorNegotiation: (vendor_uuid, params) => dispatch(fetchVendorNegotiation(vendor_uuid, params)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (ProsesNegoList));