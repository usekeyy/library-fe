import React, {Component} from 'react';
import {connect} from 'react-redux';
import { withTranslation } from 'react-i18next';
import 'react-table/react-table.css';
import Table from './sub/Table';
import { Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
// import {fetchUndanganTender} from '../../../../store/actions/tendering/undanganTenderActions';
import {fetchMonitoringTenderBuyer} from '../../../../store/actions/tendering/monitoringTenderBuyerActions';

class ListTender extends Component {
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

	toDetail = (data) => {
		console.log(data)
		if (data.registration_status === "register"){
			this.props.history.push(`/task-vendor/undangan-tender-aktif/detail/${data.uuid}`)
		}else{
			this.props.history.push(`/tendering/list-tender-vendor/registrasi/${data.uuid}`)
		}
	}
	
  render(){
		const {t} = this.props;
    return (
      <div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">Home</li>
					<li className="breadcrumb-item">Tendering</li>
					<li className="breadcrumb-item active">List Tender</li>
				</ol>
				<h1 className="page-header">List Tender </h1>
				<Panel loading={false}>
					<PanelHeader>List Tender Table</PanelHeader>
					<PanelBody loading={false}>
						<Row>
							<Col sm="6">
							</Col>
							<Col sm="6">
							</Col>
						</Row>
						<Table
							t={t}
							user_uuid={this.props.user.uuid}
							fetchUndanganTender={this.props.fetchMonitoringTenderBuyer}
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
		fetchMonitoringTenderBuyer: (params) => dispatch(fetchMonitoringTenderBuyer(params)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (ListTender));