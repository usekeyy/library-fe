import React from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import Header from './Header'
import Items from './Items'
import Evaluasi from './Evaluasi';
import Pemenang from './Pemenang';
import PemenangPaket from './PemenangPaket';
import ItemsRetender from './ItemsRetender';
import Catatan from './Catatan';
import RekapNegoisasi from './RekapNegoisasi';
import RekapNegoisasiPaket from './RekapNegoisasiPaket';

const Form = (props) => {

	const methods = useForm();
	const [status, setStatus] = React.useState('')

	const onSubmit = data => {
        data.status = status
		let payload = []
		payload.status = status
		payload.note = data.note
		if (status === "p") {
			props.saveAwarding();
		}
		else if (status === 'y') {
			props.modalConfirm();
		}
		else if (status === 'r') {
			props.approveAwarding(payload)
		}
		else if (status === "b") {
			console.log(payload)
			// props.modalConfirm(payload)
			props.toggleBatalTender(payload)
		}
		else if (status ==='d' || status === 's') {
			props.setStatusPublish(payload)
		}
	};

	const submitCheck = (e) => {
        // e.preventDefault()		
		setStatus('p')
	}

	const ApprovalCheck = (e) => {
		setStatus('y')
	}

	const RejectCheck = (e) => {
		setStatus('r')
	}

	const BatalTender = (e) => {
		setStatus('b')
	}

	const ReAwarding = (e) => {
		setStatus('d')
	}

	const Publish = (e) => {
		setStatus('s')
	}

	return (
		<FormContext {...methods} >
			<form onSubmit={methods.handleSubmit(onSubmit)}>
                <Header
					data={props.data}
					user={props.user}
					jenis_perikatan={props.jenis_perikatan}
					m_jenis_perikatan={props.m_jenis_perikatan}
					setPerikatan={props.setPerikatan}
					toggleConfirm={props.toggleConfirm}
					// setStatusPublish={props.setStatusPublish}
					modalHistoryApproval={props.modalHistoryApproval}
					downloadBeritaAcara={props.downloadAwardingBeritaAcara}
					BatalTender={BatalTender}
                />
                <Items
                    data ={props.data.items}
                />

                <Evaluasi
                    data ={props.data.hasil_evaluasi}
					metode_evaluasi={props.data.metode_evaluasi}
                />
				{props.data.order_placement === 'paket' ? 
					<RekapNegoisasiPaket
						retender = {props.retender}
						user_uuid={props.user.uuid}
						created_by={props.data.created_by}
						modals={props.modalItemDetail}
						data={props.nego}
						status={props.data.status}
						errors={props.errors}
						handleChecklistRetenderPaket={props.handleChecklistRetenderPaket}
					/> :
					<RekapNegoisasi
						user_uuid={props.user.uuid}
						created_by={props.data.created_by}
						modals={props.modalItemDetail}
						data={props.nego}
						status={props.data.status}
						errors={props.errors}
						order_placement={props.data.order_placement}
						handleChecklistWinnerItem={props.handleChecklistWinnerItem}
						handleChecklistRetender={props.handleChecklistRetender}
					/>
				}
				{props.data.order_placement === 'paket' ? 
					<PemenangPaket
						retender = {props.retender}
						modalPemenangDetail={props.modalPemenangDetail}
						user_uuid={props.user.uuid}
						created_by={props.data.created_by}
						handleChecklistWinnerPaket={props.handleChecklistWinnerPaket}
						status={props.data.status}
						status_retender_paket={props.status_retender_paket}
						data={props.pemenang_terpilih}
						metode_evaluasi={props.data.metode_evaluasi}
					/> :
					<Pemenang
						user_uuid={props.user.uuid}
						created_by={props.data.created_by}
						status={props.data.status}
						setValue={props.setValue}
						modalPemenangDetail={props.modalPemenangDetail}
						// data={props.nego}
						parentState={props.parentState}
						data={props.pemenang_terpilih}
						metode_evaluasi={props.data.metode_evaluasi}
					/>
				}
				{props.data.order_placement === 'itemize' &&
					<ItemsRetender
						onInputChangeRemark={props.onInputChangeRemark}
						status={props.data.status}
						data={props.nego}
					/>
				}
                <Catatan
                    data={props.data.notes}
					onInputChangeCatatan={props.onInputChangeCatatan}
					errors={props.errors}
                />

				<div className="panel bg-white">
					<div className="row">
						<div className="col-sm-12">
							<div className="pull-right m-t-5 m-b-5">
								<div>
									{props.statusDisableOA &&
										<span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
											*Tidak bisa memilih jenis perikatan <b>Outline Agreement</b>, karena pemenang memiliki no PR yg berbeda
										</span>
									}
									{props.statusItemOA &&
										<span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
											*Tidak bisa memilih jenis perikatan <b>Outline Agreement</b>, karena item PR tidak lengkap
										</span>
									}
									{props.statusAccountAssignment &&
										<span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
											*Tidak bisa memilih jenis perikatan <b>Outline Agreement</b>, karena Account Assignment dari PR item tidak sesuai kondisi
										</span>
									}
									{props.status_perikatan &&
										<span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
											*Mohon pilih jenis perikatan terlebih dahulu (pada bagaian header)
										</span>
									}
									{props.status_catatan &&
										<span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
											*Mohon isi catatan terlebih dahulu
										</span>
									}
                                    {/* {props.user.uuid === props.data.created_by &&
										<button
											type="submit"
											className="btn btn-danger m-r-5"
											onClick={(e) => BatalTender(e)}
											disabled={props.loadingSubmit}
										>
										{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Batalkan PO</button>
                                    } */}
									{props.user.uuid === props.data.approver_user &&
										props.data.status === 'p' && props.data.rekap_negosiasi.some(d => d.is_retender === 'y') === false && 
										<button
											type="submit"
											className="btn btn-success m-r-5"
											onClick={(e) => ApprovalCheck(e)}
											disabled={props.loadingSubmit}
										>
										{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Approve</button>
									}
									{props.user.uuid === props.data.approver_user &&
										props.data.status === 'p' && props.data.rekap_negosiasi.some(d => d.is_retender === 'y') === false && 
										<button
											type="submit"
											className="btn btn-danger m-r-5"
											onClick={(e) => RejectCheck(e)}
											disabled={props.loadingSubmit}
										>
										{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Reject</button>
									}
									{props.user.uuid === props.data.created_by && (props.data.status === 'd' || props.data.status === 'r') && 
										<button
											type="submit"
											className="btn btn-success m-r-5"
											onClick={(e) => submitCheck(e)}
											disabled={props.loadingSubmit}
										>
										{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Submit</button>
									}
									{props.user.uuid === props.data.created_by && props.data.status === 'y' && 
										<button
											// type="submit"
											className="btn btn-warning m-r-5"
											onClick={(e) => ReAwarding(e)}
											disabled={props.loadingSubmit}
										>
										{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Re-Awarding</button>
									}
									{props.user.uuid === props.data.created_by && props.data.status === 'y' && 
										<button
											// type="submit"
											className="btn btn-success m-r-5"
											onClick={(e) => Publish(e)}
											disabled={props.loadingSubmit}
										>
										{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Publish</button>
									}
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
    )
}

export default withTranslation()(Form);