import React, {Component} from 'react';
import {connect} from 'react-redux';
import { withTranslation } from 'react-i18next';
import 'react-table/react-table.css';
import Table from './sub/Table';
import { Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import {fetchUndanganTenderAktif} from '../../../../store/actions/tendering/undanganTenderActions';

class UndanganTender extends Component {
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
		this.props.history.push(`/task-vendor/undangan-tender-aktif/detail/${uuid}`)
	}
	
  render(){
		const {t} = this.props;
    return (
      <div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">Home</li>
					<li className="breadcrumb-item">Tendering</li>
					<li className="breadcrumb-item active">Tender Aktif</li>
				</ol>
				<h1 className="page-header">Tender Aktif </h1>
				<Panel loading={false}>
					<PanelHeader>Tender Aktif Table</PanelHeader>
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
							fetchUndanganTender={this.props.fetchUndanganTenderAktif}
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
		fetchUndanganTenderAktif: (vendor_uuid, params) => dispatch(fetchUndanganTenderAktif(vendor_uuid, params)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (UndanganTender));