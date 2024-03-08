import React, { Component } from 'react'
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { toastr } from 'react-redux-toastr';
import 'react-table/react-table.css';
import { Button, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';

import ReactTablePagination from '../../../../../components/paginations/ReactTablePagination';
// import FilterStatus from '../../../../../components/filterstatus/FilterStatus';
import { getTenderSummaryPO, downloadExcelSummarySourcePO } from '../../../../../store/actions/dashboard/dashboardTenderAction';
// import {downloadExcelPerformanceReport} from '../../../../../store/actions/vendor/performanceReportActions';
// import FilterDate from '../../../../../components/filterdate/FilterDate';
// import { formatDate } from '../../../../../helpers/formatDate';
import { formatNumber } from '../../../../../helpers/formatNumber';

class TableSourcePO extends Component {
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
                purch_org_id : "",
                company_name : "",
                source : "",
                jumlah_po : "",
                total_item : "",
                total_nilai : "",
                currency : "",
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
            recordsFiltered: 0
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
                accessor : "uuid",
                filterable : false,
                sortable : false,
                width : 60,
                Cell : ({index}) => (
                    <div>
                        <center>
                            {index + 1 + this.state.params.start}
                        </center>   
                    </div>
                    
                )
            },
            {
                Header: "Purchasing Organization ID",
				id: "purch_org_id",
				accessor: d => d.purch_org_id,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="purch_org_id" onChange={(event) => this.onChanged(event)} value={this.state.params.purch_org_id} />
                ),
			},
            {
                Header: "Purchasing Organization",
				id: "company_name",
				accessor: d => d.company_name,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="company_name" onChange={(event) => this.onChanged(event)} value={this.state.params.company_name} />
                ),
			},
            {
                Header: "Source PO",
				id: "source",
				accessor: d => d.source,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="source" onChange={(event) => this.onChanged(event)} value={this.state.params.source} />
                )
			},
            {
                Header: "Jumlah PO",
				id: "jumlah_po",
				accessor: d => d.jumlah_po,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="jumlah_po" onChange={(event) => this.onChanged(event)} value={this.state.params.jumlah_po} />
                )
			},
            {
                Header: "Jumlah Item PO",
				id: "total_item",
				accessor: d => d.total_item,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="total_item" onChange={(event) => this.onChanged(event)} value={this.state.params.total_item} />
                )
			},
            {
                Header: "Total Nilai Dalam IDR",
				id: "total_nilai",
				accessor: d => formatNumber(d.total_nilai,2),
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="total_nilai" onChange={(event) => this.onChanged(event)} value={this.state.params.total_nilai} />
                )
			},
            {
                Header: "Curr",
				id: "currency",
				accessor: d => d.currency,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="currency" onChange={(event) => this.onChanged(event)} value={this.state.params.currency} />
                )
			},
            
            {
                Header: "Action",
                filterable: false,
                headerClassName: "sticky",
                id:"actions",
                fixed: "right",
                sortable: false,
                Cell: d => (
                    <React.Fragment>
                        <center>
                        <button className="btn btn-xs btn-primary" type="button" onClick={(e) => this.toDetail(e, d.original.source, d.original.currency, d.original.purch_org_id)}>Detail</button>
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

    toDetail(e,source,curr, purchasing_org_id) {
        this.props.props.history.push('/dashboard/tender/detail/summary-of-po/'+source+'/'+ curr+'/'+purchasing_org_id)
    }

    asyncData = async () => {
        this.setState({ loading: true })
        this.props.getTenderSummaryPO(this.state.params)
            .then((resp) => {
                
                this.setState({
                    // data: resp.data.data,
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
        // console.log(stateArr)
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

    valid_start = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.valid_start = date;
        } else {
            filters.valid_start = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }

    validity_end = (date = '') => {
        let filters = { ...this.state.params }
        filters.end = 0;
        filters.page = 0;
        if (date !== '') {
            filters.validity_end = date;
        } else {
            filters.validity_end = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }

    downloadExcel = () => {
        this.setState({loadingSubmit: true})
        this.props.downloadExcelSummarySourcePO()
			.then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Summary_SOurce_Of_PO.xlsx'); //or any other extension
                document.body.appendChild(link);
                link.click();

                toastr.success("Download Success");
                this.setState({loadingSubmit: false})
                // if (res.data.status == 'success'){
                //     toastr.success(res.data.message);
                //     this.setState({loadingSubmit: false}, () => this.asyncData())
                // }else{
                //     toastr.success("Gagal Sync");
                //     this.setState({loadingSubmit: false}, () => this.asyncData())
                // }
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

    render() {
        return (
            <div>
                <Panel collapse={navigator.userAgent.indexOf("Firefox") > -1 ? false : true}>
                    <PanelHeader>
                        Report Summary Source Of PO (SAP/E-proc)
                    </PanelHeader>
                    <PanelBody>
                            <Col sm="12">
                                <div className="pull-right">
                                    {/* <Button color="primary" size="sm" disabled={this.state.loadingSubmit} onClick={() => this.syncVprButton()}>
                                        Sync {this.state.loadingSubmit && <i className="fas fa-spinner fa-pulse"></i>}
                                    </Button> */}
                                    <Button color="primary" size="sm" disabled={this.state.loadingSubmit} onClick={() => this.downloadExcel()} >Download Excel 
                                    {this.state.loadingSubmit && <i className="fas fa-spinner fa-pulse"></i>}
                                    </Button>
                                </div>
                                <br/>
                                <br/>
                            </Col>
                            <ReactTable
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
        access: state.sidebarDt.access,
    }
}

const dispatchToProps = dispatch => {
	return {
		// fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
		getTenderSummaryPO: (params) => dispatch(getTenderSummaryPO(params)),
        downloadExcelSummarySourcePO : () => dispatch(downloadExcelSummarySourcePO()),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (TableSourcePO));
// export default connect(stateToProps)( withTranslation() (PerformanceReport));
