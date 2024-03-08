import React from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';

import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
import CreateInvoice from './CreateInvoice';
import Items from './Items'
import AdditionalCost from './AdditionalCost'
import Penalty from './Penalty';
import PenaltyAddCost from './PenaltyAddCost';
import DPP from './DPP';
import LampiranInternal from './LampiranInternal';
import LampiranVendor from './LampiranVendor';
import Catatan from './Catatan';
import DataSAP from './DataSAP';

const Form = (props) => {

	const methods = useForm();

	const onSubmit = data => {
	};

    const toggleOpenPreview = (e, file, url) => {
        props.toggleOpenPreview(e, file, url)
    }

	return (
		<FormContext {...methods} >
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				{props.data.note_list.length > 0 && (props.data.status === 'rejected_1' || props.data.status === 'rejected_2') && props.user.has_roles.includes("VNDR01") &&
					<div>
						<Panel className="margin-bot-false">
							<PanelHeader>Catatan Reject</PanelHeader>
							<PanelBody>
								<Row>
									<Col sm="12">
										<div className="form-group">
											<label className="col-form-label">Catatan Reject</label>
											<div className="col-lg-12">
												<textarea className="form-control" defaultValue={props.data.note} readOnly={true}/>
											</div>
										</div>
									</Col>
								</Row>
							</PanelBody>
						</Panel>
					</div>
				}
				{props.data.items.some(d=>d.goods_receipt_item_status === 'n') &&
					<h5>
						<span className="text-danger">GR telah dibatalkan di level invoice</span>
					</h5>
				}
				
				<CreateInvoice 
					toggleOpenPreview={toggleOpenPreview}
					loadings={props.loadings}
					loadingSubmit={props.loadingSubmit}
					errors={props.errors}
					data={props.data}
					user={props.user}
					param_option={props.param_option}
					setWithPPN={props.setWithPPN}
					fetchBank={props.fetchBank}
					scanFakturPajak={props.scanFakturPajak}
					upload={props.fileUpload}
					isVerifikasi={props.isVerifikasi}
					setOptionParamSAP={props.setOptionParamSAP}
				/>
				<LampiranVendor
					toggleOpenPreview={toggleOpenPreview}
					errors={props.errors}
					loadings={props.loadings}
					user={props.user}
					data={props.data}
					data_lampiran_vendor={props.data_lampiran_vendor}
					param={props.param_lampiran_vendor}
					statusLampiranVendor={props.statusLampiranVendor}
					save={props.addLampiranVendor}
					delete={props.deleteLampiranVendor}
					setOption={props.setOptionLampiranVendor}
					upload={props.fileUpload}
					toggleDelete={props.toggleDelete}
				/>
				<Items 
					loadings={props.loadings}
					data={props.data}
					param_option={props.param_option}
					setOptionItem={props.setOptionItem}
					fetchTax={props.fetchTax}
					user={props.user}
				/>
				<AdditionalCost
					loadings={props.loadings}
					data={props.data}
					param_option={props.param_option}
					setOptionAddCost={props.setOptionAddCost}
					fetchTax={props.fetchTax}
					user={props.user}
				/>
				{((props.user.has_roles.includes("INVER2") || props.user.has_roles.includes("BNDHRA")) &&
					(props.data.status === 'received' || props.data.status === 'approved_2' || props.data.status === 'posted' || props.data.status === 'sent_bendahara'
					|| props.data.status === 'received_bendahara' || props.data.status === 'rejected_hc_bendahara' || props.data.status === 'paid')) &&
						<DataSAP
							user={props.user}
							data={props.data}
						/> 
				}
				<Penalty 
					toggleOpenPreview={toggleOpenPreview}
					data={props.data}
					user={props.user}
					loadings={props.loadings}
					toggleDelete={props.toggleDelete}
				/>
				<PenaltyAddCost
					toggleOpenPreview={toggleOpenPreview}
					data={props.data}
					user={props.user}
					loadings={props.loadings}
					toggleDelete={props.toggleDelete}
				/>
				<DPP 
					data={props.data}
					setOption={props.setOption}
					status_edit_ppn={props.status_edit_ppn}
					user={props.user}
					loadings={props.loadings}
				/>
				{(props.user.has_roles.includes("INVER1") || props.user.has_roles.includes("INVER2") || props.user.has_roles.includes("BNDHRA")) &&
					<LampiranInternal
						toggleOpenPreview={toggleOpenPreview}
						errors={props.errors}
						loadings={props.loadings}
						user={props.user}
						data={props.data}
						data_lampiran_internal={props.data_lampiran_internal}
						param={props.param_lampiran_internal}
						statusLampiranInternal={props.statusLampiranInternal}
						save={props.addLampiranInternal}
						delete={props.deleteLampiranInternal}
						setOption={props.setOptionLampiranInternal}
						upload={props.fileUpload}
						toggleDelete={props.toggleDelete}
					/>
				}
				<Catatan
					data={props.data}
					user={props.user}
				/>
				<div className="panel bg-white">
					<div className="row m-0">
						<div className="col-sm-12">
							<div className="pull-right m-t-5 m-b-5">
									<div>
										<button
											type="button"
											onClick={(e) => window.history.back()}
											disabled={props.loadingSubmit}
											className="btn btn-white m-r-5">
											Kembali
											</button>										
									</div>
							</div>
						</div>
					</div>
				</div>
			</form>
		</FormContext>
	);
}

export default withTranslation()(Form);