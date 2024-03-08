import React, {Component} from 'react';
import Certain from './modal/Certain';
import Range from './modal/Range';

class FilterDate extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
		
		this.selectOptions = [
			{ value: '', label: 'Semua' },
			{ value: 'range', label: 'Rentang Waktu' },
			{ value: 'certain', label: 'Waktu Tertentu' }
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
    return (
      <div>
				<select onChange={(e) => this.showModal(e)} value={this.state.optValue}>
					<option value="">Semua</option>
					<option value="range">Rentang Waktu</option>
					<option value="certain">Waktu Tertentu</option>
				</select >
				<Certain filterRange={this.filterRange} toggleClose={this.toggleClose} toggleOpen={this.state.certain} />
				<Range filterRange={this.filterRange} toggleClose={this.toggleClose} toggleOpen={this.state.range} />
			</div>
    );
  }
}

export default FilterDate;