import React, {Component} from 'react';
import {connect} from 'react-redux'
import {toastr} from 'react-redux-toastr';
import {loginAction, loginResponse, forgotPassword} from '../../../store/actions/authActions';
import LoginForm from './LoginForm/LoginForm';
import ForgotPassword from '../forgot-password/ForgotPassword';

class Login extends Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
	}

	state = {
		activeBg: '/app-assets/images/bg-library',
		bgLogo: '/app-assets/images/procsi.png',
		username: '',
		password: '',
		email: '',
		loginPage: true,
		forgotPasswordPage: false,
		error: false,
		errors: {},
		loading: false
	}

	componentDidMount(){
		this._isMounted = true;
		// this.props.router.push('/login')
		// this.props.history.push('/beranda')
	}

	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }

	handleChange = (e) => {
		e.preventDefault();
		if(this._isMounted){
			if(this.state.errors[e.target.name]) {
					let errors = {...this.state.errors}
					delete errors[e.target.name];
					this.setState({
							[e.target.name] : e.target.value,
							errors
					})
			} else {
					this.setState({ [e.target.name] : e.target.value });
			}
		}
	}

	handleChangeFormField = (data) => {
		if(this._isMounted){
			this.setState({
				username : data.username,
				password : data.password
			})
		}
	}

	handleSubmit = async (e) => {
			e.preventDefault();
			if(this._isMounted){
				this.setState({loading: true});
				const payload = {username: this.state.username, password: this.state.password}
				await this.props.loginAction(payload).then(response => {
						this.setState({loading: false});
						const {authorization} = response.headers;
						console.log(response.headers);
						const access = response.data.status;
						var keyAccess = '';
						if(access === 'success') {
							keyAccess = 'OK';
						} else {
							keyAccess = 'NO';
						}
						const dataDispatch = {type: true, authorization, keyAccess, data: response.data};
						this.props.loginResponse(dataDispatch);
				}).catch(resp => {
						this.setState({
								error: true,
								errors: resp.response.data.errors  
						})
						this.setState({loading: false});
						const dataDispatch = {type: false}
						const message = (typeof resp.response !== 'undefined') ? resp.response.data.message : '';
						
						toastr.error("Login Failed", message);
						this.props.loginResponse(dataDispatch);
				})
			}
	}

	handleForgotPassword = async (e) => {
			e.preventDefault();
			if(this._isMounted){
				let payload = {email : this.state.email}
				console.log(payload)
				this.setState({loading : true})
				this.props.forgotPassword(payload)
            	.then((resp) => {
					toastr.success(resp?.data?.message)
					this.setState({ loading : false, loginPage: true, forgotPasswordPage: false })
				})
				.catch((resp) => {
					console.log(resp)
					this.setState({ loading : false, loginPage: true, forgotPasswordPage: false })
					let message = (typeof resp !== 'undefined') ? resp?.data?.message : 'Something Wrong';
               		toastr.error(message);
				});	
			}
	}

	onDismiss = () => {
		if(this._isMounted){
			this.setState({ errors: {} })
		}
	}

	showForgotPassword = (e) => {
		if(this._isMounted){
			e.preventDefault()
			this.setState({ loginPage: false, forgotPasswordPage: true })
		}
	}

	showLogin = (e) => {
		if(this._isMounted){
			e.preventDefault()
			this.setState({ loginPage: true, forgotPasswordPage: false })
		}
	}
	
	render(){
		const lang = localStorage.getItem("i18nextLng");

		return (
			<div>
				<div className="login-cover">
					<div className="login-cover-image" style={{ backgroundImage: 'url(' + this.state.activeBg + ')', mixBlendMode: 'hard-light' }}></div>
					<div className="login-cover-bg"></div>
				</div>

				<div className="login login-v2">
					<div className="login-header">
						<div className="brand">
							<input type="hidden" id="dateTime" />
							{this.state.loginPage && <small>{ (lang === "en") ? "Login Session" : "Halaman Login" }</small>}
							{this.state.forgotPasswordPage && <small>{ (lang === "en") ? "Forgot Password" : "Lupa Password" }</small>}
						</div>
					</div>
					<div className="login-content">
						{this.state.loginPage && <LoginForm 
							goBack={this.props.goBack}
							showForgotPassword={this.showForgotPassword}
							error={this.state.error}
							errors={this.state.errors}
							handleChange={this.handleChange}
							handleSubmit={this.handleSubmit}
							sendDt={this.state}
							handleChangeFormField={this.handleChangeFormField}
						/>}
						{this.state.forgotPasswordPage && <ForgotPassword 
							goBack={this.props.goBack}
							sendDt={this.state}
							error={this.state.error}
							errors={this.state.errors}
							handleChange={this.handleChange}
							handleSubmit={this.handleForgotPassword}
							showLogin={this.showLogin}
						/>}
					</div>
				</div>
			</div>
		)
	}
}

const dispatchToProps = (dispatch) => {
	return {
		loginAction: (payload) => dispatch(loginAction(payload)),
		loginResponse: (data) => dispatch(loginResponse(data)),
		forgotPassword: (payload) => dispatch(forgotPassword(payload))
	}
}

export default connect(null, dispatchToProps)(Login);