import React from 'react';
import { useForm } from 'react-hook-form';
// import Select from 'react-select';
import { ModalBody, ModalFooter } from 'reactstrap';
// import makeAnimated from 'react-select/animated';
import { withTranslation } from 'react-i18next';

import {rules} from './Validation'
function Form(props) {
    const { register, handleSubmit, errors } = useForm({});
    const onSubmit = async (value) => {
        props.save(value)
        // console.log(value)
    }
    let messageFromBackend = props.errors
    const {t} = props;

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>
					<div className="form-group">
                        <label >item penilaian <span className="text-danger">*</span> </label>
                        <input readOnly className="form-control" name="item_penilaian" defaultValue={props.data.item_penilaian} ref={register(rules.item_penilaian)}/>
                        {errors.item_penilaian && 
                        <span className="text-danger"> 
                        {errors.item_penilaian.type === "required" ? "Field harus diisi" : ''}  {errors.item_penilaian.message} 
                        </span>}
                        {messageFromBackend.item_penilaian && 
                        <span className="text-danger">{messageFromBackend.item_penilaian[0]}</span>}
                    </div>
                    <div className="form-group">
                        <label >bobot <span className="text-danger">*</span> </label>
                        <input type="number" className="form-control" name="bobot" defaultValue={props.data.bobot} ref={register(rules.bobot)}/>
                        {errors.bobot && 
                        <span className="text-danger"> 
                        {errors.bobot.type === "required" ? "Field harus diisi" : ''}  {errors.bobot.message} 
                        </span>}
                        {messageFromBackend.bobot && 
                        <span className="text-danger">{messageFromBackend.bobot[0]}</span>}
                    </div>
                    {/* <div className="form-group">
                        <label >Bobot Q/S <span className="text-danger">*</span> </label>
                        <input type="number" readOnly={props.data.bobot_qs === "0" || props.data.bobot_qs === ""} className="form-control" name="bobot_qs" defaultValue={props.data.bobot_qs} ref={register(rules.bobot_qs)}/>
                        {errors.bobot_qs && 
                        <span className="text-danger"> 
                        {errors.bobot_qs.type === "required" ? "Field harus diisi (isi angka 0 jika ingin nilai kosong)" : ''}  {errors.bobot_qs.message} 
                        </span>}
                        {messageFromBackend.bobot_qs && 
                        <span className="text-danger">{messageFromBackend.bobot_qs[0]}</span>}
                    </div> */}
                    <div className="form-group">
                        <label >Lingkup <span className="text-danger">*</span> </label>
                        {/* <input className="form-control" name="lingkup" defaultValue={props.data.lingkup} ref={register(rules.lingkup)}/> */}
                        <select className="form-control" name="lingkup" defaultValue={props.data.lingkup} ref={register(rules.lingkup)}>
                            <option>All</option>
                            <option>Barang</option>
                            <option>Jasa</option>
                        </select>
                        {errors.lingkup && 
                        <span className="text-danger"> 
                        {errors.lingkup.type === "required" ? "Field harus diisi" : ''}  {errors.lingkup.message} 
                        </span>}
                        {messageFromBackend.lingkup && 
                        <span className="text-danger">{messageFromBackend.lingkup[0]}</span>}
                    </div>
                    
                </ModalBody>

                <ModalFooter>
                    <button className="btn btn-success" type="submit">{props.uuid !== "" ? t("bobotPeforma:button.update") : t("bobotPeforma:button.submit")}</button>
                </ModalFooter>

                

            </form>
        </div>
    )
}

export default withTranslation() (Form)
