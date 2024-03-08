import React from 'react';
import { useForm } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';

const FormAddKonfig = (props) => {
    const { t } = props;
    const { register,  handleSubmit, errors } = useForm({});
    const onSubmit = async data => {
        props.storeSyarat(data)
    };


    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>
                <div className="form-group">
						<label >Description</label>
						<input  className={(errors.description ) ? "form-control is-invalid" : "form-control"} name="description" ref={register({ required: true })} />
                        {errors.description && <span className="text-danger">{errors.description.type === "required" ? "Field harus diisi" : ''}  {errors.description.message}</span>}
					</div>               
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-white" type="button" onClick={() => props.toggleClose()}>{t("uom:button.cancel")}</button>
                  
                    <button className="btn btn-success" type="submit" disabled={props.loadings.loading_button_add_config}>
                        {props.loadings.loading_button_add_config && <i className="fas fa-spinner fa-pulse"></i>}
						Submit
					</button>
                    
                </ModalFooter>
            </form>
        </div>
    );
}

export default withTranslation()(FormAddKonfig);