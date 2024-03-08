import React from 'react';
import { Link } from 'react-router-dom';
import { PageSettings } from '../../config/page-settings';

class NotFound extends React.Component {
	static contextType = PageSettings;
	state = {
		bgLogo: '/app-assets/images/dribbble_1.gif',
		message_title: '',
		message_head: '',
		message_body1: '',
		message_body2: '',
	}

	componentDidMount() {
		this.setMessages()
		this.context.handleSetPageSidebar(false);
		this.context.handleSetPageHeader(false);
		this.context.handleSetPageContentFullWidth(true);
	}

	componentWillUnmount() {
		this.context.handleSetPageSidebar(true);
		this.context.handleSetPageHeader(true);
		this.context.handleSetPageContentFullWidth(false);
	}

	setMessages = () => {
		let uri = this.props.location.pathname.split("/")[2];
		if(uri !== ""){
			switch (uri) {
				case '403':
						this.setState({
							message_title: '403',
							message_head: 'Oops, Looks like you dont have a permission !',
							message_body1: 'You must have a permission to accessing the page.',
							message_body2: 'The request contained valid data and was understood by the server, but the server is refusing action. This may be due to the user not having the necessary permissions for a resource or needing an account of some sort, or attempting a prohibited action (e.g. creating a duplicate record where only one is allowed). This code is also typically used if the request provided authentication by answering the WWW-Authenticate header field challenge, but the server did not accept that authentication. The request should not be repeated.',
						})
						break;
				case '404':
						this.setState({
							message_title: '404',
							message_head: 'We couldnt find it !',
							message_body1: 'The page youre looking for doesnt exist.',
							message_body2: 'The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.',
						})
						break;
				case '408':
						this.setState({
							message_title: '408',
							message_head: 'Request Time Out !',
							message_body1: 'The server timed out waiting for the request',
							message_body2: 'According to HTTP specifications: "The client did not produce a request within the time that the server was prepared to wait. The client MAY repeat the request without modifications at any later time',
						})
						break;
				default:
						break;
			}
		} else {
			
		}
		console.log(uri);
	}
  
	render() {
		const four_zero_four_bg = {
			'backgroundColor': '#fff',
			// 'minHeight': '90vh',
			'backgroundImage': `url(${this.state.bgLogo})`,
			'backgroundRepeat': 'no-repeat',
			// 'backgroundSize': '52%',
			'backgroundPosition': 'center',
		 	'height': '400px',
		}
		return (
			<div className="error">
				{/* <div className="error-code m-b-10">404</div> */}
				<div style={four_zero_four_bg}>
					<h1 className="text-center m-b-20 m-t-20"> {this.state.message_title} </h1>
				</div>
				<div className="error-content">
					<div className="error-message">{this.state.message_head}</div>
					<div className="error-desc m-b-30">
						{this.state.message_body1} <br />
						{this.state.message_body2}
					</div>
					<div>
						<Link to="/home" className="btn btn-success p-l-20 p-r-20">Go Home</Link>
					</div>
				</div>
			</div>
		)
	}
}

export default NotFound;