import React from 'react';
import ProfileVendor from '../ProfileVendor';
import { Collapse, CardHeader, CardBody, Card } from 'reactstrap';
import SubKonfirmasi from './sub/SubKonfirmasi';

class Konfirmasi extends React.Component {
	constructor(props) {
		super(props);
		this._isMounted = false
		this.state = {
			toggle: [],
			collapse: [
				{	id: 1, name: 'Konfirmasi', type: 'Konfirmasi', collapse: true, isOpen: true },
			]
		};
	}

	componentDidMount(){
		this._isMounted = true;
		if(this._isMounted){
			// console.log(this.props.history);
		}
	}

	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }

	toggleCollapse = (index) => {
		// this.setState({toggle: index});
		// console.log(this.state.toggle);
		var newArray = [];
		for (let collapseObj of this.state.collapse) {
			if (collapseObj.id === index) {
				collapseObj.collapse = !collapseObj.collapse;
			} else {
				collapseObj.collapse = false;
			}
			newArray.push(collapseObj);
		}
		
		this.setState({
			collapse: newArray
		});
	}
	
	render() {
		const colorPanelBlack = {
			// 'background': 'black',
			// 'font-weight' : 'bold',
			'background': 'linear-gradient(90deg, rgba(87, 174, 229, 1) 0%, rgba(97, 188, 246, 1) 100%)',
		}

		return (
			<div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">Home</li>
					<li className="breadcrumb-item">Vendor Management</li>
					<li className="breadcrumb-item active">Konfirmasi</li>
				</ol>
				<h1 className="page-header">Profil Vendor </h1>
				<div className="row">
					<div className="col-md-3">
						<ProfileVendor />
					</div>
					<div className="col-md-9">
						<div id="accordion" className="accordion">
							{
								this.state.collapse.map((value, i) => (
								<Card className="bg-white text-black" key={i}>
									<CardHeader style={colorPanelBlack} className={'card-header bg-dark-darker text-white set-pointer ' + (!value.collapse ? 'collapsed ' : '')} onClick={() => this.toggleCollapse(value.id)}>
										<i className="fa fa-circle f-s-8 mr-2 text-white-lighter"></i> {value.name}
									</CardHeader>
									<Collapse isOpen={value.collapse}>
										<CardBody>
											<SubKonfirmasi history={this.props.history} />
										</CardBody>
									</Collapse>
								</Card>
								))
							}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Konfirmasi;