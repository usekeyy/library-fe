import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { withTranslation } from 'react-i18next';
import Chart from "react-apexcharts";
import ReactLoading from 'react-loading';

import { getVendorAktifChart } from '../../../../../store/actions/dashboard/dashboardVendorAction';

class ChartKeaktifanVendor extends Component {
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
                colors: ['#0f9e3e', '#ff9700', '#000000', '#FF2322'],
                title: {
                    text: "Status Keaktifan Vendor",
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
        this.props.getVendorAktifChart()
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
      let active = []
      let suspend = []
      let blacklist = []
      let inactive = []
      await data.forEach((item) => {
        if (!po.includes(item.purchasing_org_name)){
          po.push(item.purchasing_org_name)
        }
      })
      const a = {...this.state.options}
      a.xaxis.categories = po
      this.setState({options : a})

      await po.forEach((item_po) => {
        let temp_active = 0;
        let temp_suspend = 0;
        let temp_blacklist = 0;
        let temp_inactive = 0;
        data.forEach(item => {
          if (item.purchasing_org_name === item_po){
            if (item.status === 'Active'){
              active.push(item.count)
              temp_active = 1;
            }else if (item.status === 'Suspend'){
              suspend.push(item.count)
              temp_suspend = 1;
            }else if (item.status === 'Blacklist'){
              blacklist.push(item.count)
              temp_blacklist = 1;
            }else if (item.status === 'Inactive'){
              inactive.push(item.count)
              temp_inactive = 1;
            }
          }
        });

        if (temp_active === 0){
          active.push(0)
        }
        if (temp_suspend === 0){
          suspend.push(0)
        }

        if (temp_blacklist === 0){
          blacklist.push(0)
        }

        if (temp_inactive === 0){
          inactive.push(0)
        }

      })

      await this.setState({series : [{
        name: 'Active',
        data: active
      }, {
        name: 'Suspend',
        data: suspend
      }, {
        name: 'Blacklist',
        data: blacklist
      }, {
        name: 'Inactive',
        data: inactive
      }]})

      console.log(this.state)
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
		getVendorAktifChart: (params) => dispatch(getVendorAktifChart(params)),
	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(ChartKeaktifanVendor));
