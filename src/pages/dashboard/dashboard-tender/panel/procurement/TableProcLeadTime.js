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
import { getTenderProcurementLeadTimeTable, downloadExcelProcurementLeadTime } from '../../../../../store/actions/dashboard/dashboardTenderAction';
import FilterDate from '../../../../../components/filterdate/FilterDate';
import { formatDate } from '../../../../../helpers/formatDate';

class TableProcLeadTime extends Component {
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
                Header: "Vendor ID",
				id: "vendor_id",
				accessor: d => d.vendor_id,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="vendor_id" onChange={(event) => this.onChanged(event)} value={this.state.params.vendor_id} />
                )
			},
            {
                Header: "SAP Number",
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
                Header: "Tanggal Tender",
                id : "tgl_tender",
                accessor: d => formatDate(d.tgl_tender),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.tgl_tender} />
                )
            },
            {
                Header: "Tanggal Bid Opening",
                id : "tgl_bid_opening",
                accessor: d => formatDate(d.tgl_bid_opening),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.tgl_bid_opening} />
                )
            },
            {
                Header: "Tanggal Evaluasi Administrasi",
                id : "evaadmin_date",
                accessor: d => formatDate(d.evaadmin_date),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.evaadmin_date} />
                )
            },
            {
                Header: "Tanggal Evaluasi Teknis",
                id : "evatek_date",
                accessor: d => formatDate(d.evatek_date),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.evatek_date} />
                )
            },
            {
                Header: "Tanggal Evaluasi Harga",
                id : "evakom_date",
                accessor: d => formatDate(d.evakom_date),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.evakom_date} />
                )
            },
            {
                Header: "Tanggal Nego",
                id : "tgl_nego",
                accessor: d => formatDate(d.tgl_nego),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.tgl_nego} />
                )
            },
            {
                Header: "Tanggal Awarding",
                id : "tgl_awarding",
                accessor: d => formatDate(d.tgl_awarding),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.tgl_awarding} />
                )
            },
            {
                Header: "Tanggal PO",
                id : "tgl_po",
                accessor: d => formatDate(d.tgl_po),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.tgl_po} />
                )
            },
            {
                Header: "Total (days)",
				id: "total_days",
				accessor: d => d.total_days,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="total_days" onChange={(event) => this.onChanged(event)} value={this.state.params.total_days} />
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
        this.props.getTenderProcurementLeadTimeTable(this.state.params)
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
    
    tgl_bid_opening = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.tgl_bid_opening = date;
        } else {
            filters.tgl_bid_opening = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }

    tgl_tender = (date = '') => {
        let filters = { ...this.state.params }
        filters.end = 0;
        filters.page = 0;
        if (date !== '') {
            filters.tgl_tender = date;
        } else {
            filters.tgl_tender = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }

    evaadmin_date = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.evaadmin_date = date;
        } else {
            filters.evaadmin_date = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }

    evakom_date = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.evakom_date = date;
        } else {
            filters.evakom_date = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }

    evatek_date = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.evatek_date = date;
        } else {
            filters.evatek_date = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }

    tgl_nego = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.tgl_nego = date;
        } else {
            filters.tgl_nego = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }

    tgl_awarding = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.tgl_awarding = date;
        } else {
            filters.tgl_awarding = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }

    tgl_po = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.tgl_po = date;
        } else {
            filters.tgl_po = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }


    downloadExcel = () => {
        this.setState({loadingSubmit: true})
        this.props.downloadExcelProcurementLeadTime()
			.then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Report_Procurement_Lead_Time.xlsx'); //or any other extension
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
                        Report Procurement Lead Time
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
		getTenderProcurementLeadTimeTable: (params) => dispatch(getTenderProcurementLeadTimeTable(params)),
        downloadExcelProcurementLeadTime : () => dispatch(downloadExcelProcurementLeadTime()),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (TableProcLeadTime));
// export default connect(stateToProps)( withTranslation() (PerformanceReport));