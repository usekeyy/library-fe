import React from 'react';
import { useForm } from 'react-hook-form';
// import Select from 'react-select';
import { ModalBody, ModalFooter } from 'reactstrap';
// import makeAnimated from 'react-select/animated';
import { withTranslation } from 'react-i18next';

import {rules} from './Validation'
function Form(props) {
    const {t} = props;
    const { register, handleSubmit, errors } = useForm({});
    const onSubmit = async (value) => {
        props.save(value)
    }

    let messageFromBackend = props.errors
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>
					<div className="form-group">
                        <label >{t("searchterms:label.code")}<span className="text-danger">*</span> </label>
                        <input className="form-control" name="code" defaultValue={props.data.code} ref={register(rules.code)}/>
                        {errors.code && 
                        <span className="text-danger"> 
                        {console.log(errors.code)}
                        {errors.code.type === "required" && "Field harus diisi"}
                        {errors.code.type === "maxLength" && "Panjang maksimal character 5"}  
                        {errors.code.message} 
                        </span>}
                        {messageFromBackend.code && 
                        <span className="text-danger">{messageFromBackend.code[0]}</span>}
                    </div>
                    <div className="form-group">
                        <label >{t("searchterms:label.description")}<span className="text-danger">*</span> </label>
                        <input className="form-control" name="description" defaultValue={props.data.description} ref={register(rules.description)}/>
                        {errors.description && 
                        <span className="text-danger"> 
                        {errors.description.type === "required" ? "Field harus diisi" : ''}  {errors.description.message} 
                        </span>}
                        {messageFromBackend.description && 
                        <span className="text-danger"> 
                        {messageFromBackend.description[0]} 
                        </span>}
                    </div>
                </ModalBody>

                <ModalFooter>
                    <button className="btn btn-success" type="submit">{props.uuid !== "" ? t("searchterms:button.update") : t("searchterms:button.submit")}</button>
                </ModalFooter>

                

            </form>
        </div>
    )
}

export default withTranslation() (Form)
