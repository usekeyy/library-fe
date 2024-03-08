import React, { Component } from 'react'
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { toastr } from 'react-redux-toastr';
// import SweetAlert from 'react-bootstrap-sweetalert';
import 'react-table/react-table.css';
import { Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';
import { fetchDocumentType} from '../../../store/actions/master/documentTypeActions';
import { fetchPurchasingRequisition, showPurchasingRequisition} from '../../../store/actions/tendering/purchasingRequisitionActions';
import { fetchMonitoringMrsr, showMonitoringMrsr, updateMonitoringMrsr} from '../../../store/actions/tendering/monitoringMrsrActions';

import ModalForm from './sub/Modal'
import ReactTablePagination from '../../../components/paginations/ReactTablePagination';
import FilterStatus from '../../../components/filterstatus/FilterStatus';
import FilterDate from '../../../components/filterdate/FilterDate';
// import { statusName } from '../../../helpers/statusName';

class MonitoringMrsr extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            params: {
                number : '',
                item_description: '',
                company_name: '',
                created_by: '',
                created_at: '',
                pr_number: '',
                item_no : '',
                source_determination : '',
                updated_at: '',
                start: 0,
                length: 0,
                column: '',
                dir: ''
            },
            statusSearch: [
                { name: 'SAP', value: '2', isChecked: false },
                { name: 'Eproc ', value: '1', isChecked: false },
            ],
            defaultPageSize: 10,
            pages: 0,
            column: 1,
            dir: '',
            page: 0,
            loading: false,
            modalOpen: false,
            isConfirm: false,
            uuid: '',
            error: false,
            errors: {},
            loadingSubmit:false,
            recordsFiltered : 0,
            recordsTotal :0
        }
        this.defaultSorted = [
            {
                id: "id",
                desc: false
            }
        ];
        this.columns = [
            {
                Header: () => "No MR/SR",
                accessor: "number",
                height: 10,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="number" onChange={(event) => this.onChanged(event)} value={this.state.params.number} />
                )
            },
            {
                Header: () => "Item Description",
                accessor: "item_description",
                height: 10,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="item_description" onChange={(event) => this.onChanged(event)} value={this.state.params.item_description} />
                )
            },
            {
                Header: () => "Company",
                accessor: "company_name",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="company_name" onChange={(event) => this.onChanged(event)} value={this.state.params.company_name} />
                )
            },
            {
                Header: () => "Created By",
                accessor: "created_by_name",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="created_by_name" onChange={(event) => this.onChanged(event)} value={this.state.params.created_by_name} />
                ),
                // Cell: ({ value }) => (
                //     <label>{this.setStatusRequired(value)}</label>
                // )
            },
            {
                Header: () => this.props.t("postalCode:label.created_at") ,
                id: "created_at",
                accessor: d => d.created_at,
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.created_at} />
                )
            },
            {
                Header: () => "No PR",
                accessor: "pr_number",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="pr_number" onChange={(event) => this.onChanged(event)} value={this.state.params.pr_number} />
                ),
               
            },
            {
                Header: () => "Item Line",
                accessor: "item_no",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="item_no" onChange={(event) => this.onChanged(event)} value={this.state.params.item_no} />
                )
            },
            {
                Header: () => "Source Determination",
                accessor: "source_determination",
                Filter: ({ filter, onChange }) => (
                    <FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
				),
                Cell: ({ value }) => (
                    <label>{this.setStatutMRSR(value)}</label>
                )
            },
            
            {
                Header: () => this.props.t("postalCode:label.action") ,
                filterable: false,
                sortable: false,
                accessor: "uuid",
                Cell: ({ value }) => (
                    <React.Fragment>
                        <center>
                            {this.props.access.U && <button className="btn btn-xs btn-warning" value={value} onClick={(e) => this.toggleFormOpen(e, value)} ><i className="fa fa-edit"></i></button>}
                        </center>
                    </React.Fragment>
                )
            },
        ];
    }


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
        this.props.fetchMonitoringMrsr(this.state.params)
        // this.props.fetchMonitoringMrsr()
            .then((resp) => {
                this.setState({
                    data: resp.data.data,
                    pages: Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.params.length),
                    recordsFiltered:resp.data.recordsFiltered,
                    recordsTotal : resp.data.recordsTotal
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
        }, () => { this.req() });
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
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ modalOpen: true, errors:{},uuid: uuid })
    }

    toggleFormClose = () => {
        this.setState({ modalOpen: false })
    }

    // savePayload = (payload) => {
    //     if (this._isMounted) {
    //         this.setState({ loadingSubmit: true });
    //         this.props.savePostalCodeMapping(payload)
    //             .then((resp) => {
    //                 toastr.success(resp.data.message);
    //                 this.setState({ modalOpen: false, loadingSubmit:false }, () => this.req())
    //                 // toastr.success(resp.message);
    //             })
    //             .catch(error => {
    //                 if(typeof error !== 'undefined'){
    //                     const {message} = (typeof error !== 'undefined') ? error.data : 'Error';
    //                     toastr.error(message);
    //                     this._isMounted && this.setState({error: true, errors: error.data.errors, loading: false ,loadingSubmit:false});
    //                 } else {
    //                     this._isMounted && this.setState({loading: false, loadingSubmit:false});
    //                     toastr.error("Gagal Menyimpan Data");
    //                 }
    //             })
    //     }
    // }

    updatePayload = (id, payload) => {
        if (this._isMounted) {
            this.setState({ loadingSubmit: true });
            this.props.updateMonitoringMrsr(id, payload)
                .then((resp) => {
                    toastr.success(resp.data.message);
                    this.setState({ modalOpen: false, loadingSubmit:false }, () => this.req())
                    
                })
                .catch((error) => {
                    if(typeof error !== 'undefined'){
                        const {message} = (typeof error !== 'undefined') ? error.data : 'Error';
                        toastr.error(message);
                        this._isMounted && this.setState({error: true, errors: error.data.errors, loading: false ,loadingSubmit:false});
                    } else {
                        this._isMounted && this.setState({loading: false, loadingSubmit:false});
                        toastr.error("Gagal Menyimpan Data");
                    }
                })
        }
    }


    // toggleConfirm = (e, value) => {
    //     e.preventDefault();
    //     const uuid = (typeof value !== 'undefined') ? value : e.target.value;
    //     this.setState({ isConfirm: true, uuid: uuid })
    // }


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
        // console.log(check)
        let filters = { ...this.state.params }
        filters.start = 0;
        if (check.length > 0) {
            filters.source_determination = check.join(";");
            this.setState({ params: filters }, () => this.asyncData())
        } else {
            filters.source_determination = [];
            this.setState({ params: filters }, () => this.asyncData())
        }
    }

    setStatutMRSR = (value) => {
        switch (value) {
            case "1":
                return "Eproc"
        
            case "2":
                return "SAP"

            default:
                return
        }
    }

    onResetFilter = (val) => {
        console.log(val)
		this.setState({
            params: val
        }, () => this.asyncData());    
	}

    render() {
        // const {t} = this.props;
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">MRSR</li>
                    <li className="breadcrumb-item active">Monitoring Material & Service</li>
                </ol>
                <h1 className="page-header">Monitoring Material & Service  <small>Master Monitoring Material & Service</small></h1>
                <Panel loading={false}>
                    <PanelHeader>
                        Tabel Monitoring Material & Service
					</PanelHeader>
                    <PanelBody loading={false}>
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
                        </Row>

                    </PanelBody>

                </Panel>
                {this.state.modalOpen &&
                    <ModalForm
                        errors={this.state.errors}
                        toggleAdd={this.state.modalOpen}
                        uuid={this.state.uuid}
                        // showPostalCodeMapping={this.props.showPostalCodeMapping}
                        fetchPR={this.props.fetchPurchasingRequisition}
                        showDetailPR={this.props.showPurchasingRequisition}
                        showMonitoringMrsr={this.props.showMonitoringMrsr}
                        fetchDocumentType={this.props.fetchDocumentType}
                        loadingSubmit={this.state.loadingSubmit}
                        company_id={this.props.companyId.company_id}
                        // save={this.savePayload}
                        update={this.updatePayload}
                        toggleClose={this.toggleFormClose}
                    />
                }
            </div>
        )
    }
}

const stateToProps = state => {
    return {
        sidebarDt: state.sidebarDt,
        access: state.sidebarDt.access,
        companyId: state.auth.user.data
    }
}

const dispatchToProps = dispatch => {
    return {
        fetchMonitoringMrsr: (params) => dispatch(fetchMonitoringMrsr(params)),
        fetchPurchasingRequisition: (params) => dispatch(fetchPurchasingRequisition(params)),
        showPurchasingRequisition: (id) => dispatch(showPurchasingRequisition(id)),
        showMonitoringMrsr: (id) => dispatch(showMonitoringMrsr(id)),
        updateMonitoringMrsr: (id, payload) => dispatch(updateMonitoringMrsr(id, payload)),
        fetchDocumentType: (params) => dispatch(fetchDocumentType(params)),
    }
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (MonitoringMrsr));
