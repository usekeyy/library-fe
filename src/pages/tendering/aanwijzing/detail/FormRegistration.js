import React from 'react';
import { useForm } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { toastr } from 'react-redux-toastr';

const FormRegistration = (props) => {
    const { t } = props;
    const { register,  handleSubmit } = useForm({});
    const onSubmit = async data => {
        if(data.registration_aanwijzing===""){
            toastr.warning("Warning","Please Choose Value")
        }else{
            props.registration(props.data.uuid,data)
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>
                    <div className="row">
                        <label  className="col-sm-3 col-form-label">{t("aanwijzing:label.packet-number")}</label>
                        <div className="col-sm-9">
                            <input type="text" readOnly className="form-control-plaintext" defaultValue={": "+(props.data.paket_no===null ? "":props.data.paket_no)} />
                        </div>
                    </div>
                    <div className="row">
                        <label className="col-sm-3 col-form-label">{t("aanwijzing:label.packet-title")}</label>
                        <div className="col-sm-9">
                            <input type="text" readOnly className="form-control-plaintext" defaultValue={": "+props.data.title} />
                        </div>
                    </div>
                    <div className="row">
                        <label className="col-sm-3 col-form-label">{t("aanwijzing:label.start-date")}</label>
                        <div className="col-sm-9">
                            <input type="text" readOnly className="form-control-plaintext" defaultValue={": "+props.data.start_date_format} />
                        </div>
                    </div>
                    <div className="row">
                        <label className="col-sm-3 col-form-label">{t("aanwijzing:label.end-date")}</label>
                        <div className="col-sm-9">
                            <input type="text" readOnly className="form-control-plaintext" defaultValue={": "+props.data.end_date_format} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="form-check m-l-10">
                            <input className="form-check-input" type="radio" name="registration_aanwijzing"  value="joined"  ref={register({})}/>
                            <label className="form-check-label">
                            {t("aanwijzing:label.join")}
                        </label>
                        </div>
                    </div>
                    <div className="row m-t-10" >
                        <div className="form-check m-l-10">
                            <input className="form-check-input" type="radio" name="registration_aanwijzing"  value="notjoined" ref={register({})}/>
                            <label className="form-check-label">
                            {t("aanwijzing:label.not-join")}
                            </label>
                        </div>
                    </div>
                   
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-white" onClick={() => props.toggleClose()}>{t("uom:button.cancel")}</button>
                    {(new Date(localStorage.getItem("times")).getTime()/1000 < new Date(props.data.end_date).getTime()/1000) && (new Date(localStorage.getItem("times")).getTime()/1000 > new Date(props.data.start_date).getTime()/1000) &&
                    <button className="btn btn-success" type="submit" disabled={props.loadings}>
                        {props.loading && <i className="fas fa-spinner fa-pulse"></i>}
						{t("common:Button.Submit")}
					</button>
                    }
                </ModalFooter>
            </form>
        </div>
    );
}

export default withTranslation()(FormRegistration);