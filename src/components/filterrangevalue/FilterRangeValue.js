import React, {Component} from 'react';
import { withTranslation } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import Certain from './modal/Certain';
import Range from './modal/Range';


class FilterRangeValue extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
		
		this.selectOptions = [
			{ value: '', label: this.props.t("common:filter-range.all") },
			{ value: 'range', label:  this.props.t("common:filter-range.range")},
			{ value: 'certain', label:  this.props.t("common:filter-range.value") }
		];
	}
	
  state = {
		range: false,
		certain: false,
		optValue: ''
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
	
	toggleClose = () => {
		this.setState({certain: false, range: false})
	}
	
	showModal = (event) => {
		const type = event.target.value;
		this.setState({optValue: type})
		if(this._isMounted){
			if(type !== ""){
				switch (type) {
					case 'range': this.setState({range: true, certain: false}) 
					break;
					case 'certain': this.setState({range: false, certain: true}) 
					break;
					default: this.setState({range: false, certain: false})
				}
			} else {
				this.setState({range: false, certain: false})
				this.props.getDate()
			}
		}
	}

	filterRange = (e, data) => {
		e.preventDefault();
		let getDt;
		data['name'] = this.props.type;
		data['dateType'] = this.state.optValue;
		if(data.dateType==="range"){
			if(parseFloat(data.from) > parseFloat(data.to)){
				toastr.warning(this.props.t("common:range-from-grather-then-range-to"));
				return;	
			}
		}
		switch (data.dateType) {
			case 'range': getDt = data.from+';'+data.to; 
			break;
			case 'certain': getDt = data.certain; 
			break;
			default: getDt = '';
		}
		this.props.getDate(getDt)
		this.toggleClose()
	}

  render(){
	const {t} = this.props
    return (
      <div>
				<select onChange={(e) => this.showModal(e)} value={this.state.optValue}>
					<option value="">{t("common:filter-range.all")}</option>
					<option value="range">{t("common:filter-range.range")}</option>
					<option value="certain">{t("common:filter-range.value")}</option>
				</select >
				<Certain filterRange={this.filterRange} toggleClose={this.toggleClose} toggleOpen={this.state.certain} />
				<Range filterRange={this.filterRange} toggleClose={this.toggleClose} toggleOpen={this.state.range} />
			</div>
    );
  }
}

export default(withTranslation()(FilterRangeValue));