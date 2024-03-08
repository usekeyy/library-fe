import React from 'react';
import { useForm } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { toastr } from 'react-redux-toastr';

const ModalConfirm = (props) => {
	const { t } = props;
	const { register, handleSubmit, setValue } = useForm({});
	const [loading, setLoading] = React.useState(false)
	const [filelampiran, setFilelampiran] = React.useState()
	const [validFileLampiran, setValidFileLampiran] = React.useState(false)

	const onSubmit = async data => {
		delete data.files
		if(data.suap_file === ''){
			setValidFileLampiran(true)
		} else {
			props.save(data.suap_file);
		}
	};

	const changeFile = (e) => {
		e.preventDefault()
		if (e.target.files[0] !== undefined) {
			setLoading(true);
			props.upload('VMSUAP', e.target.files[0])
			.then((resp) => {
					setLoading(false);
					setValue("file", resp.data.data.name)
					setFilelampiran(resp.data.data.name);
			})
			.catch((err) => {
					setLoading(false);
					setFilelampiran('');
					setValue("file", '')
					toastr.error(err.data.message, err.data.errors.file[0])
			})
		} else {
				setValue('file', '')
		}
	}

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					<p>
						Apakah data profil sudah yakin untuk di-<i>approve</i> ?
						Jika data applicant sudah benar silahkan  upload bukti lampiran tidak terlibat kasus suap.
					</p>
					<div className="form-group row">
						<label className="col-sm-4 col-form-label">Bukti Lampiran Tidak Terlibat Kasus Suap<span className="text-danger">*</span></label>
						<div className="col-sm-5">
								<input type="text" className={validFileLampiran ? "form-control is-invalid" : "form-control"} name="suap_file" ref={register({ required: false })} placeholder="" disabled={true} defaultValue={filelampiran} />
								{validFileLampiran && <span className="text-danger"> {"File is required"} </span>}
						</div>
						<div className="col-sm-3">
								<label className="custom-file-upload">
										<input type="file" name="files" ref={register({ required: false })} placeholder="" onChange={changeFile} />
										<i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} disabled={loading} />  {t('Label.Unggah')}
								</label>
						</div>
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" type="button" onClick={() => props.toggleClose()}>{t("currency:button.close")}</button>
					<button className="btn btn-success" type="submit" disabled={loading}>{loading ? <i className="fa fa-spinner fa-spin"></i> : ''} {`Submit`}</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation()(ModalConfirm);