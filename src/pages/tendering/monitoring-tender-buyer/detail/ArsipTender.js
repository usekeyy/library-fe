import React from 'react';
import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import FileUploadInformation from '../../../../components/upload/FileUploadInformation'
import {toastr} from 'react-redux-toastr';
// import { RowEmpty } from '../../../../components/tableoptions/TableOptions';
// import { each } from 'tinymce';

const ArsipTender = (props) => {
        const [loadingUpload, setLoadingUpload] = React.useState(false)
        let {data, isBuyer} = props;
        const {paramType} = props.parentState;
        let rows;
        let vendor_nego;
        let aanwijzing_ba = []
        props.aanwijzing_ba!==undefined && props.aanwijzing_ba.forEach((val, key) => {
            aanwijzing_ba.push(<tr key={key}>
                {/* <td>1</td> */}
                <td>{val['aanwijzing_name'] + " Versi  : " + val['versi'] }</td>
                <td>Berita Acara Aanwijzing</td>
                <td className="text-center"><button className="btn btn-xs btn-primary" onClick={(e) => props.downloadAanwijzing(e, val['uuid'])}><i className="fa fa-file" aria-hidden="true"></i></button></td>
                {/* <td><button className="btn btn-xs btn-danger" onClick={(e) => e.preventDefault()}>Delete</button></td> */}
                <td></td>	
            </tr>)
        })
        if (data.dokumen?.length > 0){
            rows = data.dokumen.map((dt, i) => {
                return (
                    <tr key={i}>
                        {/* <td>{(i+4+data.vendor_nego?.length)}</td> */}
                        <td>{dt.type}</td>
                        <td>{dt.description}</td>
                        <td className="text-center">
                            <button className="btn btn-xs btn-primary">
                                <a style={{color : "inherit"}} target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/tendering/${dt.file}`}><i className="fa fa-file"></i></a>
                            </button>
                        </td>     
                        <td className="text-center"><button className="btn btn-xs btn-danger" onClick={(e) => props.delete(e,dt.uuid)}>hapus</button></td>              
                    </tr>
                )
            })
        }

        if (data.vendor_nego?.length > 0){
            vendor_nego = data.vendor_nego.map((dt,i) => {
                return (
                    <tr key={i}>
                        {/* <td>{i+4}</td> */}
                        <td>Nego</td>
                        <td>{dt.vendor_name}</td>
                        <td className="text-center"><button className="btn btn-xs btn-primary" onClick={(e) => props.downloadNego(e,dt.vendor_id)}><i className="fa fa-file" aria-hidden="true"></i></button></td>
                        <td></td>	
                    </tr>
                )
            })
        }

        const { register, errors, handleSubmit, setValue } = useForm({});

        const onSubmit = async datax => {
            props.save(datax)
            setValue("tipe_lampiran", "")
            setValue("deskripsi", "")
            setValue("file_name", "")
            setValue("file", "")
        };

        const changeFileArsipTender = (e) => {
            // setLoading(!loading);
            setLoadingUpload(true)
            props.upload('ARSTND', e.target.files[0])
            .then((resp) => {
                setLoadingUpload(false)
                setValue("file_name", resp.data.data.name)
            })
            .catch((err) => {
                setLoadingUpload(false)
                setValue("file_name", '')
                toastr.error(err.data.message, err.data.status)
            })
        }
    return (
			<div>
				<Panel>
					<PanelHeader>Arsip Tender</PanelHeader>
					
					<PanelBody >
						<div className="row">
							<div className="col-sm-12">
                                {paramType !== 'retender' && isBuyer && <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="form-group">
                                        <label>Tipe Lampiran<span className="text-danger">*</span></label>
                                        <div>
                                            <input className={(errors.tipe_lampiran) ? "form-control is-invaltipe_lampiran" : "form-control"} name="tipe_lampiran" ref={register({ required: true })} />
                                            {errors.tipe_lampiran && <span className="text-danger">* This field is required</span>}
                                            {/* {msg.tipe_lampiran && <span className="text-danger"> {msg.tipe_lampiran[0]} </span>} */}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Description<span className="text-danger">*</span></label>
                                        <div>
                                            <input className={(errors.deskripsi) ? "form-control is-invalid" : "form-control"} name="deskripsi" ref={register({ required: true })} />
                                            {errors.deskripsi && <span className="text-danger">* This field is required</span>}
                                            {/* {msg.deskripsi && <span className="text-danger"> {msg.deskripsi[0]} </span>} */}
                                            <input type="file" name="file_arsip_tender"></input>
                                        </div>
                                    </div>
                                    <div className="form-group row m-b-15">
                                        {/* <label>File<span className="text-danger">*</span></label> */}
                                        <div className="col-md-8">
                                            <input type="text" className={(errors.file) ? "form-control is-invalid" : "form-control"} name="file_name" ref={register({required: true})} placeholder="" disabled={true} />
                                            {errors.file_name && <span className="text-danger">* This field is required</span>}
                                            <FileUploadInformation idFileUpload="ARSTND"/>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="custom-file-upload">
                                                <input type="file" name="file" ref={register({required: false})} placeholder="" onChange={changeFileArsipTender} className="form-control" disabled={loadingUpload}/>
                                                <i className={loadingUpload ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> 
                                                Telusuri
                                            </label>
                                        </div>
                                        
                                    </div>
                                    <div className="form-group">
                                        <button className="btn btn-white" type="submit" disabled={props.loading.saveArsipTender}>
                                        {props.loading.saveArsipTender && <i className="fas fa-spinner fa-pulse"/>}
                                             Upload
                                        </button>
                                    </div>
                                </form>}
                                <div className="table-responsive">
                                        <table className="table table-bordered table-striped table-sm text-nowrap">                                            
                                            <thead>
                                                <tr>
                                                    {/* <th>No</th> */}
                                                    <th>Tipe Lampiran</th>
                                                    <th>Description</th>
                                                    <th>File</th>
                                                    <th>Action</th>												
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {props.isBidOpening && 
                                                <tr>
                                                    {/* <td>1</td> */}
                                                    <td>Bid Opening</td>
                                                    <td>Berita Acara Bid Opening</td>
                                                    <td className="text-center"><button className="btn btn-xs btn-primary" onClick={(e) => props.downloadBO(e)}><i className="fa fa-file" aria-hidden="true"></i></button></td>
                                                    {/* <td><button className="btn btn-xs btn-danger" onClick={(e) => e.preventDefault()}>Delete</button></td> */}
                                                    <td></td>	
                                                </tr>}
                                                {props.isBidOpening && 
                                                <tr>
                                                    {/* <td>1</td> */}
                                                    <td>Bid Opening</td>
                                                    <td>Bid Tabulation</td>
                                                    <td className="text-center"><button className="btn btn-xs btn-primary" onClick={(e) => props.downloadBidOpeningBidTabulation(e)}><i className="fa fa-file" aria-hidden="true"></i></button></td>
                                                    {/* <td><button className="btn btn-xs btn-danger" onClick={(e) => e.preventDefault()}>Delete</button></td> */}
                                                    <td></td>	
                                                </tr>}
                                                
                                                {/* {props.isAanwijzing &&  */}
                                                {aanwijzing_ba?.length>0 && aanwijzing_ba}
                                               
                                                {/* } */}
                                                {props.isAwarding && <tr>
                                                    {/* <td>2</td> */}
                                                    <td>Awarding</td>
                                                    <td>Surat Pengumuman Pemenang</td>
                                                    <td className="text-center"><button className="btn btn-xs btn-primary" onClick={(e) => props.downloadAwarding(e)}><i className="fa fa-file" aria-hidden="true"></i></button></td>
                                                    <td></td>	
                                                </tr>}
                                                {vendor_nego?.length > 0 && vendor_nego}
                                                {props?.dataNego?.uuid && 
                                                <tr>
                                                    <td>Nego</td>
                                                    <td>Resume Bid Tabulation</td>
                                                    <td className="text-center"><button className="btn btn-xs btn-primary" onClick={(e) => props.downloadBidTabulation(e)}><i className="fa fa-file" aria-hidden="true"></i></button></td>
                                                    <td></td>	
                                                </tr> }
                                                {rows?.length>0 && rows }
                                            </tbody>
                                        </table>
                                </div>
							</div>
						</div>
					</PanelBody>
				</Panel>
			</div>
    );
}

export default withTranslation()(ArsipTender);