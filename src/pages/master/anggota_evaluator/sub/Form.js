import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const RouteForm = (props) => {
	// const [symbolsArr] = useState(["e", "E", "+", "-", "."]);
	const {t} = props;
	const { register, errors, handleSubmit, control } = useForm({});
	const onSubmit = async data => {
        props.save(data);
	};


	const onInputChangeUser = (option, { action }) => {
		if (action === "input-change") {
			console.log("input change")
			props.fetchUsers(option)
		}
		if (action === "set-value") {
			console.log("set value")
			props.fetchUsers()
		}
	};
	

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					<div className="form-group">
						<label>User <span className="text-danger">*</span></label>
						<div>
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select}
								control={control}
								options={props.user}
								defaultValue={props.data.user_id}
								onInputChange={onInputChangeUser}
								inputRef={(e) => register({ name: "user_id", required: true })}
								name="user_id"
								placeholder={props.loadings.user_id ? t("common:Select.Sedang Memuat"): t("common:Select.Pilih") }
								isLoading={props.loadings.user_id}
								rules={{ required: true }}
							/>
							{errors.user_id && <span className="text-danger">* This field is required</span>}
							{props.errors.user_id && <span className="text-danger">{props.errors.user_id[0]}</span>}
						</div>
					</div>
					<div className="form-group">
						<label>Status Anggota <span className="text-danger">*</span></label>
						<div>
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select}
								control={control}
								options={[
									{
										value : "y",
										label : "Ketua"
									},
									{
										value : "n",
										label : "Anggota"
									}
								]}
								defaultValue={props.data.status}
								onInputChange={onInputChangeUser}
								inputRef={(e) => register({ name: "status", required: true })}
								name="status"
								placeholder={props.loadings.status ? t("common:Select.Sedang Memuat"): t("common:Select.Pilih") }
								isLoading={props.loadings.status}
								rules={{ required: true }}
							/>
							{errors.status && <span className="text-danger">* This field is required</span>}
							{props.errors.status && <span className="text-danger">{props.errors.status[0]}</span>}
						</div>
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={() => props.toggleClose()}>{t("mappingValueApproval:button.close")}</button>
					<button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ? t("mappingValueApproval:button.update") : t("mappingValueApproval:button.submit")}</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default  withTranslation() (RouteForm);