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
    Icon,
    Message,
    Dimmer,
} from 'semantic-ui-react';

class VoteOptions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: 'dif2019_poll1-',
            value: new Set(),
        }

        // Bind functions used in class
        this.onButtonPress = this.onButtonPress.bind(this);
        this.onResetButtonClick = this.onResetButtonClick.bind(this);
    }

    messagePrefix = 'dif2019_poll1-';

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
        return (
            <main>
                <Container>
                    <Dimmer.Dimmable as={Segment} dimmed={this.props.shouldDim}>
                        <h3>MNO poll for the Dash Investment Foundation</h3>
                        <h5>How would you like the Dash Investment Foundation to hedge its designated investment funds?</h5>
                        <p><i>As mentioned in our recent update video, the DIF prefers to hedge its designated investment funds via a provisional split of 33.3% Dash, 33.3% USD, and 33.3% custodial gold. Our goal with this split is to protect against volatility and ensure a steady build up of reserves. We acknowledge, however, that the network may have a different preference. Therefore, please select one or more preferences below and we'll seek to implement the one with the highest overall approval rating, subject to availability and suitability of deposit/custodial facilities:</i></p>
                        <h5>Options</h5>
                        <p>
                            <li>100% Dash - Hold liquid reserves 100% in Dash</li>
                            <li>50:50 Dash/Gold - Hedge liquid reserves 50:50 between Dash/Custodial Gold</li>
                            <li>33:33:33 Dash/USD/Custodial Gold - Hedge liquid reserves equally between Dash/USD/Custodial Gold</li>
                            <li>33:33:33 Dash/BTC/Custodial Gold - Hedge liquid reserves equally between Dash/BTC/Custodial Gold.</li>
                            <li>100% USD - Hedge liquid reserves 100% into USD.</li>
                            <li>50:50 Dash/USD - Hedge liquid reserves 50/50 Dash /USD.</li>
                        </p>
                        <Divider />
                        <h5>How would you like the Dash Investment Foundation to hedge its designated investment funds?</h5>
                        <Form onSubmit={this.onFormSubmit}>
                            <Form.Field>
                                <Checkbox
                                    label='100% Dash'
                                    value='100dash'
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Checkbox
                                    label='50:50 Dash/Gold'
                                    value='dash-gold'
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Checkbox
                                    label='33:33:33 Dash/USD/Custodial Gold'
                                    value='dash-usd-gold'
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Checkbox
                                    label='33:33:33 Dash/BTC/Custodial Gold'
                                    value='dash-btc-gold'
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Checkbox
                                    label='100% USD'
                                    value='100usd'
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Checkbox
                                    label='50:50 Dash/USD'
                                    value='dash-usd'
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                            <Divider hidden />
                            <Button onClick={this.onButtonPress} className="ui primary">
                                Continue
                            </Button>
                        </Form>
                        <Divider hidden />
                        <Message compact warning><Icon name='warning'/>The poll will close on September 23rd, 2019 at 23.59 UTC.</Message>
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