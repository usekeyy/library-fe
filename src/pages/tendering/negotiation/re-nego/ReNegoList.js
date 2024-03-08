import React, {Component} from 'react';
import {connect} from 'react-redux';
import { withTranslation } from 'react-i18next';
import 'react-table/react-table.css';
import Table from './sub/Table';
import { Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import {fetchVendorNegotiation} from '../../../../store/actions/tendering/negotiationActions';
import {fetchDurList} from '../../../../store/actions/tendering/durActions';

class TahapNegoList extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
	}
	
  state = {
		loading: false
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
		this.props.history.push(`/tendering/re-negotiation/detail/${uuid}`)
	}
	
  render(){
		const {t} = this.props;
    return (
      <div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">Home</li>
					<li className="breadcrumb-item">Tendering</li>
					<li className="breadcrumb-item active">Re Negosiasi</li>
				</ol>
				<h1 className="page-header">Re Negosiasi </h1>
				<Panel loading={false}>
					<PanelHeader>Re Negosiasi Table</PanelHeader>
					<PanelBody loading={false}>
						<Row>
							<Col sm="6">
							</Col>
							<Col sm="6">
							</Col>
						</Row>
						<Table
							t={t}
							user_uuid={'d0c72016-8e95-4a3b-bba5-87d78ee0929f'}
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
		fetchVendorNegotiation: (params) => dispatch(fetchVendorNegotiation(params)),
		fetchDurList: (vendor_uuid, params) => dispatch(fetchDurList(vendor_uuid, params)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (TahapNegoList));