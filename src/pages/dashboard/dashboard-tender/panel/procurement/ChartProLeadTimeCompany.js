import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';

import Chart from "react-apexcharts";

import ReactLoading from 'react-loading';

import { getTenderProcurementSavingChart, getProcurementSavingPerCompany } from '../../../../../store/actions/dashboard/dashboardTenderAction';
// import { Controller } from 'react-hook-form';
// import makeAnimated from 'react-select/animated';
// import Select from 'react-select';
// import { formatNumber } from '../../../../../helpers/formatNumber';

// const animatedComponents = makeAnimated();
class ChartProLeadTimeCompany extends Component {
    constructor(props) {
        super(props)
        // console.log(this.props)
        this._isMounted = false
        this.state = {
            loading : false,
            total_saving : {},
            series: [{
                name: 'Actual',
                type : 'column',
                data: [15,35,40,50]
              }, {
                name: 'KPI',
                type: 'column',
                data: [20, 30, 60, 60],
                dataLabels : true
              }],
            options: {
                chart: {
                  height: 350,
                  type : 'line',
                  stacked: false,
                  toolbar: {
                    show: true
                  },
                  zoom: {
                    enabled: true
                  },
                //   foreColor: '#1f2225'
                },
                responsive: [{
                  breakpoint: 480,
                  options: {
                    legend: {
                      position: 'bottom',
                      offsetX: -10,
                      offsetY: 0
                    }
                  }
                }],
                plotOptions: {
                  bar: {
                    columnWidth: '50%'
                  },
                },
                dataLabels: {
                    enabled : true,
                    enabledOnSeries : [0,1],
                    formatter: function (val) {
                      return val;
                    },
                    style: {
                      fontSize: '12px',
                      colors: ["#FFF"]
                    }
                },
                xaxis: {
                  type: 'text',
                  categories: ['TL', 'PL', 'ST', 'SU'],
                  // categories: [],
                  title: {
                    text: 'Procurement Method'
                  }
                },
                yaxis: {
                  title: {
                    text: 'Number of Days'
                  }
                },
                legend: {
                  position: 'bottom',
                //   offsetY: 40
                },
                fill: {
                //   opacity: [0.85, 0.25, 1],
                  gradient: {
                    inverseColors: false,
                    shade: 'light',
                    type: "vertical",
                    opacityFrom: 0.85,
                    opacityTo: 0.55,
                    stops: [0, 100, 100, 100]
                  }
                },
                // colors: ['#1aa3ff'],
                title: {
                    text: "Lead Time - Procurement Method",
                    align: 'center',
                    margin: 10,
                    offsetX: 0,
                    offsetY: 0,
                    floating: false,
                    style: {
                      fontSize:  '18px',
                      fontWeight:  'bold',
                      fontFamily:  undefined,
                      color:  '#263238'
                    },
                }
            },
            line : {
                series: [
                    {
                      name: "TL",
                      data: [28, 29, 33, 36, 32, 32, 33, null, null, null, null, null]
                    },
                    {
                      name: "PL",
                      data: [12, 11, 14, 18, 17, 13, 13, null, null, null, null, null]
                    },
                    {
                        name: "ST",
                        data: [9, 15, 24, 28, 7, 11, 9, null, null, null, null, null]
                    },
                    {
                        name: "SU",
                        data: [8, 16, 11, 19, 2, 23, 4, null, null, null, null, null]
                    }
                  ],
                  options: {
                    chart: {
                      height: 350,
                      type: 'line',
                      dropShadow: {
                        enabled: true,
                        color: '#000',
                        top: 18,
                        left: 7,
                        blur: 10,
                        opacity: 0.2
                      },
                      toolbar: {
                        show: false
                      }
                    },
                    colors: ['#77B6EA', '#545454', '#9d0dd1', '#0ceb22'],
                    dataLabels: {
                      enabled: true,
                    },
                    stroke: {
                      curve: 'smooth'
                    },
                    title: {
                      text: 'Monthly Lead Time - Procurement Method',
                      align: 'left'
                    },
                    grid: {
                      borderColor: '#e7e7e7',
                      row: {
                        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                        opacity: 0.5
                      },
                    },
                    markers: {
                      size: 1
                    },
                    xaxis: {
                      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'],
                      title: {
                        text: 'Month'
                      }
                    },
                    yaxis: {
                      title: {
                        text: 'Value (million)'
                      },
                      min: 5,
                      max: 40
                    },
                    legend: {
                      position: 'bottom',
                    //   horizontalAlign: 'center',
                    //   offsetY: 40,
                    // //   offsetX: -5
                    }
                  },
            },
            pie : {
                series: [60, 40],
                options: {
                    labels: ['', 'Lead Time'],
                    legend: {
                        show : false
                    },
                    colors: ['#dce3dd', '#0ec428'],
                    dataLabels: {
                        enabled: false
                    },
                    chart: {
                        type: 'donut',
                    },
                    responsive: [{
                        breakpoint: 480,
                        options: {
                            chart: {
                                width: 200
                            },
                        }
                    }],
                    plotOptions: {
                        pie: {
                          donut: {
                            labels: {
                              show: true,
                              total: {
                                show: true,
                                showAlways: true,
                                label: 'Lead Time',
                                fontSize: '22px',
                                fontFamily: 'Helvetica, Arial, sans-serif',
                                fontWeight: 600,
                                color: '#373d3f',
                                formatter: function (w) {
                                  return `40%`
                                }
                              }
                            }
                          }
                        }
                      }
                },
            },
            line2 : {
                series: [
                    {
                      name: "Saving",
                      data: [8, 19, 23, 16, 22, 32, 3, null, null, null, null, null]
                    }
                  ],
                  options: {
                    chart: {
                      height: 350,
                      type: 'line',
                      dropShadow: {
                        enabled: true,
                        color: '#000',
                        top: 18,
                        left: 7,
                        blur: 10,
                        opacity: 0.2
                      },
                      toolbar: {
                        show: false
                      }
                    },
                    colors: ['#77B6EA', '#545454', '#9d0dd1', '#0ceb22'],
                    dataLabels: {
                      enabled: true,
                    },
                    stroke: {
                      curve: 'smooth'
                    },
                    title: {
                      text: 'Procurement Saving Value',
                      align: 'left'
                    },
                    grid: {
                      borderColor: '#e7e7e7',
                      row: {
                        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                        opacity: 0.5
                      },
                    },
                    markers: {
                      size: 1
                    },
                    xaxis: {
                      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'],
                      title: {
                        text: 'Month'
                      }
                    },
                    yaxis: {
                      title: {
                        text: 'Value (million)'
                      },
                      min: 5,
                      max: 40
                    },
                    legend: {
                      position: 'top',
                      horizontalAlign: 'right',
                      floating: true,
                      offsetY: -25,
                      offsetX: -5
                    }
                  },
            },
        }
    }

