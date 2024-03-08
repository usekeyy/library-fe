import React, { Component } from "react";
import TablePengajuan from "./TablePengajuan";

class Form extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      loading: false,
      vendor_info: {
        id: "",
        name: "",
        sap_code: "",
      },
    };
  }

  componentDidMount = () => {
    this._isMounted = true;
  };

  componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }

  setLoading = (type) => {
    this.setState({ loading: type }, () => {
      this.props.setLoading(type);
    });
  };

  render() {
    return (
      <div>
        <TablePengajuan
          loadings={this.props.loadings}
          errors={this.props.errors}
          company_id={this.props.company_id}
          fetchDataVendor={this.props.fetchDataVendor}
          showExtendCompany={this.props.showExtendCompany}
          save={this.props.handleSave}
          close={this.props.close}
          t={this.props.t}
          setLoading={this.setLoading}
        />
      </div>
    );
  }
}

export default Form;
