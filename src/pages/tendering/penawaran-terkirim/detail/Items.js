import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
// import { withTranslation } from 'react-i18next';
// import { toastr } from 'react-redux-toastr';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../components/tableoptions/TableOptions';
import {formatNumber} from '../../../../helpers/formatNumber';
// import Select from 'react-select';
// import makeAnimated from 'react-select/animated';
import {restrictNumber} from '../../../../helpers/restrictNumber';
// const animatedComponents = makeAnimated();


const Items = (props) => {
    // const { t } = props;
		const { register, control, watch } = useFormContext();
		const { fields, append } = useFieldArray({ control, name: "items" });
		// const customStyles = { control: (base, state) => ({ ...base, borderColor: state.isFocused ? '#ddd' : 'red' })}
		const watchAllFields = watch();
		// const { t } = props.parentProps;
		const {items} = props.parentState.quotation;
		const {tempQuotes} = props.parentState.quotation;
		const {tempData} = props.parentState;
		// const {header} = props.parentState.quotation;
		const {paramType} = props.parentState;
		// const {quotation} = props.parentState;
		const {errors} = props.parentState.quotation;
		const {loadings} = props.parentState;
		const [mounted, isMounted] = React.useState(true)
		const [quotes, setQuotes] = React.useState([])
		const [loadingItems, setLoadingItems] = React.useState(false)
		const [quoteItems, setQuoteItems] = React.useState([])
		// const [loading, setLoading] = React.useState(false)
		// const [loadingQuote, setLoadingQuote] = React.useState(false)
		// const [loadingInput, setLoadingInput] = React.useState([])
		// const [loadingInputTotal, setLoadingInputTotal] = React.useState([])
		// const [filelampiran, setFilelampiran] = React.useState()
		// const loading = false
		const loadingQuote = false
		const loadingInput = []
		const loadingInputTotal = []
		const filelampiran = ""
		const getItems = Object.keys(tempData).length > 0 ? tempData.items : [];
		// const itemsData = paramType === 'update' ? getItems : items;
		const itemsData = items;
		const quotesData = paramType === 'update' ? getItems : [];
		const quotesParent = paramType === 'update' ? [] : tempQuotes;
		// const [services, setServices] = React.useState([])

		const getQuotesData = React.useCallback((data, items) => {
			setLoadingItems(true);
			let newArr = [...quotes]; 
			let arr = []
			let setVal = []
			if(data.length > 0){
				data.forEach((item, i) => {
					const pt_items = items.filter( i => i.purchasing_requisition_item_id === item.purchasing_requisition_item_id)
					newArr[i] = {id: item.purchasing_requisition_item_id, value: item.quote, child: []}; 
					setQuotes(newArr);
					if(item.quote === 'deviate' && item.tipe === 'barang'){
						var obj = {
							id: item.proposal_tender_item_uuid,
							indexId: item.purchasing_requisition_item_id,
							proposal_tender_item_id: item.proposal_tender_item_id,
							purchasing_requisition_item_id: item.purchasing_requisition_item_id,
						}
						arr.push(obj)
					}
					if(item.service_lines && item.service_lines.length > 0 && item.tipe === 'jasa'){
						item.service_lines.forEach((line, key) => {
							if(line.quote === 'deviate'){
								var objLines = {
									id: pt_items[0].service_lines[key].uuid,
									indexId: line.purchasing_requisition_item_id,
									proposal_tender_item_id: line.id,
									purchasing_requisition_item_id: line.purchasing_requisition_id,
								}
								if(line.purchasing_requisition_item_id === item.purchasing_requisition_item_id){
									arr.push(objLines)
								}
							} 
						})
					}
				})
			}
			// check duplicate
			const valueArr = arr.map((item) => { return item.id });
			valueArr.some((item, idx) => { 
					const checkIndexDuplicate = valueArr.indexOf(item);
					if(valueArr.indexOf(item) === idx){
						setVal.push(arr[checkIndexDuplicate])
					}
					return false;
			});
			append(setVal.sort((a,b) => a.proposal_tender_item_id-b.proposal_tender_item_id).sort((a,b) => a.purchasing_requisition_item_id-b.purchasing_requisition_item_id))
			setTimeout(() => {
				setLoadingItems(false);
				isMounted(false)
			}, 500)
		}, [append, quotes])

		React.useEffect(() => {
			if(loadings.items === false){
				if(mounted){
					setQuoteItems(itemsData)
				}
				if(items.length > 0 && quoteItems.length > 0 && tempQuotes.length > 0 && itemsData.length > 0 && quotesData.length > 0){
						if(mounted){
							setQuotes(quotesParent)
							getQuotesData(quotesData, items)
						}
				}
			}
		}, [quoteItems, items, itemsData, quotesData, quotesParent, getQuotesData, tempQuotes, mounted, loadings, fields]);

		// const onInputChangeIncoterm = (option, { action }) => {
		// 	if (action === "input disabled-change") {
		// 		props.fetchIncoterms(option)
		// 	}
		// };

		// const handleChangeQuote = (e, i, data, service_line, items) => {
		// 	setLoadingQuote(true);
		// 	const getQuote = e.target.value
		// 	let newArr = [...quotes]; 
		// 	let lines = [];
		// 	let quoteLines = [];
		// 	let load_lines = [];
		// 	if(service_line && service_line.length > 0){
		// 		service_line.forEach((line, key) => { 	
		// 			load_lines.push(line.uuid)					
		// 			var objLines = { id: line.purchasing_requisition_item_id, uuid: line.uuid, value: getQuote }
		// 			quoteLines.push(objLines)
		// 			if(getQuote === 'deviate'){
		// 				var obj = {
		// 					id: line.uuid,
		// 					indexId: line.purchasing_requisition_item_id,
		// 					proposal_tender_item_id: line.id,
		// 					purchasing_requisition_item_id: line.purchasing_requisition_id,
		// 				}
		// 				if(line.purchasing_requisition_item_id === data.purchasing_requisition_item_id){
		// 					lines.push(obj)
		// 					append(lines)
		// 				}
		// 			} else {
		// 				if(fields.length > 0){
		// 					const index = fields.map((item) => { return item.indexId; }).indexOf(items.purchasing_requisition_item_id);
		// 					if(index !== -1){
		// 						// remove(index)
		// 						fields.splice(index, 1)
		// 					}
		// 				}
		// 			}
		// 		})
		// 		setLoadingInput(load_lines)
		// 		setLoadingInputTotal(load_lines)
		// 	} else {
		// 		setLoadingInput([i])
		// 		setLoadingInputTotal([i])
		// 		if(getQuote === 'deviate'){
		// 			append({
		// 					id: data.uuid,
		// 					indexId: data.purchasing_requisition_item_id,
		// 					proposal_tender_item_id: data.id,
		// 					purchasing_requisition_item_id: data.purchasing_requisition_id,
		// 			})
		// 		} else {
		// 			if(fields.length > 0){
		// 				const index = fields.map((item) => { return item.indexId; }).indexOf(data.purchasing_requisition_item_id);
		// 				if(index !== -1){
		// 					remove(index)
		// 				}
		// 			}
		// 		}
		// 	}
		// 	newArr[i] = {id: paramType === 'update' ? data.purchasing_requisition_item_id : data.purchasing_requisition_item_id, value: getQuote, child: quoteLines}; 
		// 	setQuotes(newArr);
		// 	setTimeout(() => {
		// 		setLoadingQuote(false);
		// 		setLoadingInput([])
		// 	}, 1000)
		// 	setTimeout(() => {
		// 		setLoadingInputTotal([])
		// 	}, 1500)
		// };

		// const changeFile = (e) => {
		// 	e.preventDefault()
		// 	if (e.target.files[0] !== undefined) {
		// 		setLoading(true);
		// 		props.upload('QBID01', e.target.files[0])
		// 		.then((resp) => {
		// 				setLoading(false);
		// 				setValue("bidbond_file", resp.data.data.name)
		// 				setFilelampiran(resp.data.data.name);
		// 		})
		// 		.catch((err) => {
		// 				setLoading(false);
		// 				setFilelampiran('');
		// 				setValue("bidbond_file", '')
		// 				toastr.error(err.data.message, err.data.errors.file[0])
		// 		})
		// 	} else {
		// 			setValue('file', '')
		// 	}
		// }

		const findIndex = (datas, i) => {
			if(datas.length > 0){
				const index = datas.map((item) => { return item.id; }).indexOf(i);
				return index;
			}
		}

		const downloadLampiran = (e, url) => {
			e.preventDefault()
			window.open(url, "_blank")
		}

		let rows;
		let service_lines;
		if (quoteItems.length > 0) {
				let Total = 0;
				rows = quoteItems.map((dt, i) => {
					const per = parseInt(dt.per);
					const qtyItems = (watchAllFields[`items[${i}].qty`] !== undefined) ? watchAllFields[`items[${i}].qty`] : 0;
					const priceItems = (watchAllFields[`items[${i}].valuation_price`] !== undefined) ? watchAllFields[`items[${i}].valuation_price`] : 0;
					// const valuationPrice = isNaN(parseInt(qtyItems)) ? 0 : (parseInt(qtyItems)/per)*isNaN(parseInt(priceItems)) ? 0 : parseInt(priceItems);
					const totalPerItem = priceItems*(qtyItems/per)
					// const total_penawaran_deviate = parseInt(dt.valuation_price)*(parseInt(dt.qty)/parseInt(dt.per))
					const findIndexes = findIndex(quotes, paramType === 'update' ? dt.purchasing_requisition_item_id : dt.purchasing_requisition_item_id);
					const quotesValue = (quotes[findIndexes] !== undefined) ? quotes[findIndex(quotes, paramType === 'update' ? dt.purchasing_requisition_item_id : dt.purchasing_requisition_item_id)].value : '';
					// const showInput = (quotesValue === 'no_quote' || quotesValue === '' || quotes[findIndexes] === undefined) ? false : true;
					const isServices = dt.service_lines && dt.service_lines.length > 0;
					if(!isServices) { Total += totalPerItem; }
					// const showGoods_spec = !isServices && quotesValue === 'deviate' ? false : true;
					// const showGoods_qty = !isServices && quotesValue === 'deviate' ? false : true;
					// const showGoods_val = !isServices && (quotesValue === 'deviate' || quotesValue === 'comply') ? false : true;
					// const showGoods_remark = !isServices && (quotesValue === 'no_quote' || quotesValue === '') ? true : false;
					// const showGoods_dlv = quotesValue === 'no_quote' || quotesValue === '' ? true : false;
					const showGoods_input = !isServices ? null : {display: 'none'};
					const isGoodsDeviate = !isServices && quotesValue === 'deviate';
					const valueGoods_spec = paramType === 'update' ? isGoodsDeviate ? getItems.length > 0 ? getItems[i].long_text : '' : dt.long_text : dt.long_text
					const valueGoods_qty = paramType === 'update' ? isGoodsDeviate ? getItems.length > 0 ? parseFloat(getItems[i].qty) : '' : parseFloat(dt.qty) : parseFloat(dt.qty)
					var arr_fields = fields;
					var setVal_fields = [];
					const valueArr = arr_fields.map((item) => { return item.id });
					valueArr.some((item, idx) => { 
							const checkIndexDuplicate = valueArr.indexOf(item);
							if(valueArr.indexOf(item) === idx){
								setVal_fields.push(arr_fields[checkIndexDuplicate])
							}
							return false;
					});
					if(dt.service_lines && dt.service_lines.length > 0){
						service_lines = dt.service_lines.map((line, key) => {
							const perLine = parseInt(line.per);
							const qtyLineItems = (watchAllFields[`service_lines[${line.id}].qty`] !== undefined) ? watchAllFields[`service_lines[${line.id}].qty`] : 0;
							const priceLineItems = (watchAllFields[`service_lines[${line.id}].valuation_price`] !== undefined) ? watchAllFields[`service_lines[${line.id}].valuation_price`] : 0;
							// const valuationLinePrice = isNaN(parseInt(qtyLineItems)) ? 0 : (parseInt(qtyLineItems)/perLine)*isNaN(parseInt(priceLineItems)) ? 0 : parseInt(priceLineItems);
							const totalPerLineItem = priceLineItems*(qtyLineItems/perLine)
							// const findLineIndexes = findIndex(quotes, line.purchasing_requisition_item_id);
							// const quotesLineValue = (quotes[findLineIndexes] !== undefined) ? quotes[findIndex(quotes, line.purchasing_requisition_item_id)].value : '';
							// const showInput = (quotesLineValue === 'no_quote' || quotesLineValue === '' || quotes[findLineIndexes] === undefined) ? false : true;
							Total += totalPerLineItem
							const getServiceLines = paramType === 'update' ? quotesData.length > 0 ? quotesData[i].service_lines.filter( i => i.purchasing_requisition_service_id === line.id) : [] : [];
							// const showServices_spec = isServices && quotesValue === 'deviate' ? false : true;
							// const showServices_qty = isServices && quotesValue === 'deviate' ? false : true;
							// const showServices_val = isServices && (quotesValue === 'deviate' || quotesValue === 'comply') ? false : true;
							// const showServices_remark = isServices && (quotesValue === 'no_quote' || quotesValue === '') ? true : false;
							// const showServices_dlv = true;
							const isServicesDeviate = isServices && quotesValue === 'deviate';
							const valueServices_spec = paramType === 'update' ? isServicesDeviate ? getServiceLines.length > 0 ? getServiceLines[0].short_text : '' : line.short_text : line.short_text
							const valueServices_qty = paramType === 'update' ? isServicesDeviate ? getServiceLines.length > 0 ? parseFloat(getServiceLines[0].qty) : '' : parseFloat(line.qty) : parseFloat(line.qty)
							
							return (
								<React.Fragment key={line.id}>
								{
									setVal_fields.length > 0 && setVal_fields.map((field, index) => {
											if(line.purchasing_requisition_item_id === field.indexId && line.uuid === field.id){
												return (
													<tr key={field.id}>
														<td style={{ fontWeight: 'bold', backgroundColor: 'lightgray' }}></td>
														<td style={{ fontWeight: 'bold', backgroundColor: 'lightgray' }}>{line.material_group_id}</td>
														<td style={{ fontWeight: 'bold', backgroundColor: 'lightgray' }}>{line.short_text}</td>
														<td style={{ fontWeight: 'bold', paddingLeft: '17px', backgroundColor: 'lightgray' }}>{line.long_text}</td>
														<td style={{ fontWeight: 'bold', paddingLeft: '17px', backgroundColor: 'lightgray' }}>{line.qty}</td>
														<td style={{ fontWeight: 'bold', backgroundColor: 'lightgray' }}>{line.uom}</td>
														<td style={{ fontWeight: 'bold', backgroundColor: 'lightgray' }}>{''}</td>
														<td style={{ fontWeight: 'bold', backgroundColor: 'lightgray' }} align="right">{''}</td>
														<td style={{ fontWeight: 'bold', backgroundColor: 'lightgray' }}>{line.currency}</td>
														<td style={{ fontWeight: 'bold', backgroundColor: 'lightgray' }}>{''}</td>
														<td style={{ fontWeight: 'bold', backgroundColor: 'lightgray' }}>{''}</td>
													</tr>
												)
										}
										return true
									})
								}
								<tr key={line.id}>
									<td></td>
									<td>
										<input className="is-hidden" type="hidden" name={`service_lines[${line.id}].proposal_tender_item_id`} ref={register({})} defaultValue={dt.id} />
										<input className="is-hidden" type="hidden" name={`service_lines[${line.id}].purchasing_requisition_item_id`} ref={register({})} defaultValue={line.purchasing_requisition_item_id} /> 
										<input className="is-hidden" type="hidden" name={`service_lines[${line.id}].purchasing_requisition_service_id`} ref={register({})} defaultValue={line.id} />
										<input className="is-hidden" type="hidden" name={`service_lines[${line.id}].quote`} ref={register({})} defaultValue={quotesValue} />
									</td>
									<td colSpan={2}>
										{!loadingInput.includes(line.uuid) &&
											<textarea rows="2" cols="5" className="form-control" name={`service_lines[${line.id}].short_text`} ref={register({})} defaultValue={valueServices_spec} disabled />
										}
										{loadingInput.includes(line.uuid) && <i className="fas fa-spinner fa-pulse"></i>}
									</td>
									<td>
										{!loadingInput.includes(line.uuid) &&
											<input disabled type="number" min="0" onKeyPress={(e) => restrictNumber(e)} className="form-control" name={`service_lines[${line.id}].qty`} defaultValue={valueServices_qty} ref={register({})} />
										}
										{loadingInput.includes(line.uuid) && <i className="fas fa-spinner fa-pulse"></i>}
									</td>
									<td>{line.uom}</td>
									<td>
										<input type="number" min="0" onKeyPress={(e) => restrictNumber(e)} className="form-control" name={`service_lines[${line.id}].valuation_price`} ref={register({})} defaultValue={paramType === 'update' ? getServiceLines.length > 0 ? parseFloat(getServiceLines[0].valuation_price) : 0 : 0} disabled/>
									</td>
									<td align="right">
										{!loadingInputTotal.includes(line.uuid) && formatNumber(totalPerLineItem, 2)}
										{isServices && loadingInputTotal.includes(line.uuid) && <i className="fas fa-spinner fa-pulse"></i>}
									</td>
									<td>{line.currency}</td>
									<td>
										<input type="text" className="form-control" name={`service_lines[${line.id}].remark`} ref={register({})} defaultValue={paramType === 'update' ? getServiceLines.length > 0 ? getServiceLines[0].remark : '' : line.remark} disabled />
									</td>
									<td>
										<input type="number" min="0" onKeyPress={(e) => restrictNumber(e)} className="form-control is-hidden" name={`service_lines[${line.id}].delivery_time`} ref={register({})} defaultValue={0} disabled />
									</td>
								</tr>
								</React.Fragment>
							)
						})
					}
					
						return (
								<React.Fragment key={i}>
									{
										!isServices && setVal_fields.length > 0 && setVal_fields.map((field, index) => {
											if(paramType === 'update' ? dt.purchasing_requisition_item_id === field.indexId : dt.purchasing_requisition_item_id === field.indexId && dt.uuid === field.id){
												return (
													<tr key={field.id}>
														<td style={{ fontWeight: 'bold', backgroundColor: 'lightgray' }}></td>
														<td style={{ fontWeight: 'bold', backgroundColor: 'lightgray' }}>{dt.material_group_id}</td>
														<td style={{ fontWeight: 'bold', backgroundColor: 'lightgray' }}>{dt.short_text}</td>
														<td style={{ fontWeight: 'bold', paddingLeft: '17px', backgroundColor: 'lightgray' }}>{dt.long_text}</td>
														<td style={{ fontWeight: 'bold', paddingLeft: '17px', backgroundColor: 'lightgray' }}>{dt.qty}</td>
														<td style={{ fontWeight: 'bold', backgroundColor: 'lightgray' }}>{dt.uom}</td>
														<td style={{ fontWeight: 'bold', backgroundColor: 'lightgray' }}>{''}</td>
														<td style={{ fontWeight: 'bold', backgroundColor: 'lightgray' }} align="right">{''}</td>
														<td style={{ fontWeight: 'bold', backgroundColor: 'lightgray' }}>{dt.currency}</td>
														<td style={{ fontWeight: 'bold', backgroundColor: 'lightgray' }}>{''}</td>
														<td style={{ fontWeight: 'bold', backgroundColor: 'lightgray' }}>{''}</td>
													</tr>
												)
											}
											return true
										})
									}
									<tr key={i}>
										<td>
											{loadingQuote === false && quotesValue}
											{/* {loadingQuote === false && <select defaultValue={quotesValue} name={`items[${i}].quote`} onChange={(e) => handleChangeQuote(e, i, quoteItems[i], dt.service_lines, dt)} ref={register({})}>
												{paramType !== 'update' && <option value="" disabled={paramType === 'update'}>Select ..</option>}
												<option value="comply">Comply</option>
												<option value="deviate">Deviate</option>
												<option value="no_quote" disabled={header.order_placement !== 'itemize'}>No Quote</option>
											</select>} */}
											{loadingQuote === true && <i className="fas fa-spinner fa-pulse"></i>}
										</td>
										<td>
											{dt.material_group_id}
											<p>
												<input type="hidden" name={`items[${i}].proposal_tender_item_id`} ref={register({})} defaultValue={dt.id} />
												<input type="hidden" name={`items[${i}].purchasing_requisition_item_id`} ref={register({})} defaultValue={dt.purchasing_requisition_item_id} /> 
											</p>
										</td>
										<td>{dt.short_text}</td>
										<td>
											{!loadingInput.includes(i) &&
												<textarea disabled rows="1" cols="3" className="form-control" name={`items[${i}].spesifikasi`} ref={register({})} defaultValue={valueGoods_spec} style={showGoods_input}  />
											}
											{loadingInput.includes(i) && <i className="fas fa-spinner fa-pulse"></i>}
										</td>
										<td>
											{!loadingInput.includes(i) &&
												<input disabled type="number" min="0" onKeyPress={(e) => restrictNumber(e)} className="form-control" name={`items[${i}].qty`} defaultValue={valueGoods_qty} ref={register({})} style={showGoods_input} />
											}
											{loadingInput.includes(i) && <i className="fas fa-spinner fa-pulse"></i>}
										</td>
										<td>{!isServices && dt.uom}</td>
										<td>											
											{!loadingInput.includes(i) && <input type="number" min="0" onKeyPress={(e) => restrictNumber(e)} className="form-control" name={`items[${i}].valuation_price`} ref={register({})} defaultValue={paramType === 'update' ? getItems.length > 0 ? parseFloat(getItems[i].valuation_price) : 7 : 8} style={showGoods_input} disabled/>}
											{loadingInput.includes(i) && <i className="fas fa-spinner fa-pulse"></i>}
										</td>
										<td align="right">
											{!isServices && !loadingInputTotal.includes(i) && formatNumber(totalPerItem, 2)}
											{!isServices && loadingInputTotal.includes(i) && <i className="fas fa-spinner fa-pulse"></i>}
										</td>
										<td>{!isServices && dt.currency}</td>
										<td>
											<input type="text" className="form-control" name={`items[${i}].remark`} ref={register({})} defaultValue={paramType === 'update' ? getItems.length > 0 ? getItems[i].remark : '' : ''} style={showGoods_input} disabled />
										</td>
										<td>
											<input type="number" min="0" onKeyPress={(e) => restrictNumber(e)} className={(errors[`items.${i}.delivery_time`]) ? "form-control is-invalid" : "form-control"} name={`items[${i}].delivery_time`} ref={register({})} defaultValue={paramType === 'update' ? getItems.length > 0 ? getItems[i].delivery_time : 0 : 0} disabled/>
											{errors[`items.${i}.delivery_time`] && <span className="text-danger"> {errors[`items.${i}.delivery_time`][0]} </span>}
										</td>
									</tr>
									{dt.service_lines && service_lines}
								</React.Fragment>
						)
				})
				rows.push(
					<tr key={items.length + 1}>
							<td colSpan="7">Total Harga</td>
							<td align="right">{formatNumber(Total, 2)}</td>
							<td colSpan="3"></td>
					</tr>
				)
		} else {
			rows = (<RowEmpty colSpan='12'>Tidak ada data</RowEmpty>);
		}

		// console.log(fields);

    return (
			<div>
				<Panel>
					<PanelHeader>Quotation Item</PanelHeader>
					{(loadings.items) && <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>}
					{(!loadings.items) &&
					<PanelBody >
						{errors.items && <p className="text-danger"> * {errors.items[0]} </p>}
						<div className="row">
							<div className="col-md-6">
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">No Penawaran</label>
										<div className="col-sm-10">
												<input disabled type="text" readOnly={false} name={`header.number`} ref={register({})} className={(errors['header.number']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={tempData.number ? tempData.number : ''} />
												{errors['header.number'] && <span className="text-danger"> {errors['header.number'][0]} </span>}
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Tanggal Penawaran</label>
										<div className="col-sm-10">
												<input disabled type="date" readOnly={false} name={`header.date`} ref={register({})} className={(errors['header.date']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={tempData.date ? tempData.date : ''} />
												{errors['header.date'] && <span className="text-danger"> {errors['header.date'][0]} </span>}
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Validity Penawaran</label>
										<div className="col-sm-10">
												<input disabled type="number" min="0" onKeyPress={(e) => restrictNumber(e)}readOnly={false} name={`header.validity`} ref={register({})} className={(errors['header.validity']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={tempData.validity ? tempData.validity : ''} />
												{errors['header.validity'] && <span className="text-danger"> {errors['header.validity'][0]} </span>}
										</div>
								</div>
							</div>
							<div className="col-md-6">
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Incoterm</label>
										<div className="col-sm-10">
												{/* <Controller
													components={animatedComponents}
													closeMenuOnSelect={true}
													as={Select} 
													placeholder={loadings.incoterm ? t("Select.Sedang Memuat") : t("Select.Pilih") }
													isLoading={loadings.incoterm}
													className="basic-multi-select"
													classNamePrefix="select"
													name={`header.incoterm_id`}
													styles={errors.incoterm_id ? customStyles : {}}
													control={control}
													onInputChange={onInputChangeIncoterm}
													options={quotation.m_incoterm} 
													defaultValue={tempData.incoterm_id ? tempData.incoterm_id : ''}
													rules={{ required: false }} 
													isClearable={false} /> */}
												<input disabled type="text" readOnly={false} name={`header.incoterm_id`} ref={register({})} className={(errors['header.incoterm_id']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={tempData.incoterm_id ? tempData.incoterm_id.label : ''} />
												{errors['header.incoterm'] && <span className="text-danger"> {errors['header.incoterm'][0]} </span>}
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Lokasi Pengiriman</label>
										<div className="col-sm-10">
												<input disabled type="text" readOnly={false} name={`header.location`} ref={register({})} className={(errors['header.location']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={tempData.location ? tempData.location : ''} />
												{errors['header.location'] && <span className="text-danger"> {errors['header.location'][0]} </span>}
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Bid Bond</label>
										<div className="col-sm-10">
												<input disabled type="text" readOnly={false} name={`header.bidbond`} ref={register({})} className={(errors['header.bidbond']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={tempData.bidbond ? tempData.bidbond : ''} />
												{errors['header.bidbond'] && <span className="text-danger"> {errors['header.bidbond'][0]} </span>}
										</div>
								</div>
								<div className="form-group row">
									<label className="col-sm-2 col-form-label">Lampiran Bid Bond</label>
									<div className="col-sm-5">
											<input type="text" className={(errors['header.bidbond_file']) ? "form-control is-invalid" : "form-control"} name={`header.bidbond_file`} ref={register({ required: false })} placeholder="" disabled={true} defaultValue={tempData.bidbond_file ? tempData.bidbond_file : '' || filelampiran} />
											{errors['header.bidbond_file'] && <span className="text-danger"> {errors['header.bidbond_file'][0]} </span>}
									</div>
									<div className="col-sm-5">
											{/* <label className="custom-file-upload">
													<input disabled type="file" name="files" ref={register({ required: false })} placeholder="" onChange={changeFile} />
													<i className={loading || loadings.buttonUpload ? "fas fa-spinner fa-pulse" : "fa fa-upload"} disabled={loading || loadings.buttonUpload} />  {t('Label.Unggah')}
											</label> */}
											{tempData.bidbond_file &&
											<button className="custom-file-upload btn btn-primary m-l-10" onClick={e => downloadLampiran(e, process.env.REACT_APP_API_BASE_URL+'files/tendering/' + tempData.bidbond_file )}>
													<i className="fa fa-download"></i> Preview
											</button>}
									</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Validity Bid Bond</label>
										<div className="col-sm-10">
												<input disabled type="date" readOnly={false} name={`header.bidbond_validity`} ref={register({})} className={(errors['header.bidbond_validity']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={tempData.bidbond_validity ? tempData.bidbond_validity : ''} />
												{errors['header.bidbond_validity'] && <span className="text-danger"> {errors['header.bidbond_validity'][0]} </span>}
										</div>
								</div>
							</div>
							<div className="col-sm-12">
									<div className="table-responsive">
											<table className="table table-bordered table-sm text-wrap">
													<thead>
															<tr>
																	<th>Quote Type</th>
																	<th>No Material</th>
																	<th>Short Text</th>
																	<th style={{ minWidth: '250px' }}>Spesifikasi</th>
																	<th style={{ minWidth: '120px' }}>QTY</th>
																	<th>Uom</th>
																	<th style={{ minWidth: '120px' }}>Harga Satuan</th>
																	<th>Total Penawaran</th>
																	<th>Currency</th>
																	<th>Remark</th>
																	<th>Delivery Time</th>
															</tr>
													</thead>
													<tbody>
														{!loadingItems  && rows}
														{(loadingItems) && <RowEmpty colSpan='12'><i className="fas fa-spinner fa-pulse"></i>Loading</RowEmpty>}
													</tbody>
											</table>
									</div>
							</div>
							<div className="col-md-12">
								<label>Catatan</label>
								<textarea name="header.note" ref={register({})} className={(errors['header.note']) ? "form-control is-invalid" : "form-control"} rows="4" cols="50" defaultValue={tempData.note ? tempData.note : ''} />
								{errors['header.note'] && <span className="text-danger"> {errors['header.note'][0]} </span>}
							</div>
						</div>
					</PanelBody>}
				</Panel>
			</div>
    );
}

export default Items;