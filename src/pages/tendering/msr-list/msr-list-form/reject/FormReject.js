import React from 'react';
import { useForm } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';

const FormReject = (props) => {
	const {t} = props;
	const { register, handleSubmit } = useForm({});
	const onSubmit = async data => {
        data.status = "r"
        // console.log(data)
		props.saveData(data)
	};
	

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
                <div className="form-group">
                    <center><h2 className="text-danger">Apakah Anda Yakin ?</h2></center>
                    </div>
					<div className="form-group">
						<label>Note :<span className="text-danger">*</span></label>
						<div>
							<textarea className="form-control" name="note" ref={register({ required: false })}  />
							{/* {errors.note && <span className="text-danger">* This field is required</span>}
							{msg.note && <span className="text-danger"> {msg.note[0]} </span>} */}
						</div>
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={() => props.toggleClose()}>{t("uom:button.cancel")}</button>
					<button className="btn btn-danger" type="submit" disabled={props.btnDisabled}>
						{props.btnDisabled && <i className="fas fa-spinner fa-pulse"></i>}
						Reject
					</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation() (FormReject);