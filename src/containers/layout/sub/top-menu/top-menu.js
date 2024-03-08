import React from 'react';
import TopMenuNav from './top-menu-nav';
import { PageSettings } from '../../../../config/page-settings';

class TopMenu extends React.Component {
	render() {
		return (
			<PageSettings.Consumer>
				{({pageMobileTopMenu}) => (
					<div id="top-menu" className={'top-menu ' + (pageMobileTopMenu ? 'd-block ': '')}>
						<TopMenuNav />
					</div>
				)}
			</PageSettings.Consumer>
		)
	}
}

export default TopMenu;