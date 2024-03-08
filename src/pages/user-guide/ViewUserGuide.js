import React, { Component } from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import "react-table/react-table.css";
import { withTranslation } from "react-i18next";
import { showUserGuidePublic } from "../../store/actions/master/userGuideActions";
import {
  Panel,
  PanelHeader,
  PanelBody,
} from "../../containers/layout/sub/panel/panel";

class ViewUserGuide extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
  }

  state = {
    data: [],
    errors: [],
    total: 0,
    isConfirm: false,
    uuid: "",
    toggleAdd: false,
    loading: true,
  };

  componentDidMount = () => {
    this._isMounted = true;
    this.getUUID();
  };

  componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }

  getUUID() {
      if (this._isMounted) {
          this.setState({ loading: true });
          this.props.showUserGuidePublic(this.props.match.params.id)
              .then((resp) => {
                  let datas = resp.data.data;
                  this.setState(({ loading: false, data : datas}));
              })
              .catch((resp) => {
                  this.setState({ loading: false });
                  toastr.error(resp.data.status, resp.data.message);
              });
      }
  }

  render() {
    const { t } = this.props;
    return (
      <div>
        <ol className="breadcrumb float-xl-right">
          <li className="breadcrumb-item">Home</li>
          <li className="breadcrumb-item">Master Data</li>
          <li className="breadcrumb-item active">{t("userguide:title")}</li>
        </ol>
        <h1 className="page-header">{t("userguide:title")}</h1>
        <Panel loading={false}>
          <PanelHeader>{t("userguide:table-title")}</PanelHeader>
          <PanelBody loading={false}>
              <div className="col-sm-12">
                    {!this.state.loading && 
                        <iframe id="load_pdf" title="user-guide" width="100%" height="800px" src={`${process.env.REACT_APP_API_BASE_URL}files/user_guide_docs/${this.state.data.path}` }>
                        </iframe>
                    }
            </div>
          </PanelBody>
        </Panel>
      </div>
    );
  }
}

const stateToProps = (state) => {
  return {
    sidebarDt: state.sidebarDt,
    access: state.sidebarDt.access,
    user: state.auth.user.data,
  };
};

const dispatchToProps = (dispatch) => {
  return {
    showUserGuidePublic : (id) => dispatch(showUserGuidePublic(id))
  };
};

export default connect(
  stateToProps,
  dispatchToProps
)(withTranslation()(ViewUserGuide));
