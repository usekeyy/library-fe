import React, {Component} from 'react';
import {toastr} from 'react-redux-toastr';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import ReactLoading from 'react-loading';
import { withTranslation } from 'react-i18next';
import { showAnnouncement } from '../../../../store/actions/master/announcementActions';
import { connect } from 'react-redux';
import { formatDate } from '../../../../helpers/formatDate';

class ModalPengumuman extends Component {
	constructor(props) {
        super(props);
        this._isMounted = false;
        this.state = {
            data : '',
            loading: false
        }
	}
	
  

    componentDidMount(){
		this._isMounted = true;
        if(this._isMounted){
            this.fetchData()
        }
	}
	
	componentWillUnmount() {
        this._isMounted = false;
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }
  

  toggleClose = () => {
    this.props.toggleClose()
  }


  fetchData = () => {
    if(this._isMounted){
      this.setState({loading: true})
      this.props.showAnnouncement(this.props.uuid)
      .then((resp) => {
        let data = resp.data.data;
        this.setState({data, loading: false})
      })
      .catch((resp) => {
        this.setState({loading: false})
        toastr.error(resp.data.message);
      });
    }
  }
	
  render(){
    // const {t} = this.props;
    return (
        <div>
            <Modal size="lg" isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()} centered>
                <ModalHeader toggle={() => this.toggleClose()}>
                  {this.state.data.title}
                </ModalHeader>

                <ModalBody>
                {this.state.loading ? 
                  <center>
                  <br/>
                  <ReactLoading type="cylon" color="#0f9e3e" />

                  <br/>
                  </center> :
                  <div>
                    {/* <h4></h4> */}
                    <p>{formatDate(this.state.data.updated_at,2)}</p>
                    {/* <hr></hr> */}
                    <div dangerouslySetInnerHTML={{__html: this.state.data.content}} />
                  </div>
                }
                </ModalBody>
            
			      </Modal>
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
        showAnnouncement: (id) => dispatch(showAnnouncement(id)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (ModalPengumuman));