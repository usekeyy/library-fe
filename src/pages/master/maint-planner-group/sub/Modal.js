import React, {Component} from 'react';
import {toastr} from 'react-redux-toastr';
import { Modal, ModalHeader } from 'reactstrap';
import Form from './Form';
import ReactLoading from 'react-loading';
import { withTranslation } from 'react-i18next';

class ModalForm extends Component {
	constructor(props) {
    super(props);
    this._isMounted = false;
	}
	
  state = {
    sendDt: {
			id: '',
			name: '',
			code: '',
			plant_id: '',
    },
    m_plant: [],
    loadings: {
      plant: false
    },
    select_params: {
      start: 0,
      length: 10,
    },
    loading: false
  }

  componentDidMount(){
		this._isMounted = true;
    if(this._isMounted){
      this.showPlants();
      if(this.props.uuid !== ''){
        this.showByUUID(this.props.uuid);
      }
    }
	}
	
	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }
  
  handleChange(e){
		if(this._isMounted){
			let sendDt = {...this.state.sendDt}
      sendDt[e.target.id] = e.target.value;
      this.setState({ sendDt })
		}
  }
  
  handleSave = (payload) => {
		if(this._isMounted){
      this.setOption(payload);
      if(this.props.uuid !== ""){
        this.props.update(this.state.sendDt, this.props.uuid);
      } else {
        this.props.save(this.state.sendDt);
      }
    }
  }

  toggleClose = () => {
    this.props.toggleClose()
  }

  resetForm = () => {
    let sendDt = {...this.state.sendDt}
    sendDt.name = '';
    this.setState({ sendDt })
  }

  showByUUID = (id) => {
    if(this._isMounted){
      this.setState({loading: true})
      this.props.showMaintPlannerGroup(id)
      .then((resp) => {
        let data = resp.data.data;
        let sendDt = {...this.state.sendDt}
        sendDt.id = data.id;
        sendDt.name = data.name;
        sendDt.code = data.code;
        sendDt.plant_id = {value: data.plant_id, label: data.plant_id+' - '+data.plant_name};
        this.setState({sendDt, loading: false})
      })
      .catch((resp) => {
        this.setState({loading: false})
        toastr.error(resp.data.message);
      });
    }
  }

  showPlants = (newValue) => {
    if(this._isMounted){
      let select_params = (newValue !== '') ? {start: 0, length: 10, select: newValue} : this.state.select_params;
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, plant: true }
      }));
      this.props.fetchPlant(select_params)
      .then((resp) => {
        let m_plant = resp.data.data;
        let options = m_plant.map((dt) => {
          return { value: dt.id, label: dt.id+' - '+dt.name };
        })
        this.setState(({ loadings }) => ({
          m_plant: options,
          loadings: { ...loadings, plant: false }
        }));
      })
      .catch((resp) => {
        this.setState(({ loadings }) => ({
          loadings: { ...loadings, plant: false }
        }));
        toastr.error(resp.data.message);
      });
    }
  }

  setOption(payload){
    let sendDt = {...this.state.sendDt}
    sendDt.id = payload.id;
    sendDt.code = payload.code;
    sendDt.name = payload.name;
    sendDt.plant_id = payload.plant_id.value;
    this.setState({sendDt})
  }
	
  render(){
    const {t} = this.props;
    return (
      <div>
				<Modal isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()}>
					<ModalHeader toggle={() => this.toggleClose()}>
            {this.props.uuid !== "" ? t('maintPlannerGroup:modal.title-update') : t('maintPlannerGroup:modal.title-create') }
          </ModalHeader>
          {this.state.loading && (
            <center>
              <br/>
              <ReactLoading type="cylon" color="#0f9e3e" />
              <br/>
            </center>
          )}
          {this.state.loading === false && 
            <Form
            handleInputChange={this.showPlants}
            m_plant={this.state.m_plant}
            loadings={this.state.loadings}
            loading={this.props.loading}
            errors={this.props.errors}
						toggleClose={this.toggleClose}
						save={(payload) => this.handleSave(payload)}
            data={this.state.sendDt}
            uuid={this.props.uuid}
					/>
          }
				</Modal>
			</div>
    );
  }
}

export default withTranslation() (ModalForm);