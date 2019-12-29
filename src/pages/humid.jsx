import React, { Component } from 'react';
import Chart from 'react-apexcharts'

class HumidChart extends Component {

    constructor(props) {
        super(props);

        this.state = {
            options: {
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth'
                },


                xaxis: {
                    type: 'datetime',
                    categories: ["2018-09-19T00:00:00", "2018-09-19T01:30:00", "2018-09-19T02:30:00",
                        "2018-09-19T03:30:00", "2018-09-19T04:30:00", "2018-09-19T05:30:00",
                        "2018-09-19T06:30:00"
                    ],
                },
                tooltip: {
                    x: {
                        format: 'dd/MM/yy HH:mm'
                    },
                }
            },
            series: [{
                name: '溫度',
                data: [31, 40, 28, 51, 42, 109, 100]
            }, {
                name: '濕度',
                data: [11, 32, 45, 32, 34, 52, 41]
            }],
        }
    }

    render() {
        return (


            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Chart options={this.state.options} series={this.state.series} type="area" height="350" width="500" />
                <h1>現在溫度</h1>
                <h1>現在濕度</h1>
            </div>


        );
    }
}

export default HumidChart;
