import React, {Component, Suspense} from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import routes from '../../../../config/routes';
import { PageSettings } from '../../../../config/page-settings';
import Loading from '../../../../components/loading/Loading';
// const NotFound = React.lazy(() => import('../../../../components/error/NotFound'));


class Content extends Component {
	static contextType = PageSettings;
	loading = () => <Loading />

	componentDidMount() {
		this.context.handleSetPageSidebarSearch(true);
	}

	componentWillUnmount() {
		this.context.handleSetPageSidebarSearch(false);
	}
	
	render() {
		return (
			<PageSettings.Consumer>
				{({pageContentFullWidth, pageContentClass, pageContentInverseMode}) => (
					<Suspense fallback={this.loading()}>
						<Switch>
							<React.Fragment>
							{!this.props.loading_alert && this.props.isVendor && this.props.expired_day !== false && 
							<div className="alert alert-danger content" role="alert" style={{padding:"10px", fontWeight:"bold", marginBottom:"-10px"}}>
								* Batas Submit Pendaftaran Vendor {this.props.expired_day} Hari 
							</div>}
							{!this.props.loading_alert && this.props.isVendor && this.props.has_draft_verification && this.props.has_draft_verification !== false && 
							<div className="alert alert-danger content" role="alert" style={{padding:"10px", fontWeight:"bold"}}>
								* Menunggu Proses Verifikasi Oleh Verifikator
							</div>}
							{this.props.isBuyer && this.props.buyerHasNote > 0 && 
							<div className="alert alert-danger content" role="alert" style={{padding:"10px", fontWeight:"bold"}}>
								* Terdapat {this.props.buyerHasNote} Tender Yang Mendekati Closing Date
							</div>}
							{!this.props.loading_alert && this.props.isVendor  && this.props.has_draft_verification === false && this.props.status_migrasi === '1' && 
							<div className="alert alert-danger content" role="alert" style={{padding:"10px", fontWeight:"bold", fontSize:"14px"}}>
								* Silahkan melakukan update profile dengan mengupload ulang file atau dokumen dengan mengklik tombol browse <label className="btn btn-white btn-xs"> <i className="fa fa-upload"/></label> pada setiap data profil
								<br></br>
								* Pada multiple data klik tombol edit <button className="btn btn-warning btn-xs"><span className="fa fa-edit"></span></button> lalu klik tombol browse <label className="btn btn-white btn-xs"> <i className="fa fa-upload"/></label> untuk melengkapi dokumen atau file
							</div>}
							{/* {this.props.isVendor && this.props.expired_day !== false && <h5 className="text-danger content" style={{padding:"5px", paddingTop:"10px", paddingBottom:"0px"}}>* Batas Submit Pendaftaran Vendor {this.props.expired_day} Hari </h5>} */}
							{/* {this.props.isVendor && this.props.has_draft_verification && <h5 className="text-danger content" style={{padding:"5px", paddingTop:"10px"}}>* Menunggu Proses Verifikasi Oleh Verifikator </h5>} */}
								<div className={'content ' + (pageContentFullWidth ? 'content-full-width ' : '') + (pageContentInverseMode ? 'content-inverse-mode ' : '') + pageContentClass}>
									{routes.map((route, index) => (
										<Route
											key={index}
											path={route.path}
											exact={route.exact}
											component={route.component}
										/>
									))}
									{this.props.isVendor ? 
									<Route exact path="/"> <Redirect to="/" /> </Route>
									:<Route exact path="/"> <Redirect to="/task" /> </Route>}
									{/* <Route component={NotFound}/> */}
								</div>
							</React.Fragment>
						</Switch>
					</Suspense>
				)
			}
			</PageSettings.Consumer>
		)
	}
}

export default withRouter(Content);
