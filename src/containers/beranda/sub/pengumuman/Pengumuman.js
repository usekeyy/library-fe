import React, {Component} from 'react';
import {connect} from 'react-redux';
import { withTranslation } from 'react-i18next';
import 'react-table/react-table.css';
import { Col, Row } from 'reactstrap';
import { fetchAnnouncement } from '../../../../store/actions/master/announcementActions';
import { toastr } from 'react-redux-toastr';
import ReactLoading from 'react-loading';
import { formatDate } from '../../../../helpers/formatDate';
import ModalPengumuman from './ModalPengumuman';

class Pengumuman extends Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
        this.state = {
            data: [],
            params: {
                id: '',
                title: '',
                status: 'y',
                created_at: '',
                updated_at: '',
                start: 0,
                length: 0,
                column: '',
                dir: ''
            },
            loading : false,
            modal : false,
            uuid : ''
            // defaultPageSize: 10,
            // recordsFiltered: 0,
            // recordsTotal: 0,
            // pages: 0,
            // column: 1,
            // dir: '',
            // page: 0,
            // loading: false,
            // modalOpen: false,
            // isConfirm: false,
            // uuid: '',
            // isError: false,
            // errors: {},
            // loadingSubmit: false
        }
	}


  componentDidMount = () => {
		this._isMounted = true;
        this.asyncData()
		
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
        this.props.fetchAnnouncement(this.state.params)
            .then((resp) => {
                this.setState({
                    data: resp.data.data,
                    // pages: Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.params.length),
                    // recordsFiltered: resp.data.recordsFiltered,
                    // recordsTotal: resp.data.recordsTotal,
                    loading: false
                })
            })
            .catch((resp) => {
                this.setState({ loading: false })
                toastr.error(resp.data.status, resp.data.message);
            });
    }
    
    setModalOpen = (uuid) => {
        this.setState({uuid, modal : true})
    }

    setModalClose = () => {
        this.setState({modal : false})
    }
	
  render(){
		// const {t} = this.props;
        return (
            <div>
                {this.state.loading ? 
                    <center>
                    <br/>
                    <ReactLoading type="cylon" color="#0f9e3e" />

                    <br/>
                    </center> : 
                    <Row>
                        <Col sm="12">
                            {this.state.data.map((item,index) => {
                                return (
                                    <div key={index}>
                                        <p onClick={() => this.setModalOpen(item.uuid)} style={{cursor : 'pointer', fontSize : '14px', marginBottom : '5px'}}><b>{item.title}</b></p>
                                        <p style={{fontSize : '10px'}}>{formatDate(item.updated_at,2)}</p>
                                        <hr></hr>
                                    </div>
                                )
                            })}
                            
                        </Col>
                    </Row>
                }

                {
                    this.state.modal && 
                    <ModalPengumuman 
                        toggleAdd = {this.state.modal} 
                        toggleClose = {this.setModalClose}
                        uuid = {this.state.uuid}
                    />
                }
            </div>
        );
  }
}

const stateToProps = state => {
	return {

	}
}

const dispatchToProps = dispatch => {
	return {
        fetchAnnouncement: (params) => dispatch(fetchAnnouncement(params)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (Pengumuman));