import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';

import Chart from "react-apexcharts";

import ReactLoading from 'react-loading';

import { getStatusInvoiceChart } from '../../../../store/actions/dashboard/dashboardInvoiceAction';

class ChartStatusInvoice extends Component {
    constructor(props) {
        super(props)
        // console.log(this.props)
        this._isMounted = false
        this.state = {
            loading : false,
            // series: [{
            //     name : 'Verifikasi 1',
            //     data : [4,3,5,3,3,1,10,23,19,8]
            // },{
            //     name : 'Verifikasi 2',
            //     data : [1,4,6,7,4,12,12,12,4,4]
            // },{
            //     name : 'Bendahara',
            //     data : [4,3,5,3,3,1,10,23,19,8]
            // },{
            //     name : 'Paid',
            //     data : [1,4,6,7,4,12,12,12,4,4]
            // }],
            series : [],
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
                    // borderRadius: 8,
                    horizontal: false,
                  },
                },
                dataLabels: {
                  enabled: true,
                  // offsetY: -20,
                  style: {
                    fontSize: '12px',
                    colors: ["#000000", "#FFFFFF", "#FFFFFF", "#FFFFFF"]
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
                colors: ['#ffff66', '#ff884d', '#53c68c', '#2d8659'],
                title: {
                    text: "Status Invoice",
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
        this.props.getStatusInvoiceChart()
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
      let verif_1 = []
      let verif_2 = []
      let bendahara = []
      let paid = []
      await data.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0)).forEach((item) => {
        if (!po.includes(item.name)){
          po.push(item.name)
        }
      })
      const a = {...this.state.options}
      a.xaxis.categories = po
      this.setState({options : a})

      await po.forEach((item_po) => {
        let temp_verif_1 = 0;
        let temp_verif_2 = 0;
        let temp_bendahara = 0;
        let temp_paid = 0;
        data.forEach(item => {
          if (item.name === item_po){
            if (item.status === 'Verifikasi 1'){
              verif_1.push(item.count)
              temp_verif_1 = 1;
            }else if (item.status === 'Verifikasi 2'){
              verif_2.push(item.count)
              temp_verif_2 = 1;
            }else if (item.status === 'Bendahara'){
              bendahara.push(item.count)
              temp_bendahara = 1;
            }else if (item.status === 'Paid'){
              paid.push(item.count)
              temp_paid = 1;
            }
          }
        });

        if (temp_verif_1 === 0){
          verif_1.push(0)
        }
        if (temp_verif_2 === 0){
          verif_2.push(0)
        }

        if (temp_bendahara === 0){
          bendahara.push(0)
        }

        if (temp_paid === 0){
          paid.push(0)
        }
      })

      await this.setState({series : [{
        name: 'Verifikasi 1',
        data: verif_1
      }, {
        name: 'Verifikasi 2',
        data: verif_2
      }, {
        name: 'Bendahara',
        data: bendahara
      },{
        name: 'Paid',
        data: paid
      }]})

      
      this.setState({loading : false})
    }

    render() {
        // const { t } = this.props;
        return (
            <div>
              {this.state.loading ? 
                                <center>
                                <br/>
                                <ReactLoading type="cylon" color="#0f9e3e" />

                                <br/>
                                </center> :
                <Panel collapse={navigator.userAgent.indexOf("Firefox") > -1 ? false : true}>
                    <PanelHeader>
                        Dashboard Status Invoice
                    </PanelHeader>
                    <PanelBody>
                        <Row>
                            <Col sm="12">
                            
                                <Chart
                                    options={this.state.options}
                                    series={this.state.series}
                                    type="bar"
                                    height= "400"
                                />
                            
                            </Col>
                        </Row>
                    </PanelBody>
                </Panel>
              }
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
		getStatusInvoiceChart: (params) => dispatch(getStatusInvoiceChart(params)),
	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(ChartStatusInvoice));
