import React, {Component} from 'react';


class NumberFormat extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
		
	}
	
  state = {
		values: 0,
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

	updateNumber = (e) => {
    const val = e.target.value;
    // If the current value passes the validity test then apply that to state
    if (e.target.validity.valid) this.setState({values: e.target.value});
    // If the current val is just the negation sign, or it's been provided an empty string,
    // then apply that value to state - we still have to validate this input before processing
    // it to some other component or data structure, but it frees up our input the way a user
    // would expect to interact with this component
    else if (val === '' || val === '-') this.setState({values: val});
  }

  render(){
    return (
      <input
				value={this.state.values}
				type={this.props.type} 
				name={this.props.name} 
				className={(this.props.error) ? "form-control is-invalid" : "form-control"}
        onChange={this.updateNumber}
        pattern="^-?[0-9]\d*\.?\d*$"
       />
    );
  }
}

export default NumberFormat;