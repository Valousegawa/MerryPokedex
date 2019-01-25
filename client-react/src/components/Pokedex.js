import React, {PropTypes, Component} from 'react'
import {isConfigured} from '../utils/authservice'
import {Button, Glyphicon} from 'react-bootstrap'
import SpeechRecognition from 'react-speech-recognition'

import {getExpressions, sendRequest, subscribeToEvent} from '../utils/serverhome-api'
import {searchRequest} from '../utils/voice-helper'


const propTypes = {
    // Props injected by SpeechRecognition
    transcript: PropTypes.string,
    resetTranscript: PropTypes.func,
    browserSupportsSpeechRecognition: PropTypes.bool
};

class Pokedex extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expressions: [],
            conversation: []
        };
    }

    componentDidMount() {
        if (!isConfigured()) return;
        var self = this;
        getExpressions().then((expressions) => {
            self.setState({"expressions": expressions});
            if (self.props.recognition) {
                self.props.recognition.onresult = function (event) {
                    var result = event.results[event.results.length - 1];
                    if (result.isFinal) {
                        var objRequest = searchRequest(result[0].transcript, expressions);
                        console.log({
                            "transcript": result[0].transcript,
                            "data": objRequest
                        });
                        document.getElementById("voice").value = result[0].transcript;
                        if (objRequest && objRequest.plugin) {
                            self.sendData(objRequest);
                        }
                    }
                };
            }
        });
    }

    sendData(objRequest) {
        sendRequest(objRequest.plugin, objRequest.action, objRequest.data).then((data) => {
            if (data.resultText) {
                var utterThis = new SpeechSynthesisUtterance(data.resultText);
                utterThis.lang = 'fr-FR';
                console.log({"response": data.all});
                this.showData(data.all, data.fr);
                window.speechSynthesis.speak(utterThis);
            }
        });
    }

    showData(pkmnDetails, frName) {
        var x = 0;
        var intervalID = setInterval(function () {
            if (x % 2 === 0) {
                document.getElementById('sensorLight').style.backgroundColor = "#71cdf4";
            } else {
                document.getElementById('sensorLight').style.backgroundColor = "#119ad5";
            }

            if (++x === 8) {
                window.clearInterval(intervalID);
            }
        }, 500);
        if (pkmnDetails) {
            document.getElementById('pkmnSprite').src = pkmnDetails.sprites.front_default;
            document.getElementById('pkmnName').innerHTML = frName;
            document.getElementById('pkmnId').innerHTML = "N°" + pkmnDetails.id;
            document.getElementById('pkmnPoids').innerHTML = pkmnDetails.weight / 10 + " kg";
            document.getElementById('pkmnTaille').innerHTML = pkmnDetails.height / 10 + " m";
            document.getElementById('hiddenId').value = pkmnDetails.id;
        }
    }

    sendTextData() {
        var objRequest = searchRequest(document.getElementById("voice").value, this.state.expressions);
        console.log({"transcript": document.getElementById("voice").value, "data": objRequest});

        if (objRequest && objRequest.plugin) {
            this.sendData(objRequest);
        }
    }

    fillSearch() {
        document.getElementById("voice").value = "Pokémon numéro 151";
        this.sendTextData();
    }

    fillSearch2() {
        document.getElementById("voice").value = "donne le poids de Pikachu";
        this.sendTextData();
    }

    fillSearch3() {
        document.getElementById("voice").value = "donne la taille de Tortank";
        this.sendTextData();
    }

    fillSearch4() {
        document.getElementById("voice").value = "que sais-tu faire";
        this.sendTextData();
    }

    fillSearch5() {
        document.getElementById("voice").value = "Pokémon Kyogre";
        this.sendTextData();
    }

    next() {
        var nextId = parseInt(document.getElementById('hiddenId').value) + 1;
        if (isNaN(nextId) || nextId > 802) {
            document.getElementById("voice").value = "Pokémon numéro 802";
        } else {
            document.getElementById("voice").value = "Pokémon numéro " + nextId;
        }
        this.sendTextData();
    }

    forward() {
        var nextId = parseInt(document.getElementById('hiddenId').value) - 1;
        if (isNaN(nextId) || nextId < 1) {
            document.getElementById("voice").value = "Pokémon numéro 1";
        } else {
            document.getElementById("voice").value = "Pokémon numéro " + nextId;
        }
        this.sendTextData();
    }

    upB() {
        var nextId = parseInt(document.getElementById('hiddenId').value) + 10;
        if (isNaN(nextId) || nextId < 1) {
            document.getElementById("voice").value = "Pokémon numéro 1";
        } else {
            document.getElementById("voice").value = "Pokémon numéro " + nextId;
        }
        this.sendTextData();
    }

    downB() {
        var nextId = parseInt(document.getElementById('hiddenId').value) - 10;
        if (isNaN(nextId) || nextId < 1) {
            document.getElementById("voice").value = "Pokémon numéro 1";
        } else {
            document.getElementById("voice").value = "Pokémon numéro " + nextId;
        }
        this.sendTextData();
    }

    playB() {
        document.getElementById("voice").value = "Pokémon " + document.getElementById("pkmnName").innerHTML;
        this.sendTextData();
    }

    joke() {
        document.getElementById("voice").value = "raconte une blague";
        this.sendTextData();
    }

    render() {
        const {startListening, stopListening, browserSupportsSpeechRecognition} = this.props;
        return (
            <div>
                <br/>
                <br/>
                <div id="pokedex">
                    <div className="sensor">
                        <button id="sensorLight"></button>
                    </div>
                    <div className="camera-display">
                        <img id="pkmnSprite"/>
                    </div>
                    <div className="divider"></div>
                    <div className="stats-display">
                        <input type="hidden" id="hiddenId"/>
                        <h3 id="pkmnName">--</h3>
                        <h4 id="pkmnId">--</h4>
                        <h4>Poids</h4>
                        <h5 id="pkmnPoids">- kg</h5>
                        <h4>Taille</h4>
                        <h5 id="pkmnTaille">- m</h5>
                    </div>
                    <div className="botom-actions">
                        <div id="actions">
                            <button id="a" className="a" onClick={this.playB.bind(this)}><Glyphicon glyph="info-sign"/>
                            </button>
                            {this.props.listening ?
                                <Button id="b" className="a a_bis" onClick={stopListening}><Glyphicon
                                    glyph="stop"/></Button> :
                                <Button id="b" className="a a_bis" onClick={startListening}><Glyphicon
                                    glyph="play"/></Button>}
                        </div>
                        <div id="cross">
                            <button className="cross-button up" onClick={this.upB.bind(this)}></button>
                            <button className="cross-button right" onClick={this.forward.bind(this)}></button>
                            <button className="cross-button down" onClick={this.downB.bind(this)}></button>
                            <button className="cross-button left" onClick={this.next.bind(this)}></button>
                            <div className="cross-button center" onClick={this.joke.bind(this)}></div>
                        </div>
                    </div>
                    <div className="input-pad"><input type="text" id="voice"/></div>

                    <div className="bottom-modes">

                        <button className="level-button" onClick={this.fillSearch.bind(this)}>1</button>
                        <button className="level-button" onClick={this.fillSearch2.bind(this)}>2</button>
                        <button className="level-button" onClick={this.fillSearch3.bind(this)}>3</button>
                        <button className="level-button" onClick={this.fillSearch5.bind(this)}>4</button>

                        <button className="pokedex-mode black-button"
                                onClick={this.sendTextData.bind(this)}>Rechercher
                        </button>
                        <button className="game-mode black-button" onClick={this.fillSearch4.bind(this)}>Intro</button>

                    </div>

                </div>
            </div>
        );
    };
};

Pokedex.propTypes = propTypes;

const options = {
    autoStart: false
};

export default SpeechRecognition(options)(Pokedex);