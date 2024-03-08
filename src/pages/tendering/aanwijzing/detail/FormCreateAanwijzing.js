import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { ModalBody, ModalFooter } from 'reactstrap';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import ListVendorEproc from './ListVendorEproc';
import { toastr } from 'react-redux-toastr';

const animatedComponents = makeAnimated();


const FormCreateAanwijzing = (props) => {
    const { t } = props;
    const { register, control, handleSubmit, errors } = useForm({});
    const [options, setOptions] = React.useState("eproc")
    const [proposal, setProposal] = React.useState("")
    const onSubmit = async data => {
        if(data.filter_by===undefined){
            toastr.warning ("Warning", "Please Select Filter")
        }else if (options === 'sap') {
            props.createSAP(data)
        }else if (options === 'eproc' ){
            data.filter_by = data.filter_by.value
            data.proposal_tender_uuid = proposal
            props.storeAanwijzingConfig(data)
        }
        
        // props.save({
        // 	id: data.id,
        // 	name: data.name,
        // 	sub_district_id: data.sub_district_id.value
        // });
        // console.log(data)
    };

    const handleChange = (e) => {
        props.removeErrorConfig()
        setOptions(e.value)
    }

    const handleChangeRadio = (e) => {
        setProposal(e)
    }

    return (
        <div >
            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>
                    <Panel className="col-lg-12 margin-bot-false" >
                        <PanelHeader noButton={true}>Source</PanelHeader>
                        <PanelBody>
                            <div className="form-group">
                                <Controller
                                    components={animatedComponents}
                                    closeMenuOnSelect={true}
                                    as={Select}
                                    control={control}
                                    options={props.optionsCreate}
                                    name="filter_by"
                                    onChange={([selected]) => {
                                        handleChange(selected)
                                        return selected
                                    }}
                                    defaultValue={{label:'E-Proc' , value :'eproc'}}
                                    inputRef={(e) => register({ name: "filter_by", required: true })}
                                    rules={{ required: false }}
                                // isClearable
                                />
                                {errors.filter_by && <span className="text-danger">* This field is required</span>}
                            </div>
                            {options === "sap" &&
                                <div className="form-group">
                                    <label> Referensi <span className="text-danger">*</span></label>
                                    <input className={"form-control"} name="referensi" ref={register({ required: true })} />
                                    {errors.referensi && <span className="text-danger">* This field is required</span>}
                                </div>
                            }

                            {options === "eproc" &&
                                <div className="form-group" style={{ zIndex: 0, position: "relative" }}>
                                    <ListVendorEproc
                                        handleChangeRadio={(payload) => handleChangeRadio(payload)} 
                                    />
                                    {props.errors.proposal_tender_uuid && <span className="text-danger">{props.errors.proposal_tender_uuid[0]}</span>}
                                </div>
                            }
                        </PanelBody>
                    </Panel>
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-success" type="submit" disabled={props.loadings.loading_aanwijzing_config_store}> 
                        {props.loadings.loading_aanwijzing_config_store &&  <i className="fas fa-spinner fa-pulse"></i> }
                        Create
                    </button>
                    <button className="btn btn-white" type="button" onClick={() => props.toggleCloseModal()} > {t("common:Button.Tutup")}</button>
                </ModalFooter>
            </form>
        </div>
    );
}

export default withTranslation()(FormCreateAanwijzing);