import React, {Component} from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';

class Range extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
	}
	
  state = {
		from: '',
		to: ''
  }

  componentDidMount(){
		this._isMounted = true;
    if(this._isMounted){
			this.setState({from: '', to: ''})
    }
	}
	
	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }

	handleChange = (e) => {
		// console.log(e.target.value);
		this.setState({
			[e.target.name] : e.target.value,
		})
	}

  render(){
	const {t} = this.props
    return (
      <div>
				<Modal isOpen={this.props.toggleOpen} toggle={() => this.props.toggleClose()}>
					<form onSubmit={(e) => this.props.filterRange(e, this.state)}>
						<ModalHeader toggle={() => this.props.toggleClose()}>{t("common:filter-range.title")}</ModalHeader>
						<ModalBody>
						<div className="form-group">
							<label>{t("common:filter-range.start")}</label>
							<input type="text" name="from" onChange={(e) => this.handleChange(e)} className="form-control" required />
						</div>
						<div className="form-group">
							<label>{t("common:filter-range.to")}</label>
							<input type="text" name="to" onChange={(e) => this.handleChange(e)} className="form-control" required />
						</div>
						</ModalBody>
						<ModalFooter>
							<button type="button" className="btn btn-white" onClick={() => this.props.toggleClose()}>Close</button>
							<button type="submit" className="btn btn-success" >Filter</button>
						</ModalFooter>
					</form>
				</Modal>
			</div>
    );
  }
}

export default (withTranslation()(Range)) ;