import React, { Component } from 'react'
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Row, Col} from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';
// import ReactLoading from 'react-loading';

import { fetchVprPO } from '../../../store/actions/master/vprActions';
import ReactTablePagination from '../../../components/paginations/ReactTablePagination';
import { formatNumber } from '../../../helpers/formatNumber';
import FilterStatus from '../../../components/filterstatus/FilterStatus';

class ListPoVpr extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            dataTable : [],
            params: {
                id: '',
                vendor_name: '',
                eproc_number: '',
                tipe : '',
                title : '',
                company_name : '',
                purc_org_name : '',
                purc_group_name : '',
                total : '',
                currency : '',
                status : '',
                created_at: '',
                updated_at: '',
                start: 0,
                length: 0,
                column: '',
                dir: '',
                report : "0"
            },
            statusSearch: [
                { name: 'Open', value: 'Open', isChecked: false },
                { name: 'In Progress', value: 'In Progress', isChecked: false },
                { name: 'Closed', value: 'Closed', isChecked: false },
                { name: 'Rejected', value: 'Rejected', isChecked: false },
            ],
            loadingSubmit: false,
            defaultPageSize: 10,
            recordsFiltered: 0,
            recordsTotal: 0,
            pages: 0,
            column: 1,
            dir: '',
            page: 0,
            loading: false,
            modalOpen: false,
			toggleSync: false,
            isConfirm: false,
            uuid: '',
            isError: false,
            errors: {},
            detail : false
        }

        this.defaultSorted = [
            {
                id: "id",
                desc: false
            }
        ];

        this.columns = [
            {
				Header: "No",
                accessor: "id",
                height: 10,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="id" onChange={(event) => this.onChanged(event)} value={this.state.params.id} />
                )
            },
            {
				Header: "Vendor",
                accessor: "vendor_name",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="vendor_name" onChange={(event) => this.onChanged(event)} value={this.state.params.vendor_name} />
                )
            },
            {
				Header: "PO",
                accessor: "eproc_number",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="eproc_number" onChange={(event) => this.onChanged(event)} value={this.state.params.eproc_number} />
                )
            },
            {
				Header: "Type",
                accessor: "tipe",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="tipe" onChange={(event) => this.onChanged(event)} value={this.state.params.tipe} />
                )
            },
            {
				Header: "Subject Work",
                accessor: "title",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="title" onChange={(event) => this.onChanged(event)} value={this.state.params.title} />
                )
            },
            {
				Header: "Company",
                accessor: "company_name",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="company_name" onChange={(event) => this.onChanged(event)} value={this.state.params.company_name} />
                )
            },
            {
				Header: "Purchasing Org",
                accessor: "purc_org_name",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="purc_org_name" onChange={(event) => this.onChanged(event)} value={this.state.params.purc_org_name} />
                )
            },
            {
				Header: "Purchasing Group",
                accessor: "purc_group_name",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="purc_group_name" onChange={(event) => this.onChanged(event)} value={this.state.params.purc_group_name} />
                )
            },
            {
				Header: "Value",
                id : "total",
                accessor: d => formatNumber(d.total,2),
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="total" onChange={(event) => this.onChanged(event)} value={this.state.params.total} />
                )
            },
            {
				Header: "Curr",
                accessor: "currency",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="currency" onChange={(event) => this.onChanged(event)} value={this.state.params.currency} />
                )
            },
            {
				Header: "Status",
                accessor: "status",
                Filter: ({ filter, onChange }) => (
                    <FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
                ),
            },
            {
				Header: () => this.props.t("documentType:label.action"),
                filterable: false,
                sortable: false,
                accessor: "uuid",
                Cell: ({ value, original }) => (
                    // <React.Fragment>
                        <center>
                            {this.props.access.C ? 
                            (<button className="btn btn-xs btn-success" value={value} onClick={(e) => this.toDetail(e, value)} >{(original.status === 'Open' || original.status === 'Rejected') ? "Process" : "Lihat"}</button>)
                            :
                            (original.status !== 'Open' && <button className="btn btn-xs btn-success" value={value} onClick={(e) => this.toDetail(e, value)} >Detail</button>)}
                        </center>
                    // </React.Fragment>
                )
            },
        ];
    }

    componentDidMount = () => {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }
    
    toDetail = (e,uuid) => {
        e.preventDefault()
        // this.props.history.push('/vendor/penilaian-vendor/' + uuid)
        this.props.history.push({
            pathname: '/vendor/penilaian-vendor/' + uuid,
            state: { report: false, accessCreate: this.props.access.C}
        })
    }

    toDetailVerifikator = (e,uuid) => {
        e.preventDefault()
        console.log(this.state.isApprove)
        console.log(this.props.access.A)
        this.props.history.push({
            pathname: '/vendor/approval-penilaian-vendor/' + uuid,
            state: { report: false, accessApprove: this.props.access.A, isApprove : this.state.isApprove}
        })
    }

    savePayload = (payload) => {
        this.setPayload(payload)
        // this.setState({ loading: true });
        // this.props.updateVprConfig(this.setArrayPayload(payload))
        //     .then((resp) => {
        //         console.log(resp.data)
        //         toastr.success(resp.data.message);
        //         this.asyncData()
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //         if (error !== undefined) {
        //             toastr.error(error.data.message)
        //             this.setState({ loading: false });
        //         } else {
        //             toastr.error('Opps Somethings Wrong')
        //         }
        //     })
        
    }

    setPayload = (payload) => {
        
    }

    setArrayPayload = (payload) => {
        let result = [];
        for (const [key, value] of Object.entries(payload)) {
            result.push({
                id : key,
                value : value
            })
        }
        return result
    }

    asyncData = async () => {
        this.setState({ loading: true })
        this.props.fetchVprPO(this.state.params)
            .then((resp) => {
                this.setState({
                    dataTable: resp.data.data,
                    pages: Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.params.length),
                    recordsFiltered: resp.data.recordsFiltered,
                    recordsTotal: resp.data.recordsTotal,
                    loading: false
                })
            })
            .catch((resp) => {
                this.setState({ loading: false })
                toastr.error(resp.data.status, resp.data.message);
            });
    }

    onChanged(event) {
        var someProperty = { ...this.state.params }
        someProperty[event.target.name] = event.target.value
        someProperty.start = 0
        this.setState({
            params: someProperty,
            page: 0
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
        this.setState({ page: arr.page })
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

    getCheck = (check) => {
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

    render() {
        // const { t } = this.props;
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">Master Data</li>
                    <li className="breadcrumb-item active">List PO VPR</li>
                </ol>
                <h1 className="page-header">List PO VPR</h1>
                <Panel loading={false}>
                    <PanelHeader>
                        List PO VPR
                    </PanelHeader>
                    <PanelBody loading={false}>
                        <Row>
                            <Col sm="12">
                                <ReactTable
                                    filterable loading={this.state.loading}
                                    manual
                                    minRows={1}
                                    data={this.state.dataTable}
                                    PaginationComponent={ReactTablePagination}
                                    columns={this.columns}
                                    defaultPageSize={this.state.defaultPageSize}
                                    defaultSorted={this.defaultSorted}
                                    showPagination={true}
                                    showPaginationTop={false}
                                    showPaginationBottom={true}
                                    pageSizeOptions={[10, 20, 25, 50, 100]}
                                    className="-highlight"
                                    recordsTotal={this.state.recordsTotal}
                                    recordsFiltered={this.state.recordsFiltered}
                                    onResetFilter={val => this.onResetFilter(val)}
                                    options={this.state.params}
                                    length={this.state.params.length}
                                    start={this.state.params.start}
                                    pages={this.state.pages}
                                    page={this.state.page}
                                    onFetchData={(state, instance) => {
                                        this.req(state);
                                    }}
                                />
                            </Col>
                        </Row>

                    </PanelBody>

                </Panel>
            </div>
        )
    }
}

const stateToProps = state => {
    return {
        sidebarDt: state.sidebarDt,
        access: state.sidebarDt.access,
        user: state.auth.user.data,
        loc: state.sidebarDt.location
    }
}

const dispatchToProps = dispatch => {
    return {
        fetchVprPO: (params) => dispatch(fetchVprPO(params)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(ListPoVpr));
