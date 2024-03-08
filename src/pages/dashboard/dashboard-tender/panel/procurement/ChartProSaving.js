import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';

import Chart from "react-apexcharts";

import ReactLoading from 'react-loading';

import { getTenderProcurementSavingChart } from '../../../../../store/actions/dashboard/dashboardTenderAction';

class ChartProSaving extends Component {
    constructor(props) {
        super(props)
        // console.log(this.props)
        this._isMounted = false
        this.state = {
            loading : false,
            series: [{
                name: 'Saving (%)',
                type : 'column',
                data: [10,20,32,40,23,55,21,10,10,66]
              }, {
                name: 'KPI (%)',
                type: 'area',
                data: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
                dataLabels : false
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
                    enabledOnSeries : [0],
                    formatter: function (val) {
                      return val + "%";
                    },
                    style: {
                      fontSize: '12px',
                      colors: ["#FFF"]
                    }
                },
                xaxis: {
                  type: 'text',
                  categories: ['ME', 'PIE', 'PIHC', 'PILOG', 'PIM', 'PKC', 'PKG', 'PKT', 'PSP', 'REKIND'],
                  // categories: [],
                  title: {
                    text: 'Company Name'
                  }
                },
                yaxis: {
                  title: {
                    text: 'Jumlah'
                  }
                },
                legend: {
                  position: 'bottom',
                //   offsetY: 40
                },
                fill: {
                  // opacity: [0.85, 0.25, 1],
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
                    text: "Dashboard Procurement Saving",
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
        }
    }

    componentDidMount = () => {
        this._isMounted = true;
        this.getData()        
    }

    componentWillUnmount() {
        this._isMounted = false;
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
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
      let kpi = []
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
        // let temp_kpi = 0;
        data.forEach(item => {
          if (item.id === item_po){
            outline.push(item.count + '%')
            temp_outline = 1;
            kpi.push(item.kpi)
            // temp_kpi = 1;
          }
        });

        if (temp_outline === 0){
          outline.push(0)
          kpi.push(0)
        }
      })

      await this.setState({series : [{
        name: 'Procurement Saving',
        data: outline
      },{
        name: 'KPI (%)',
        type: 'area',
        data: kpi,
        dataLabels : false
      }]})

      
      this.setState({loading : false})

      console.log(this.state)
    }

    render() {
        // const { t } = this.props;
        return (
            <div>
                <Panel collapse={navigator.userAgent.indexOf("Firefox") > -1 ? false : true}>
                    <PanelHeader>
                        Dashboard Procurement Saving
                    </PanelHeader>
                    <PanelBody>
                        <Row>
                            <Col sm="12">
                            {this.state.loading ? 
                                <center>
                                <br/>
                                <ReactLoading type="cylon" color="#0f9e3e" />

                                <br/>
                                </center> :
                                <Chart
                                    options={this.state.options}
                                    series={this.state.series}
                                    type="bar"
                                    height= "400"
                                />
                            } 
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
	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(ChartProSaving));
