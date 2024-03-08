import React from 'react';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import ReactLoading from 'react-loading';
import {useForm, Controller} from 'react-hook-form';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
// import {toastr} from 'react-redux-toastr';
const animatedComponents = makeAnimated();

const SourceAssigment = (props) => {
	const {register, control, handleSubmit } = useForm();
	const { t } = props;
	// const {m_determination} = props.parentState.purchasing_requisition;
	// const {m_users} = props.parentState.purchasing_requisition;
	const {sendData} = props.parentState.purchasing_requisition;
	const {errors} = props.parentState.purchasing_requisition;
	const {loadings} = props.parentState;
	// const {loading} = props.parentState;
	const customStyles = {
      control: (base, state) => ({
        ...base,
        borderColor: state.isFocused ?
          '#ddd' : 'red',
      })
	}
		
	const onSubmit = async data => {
		setOptions(data);
		props.save(data)
	};

	const setOptions = (data) => {
		console.log(data);
		// data.determination_id = data.determination_id.value !== undefined ? data.determination_id.value : "";
		data.user_id = data.user_id.value !== undefined ? data.user_id.value : "";
	};

	const onInputChange = (option, { action }) => {
		if (action === "input-change") {
			props.fetchUserList(option)
		}
		if (action === "set-value") {
			props.fetchUserList()
		}
	};

    return (
			<div>
				<Panel>
					<PanelHeader>Source Determination & Assignment</PanelHeader>
					{(loadings.users) && <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>}
					{(!loadings.users) &&
					<PanelBody >
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="row">
								<div className="col-md-12">
									{/* <div className="form-group row m-b-15">
										<label className="col-md-3 col-form-label">{'Source Determination'} <span className="text-danger">*</span></label>
										<div className="col-md-7">
											<Controller
												components={animatedComponents}
												closeMenuOnSelect={true}
												as={Select} 
												placeholder={loadings.determination ? t("Select.Sedang Memuat") : t("Select.Pilih") }
												isLoading={loadings.determination}
												className="basic-multi-select"
												classNamePrefix="select"
												name="determination_id"
												styles={errors.determination_id ? customStyles : {}}
												control={control}
												options={props.parentState.m_determination} 
												defaultValue={sendData.determination_id}
												rules={{ required: false }}  />
											{errors.source_determination && <span className="text-danger"> {errors.source_determination[0]} </span>}
										</div>
									</div> */}
									<div className="form-group row m-b-15">
										<label className="col-md-3 col-form-label">{'Assign To Buyer'} <span className="text-danger">*</span></label>
										<div className="col-md-7">
											<Controller
												components={animatedComponents}
												closeMenuOnSelect={true}
												as={Select} 
												placeholder={loadings.form_user_buyyer ? t("Select.Sedang Memuat") : t("Select.Pilih") }
												isLoading={loadings.form_user_buyyer}
												className="basic-multi-select"
												classNamePrefix="select"
												name="user_id"
												onInputChange={onInputChange}
												styles={errors.user_id ? customStyles : {}}
												control={control}
												options={props.parentState.m_users} 
												defaultValue={sendData.user_id}
												rules={{ required: false }}  />
											{errors.assign_to_buyer && <span className="text-danger"> {errors.assign_to_buyer[0]} </span>}
										</div>
									</div>
									<div className="form-group row m-b-15">
										<label className="col-md-3 col-form-label">{t("PR.disposisi-note")}</label>
										<div className="col-md-7">
											<textarea className="form-control" name="disposisi_note" ref={register({ required: false })} />
										</div>
									</div>
									<div className="pull-right m-t-10">
										<button className="btn btn-white m-r-10" type="button" onClick={(e) => window.history.back()} disabled={loadings.button}>{t('Button.Batal')}</button>
										<button className="btn btn-success m-l-10" type="submit" disabled={loadings.button}> 
											{loadings.button && <i className="fas fa-spinner fa-pulse"></i> }
											{t('Button.Submit')}
										</button>
									</div>
								</div>
							</div>
						</form>
					</PanelBody>
					}
				</Panel>
			</div>
    );
}

export default withTranslation()(SourceAssigment);
