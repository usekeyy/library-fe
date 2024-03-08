import React from 'react';

const PanelStat = React.createContext();

class Panel extends React.Component {
	constructor(props) {
		super(props);
		
		this.toggleExpand = () => {
			this.setState(state => ({
				expand: !this.state.expand
			}));
		}
		
		this.toggleRemove = () => {
			this.setState(state => ({
				remove: !this.state.remove
			}));
		}
		
		this.toggleCollapse = () => {
			this.setState(state => ({
				collapse: !this.state.collapse
			}));
		}
		
		this.toggleReload = () => {
			if (this.state.reload !== true) {
				this.setState(state => ({
					reload: true
				}));
			
				setTimeout(() => {
					this.setState(state => ({
						reload: false
					}));
				}, 2000);
			}
		}
		
		this.state = {
			expand: false,
			collapse: this.props.collapse ? true : false,
			reload: false,
			remove: false,
			toggleExpand: this.toggleExpand,
			toggleReload: this.toggleReload,
			toggleRemove: this.toggleRemove,
			toggleCollapse: this.toggleCollapse
		}
	}
	render() {
		return (
			<PanelStat.Provider value={this.state}>
				{(!this.state.remove && 
					<div className={'panel panel-'+ (this.props.theme ? this.props.theme : 'info') +' '+ (this.state.expand ? 'panel-expand ' : ' ') + (this.props.loading ? 'panel-loading ' : ' ') + (this.props.className ? this.props.className : '')}>
						{ this.props.children }
					</div>
				)}
			</PanelStat.Provider>
		);
	}
};

class PanelHeader extends React.Component {
	render() {
		return (
			<div className="panel-heading">
				<h4 className="panel-title">{ this.props.children }</h4>
				{(!this.props.noButton &&
					<PanelStat.Consumer>
						{({ toggleExpand, toggleRemove, toggleCollapse, toggleReload }) => (
							<div className="panel-heading-btn">
								<button type="button" className="btn btn-xs btn-icon btn-circle btn-default" onClick={toggleExpand}><i className="fa fa-expand"></i></button>&nbsp;&nbsp;
								{/* <button type="button" className="btn btn-xs btn-icon btn-circle btn-info" onClick={toggleReload}><i className="fa fa-redo"></i></button>&nbsp;&nbsp; */}
								<button type="button" className="btn btn-xs btn-icon btn-circle btn-warning" onClick={toggleCollapse}><i className="fa fa-minus"></i></button>&nbsp;&nbsp;
								{/* <button type="button" className="btn btn-xs btn-icon btn-circle btn-danger" onClick={toggleRemove}><i className="fa fa-times"></i></button> */}
							</div>
						)}
					</PanelStat.Consumer>
				)}
			</div>
		)
	}
}

class PanelBody extends React.Component {
	render() {
		let {loading} = this.props;
		return (
			<PanelStat.Consumer>
				{({ collapse, reload }) => (
					<div className={"panel-body "+ (collapse ? 'd-none ' : ' ') + this.props.className}>
						{ this.props.children }
						
						{(loading && 
							<div className="panel-loader">
								<span className="spinner-small"></span>
							</div>
						)}
					</div>
				)}
			</PanelStat.Consumer>
		);
	}
};

class PanelFooter extends React.Component {
	render() {
		return (
			<div className={"panel-footer "+ this.props.className}>
				{ this.props.children }
			</div>
		);
	}
};

export { Panel, PanelHeader, PanelBody, PanelFooter };
