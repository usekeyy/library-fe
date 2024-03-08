import React from 'react';
import {Input} from 'reactstrap';
import { useTranslation } from 'react-i18next';


const LoginForm = props => {
  const { t } = useTranslation('common');
  const [showPassword, setshowPassword] = React.useState(false);

  const user = [
    {
      nama : "Buyer",
      username : "10013",
      password : "procsijaya"
    },
    {
      nama : "Manager",
      username : "10011",
      password : "procsijaya"
    },
    {
      nama : "Planner",
      username : "10012",
      password : "procsijaya"
    },
    {
      nama : "Verifikator",
      username : "vr1000",
      password : "procsijaya"
    },
    {
      nama : "Requestor",
      username : "rq1000",
      password : "procsijaya"
    },
    {
      nama : "Vendor",
      username : "00000001",
      password : "procsijaya"
    }
  ]

  const handleSetValueForm = (data) => {
    props.handleChangeFormField(data)
  }

  const handleShowPassword = () => {
    setshowPassword(!showPassword)
  }


  return (
      <form className="margin-bottom-0" onSubmit={ (e) => props.handleSubmit(e) }>
        <div className="form-group m-b-20">
          <Input type="text" className={(props.errors.username) ? "form-control-lg is-invalid" : "form-control-lg"} placeholder="username" name="username" disabled={props.sendDt.loading} onChange={(e) => props.handleChange(e)} value={props.sendDt.username}/>
          {props.errors.username && <span className="text-danger">* {props.errors.username} </span>}
        </div>
        <div className="form-group m-b-20">
          <div className="input-group m-b-10">
            <Input type={showPassword === true ? "text" : "password"} id="password" className={(props.errors.password) ? "form-control-lg is-invalid" : "form-control-lg"} placeholder="password" name="password" disabled={props.sendDt.loading} autoComplete="on" onChange={(e) => props.handleChange(e)} value={props.sendDt.password}/>
            <div className="input-group-append set-pointer" onClick={handleShowPassword}>
              <span className="input-group-text"> <i className={showPassword === true ? "fa fa-eye text-green-lighter" : "fa fa-eye" }></i></span>
            </div>
          </div>
          {props.errors.password && <span className="text-danger">* {props.errors.password} </span>}
        </div>
        <div className="login-buttons">
          <button type="submit" className="btn btn-info btn-block btn-lg" disabled={props.sendDt.loading}>
            {props.sendDt.loading ? (
              <i className="fas fa-spinner fa-pulse"></i>
            ) : (
              <i> {t("common:Button.Login")} </i>
            )}
          </button>
          <div className="m-t-20">
            {t("common:Button.Kembali Ke Informasi")} <a href="/" onClick={(e) => props.goBack(e)}>{t("common:Button.Disini")}</a>.
          </div>
        </div>
      </form>
  );
}

export default LoginForm;