import React, {Component} from 'react';
import {connect} from 'react-redux';
import 'react-table/react-table.css';
import Table from './sub/Table';
import { Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';

import { fetchRetender } from '../../../../store/actions/tendering/retenderActions';

class RetenderList extends Component {
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
					<li className="breadcrumb-item active">Retender Approval</li>
				</ol>
				<h1 className="page-header">Retender Approval </h1>
				<Panel loading={false}>
					<PanelHeader>Retender Approval Table</PanelHeader>
					<PanelBody loading={false}>
						<Row>
							<Col sm="6">
							</Col>
							<Col sm="6">
							</Col>
						</Row>
						<Table 
							fetchTable={this.props.fetchRetender}
							setLoading={this.setLoading}
							parentProps={this.props}
							location={() => this.props.history.location}
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
		fetchRetender: (params) => dispatch(fetchRetender(params)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (RetenderList));