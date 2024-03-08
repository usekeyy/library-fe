import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { toastr } from 'react-redux-toastr';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import ReactLoading from 'react-loading';
const animatedComponents = makeAnimated();

const KonfigurasiEvaluasi = (props) => {
    const { t } = props;
    const { register, errors, handleSubmit,  control} = useForm({});
    const [mekanisme, setMekanisme] = React.useState(props.metode_evaluasi)
    const onSubmit = async data => {
        if((props.metode_evaluasi==="ambang batas" || props.metode_evaluasi==="sistem_nilai") && data.mekanisme.value!=="sistem_nilai"){
            toastr.error("Error", "Mekanisme / Tipe Lampiran Tidak Diperbolehkan")
        }else{           
            let payload = setData(data);
            if(payload.mekanisme==="ambang batas"){
                console.log(payload)
                if(payload.total!==100){
                    toastr.error("Error", "Total Bobot Maximal 100, Total Bobot : "+payload.total)
                }else{
                    props.storeEvaluasiTeknisConfig(payload)
                }
            }else{
                props.storeEvaluasiTeknisConfig(payload)
            }
        }
    };
    let rows;

    const customStyles = {
        control: (base, state) => ({
            ...base,
            borderColor: state.isFocused ?
                '#ddd' : 'red',
        })
    }

    const handleChange = (e) => {
        setMekanisme(e.value)
    }

    const setData = (data) => {
        let arr={}
        arr.ambang_batas =(data.mekanisme.value === 'sistem_nilai') ? data.ambang_batas:""
        arr.bobot_komersil =(data.mekanisme.value === 'sistem_nilai') ? data.bobot_komersil:""
        arr.bobot_teknis = (data.mekanisme.value === 'sistem_nilai') ? data.bobot_teknis :""
        arr.mekanisme =(data.mekanisme.value === 'sistem_nilai') ? "ambang batas" : 'sistem gugur';
        if(data.proposal_tender_id!==undefined){
            let totalBobot = 0;
            arr.bobot_persyaratan = data.proposal_tender_id.map(function(key, index) {
                if(data.mekanisme.value === 'sistem_nilai'){
                    totalBobot+=parseFloat(data.bobot[index])
                }
                return {
                    'proposal_tender_syarat_id' : data.proposal_tender_id[index],
                    'evaluasi_id' : data.evaluasi_id[index],
                    'bobot' : (data.mekanisme.value === 'sistem_nilai') ? data.bobot[index] : "",
                }
            })
            arr.total=totalBobot
        }
        return arr;
    }


    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{index + 1}</td>
                    <td>{props.data[key]['description']}</td>
                    <td>{mekanisme === "sistem_nilai" && 
                        <input disabled={(props.has_roles.includes("EVA001") && props.assignment==="assign to evaluator") ? false : true}
                        type="number" min="0" ref={register({ required: true })} name={`bobot.${key}`} className="form-control" defaultValue={props.data[key]['bobot']} />
                       
                    }</td>
                    <td>
                        <div>
                        <input type="hidden" ref={register({ required: false })} name={`proposal_tender_id.${key}`} className="form-control" defaultValue={props.data[key]['id_persyaratan']} />
                        <input type="hidden" ref={register({ required: false })} name={`evaluasi_id.${key}`} className="form-control" defaultValue={props.data[key]['evaluasi_id']} />
                        </div>
                    </td>
                </tr>
            )
        });
    }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Konfigurasi Evaluasi</PanelHeader>
                <PanelBody >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row">
                            <div className="col-sm-6">
                                <label >Tipe Lampiran<span className="text-danger"></span></label>
                                <Controller
                                    components={animatedComponents}
                                    closeMenuOnSelect={true}
                                    as={Select}
                                    control={control}
                                    name="mekanisme"
                                    onChange={([selected]) => {
                                        handleChange(selected)
                                        return selected
                                    }}
                                    isDisabled={(props.has_roles.includes("EVA001") && props.assignment==="assign to evaluator") ? false : true}
                                    options={props.mekanismeOptions}
                                    defaultValue={props.metode_evaluasi === null ? null : (props.metode_evaluasi === "sistem_nilai") ? { value: 'sistem_nilai', label: "Ambang Batas" } : { value: 'sistem_gugur', label: "Sistem Gugur" }}
                                    styles={errors.hasil_evaluasi ? customStyles : {}}
                                />
                            </div>
                            {mekanisme === "sistem_nilai" &&
                                <div className="col-sm-6">
                                    <label >Batas Ambang<span className="text-danger"></span></label>
                                    <input type="number" min="0" 
                                        name="ambang_batas" className="form-control" 
                                        ref={register({ required: true })} 
                                        defaultValue={props.ambang_batas} 
                                        disabled={(props.has_roles.includes("EVA001") && props.assignment==="assign to evaluator") ? false : true}
                                    />
                                    {errors.ambang_batas && <span className="text-danger">{errors.ambang_batas.type === "required" ? "Field harus diisi" : ''}  {errors.ambang_batas.message}</span>}
                                </div>
                            }
                        </div>
                        {mekanisme === "sistem_nilai" &&
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label >Bobot Teknis<span className="text-danger"></span></label>
                                        <input 
                                        disabled={(props.has_roles.includes("EVA001") && props.assignment==="assign to evaluator") ? false : true}
                                        type="number" min="0" name="bobot_teknis" className="form-control" ref={register({ required: true })} defaultValue={props.bobot_teknis} />
                                        {errors.bobot_teknis && <span className="text-danger">{errors.bobot_teknis.type === "required" ? "Field harus diisi" : ''}  {errors.bobot_teknis.message}</span>}
                                    </div>
                                </div>
                            </div>
                        }
                        {mekanisme === "sistem_nilai" &&
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label >Bobot Komersil<span className="text-danger"></span></label>
                                        <input 
                                        disabled={(props.has_roles.includes("EVA001") && props.assignment==="assign to evaluator") ? false : true}
                                        type="number" min="0" name="bobot_komersil" className="form-control" ref={register({ required: true })} defaultValue={props.bobot_komersil} />
                                        {errors.bobot_komersil && <span className="text-danger">{errors.bobot_komersil.type === "required" ? "Field harus diisi" : ''}  {errors.bobot_komersil.message}</span>}
                                    </div>
                                </div>
                            </div>
                        }

                        {props.loadings.loading_list_point_penilaian &&
                            <Panel>
                                <PanelBody ><center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>
                                </PanelBody>
                            </Panel>
                        }
                        {!props.loadings.loading_list_point_penilaian &&
                        <div className="row m-t-10">
                            <div className="col-sm-12">
                                <label >Point Penilaian</label>
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Description</th>
                                                <th>Bobot</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>{rows}</tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        }
                        {!props.loadings.loading_list_point_penilaian &&
                        <div className="row pull-right m-t-10">
                            <button type="submit" className="m-r-10 btn btn-info" disabled={((props.has_roles.includes("EVA001") && props.assignment==="assign to evaluator") ? false : true )|| props.loadings.loading_button_save_config}  > 
                                {props.loadings.loading_button_save_config && <i className="fas fa-spinner fa-pulse"></i>}
                                {t("common:Button.Simpan")}
                            </button>
                            {/* <button type="button" className="m-r-10 btn btn-light" disabled={props.loadings.loading_button_save_config} onClick={(e) => props.toggleOpen(e)}> Add</button> */}
                        </div>
                        }
                    </form>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(KonfigurasiEvaluasi);
