import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { withTranslation } from 'react-i18next';

import ReactLoading from 'react-loading';

import { getVendorStatusChart } from '../../../../../store/actions/dashboard/dashboardVendorAction';

import Chart from "react-apexcharts";

class ChartStatusVendor extends Component {
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
                  height: '900px',
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
                dataLabels: {
                  enabled: true,
                  // offsetY: -20,
                  style: {
                    fontSize: '12px',
                    colors: ["#FFFFFF", "#000000"]
                  }
                },
                xaxis: {
                  type: 'text',
                  categories: [],
                  title: {
                    text: 'Company Name'
                  }
                },
                yaxis: {
                  title: {
                    text: 'Jumlah Vendor'
                  }
                },
                legend: {
                  position: 'bottom',
                //   offsetY: 40
                },
                fill: {
                  opacity: 1
                },
                colors: ['#3399ff', '#e6e600'],
                title: {
                    text: "Dashboard Status Vendor & Aplicant",
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
        this.props.getVendorStatusChart()
            .then((resp) => {
                console.log(resp.data.data)
                this.setPurchasingOrg(resp.data.data)
            })
            .catch((resp) => {
                let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
                toastr.error('Oops', message);
            })
    }

    setPurchasingOrg = async (data) => {
      let po = []
      let vendor = []
      let aplicant = []
      await data.forEach((item) => {
        if (!po.includes(item.name)){
          po.push(item.name)
        }
      })
      const a = {...this.state.options}
      a.xaxis.categories = po
      this.setState({options : a})

      await po.forEach((item_po) => {
        let temp_vendor = 0;
        let temp_aplicant = 0;
        data.forEach(item => {
          if (item.name === item_po){
            if (item.status === 'y'){
              vendor.push(item.count)
              temp_vendor = 1;
            }else{
              aplicant.push(item.count)
              temp_aplicant = 1;
            }
          }
        });

        if (temp_vendor === 0){
          vendor.push(0)
        }
        if (temp_aplicant === 0){
          aplicant.push(0)
        }
      })

      await this.setState({series : [{
        name: 'Vendor',
        data: vendor
      }, {
        name: 'Aplicant',
        data: aplicant
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
                <Chart
                    options={this.state.options}
                    series={this.state.series}
                    type="bar"
                    height= "400"
                />
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
		getVendorStatusChart: (params) => dispatch(getVendorStatusChart(params)),
	}
}


export default connect(stateToProps, dispatchToProps)(withTranslation()(ChartStatusVendor));
