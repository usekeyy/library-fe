import React from 'react';
import PropTypes from "prop-types";
import { Route, Link } from 'react-router-dom';
import { PageSettings } from '../../../../config/page-settings';

class SidebarNavList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			active: -1,
			clicked: -1
		};
	}

	static propTypes = {
    getAccess: PropTypes.func,
  };

	handleExpand(e, i, match) {
		e.preventDefault();

		this.setState(state => ({
			active: (this.state.active === i ? -1 : i),
			clicked: 1
		}));
	}
  
	render() {
		return (
			<>
			</>
		);
	}
}

export default SidebarNavList;