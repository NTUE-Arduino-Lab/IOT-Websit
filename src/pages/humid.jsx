import React, {Component} from 'react';
import Chart from 'react-apexcharts'
import axios from 'axios';

import '../theme/humid.css'

import {tempAndHumidityRef} from '../firebase';

class HumidChart extends Component {

    constructor(props) {
        super(props);

        this.initCurrent = new Date('2019-12-30T23:02:00');
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
                    // categories: ["2019-12-31T21:31:05", "2019-12-31T21:31:10", "2019-12-31T21:31:15", "2019-12-31T21:31:20", "2019-12-31T21:31:25", "2019-12-31T21:31:30", "2019-12-31T21:31:35"],
                    categories: [
                        this.getCurrentTime(this.initCurrent, 30),
                        this.getCurrentTime(this.initCurrent, 25),
                        this.getCurrentTime(this.initCurrent, 20),
                        this.getCurrentTime(this.initCurrent, 15),
                        this.getCurrentTime(this.initCurrent, 10),
                        this.getCurrentTime(this.initCurrent, 5),
                        this.getCurrentTime(this.initCurrent),
                    ],
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
                data: [
                    this.getRandomTemperature(),
                    this.getRandomTemperature(),
                    this.getRandomTemperature(),
                    this.getRandomTemperature(),
                    this.getRandomTemperature(),
                    this.getRandomTemperature(),
                    this.getRandomTemperature(),
                ]
            }, {
                name: '濕度',
                // data: [11, 32, 45, 32, 34, 52, 41]
                data: [
                    this.getRandomHumidity(),
                    this.getRandomHumidity(),
                    this.getRandomHumidity(),
                    this.getRandomHumidity(),
                    this.getRandomHumidity(),
                    this.getRandomHumidity(),
                    this.getRandomHumidity(),
                ]
            }],
            currentTemperature: 0,
            currentHumidity: 0,
        }
    }

    async componentDidMount() {
        const querySnapshot = await tempAndHumidityRef.orderBy('timeStamp', "asc").get();
        // console.log(querySnapshot);
        const data = querySnapshot.docs.map(doc => doc.data());
        console.log(data);

        this.intervalId = setInterval(async () => {
            // await this.handleFetchData();
        }, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    getCurrentTime(initObj = null, tolerance = 0) {

        let current = initObj;

        let currentHour;
        let currentMinute;
        let currentSecond;

        if (initObj == null) {
            current = new Date(Date.now());
        }
        currentHour = this.checkAndAppendZero(current.getHours());
        currentMinute = current.getMinutes();
        currentSecond = this.checkAndAppendZero(current.getSeconds());

        if(initObj !== null) {
            if (currentMinute < 30) {
                /** 初始化，少於 30 分 **/
                currentHour = currentHour - 1;
                currentMinute = currentMinute + 60 - tolerance;

                if(currentMinute >= 60) {
                    currentHour++;
                    currentMinute = currentMinute - 60;
                    currentMinute = this.checkAndAppendZero(currentMinute);
                }

            }
        }

        const timeStamp = `2019-12-31T${currentHour}:${currentMinute}:${currentSecond}`;

        console.log(timeStamp);

        return timeStamp;
    }

    checkAndAppendZero(input) {
        if(input.toString().length === 1) {
            input = `0${input}`;
        }
        return input;
    }

    getRandomTemperature() {
        const max = 90;
        const min = 30;
        const randomTemperature = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomTemperature;
    }

    getRandomHumidity() {
        const max = 90;
        const min = 30;
        const randomHumidity = Math.floor(Math.random() * (180 - min + 1)) + min;
        return randomHumidity;
    }

    async handleFetchData() {

        let response;
        let fetchedData;
        let currentTemperature;
        let currentHumidity;

        try {
            response = await axios.get('http://192.168.0.106/');
            fetchedData = response.data.split(',');
            currentTemperature = fetchedData[0];
            currentHumidity = fetchedData[1];
        } catch (e) {
            console.log('Internet error...');

            currentTemperature = this.getRandomTemperature();
            currentHumidity = this.getRandomHumidity();

        }

        const timeStamp = this.getCurrentTime();

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
