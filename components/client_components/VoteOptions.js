import React from 'react';
import 'semantic-ui-react'
import {
    Container,
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

var labelText = "1. Choose your candidate(s), (select as many as you want):"

class VoteOptions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: 'tpe2020-',
            value: new Set(),
        }

        // Bind functions used in class
        this.onButtonPress = this.onButtonPress.bind(this);
        this.onResetButtonClick = this.onResetButtonClick.bind(this);
    }

    // The message prefix is pre-pended to the message to be signed. This should
    // be unique per application, not generic. For more info, see:
    // https://bitcoin.stackexchange.com/questions/3337/what-are-the-safety-guidelines-for-using-the-sign-message-feature/3339#3339
    messagePrefix = 'tpe2020-';

    handleChange = (e, { value, checked }) => {
        let stateValue = this.state.value;

        if (checked === true) {
            stateValue.add(value);
          } else {
            stateValue.delete(value);
        }

        const message = this.messagePrefix + [...stateValue].join('|');

        this.setState({
            value: stateValue,
            message: message,
        })
    }

    onButtonPress(event) {
        this.props.setMessage(this.state.message);
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
        console.log(CandidateOptions)
        return (
            <main>
                <Container>
                    <Dimmer.Dimmable as={Segment} dimmed={this.props.shouldDim}>
                    <Label as="a" ribbon>
                        {labelText}
                    </Label>
                        <Divider hidden />
                        <Form onSubmit={this.onFormSubmit} size={'big'}>
                            <Form.Field>
                                <CandidateList
                                    candidates={CandidateOptions}
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                            <Divider hidden />
                            <Button onClick={this.onButtonPress} className="ui primary">
                                Continue
                            </Button>
                        </Form>
                        <Divider hidden />
                        <Message compact warning><Icon name='warning' />Votes cast before April 21st will not count.</Message>
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
                </Container>
            </main>
        )
    }
}

export default VoteOptions