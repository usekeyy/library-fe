import React from 'react';
import {useForm} from 'react-hook-form';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const ChangePassword = (props) => {
	const { register, errors, handleSubmit } = useForm({});

  const onSubmit = async data => {
		props.save(props.uuid, data)
  };
	let {loading} = props;
	let msg = props.errors;

  return (
		<div>
			<Modal isOpen={props.toggleOpen} toggle={props.toggleClose} >
        <ModalHeader toggle={props.toggleClose}>CHANGE PASSWORD</ModalHeader>
					<form onSubmit={handleSubmit(onSubmit)}>
						<ModalBody>
							<div className="form-group">
								<label>Old Password <span className="text-danger">*</span></label>
								<div>
									<input type="password" className={(errors.old_password || msg.old_password) ? "form-control is-invalid" : "form-control"} name="old_password" ref={register({required: false})} defaultValue="" autoComplete="on" />
									{/* {errors.old_password && <span className="text-danger">* This field is required</span>} */}
									{msg.old_password && <span className="text-danger">{msg.old_password[0]}</span>}
								</div>
							</div>
							<div className="form-group">
								<label>New Password <span className="text-danger">*</span></label>
								<div>
									<input type="password" className={(errors.new_password || msg.new_password) ? "form-control is-invalid" : "form-control"} name="new_password" ref={register({required: false})} defaultValue="" autoComplete="on" />
									{/* {errors.new_password && <span className="text-danger">* This field is required</span>} */}
									{msg.new_password && <span className="text-danger">{msg.new_password[0]}</span>}
								</div>
							</div>
						</ModalBody>
						<ModalFooter>
									<button type="button" className="btn btn-white" onClick={(e) => props.toggleClose(e)} disabled={loading}>Close</button>
									<button className="btn btn-success" type="submit" disabled={loading}>Submit {loading && <i className="fas fa-spinner fa-pulse"></i>}</button>
						</ModalFooter>
				</form>
      </Modal>
		</div>
  );
}

export default ChangePassword;