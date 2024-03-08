import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';

import Chart from "react-apexcharts";

import ReactLoading from 'react-loading';

import { getTenderPOAktifChart } from '../../../../../store/actions/dashboard/dashboardTenderAction';

class ChartPOAktif extends Component {
    constructor(props) {
        super(props)
        // console.log(this.props)
        this._isMounted = false
        this.state = {
            loading : false,
            // series: [{
            //     name : 'Open',
            //     data : [4,3,5,3,3,1,10,23,19,8]
            // },{
            //     name : 'Outstanding',
            //     data : [1,4,6,7,4,12,12,12,4,4]
            // }],
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
                colors: ['#00ff00', '#ffcc00'],
                title: {
                    text: "Status PO Aktif",
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
        this.props.getTenderPOAktifChart()
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
      let open = []
      let outstanding = []
      await data.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0)).forEach((item) => {
        if (!po.includes(item.name)){
          po.push(item.name)
        }
      })
      const a = {...this.state.options}
      a.xaxis.categories = po
      this.setState({options : a})

      await po.forEach((item_po) => {
        let temp_open = 0;
        let temp_outstanding = 0;
        data.forEach(item => {
          if (item.name === item_po){
            if (item.status_progress === 'open'){
              open.push(item.count)
              temp_open = 1;
            }else if (item.status_progress === 'outstanding'){
              outstanding.push(item.count)
              temp_outstanding = 1;
            }
          }
        });

        if (temp_open === 0){
          open.push(0)
        }
        if (temp_outstanding === 0){
          outstanding.push(0)
        }
      })

      await this.setState({series : [{
        name: 'Open',
        data: open
      }, {
        name: 'outstanding',
        data: outstanding
      }]})

      
      this.setState({loading : false})
    }

    render() {
        // const { t } = this.props;
        return (
            <div>
                <Panel collapse={navigator.userAgent.indexOf("Firefox") > -1 ? false : true}>
                    <PanelHeader>
                        Dashboard PO AKtif
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
		getTenderPOAktifChart: (params) => dispatch(getTenderPOAktifChart(params)),
	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(ChartPOAktif));
