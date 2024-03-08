import React, { Component } from 'react'
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { toastr } from 'react-redux-toastr';
import 'react-table/react-table.css';
import { Button, Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';

import {fetchApprovalExtendCompany, showApprovalExtendCompany, updateApprovalExtendCompany} from '../../../store/actions/vendor/approvalExtendCompanyActions';
import {fetchCompanies} from '../../../store/actions/master/companyActions';
import {fetchVerificationList} from '../../../store/actions/vendor/verifikasiDataActions';
import { fetchProfileVendor } from '../../../store/actions/vendor/profile-vendor/perusahaanActions';
import {fetchVendorAccGroup} from '../../../store/actions/master/vendorAccGroupActions';
import {fetchIncoterms} from '../../../store/actions/master/incotermsActions';
import {fetchGlAccountCompany} from '../../../store/actions/master/glAccountCompanyActions';
import {fetchCurrencies} from '../../../store/actions/master/currenciesActions';
import {fetchSearchTerms} from '../../../store/actions/master/seacrhTermsAction';
import {fetchTermsOfPayment} from '../../../store/actions/master/termsOfPaymentActions';
import {showRegistrasiVendor} from '../../../store/actions/vendor/registrasiVendorActions';
import {vendorResponse} from '../../../store/actions/vendor/profile-vendor/perusahaanActions';
import Form from './sub/Form'
import ReactTablePagination from '../../../components/paginations/ReactTablePagination';
import FilterStatus from '../../../components/filterstatus/FilterStatus';
import FilterDate from '../../../components/filterdate/FilterDate';
import { debounce } from '../../../helpers/debounce';
// import { statusName } from '../../../helpers/statusName';

class ExtendCompanyApproval extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            account_group: '',
			recont_account: '',
			company_code: '',
			purchasing_org_id: '',
			currency: '',
			term_of_payment: '',
			incoterm_id: '',
            incoterm_location: '',
            search_terms_id: '',
			witholding_tax: '',
            data: [],
            approval: {
                status: '',
                name: '',
            },
            params: {
				sap_number: '',
                vendor_id: '',
				vendor_name: '',
				company_id: '',
				company_name: '',
                status: '',
                note: '',
                created_at: '',
                updated_at: '',
                created_by_name: '',
                start: 0,
                length: 0,
                column: 'vendor_id',
                dir: 'asc'
            },
			statusSearch: [
				{name: 'Registered', value: 's', isChecked: false},
				{name: 'Rejected', value: 'r', isChecked: false},
				{name: 'Pengajuan Extend', value: 'd', isChecked: false},
				// {name: 'Unregistered', value: null, isChecked: false},
            ],
            master_data: {
                data_vendor: [],
				m_incoterm: [],
				m_vendor_acc_group: [],
				m_gl_account: [],
				m_currency: [],
                m_searchterm: [],
                m_term_of_payment : []
            },
            loadings: {
                vendors: false,
                m_vendor_acc_group: false,
				incoterm: false,
                gl_account: false,
				currency: false,
                searchterms: false,
                termsOfPayment: false
			},
            defaultPageSize: 10,
            pages: 0,
            column: 1,
            dir: '',
            page: 0,
            loading: false,
            modalOpen: false,
            modalDetail: false,
            isConfirm: false,
            company_id: '',
            uuid: '',
            error: false,
            errors: {},
            loadingSubmit: false
        }
        this.defaultSorted = [
            {
                id: "id",
                desc: false
            }
        ];
        this.columns = [
            {
                Header:'No. Pendaftaran',
                accessor: "vendor_id",
                height: 10,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="vendor_id" onChange={(event) => this.onChanged(event)} value={this.state.params.vendor_id} />
                )
            },
			{
				Header:'No. ERP',
				id: "sap_number",
				accessor: d => d.sap_number,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="sap_number" onChange={(event) => this.onChanged(event)} value={this.state.params.sap_number} />
				)
			},
            {
                Header:'Nama Vendor',
                accessor: "vendor_name",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="vendor_name" onChange={(event) => this.onChanged(event)} value={this.state.params.vendor_name} />
                )
            },
            {
                Header:'Diajukan oleh',
                accessor: "created_by_name",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="created_by_name" onChange={(event) => this.onChanged(event)} value={this.state.params.created_by_name} />
                )
            },
			{
				Header:'Tanggal Pengajuan',
				id: "created_at",
				accessor: d => d.created_at,
				Filter: ({ filter, onChange }) => (
					<FilterDate type="created_at" getDate={this.created_at} />
				)
			},
			{
				Header:'Status',
				id: "status",
				accessor: d => d.status_text,
				Filter: ({ filter, onChange }) => (
                    <FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
				)
			},
            {
                Header: () => this.props.t("vendorClassification:label.action"),
                filterable: false,
                sortable: false,
                id: "action",
                accessor: d => d,
                Cell: ({ value }) => (
                    <React.Fragment>
                        <center>
                            { value.status === 'd' && <button className="btn btn-xs btn-primary" value={value} onClick={(e) => this.toggleFormOpen(e, value)} disabled={this.state.loadings.vendors} > {this.state.loadings.vendors && <i className="fas fa-spinner fa-pulse"></i> } Process</button>}
                            { value.status === 's' && <button className="btn btn-xs btn-primary" value={value} onClick={(e) => this.toggleDetail(e, value)} disabled={this.state.loadings.vendors} > {this.state.loadings.vendors && <i className="fas fa-spinner fa-pulse"></i> } View</button>}
                            { value.status === 'r' && <button className="btn btn-xs btn-primary" value={value} onClick={(e) => this.toggleDetail(e, value)} disabled={this.state.loadings.vendors} > {this.state.loadings.vendors && <i className="fas fa-spinner fa-pulse"></i> } View</button>}
                            {/* {this.props.access.A && <button className="btn btn-xs btn-primary" value={value} onClick={(e) => this.toggleFormOpen(e, value, 's', 'Approve')} ><i className="fa fa-check"></i></button>} */}
                            {/* {this.props.access.A && <button className="btn btn-xs btn-danger" value={value} onClick={(e) => this.toggleFormOpen(e, value, 'r', 'Reject')} ><i className="fa fa-times"></i></button>} */}
                        </center>
                    </React.Fragment>
                )
            },
        ];
    }

    debounced = debounce(text => this.asyncData())
    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    asyncData = async () => {
        this.setState({ loading: true })
        this.props.vendorResponse({type: false});
        this.props.fetchApprovalExtendCompany(this.state.params)
            .then((resp) => {
                // console.log(resp)
                this.setState({
                    data: resp.data.data,
                    pages: Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.params.length),
                    recordsFiltered: resp.data.recordsFiltered
                })
            })
            .catch((resp) => {
                let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
                toastr.error('Oops', message);
            })
            .then(() => {
                this.setState({ loading: false })
            })
    }
	
    onChanged(event) {
        var someProperty = { ...this.state.params }
        someProperty[event.target.name] = event.target.value
        this.setState({
            params: someProperty
        }, () => { this.debounced(someProperty) });
    }

    customs(arr) {
        var state = (arr.pageSize = 0 ? 10 : arr.pageSize);
        var someProperty = { ...this.state }
        someProperty.params.start = (arr.page * state)
        someProperty.params.length = state;
        someProperty.defaultPageSize = state;
        someProperty.params.column = arr.sorted[0].id
        someProperty.params.dir = (arr.sorted[0].desc ? 'desc' : 'asc')

        this.setState({
            someProperty
        }, () => { this.req() });
    }

    req(stateArr) {
        if (stateArr !== undefined) {
            this.customs(stateArr)
        } else {
            this.asyncData();
        }
    }

    toggleFormOpen = (e, value) => {
        e.preventDefault();
        this.showRegistrasiVendor(value.vendor_uuid, value)
    }

    toggleDetail = (e, value) => {
        e.preventDefault();
        this.setState( () => ({
            modalOpen: true,
            modalDetail: true,
            data: value,
        }));
    }

	toggleFormClose = (e) => {
		e.preventDefault();
        this.setState(({ loadings, master_data }) => ({
            account_group: '',
			recont_account: '',
			company_code: '',
			purchasing_org_id: '',
			currency: '',
			term_of_payment: '',
			incoterm_id: '',
			witholding_tax: '',
            modalOpen: false,
            modalDetail: false,
            data: [],
            loadings: { ...loadings, vendors: false },
            master_data: { ...master_data, data_vendor: [] }
        }));
    }

    showRegistrasiVendor = (uuid, value) => {
		if(this._isMounted){
			this.setState(({ loadings, master_data }) => ({
				loadings: { ...loadings, vendors: true },
				master_data: { ...master_data, data_vendor: [] }
			}));
			this.props.showRegistrasiVendor(uuid)
			.then((resp) => {
                let data_vendor = resp.data.data;
                this.setData(data_vendor)
				this.setState(({ loadings, master_data }) => ({
                    modalOpen: true,
                    modalDetail: false,
                    data: value,
					loadings: { ...loadings, vendors: false },
					master_data: { ...master_data, data_vendor: data_vendor }
                }));
			})
			.catch((resp) => {
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, vendors: false },
					master_data: { ...master_data, data_vendor: [] }
				}));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}

    updatePayload = (id, payload) => {
        if (this._isMounted) {
            console.log(payload)
            if (payload.term_of_payment === '' && payload.status === 's'){
                toastr.warning('Term Of Payment Wajib Diisi')
            }else if (payload.search_term === '' && payload.status === 's'){
                toastr.warning('Searchterms Wajib Diisi')
            }else if (payload.incoterm_id !== '' && payload.incoterm_location === '' && payload.status === 's'){
                toastr.warning('Incoterm Location Wajib Diisi Jika Incoterm Dipilih')
            }else{
                this.setState({ loadingSubmit: true });
                console.log(payload)
                this.props.updateApprovalExtendCompany(id, payload)
                    .then((resp) => {
                        toastr.success(resp.data.message);
                        this.setState({ modalOpen: false, modalDetail: false, data: [], loadingSubmit: false }, () => this.req())
                        console.log(resp)
                    })
                    .catch((error) => {
                        this.setState({ loadingSubmit: false });
                        if(typeof error.data.errors === 'object' && error.data.errors !== null ){
                            for (const [key, value] of Object.entries(error.data.errors)) {
                                toastr.error(key, value[0])
                            }
                        }else{
                            toastr.error("Error",error.data?.errors)
                        }
                        console.log(error)
                    })
            }
        }
    }

    fetchTermOfPayment = (params) => {
		if(this._isMounted){
			let select_params = (params !== '') ? {select: params} : {start: 0, length: 10};
			this.setState(({ loadings, master_data }) => ({
				loadings: { ...loadings, termsOfPayment: true },
				master_data: { ...master_data, m_term_of_payment: [] }
			}));
			this.props.fetchTermsOfPayment(select_params)
			.then((resp) => {
				let m_term_of_payment = resp.data.data;
				let options = m_term_of_payment.map((dt) => {
					return { value: dt.id, label: dt.id+' - '+dt.description };
				})
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, termsOfPayment: false },
					master_data: { ...master_data, m_term_of_payment: options }
				}));
			})
			.catch((resp) => {
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, termsOfPayment: false },
					master_data: { ...master_data, m_term_of_payments: [] }
				}));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}

    fetchSearchTerms = (params) => {
		if(this._isMounted){
			let select_params = (params !== '') ? {select: params} : {start: 0, length: 10};
			this.setState(({ loadings, master_data }) => ({
				loadings: { ...loadings, searchterms: true },
				master_data: { ...master_data, m_searchterm: [] }
			}));
			this.props.fetchSearchTerms(select_params)
			.then((resp) => {
				let m_searchterm = resp.data.data;
				let options = m_searchterm.map((dt) => {
					return { value: dt.code, label: dt.code+' - '+dt.description };
				})
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, searchterms: false },
					master_data: { ...master_data, m_searchterm: options }
				}));
			})
			.catch((resp) => {
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, searchterms: false },
					master_data: { ...master_data, m_searchterms: [] }
				}));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}

    fetchIncoterms = (params) => {
		if(this._isMounted){
			let select_params = (params !== '') ? {select: params} : {start: 0, length: 10};
			this.setState(({ loadings, master_data }) => ({
				loadings: { ...loadings, incoterm: true },
				master_data: { ...master_data, m_incoterm: [] }
			}));
			this.props.fetchIncoterms(select_params)
			.then((resp) => {
				let m_incoterm = resp.data.data;
				let options = m_incoterm.map((dt) => {
					return { value: dt.id, label: dt.id+' - '+dt.name };
				})
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, incoterm: false },
					master_data: { ...master_data, m_incoterm: options }
				}));
			})
			.catch((resp) => {
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, incoterm: false },
					master_data: { ...master_data, m_incoterm: [] }
				}));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}

	fetchVendorAccGroup = (params) => {
		if(this._isMounted){
			let select_params = (params !== '') ? {select: params} : {start: 0, length: 10};
			this.setState(({ loadings, master_data }) => ({
				loadings: { ...loadings, vendor_acc_group: true },
				master_data: { ...master_data, m_vendor_acc_group: [] }
			}));
			this.props.fetchVendorAccGroup(select_params)
			.then((resp) => {
				let m_vendor_acc_group = resp.data.data;
				let options = m_vendor_acc_group.map((dt) => {
					return { value: dt.id, label: dt.id+' - '+dt.name };
				})
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, vendor_acc_group: false },
					master_data: { ...master_data, m_vendor_acc_group: options }
				}));
			})
			.catch((resp) => {
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, vendor_acc_group: false },
					master_data: { ...master_data, m_vendor_acc_group: [] }
				}));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
    }

	fetchCurrencies = (params) => {
		if(this._isMounted){
			let select_params = (params !== '') ? {select: params} : {start: 0, length: 10};
			this.setState(({ loadings, master_data }) => ({
				loadings: { ...loadings, currency: true },
				master_data: { ...master_data, m_currency: [] }
			}));
			this.props.fetchCurrencies(select_params)
			.then((resp) => {
				let m_currency = resp.data.data;
				let options = m_currency.map((dt) => {
					return { value: dt.short_text, label: dt.short_text+' - '+dt.long_text };
				})
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, currency: false },
					master_data: { ...master_data, m_currency: options }
				}));
			})
			.catch((resp) => {
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, currency: false },
					master_data: { ...master_data, m_currency: [] }
				}));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
    }
    
	fetchGlAccountCompany = (params) => {
		if(this._isMounted){
			let select_params = (params !== '') ? {company_id: this.props.user.purchasing_org_id, select: params} : {company_id: this.props.user.purchasing_org_id, start: 0, length: 10};
			this.setState(({ loadings, master_data }) => ({
				loadings: { ...loadings, gl_account: true },
				master_data: { ...master_data, m_gl_account: [] }
			}));
			this.props.fetchGlAccountCompany(select_params)
			.then((resp) => {
				let m_gl_account = resp.data.data;
				let options = m_gl_account.map((dt) => {
					return { value: dt.gl_account_id, label: dt.gl_account_id+' - '+dt.gl_account_name };
				})
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, gl_account: false },
					master_data: { ...master_data, m_gl_account: options }
				}));
			})
			.catch((resp) => {
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, gl_account: false },
					master_data: { ...master_data, m_gl_account: [] }
				}));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}

    toggleConfirm = (e, value) => {
        e.preventDefault();
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ isConfirm: true, uuid: uuid })
    }

    created_at = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.created_at = date;
        } else {
            filters.created_at = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }

    updated_at = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.updated_at = date;
        } else {
            filters.updated_at = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }

    getCheck = (check) => {
        console.log(check)
        let filters = { ...this.state.params }
        filters.start = 0;
        if (check.length > 0) {
            filters.status = check.join(";");
            this.setState({ params: filters }, () => this.asyncData())
        } else {
            filters.status = [];
            this.setState({ params: filters }, () => this.asyncData())
        }
    }

    handleChange = (name, value) => {
		this.setState({
				[name]: value,
		});
    };
    
    setData = (data) => {
		const data_vendor = data;
        console.log(data)
		// const purchasing_org = { value: data_vendor.purchasing_org_id, label: `${data_vendor.purchasing_org_id} - ${data_vendor.purchasing_org_name}` }
        // const company = { value: data_vendor.company_type_id, label: `${data_vendor.company_type_id} - ${data_vendor.company_type_name}` }
        // const company = { value: this.props.user.purchasing_org_id, label: `${this.props.user.purchasing_org_id} - ${this.props.user.purchasing_org_name}` }
        const account_group_id = (data_vendor.vendor_type_id !== 1) ? 'AP02' : 'AP01';
		const account_group_name = (data_vendor.vendor_type_id !== 1) ? 'Rekanan Luar Negeri' : 'Rekanan Dalam Negeri';
		const account_group = { value: account_group_id, label: `${account_group_id} - ${account_group_name}` }
		const witholding_tax = { value: 'ID', label: `ID` }
		// const term_of_payment = {value : data.terms_of_payment_id, label : `${data.terms_of_payment_id} - ${data.terms_of_payment_description}`}
		const currency = { value: 'IDR', label: `IDR - Rupiah Indonesia` }
        const recont_account = { value: '210211100', label: `210211100 - Utang Ush-P3` }
        const search_terms = {value : data.search_terms_code, label : `${data.search_terms_code} - ${data.search_terms_description}`}
        // const incoterm_location = data.incoterm_location ? data.incoterm_location : ""
        // const incoterm_id = {value : data.incoterm_id, label : `${data.incoterm_id} - ${data.incoterm_description}`}
        
		this.setState({
			company_code: '',
			purchasing_org_id: '',
			account_group: account_group,
			witholding_tax: witholding_tax,
			// term_of_payment: data.terms_of_payment_id ? term_of_payment : '',
			currency: currency,
			recont_account: recont_account,
            search_terms_id : data.search_terms_code ? search_terms : '',
            // incoterm_location : incoterm_location,
            // incoterm_id : data.incoterm_id ? incoterm_id : ''
		})
    }
    
    setPuchaseOrg = (data_vendor) => {
        const purchasing_org = { value: data_vendor.id, label: `${data_vendor.id} - ${data_vendor.name}` }
        this.setState({
			purchasing_org_id: purchasing_org,
			company_code: purchasing_org,
		})
    }

	onResetFilter = (val) => {
		this.setState({
            params: val
        }, () => this.asyncData());    
	}

    render() {
        // const { t } = this.props;
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
					<li className="breadcrumb-item">Vendor Management</li>
					<li className="breadcrumb-item active">Verifikasi Extend Company</li>
                </ol>
                <h1 className="page-header">Verifikasi Extend Company</h1>
                <Panel loading={false}>
                    <PanelHeader>Verifikasi Extend Company</PanelHeader>
                    <PanelBody loading={false}>
                        <Row>
                            <Col sm="6">
                            </Col>
							<Col sm="6">
								<div className="pull-right m-b-10">
									{this.state.modalOpen && <Button color="danger" size="sm" disabled={this.state.loading} onClick={(e) => this.toggleFormClose(e)}>
										{this.state.loading && <i className="fas fa-spinner fa-pulse"></i> }
										Kembali
									</Button>}
								</div>
							</Col>
                        </Row>
                        { !this.state.modalOpen && (
                            <Row>
                                <Col sm="12">
                                    <ReactTable
                                        // loading={false}
                                        filterable loading={this.state.loading}
                                        manual
                                        minRows={1}
                                        PaginationComponent={ReactTablePagination}
                                        data={this.state.data}
                                        columns={this.columns}
                                        defaultPageSize={this.state.defaultPageSize}
                                        defaultSorted={this.defaultSorted}
                                        showPagination={true}
                                        showPaginationTop={false}
                                        showPaginationBottom={true}
                                        pageSizeOptions={[10, 20, 25, 50, 100]}
                                        recordsTotal={this.state.recordsTotal}
                                        recordsFiltered={this.state.recordsFiltered}
                                        length={this.state.params.length}
                                        start={this.state.params.start}
                                        onResetFilter={val => this.onResetFilter(val)}
                                        options={this.state.params}
                                        className="-highlight"
                                        pages={this.state.pages}
                                        onFetchData={(state, instance) => {
                                            this.req(state);
                                        }}
                                    />
                                </Col>
                            </Row>)
                        }
                        {this.state.modalOpen &&
                            <Form 
                                t={this.props.t}
                                toggleAdd={this.state.modalOpen}
                                toggleDetail={this.state.modalDetail}
                                user_uuid={this.props.user.uuid}
                                data={this.state.data}
                                fetchCompanies={this.props.fetchCompanies}
                                showApprovalExtendCompany={this.props.showApprovalExtendCompany} 
                                fetchProfileVendor={this.props.fetchProfileVendor}
                                fetchVerificationList={this.props.fetchVerificationList}
                                updatePayload={this.updatePayload} 
                                toggleFormClose={this.toggleFormClose}
                                errors={this.state.errors}
                                loadingSubmit={this.state.loadingSubmit}
                                setLoading={this.setLoading} 
                                parentState={this.state}
                                setPuchaseOrg={this.setPuchaseOrg}
                                fetchIncoterms={this.fetchIncoterms}
                                fetchVendorAccGroup={this.fetchVendorAccGroup}
                                fetchGlAccount={this.fetchGlAccountCompany}
                                fetchCurrencies={this.fetchCurrencies}
                                fetchSearchTerms={this.fetchSearchTerms}
                                fetchTermOfPayment={this.fetchTermOfPayment}
                                showRegistrasiVendor={this.props.showRegistrasiVendor}
                                handleChange={this.handleChange}
                            />
                        }
                    </PanelBody>

                </Panel>
            </div>
        )
    }
}

