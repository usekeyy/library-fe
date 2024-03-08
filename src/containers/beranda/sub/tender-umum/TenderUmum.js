import React, {Component} from 'react';
import {connect} from 'react-redux';
import { withTranslation } from 'react-i18next';
import 'react-table/react-table.css';
import Table from './Table';

class VerificationRequestor extends Component {
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
	
  render(){
		const {t} = this.props;
    return (
      <div>
				<Table
					t={t}
					fetchTederUmum={this.props.fetchTederUmum}
					fetchPraQualificationTenderList={this.props.fetchPraQualificationTenderList}
					toggleLogin={this.props.toggleLogin}
					setLoading={this.setLoading}
				/>
			</div>
    );
  }
}

const stateToProps = state => {
	return {

	}
}

const dispatchToProps = dispatch => {
	return {

	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (VerificationRequestor));