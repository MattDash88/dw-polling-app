import React from 'react';
import 'semantic-ui-react'
import {
    Container,
    Label,
    Form,
    Checkbox,
    Segment,
    Button,
    Divider,
    TextArea,
    Input,
    Message,
    Dimmer,
} from 'semantic-ui-react';

import Header from '../components/headers/IndexHeader';
import VoteOptions from '../components/client_components/VoteOptions';
import VoteMessage from '../components/client_components/VoteMessage';


class Poll extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            responseStatus: '',
            responseMessage: '',
            payload: '',
            voteMessageVisible: false,
            activeStep: 1
        }

        // Bind functions used in class
        this.setMessage = this.setMessage.bind(this);
        this.moveToStep = this.moveToStep.bind(this);
        this.handleResponse = this.handleResponse.bind(this);
        this.clearMessages = this.clearMessages.bind(this);
    }

    setMessage(message) {
        this.setState({
            payload: message,
        });
        this.moveToStep(2);
    };

    moveToStep(stepNumber) {
        let voteMessageVisible = false;
        switch (stepNumber) {
            case 1:
                voteMessageVisible = false;
                break;
            case 2:
                voteMessageVisible = true;
                break;
            default:
                break;
        }

        this.clearMessages();
        this.setState({
            voteMessageVisible,
            activeStep: stepNumber,
        });
    };

    handleResponse(responseStatus, responseMessage) {
        this.setState({
            responseStatus: responseStatus,
            responseMessage: responseMessage,
        });
    };

    clearMessages() {
        this.setState({
            responseStatus: '',
            responseMessage: '',
        });
    };    
    render() {
        return (
            <div className="ui container" style={{
                marginTop: '20px',
            }}>
                <Header />
                <VoteOptions
                    label="1. Choose your voting option:"
                    setMessage={this.setMessage}
                    shouldDim={!(this.state.activeStep === 1)}
                    moveToStep={this.moveToStep}
                />

                <VoteMessage
                    label="2. Sign Message Using MN Voting Address Key"
                    payload={this.state.payload}
                    handleResponse={this.handleResponse}
                    clearMessages={this.clearMessages}
                    visible={this.state.voteMessageVisible}
                />

                {
                    this.state.responseStatus == 'Success' && (
                            <Container>
                            <Message
                            success
                            header={this.state.responseStatus}
                            content={this.state.responseMessage}
                            />
                            </Container>
                    ) 
                }

                {
                   this.state.responseStatus == 'Error' && (
                    <Container>
                            <Message
                            error
                            header={this.state.responseStatus}
                            content={this.state.responseMessage}
                            />
                            </Container>
                    ) 
                }
            </div>
        )
    }
}

export default Poll