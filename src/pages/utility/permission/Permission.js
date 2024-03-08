import React, { Component } from 'react'
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { toastr } from 'react-redux-toastr';
import 'react-table/react-table.css';
import { Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from './../../../containers/layout/sub/panel/panel';

import { fetchPermission } from '../../../store/actions/master/permissionActions';
import ModalForm from './sub/Modal';

class Permission extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: [],
            params: {
                name: '',
                guard_name: '',
                actions_name: '',
                feature_name: '',
                status: '',
                start: 0,
                length: 0,
                order: '',
                column: '',
                dir: ''
            },
            defaultPageSize: 10,
            pages: 0,
            column: 1,
            dir: '',
            page: 0,
            modalOpen:false
        }
        this.defaultSorted = [
            {
                id: "name",
                desc: false
            }
        ];
        this.columns = [
            {
                Header: "Name",
                accessor: "name",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control input-sm" name="name" onChange={(event) => this.onChanged(event)} value={this.state.params.name} />
                )
            },
            {
                Header: "Guard",
                accessor: "guard_name",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control input-sm" name="guard_name" onChange={(event) => this.onChanged(event)} value={this.state.params.guard_name} />
                )
            },
            {
                Header: "Action Name",
                accessor: "actions_name",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control input-sm" name="actions_name" onChange={(event) => this.onChanged(event)} value={this.state.params.actions_name} />
                )
            },
            {
                Header: "Feature",
                accessor: "feature_name",
                Cell: ({ row }) => (
                    <p>{(row.status === 'y') ? 'Active' : 'Draft'}</p>
                )
            },
            {
                Header: "Status",
                accessor: "status",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control input-sm" name="status" onChange={(event) => this.onChanged(event)} value={this.state.params.status} />
                )
            },
            {
                Header: "Action",
                filterable: false,
                sortable: false,
                Cell: ({ row }) => (
                    <React.Fragment>
                        <center>
                            {/* <button className="btn btn-xs btn-warning"><i className="fa fa-edit"></i></button>
                            <button className="btn btn-xs btn-danger"><i className="fa fa-trash"></i></button> */}
                        </center>
                    </React.Fragment>
                )
            },
        ];
    }
    asyncData = async () => {
        this.props.fetchPermission(this.state.params)
            .then((resp) => {
                this.setState({
                    data: resp.data.data,
                    pages: Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.params.length)
                })
            })
            .catch((resp) => {
                this.setState({ loading: false })
                let message = (typeof resp.message !== 'undefined') ? resp.message : 'Something Wrong';
                toastr.error('Oops', message);
            });
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

    toggleFormOpen = (e) => {
        e.preventDefault();
        this.setState({ modalOpen: true })
    }

    toggleFormClose=()=>{
        this.setState({ modalOpen: false })
    }

    render() {
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">User Management</li>
                    <li className="breadcrumb-item active">Permission</li>
                </ol>
                <h1 className="page-header">Permission  <small>Pengaturan Permission</small></h1>
                <Panel>
                    <PanelHeader>
                        Master Permission
					</PanelHeader>
                    <PanelBody>
                        <Row>
                            <Col sm="6">
                            </Col>
                            <Col sm="6">
                                <div className="pull-right">
                                    {/* <Button color="primary" className="btn btn-sm btn-primary" onClick={(e) => this.toggleFormOpen(e)}  >Add New</Button> */}
                                </div>
                            </Col>
                        </Row>
                        <br></br>
                        <Row>
                            <Col sm="12">
                                <ReactTable
                                    filterable loading={this.state.loading}
                                    manual
                                    minRows={1}
                                    data={this.state.data}
                                    columns={this.columns}
                                    defaultPageSize={this.state.defaultPageSize}
                                    defaultSorted={this.defaultSorted}
                                    showPagination={true}
                                    showPaginationTop={false}
                                    showPaginationBottom={true}
                                    pageSizeOptions={[10, 20, 25, 50, 100]}
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
                <ModalForm 
                    toggleAdd={this.state.modalOpen}
                    toggleClose={this.toggleFormClose} 
                />
            </div>
        )
    }
}

const stateToProps = state => {
    return {

    }
}

const dispatchToProps = dispatch => {
    return {
        fetchPermission: (params) => dispatch(fetchPermission(params)),
    }
}

export default connect(stateToProps, dispatchToProps)(Permission);
