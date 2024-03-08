import React from 'react';
import { useForm } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import QuillEditor from './QuillEditor'

const Form = (props) => {
	const {t} = props;
	const { errors, handleSubmit } = useForm({});
	const onSubmit = async data => {
		console.log(data)
		// props.save(data)
	};
	// let msg = props.errors;
	let { loading } = props;

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
                    <div className="form-group">
						<QuillEditor text={props.data.reminder_template.content} setData={props.setData} modalType={props.modalType}/>
						{errors.content && <span className="text-danger">* This field is required</span>}
						{props.errors.content && <span className="text-danger">{props.errors.content[0]}</span>}
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" disabled={loading} onClick={() => props.toggleClose()}>{t("uom:button.close")}</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation() (Form);