import React, {Component} from 'react';
// import {toastr} from 'react-redux-toastr';
import { Modal, ModalHeader } from 'reactstrap';
// import RouteForm from './Form';

class ModalForm extends Component {
	constructor(props) {
    super(props);
    console.log(props);
  }
  
  toggleClose = () => {
    this.props.toggleClose()
  }
	
	
  render(){
    return (
      <div>
				<Modal isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()}>
					<ModalHeader toggle={() => this.toggleClose()}>Form Users</ModalHeader>
					{/* <RouteForm
						toggleClose={this.toggleClose}
						save={(payload) => this.handleSave(payload)}
            data={this.state.sendDt}
            m_role={this.state.m_role}
            uuid={this.props.uuid}
					/> */}
				</Modal>
			</div>
    );
  }
}

export default ModalForm;