import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
import ReactLoading from 'react-loading';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
const animatedComponents = makeAnimated();

const Detail = (props) => {
    // const { t } = props;
		const { register, watch, control, setValue, getValues } = useFormContext();
		const watchBidBond = watch("bid_bond");
		const {header} = props.parentState.proposal_tender;
		const {errors} = props.parentState.proposal_tender;
		const {uuid} = props.parentState;
		const {proposal_tender} = props.parentState;
		const {loading} = props.parentState.proposal_tender;
		const {loadings} = props.parentState;
		const [showPraQualificationn, setShowPraQualification] = React.useState(false)
		const [orderPlacement , setOrderPlacement] = React.useState(getValues('order_placement'));	

		const {t} = props.parentProps;
		const customStyles = { control: (base, state) => ({ ...base, borderColor: state.isFocused ? '#ddd' : 'red' })}

		const onInputChangeIncoterm = (option, { action }) => {
			if (action === "input-change") {
				props.fetchIncoterms(option)
			}
		};

		const onInputChangeMetodePengadaan = (option, { action }) => {
			if (action === "input-change"){
				props.fetchMetodePengadaan(option)
			}
		}
		const onInputChangeMetodeAanwijzing = (option, { action }) => {
			if (action === "input-change"){
				props.fetchMetodeAanwijzing(option)
			}
		}
		const onInputChangeMetodePenyampaian = (option, { action }) => {
			if (action === "input-change"){
				props.fetchMetodePenyampaian(option)
			}
		}

		const handleChangeMetodePenyampaian = (e) => {
			let params = {
				metode_penyampaian_id: e.value,
			};
			props.fetchJadwalTender(params, e)
		}

		const handleChangeMetodeAanwijzing = (e) => {
			if(e !== null && e !== undefined){
				props.setMetodeAanwijzing(e)
				setValue('metode_penyampaian_id', null)
			}
		}

		const handleChangeMetodePengadaan = (e) => {
			if(e !== null && e !== undefined){
				(e.pra_qualification === 'y') ? setShowPraQualification(true) : setShowPraQualification(false)
			}
		}

		const handleChangeMetodeEvaluasi = (e) => {
			props.setMetodeEvaluasi(e)
		}
		
		const handleChangeOrderPlacement = (e) => {
			setOrderPlacement(e.value)
		}

		const handleBidBond = () => {
			if(!watchBidBond) {
				setValue('bid_bond_value', '')
			}
		}
		
    return (
			<div>
				<Panel>
					<PanelHeader>Detail</PanelHeader>
					{loading && <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>}
					{!loading &&
					<PanelBody>
						<Row>
							<Col sm="12">
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Metode	Pengadaan <span className="text-danger">*</span></label>
										<div className="col-sm-10">
												<Controller
													components={animatedComponents}
													closeMenuOnSelect={true}
													as={Select} 
													placeholder={loadings.metode_pengadaan ? t("Select.Sedang Memuat") : t("Select.Pilih") }
													isLoading={loadings.metode_pengadaan}
													className="basic-multi-select"
													classNamePrefix="select"
													name="metode_pengadaan_id"
													onInputChange={onInputChangeMetodePengadaan}
													onChange={([selected]) => {
														handleChangeMetodePengadaan(selected)
														return selected;
													}}
													styles={errors['header.metode_pengadaan_id'] ? customStyles : {}}
													control={control}
													options={proposal_tender.m_metode_pengadaan} 
													defaultValue={header.metode_pengadaan_id}
													rules={{ required: false }} 
													isClearable={false} />
												{errors['header.metode_pengadaan_id'] && <span className="text-danger"> {errors['header.metode_pengadaan_id'][0]} </span>}
										</div>
								</div>
								{showPraQualificationn && <div className="form-group row">
										<label className="col-sm-2 col-form-label">Pra Qualification </label>
										<div className="form-group row col-md-10">
												<div className="checkbox checkbox-css">
													<input type="checkbox" id="pra_qualification" name="pra_qualification" defaultChecked={false} ref={register({required: false})} />
													<label htmlFor="pra_qualification"> &nbsp; </label>
												</div>
										</div>
								</div>}
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Metode Aanwijzing <span className="text-danger">*</span></label>
										<div className="col-sm-10">
												<Controller
													components={animatedComponents}
													closeMenuOnSelect={true}
													as={Select} 
													placeholder={loadings.metode_aanwijzing ? t("Select.Sedang Memuat") : t("Select.Pilih") }
													isLoading={loadings.metode_aanwijzing}
													className="basic-multi-select"
													classNamePrefix="select"
													name="metode_aanwijzing_id"
													onInputChange={onInputChangeMetodeAanwijzing}
													onChange={([selected]) => {
														handleChangeMetodeAanwijzing(selected)
														return selected;
													}}
													styles={errors['header.metode_aanwijzing_id'] ? customStyles : {}}
													control={control}
													options={proposal_tender.m_metode_aanwijzing} 
													defaultValue={header.metode_aanwijzing_id}
													rules={{ required: false }} 
													isClearable={false} />
												{errors['header.metode_aanwijzing_id'] && <span className="text-danger"> {errors['header.metode_aanwijzing_id'][0]} </span>}
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Metode Penyampaian <span className="text-danger">*</span></label>
										<div className="col-sm-10">
												<Controller
													components={animatedComponents}
													closeMenuOnSelect={true}
													as={Select} 
													placeholder={loadings.metode_penyampaian ? t("Select.Sedang Memuat") : t("Select.Pilih") }
													isLoading={loadings.metode_penyampaian}
													className="basic-multi-select"
													classNamePrefix="select"
													name="metode_penyampaian_id"
													styles={errors['header.metode_penyampaian_id'] ? customStyles : {}}
													control={control}
													onInputChange={onInputChangeMetodePenyampaian}
													onChange={([selected]) => {
														handleChangeMetodePenyampaian(selected)
														return selected;
													}}
													options={proposal_tender.m_metode_penyampaian} 
													defaultValue={header.metode_penyampaian_id}
													rules={{ required: false }} 
													isClearable={false} />
												{errors['header.metode_penyampaian_id'] && <span className="text-danger"> {errors['header.metode_penyampaian_id'][0]} </span>}
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Metode Evaluasi <span className="text-danger">*</span></label>
										<div className="col-sm-10">
												<Controller
													components={animatedComponents}
													closeMenuOnSelect={true}
													as={Select} 
													placeholder={loadings.metode_evaluasi ? t("Select.Sedang Memuat") : t("Select.Pilih") }
													isLoading={loadings.metode_evaluasi}
													className="basic-multi-select"
													classNamePrefix="select"
													name="metode_evaluasi"
													styles={errors.metode_evaluasi ? customStyles : {}}
													control={control}
													onChange={([selected]) => {
														handleChangeMetodeEvaluasi(selected)
														return selected;
													}}
													options={proposal_tender.m_metode_evaluasi} 
													defaultValue={header.metode_evaluasi}
													rules={{ required: false }} 
													isClearable={false} />
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Metode Negosiasi <span className="text-danger">*</span></label>
										<div className="col-sm-10">
												<Controller
													components={animatedComponents}
													closeMenuOnSelect={true}
													as={Select} 
													placeholder={loadings.metode_negosiasi ? t("Select.Sedang Memuat") : t("Select.Pilih") }
													isLoading={loadings.metode_negosiasi}
													className="basic-multi-select"
													classNamePrefix="select"
													name="metode_negosiasi"
													styles={errors.metode_negosiasi ? customStyles : {}}
													control={control}
													options={proposal_tender.m_metode_negosiasi} 
													defaultValue={header.metode_negosiasi}
													rules={{ required: false }} 
													isClearable={false} />
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Order Placement <span className="text-danger">*</span></label>
										<div className="col-sm-10">
												<Controller
													components={animatedComponents}
													closeMenuOnSelect={true}
													as={Select} 
													placeholder={loadings.order_placement ? t("Select.Sedang Memuat") : t("Select.Pilih") }
													isLoading={loadings.order_placement}
													className="basic-multi-select"
													classNamePrefix="select"
													name="order_placement"
													styles={errors.order_placement ? customStyles : {}}
													control={control}
													options={proposal_tender.m_order_placement} 
													defaultValue={header.order_placement}
													onChange={([selected]) => {
														handleChangeOrderPlacement(selected)
														return selected;
													}}
													rules={{ required: false }} 
													isClearable={false} />
										</div>
								</div>
								{orderPlacement==="itemize" && 
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Multi Winner </label>
										<div className="form-group row col-md-10">
												<div className="checkbox checkbox-css">
													<input type="checkbox" id="multiwinner" name="multiwinner" defaultChecked={false} ref={register({required: false})} disabled={orderPlacement==="paket" ? true : false} />
													<label htmlFor="multiwinner"> &nbsp; </label>
												</div>
										</div>
								</div>
								}
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Bid Bond </label>
										<div className="row">
												<div className="form-group row col-md-4">
														<div className="col-sm-12">
															<div className="checkbox checkbox-css">
																<input type="checkbox" id="bid_bond" name="bid_bond" defaultChecked={false} ref={register({required: false})} onChange={handleBidBond()} />
																<label htmlFor="bid_bond"> {watchBidBond ? 'Active' : 'Inactive'} </label>
															</div>
														</div>
												</div>
												<div className="form-group row col-md-8">
														<div className="col-sm-12">
																<input type="number" step=".01" min="0.1" className="form-control" ref={register({ required: false })} name="bid_bond_value" placeholder="%" defaultValue={(uuid !== "") ? header.bid_bond_value : ''} disabled={!watchBidBond} />
																<span className="text-right"> (Minimal 0.1%) {watchBidBond && <span className="text-danger">*</span>}</span>
																{errors['header.bid_bond_value'] && <span className="text-danger"> {errors['header.bid_bond_value'][0]} </span>}
														</div>
												</div>
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Incoterm <span className="text-danger">*</span></label>
										<div className="col-sm-10">
												<Controller
													components={animatedComponents}
													closeMenuOnSelect={true}
													as={Select} 
													placeholder={loadings.incoterm ? t("Select.Sedang Memuat") : t("Select.Pilih") }
													isLoading={loadings.incoterm}
													className="basic-multi-select"
													classNamePrefix="select"
													name="incoterm_id"
													styles={errors.incoterm_id ? customStyles : {}}
													control={control}
													onInputChange={onInputChangeIncoterm}
													options={proposal_tender.m_incoterm} 
													defaultValue={header.incoterm_id}
													rules={{ required: false }} 
													isClearable={false} />
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Lokasi Pengiriman <span className="text-danger">*</span></label>
										<div className="col-sm-10">
												<input type="text" readOnly={false} name="delivery_location" ref={register({})} className={(errors['header.delivery_location']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={(uuid !== "") ? header.delivery_location : ''} />
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Visibilitas Bid Opening <span className="text-danger">*</span></label>
										<div className="col-sm-10">
												<Controller
													components={animatedComponents}
													closeMenuOnSelect={true}
													as={Select} 
													placeholder={loadings.visibilitas_bid_open ? t("Select.Sedang Memuat") : t("Select.Pilih") }
													isLoading={loadings.visibilitas_bid_open}
													className="basic-multi-select"
													classNamePrefix="select"
													name="visibilitas_bid_open"
													styles={errors.visibilitas_bid_open ? customStyles : {}}
													control={control}
													options={proposal_tender.m_visibilitas_bid_open} 
													defaultValue={header.visibilitas_bid_open}
													rules={{ required: false }} 
													isClearable={false} />
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Masa Berlaku Penawaran <span className="text-danger">*</span></label>
										<div className="col-sm-8">
												<input type="number" readOnly={false} name="masa_berlaku" ref={register({})} className={(errors['header.masa_berlaku']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={(uuid !== "") ? header.masa_berlaku : ''} />
										</div>
										<div className="col-sm-2">
											<span> Hari</span>
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Delivery Time <span className="text-danger">*</span></label>
										<div className="col-sm-8">
												<input type="number" readOnly={false} name="delivery_time" ref={register({})} className={(errors['header.delivery_time']) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={(uuid !== "") ? header.delivery_time : ''} />
										</div>
										<div className="col-sm-2">
											<span> Hari</span>
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Lingkup Pekerjaan </label>
										<div className="col-sm-10">
												<textarea rows="3" cols="3" name={`lingkup_pekerjaan`} className={"form-control"} ref={register} defaultValue={(uuid !== "") ? header.lingkup_pekerjaan : ''} disabled={false} />
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Note Internal </label>
										<div className="col-sm-10">
											<textarea rows="3" cols="3" name={`note_internal`} className={"form-control"} ref={register} defaultValue={(uuid !== "") ? header.note_internal : ''} disabled={false} />
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Note External </label>
										<div className="col-sm-10">
											<textarea rows="3" cols="3" name={`note_external`} className={"form-control"} ref={register} defaultValue={(uuid !== "") ? header.note_external : ''} disabled={false} />
										</div>
								</div>
							</Col>
						</Row>
					</PanelBody>
					}
				</Panel>
			</div>
    );
}

export default withTranslation()(Detail);