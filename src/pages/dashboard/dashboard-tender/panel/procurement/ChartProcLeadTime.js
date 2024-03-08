import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';

import Chart from "react-apexcharts";

import ReactLoading from 'react-loading';

import { getTenderProcurementLeadTimeChart } from '../../../../../store/actions/dashboard/dashboardTenderAction';

class ChartProcLeadTime extends Component {
    constructor(props) {
        super(props)
        // console.log(this.props)
        this._isMounted = false
        this.state = {
            loading : false,
            // series: [{
            //     name : 'Tender Umum',
            //     data : [4,3,5,3,3,1,10,23,19,8]
            // },{
            //     name : 'Tender Terbatas',
            //     data : [1,4,6,7,4,12,12,12,4,4]
            // },{
            //     name : 'Pemilihan Langsung',
            //     data : [2,7,6,20,4,12,12,12,4,4]
            // },{
            //     name : 'Penunjukan Langsung',
            //     data : [10,4,6,7,4,1,14,22,4,1]
            // }],
            series: [],
            options: {
                chart: {
                  type: 'bar',
                  height: 350,
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
                    borderRadius: 8,
                    horizontal: false,
                    dataLabels: {
                        position: 'top', // top, center, bottom
                      },
                  },
                },
                dataLabels: {
                    enabled: true,
                    offsetY: -20,
                    style: {
                      fontSize: '12px',
                      colors: ["#304758"]
                    }
                },
                xaxis: {
                  type: 'text',
                  // categories: ['ME', 'PIE', 'PIHC', 'PILOG', 'PIM', 'PKC', 'PKG', 'PKT', 'PSP', 'REKIND'],
                  categories: [],
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
                colors: ['#0066cc', '#80dfff', '#ff9900', "#ffe6cc"],
                title: {
                    text: "Procurement Lead Time (Tender to PO)",
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
        this.props.getTenderProcurementLeadTimeChart()
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
      let tender_umum = []
      let tender_terbatas = []
      let pemilihan_langsung = []
      let penunjukan_langsung = []
      await data.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0)).forEach((item) => {
        if (!po.includes(item.name)){
          po.push(item.name)
        }
      })
      const a = {...this.state.options}
      a.xaxis.categories = po
      this.setState({options : a})

      await po.forEach((item_po) => {
        let temp_tender_umum = 0;
        let temp_tender_terbatas = 0;
        let temp_pemilihan_langsung = 0;
        let temp_penunjukan_langsung = 0;
        data.forEach(item => {
          if (item.name === item_po){
            if (item.status === 'Tender/Seleksi Umum'){
              tender_umum.push(item.count)
              temp_tender_umum = 1;
            }else if (item.status === 'Tender/Seleksi Terbatas'){
              tender_terbatas.push(item.count)
              temp_tender_terbatas = 1;
            }else if (item.status === 'Pemilihan Langsung'){
              pemilihan_langsung.push(item.count)
              temp_pemilihan_langsung = 1;
            }else if (item.status === 'Penunjukan Langsung'){
              penunjukan_langsung.push(item.count)
              temp_penunjukan_langsung = 1;
            }
          }
        });

        if (temp_tender_umum === 0){
          tender_umum.push(0)
        }
        if (temp_tender_terbatas === 0){
          tender_terbatas.push(0)
        }

        if (temp_pemilihan_langsung === 0){
          pemilihan_langsung.push(0)
        }

        if (temp_penunjukan_langsung === 0){
          penunjukan_langsung.push(0)
        }
      })

      await this.setState({series : [{
        name: 'Tender Umum',
        data: tender_umum
      }, {
        name: 'Tender Terbatas',
        data: tender_terbatas
      }, {
        name: 'Pemilihan Langsung',
        data: pemilihan_langsung
      }, {
        name: 'Penunjukan Langsung',
        data: penunjukan_langsung
      }]})

      
      this.setState({loading : false})
    }

    render() {
        // const { t } = this.props;
        return (
            <div>
                <Panel collapse={navigator.userAgent.indexOf("Firefox") > -1 ? false : true}>
                    <PanelHeader>
                        Dashboard Procurement Lead Time
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
		getTenderProcurementLeadTimeChart: (params) => dispatch(getTenderProcurementLeadTimeChart(params)),
	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(ChartProcLeadTime));
