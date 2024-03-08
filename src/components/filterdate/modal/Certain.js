import React, {Component} from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class Certain extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
	}
	
  state = {
		certain: ''
  }

  componentDidMount(){
		this._isMounted = true;
    if(this._isMounted){
			this.setState({certain: ''})
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
		this.setState({
			[e.target.name] : e.target.value,
		})
	}

  render(){
    return (
      <div>
				<Modal isOpen={this.props.toggleOpen} toggle={() => this.props.toggleClose()}>
					<form onSubmit={(e) => this.props.filterRange(e, this.state)}>
						<ModalHeader toggle={() => this.props.toggleClose()}>Waktu Tertentu</ModalHeader>
						<ModalBody>
						<div className="form-group">
							<label>Waktu Tertentu</label>
							<input type="date" name="certain" onChange={this.handleChange} className="form-control" required />
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

export default Certain;