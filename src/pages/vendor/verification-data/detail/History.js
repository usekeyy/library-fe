import React, {Component} from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {toastr} from 'react-redux-toastr';
import {ModalBody} from 'reactstrap';
import ReactTablePagination from '../../../../components/paginations/ReactTablePagination';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';

class History extends Component {
    constructor(props) {
        super(props);
        this._isMounted = false;

        this.state = {
            data: [],
            options: {
                start: 0,
                length: 5,
                sorted_column: 1,
                order: 'asc',
                page: 0
            },
            loading: false,
            isConfirm: false,
            uuid: '',
            errors: [],
            total: 0,
            modalOpen: false,
            path: '',
            loadings: {
                modal: false
            }
        }
        this.defaultSorted = [
            {
                id: "created_at",
                desc: false
            }
        ];
        this.columns = [
            {
                Header: "Tanggal",
                id: "created_at",
                accessor: d => d.created_at
            }, {
                Header: "Status",
                id: "status",
                accessor: d => (d.status === 'y')
                    ? 'Setuju'
                    : 'Tolak'
            }, {
                Header: "Keterangan",
                id: "note",
                accessor: d => d.note
            }, {
                Header: "Diproses Oleh",
                id: "created_by_name",
                accessor: d => d.created_by_name
            }
        ];
    }

    componentDidMount = () => {
        this._isMounted = true;
        if (this._isMounted) {
            this.fetchData()
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback) => {
            return;
        };
    }

    asyncData = async (uuid, path) => {
        if (this._isMounted) {
            this.setState({loading: true})
            this
                .props
                .showLogHistory(uuid, path, this.state.options)
                .then((resp) => {
									this.setState({loading: false})
										// const {data} = resp.data
										let lengthPage = Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.options.length);
										this.setState({loading: false, total: lengthPage, data: resp.data})
                })
                .catch((resp) => {
                    this.setState({loading: false})
                    let message = (typeof resp !== 'undefined')
                        ? resp.data.message
                        : 'Something Wrong';
                    toastr.error(message);
                });
        }
    }

    fetchData = () => {
        this.asyncData(
            this.props.parentProps.vendor_uuid,
            this.props.parentProps.path,
            this.state.options
        )
    }

    changePage = (perPage) => {
        if (this._isMounted) {
            let lengthPage = Math.ceil(
                parseInt(this.state.data.recordsFiltered) / this.state.options.length
            );
            let optDt = {
                ...this.state.options
            }
            let numb = 0;
            numb = perPage;
            if (numb > 0) {
                numb = perPage * this.state.options.length;
            }
            optDt.start = numb;
            optDt.page = perPage;
            // optDt.length = state;
            this.setState({
                total: lengthPage,
                options: optDt
            }, () => this.fetchData());
        }
    }

    changePageSize = (length) => {
        if (this._isMounted) {
            let lengthPage = Math.ceil(
                parseInt(this.state.data.recordsFiltered) / this.state.options.length
            );
            let optDt = {
                ...this.state.options
            }
            optDt.start = 0;
            optDt.page = 0;
            optDt.length = length;
            this.setState({
                total: lengthPage,
                options: optDt
            }, () => this.fetchData());
            // console.log(this.state.options.start);
        }
    }

    changeSorted = (val) => {
        if (this._isMounted) {
            let optDt = {
                ...this.state.options
            }
            optDt.column = val[0].id;
            optDt.dir = (
                val[0].desc
                    ? 'desc'
                    : 'asc'
            );
            this.setState({
                options: optDt
            }, () => this.fetchData());
        }
    }

    render() {
        // const { t } = this.props;

        return (
            <div>
							<ModalBody>
								<Panel loading={false}>
									<PanelHeader> Log History </PanelHeader>
									<PanelBody loading={false}>
										<div className="row">
											<div className="col-md-12">
													<ReactTable
															columns={this.columns}
															filterable={false}
															loading={this.state.loading}
															manual="manual"
															minRows={1}
															PaginationComponent={ReactTablePagination}
															pageSizeOptions={[5, 10, 20, 30, 50]}
															recordsTotal={this.state.data.recordsTotal}
															recordsFiltered={this.state.data.recordsFiltered}
															data={this.state.data.data}
															defaultPageSize={5}
															defaultSorted={this.defaultSorted}
															pages={this.state.total}
                                                            page={this.state.options.page}
                                                            offResetFilter={true}
															onSortedChange={val => {
																	this.changeSorted(val)
															}}
															onPageSizeChange={(length) => {
																	this.changePageSize(length)
															}}
															onPageChange={(perPage) => {
																	this.changePage(perPage)
															}}
															className="-highlight"/>
											</div>
									</div>
									</PanelBody>
								</Panel>
							</ModalBody>
            </div>
        );
    }
}

export default History;