import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { withTranslation } from 'react-i18next';
import Chart from "react-apexcharts";

import ReactLoading from 'react-loading';

import { getVendorPerformaChart } from '../../../../../store/actions/dashboard/dashboardVendorAction';

class ChartPeformaVendor extends Component {
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
                dataLabels: {
                  enabled: true,
                  // offsetY: -20,
                  style: {
                    fontSize: '12px',
                    colors: ["#FFFFFF", "#000000", "#FFFFFF"]
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
                colors: ['#33cc33', '#e6e600', '#ff0000'],
                title: {
                    text: "Dashboard Performa Report",
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
        this.props.getVendorPerformaChart()
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
      let hijau = []
      let kuning = []
      let merah = []
      await data.forEach((item) => {
        if (!po.includes(item.purchasing_org_name)){
          po.push(item.purchasing_org_name)
        }
      })
      const a = {...this.state.options}
      a.xaxis.categories = po
      this.setState({options : a})

      await po.forEach((item_po) => {
        let temp_hijau = 0;
        let temp_kuning = 0;
        let temp_merah = 0;
        data.forEach(item => {
          if (item.purchasing_org_name === item_po){
            if (item.kelompok === 'Hijau'){
              hijau.push(item.count)
              temp_hijau = 1;
            }else if (item.kelompok === 'Kuning'){
              kuning.push(item.count)
              temp_kuning = 1;
            }else if (item.kelompok === 'Merah'){
              merah.push(item.count)
              temp_merah = 1;
            }
          }
        });

        if (temp_hijau === 0){
          hijau.push(0)
        }
        if (temp_kuning === 0){
          kuning.push(0)
        }

        if (temp_merah === 0){
          merah.push(0)
        }
      })

      await this.setState({series : [{
        name: 'Hijau',
        data: hijau
      }, {
        name: 'Kuning',
        data: kuning
      }, {
        name: 'Merah',
        data: merah
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
		getVendorPerformaChart: (params) => dispatch(getVendorPerformaChart(params)),
	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(ChartPeformaVendor));
