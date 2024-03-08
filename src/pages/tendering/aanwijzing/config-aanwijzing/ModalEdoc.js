import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { RowEmpty } from '../../../../components/tableoptions/TableOptions';
import { Panel, PanelHeader } from '../../../../containers/layout/sub/panel/panel';
import ReactLoading from 'react-loading';


const ModalEdoc = (props) => {
	const { t } = props;
	const { register, control, handleSubmit, getValues } = useForm({});
	// const [loadingBtn, setLoadingBtn] = React.useState(false)
	const [loadingDelete, setLoadingDelete] = React.useState(false)
	const [edocuments, setEdocuments] = React.useState(props.edocData.items)
	// const [title, setTitle] = React.useState(props.parentState.tempData.edocs.title)
	// const [titleRequired, setTitleRequired] = React.useState(false)
	// const [itemsRequired, setItemsRequired] = React.useState(false)
	
	const modules = {
			toolbar: [
					['bold', 'italic', 'underline', 'strike'],        // toggled buttons
					['blockquote', 'code-block'],
					[{ 'header': 1 }, { 'header': 2 }],               // custom button values
					[{ 'list': 'ordered' }, { 'list': 'bullet' }],
					[{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
					[{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
					[{ 'direction': 'rtl' }],                         // text direction
					[{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
					[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
					[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
					[{ 'font': [] }],
					[{ 'align': [] }],
					[ 'link', 'image' ], 	
					['clean']
			],
			clipboard: {
					// toggle to add extra line breaks when pasting HTML:
					matchVisual: false,
			}
	}

	const onSubmit = async data => {
		props.save(data)
	}

	// const setData = (data) => {
	// 	// setLoadingBtn(true)
	// 	// const edocitemsRequired = []
	// 	// var date = (new Date()).toISOString().split('T')[0];
	// 	// data.created_at = date;
	// 	// data.created_by = props.parentProps.user.name;
	// 	// data.edoc = {
	// 	// 	title: data.title,
	// 	// 	items: (data.items !== undefined) ? data.items : []
	// 	// };
		
	// 	// setTitleRequired(data.title !== '' ? false : true)
	// 	// setItemsRequired(data.edoc.items.length > 0 ? false : true)
	// 	// if(data.edoc.items.length > 0){
	// 	// 	data.edoc.items.forEach((item, key) => {
	// 	// 		if(getValues(`items[${key}].title`) === '' || getValues(`items[${key}].content`) === ''){
	// 	// 			edocitemsRequired.push(key)
	// 	// 		}
	// 	// 	})
	// 	// }
		
	// 	// delete data.items
	// 	// if(data.title !== '' && data.edoc.items.length > 0 && edocitemsRequired.length === 0){
	// 	// 	props.addEdoc(data, props.parentState.tempData.edocs.id)
	// 	// 	props.toggleClose()
	// 	// }
	// 	// setLoadingBtn(false)
	// }

	const handleDelete = (e, id) => {
		console.log(id)
		setLoadingDelete(true)
		let arr = [];
		delete edocuments[id]
		edocuments.forEach((element, i) => {
			arr.push(element)
		});
		setEdocuments(arr)
		setTimeout(() => {
			setLoadingDelete(false)
		}, 100);
		e.preventDefault();
	}
	
	const addDocument = (e, key) => {
		setEdocuments(edocuments.concat({id : key}))
		e.preventDefault();
	}

	const handleChange = (e, key) => {
		e.preventDefault()
		const { value } = e.target;
		if(key !== ''){
			edocuments[key].title = value;
		} 
	}

	const handleChangeContent = (value, key) => {
		edocuments[key].content = value;
	}

	let rows;
	if (edocuments.length > 0) {
		rows = edocuments.map((dt, i) => {
				return (
						<tr key={i}>
								<td>
									<div className="form-group">
										<div>
											<input type="hidden" name={`items[${i}].uuid`} ref={register({})} defaultValue={edocuments[i].uuid} className="form-control" />
											<input type="hidden" name={`items[${i}].order`} ref={register({})} defaultValue={i} className="form-control" />
											<input type="text" name={`items[${i}].title`} ref={register({required:true})} defaultValue={(edocuments[i].title) ? edocuments[i].title : ''} placeholder="type a content title ..." onChange={(e) => handleChange(e, i)} className="form-control" />
											{getValues(`items[${i}].title`) === '' && <span className="text-danger"> {'* This Field Is Required'} </span>}
										</div>
									</div>
									<div className="form-group">
										<div>
											<Controller
													as={ReactQuill} 
													placeholder="type a content ..."
													name={`items[${i}].content`}
													onChange={([value]) => {
														handleChangeContent(value, i)
														return value;
													}}
													modules={modules}
													control={control}
													defaultValue={(edocuments[i].content) ? edocuments[i].content : ''}
													rules={{ required: true }} />
													{getValues(`items[${i}].content`) === '' && <span className="text-danger"> {'* This Field Is Required'} </span>}
										</div>
									</div>
								</td>
								<td>
									<button className="btn btn-xs btn-danger" type="button" onClick={(e) => handleDelete(e,i)} ><i className="danger fa fa-trash"></i></button>
								</td>
						</tr>
				)
		})
	} else {
		rows = (<RowEmpty colSpan='2'>Tidak ada data</RowEmpty>);
	}

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					<Panel >
						<PanelHeader  noButton={true}>
							Create E-Document Aanwijzing
						</PanelHeader>
						<div className="row m-t-10">
							<div className="col-md-12">
								<div className="form-group">
									<label>Title</label>
									<div>
										<input type="text" name="title" ref={register({})} placeholder="type edocument title ..." defaultValue={props.edocData.title}  className="form-control" />
										<input type="hidden" name="index" ref={register({})} placeholder="type edocument title ..." defaultValue={props.indexEdoc}  className="form-control" />
									</div>
								</div>
								<Panel >
									<PanelHeader  noButton={true}>E-Document</PanelHeader>
									<div className="m-t-10 m-b-10">
											<button className="btn btn-primary btn-xs" type="button" onClick={(e) =>  addDocument(e,edocuments.length) }>
											<i className={"fa fa-plus"} /> {t('Button.Tambah')} </button>
									</div>
									<div className="table-responsive">
										<table className="table table-bordered table-sm">
											<thead>
													<tr>
															<th>E-Document</th>
															<th>Action</th>
													</tr>
											</thead>
											{loadingDelete===true &&
												<tbody>
													<tr>
													 <td colSpan="2">
														<center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br/></center>
													 </td>
													</tr>
												</tbody>
											}
											{loadingDelete===false &&
											<tbody>{rows}</tbody>
											}
										</table>
									</div>
								</Panel>
							</div>
						</div>
					</Panel>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" type="button" onClick={() => props.toggleClose()} >{t("currency:button.close")}</button>
					<button className="btn btn-success" type="submit" > 
					{/* {loadingBtn && <i className="fa fa-spinner fa-spin"></i>} */}
					Save </button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation()(ModalEdoc);