import React, { Component } from 'react';
import { Chart } from 'react-google-charts';
import './App.css'

const Quotes = require('./quotes.js');

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageLink: "NULL",
            statDisplay: {display: "none"},
            calledOnImage: false,

            genQuote: "Hit 'Generate Caption' on an analyzed image to generate a new quote!",

            valAnger: 1,
            valContempt: 1,
            valDisgust: 1,
            valFear: 1,
            valHappiness: 1,
            valNeutral: 1,
            valSadness: 1,
            valSurprise: 1,

            valMoustache: 0,
            valSideburns: 0,
            valBeard: 0,
            valBald: 0
        }
    }

    render() {
        return (
            <div className="App">
                <div style={{
                    background: 'lightblue',
                    height: '100px',
                }}>
				<h1><b>Depicturself</b></h1>
				<p><b>Brendan, Caleb, Charles, James</b></p>
                </div>
                <div className="pt-4">
                    <p>Input a valid image URL here and click "Analyze Face."</p>
                </div>
                <div className="container-fluid col-md-8 col-sm-8 pb-4">
                    <input type="text" className="form-control" onChange={this.onTextChange.bind(this)}/>
                </div>
                <div className="container-fluid pb-4">
                    <button type="button" className="btn btn-default"
                            onClick={this.onCallBtnChange.bind(this)}>Analyze Face
                    </button>
                </div>
                <div className="pb-4">
                    <img style={{
                        height: '500px'
                    }} src={this.state.imageLink} alt="Link Invalid"/>
                </div>
                <div>
                    <p>{this.state.genQuote}</p>
                </div>
                <div>
                    <button type="button" className="btn btn-default col-md-12 pb-2" style={{
                        display: (this.state.calledOnImage ? 'block' : 'none')}}
                            onClick={this.onGenButtonChange.bind(this)}>Generate Caption</button>
                    <button type="button" className="btn btn-default col-md-12" style={{
                        display: (this.state.calledOnImage ? 'block' : 'none')}}
                            onClick={this.onStatBtnChange.bind(this)}>
                        {this.state.statDisplay.display === "none" ? "Show" : "Hide"} Statistics
                    </button>
                </div>
                <div style={this.state.statDisplay}>
                    <Chart
                        chartType="PieChart"
                        data={[['Emotion', 'Level'],
                            ['Anger', this.state.valAnger],
                            ['Contempt', this.state.valContempt],
                            ['Disgust', this.state.valDisgust],
                            ['Fear', this.state.valFear],
                            ['Happiness', this.state.valHappiness],
                            ['Neutral', this.state.valNeutral],
                            ['Sadness', this.state.valSadness],
                            ['Surprise', this.state.valSurprise]]}
                        options={{}}
                        graph_id="PieChart"
                        width="100%"
                        height="400px"/>

                </div>
                <div style={this.state.statDisplay}>
                    <Chart
                        chartType="Gauge"
                        data={[['Label', 'Value'],
                            ['Moustache', this.state.valMoustache],
                            ['Beard', this.state.valBeard],
                            ['Sideburns', this.state.valSideburns],
                            ['Baldness', this.state.valBald]]}
                        options={{
                            width: '400px',
                            height: '166px',
                            redFrom: '90',
                            redTo: '100',
                            yellowFrom:'75',
                            yellowTo: '90',
                            minorTicks: '5'
                        }}
                        graph_id="Gauge"
                        width="100%"
                        height="200px"/>
                </div>
            </div>
        );
    }

    onTextChange(e) {
        this.setState({calledOnImage: false});
        this.setState({imageLink: e.target.value});
    }

    onStatBtnChange() {
        let displayMode = this.state.statDisplay.display === "none" ? "block" : "none";
        this.setState({statDisplay: {display: displayMode}});
    }

    onCallBtnChange() {
        fetch("https://eastus.api.cognitive.microsoft.com/face/v1.0/detect?" +
            "returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=" +
            "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup," +
            "occlusion,accessories,blur,exposure,noise", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Ocp-Apim-Subscription-Key": "453736a436de4f6aa50216a0dc0f7033"
            },
            body: JSON.stringify({
                "url": this.state.imageLink
            })
        }).then(res => {
            return res.json();
        }).catch(console.log).then(
            // Update all values
            data => {
                this.setState({valAnger: data[0].faceAttributes.emotion.anger});
                this.setState({valContempt: data[0].faceAttributes.emotion.contempt});
                this.setState({valDisgust: data[0].faceAttributes.emotion.disgust});
                this.setState({valFear: data[0].faceAttributes.emotion.fear});
                this.setState({valHappiness: data[0].faceAttributes.emotion.happiness});
                this.setState({valNeutral: data[0].faceAttributes.emotion.neutral});
                this.setState({valSadness: data[0].faceAttributes.emotion.sadness});
                this.setState({valSurprise: data[0].faceAttributes.emotion.surprise});
                this.setState({valMoustache: data[0].faceAttributes.facialHair.moustache * 100});
                this.setState({valSideburns: data[0].faceAttributes.facialHair.sideburns * 100});
                this.setState({valBeard: data[0].faceAttributes.facialHair.beard * 100});
                this.setState({valBald: data[0].faceAttributes.hair.bald * 100});

                this.setState({calledOnImage: true});
            }
        ).catch(console.log);
    }

    onGenButtonChange() {
        let ratingArr = [this.state.valAnger, this.state.valContempt,
            this.state.valDisgust, this.state.valFear, this.state.valHappiness,
            this.state.valNeutral, this.state.valSadness, this.state.valSurprise];
        let maxRating = Math.max(...ratingArr);
        let emotionIndex = ratingArr.indexOf(maxRating);
        this.setState({genQuote: Quotes.quotes[emotionIndex][Math.floor(Math.random() * Quotes.quotes[emotionIndex].length)]});
    }
}

export default App;
