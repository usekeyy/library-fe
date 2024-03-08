import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class ModalConfirm extends Component {
	constructor(props) {
    super(props);
    this._isMounted = false;
	}
	
	state = {
		title: this.props.modalConfirm.title,
		label: this.props.modalConfirm.label,
	}


	render(){
		return (
			<div>
				<Modal isOpen={this.props.open} toggle={this.props.toggle} >
					<ModalHeader toggle={this.props.toggle}>{this.state.title} {this.props.id}</ModalHeader>
					<ModalBody>
						{this.state.label}
					</ModalBody>
					<ModalFooter>
						<Button color="success" onClick={this.props.ifConfirm}>Yes</Button>{' '}
						<Button color="danger" onClick={this.props.toggle}>No</Button>
					</ModalFooter>
				</Modal>
			</div>
		);
	}
}

export default ModalConfirm;