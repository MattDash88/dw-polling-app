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
    Dimmer,
} from 'semantic-ui-react';

class VoteOptions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: 'dw2019_LamboVote-',
            value: '',
        }

        // Bind functions used in class
        this.onButtonPress = this.onButtonPress.bind(this);
        this.onResetButtonClick = this.onResetButtonClick.bind(this);
    }

    handleChange = (e, { value }) => {
        this.setState({
            value: value,
            message: `dw2019_LamboVote-${value}`,
        })
    }

    onButtonPress(event) {
        this.props.setMessage(this.state.message);
    };

    onResetButtonClick() {
        console.log('Clicked reset button');
        this.props.moveToStep(1);
    };

    render() {
        return (
            <Dimmer.Dimmable as={Segment} dimmed={this.props.shouldDim}>
                Would you support a treasury proposal to buy a Lambo for all Dash Watch Report Team members?
                <Form.Field>
                    <Checkbox
                        radio
                        label='Yes'
                        name='checkboxRadioGroup'
                        value='Absolutely'
                        checked={this.state.value === 'Absolutely'}
                        onChange={this.handleChange}
                    />
                </Form.Field>
                <Form.Field>
                    <Checkbox
                        radio
                        label='Yes'
                        name='checkboxRadioGroup'
                        value='Totally'
                        checked={this.state.value === 'Totally'}
                        onChange={this.handleChange}
                    />
                </Form.Field>
                <Form.Field>
                    <Checkbox
                        radio
                        label='No'
                        name='checkboxRadioGroup'
                        value='No'
                        checked={this.state.value === 'No'}
                        onChange={this.handleChange}
                    />
                </Form.Field>
                <Divider hidden />
                <Button onClick={this.onButtonPress} className="ui primary">
                    Continue
                </Button>
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
                    <Divider hidden />
                </Dimmer>
            </Dimmer.Dimmable>
        )
    }
}

export default VoteOptions