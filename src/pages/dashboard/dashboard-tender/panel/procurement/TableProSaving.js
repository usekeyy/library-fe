import React, { Component } from 'react'
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { toastr } from 'react-redux-toastr';
import 'react-table/react-table.css';
import { Button, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';

import ReactTablePagination from '../../../../../components/paginations/ReactTablePagination';
import FilterStatus from '../../../../../components/filterstatus/FilterStatus';
import { getTenderProcurementSavingTable, downloadExcelProcurementSaving } from '../../../../../store/actions/dashboard/dashboardTenderAction';
// import FilterDate from '../../../../../components/filterdate/FilterDate';
// import { formatDate } from '../../../../../helpers/formatDate';
import { formatNumber } from '../../../../../helpers/formatNumber';

class TablePorSaving extends Component {
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
                purchasing_org_name: "",
                ranking: "",
                sap_code:"",
                vendor_name : "",
                total : "",
                kelompok :"",
                status :"",
                start: 0,
                length: 0,
                column: '',
                dir: ''
            },
			statusSearch: [
                {name: 'Good', value: 'good', isChecked: false},
                {name: 'Missed', value: 'missed', isChecked: false},
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
                Header: "Vendor ID",
				id: "vendor_id",
				accessor: d => d.vendor_id,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="vendor_id" onChange={(event) => this.onChanged(event)} value={this.state.params.vendor_id} />
                )
			},
            {
                Header: "ERP Number",
				id: "sap_code",
				accessor: d => d.sap_code,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="sap_code" onChange={(event) => this.onChanged(event)} value={this.state.params.sap_code} />
                )
			},
            {
                Header: "Vendor",
				id: "vendor_name",
				accessor: d => d.vendor_name,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="vendor_name" onChange={(event) => this.onChanged(event)} value={this.state.params.vendor_name} />
                )
			},
            {
                Header: "No PO",
				id: "sap_number",
				accessor: d => d.sap_number,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="sap_number" onChange={(event) => this.onChanged(event)} value={this.state.params.sap_number} />
                )
			},
            {
                Header: "No Tender",
				id: "number",
				accessor: d => d.number,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="number" onChange={(event) => this.onChanged(event)} value={this.state.params.number} />
                )
			},
            {
                Header: "Metode Tender",
				id: "metode_tender",
				accessor: d => d.metode_tender,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="metode_tender" onChange={(event) => this.onChanged(event)} value={this.state.params.metode_tender} />
                )
			},
            {
                Header: "Purchasing Organization ID",
				id: "purc_org_id",
				accessor: d => d.purc_org_id,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="purc_org_id" onChange={(event) => this.onChanged(event)} value={this.state.params.purc_org_id} />
                ),
			},
            {
                Header: "Purchasing Organization",
				id: "purchasing_org_name",
				accessor: d => d.purchasing_org_name,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="purchasing_org_name" onChange={(event) => this.onChanged(event)} value={this.state.params.purchasing_org_name} />
                ),
			},

            {
                Header: "Title",
				id: "title",
				accessor: d => d.title,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="title" onChange={(event) => this.onChanged(event)} value={this.state.params.title} />
                )
			},
            {
                Header: "Nilai HPS",
				id: "nilai_hps",
				accessor: d => formatNumber(d.nilai_hps,2),
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="nilai_hps" onChange={(event) => this.onChanged(event)} value={this.state.params.nilai_hps} />
                ),
                className : 'text-right'
			},
            {
                Header: "Nilai PO",
				id: "nilai_po",
				accessor: d => formatNumber(d.nilai_po,2),
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="nilai_po" onChange={(event) => this.onChanged(event)} value={this.state.params.nilai_po} />
                ),
                className : 'text-right'
			},
            {
                Header: "Saving Value",
				id: "saving_value",
				accessor: d => formatNumber(d.saving_value,2),
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="saving_value" onChange={(event) => this.onChanged(event)} value={this.state.params.saving_value} />
                ),
                // Cell : ({original}) => (
                //     <React.Fragment>
                //         <div className='text-right'>
                //             {formatNumber((original.nilai_hps - original.nilai_po),2)}
                //         </div>
                //     </React.Fragment>
                // )
			},
            {
                Header: " % Saving",
				id: "saving_percent",
				accessor: d => d.saving_percent,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="saving_percent" onChange={(event) => this.onChanged(event)} value={this.state.params.saving_percent} />
                ),
                Cell : ({value}) => (
                    <React.Fragment>
                        {value + '%'}
                    </React.Fragment>
                )
			},
            {
                Header: "% KPI",
				id: "kpi",
				accessor: d => d.kpi,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="kpi" onChange={(event) => this.onChanged(event)} value={this.state.params.kpi} />
                ),
                Cell : ({value}) => (
                    <React.Fragment>
                        {value && value + ' %'}
                    </React.Fragment>
                )
			},
            {
                Header: "Kinerja",
				id: "kinerja",
				accessor: d => d.kinerja,
				Filter: ({ filter, onChange }) => (
                    <FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
                ),
                Cell : ({value}) => (
                    <React.Fragment>
                        {value === 'good' ? <h5><span className="label label-success">Good</span></h5> : value === 'missed' ? <h5><span className="label label-warning">Missed</span></h5> : ''}
                    </React.Fragment>
                )
			},
            // {
            //     Header: "Action",
            //     filterable: false,
            //     headerClassName: "sticky",
            //     id:"actions",
            //     fixed: "right",
            //     sortable: false,
            //     Cell: d => (
            //         <React.Fragment>
            //             <center>
            //                 <button className="btn btn-xs btn-primary">Detail</button>
            //             </center>
            //         </React.Fragment>
            //     )
            // },

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
        this.props.getTenderProcurementSavingTable(this.state.params)
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
            filters.kinerja = check.join(";");
            this.setState({ params: filters }, () => this.asyncData())
        } else {
            filters.kinerja = [];
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
        this.props.downloadExcelProcurementSaving()
			.then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Report_Procurement_Saving.xlsx'); //or any other extension
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
                        Report Procurement Saving
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
		getTenderProcurementSavingTable: (params) => dispatch(getTenderProcurementSavingTable(params)),
        downloadExcelProcurementSaving : () => dispatch(downloadExcelProcurementSaving()),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (TablePorSaving));
// export default connect(stateToProps)( withTranslation() (PerformanceReport));