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
            <Container>
                <Dimmer.Dimmable as={Segment} dimmed={this.props.shouldDim}>
                    Would you support a treasury proposal to buy a car for all Dash Watch Report Team members?
                <Form.Field>
                        <Checkbox
                            radio
                            label='No'
                            name='checkboxRadioGroup'
                            value='no'
                            checked={this.state.value === 'no'}
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Checkbox
                            radio
                            label='Yes'
                            name='checkboxRadioGroup'
                            value='yes'
                            checked={this.state.value === 'yes'}
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Checkbox
                            radio
                            label='Would like to, but can only afford a Tata Nano'
                            name='checkboxRadioGroup'
                            value='tata-nano-option'
                            checked={this.state.value === 'tata-nano-option'}
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
                    </Dimmer>
                </Dimmer.Dimmable>
            </Container>
        )
    }
}

export default VoteOptions