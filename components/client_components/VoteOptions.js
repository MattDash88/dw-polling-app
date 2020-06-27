import React from 'react';
import 'semantic-ui-react'
import {
    Header,
    Label,
    Form,
    Segment,
    Button,
    Divider,
    Icon,
    Message,
    Dimmer,
} from 'semantic-ui-react';

import CandidateOptions from './candidates.json';
import CandidateList from './CandidateList';

var labelText = "1. Select your candidate(s)"
// The message prefix is pre-pended to the message to be signed. This should
    // be unique per application, not generic. For more info, see:
    // https://bitcoin.stackexchange.com/questions/3337/what-are-the-safety-guidelines-for-using-the-sign-message-feature/3339#3339
let messagePrefix = 'dif2020-';

class VoteOptions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: messagePrefix,
            value: new Set(),
        }

        // Bind functions used in class
        this.onContinueButtonPress = this.onContinueButtonPress.bind(this);
        this.onBlankButtonPress = this.onBlankButtonPress.bind(this);
        this.onResetButtonClick = this.onResetButtonClick.bind(this);
    }

    handleChange = (e, { value, checked }) => {
        let stateValue = this.state.value;

        if (checked === true) {
            stateValue.add(value);
        } else {
            stateValue.delete(value);
        }

        const message = messagePrefix + [...stateValue].join('|');

        this.setState({
            value: stateValue,
            message: message,
        })
    }

    onContinueButtonPress(event) {
        this.props.setMessage(this.state.message);
    };

    onBlankButtonPress(event) {
        let blankMessage = messagePrefix
        this.props.setMessage(blankMessage);
    };

    // Prevent page from reloading on form submit
    onFormSubmit = event => {
        event.preventDefault();
    };

    onResetButtonClick() {
        console.log('Clicked reset button');
        this.props.moveToStep(1);
    };

    render() {
        return (
            <main>
                <Dimmer.Dimmable as={Segment} dimmed={this.props.shouldDim}>
                    <Label as="a" ribbon>
                        {labelText}
                    </Label>
                    <Divider hidden />  
                    <Segment raised> 
                    <Header as='h4'>Please select your candidate(s), (you may select as many as you want):</Header>              
                    <Form onSubmit={this.onFormSubmit} size={'big'}>                    
                        <Form.Field>
                            <CandidateList
                                candidates={CandidateOptions}
                                onChange={this.handleChange}
                            />
                        </Form.Field>
                        <div>
                       <Button onClick={this.onContinueButtonPress} className="ui primary" style={{
                            marginRight: '20px',
                        }}>
                            Continue
                        </Button>
                        <Button onClick={this.onBlankButtonPress} className="ui secondary" style={{
                            marginRight: '20px',
                        }}>
                            Vote Blank
                        </Button>
                        </div>
                    </Form>
                    </Segment>
                    <Divider hidden />
                    <Message compact warning><Icon name='warning' />Voting will end on Friday July 10, 2020 at 23.59 GMT.</Message>
                    <Dimmer active={this.props.shouldDim}>
                        Options Selected - Scroll down to continue voting
            <Divider hidden />
                        <Button
                            inverted
                            value="Reset Selections"
                            onClick={this.onResetButtonClick}
                        >
                            Reset Selection
                        </Button>
                    </Dimmer>
                </Dimmer.Dimmable>
            </main>
        )
    }
}

export default VoteOptions