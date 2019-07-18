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
    Input,
    Message,
    Dimmer,
} from 'semantic-ui-react';

class VoteOptions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: 'dw2019_consensuspoll1-',
            value: '',
        }

        // Bind functions used in class
        this.onButtonPress = this.onButtonPress.bind(this);
        this.onResetButtonClick = this.onResetButtonClick.bind(this);
    }

    handleChange = (e, { value }) => {
        this.setState({
            value: value,
            message: `dw2019_consensuspoll1-${value}`,
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
        return (
            <main>
                <Container>
                    <Dimmer.Dimmable as={Segment} dimmed={this.props.shouldDim}>
                        <h3>Dash Watch Consensus Poll 1</h3>
                        <h5>Options</h5>
                        <p><i>Context: How do MNOs want to handle consensus voting results?</i></p>
                        <p>
                            <li>Fully Public – real time results available with fully transparent vote data, including: voting public key, vote decision, and vote time.  </li>
                            <li>Semi-Private – semi-live* results available with generated voter IDs to obscure voting public key. Vote decision and vote time are still available </li>
                            <li>Live-Private – semi-live* results that only shows the total votes for each voting option and Masternode participation percentages. </li>
                            <li>Delayed-Private – semi-live* results that shows only the Masternode participation percentages. Results are not released until after the voting has closed.</li>
                        </p>
                        <p>*Semi-live is defined as 12-36 hours lag time in results due to manual calculation of the Masternode list. This may be solved in future iterations once/if the Insights API is fixed.</p>
                        <Divider />
                        <h5> How should consensus vote results be displayed during the voting process?</h5>
                        <Form onSubmit={this.onFormSubmit}>
                            <Form.Field>
                                <Checkbox
                                    radio
                                    label='Fully Public'
                                    name='checkboxRadioGroup'
                                    value='fully-public'
                                    checked={this.state.value === 'fully-public'}
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Checkbox
                                    radio
                                    label='Semi Private'
                                    name='checkboxRadioGroup'
                                    value='semi-private'
                                    checked={this.state.value === 'semi-private'}
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Checkbox
                                    radio
                                    fluid
                                    label='Live Private'
                                    name='checkboxRadioGroup'
                                    value='live-private'
                                    checked={this.state.value === 'live-private'}
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Checkbox
                                    radio
                                    fluid
                                    label='Delayed-Private'
                                    name='checkboxRadioGroup'
                                    value='delayed-private'
                                    checked={this.state.value === 'delayed-private'}
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                            <Divider hidden />
                            <Button onClick={this.onButtonPress} className="ui primary">
                                Continue
                            </Button>
                        </Form>
                        <Divider hidden />
                        <Message compact info>The poll closes on 23.59 August 3, 2019 (UTC).</Message>
                        <Dimmer active={this.props.shouldDim}>
                            Option Selected
            <Divider hidden />
                            <Button
                                inverted
                                value="Reset Selections"
                                onClick={this.onResetButtonClick}
                            >
                                Reset Selections
                        </Button>
                        </Dimmer>
                    </Dimmer.Dimmable>
                </Container>
            </main>
        )
    }
}

export default VoteOptions