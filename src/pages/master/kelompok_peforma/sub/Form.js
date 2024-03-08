import React from 'react';
import { useForm , Controller} from 'react-hook-form';
import Select from 'react-select';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import makeAnimated from 'react-select/animated';
import {rules} from './Validation'

const animatedComponents = makeAnimated();

function Form(props) {
    const { register, handleSubmit, errors, setValue , control } = useForm({});
    let messageFromBackend = props.errors
    const {t} = props;
    const onSubmit = async (value) => {
        // console.log(value)
        value.dur_restricted = value.dur_restricted.value
        props.save(value)
    }

    const changeWarna = (warna) => {
        console.log(warna)
        setValue("color",warna)
        // props.changeWarna(warna);
    }


    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>
                    <div className="form-group">
                        <label >{t("kelompokPeforma:label.kelompok")}<span className="text-danger">*</span> </label>
                        <input className="form-control" name="kelompok" defaultValue={props.data.kelompok} ref={register(rules.kelompok)}/>
                        {errors.kelompok && 
                        <span className="text-danger"> 
                        {errors.kelompok.type === "required" ? "Field harus diisi" : ''}  {errors.kelompok.message} 
                        </span>}
                        {messageFromBackend.kelompok && 
                        <span className="text-danger">{messageFromBackend.kelompok[0]}</span>}
                    </div>
                    {/* color */}
                    <div className="form-group">
                        <label>{t("kelompokPeforma:label.color")}<span className="text-danger">*</span> </label>
                        <div className="form-inline">
                            <input className="form-control col-sm-10" readOnly name="color" defaultValue={props.data.color} ref={register(rules.color)}/>
                            <input type="color" className="form-control col-sm-2" name="changeColor" onChange={(e) => changeWarna(e.target.value)} defaultValue={props.data.color} ref={register()}/>
                            {errors.color && 
                            <span className="text-danger"> 
                            {errors.color.type === "required" ? "Field harus diisi" : ''}
                            {errors.color.message} 
                            </span>}
                            {messageFromBackend.color && 
                            <span className="text-danger">{messageFromBackend.color[0]}</span>}
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label >{t("kelompokPeforma:label.min_poin")}<span className="text-danger">*</span> </label>
                        <input type="number" className="form-control" name="min_poin" defaultValue={props.data.min_poin} ref={register(rules.min_poin)}/>
                        {errors.min_poin && 
                        <span className="text-danger"> 
                        {errors.min_poin.type === "required" ? "Field harus diisi" : ''}  {errors.min_poin.message} 
                        </span>}
                        {messageFromBackend.min_poin && 
                        <span className="text-danger">{messageFromBackend.min_poin[0]}</span>}
                    </div>
                    <div className="form-group">
                        <label >{t("kelompokPeforma:label.max_poin")} <span className="text-danger">*</span> </label>
                        <input type="number" className="form-control" name="max_poin" defaultValue={props.data.max_poin} ref={register(rules.max_poin)}/>
                        {errors.max_poin && 
                        <span className="text-danger"> 
                        {errors.max_poin.type === "required" ? "Field harus diisi" : ''}  {errors.max_poin.message} 
                        </span>}
                        {messageFromBackend.max_poin && 
                        <span className="text-danger">{messageFromBackend.max_poin[0]}</span>}
                    </div>
                    <div className="form-group">
						<label>{t("jadwalTender:label.metode_penyampaian")} <span className="text-danger">*</span></label>
						<div>
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select}
								control={control}
								options={props.options}
								defaultValue={props.data.dur_restricted}
								inputRef={(e) => register({ name: "metode_penyampaian_id", required: false })}
								name="dur_restricted"
								rules={{ required: true }}
							/>
							{errors.dur_restricted?.type === "required" && <span className="text-danger">* Field harus diisi</span>}
							{props.errors.dur_restricted && <span className="text-danger">{props.errors.dur_restricted[0]}</span>}
						</div>
					</div>
                </ModalBody>

                <ModalFooter>
                    <button className="btn btn-success" type="submit">{props.uuid !== "" ? t("kelompokPeforma:button.update") : t("kelompokPeforma:button.submit")}</button>
                </ModalFooter>

                

            </form>
        </div>
    )
}

export default withTranslation()(Form)
