import React from 'react';
import {Input} from 'reactstrap';
import { useTranslation } from 'react-i18next';

const ForgotPassword = props => {
  const { t } = useTranslation('common');
  return (
      <form className="margin-bottom-0" onSubmit={ (e) => props.handleSubmit(e) }>
        <div className="form-group m-b-20">
				<div className="input-group input-group-lg m-b-10">
					<div className="input-group-prepend">
						<span className="input-group-text">
							<span className="fas fa-envelope"></span>
						</span>
					</div>
          <Input type="email" className={(props.errors.email) ? "form-control-lg is-invalid" : "form-control-lg"} placeholder="Email" name="email" onChange={(e) => props.handleChange(e)} disabled={props.sendDt.loading} required={true} />
          {props.errors.email && <span className="text-danger">* {props.errors.email} </span>}
					</div>
        </div>
        <div className="login-buttons">
          <button type="submit" className="btn btn-success btn-block btn-lg" disabled={props.sendDt.loading}>
            {props.sendDt.loading ? (
              <i className="fas fa-spinner fa-pulse"></i>
            ) : (
              <i> {t("common:Button.Kirim")} </i>
            )}
          </button>
          <div className="m-t-20">
            {t("common:Button.Kembali Ke Informasi")} <a href="/" onClick={(e) => props.goBack(e)}>{t("common:Button.Disini")}</a>.
            <div className="pull-right">
              {t("common:Button.Kembali Ke Login")} <a href="/" onClick={(e) => props.showLogin(e)}>{t("common:Button.Klik")}</a>.
            </div>
          </div>
        </div>
      </form>
  );
}

export default ForgotPassword;