import React from 'react';
import { useForm } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
// import Select from 'react-select';
// import makeAnimated from 'react-select/animated';
// import ReactLoading from 'react-loading';
import { Panel, PanelBody, PanelHeader } from '../../../../containers/layout/sub/panel/panel';
// const animatedComponents = makeAnimated();

const FormBeritaAcara = (props) => {
    // let rows = []
    const { t } = props;
    const { register, handleSubmit, } = useForm({});
    // const [rows, setRow] = React.useState(props.data)
		const rows = props.data;
    const onSubmit = async data => {      
       props.storeBeritaAcara({auctions_id : props.state.data.header.auctions_id, data: setData(data)})
    };
  
    const addColumns = (e) => {
        props.addColumn()
    }

    const setData = (data) => {
        let arr = []
        data.nama.forEach((element,i) =>{
            arr.push({
                "nama" : data.nama[i],
                "jabatan" : data.jabatan[i],
                "department" : data.departement[i] 
            })
        })

        return arr ;
    }
    
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>
                   
                    <Panel className="margin-bot-false">
                        <PanelHeader>Header</PanelHeader>
                        <PanelBody>
                            <div className="row">
                            <table className="table table-bordered table-striped table-sm text-nowrap">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Nama</th>
                                        <th>Jabatan</th>
                                        <th>Departement</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((element,i) => (
                                        <tr key={(i)}>
                                            <td>{(i+1)}</td>
                                            <td>
                                                <input type="text" className="form-control" name={'nama['+i+']'} ref={register()} defaultValue={element['nama']} />
                                                {props.errors['data.'+i+'.nama'] && <span className="text-danger">{props.errors['data.'+i+'.nama'][0].replace("."+i+".", " ")}</span>}
                                            </td>
                                            <td>
                                                <input type="text" className="form-control" name={'jabatan['+i+']'} ref={register()} defaultValue={element['jabatan']} />
                                                {props.errors['data.'+i+'.jabatan'] && <span className="text-danger">{props.errors['data.'+i+'.jabatan'][0].replace("."+i+".", " ")}</span>}
                                            </td>
                                            <td>
                                                <input type="text" className="form-control" name={'departement['+i+']'} ref={register()} defaultValue={element['department']} />
                                                {props.errors['data.'+i+'.department'] && <span className="text-danger">{props.errors['data.'+i+'.department'][0].replace("."+i+".", " ")}</span>}
                                            </td>
                                        </tr>
                                        ))}
                                </tbody>
                            </table>
                            </div>
                            <div className="row pull-right">
                                <button className="btn btn-primary btn-sm"
                                type="button"
                                    onClick={(e)=>addColumns(e)}
                                >
                                    ADD
                                </button>
                            </div>
                        </PanelBody>
                    </Panel>
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-white" type="button" onClick={() => props.toggleClose()}>
                        {t("mappingValueApproval:button.close")}
                    </button>
                    <button className="btn btn-success" type="submit" disabled={props.loadings.loading_submit_berita_acara}>
                        {props.loadings.loading_submit_berita_acara && <i className="fa fa-spinner fa-spin"></i>}
                        {props.data.length > 0 ? t("mappingValueApproval:button.update") : t("mappingValueApproval:button.submit")}
                    </button>
                </ModalFooter>
            </form>
        </div>
    );
}

export default withTranslation()(FormBeritaAcara);