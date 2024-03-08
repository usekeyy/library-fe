import React, { Component } from 'react'
import { connect } from 'react-redux';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import { withTranslation } from 'react-i18next';
import ReactLoading from 'react-loading';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { formatDate } from '../../../../helpers/formatDate';

export class JadwalAanwijzing extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false;
        this.onInputChangeStartDate = this.onInputChangeStartDate.bind(this)
        this.onInputChangeEndDate = this.onInputChangeEndDate.bind(this)
        this.state = {
            start_date: '',
            end_date: '',
            data_jadwal_submit: {
                start_date: '',
                start_time: '',
                end_date: '',
                end_time: '',
            },
        }
    }

    formattingDate(e) {
        let d = new Date(e),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [year, month, day].join('-');
    }

    formattingTime(e) {
        let time = new Date(e).toTimeString()
        return time.split(' ')[0]
    }

    componentDidMount = () => {
        this._isMounted = true;
    }

    componentWillUnmount = () => {
        this._isMounted = false;
    }

	onInputChangeStartDate = (date) => {
        let data_jadwal_submit = { ...this.state.data_jadwal_submit };
        data_jadwal_submit.start_date = this.formattingDate(date);
        data_jadwal_submit.start_time = this.formattingTime(date);
        this.setState({ data_jadwal_submit, start_date: date });
	};

	onInputChangeEndDate = (date) => {
        let data_jadwal_submit = { ...this.state.data_jadwal_submit };
        data_jadwal_submit.end_date = this.formattingDate(date);
        data_jadwal_submit.end_time = this.formattingTime(date);
        this.setState({ data_jadwal_submit, end_date: date });
	};

    update_date = (e) => {
        this.props.update(this.state.data_jadwal_submit)
        e.preventDefault()
	}

    render() {
        return (
            <div>
                {this.state.loading &&
                    <Panel>
                        <PanelBody ><center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>
                        </PanelBody>
                    </Panel>
                }
                { !this.state.loading &&
                    <Panel className="margin-bot-false">
                        
                        <PanelHeader>Jadwal Aanwijzing</PanelHeader>
                        <PanelBody >
                            <div className="row">
                                <div className="col-sm-12">
                                    
                                    <div className="row">
                                        <div className="col-md-5">
                                            <div className="form-group row">
                                                <div className="col-md-2 pull-right" style={{margin:'auto'}}>Start Date</div>
                                                <div className="col-md-10">
                                                    <Datetime
                                                        value={this.state.start_date}
                                                        onChange={this.onInputChangeStartDate}
                                                        dateFormat="DD-MM-YYYY"
                                                        timeFormat={true}
                                                        inputProps={{ placeholder: "Start Date" }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-5">
                                            <div className="form-group row">
                                                <div className="col-md-2 pull-right" style={{margin:'auto'}}>End Date</div>
                                                <div className="col-md-10">
                                                    <Datetime
                                                        value={this.state.end_date}
                                                        onChange={this.onInputChangeEndDate}
                                                        dateFormat="DD-MM-YYYY"
                                                        timeFormat={true}
                                                        inputProps={{ placeholder: "End Date" }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <button className="btn btn-white" onClick={(e) => this.update_date(e)}>Update</button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* {(this.props.errors.start_date || this.props.errors.end_date || this.props.errors.start_time || this.props.errors.end_time) && <span className="text-danger">* This field is required</span>} */}
                                    {this.props.errors.start_date && <span className="text-danger">* {this.props.errors.start_date[0]} <br></br></span> }
                                    {this.props.errors.end_date && <span className="text-danger">* {this.props.errors.end_date[0]} <br></br></span> }
                                    {this.props.errors.start_time && <span className="text-danger">* {this.props.errors.start_time[0]} <br></br></span> }
                                    {this.props.errors.end_time && <span className="text-danger">* {this.props.errors.end_time[0]} <br></br></span> }
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-striped table-sm text-nowrap">
                                            <thead>
                                                <tr>
                                                    <th>Title</th>
                                                    <th>Start Date</th>
                                                    <th>Start Time</th>
                                                    <th>End Date</th>
                                                    <th>End Time</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Aanwijzing</td>
                                                    <td>{formatDate(this.props.data.start_date, false)}</td>
                                                    <td>{this.props.data.start_time}</td>
                                                    <td>{formatDate(this.props.data.end_date, false)}</td>
                                                    <td>{this.props.data.end_time}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </PanelBody>
                    </Panel>
                }
            </div>
        )
    }
}

export default connect()(withTranslation()(JadwalAanwijzing));
