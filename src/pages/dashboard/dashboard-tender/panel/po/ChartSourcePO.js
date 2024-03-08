import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';

import Chart from "react-apexcharts";

import ReactLoading from 'react-loading';

import { getTenderSummarySourcePOChart } from '../../../../../store/actions/dashboard/dashboardTenderAction';

class ChartSourcePO extends Component {
    constructor(props) {
        super(props)
        // console.log(this.props)
        this._isMounted = false
        this.state = {
            loading : false,
            series: [],
            options: {
                chart: {
                  type: 'bar',
                  height: 350,
                  stacked: true,
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
                    borderRadius: 8,
                    horizontal: false,
                  },
                },
                xaxis: {
                  type: 'text',
                  categories: [],
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
                  opacity: 1
                },
                colors: ['#00ccff', '#ffcc99'],
                title: {
                    text: "Summary Source Of PO",
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
        this.props.getTenderSummarySourcePOChart()
            .then((resp) => {
                // console.log(resp.data.data)
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
      let sap = []
      let eproc = []
      await data.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0)).forEach((item) => {
        if (!po.includes(item.name)){
          po.push(item.name)
        }
      })
      const a = {...this.state.options}
      a.xaxis.categories = po
      this.setState({options : a})

      await po.forEach((item_po) => {
        let temp_sap = 0;
        let temp_eproc = 0;
        data.forEach(item => {
          if (item.name === item_po){
            if (item.source === 'SAP'){
              sap.push(item.jumlah_po)
              temp_sap = 1;
            }else if (item.source === 'E-Proc'){
              eproc.push(item.jumlah_po)
              temp_eproc = 1;
            }
          }
        });

        if (temp_sap === 0){
          sap.push(0)
        }
        if (temp_eproc === 0){
          eproc.push(0)
        }

      })

      await this.setState({series : [{
        name: 'PO SAP',
        data: sap
      }, {
        name: 'PO e-proc',
        data: eproc
      }]})

      
      this.setState({loading : false})
    }

    render() {
        // const { t } = this.props;
        return (
            <div>
                <Panel collapse={navigator.userAgent.indexOf("Firefox") > -1 ? false : true}>
                    <PanelHeader>
                        Dashboard Summary Source Of PO
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
		getTenderSummarySourcePOChart: (params) => dispatch(getTenderSummarySourcePOChart(params)),
	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(ChartSourcePO));
