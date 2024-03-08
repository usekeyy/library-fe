import React, { Component } from 'react'
import { Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from './../../../containers/layout/sub/panel/panel';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import "react-table-hoc-fixed-columns/lib/styles.css";
import ReactTablePagination from '../../../components/paginations/ReactTablePagination';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import withFixedColumns from "react-table-hoc-fixed-columns";
import { fetchPrSourceDeterminateSap , getDetailPrSourceDeterminateSap , putPrSourceDeterminateSap} from '../../../store/actions/tendering/prSourceDeterminateSapActions'
// import { statusName } from '../../../helpers/statusName';
// import FilterStatus from '../../../components/filterstatus/FilterStatus';
import { formatNumber } from '../../../helpers/formatNumber';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import ReactLoading from 'react-loading';
import Form from './sub/Form'


const ReactTableFixedColumns = withFixedColumns(ReactTable);

class ListReacttable extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false

        this.state = {
            data: [],
            params: {
                purchasing_requisition_id:'',
                purchasing_requisition_number:'',
                plant_id:'',
                mpn_material:'',
                item_no:'',
                uom:'',
                qty:'',
                source_determination:'',
                short_text:'',
                valuation_price:'',
                status: '',
                created_at: '',
                updated_at: '',
                start: 0,
                length: 0,
                column: '',
                dir: ''
            },
            statusSearch: [
                { name: 'Approved', value: 'y', isChecked: false },
                { name: 'Inactived ', value: 'n', isChecked: false },
                { name: 'Submitted ', value: 's', isChecked: false },
                { name: 'Draft ', value: 'd', isChecked: false },
                { name: 'Reject ', value: 'r', isChecked: false },
                { name: 'Open ', value: 'o', isChecked: false },
                { name: 'Approval ', value: 'p', isChecked: false },
            ],
            loadings: {
                loadingModal: false,
                loadingBtnModal : false
            },
            modalOpen: false,
            modalData: [],
            defaultPageSize: 10,
            recordsTotal: 0,
            recordsFiltered: 0,
            pages: 0,
            column: 1,
            dir: '',
            page: 0,
            uuid_selection : ''
        }
        this.defaultSorted = [
            {
                id: "updated_at",
                desc: true
            }
        ];
        this.columns = [
            // {
            //     Header: 'purchasing_requisition_id',
            //     id : "purchasing_requisition_id",
            //     accessor: "purchasing_requisition_id",
            //     height: 10,
            //     Filter: ({ filter, onChange }) => (
            //         <input className="form-control" name="purchasing_requisition_id" onChange={(event) => this.onChanged(event)} value={this.state.params.purchasing_requisition_id} />
            //     )
            // },
            {
                Header: 'purchasing_requisition_number',
                id: "purchasing_requisition_number",
                accessor: d => d.purchasing_requisition_number,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="purchasing_requisition_number" onChange={(event) => this.onChanged(event)} value={this.state.params.purchasing_requisition_number} />
                )
            },
            {
                Header: 'plant_id',
                id: "plant_id",
                accessor: d => d.plant_id,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="plant_id" onChange={(event) => this.onChanged(event)} value={this.state.params.plant_id} />
                ),
            },
            {
                Header: 'mpn_material',
                id: "mpn_material",
                accessor: d => d.mpn_material,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="mpn_material" onChange={(event) => this.onChanged(event)} value={this.state.params.mpn_material} />
                )
            },
            {
                Header: 'item_no',
                id: "item_no",
                accessor: d => d.item_no,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="item_no" onChange={(event) => this.onChanged(event)} value={this.state.params.item_no} />
                ),
                Cell: ({ value }) => (
                    <div style={{ textAlign: "right" }}>{value}</div>
                )
            },
            {
                Header: 'uom',
                id: "uom",
                accessor: d => d.uom,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="uom" onChange={(event) => this.onChanged(event)} value={this.state.params.uom} />
                ),
            },
            {
                Header: 'qty',
                id: "qty",
                accessor: d => d.qty,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="qty" onChange={(event) => this.onChanged(event)} value={this.state.params.qty} />
                ),
                Cell: ({ value }) => (
                    <div style={{ textAlign: "right" }}>{formatNumber(value, 2)}</div>
                )
            },
            {
                Header: 'source_determination',
                id: "source_determination",
                accessor: d => d.source_determination,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="source_determination" onChange={(event) => this.onChanged(event)} value={this.state.params.source_determination} />
                )
            },
            {
                Header: 'short_text',
                id: "short_text",
                accessor: d => d.short_text,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="short_text" onChange={(event) => this.onChanged(event)} value={this.state.params.short_text} />
                )
            },
            {
                Header: 'valuation_price',
                id: "valuation_price",
                accessor: d => d.valuation_price,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="valuation_price" onChange={(event) => this.onChanged(event)} value={this.state.params.valuation_price} />
                ),
                Cell: ({ value }) => (
                    <div style={{ textAlign: "right" }}>{formatNumber(value, 2)}</div>
                )
            },           
            // {
            //     Header: () => this.props.t("dur:label.status"),
            //     id: "status",
            //     accessor: d => d.status,
            //     Filter: ({ filter, onChange }) => (
            //         <FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
            //     ),
            //     Cell: ({ value }) => (
            //         <label>{statusName(value)}</label>
            //     )
            // },
            // {
            //     Header: 'action',
            //     filterable: false,
            //     headerClassName: "sticky",
            //     id: "actions",
            //     fixed: "right",
            //     sortable: false,
            //     Cell: d => (
            //         <React.Fragment>
            //             <div>
            //                 {this.props.access.U && <button className="btn btn-xs btn-warning" value={d.original.uuid} onClick={(e) => this.getHistory(d.original.uuid)} >Process</button>}
            //             </div>
            //     </React.Fragment>
            // )
            // },
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
    toggleClose = () => {
        this.setState({ modalOpen: false, })
    }


    asyncData = async () => {
        this.setState({ loading: true })
        this.props.fetchPrSourceDeterminateSap(this.state.params)
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
        this.props.history.push('/tendering/dur/detail/' + value)
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

    resetFilter = () => {
        this.setState(({ params }) => ({
            params: {
                ...params,
                purchasing_requisition_id:'',
                purchasing_requisition_number:'',
                plant_id:'',
                mpn_material:'',
                item_no:'',
                uom:'',
                qty:'',
                source_determination:'',
                short_text:'',
                valuation_price:'',
                status: '',
                created_at: '',
                updated_at: '',
                start: 0,
                length: 10,
                column: 'updated_at',
                dir: 'desc'
            }
        }), () => this.asyncData());
    }

    getHistory(uuid) {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                modalOpen: true,
                loadings: { ...loadings, loadingModal: true },
                modalData: [],
                uuid_selection :uuid
            }));
            this.props
                .getDetailPrSourceDeterminateSap(uuid)
                .then((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loadingModal: false },
                        modalData: resp.data.data
                    }));
                    toastr.success(resp.data.message);
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loadingModal: false },
                    }));
                    if (resp !== undefined) {
                        toastr.error(resp.data.message)
                    } else {
                        toastr.error('Opps Somethings Wrong')
                    }
                });
        }
    }

    putPrSourceDeterminateSap (id, payload) {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, loadingBtnModal: true },
        }));
        this.props.putPrSourceDeterminateSap(id, payload)
        .then((resp)=>{
            toastr.success("Success", resp.data.message)
            this.setState({ modalOpen: false, })
            this.asyncData()
        })
        .catch((resp)=>{
            toastr.error("Error", resp.data.message)
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loadingBtnModal: false },
            }));
        })
    }

    onResetFilter = (val) => {
		this.setState({
            params: val,
        }, () => this.asyncData());    
	}



    render() {
        // const { t } = this.props;
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">Purchase Requisition</li>
                    <li className="breadcrumb-item active">PR Determinate SAP</li>
                </ol>
                <h1 className="page-header">PR Source Determinate SAP<small></small></h1>
                <Panel loading={false} className="margin-bot-false">
                    <PanelHeader>
                        PR Source Determinate SAP
                    </PanelHeader>
                    <PanelBody loading={false}>
                        <Row className="m-t-10">
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
                                    onResetFilter={val => this.onResetFilter(val)}
                                    options={this.state.params}
                                    length={this.state.params.length}
                                    start={this.state.params.start}
                                    className="-highlight"
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

                <Modal isOpen={this.state.modalOpen} toggle={() => this.toggleClose()}>
                    <ModalHeader toggle={() => this.toggleClose()}>History</ModalHeader>
                    <ModalBody>
                        {this.state.loadings.loadingModal && (
                            <center>
                                <br />
                                <ReactLoading type="cylon" color="#0f9e3e" />
                                <br />
                            </center>
                        )}
                        {!this.state.loadings.loadingModal && <Form
                            loadings ={this.state.loadings}
                            data = {this.state.modalData}
                            uuid = {this.state.uuid_selection}
                            putPrSourceDeterminateSap = {(id, payload) => this.putPrSourceDeterminateSap (id, payload)}
                        />}
                    </ModalBody>
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
        fetchPrSourceDeterminateSap: (params) => dispatch(fetchPrSourceDeterminateSap(params)),
        getDetailPrSourceDeterminateSap: (id) => dispatch(getDetailPrSourceDeterminateSap(id)),
        putPrSourceDeterminateSap: (id,payload) => dispatch(putPrSourceDeterminateSap(id, payload)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(ListReacttable));
