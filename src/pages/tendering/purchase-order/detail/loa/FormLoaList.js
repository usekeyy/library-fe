import React from 'react';
import { useForm , Controller} from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ModalBody } from 'reactstrap';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
const animatedComponents = makeAnimated();


const FormLoaList = (props) => {
	const {t} = props;
	const { control, errors, handleSubmit } = useForm({});
	const [status , setStatus] = React.useState("");

	const onSubmit = async data => {
		data.status=status
		console.log(data)
		if(status==="d" || status==="s"){
			props.submitCreateLoa(props.uuid,data);
		}else{
			props.approvalLOA(props.uuid,data);
		}
		
	};

    const changeTipeBatalPO = (selected) => {
        if(selected!== null){
            props.getDocumentTemplateLOA(selected.value)
        }
    }

    const onInputChange = (option, { action }) => {
		if (action === "input-change") {
			props.fetchEDocumentLoa(option)
		}
	};

	const draft  = () => {
        setStatus("d");
    }
    const submit  = () => {
        setStatus("s");
    }

	const reject  = () => {
        setStatus("r");
    }
    const approve  = () => {
        setStatus("a");
    }

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
				<div className="form-group">
					<label >Template LOA <span className="text-danger">*</span> </label>
                    <Controller
                        components={animatedComponents}
                        closeMenuOnSelect={true}
                        as={Select}
                        control={control}
                        options={props.docs_Loa}
                        name="document_loa"
                        onChange={([selected]) => {
                            changeTipeBatalPO(selected)
                            return selected
                        }}
						disabled={props.user.has_roles.includes("KBGPNG") ? true : false}
                        onInputChange={onInputChange}
                        isClearable
                    />
					{errors.name && <span className="text-danger"> {errors.name.type === "required" ? "Field harus diisi" : ''}  {errors.name.message} </span>}
					{props.errors.name && <span className="text-danger">{props.errors.name[0]}</span>}
				</div>
                {!props.loadings.loading_document_ckeditor&&
				<div>
					<CKEditor
						editor={ ClassicEditor }
						data={props.data?.deskripsi===null ? "" : props.data?.deskripsi}
						disabled={props.user.has_roles.includes("KBGPNG") ? true : false}
						config={{
							plugin :[

							],
							toolbar: [
								'heading',
								'|',
								'fontsize',
								'fontfamily',
								'|',
								'bold',
								'italic',
								'underline',
								'strikethrough',
								'removeFormat',
								'highlight',
								'|',
								'numberedList',
								'bulletedList',
								'|',
								'link',
								'blockquote',
								'imageUpload',
								'insertTable',
								'mediaEmbed',
								'|',
								'undo',
								'redo',
								'|',
								'comment',
								'|',
								'trackChanges'
							],
						}}
						onReady={ editor => {
							// You can store the "editor" and use when it is needed.
							console.log( 'Editor is ready to use!', editor );
						} }
						onChange={ ( event, editor ) => {
							const data = editor.getData();
							props.changeTextCKEditor(data)
						}}
					/>
					{props.errors.keterangan && <span className="text-danger">{props.errors.keterangan[0]}</span>}
				</div>
                }
				<div className="pull-right m-t-10 m-b-10">
					{(props.data?.status==="d" || props.data?.status==="r" || props.data?.status===undefined) && props.access.C && props.user.has_roles.includes('BYR001') && <button className="btn btn-info m-l-10" type="submit"  onClick={draft}  disabled={props.loadings.loading_download_generate_loa || props.loadings.loading_create_loa}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  {t("eDocument:button.submit-draft")}</button>}
					{(props.data?.status==="d" || props.data?.status==="r" || props.data?.status===undefined) && props.access.C && props.user.has_roles.includes('BYR001') && <button className="btn btn-success m-l-10" type="submit" onClick={submit} disabled={props.loadings.loading_download_generate_loa || props.loadings.loading_create_loa}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  {t("eDocument:button.submit")}</button>}

					{props.data?.status==="s" && props.access.A && props.user.has_roles.includes('KBGPNG') && <button className="btn btn-danger m-l-10" type="submit"  onClick={reject}  disabled={props.loadings.loading_download_generate_loa || props.loadings.loading_create_loa}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Reject </button>}
					{props.data?.status==="s" && props.access.A &&  props.user.has_roles.includes('KBGPNG') && <button className="btn btn-success m-l-10" type="submit" onClick={approve} disabled={props.loadings.loading_download_generate_loa || props.loadings.loading_create_loa}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Approve </button>}

                    {props.data?.status!==null &&  <button className='btn btn-sm btn-success m-l-10' onClick={(uuid,number)=> props.downloadGeneratePDFLOA(props.uuid,props.no_po_loa)} disabled={props.loadings.loading_download_generate_loa}>
                        {props.loadings.loading_download_generate_loa && <i className="fa fa-spinner fa-spin"></i>}
                        Generate LOA
                    </button>}
				</div>
                </ModalBody>
			</form>
		</div>
	);
}

export default  withTranslation() (FormLoaList);