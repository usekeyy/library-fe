import React from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';

import Header from './Header';
import Item from './Item';
import Detail from './Detail';
import Scope from './Scope';
import Note from './Note';
import Schedule from './Schedule';
// import Term from './Term';
import Process from './Process';
import KemampuanPasok from './KemampuanPasok';
import HasilBidOpening from './HasilBidOpening';
import HasilEvaluasi from './hasil_evaluasi/HasilEvaluasi';
import Awarding from './Awarding';
import BeritaAcara from './BeritaAcara';
import RekapNegosiasi from './RekapNegosiasi'
import DokumenPengadaan from './DokumenPengadaan';

const Form = (props) => {
	const methods = useForm();
	// const { t } = props;
	// const [status, setStatus] = React.useState('')
	// const { header } = props.parentState.vendor_registration_tender;

	const onSubmit = data => {
		setData(data)
		props.saveVendorRegistrationTender(data);
	};
	
	const setData = (data) => {
		delete data.bid_bond_date;
		delete data.created_at;
		delete data.lingkup_pekerjaan;
		delete data.number;
		delete data.files;
		delete data.purchasing_org_id;
		delete data.title;
		// console.log(status);
	}

	const show = false
	
	return (
		<FormContext {...methods} >
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				<Header parentProps={props.parentProps} parentState={props.parentState} downloadRFQ={props.downloadRFQ}/>
				<Item t={props.parentProps.t} parentState={props.parentState} />
				<DokumenPengadaan t={props.parentProps.t} parentState={props.parentState} />
				<Detail  parentProps={props.parentProps} parentState={props.parentState}/>
				<Scope parentProps={props.parentProps} parentState={props.parentState} />
				<Note parentProps={props.parentProps} parentState={props.parentState} />
				<Schedule parentProps={props.parentProps} parentState={props.parentState} modalHistoryJadwal = {props.modalHistoryJadwal}/>
				{/* <Term parentProps={props.parentProps} parentState={props.parentState} /> */}
				<KemampuanPasok t={props.parentProps.t} parentState={props.parentState} />
				<BeritaAcara 
					t={props.parentProps.t} 
					parentState={props.parentState}
					downloadAwarding = {props.downloadAwardingBeritaAcara}
					downloadBidOpening= {props.downloadBidOpening}
					downloadNego={props.downloadNegoBeritaAcara}
					downloadAanwijzing={(e, payload) => props.downloadAanwijzing(e, payload)}
					downloadPaktaIntegritas={props.downloadPaktaIntegritas}
				/>
				{/* {console.log(props.parentState.vendor_registration_tender.header.status_bid_opening)} */}
				{(props.parentState.vendor_registration_tender.header.status_bid_opening.length > 0) && 
				 props.parentState.vendor_registration_tender.header.status_bid_opening[0]?.registration_quotation === "submitted" && 
				<div>
				<HasilBidOpening t={props.parentProps.t} parentState={props.parentState} />
				<HasilEvaluasi t={props.parentProps.t} parentState={props.parentState} />
				{props.parentState.vendor_registration_tender.uuid_negosiasi &&
				<RekapNegosiasi t={props.parentProps.t} parentState={props.parentState} />}
				{props.parentState.vendor_registration_tender.awarding.length > 0 && props.parentState.vendor_registration_tender.header.awarding_status === 's' &&
					<Awarding 
						t={props.parentProps.t} 
						parentState={props.parentState} 
						downloadAwardingBeritaAcara={props.downloadAwardingBeritaAcara}/>
				}
				
				</div>
				}
				
				{show && <Process parentProps={props.parentProps} parentState={props.parentState} upload={props.upload} />}
				<div className="panel bg-white">
						<div className="row">
								<div className="col-sm-12">
										<div className="pull-right m-t-5 m-b-5">
												<div>
														{show && <button
																type="submit"
																// onClick={() => setStatus('o')}
																className="btn btn-success m-r-5"
																disabled={props.parentState.loadings.button}>{props.parentState.loadings.button ?
																<i className="fa fa-spinner fa-spin"></i>
																: ''} Submit
														</button>}
														<button
																type="button"
																onClick={(e) => window.history.back()}
																className="btn btn-white m-r-5"
																disabled={props.parentState.loadings.button}>
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