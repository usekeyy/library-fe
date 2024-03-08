import React from 'react';
import { useForm } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';

const FormEditEmail = (props) => {
    const {data,loading,update} = props
    console.log(data)
	const { register, errors, handleSubmit } = useForm({});
	const onSubmit = async data_form => {
		const params = {
            email : data_form.email
        }
        update(data.uuid, params)
	};

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
                    <div className="form-group">
						<h4>{data.name}</h4>
					</div>
                    <br></br>
					<div className="form-group">
						<label>Email PIC <span className="text-danger">*</span></label>
						<div>
							<input type='email' className={(errors.email) ? "form-control is-invalid" : "form-control"} name="email" ref={register({ required: true, type : 'email' })} placeholder='silahkan mengisi email PIC yang baru....'/>
							{errors.email && <span className="text-danger">* This field is required</span>}
							{/* {msg.id && <span className="text-danger"> {msg.id[0]} </span>} */}
						</div>
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={() => props.closeModal()} type="button" disabled={loading}>Cancel</button>
					<button className="btn btn-success" type="submit" disabled={loading}>
                        {loading ? <i className="fas fa-circle-notch fa-spin"></i> : 'Send'}
                    </button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation() (FormEditEmail);