    componentDidMount = () => {
        this._isMounted = true;
        // this.getData()
        // this.fetchData({
        //     purc_org_id : "all",
        //     year : "2021"
        // })        
    }

    componentWillUnmount() {
        this._isMounted = false;
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    fetchData = async (data) => {
        this.setState({ loading: true })
        this.props.getProcurementSavingPerCompany(data)
            .then((resp) => {
                console.log(resp.data.data)
                const pie_series = [(100-resp.data.data.pie_saving),resp.data.data.pie_saving]
                const pie_plot_options = { pie: {
                    donut: {
                      labels: {
                        show: true,
                        total: {
                          show: true,
                          showAlways: true,
                          label: 'Saving',
                          fontSize: '22px',
                          fontFamily: 'Helvetica, Arial, sans-serif',
                          fontWeight: 600,
                          color: '#373d3f',
                          formatter: function (w) {
                            return (parseFloat(resp.data.data.pie_saving)).toFixed(2)+'%'
                          }
                        }
                      }
                    }
                  }
                }
                this.setState({total_saving : resp.data.data.total_saving})
                this.setState({...this.state,pie : {...this.state.pie, series : pie_series, options : {...this.state.pie.options, plotOptions : pie_plot_options}}})
                this.setState({ loading: false })
            })
            .catch((resp) => {
                this.setState({loading : false})
                let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
                toastr.error('Oops', message);
                this.setState({ loading: false })
            })
        
    }

    getData = async () => {
      this.setState({ loading: true })
        this.props.getTenderProcurementSavingChart()
            .then((resp) => {
                console.log(resp.data.data)
                this.setPurchasingOrg(resp.data.data)
            })
            .catch((resp) => {
                this.setState({loading : false})
                let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
                toastr.error('Oops', message);
            })
    }

    setPurchasingOrg = async (data) => {
      let po = []
      let outline = []
      await data.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0)).forEach((item) => {
        if (!po.includes(item.id)){
          po.push(item.id)
        }
      })
      const a = {...this.state.options}
      a.xaxis.categories = po
      this.setState({options : a})

      await po.forEach((item_po) => {
        let temp_outline = 0;
        data.forEach(item => {
          if (item.id === item_po){
            outline.push(item.count + '%')
            temp_outline = 1;
          }
        });

        if (temp_outline === 0){
          outline.push(0)
        }
      })

