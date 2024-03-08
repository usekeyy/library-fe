import React, { Component } from 'react'
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { toastr } from 'react-redux-toastr';
import 'react-table/react-table.css';
import "react-table-hoc-fixed-columns/lib/styles.css";
import withFixedColumns from "react-table-hoc-fixed-columns";
import { Button, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';

import {fetchMasterVpr, syncMasterVpr} from '../../../store/actions/master/masterVprActions';

// import Modal from './sub/Modal'
// import ModalPunishment from './sub/ModalDetailPunishment'
import ReactTablePagination from '../../../components/paginations/ReactTablePagination';
// import FilterStatus from '../../../components/filterstatus/FilterStatus';
import FilterDate from '../../../components/filterdate/FilterDate';
import { formatDate } from '../../../helpers/formatDate';
import { debounce } from '../../../helpers/debounce';


const ReactTableFixedColumns = withFixedColumns(ReactTable);

class PerformanceReport extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            // approval: {
            //     status: '',
            //     name: '',
            // },
            params: {
                purchasing_org_id: "",
                sap_code: "",
                start: 0,
                length: 0,
                column: '',
                dir: ''
            },
			statusSearch: [
                {name: 'Aktif', value: 'aktif', isChecked: false},
                {name: 'Suspend', value: 'suspend', isChecked: false},
                {name: 'Banned', value: 'banned', isChecked: false},
			],
            defaultPageSize: 10,
            pages: 0,
            column: 1,
            dir: '',
            page: 0,
            loading: false,
            modalOpen: false,
            modalPunishment: false,
            isConfirm: false,
            status: '',
            uuid: '',
            company_id: '',
            company_name: '',
            error: false,
            errors: {},
            loadingSubmit: false,
            // recordsTotal : 0,
            recordsFiltered: 0,
            date : ""
        }
        this.defaultSorted = [
            {
                id: "id",
                desc: false
            }
        ];
        this.columns = [
            // {
            //     Header: "id",
            //     id: "id",
            //     accessor: d => d.id,
            //     filterable : false,
            //     sortable : false
                
            // },
			{
                Header: () => this.props.t("masterVpr:label.po"),
                id: "purchasing_org_id",
                headerClassName: "sticky",
                fixed: "left",
				accessor: d => d.purchasing_org_id,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="purchasing_org_id" onChange={(event) => this.onChanged(event)} value={this.state.params.purchasing_org_id} />
				)
			},
            {
                Header: () => this.props.t("masterVpr:label.vendor-code"),
                accessor: "sap_code",
                headerClassName: "sticky",
                fixed: "left",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="sap_code" onChange={(event) => this.onChanged(event)} value={this.state.params.sap_code} />
                ),
                // Cell : row => (
                //     <div>
                //         {this.setNoPendaftaran(row.value)}
                //     </div>
                // )
            },
            {
                Header: () => this.props.t("masterVpr:label.delivery"),
                accessor: "delivery",
                filterable : false,
                sortable : false,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="delivery" onChange={(event) => this.onChanged(event)} value={this.state.params.delivery} />
                )
            },
            {
                Header: () => this.props.t("masterVpr:label.quality"),
                accessor: "quality",
                filterable : false,
                sortable : false,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="quality" onChange={(event) => this.onChanged(event)} value={this.state.params.quality} />
                )
            },
            {
                Header: () => this.props.t("masterVpr:label.price"),
                accessor: "price",
                filterable : false,
                sortable : false,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="price" onChange={(event) => this.onChanged(event)} value={this.state.params.price} />
                )
            },
            {
                Header: () => this.props.t("masterVpr:label.service"),
                accessor: "service",
                filterable : false,
                sortable : false,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="service" onChange={(event) => this.onChanged(event)} value={this.state.params.service} />
                )
            },
            {
                Header: () => this.props.t("masterVpr:label.rfq"),
                accessor: "rfq",
                filterable : false,
                sortable : false,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="rfq" onChange={(event) => this.onChanged(event)} value={this.state.params.rfq} />
                )
            },
            {
                Header: () => this.props.t("masterVpr:label.other"),
                accessor: "other",
                filterable : false,
                sortable : false,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="other" onChange={(event) => this.onChanged(event)} value={this.state.params.other} />
                )
            },
            // {
            //     Header: "Total",
            //     accessor: "total",
            //     filterable : false,
            //     sortable : false,
            //     Filter: ({ filter, onChange }) => (
            //         <input className="form-control" name="total" onChange={(event) => this.onChanged(event)} value={this.state.params.total} />
            //     )
            // },
            // {
            //     Header: "Average",
            //     accessor: "average",
            //     filterable : false,
            //     sortable : false,
            //     Filter: ({ filter, onChange }) => (
            //         <input className="form-control" name="average" onChange={(event) => this.onChanged(event)} value={this.state.params.average} />
            //     )
            // },
            {
                Header: () => this.props.t("masterVpr:label.count-service"),
                accessor: "po_service",
                filterable : false,
                sortable : false,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="po_service" onChange={(event) => this.onChanged(event)} value={this.state.params.po_service} />
                )
            },
            {
                Header: () => this.props.t("masterVpr:label.count-material"),
                accessor: "po_material",
                filterable : false,
                sortable : false,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="po_material" onChange={(event) => this.onChanged(event)} value={this.state.params.po_material} />
                )
            },
            {
                Header: () => this.props.t("masterVpr:label.date"),
                id: "date",
                accessor: d => formatDate(d.date, false),
                filterable : false,
                sortable : false,
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="updated_at" getDate={this.updated_at} />
                )
            },
            {
                Header: "SAP Last Update",
                id: "sap_last_update",
                accessor: d => formatDate(d.sap_last_update, false),
                filterable : false,
                sortable : false,
            },
        ];
    }
    debounced = debounce(text => this.asyncData())
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
        this.getDate()
        this.setState({ loading: true })
        this.props.fetchMasterVpr(this.state.params)
            .then((resp) => {
                console.log(resp.data)
                let number = 0;
                const dataPlusNomor = resp.data.data.map((item) => {
                    if (number === 9){
                        this.setState({date : item.sap_last_update})
                    }
                    number++
                    return {...item, nomor : number}
                })
                this.setState({
                    data: dataPlusNomor,
                    pages: Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.params.length),
                    recordsFiltered: resp.data.recordsFiltered
                })
            })
            .catch((resp) => {
                toastr.error(resp.data.status, resp.data.message);
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
        this.setState({ page: arr.page })
        this.setState({
            someProperty
        }, () => { this.req() });
    }

    req(stateArr) {
        // console.log(stateArr)
        if (stateArr !== undefined) {
            this.customs(stateArr)
        } else {
            this.asyncData();
        }
    }

    toggleFormOpen = (e, value) => {
        e.preventDefault();
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ modalOpen: true, uuid: uuid })
    }

    toggleFormClose = () => {
        this.setState({ modalOpen: false, modalPunishment:false, uuid: '' })
    }

    toggleFormOpenPunishment = (e, value) => {
        e.preventDefault();
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ modalPunishment: true, uuid: uuid })
    }

    toggleConfirm = (e, value) => {
        e.preventDefault();
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ isConfirm: true, uuid: uuid })
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

    syncVprButton = () => {
        this.setState({loadingSubmit: true})
        this.props.syncMasterVpr([])
			.then(res => {
                if (res.data.status === 'success'){
                    toastr.success(res.data.message);
                    this.setState({loadingSubmit: false}, () => this.asyncData())
                    // this.getDate()
                }else{
                    toastr.success("Gagal Sync");
                    this.setState({loadingSubmit: false}, () => this.asyncData())
                }
			})
			.catch(error => {
                // console.log(error)
				if(typeof error !== 'undefined'){
					const {message} = (typeof error !== 'undefined') ? error.data : 'Error';
					toastr.error(message);
					this.setState({error: true, errors: error.data.errors, loadingSubmit: false});
				} else {
					this.setState({loadingSubmit: false});
					toastr.error("Gagal Menyimpan Data");
				}
			})
    }
    onResetFilter = (val) => {
		this.setState({
            params: val
        }, () => this.asyncData());    
	}

    getDate() {
        var date = new Date().toLocaleString() ;
        console.log(date)
    
        this.setState({
          date: date
        });
      }

    render() {
        // const { t } = this.props;
        // console.log(this.props.user) 
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
					<li className="breadcrumb-item">Vendor Management</li>
					<li className="breadcrumb-item active">Master VPR</li>
                </ol>
                <h1 className="page-header">Master VPR</h1>
                <Panel loading={false}>
                    <PanelHeader>Tabel Master VPR</PanelHeader>
                    <PanelBody loading={false}>
                        <div>
                            <Col sm="4">
                                <div className="m-b-10">
                                    <Button color="primary" size="sm" disabled={this.state.loadingSubmit} onClick={() => this.syncVprButton()}>
                                        Sync {this.state.loadingSubmit && <i className="fas fa-spinner fa-pulse"></i>}
                                    </Button>
                                        <span className="label label-success m-l-20">Last Update : {this.state.date}</span>
                                </div>
                            </Col>
                            <ReactTableFixedColumns
                                // loading={false}
                                
                                filterable loading={this.state.loading}
                                manual
                                minRows={1}
                                data={this.state.data}
                                PaginationComponent={ReactTablePagination}
                                columns={this.columns}
                                defaultPageSize={this.state.defaultPageSize}
                                defaultSorted={this.defaultSorted}
                                showPagination={true}
                                showPaginationTop={false}
                                showPaginationBottom={true}
                                pageSizeOptions={[10, 20, 25, 50, 100]}
                                className="-highlight"
                                // recordsTotal={this.state.recordsTotal}
                                recordsFiltered={this.state.recordsFiltered}
                                length={this.state.params.length}
                                start={this.state.params.start}
                                pages={this.state.pages}
                                page={this.state.page}
                                options={this.state.params}
                                onResetFilter={val => this.onResetFilter(val)}
                                onFetchData={(state, instance) => {
                                    this.req(state);
                                }}
                            />
                        </div>
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
		// fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
		fetchMasterVpr: (params) => dispatch(fetchMasterVpr(params)),
        syncMasterVpr: (payload) => dispatch(syncMasterVpr(payload)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (PerformanceReport));
// export default connect(stateToProps)( withTranslation() (PerformanceReport));