import React, { Component } from 'react'
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
// import SweetAlert from 'react-bootstrap-sweetalert';
import 'react-table/react-table.css';
import { withTranslation } from 'react-i18next';
import {  Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from './../../../containers/layout/sub/panel/panel';
import { fetchAssignTask, fetchUserAssignTask, saveAssignTaskDelegation } from '../../../store/actions/taskActions';
import {fetchUsers} from '../../../store/actions/utility/usersActions';
// import ModalForm from './sub/Modal'
// import ReactTablePagination from '../../../components/paginations/ReactTablePagination';
// import FilterStatus from '../../../components/filterstatus/FilterStatus';
// import FilterDate from '../../../components/filterdate/FilterDate';
// import { statusName } from '../../../helpers/statusName';
// import { formatDate } from '../../../helpers/formatDate';
import {debounce} from '../../../helpers/debounce';

import Form from './sub/Form'
// import { useParams } from 'react-router-dom';
import TableTask from './sub/TableTask';

class TaskDelegation extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            dataTask: [],
            dataUser : [],
            dataUserAssign : [],
            dataPayloadTask : [],
            dataPayloadFromUser : '',
            dataPayloadToUser : '',
            showTask : false,
            modalOpen: false,
            isConfirm: false,
            uuid: '',
            isError: false,
            errors: {},
            loadingSubmit: false,
            loadings: {
                chart_of_account: false
            },
            loadingUser : false,
            loadingUserAssign : false,
            loadingTask : false,
            loadingSubmit : false
        }
        this.defaultSorted = [
            {
                id: "id",
                desc: false
            }
        ];
    }
    componentDidMount = () => {
        this._isMounted = true;
        this.fetchUser()
    }

    componentWillUnmount() {
        this._isMounted = false;
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback) => {
            return;
        };
    }

    fetchUserDebounced = debounce(text => this.fetchUser(text))

    fetchUser = async (payload={}) => {
        this.setState({ loadingUser: true })

        const params = {...payload, start : 0, length : 10}
        this.props.fetchUsers(params)
            .then((resp) => {
                const user = resp.data.data && resp.data.data.map((data)=>{
                    return {
                        label : data.name,
                        value : data.uuid
                    }
                })
                this.setState({
                    dataUser: user,
                    loadingUser: false
                })
            })
            .catch((resp) => {
                this.setState({ loadingUser: false })
                toastr.error(resp.data.status, resp.data.message);
            });
    }

    fetchUserAssignDebounced = debounce(text => this.fetchUserAssign(text))

    fetchUserAssign = async (payload={}) => {
        this.setState({ loadingUserAssign: true })

        // const params = {...payload, start : 0, length : 10}
        this.props.fetchUserAssignTask(payload)
            .then((resp) => {
                console.log(resp.data.data)
                const user = resp.data.data && resp.data.data.map((data)=>{
                    return {
                        label : data.name,
                        value : data.uuid
                    }
                })
                this.setState({
                    dataUserAssign: user,
                    loadingUserAssign: false
                })
            })
            .catch((resp) => {
                this.setState({ loadingUserAssign: false })
                toastr.error(resp.data.status, resp.data.message);
            });
    }

    fetchTask = async (params) => {
        this.setState({ loadingTask: true })

        // const params = {...payload, start : 0, length : 10}
        this.props.fetchAssignTask(params)
            .then((resp) => {
                this.setState({
                    dataTask: resp.data.data,
                    loadingTask: false
                })
            })
            .catch((resp) => {
                this.setState({ loadingTask: false })
                toastr.error(resp.data.status, resp.data.message);
            });
    }

    saveAssignTask = async () => {
        console.log(this.state)
        if(!this.state.dataPayloadFromUser){
            toastr.error("Form User Harus Diisi");
        }else if(!this.state.dataPayloadToUser){
            toastr.error("Assign User Harus Diisi");
        }else if(this.state.dataPayloadTask.length === 0){
            toastr.error("Pilih Task Terlebih Dahulu");
        }else{
            // this.setState({ loadingSubmit: true })
    
            const payload = {
                from_uuid : this.state.dataPayloadFromUser,
                to_uuid : this.state.dataPayloadToUser,
                task_id : this.state.dataPayloadTask
            }
            console.log(payload)
            // this.props.saveAssignTaskDelegation(payload)
            //     .then((resp) => {
            //         toastr.success(resp.data.message);
            //         this.setState({
            //             loadingSubmit: false
            //         })
            //         window.location.reload()
            //     })
            //     .catch((resp) => {
            //         this.setState({ loadingSubmit: false })
            //         toastr.error(resp.data.status, resp.data.message);
            //     });
        }
    }

    setShowTask = (value, params={}) => {
        if(value){
            this.fetchTask(params)
        }
        this.setState({showTask : value})
    }

    setStatePayload = (label, value) => {
        switch (label) {
            case 'fromUser':
                this.setState({dataPayloadFromUser : value})
                break;
            case 'toUser':
                this.setState({dataPayloadToUser : value})
                break;
            default:
                break;
        }
    }

    setPayloadAssignTask = (flag, data) => {
        if(flag){
            if(this.state.dataPayloadTask.includes(data)){
                const datas = this.state.dataPayloadTask.filter(datax => datax !== data)
                this.setState({dataPayloadTask : datas})
            }else{
                this.setState({dataPayloadTask : [...this.state.dataPayloadTask, data]})
            }
        }else{
            this.setState({dataPayloadTask : []})
        }
    }

    render() {
        // const { t } = this.props;
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">Task</li>
                    <li className="breadcrumb-item active">Task Delegation</li>
                </ol>
                <h1 className="page-header">Task Delegation</h1>
                <Panel loading={false}>
                    <PanelHeader>
                        Task Delegation
					</PanelHeader>
                    <PanelBody loading={false}>
                        <Row>
                            <Col sm="10">
                                <Form 
                                    parentState = {this.state} 
                                    fetchUser = {this.fetchUserDebounced}
                                    fetchUserAssign = {this.fetchUserAssignDebounced}
                                    fetchTask = {this.fetchTask}
                                    setShowTask = {this.setShowTask}
                                    setPropsState = {this.setStatePayload}
                                    setPayloadAssignTask = {this.setPayloadAssignTask}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12">
                                {this.state.showTask &&
                                    <TableTask 
                                        data={this.state.dataTask} 
                                        loading={this.state.loadingTask}
                                        setPayloadAssignTask = {this.setPayloadAssignTask}
                                    />
                                }
                            </Col>
                        </Row>
                        <Row className='mt-4'>
                            <Col sm="10"></Col>
                            {this.state.showTask && this.state.dataTask.length > 0 &&
                            <Col sm="2" className='float-right'>
                                <button className="btn btn-success" onClick={this.saveAssignTask} disabled={this.state.loadingSubmit}>
                                    {this.state.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : "Submit"}
                                </button>
                            </Col>
                            }
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
        access: state.sidebarDt.access
    }
}

const dispatchToProps = dispatch => {
    return {
        fetchUsers: (params) => dispatch(fetchUsers(params)),
        fetchAssignTask: (params) => dispatch(fetchAssignTask(params)),
        fetchUserAssignTask: (params) => dispatch(fetchUserAssignTask(params)),
        saveAssignTaskDelegation: (payload) => dispatch(saveAssignTaskDelegation(payload))
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(TaskDelegation))