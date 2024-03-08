import React, { Component } from 'react'
import { connect } from 'react-redux';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import { withTranslation } from 'react-i18next';
import ReactLoading from 'react-loading';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import moment from 'moment';

export class PraQualificationDate extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false;
        this.onInputChangeStartDate = this.onInputChangeStartDate.bind(this)
        this.onInputChangeEndDate = this.onInputChangeEndDate.bind(this)
        this.state = {
            pq_start_date: '',
            pq_end_date: '',
            data_jadwal_submit: {
                pq_start_date: '',
                pq_start_time: '',
                pq_end_date: '',
                pq_end_time: '',
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
        data_jadwal_submit.pq_start_date = this.formattingDate(date);
        data_jadwal_submit.pq_start_time = this.formattingTime(date);
        this.setState({ data_jadwal_submit, pq_start_date: date });
	};

	onInputChangeEndDate = (date) => {
        let data_jadwal_submit = { ...this.state.data_jadwal_submit };
        data_jadwal_submit.pq_end_date = this.formattingDate(date);
        data_jadwal_submit.pq_end_time = this.formattingTime(date);
        this.setState({ data_jadwal_submit, pq_end_date: date });
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
                        
                        <PanelHeader>{this.props.role_vendor ? 'Pra Qualification Date ' : 'Jadwal Pra Qualification' }</PanelHeader>
                        <PanelBody >
                            <div className="row">
                                <div className="col-sm-12">
                                    
                                    {this.props.created_by === this.props.uuid && this.props.status === 'd' &&
                                        <div className="row">
                                            <div className="col-md-5">
                                                <div className="form-group row">
                                                    <div className="col-md-2 pull-right" style={{margin:'auto'}}>Start Date</div>
                                                    <div className="col-md-10">
                                                        <Datetime
                                                            value={this.state.pq_start_date}
                                                            onChange={this.onInputChangeStartDate}
                                                            dateFormat="DD-MM-YYYY"
                                                            timeFormat="HH:mm:ss"
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
                                                            value={this.state.pq_end_date}
                                                            onChange={this.onInputChangeEndDate}
                                                            dateFormat="DD-MM-YYYY"
                                                            timeFormat="HH:mm:ss"
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
                                    }
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-striped table-sm text-nowrap">
                                            <thead>
                                                <tr>
                                                    <th>Process</th>
                                                    <th>Start Date</th>
                                                    <th>Start Time</th>
                                                    <th>End Date</th>
                                                    <th>End Time</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Pra Qualification</td>
                                                    <td>{this.props.data.pq_start_date !== null && this.props.data.pq_start_date !== '' ? moment(this.props.data.pq_start_date).format("DD-MM-YYYY") : ''}</td>
                                                    <td>{this.props.data.pq_start_time}</td>
                                                    <td>{this.props.data.pq_end_date !== null && this.props.data.pq_end_date !== '' ? moment(this.props.data.pq_end_date).format("DD-MM-YYYY") : ''}</td>
                                                    <td>{this.props.data.pq_end_time}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </PanelBody>
                    </Panel>                }
            </div>
        )
    }
}

export default connect()(withTranslation()(PraQualificationDate));
