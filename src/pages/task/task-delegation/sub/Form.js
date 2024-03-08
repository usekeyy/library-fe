import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const RouteForm = (props) => {
	const { handleSubmit, control, watch , setValue, getValues} = useForm({});

	console.log(props.parentState.dataUser)
	const {t} = props;
	
	const onSubmit = async data => {
		console.log(data)
		// props.save(data);
	};

	const handleChangeFromUser = (select) => {
		setValue('toUser','')
		props.setPropsState('fromUser',select.value)
		props.setPayloadAssignTask(false)
		props.setShowTask(false)
		props.fetchUserAssign({
			uuid : select.value
		})
	}

	const handleChangeAssignUser = (select) => {
		props.setPayloadAssignTask(false)
		if(select){
			props.setPropsState('toUser',select.value)
			const params = {
				from_uuid : getValues('fromUser').value,
				to_uuid : select.value
			}
			props.setShowTask(true, params)
		}else{
			props.setPropsState('toUser',"")
			props.setShowTask(false)
		}
	}

	const handleInputChangeFromUser = (option, {action}) => {
		if (action === 'input-change'){
			props.fetchUser({name : option})
		}
	}

	const handleInputChangeAssignUser = (option, {action}) => {
		if (action === 'input-change'){
			props.fetchUserAssign({uuid : getValues('fromUser').value, name : option})
		}
	}

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					<div className="form-group">
						<label>{'From User'} <span className="text-danger">*</span></label>
						<div>
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select} 
								control={control}
								placeholder={props.parentState.loadingUser ? t("Select.Sedang Memuat") : t("Select.Pilih") }
								isLoading={props.parentState.loadingUser}
								name="fromUser"
								onInputChange={handleInputChangeFromUser}
								onChange={([selected]) => {
										handleChangeFromUser(selected)
										return selected;
									}}
								options={props.parentState.dataUser.filter((data) => data?.value !== watch('toUser')?.value)}
								// options={props.parentState.dataUser}  
								rules={{ required: true }} />
							{/* {msg.bank_id && <span className="text-danger"> {msg.bank_id[0]} </span>} */}
						</div>
					</div>
					<div className="form-group">
						<label>{'Assign To User'} <span className="text-danger">*</span></label>
						<div>
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select} 
								control={control}
								placeholder={props.parentState.loadingUserAssign ? t("Select.Sedang Memuat") : t("Select.Pilih") }
								isLoading={props.parentState.loadingUserAssign}
								className="basic-multi-select"
								classNamePrefix="select"
								name="toUser"
								onInputChange={handleInputChangeAssignUser}
								onChange={([selected]) => {
									handleChangeAssignUser(selected)
									return selected;
								}}
								isClearable
								// styles={msg.bank_id ? customStyles : {}}
								// defaultValue={props.data.bank_id}
								options={props.parentState.dataUserAssign.filter((data) => data.value !== watch('fromUser').value)}  
								rules={{ required: false }} />
							{/* {msg.bank_id && <span className="text-danger"> {msg.bank_id[0]} </span>} */}
						</div>
					</div>
					</ModalBody>
				<ModalFooter>
					{/* <button className="btn btn-white" onClick={() => props.toggleClose()}>{t("documentType:button.close")}</button> */}
					{/* <button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ? t("documentType:button.update") : t("documentType:button.submit")}</button> */}
				</ModalFooter>
			</form>
		</div>
	);
}

export default  withTranslation() (RouteForm);