import React, { Component } from 'react'
import {Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from './../../../containers/layout/sub/panel/panel';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import "react-table-hoc-fixed-columns/lib/styles.css";
import ReactTablePagination from '../../../components/paginations/ReactTablePagination';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import withFixedColumns from "react-table-hoc-fixed-columns";
import { fetchAanwijzingList, registrationAanwijzing } from '../../../store/actions/tendering/aanwijzingActions'
import FilterDate from '../../../components/filterdate/FilterDate';
import { Modal, ModalHeader } from 'reactstrap';
import FormRegistration from "./detail/FormRegistration"
import { formatDate } from '../../../helpers/formatDate';
import FilterStatus from '../../../components/filterstatus/FilterStatus';


const ReactTableFixedColumns = withFixedColumns(ReactTable);

class ListAanwijzingVendor extends Component {

    constructor(props) {
        super(props)
        this._isMounted = false

        this.state = {
            data: [],
            params: {
                no:'',
                proposal_tender_no:'',
                versi:'',
                title:'',
                start_date:'',
                company_name:'',
                aanwijzing_name:'',
                status_aanwijzing:'',
                start: 0,
                length: 0,
                column: '',
                dir: ''
            },
            statusSearch: [
                { name: 'Active', value: 'y', isChecked: false },
                { name: 'Inactive ', value: 'n', isChecked: false },
            ],
            statusAanwijzing: [
                { name: 'Waiting ', value: 'waiting', isChecked: false },
                { name: 'Live', value: 'live', isChecked: false },
                { name: 'Joined', value: 'joined', isChecked: false },
            ],
            defaultPageSize: 10,
            recordsTotal: 0,
            recordsFiltered: 0,
            pages: 0,
            column: 1,
            dir: '',
            page: 0,
            modalRegistration: false,
            loadings : {
                    loadingModalRegistration: false
            },
            dataRegistration :[],
            dataModalRegistration : {
                start_date :'',
                end_date:'',
                paket_no :'',
                title : '',
                uuid:''
            }
        }
        this.defaultSorted = [
            {
                id: "updated_at",
                desc: true
            }
        ];
        this.columns = [
            {
                Header: "No.",
                accessor: "no",
                filterable:false,
                height:10,
                Cell: d =>
                (
                    
                    <React.Fragment>
                        <div>
                            {d.index+1}
                        </div>
                    </React.Fragment>
                )
            },
            {
                Header: () => this.props.t("aanwijzing:label.proposal-tender-number"),
                id :"proposal_tender_no",
                accessor: d => d.proposal_tender_no,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="proposal_tender_no" onChange={(event) => this.onChanged(event)} value={this.state.params.proposal_tender_no} />
                )
            },
            {
                Header: () => this.props.t("aanwijzing:label.description"),
                id: "title",
                accessor: d => d.title,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="title" onChange={(event) => this.onChanged(event)} value={this.state.params.title} />
                ),
            },
            {
                Header: () => this.props.t("aanwijzing:label.version"),
                id: "versi",
                accessor: d => d.versi,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="versi" onChange={(event) => this.onChanged(event)} value={this.state.params.versi} />
                ),
                Cell: ({ value }) => (
                    <center><label>{value}</label></center>
                )
            },
            {
                Header: () => this.props.t("aanwijzing:label.start-date"),
                id: "start_date",
                accessor: d => formatDate(d.start_date,false),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="start_date" getDate={this.start_date} />
                )
            },
            {
                Header: () => this.props.t("aanwijzing:label.company-name"),
                id: "company_name",
                accessor: d => d.company_name,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="company_name" onChange={(event) => this.onChanged(event)} value={this.state.params.company_name} />
                )
            },
            {
                Header: () => this.props.t("aanwijzing:label.type-aanwijzing"),
                id: "aanwijzing_name",
                accessor: d => d.aanwijzing_name,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="aanwijzing_name" onChange={(event) => this.onChanged(event)} value={this.state.params.aanwijzing_name} />
                ),
            },
            {
                Header: () => this.props.t("aanwijzing:label.status-aanwijzing"),
                id: "status_aanwijzing",
                accessor: d => (d.status_aanwijzing !=="" && d.status_aanwijzing!==null) ? d.status_aanwijzing  : (d.registration_aanwijzing!==null) ? d.registration_aanwijzing : (new Date().getTime()/1000 < new Date(d.start_date +" "+d.start_time).getTime()/1000) ? 'Waiting' : (new Date().getTime()/1000 > new Date(d.start_date +" "+d.start_time).getTime()/1000 && new Date().getTime()/1000 < new Date(d.end_date +" "+d.end_time).getTime()/1000) ? "Live" : (new Date().getTime()/1000 > new Date(d.end_date +" "+d.end_time).getTime()/1000) ? "Close" : "", 
                Filter: ({ filter, onChange }) => (
                    <FilterStatus statusSearch={this.state.statusAanwijzing} getStatus={this.getCheckStatusAanwijzing} />
                ),
                Cell: ({ value }) => (
                    <label>{value}</label>
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
                        <div>
                        <button className="btn btn-xs btn-info" value={d.original.uuid} onClick={(e) => this.toggleOpenModalRegistration(e,d.original)}  >Process</button>
                        </div>
                    </React.Fragment>
                )
            },
        ];
    }


    componentDidMount = () => {
        this._isMounted = true
    }

    componentWillUnmount() {
        this._isMounted = false;
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback) => {
            return;
        };
    }


    asyncData = async () => {
        this.setState({ loading: true })
        this.props.fetchAanwijzingList(this.state.params)
            .then((resp) => {
                this.setState({
                    data: resp.data.data,
                    pages: Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.params.length),
                    recordsFiltered: resp.data.recordsFiltered,
                    recordsTotal: resp.data.recordsTotal,
                    loading: false
                })
            })
            .catch((resp) => {
                this.setState({ loading: false })
                let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
                toastr.error('Oops', message);
            });
    }

    onChanged(event) {
        var someProperty = { ...this.state.params }
        someProperty[event.target.name] = event.target.value
        someProperty.start = 0;
        this.setState({
            params: someProperty,
            page: 0
        }, () => { this.req() });
    }

    edits(e, value) {
        this.props.history.push('/tendering/aanwijzing-vendor/detail/' + value)
    }

    customs(arr) {
        var state = (arr.pageSize = 0 ? 10 : arr.pageSize);
        var someProperty = { ...this.state }
        someProperty.page = arr.page
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
            filters.status_aanwijzing = check.join(";");
            this.setState({ params: filters }, () => this.asyncData())
        } else {
            filters.status = [];
            this.setState({ params: filters }, () => this.asyncData())
        }
    }

    getCheckStatusAanwijzing = (check) => {
        let filters = { ...this.state.params }
        filters.start = 0;
        if (check.length > 0) {
            filters.status_aanwijzing = check.join(";");
            this.setState({ params: filters }, () => this.asyncData())
        } else {
            filters.status_aanwijzing = [];
            this.setState({ params: filters }, () => this.asyncData())
        }
    }

    toggleOpenModalRegistration = (e,original) => {
        if(original.registration_aanwijzing!==null && original.registration_aanwijzing!=="")
        {
            this.props.history.push('/task-vendor/aanwijzing-vendor/detail/' + original.uuid)
        }else if(new Date().getTime()/1000 > new Date(original.end_date +" "+original.end_time).getTime()/1000){
            toastr.warning("Warning", "Tanggal Registrasi Sudah Ditutup")
            this.props.history.push('/task-vendor/aanwijzing-vendor')
            // this.props.history.push('/task-vendor/aanwijzing-vendor/detail/' + original.uuid)
        }else if(new Date().getTime()/1000 < new Date(original.start_date +" "+original.start_time).getTime()/1000){
            toastr.warning("Warning", "Tanggal Registrasi Belum Dimulai")
        }else{
            this.setState(({dataModalRegistration})=> ({ 
                modalRegistration : true,
                dataModalRegistration : {...dataModalRegistration , 
                    uuid:original.uuid,
                    paket_no:original.proposal_tender_no, 
                    title:original.title, 
                    start_date:original.start_date+" "+original.start_time, 
                    start_date_format:formatDate(original.start_date,false)+" "+original.start_time, 
                    end_date:original.end_date+" "+original.end_time,
                    end_date_format:formatDate(original.end_date,false)+" "+original.end_time
                }
            }))
        }        
    }

    toggleCloseModalRegistration = () => {
        this.setState(({dataModalRegistration})=> ({ 
            modalRegistration : false,
            // loadings : {...loadings , loadingModalRegistration:false},
            dataModalRegistration : {...dataModalRegistration , uuid:'',paket_no:'', title:'', start_date:'', end_date:''}
        }))
    }

    registration = (id, payload) => {
        if (this._isMounted) {
            this.setState(({loadings})=> ({ 
                loadings : {...loadings , loadingModalRegistration:true},
            }))
            this.props.registrationAanwijzing(id,payload)
                .then((resp) => {
                    toastr.success(resp.data.status, resp.data.message)
                    this.props.history.push('/task-vendor/aanwijzing-vendor/detail/' + id)
                })
                .catch((resp) => {
                    this.setState(({loadings})=> ({ 
                        loadings : {...loadings , loadingModalRegistration:false},
                    }))
                    toastr.error(resp.data.status, resp.data.message)
                });
        }
    }

    start_date = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.start_date = date;
        } else {
            filters.start_date = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }

    onResetFilter = (val) => {
		this.setState({
            params: val,
        }, () => this.asyncData());    
	}


    render() {
        const {t} = this.props
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">Tendering</li>
                    <li className="breadcrumb-item active">Aanwijzing</li>
                </ol>
                <h1 className="page-header">Tendering Aanwijzing<small></small></h1>
                <Panel loading={false} className="margin-bot-false">
                    <PanelHeader>
                       AANWIJZING
                    </PanelHeader>
                    <PanelBody loading={false}>
                        <Row>
                            <Col sm="12">
                                <ReactTableFixedColumns
                                    filterable 
                                    loading={this.state.loading}
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
                                    page={this.state.page}
                                    onFetchData={(state, instance) => {
                                        this.req(state);
                                    }}
                                />
                            </Col>
                        </Row>
                        <div className="row">
                            <div className="col-sm-12">
                                <p className="m-t-0" style={{color:'red'}}><b>Note:</b> <br></br> 1. {t("aanwijzing:label.first-term")}
                                <br></br> 2. {t("aanwijzing:label.second-term")}
                                </p>
                            </div>
                        </div>

                    </PanelBody>

                </Panel>

                <Modal isOpen={this.state.modalRegistration} toggle={() => this.toggleCloseModalRegistration()} className="modal-lg">
                    <ModalHeader toggle={() => this.toggleCloseModalRegistration()}>Modal Registration</ModalHeader>
                    <FormRegistration
                    toggleClose={() => this.toggleCloseModalRegistration()}
                    data = {this.state.dataModalRegistration}
                    registration = {(id,payload) => this.registration(id,payload)}
                    loading={this.state.loadings.loadingModalRegistration}
                    />
                </Modal>

            </div>
        )
    }
}

const stateToProps = state => {
    return {
        sidebarDt: state.sidebarDt,
        access: state.sidebarDt.access,
        user: state.auth.user.data,
    }
}

const dispatchToProps = dispatch => {
    return {
        fetchAanwijzingList: (params) => dispatch(fetchAanwijzingList(params)),
        registrationAanwijzing: (id,payload) => dispatch(registrationAanwijzing(id,payload)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(ListAanwijzingVendor));