const stateToProps = state => {
    return {
        sidebarDt: state.sidebarDt,
        user: state.auth.user.data,
        access: state.sidebarDt.access
    }
}

const dispatchToProps = dispatch => {
	return {
		fetchApprovalExtendCompany: (params) => dispatch(fetchApprovalExtendCompany(params)),
		showApprovalExtendCompany: (params) => dispatch(showApprovalExtendCompany(params)),
		fetchCompanies: (params) => dispatch(fetchCompanies(params)),
		updateApprovalExtendCompany: (id, payload) => dispatch(updateApprovalExtendCompany(id, payload)),
		fetchVerificationList: (params) => dispatch(fetchVerificationList(params)),
        fetchProfileVendor: (vendor_uuid, verif_uuid) => dispatch(fetchProfileVendor(vendor_uuid, verif_uuid)),
        fetchIncoterms: (params) => dispatch(fetchIncoterms(params)),
		fetchVendorAccGroup: (params) => dispatch(fetchVendorAccGroup(params)),
		fetchGlAccountCompany: (params) => dispatch(fetchGlAccountCompany(params)),
		fetchCurrencies: (params) => dispatch(fetchCurrencies(params)),
        showRegistrasiVendor: (uuid) => dispatch(showRegistrasiVendor(uuid)),
        vendorResponse: data => dispatch(vendorResponse(data)),
        fetchSearchTerms: (params) => dispatch(fetchSearchTerms(params)),
        fetchTermsOfPayment: (params) => dispatch(fetchTermsOfPayment(params)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (ExtendCompanyApproval));