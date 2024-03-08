import React, { Component } from 'react'
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { toastr } from 'react-redux-toastr';
import 'react-table/react-table.css';
import { Button, Col } from 'reactstrap';
import { withTranslation } from 'react-i18next';

import ReactTablePagination from '../../../../../components/paginations/ReactTablePagination';
import FilterStatus from '../../../../../components/filterstatus/FilterStatus';
import { getVendorAktifTable, downloadExcelVendorAktif } from '../../../../../store/actions/dashboard/dashboardVendorAction';

class TableKeaktifanVendor extends Component {
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
                {name: 'Active', value: 'Active', isChecked: false},
                {name: 'Suspend', value: 'Suspend', isChecked: false},
                {name: 'Blacklist', value: 'Blacklist', isChecked: false},
                {name: 'Inactive', value: 'Inactive', isChecked: false},
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
				id: "id",
				accessor: d => d.id,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="id" onChange={(event) => this.onChanged(event)} value={this.state.params.id} />
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
                Header: "Vendor Name",
				id: "vendor_name",
				accessor: d => d.vendor_name,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="vendor_name" onChange={(event) => this.onChanged(event)} value={this.state.params.vendor_name} />
                )
			},   
            {
                Header: "Purchasing Organization ID",
				id: "purchasing_org_id",
				accessor: d => d.purchasing_org_id,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="purchasing_org_id" onChange={(event) => this.onChanged(event)} value={this.state.params.purchasing_org_id} />
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
                Header: () => this.props.t("performanceReport:label.status"),
                id: "status",
				accessor: d => d.status,
				Filter: ({ filter, onChange }) => (
                    <FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
                ),
                Cell : row => (
                    <div>
                        <center>
                            {this.setStatus(row.value)}
                        </center>   
                    </div>
                    
                )
			},
        ];
    }

    setStatus(value){
        if (value === "Active") {
            return <h5><span className="label label-success">{this.props.t("performanceReport:data-table.aktif")}</span></h5>
        }else if(value === "Suspend"){
            return <h5><span className="label label-warning">Suspend</span></h5>
        }else if(value === "Inactive"){
            return <h5><span className="label label-danger">Inactive</span></h5>
        }else if(value === "Blacklist"){
            return <h5><span className="label label-dark">Blacklist</span></h5>
        }
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
        this.props.getVendorAktifTable(this.state.params)
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

    downloadExcel = () => {
        this.setState({loadingSubmit: true})
        this.props.downloadExcelVendorAktif()
			.then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Report_Keaktifan_Vendor.xlsx'); //or any other extension
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
	
    onChanged(event) {
        var someProperty = { ...this.state.params }
        someProperty.start = 0;
		someProperty.page = 0;
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

    onResetFilter = (val) => {
		this.setState({
      params: val
    }, () => this.asyncData());    
	}

    render() {
        return (
            <div>
                <Col sm="12">
                    <div className="pull-right">
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
		getVendorAktifTable: (params) => dispatch(getVendorAktifTable(params)),
        downloadExcelVendorAktif : () => dispatch(downloadExcelVendorAktif()),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (TableKeaktifanVendor));
// export default connect(stateToProps)( withTranslation() (PerformanceReport));