      await this.setState({series : [{
        name: 'Outline Agreement',
        data: outline
      }]})

      
      this.setState({loading : false})

      console.log(this.state)
    }

    handleSubmitFilter = (event) => {
        event.preventDefault()
        // console.log(event.target.purchasing_group.value)
        // const params = {
        //     purc_org_id : event.target.purchasing_group.value,
        //     year : event.target.tahun.value
        // }
        // this.fetchData(params)
    }

    render() {
        // const { t } = this.props;
        return (
            <div>
                <Panel collapse={navigator.userAgent.indexOf("Firefox") > -1 ? false : true}>
                    <PanelHeader>
                        Dashboard Procurement Lead Time Per Company
                    </PanelHeader>
                    <PanelBody>
                        <Row>
                        <Col sm="12">
                                <form onSubmit={this.handleSubmitFilter}>
                                    <div className="form-group">
                                        <label style={{marginRight : "5px"}}>Purchasing Group :  </label>
                                        <select name="purchasing_group" id="purchasing_group" style={{marginRight : "20px"}} defaultValue="All">
                                            <option value="all">All</option>
                                            <option value="A000">A000</option>
                                            <option value="B000">B000</option>
                                            <option value="C000">C000</option>
                                            <option value="D000">D000</option>
                                            <option value="A000">E000</option>
                                            <option value="A000">F000</option>
                                            <option value="B000">G000</option>
                                            <option value="C000">H000</option>
                                            <option value="D000">I000</option>
                                            <option value="C000">J000</option>
                                            <option value="D000">L000</option>
                                        </select>
                                        <label style={{marginRight : "5px"}}> Tahun :  </label>
                                        <select name="tahun" id="tahun" style={{marginRight : "20px"}} defaultValue="2021">
                                            <option value="2019">2019</option>
                                            <option value="2020">2020</option>
                                            <option value="2021">2021</option>
                                            <option value="2022">2022</option>
                                            <option value="2023">2023</option>
                                        </select>
                                        <button type="submit" className="btn btn-success btn-xs">Filter</button>
                                    </div>
                                </form>
                            </Col>
                        </Row>
                    {this.state.loading ? 
                                <center>
                                <br/>
                                <ReactLoading type="cylon" color="#0f9e3e" />

                                <br/>
                                </center> :
                        <Row>
                            
                            {/* <Col sm="2">
                                <div className="form-group">
                                    <label>Tahun :  </label>
                                    <select name="cars" id="cars">
                                        <option value="volvo">2020</option>
                                        <option value="saab">2021</option>
                                        <option value="mercedes">2022</option>
                                        <option value="audi">2023</option>
                                    </select>
                                </div>
                            </Col>
                            <Col sm="4" />
                            <Col sm="4" /> */}
                            <Col sm="4" style={{ textAlign : "center"}}>
                                <Chart
                                    options={this.state.pie.options}
                                    series={this.state.pie.series}
                                    type="donut"
                                    width={380}
                                />
                            </Col>
                            <Col sm="4">
                                <div style={{marginTop : "20%", textAlign : "center"}}>
                                    <h2>
                                        Procurement Lead Time :
                                    </h2>
                                    <h2 style={{color: "green"}}>
                                        30 Days
                                        <hr />
                                    </h2>
                                    <h5>
                                        Total of PO Value : IDR  16.343.844.200
                                    </h5>
                                    <h5>
                                        Number of PO : 47
                                    </h5>
                                </div>
                            </Col>
                            <Col sm="4">
                                {/* <Chart
                                    options={this.state.line2.options}
                                    series={this.state.line2.series}
                                    type="line"
                                    height= "400"
                                /> */}
                                <table className="table-bordered table-striped" width="100%">
                                    <tr style={{ padding: "10px" }}>
                                        <th rowSpan={2} style={{padding: "10px"}}>Procurement Steps</th>
                                        <th colSpan={4} style={{padding: "10px"}}>Lead Time (in Days)</th>
                                    </tr>
                                    <tr style={{ padding: "10px" }}>
                                        <th style={{padding: "10px"}}>TL</th>
                                        <th style={{padding: "10px"}}>PL</th>
                                        <th style={{padding: "10px"}}>ST</th>
                                        <th style={{padding: "10px"}}>SU</th>
                                    </tr>
                                    <tr style={{ padding: "10px" }}>
                                        <td style={{padding: "10px"}}>PR Assignment</td>
                                        <td style={{padding: "10px"}}>1</td>
                                        <td style={{padding: "10px"}}>1</td>
                                        <td style={{padding: "10px"}}>2</td>
                                        <td style={{padding: "10px"}}>2</td>
                                    </tr>
                                    <tr style={{ padding: "10px" }}>
                                        <td style={{padding: "10px"}}>Proposal Tender</td>
                                        <td style={{padding: "10px"}}>2</td>
                                        <td style={{padding: "10px"}}>3</td>
                                        <td style={{padding: "10px"}}>5</td>
                                        <td style={{padding: "10px"}}>7</td>
                                    </tr>
                                    <tr style={{ padding: "10px" }}>
                                        <td style={{padding: "10px"}}>Quotation</td>
                                        <td style={{padding: "10px"}}>4</td>
                                        <td style={{padding: "10px"}}>8</td>
                                        <td style={{padding: "10px"}}>8</td>
                                        <td style={{padding: "10px"}}>8</td>
                                    </tr>
                                    <tr style={{ padding: "10px" }}>
                                        <td style={{padding: "10px"}}>Administration Evaluation</td>
                                        <td style={{padding: "10px"}}>1</td>
                                        <td style={{padding: "10px"}}>4</td>
                                        <td style={{padding: "10px"}}>6</td>
                                        <td style={{padding: "10px"}}>6</td>
                                    </tr>
                                    <tr style={{ padding: "10px" }}>
                                        <td style={{padding: "10px"}}>Technical Evaluation</td>
                                        <td style={{padding: "10px"}}>2</td>
                                        <td style={{padding: "10px"}}>6</td>
                                        <td style={{padding: "10px"}}>6</td>
                                        <td style={{padding: "10px"}}>9</td>
                                    </tr>
                                    <tr style={{ padding: "10px" }}>
                                        <td style={{padding: "10px"}}>Commercial Evaluation</td>
                                        <td style={{padding: "10px"}}>1</td>
                                        <td style={{padding: "10px"}}>2</td>
                                        <td style={{padding: "10px"}}>2</td>
                                        <td style={{padding: "10px"}}>3</td>
                                    </tr>
                                    <tr style={{ padding: "10px" }}>
                                        <td style={{padding: "10px"}}>Negotiation</td>
                                        <td style={{padding: "10px"}}>2</td>
                                        <td style={{padding: "10px"}}>7</td>
                                        <td style={{padding: "10px"}}>6</td>
                                        <td style={{padding: "10px"}}>8</td>
                                    </tr>
                                    <tr style={{ padding: "10px" }}>
                                        <td style={{padding: "10px"}}>Awarding</td>
                                        <td style={{padding: "10px"}}>1</td>
                                        <td style={{padding: "10px"}}>2</td>
                                        <td style={{padding: "10px"}}>2</td>
                                        <td style={{padding: "10px"}}>3</td>
                                    </tr>
                                    <tr style={{ padding: "10px" }}>
                                        <td style={{padding: "10px"}}>PO Released</td>
                                        <td style={{padding: "10px"}}>1</td>
                                        <td style={{padding: "10px"}}>2</td>
                                        <td style={{padding: "10px"}}>3</td>
                                        <td style={{padding: "10px"}}>4</td>
                                    </tr>
                                    <tr style={{ padding: "10px" }}>
                                        <th style={{padding: "10px"}}>	&sum; Procuremet LeadTime</th>
                                        <th style={{padding: "10px"}}>15</th>
                                        <th style={{padding: "10px"}}>35</th>
                                        <th style={{padding: "10px"}}>40</th>
                                        <th style={{padding: "10px"}}>50</th>
                                    </tr>
                                    </table>
                            </Col>
                            <Col sm="6" style={{marginTop: "20px"}}>
                                <Chart
                                    options={this.state.options}
                                    series={this.state.series}
                                    type="bar"
                                    height= "400"
                                />
                            </Col>
                            <Col sm="6" style={{marginTop: "20px"}}>
                                <Chart
                                options={this.state.line.options}
                                series={this.state.line.series}
                                type="line"
                                height= "400"
                            />
                            </Col>
                            {/* <Col sm="12">
                                <Chart
                                    options={this.state.line.options}
                                    series={this.state.line.series}
                                    type="line"
                                    height= "400"
                                />
                            </Col> */}
                        </Row>
                        }
                    </PanelBody>
                </Panel>
            </div>
        )
    }
}

const stateToProps = state => {
	return {
		
	}
}

const dispatchToProps = dispatch => {
	return {
		getTenderProcurementSavingChart: (params) => dispatch(getTenderProcurementSavingChart(params)),
        getProcurementSavingPerCompany: (params) => dispatch(getProcurementSavingPerCompany(params)),
        
	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(ChartProLeadTimeCompany));
