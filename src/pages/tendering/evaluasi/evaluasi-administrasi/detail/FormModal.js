import React from 'react';
import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { toastr } from 'react-redux-toastr';

const FormModal = (props) => {
    const { t } = props;
    const { register, handleSubmit , watch } = useForm({});
    const watchAllFields = watch();
    const onSubmit = async data => {
        let newData = setData(data)     
        let payload = {}
        if(newData.length === 0){
            toastr.error("Data Not Available")
        }else{
            payload.vendor_id = props.vendor_id
            payload.uuid = props.uuid
            payload.evaluasi = newData
            props.save(payload)
        }
    };

    const setData = (data) => {
        let arrData=[]

        arrData = Object.keys(props.data).map(function (key, index) {
            return (
                {
                    proposal_tender_syarat_id : props.data[key]['proposal_tender_syarat_id'],
                    hasil : data['hasil'][key]===false ? "tidak lolos" : "lolos",
                    keterangan : data['keterangan'][key]
                }
            )
        })
        return arrData
    }
  
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
            <table className="table table-bordered table-striped table-sm text-nowrap">
                <thead>
                <tr>
                    <th>No</th>
                    <th>{t("evaluation:label.description")}</th>
                    <th>File</th>
                    <th>Hasil</th>
                    <th>{t("evaluation:label.note")}</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(props.data).map(function (key, index) {
                        return (
                            <tr key={key}>
                               <td>{index+1}</td>
                               <td>{props.data[key]['description']}</td>
                               <td>{(props.data[key]['file'] !=="" && props.data[key]['file'] !==null) && <a className="pull-right" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/tendering/${props.data[key]['file']}` } > file </a>}</td>
                               <td align="center">
                                    <div className="switcher">
                                        <input disabled={props.isMonitoring} type="checkbox" name={`hasil.${key}`} ref={register({})}  id={"switcher_checkbox_"+key} defaultChecked={(props.data[key]['hasil']===null || props.data[key]['hasil']==="tidak lolos") ? false : true} value="1" />
                                        <label htmlFor={"switcher_checkbox_"+key}></label>
                                    </div>
                                    <div>
                                        {props.isMonitoring ? <label>{(watchAllFields['hasil.'+index]==="1" || props.data[key]['hasil']==="lolos" ) ? "Pass" : "Fail"}</label>
                                        :<label>{(watchAllFields['hasil.'+index]==="1" || props.data[key]['hasil']==="lolos" ) ? (watchAllFields['hasil.'+index]==="1") ? "Pass" : "Fail" : "Fail"}</label>}
                                    </div>
                               </td>
                               <td>
                                    <input disabled={props.isMonitoring} type="text" name={`keterangan.${key}`} className="form-control" ref={register({})} defaultValue={props.data[key]['keterangan']}/>
                               </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            
            {!props.isMonitoring && 
                <div className="row">
                    <div className="col-sm-12">
                        <div className="pull-right m-t-5 m-b-5">
                            <button
                                disabled={props.loadings.loadingBtnSubmitOnModal}
                                type="submit"
                                className="btn btn-success m-r-5">
                                {props.loadings.loadingBtnSubmitOnModal && <i className="fa fa-spinner fa-spin"></i> } 
                                Send
                        </button>
                        </div>
                    </div>
                </div>
            }   
            </form>
        </div>
    );
}

export default withTranslation()(FormModal);