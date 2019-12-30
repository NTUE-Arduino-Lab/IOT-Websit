import React, {Component} from 'react';
import Chart from 'react-apexcharts'
import axios from 'axios';

import '../theme/humid.css'

import {tempAndHumidityRef} from '../firebase';

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
                    labels: {
                        format: 'HH:mm',
                    },
                    // categories: ["2019-12-31T21:31:05", "2019-12-31T21:31:10", "2019-12-31T21:31:15", "2019-12-31T21:31:20", "2019-12-31T21:31:25", "2019-12-31T21:31:30", "2019-12-31T21:31:35"],
                    categories: [],
                },
                tooltip: {
                    x: {
                        format: 'yyyy/MM/dd HH:mm'
                    },
                }
            },
            series: [{
                name: '溫度',
                // data: [31, 40, 28, 51, 42, 109, 100]
                data: []
            }, {
                name: '濕度',
                // data: [11, 32, 45, 32, 34, 52, 41]
                data: []
            }],
            currentTemperature: 0,
            currentHumidity: 0
        }
    }

    async componentDidMount() {
        const querySnapshot = await tempAndHumidityRef.orderBy('timeStamp', "asc").get();
        // console.log(querySnapshot);
        const data = querySnapshot.docs.map(doc => doc.data());
        console.log(data);

        this.intervalId = setInterval(async () => {
            await this.handleFetchData();
        }, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    async handleFetchData() {

        const max = 90;
        const min = 30;

        const response = await axios.get('http://192.168.0.106/');
        const fetchedData = response.data.split(',');
        const currentTemperature = fetchedData[0];
        const currentHumidity = fetchedData[1];


        const randomTemperature = Math.floor(Math.random() * (max - min + 1)) + min;
        const randomHumidity = Math.floor(Math.random() * (180 - min + 1)) + min;


        const current = new Date(Date.now());

        const currentHour = current.getHours();
        const currentMinute = current.getMinutes();
        const currentSecond = current.getMinutes();

        const timeStamp = `2019-12-31T${currentHour}:${currentMinute}:${currentSecond}`;

        console.log('making request...')

        this.setState({
            options: {
                ...this.state.options,
                xaxis: {
                    ...this.state.options.xaxis,
                    categories: this.state.options.xaxis.categories.concat(timeStamp),
                }
            },
            series: [
                {
                    name: '溫度',
                    data: this.state.series[0].data.concat(currentTemperature),
                },
                {
                    name: '濕度',
                    data: this.state.series[1].data.concat(currentHumidity),
                }
            ],
            currentTemperature,
            currentHumidity
        })


    }

    render() {


        // this.handleFetchData();

        return (


            <div className="humid-container">
                <Chart options={this.state.options} series={this.state.series} type="area" height="350" width="500"/>
                <DashboardElement label="溫度" value={this.state.currentTemperature}/>
                <DashboardElement label="濕度" value={this.state.currentHumidity}/>
            </div>

        );
    }
}

const DashboardElement = ({label, value}) => {
    return (
        <div className="element-container">
            <h1>{label}</h1>
            <h2>{value}</h2>
        </div>
    );
};

export default HumidChart;
