import React from 'react';
import {useForm} from 'react-hook-form';
import {ModalBody, ModalFooter } from 'reactstrap';

const Form = (props) => {
	const { register, errors, handleSubmit } = useForm({});
  const onSubmit = async data => {
		props.save(data)
  };
	let msg = props.errors;
	let {loading} = props;
	let {uuid} = props;

  return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
					<ModalBody>
						<div className="form-group">
							<label>ID <span className="text-danger">*</span></label>
							<div>
								<input className={(errors.code || msg.code) ? "form-control is-invalid" : "form-control"} name="code" ref={register({required: true})} defaultValue={props.data.code || ''} disabled={uuid} />
								{errors.code && <span className="text-danger">* This field is required</span>}
								{msg.code && <span className="text-danger"> {msg.code[0]} </span>}
							</div>
						</div>
						<div className="form-group">
							<label>Nama <span className="text-danger">*</span></label>
							<div>
								<input className={(errors.name || msg.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register({required: true})} defaultValue={props.data.name || ''}/>
								{errors.name && <span className="text-danger">* This field is required</span>}
								{msg.name && <span className="text-danger"> {msg.name[0]} </span>}
							</div>
						</div>
					</ModalBody>
					<ModalFooter>
								<button className="btn btn-white" disabled={loading} onClick={() => props.toggleClose()}>Close</button>
								<button className="btn btn-success" type="submit" disabled={loading}>
									Submit
									{loading && <i className="fas fa-spinner fa-pulse"></i> }
								</button>
					</ModalFooter>
			</form>
		</div>
  );
}

export default Form;