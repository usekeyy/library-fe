import React, {Component} from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Button } from 'reactstrap';
import Checkbox from './Checkbox';
import { withTranslation } from 'react-i18next';


class FilterStatus extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
		this.handleChange = this.handleChange.bind(this);
	}
	
  state = {
		toggle: false,
		checkedItems: new Map(),
		checklist: []
  }

  componentDidMount(){
		this._isMounted = true;
    if(this._isMounted){

    }
	}
	
	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }

	toggleOpen = (e) => {
		this.setState({toggle: true})
	}

	toggleClose = (e) => {
		this.setState({toggle: false})
	}

	
  handleChange(e) {
    const item = e.target.name;
    const isChecked = e.target.checked;
    this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(item, isChecked) }));
  }

	handleFilter = () => {
		const arr = []
		new Map(this.state.checkedItems).forEach((val, key, map) => {
			if(val === true){
				arr.push(key)
			}
		})
		this.props.getStatus(arr)
		this.toggleClose();
		// this.setState({checklist: arr}, () => {this.props.getStatus(this.state.checklist)})
	}

	toggleReset = () => {
		this.props.statusSearch.map(item => this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(item.value, false) })))
	}
	
	toggleSelectAll = () => {
		this.props.statusSearch.map(item => this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(item.value, true) })) )
	}


  render(){
		let checkboxes;
		const {t} = this.props;
		if(this.state.toggle){
			checkboxes = this.props.statusSearch.map((item, i) => (
				<div key={i} className="checkbox checkbox-css">
					<Checkbox 
						name={item.value}
						id={"checkboxes"+i}
						checked={this.state.checkedItems.get(item.value)}
						type="checkbox"
						onChange={this.handleChange} />
					<label htmlFor={"checkboxes"+i}>{item.name}</label>
				</div>
			))
		}
    return (
      <div>
				<center>
					<Button onClick={(e) => this.toggleOpen(e)}> {t("common:Button.Cari Status")} </Button>
				</center>
				{this.state.toggle && <Modal isOpen={this.state.toggle} toggle={() => this.toggleClose()}>
						<ModalHeader toggle={() => this.toggleClose()}> {t("common:Button.Cari Status")} </ModalHeader>
						<ModalBody>
							{checkboxes}
						</ModalBody>
						<ModalFooter>
							<button type="button" className="btn btn-danger" onClick={() => this.toggleReset()}>Reset</button>
							<button type="button" className="btn btn-primary" onClick={() => this.toggleSelectAll()}> {t("common:Button.Pilih Semua")} </button>
							<button type="button" className="btn btn-success" onClick={() => this.handleFilter()}>Filter</button>
						</ModalFooter>
				</Modal>}
			</div>
    );
  }
}

export default withTranslation()(FilterStatus);