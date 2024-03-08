import React, { Component } from 'react'
import { toastr } from 'react-redux-toastr'
import { showAanwijzingQuestion , storeAanwijzingQuestion , storeAanwijzingSummary , updateAanwijzingQuestion , deleteAanwijzingQuestion} from '../../../../store/actions/tendering/aanwijzingActions'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import ReactLoading from 'react-loading';
import { Panel, PanelBody } from './../../../../containers/layout/sub/panel/panel';
import Catatan from './Catatan';
import UserReplay from './UserReplay';
import { fileUpload } from '../../../../store/actions/uploadActions';
import { Modal, ModalHeader } from 'reactstrap';
import SweetAlert from 'react-bootstrap-sweetalert';

class TanyaJawab extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false;
        this.state = {
            loading: false,
            data: [],
            comment:"",
            attachment:"",
            reply_to:"",
            modalReply:false,
            dataModalReply:{
                attachment: "",
                comment: "",
                reply_to: "",
                uuid: "",
            },
            btnDisabledUserReply:false,
            isConfirm:false,
            uuidDeleteOrUpdate:''
        }
    }

    componentDidMount = () => {
        this._isMounted = true;
        if (this._isMounted) {
            this.getUUID()
        }
    }

    componentWillUnmount = () => {
        this._isMounted = false;
    }

    getUUID() {
        if (this._isMounted) {
            this.setState({ loading: true });
            this.props.showAanwijzingQuestion(this.props.aanwijzing_uuid,this.props.uuid)
                .then((resp) => {
                    let datas = resp.data.data;
                    this.setState(({ loading: false, data: datas }));
                })
                .catch((resp) => {
                    this.setState({ loading: false });
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    StoreMessage(payload) {
        if (this._isMounted) {
            this.setState({btnDisabledUserReply:true})
            let message = {
                uuid : this.props.uuid,
                comment : payload.note,
                attachment : payload.attachment,
                reply_to: payload.reply_to
            }
            this.props.storeAanwijzingQuestion(message)
            .then((resp) => {
                toastr.success("Success", resp.data.message)
                this.setState({modalReply:false,btnDisabledUserReply:false, uuidDeleteOrUpdate:""})
                this.getUUID()
            })
            .catch((resp) => {
                this.setState({btnDisabledUserReply:false})
                toastr.error(resp.data.status, resp.data.message);
            });
        }
    }

    updateAanwijzingQuestion (payload) {
        if(this._isMounted){
            this.setState({btnDisabledUserReply:true})
            this.props.updateAanwijzingQuestion(this.state.uuidDeleteOrUpdate,payload)
            .then((resp) => {
                toastr.success("Success", resp.data.message)
                this.setState({modalReply:false,btnDisabledUserReply:false, uuidDeleteOrUpdate:""})
                this.getUUID()
            })
            .catch((resp) => {
                this.setState({btnDisabledUserReply:false})
                toastr.error(resp.data.status, resp.data.message);
            });
        }
    }

    toggleOpenModalReply = (e,uuid ,asked, question,no) => {
        if (this._isMounted) {
        this.setState(({dataModalReply})=> ({ 
            modalReply : true,
            uuidDeleteOrUpdate:'',
            dataModalReply : {...dataModalReply, uuid:uuid, question:question, asked:asked, reply_to:no, comment:''}
        }))
        }
    }

    toggleEditModalReply = (e,uuid,comment) => {
        if (this._isMounted) {
        this.setState(({dataModalReply})=> ({ 
            modalReply : true,
            uuidDeleteOrUpdate:uuid,
            dataModalReply : {...dataModalReply, comment:comment}
        }))
        }
    }

    toggleCloseModalReply = (e) => {
        this.setState({modalReply:false})
        this.setState({uuidDeleteOrUpdate:''})
        e.preventDefault()
    }

    deletePayload = (id) => {
        this.props.deleteAanwijzingQuestion(id)
            .then((resp) => {
                toastr.success(resp.data.message);
                this.setState({ isConfirm: false , uuidDeleteOrUpdate:''});
                this.getUUID()
            })
            .catch((error) => {
                toastr.error("Delete Failed", error.message)
            })
    }

    toggleConfirm = (e, value) => {
        e.preventDefault();
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ isConfirm: true, uuidDeleteOrUpdate: uuid })
    }

    toggleSweetAlert(name) {
        switch (name) {
            case 'confirm':
                this.deletePayload(this.state.uuidDeleteOrUpdate)
                break;
            case 'cancel':
                this.setState({ isConfirm: false, uuidDeleteOrUpdate: '' });
                break;
            default:
                this.setState({ isConfirm: false, uuidDeleteOrUpdate: '' });
                break;
        }
    }

    render() {
        const { user , t,  end_date, status_aanwijzing} = this.props;
        const comment = this.state.data.coment;
        const openModal=(e,uuid,asked,question,no)=>{
            this.toggleOpenModalReply(e,uuid,asked,question,no)
        }

        const openEdit = (e,uuid,comment) => {
            this.toggleEditModalReply(e,uuid ,comment);
        }

        const openDelete = (e,value) => {
            this.toggleConfirm(e,value)
        }
      
        return (
            <div>
                {this.state.loading &&
                    <Panel>
                        <PanelBody ><center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>
                        </PanelBody>
                    </Panel>
                }
                {!this.state.loading &&
                    <div>
                        <div className="row">
                            <div className="col-sm-12">
                               {t("aanwijzing:label.list-qa")}
                            </div>
                            <div className="col-sm-12 m-t-5" >
                                <div className="table-responsive"  style={{width: '100%', height:'auto' , maxHeight: '250px', overflowY: 'scroll' }}>
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        {/* <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Vendor</th>
                                                <th>Message</th>
                                                <th>Tanggal</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead> */}
                                        
                                        <tbody>{
                                            this.state.data.coment!==undefined &&
                                                Object.keys(this.state.data.coment).map(function (key, index) {
                                                    return (
                                                        <tr key={key}>
                                                            <td>{comment[key].no}</td>
                                                            <td>{(comment[key].created_by===user.uuid) ? "Me" : comment[key].created_by_name}</td>
                                                            <td><textarea className="form-control" disabled style={{lineHeight:"1.5"}}>{comment[key].coment}</textarea></td>
                                                            <td>{(comment[key].created_at===null)? "":new Date(comment[key].created_at).toISOString().substring(0, 10)}</td>
                                                            <td>
                                                                {comment[key].attachment!==null && comment[key].attachment!=="" && <a className="" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/tendering/${comment[key].attachment}` } > <button className="btn btn-lime btn-xs m-r-5"><i className="fa fa-file"></i></button></a> }
                                                                {!(new Date(end_date) < new Date(localStorage.getItem("times"))) && status_aanwijzing !== "close" && comment[key].created_by!== user.uuid && Number.isInteger(comment[key].no) && user.has_roles.includes("BYR001") && <button className="btn btn-xs btn-lime" onClick={(e)=>openModal(e,comment[key].uuid,comment[key].created_by_name,comment[key].coment,comment[key].id )} ><i className="fa fa-reply"></i>Reply</button>}
                                                                {!(new Date(end_date) < new Date(localStorage.getItem("times"))) && status_aanwijzing !== "close" && comment[key].created_by===user.uuid && user.has_roles.includes("BYR001") && <button className="btn btn-xs btn-warning m-r-5" onClick={(e)=>openEdit(e,comment[key].uuid, comment[key].coment)}><i className="fa fa-edit"></i></button>}
                                                                {!(new Date(end_date) < new Date(localStorage.getItem("times"))) && status_aanwijzing !== "close" && comment[key].created_by===user.uuid && user.has_roles.includes("BYR001") && <button className="btn btn-xs btn-danger m-r-5" onClick={(e)=>openDelete(e,comment[key].uuid)}><i className="fa fa-trash"></i></button>}
                                                            </td>                    
                                                        </tr>
                                                    )
                                                })
                                            
                                        }</tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                <Catatan 
                                store = {(payload) =>this.StoreMessage(payload)}
                                storeAanwijzingSummary={this.props.storeAanwijzingSummary}
                                upload={this.props.fileUpload}
                                user={this.props.user}
                                status_aanwijzing={this.props.status_aanwijzing}                                
                                end_date={this.props.end_date}                                
                                />
                            </div>
                        </div>
                    </div>
                }

                
                <Modal isOpen={this.state.modalReply} toggle={(e) => this.toggleCloseModalReply(e)}>
                    <ModalHeader toggle={(e) => this.toggleCloseModalReply(e)}>Modal User Reply</ModalHeader>
                    <UserReplay
                    toggleClose={(e) => this.toggleCloseModalReply(e)}
                    data={this.state.dataModalReply}
                    upload={this.props.fileUpload}
                    store = {(payload) =>this.StoreMessage(payload)}
                    update = {(payload) =>this.updateAanwijzingQuestion(payload)}
                    uuidDeleteOrUpdate={this.state.uuidDeleteOrUpdate}
                    btnDisabled={this.state.btnDisabledUserReply}
                    />
                </Modal>
    

                <SweetAlert
                    warning
                    show={this.state.isConfirm}
                    showCancel
                    confirmBtnText={t("common:delete.approve-delete")}
                    cancelBtnText={t("common:delete.cancel")}
                    confirmBtnBsStyle="danger"
                    cancelBtnBsStyle="default"
                    title={t("common:delete.title-delete")}
                    onConfirm={() => this.toggleSweetAlert('confirm')}
                    onCancel={() => this.toggleSweetAlert('cancel')}
                />
            </div>
        );
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
        fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
        showAanwijzingQuestion: (aanwijzing_uuid,id) => dispatch(showAanwijzingQuestion(aanwijzing_uuid,id)),
        storeAanwijzingSummary: (id,payload) => dispatch(storeAanwijzingSummary(id,payload)),
        updateAanwijzingQuestion: (id,payload) => dispatch(updateAanwijzingQuestion(id,payload)),
        storeAanwijzingQuestion: (payload) => dispatch(storeAanwijzingQuestion(payload)),
        deleteAanwijzingQuestion: (id) => dispatch(deleteAanwijzingQuestion(id)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(TanyaJawab));
