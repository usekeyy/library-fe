import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
import Chart from "react-apexcharts";
// import ReactLoading from 'react-loading';
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
            pieStatus : {
                series: [44, 55, 13],
                options: {
                    legend: {
                        position: 'bottom'
                    },
                    chart: {
                        width: 380,
                        type: 'pie',
                    },
                    labels: ['Active', 'Order Due', 'Close Out'],
                    responsive: [{
                        breakpoint: 480,
                        options: {
                            chart: {
                                width: 200
                            },
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }]
                },
            },
            pieAgreement : {
                series: [44, 55, 13],
                options: {
                    legend: {
                        position: 'bottom'
                    },
                    chart: {
                        width: 380,
                        type: 'pie',
                    },
                    labels: ['Contract', 'PO', 'SO'],
                    responsive: [{
                        breakpoint: 480,
                        options: {
                            chart: {
                                width: 200
                            },
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }]
                },
            },
            pieMethod : {
                series: [44, 35, 13],
                options: {
                    legend: {
                        position: 'bottom'
                    },
                    chart: {
                        width: 380,
                        type: 'pie',
                    },
                    labels: ['DA', 'DS', 'Tender'],
                    responsive: [{
                        breakpoint: 480,
                        options: {
                            chart: {
                                width: 200
                            },
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }]
                },
            },
            stacked : {
                series: [{
                    name: 'Vendor Lokal',
                    data: [44, 55, 20]
                  }, {
                    name: 'Afiliasi',
                    data: [53, 32, 0]
                  }, {
                    name: 'Sinergi BUMN',
                    data: [12, 17, 0]
                  },{
                    name: 'Vendor Luar Negeri',
                    data: [12, 17, 0]
                  }],
                  options: {
                    chart: {
                      type: 'bar',
                      height: 350,
                      stacked: true,
                    },
                    plotOptions: {
                      bar: {
                        horizontal: true,
                      },
                    },
                    stroke: {
                      width: 1,
                      colors: ['#fff']
                    },
                    colors: ['#f2e129', '#ff884d', '#117fed', '#2d8659'],
                    // title: {
                    //   text: 'Fiction Books Sales'
                    // },
                    xaxis: {
                      categories: [2020,2021,2022],
                      labels: {
                        formatter: function (val) {
                          return val + "B"
                        }
                      }
                    },
                    yaxis: {
                      title: {
                        text: undefined
                      },
                    },
                    tooltip: {
                      y: {
                        formatter: function (val) {
                          return val + " Billion"
                        }
                      }
                    },
                    fill: {
                      opacity: 1
                    },
                    legend: {
                      position: 'top',
                      horizontalAlign: 'left',
                      offsetX: 40
                    }
                  },
            },
            barProgressStatus : {
                series: [{
                    data: [550, 430, 400]
                  }],
                  options: {
                    chart: {
                      type: 'bar',
                      height: 350
                    },
                    plotOptions: {
                      bar: {
                        borderRadius: 4,
                        horizontal: true,
                        color : {
                            ranges : [{color : '#f2e129'}, {color : '#ff884d'}]
                        }
                      }
                    },
                    dataLabels: {
                      enabled: false
                    },
                    xaxis: {
                      categories: ['PO', 'Received', 'Invoiced'],
                    },
                    legend: {
                        position: 'bottom',
                        show : true
                    },
                    // colors: ['#f2e129', '#ff884d', '#117fed', '#2d8659'],
                  },
            },
            lineProgressStatus : {
                series: [
                    {
                      name: "PO",
                      data: [2800, 2900, 3300, 3600, 3200, null,null,null,null,null,null,null]
                    },
                    {
                      name: "Received",
                      data: [1200, 1100, 1400, 1800, 1700,null,null,null,null,null,null,null]
                    },
                    {
                        name: "Invoiced",
                        data: [1000, 900, 700, 1600, 1200, null,null,null,null,null,null,null]
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
                    colors: ['#f2e129', '#ff884d', '#117fed'],
                    dataLabels: {
                      enabled: true,
                    },
                    stroke: {
                      curve: 'smooth'
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
                      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul','Aug', 'Sep', 'Oct', 'Nov', 'Des'],
                      title: {
                        text: 'Month'
                      }
                    },
                    yaxis: {
                      title: {
                        text: 'Progress Status (in Billion)'
                      },
                    //   min: 1,
                    //   max: 10000
                    },
                    legend: {
                      position: 'bottom',
                    //   floating: true,
                    }
                  },
            }
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
                        Dashboard Purchase Order
                    </PanelHeader>
                    <PanelBody>
                        <Row>
                            <Col sm="4" className="text-center border-right">
                                <h3>
                                    Contract <br/>
                                    <div style={{color : "green"}}>IDR 800.000.000</div>
                                </h3>
                                <center>
                                    <table cellPadding="8" style={{borderTop : "solid", borderBottom : "Solid", fontSize : "14px"}}>
                                        <tr>
                                            <td><b>Original</b> (IDR)</td>
                                            <td>800.000.000</td>
                                            <td>(4 Contract)</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2"><b>Valas</b></td>
                                        </tr>
                                        <tr>
                                            <td>  - USD</td>
                                            <td>200.000.000</td>
                                            <td>(2 Contract)</td>
                                        </tr>
                                        <tr>
                                            <td>  - SGD</td>
                                            <td>150.000.000</td>
                                            <td>(1 Contract)</td>
                                        </tr>
                                        <tr>
                                            <td> - YEN</td>
                                            <td>120.000</td>
                                            <td>(2 Contract)</td>
                                        </tr>
                                    </table>
                                </center>
                            </Col>
                            <Col sm="4" className="text-center border-right">
                                <h3>
                                    Purchase Order <br/>
                                    <div style={{color : "green"}}>IDR 700.000.000</div>
                                </h3>
                                <center>
                                    <table cellPadding="8" style={{borderTop : "solid", borderBottom : "Solid", fontSize : "14px"}}>
                                        <tr>
                                            <td><b>Original</b> (IDR)</td>
                                            <td>700.000.000</td>
                                            <td>(4 PO)</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2"><b>Valas</b></td>
                                        </tr>
                                        <tr>
                                            <td>  - USD</td>
                                            <td>600.000.000</td>
                                            <td>(3 PO)</td>
                                        </tr>
                                        <tr>
                                            <td>  - SGD</td>
                                            <td>200.000.000</td>
                                            <td>(1 PO)</td>
                                        </tr>
                                        <tr>
                                            <td> - YEN</td>
                                            <td>100.000.000</td>
                                            <td>(3 PO)</td>
                                        </tr>
                                    </table>
                                </center>
                            </Col>
                            <Col sm="4" className="text-center">
                                <h3>
                                    Service Order <br/>
                                    <div style={{color : "green"}}>IDR 900.000.000</div>
                                </h3>
                                <center>
                                    <table cellPadding="8" style={{borderTop : "solid", borderBottom : "Solid", fontSize : "14px"}}>
                                        <tr>
                                            <td><b>Original</b> (IDR)</td>
                                            <td>750.000.000</td>
                                            <td>(5 SO)</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2"><b>Valas</b></td>
                                        </tr>
                                        <tr>
                                            <td>  - USD</td>
                                            <td>321.000.000</td>
                                            <td>(4 SO)</td>
                                        </tr>
                                        <tr>
                                            <td>  - SGD</td>
                                            <td>150.000.000</td>
                                            <td>(2 SO)</td>
                                        </tr>
                                        <tr>
                                            <td> - YEN</td>
                                            <td>150.000.000</td>
                                            <td>(3 SO)</td>
                                        </tr>
                                    </table>
                                </center>
                            </Col>
                        </Row>

                        <Row style={{marginTop : "25px"}}>
                            <Col sm="4">
                                <center>
                                    <h3>By Status</h3>
                                    <Chart
                                        options={this.state.pieStatus.options}
                                        series={this.state.pieStatus.series}
                                        type="pie"
                                        width={380}
                                    />
                                </center>
                            </Col>
                            <Col sm="4">
                                <center>
                                    <h3>Agreement Type</h3>
                                    <Chart
                                        options={this.state.pieAgreement.options}
                                        series={this.state.pieAgreement.series}
                                        type="pie"
                                        width={380}
                                    />
                                </center>
                            </Col>
                            <Col sm="4">
                                <center>
                                    <h3>Procurement Method</h3>
                                    <Chart
                                        options={this.state.pieMethod.options}
                                        series={this.state.pieMethod.series}
                                        type="pie"
                                        width={380}
                                    />
                                </center>
                            </Col>
                        </Row>
                        <Row style={{marginTop : "25px"}}>
                            <Col sm="6">
                                <center>
                                    <h3>Purchase Realization by Supplier Categories</h3>
                                    <Chart
                                        options={this.state.stacked.options}
                                        series={this.state.stacked.series}
                                        type="bar"
                                        height={350}
                                    />
                                </center>
                            </Col>
                            <Col sm="6" >
                                <center>
                                    <h3>Top 10 Vendors</h3>
                                </center>
                                <center style={{height : "370px", overflow: "scroll"}}>
                                    <table className="table-bordered table-striped" width="100%">
                                    <tr style={{ padding: "10px" }}>
                                        <th style={{padding: "10px"}}>Vendors</th>
                                        <th style={{padding: "10px"}}>Agreement Value (IDR)</th>
                                        <th style={{padding: "10px"}}>Number Of Agreement</th>
                                    </tr>

                                    <tr style={{ padding: "10px" }}>
                                        <td style={{padding: "10px"}}>ABC</td>
                                        <td style={{padding: "10px"}}>1.000.000.000</td>
                                        <td style={{padding: "10px"}}>5</td>
                                    </tr>
                                    <tr style={{ padding: "10px" }}>
                                        <td style={{padding: "10px"}}>DEF</td>
                                        <td style={{padding: "10px"}}>900.000.000</td>
                                        <td style={{padding: "10px"}}>2</td>
                                    </tr>
                                    <tr style={{ padding: "10px" }}>
                                        <td style={{padding: "10px"}}>GHI</td>
                                        <td style={{padding: "10px"}}>800.000.000</td>
                                        <td style={{padding: "10px"}}>4</td>
                                    </tr>
                                    <tr style={{ padding: "10px" }}>
                                        <td style={{padding: "10px"}}>JKL</td>
                                        <td style={{padding: "10px"}}>700.000.000</td>
                                        <td style={{padding: "10px"}}>3</td>
                                    </tr>
                                    <tr style={{ padding: "10px" }}>
                                        <td style={{padding: "10px"}}>MNO</td>
                                        <td style={{padding: "10px"}}>500.000.000</td>
                                        <td style={{padding: "10px"}}>5</td>
                                    </tr>
                                    <tr style={{ padding: "10px" }}>
                                        <td style={{padding: "10px"}}>PQR</td>
                                        <td style={{padding: "10px"}}>400.000.000</td>
                                        <td style={{padding: "10px"}}>3</td>
                                    </tr>
                                    <tr style={{ padding: "10px" }}>
                                        <td style={{padding: "10px"}}>STU</td>
                                        <td style={{padding: "10px"}}>350.000.000</td>
                                        <td style={{padding: "10px"}}>2</td>
                                    </tr>
                                    <tr style={{ padding: "10px" }}>
                                        <td style={{padding: "10px"}}>FWX</td>
                                        <td style={{padding: "10px"}}>300.000.000</td>
                                        <td style={{padding: "10px"}}>1</td>
                                    </tr>
                                    <tr style={{ padding: "10px" }}>
                                        <td style={{padding: "10px"}}>YZA</td>
                                        <td style={{padding: "10px"}}>150.000.000</td>
                                        <td style={{padding: "10px"}}>1</td>
                                    </tr>
                                    <tr style={{ padding: "10px" }}>
                                        <td style={{padding: "10px"}}>BCD</td>
                                        <td style={{padding: "10px"}}>80.000.000</td>
                                        <td style={{padding: "10px"}}>2</td>
                                    </tr>
                                    
                                    </table>
                                </center>
                            </Col>
                        </Row>
                        <Row style={{marginTop : "25px"}}>
                            <Col sm="6">
                                <center>
                                    <h3>Progress Status</h3>
                                    <Chart
                                        options={this.state.barProgressStatus.options}
                                        series={this.state.barProgressStatus.series}
                                        type="bar"
                                        height={350}
                                    />
                                </center>
                            </Col>
                            <Col sm="6">
                                <center>
                                    <h3>Trend Progress Status</h3>
                                    <Chart
                                        options={this.state.lineProgressStatus.options}
                                        series={this.state.lineProgressStatus.series}
                                        type="line"
                                        height={350}
                                    />
                                </center>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12" >
                                <center style={{height : "370px", overflow: "scroll"}}>
                                    <table className="table-bordered table-striped text-center" width="100%">
                                    <tr style={{ padding: "10px" }}>
                                        <th rowSpan={2} style={{padding: "10px"}}>Contract No</th>
                                        <th rowSpan={2} style={{padding: "10px"}}>Supplier</th>
                                        <th rowSpan={2} style={{padding: "10px"}}>Company</th>
                                        <th rowSpan={2} style={{padding: "10px"}}>Department</th>
                                        <th rowSpan={2} style={{padding: "10px"}}>Validity Start</th>
                                        <th rowSpan={2} style={{padding: "10px"}}>Validity End</th>
                                        <th rowSpan={2} style={{padding: "10px"}}>Contract Value</th>
                                        <th colSpan={2} style={{padding: "10px"}}>Progress Status</th>
                                        
                                    </tr>

                                    <tr style={{ padding: "10px" }}>
                                        <th style={{padding: "10px"}}>Receipt</th>
                                        <th style={{padding: "10px"}}>Invoiced</th>
                                    </tr>
                                    <tr style={{ padding: "10px" }}>
                                        <td style={{padding: "10px"}}>16000018</td>
                                        <td style={{padding: "10px"}}>PT ABC</td>
                                        <td style={{padding: "10px"}}>SEML</td>
                                        <td style={{padding: "10px"}}>ICT</td>
                                        <td style={{padding: "10px"}}>2 Feb 2020</td>
                                        <td style={{padding: "10px"}}>20 Feb 2022</td>
                                        <td style={{padding: "10px"}}>1.000.000.000</td>
                                        <td style={{padding: "10px"}}>1.000.000.000</td>
                                        <td style={{padding: "10px"}}>800.000.000</td>
                                    </tr>

                                    <tr style={{ padding: "10px" }}>
                                        <td style={{padding: "10px"}}>16000019</td>
                                        <td style={{padding: "10px"}}>PT DEF</td>
                                        <td style={{padding: "10px"}}>SEML</td>
                                        <td style={{padding: "10px"}}>ICT</td>
                                        <td style={{padding: "10px"}}>20 Mar 2020</td>
                                        <td style={{padding: "10px"}}>20 Feb 2022</td>
                                        <td style={{padding: "10px"}}>3.000.000.000</td>
                                        <td style={{padding: "10px"}}>3.000.000.000</td>
                                        <td style={{padding: "10px"}}>2.500.000.000</td>
                                    </tr>

                                    <tr style={{ padding: "10px" }}>
                                        <td style={{padding: "10px"}}>16000020</td>
                                        <td style={{padding: "10px"}}>PT GHI</td>
                                        <td style={{padding: "10px"}}>SEML</td>
                                        <td style={{padding: "10px"}}>ICT</td>
                                        <td style={{padding: "10px"}}>2 Des 2020</td>
                                        <td style={{padding: "10px"}}>20 Feb 2022</td>
                                        <td style={{padding: "10px"}}>1.000.000.000</td>
                                        <td style={{padding: "10px"}}>1.000.000.000</td>
                                        <td style={{padding: "10px"}}>900.000.000</td>
                                    </tr>

                                    <tr style={{ padding: "10px" }}>
                                        <td style={{padding: "10px"}}>16000021</td>
                                        <td style={{padding: "10px"}}>PT JKL</td>
                                        <td style={{padding: "10px"}}>SEML</td>
                                        <td style={{padding: "10px"}}>ICT</td>
                                        <td style={{padding: "10px"}}>2 Feb 2020</td>
                                        <td style={{padding: "10px"}}>20 Feb 2022</td>
                                        <td style={{padding: "10px"}}>5.000.000.000</td>
                                        <td style={{padding: "10px"}}>5.000.000.000</td>
                                        <td style={{padding: "10px"}}>4.900.000.000</td>
                                    </tr>
                                    
                                    
                                    </table>
                                </center>
                            </Col>
                        </Row>
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
