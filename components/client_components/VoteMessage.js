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
import axios from 'axios';
import copy from 'clipboard-copy';

class VoteMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            signature: '',
            database: 'votes'
        }

        // Bind functions used in class
        this.copyToClipboard = this.copyToClipboard.bind(this);
    }

    copyToClipboard = event => {
        copy(this.props.payload);
    };

    onAddressChange = event => {
        this.setState({ address: event.target.value.trim() });
        this.props.clearMessages();
    };

    onSignatureChange = event => {
        this.setState({ signature: event.target.value.trim() });
        this.props.clearMessages();
    };

    // Prevent page from reloading on form submit
    onFormSubmit = event => {
        event.preventDefault();
    };

    validateFieldLengths = () => {
        let ok = true;
        if (!this.state.address.length > 0) {
            ok = false;
        }
        if (!this.state.signature.length > 0) {
            ok = false;
        }

        return ok;
    };

    handleResponse(responseStatus, responseMessage) {
        this.props.handleResponse(responseStatus, responseMessage)
    }

    submitVote = async event => {
        const { signature, address, database } = this.state;
        const message = this.props.payload;
        this.props.clearMessages();
        if (!this.validateFieldLengths()) {
            var errorMessage = 'Address and/or Signature fields cannot be empty'
            return this.handleResponse('Error', errorMessage)
        } else {
            // TODO: handle network errors / what if promise never returned?
            axios.post('/poll/vote', {
                db: 'votes',
                addr: address,
                msg: message,
                sig: signature,
            }).then((response) => {
                return this.handleResponse('Success', response.data)
            }).catch(error => {
                return this.handleResponse('Error', error.response.data)
            })
        }
    };

    render() {
        const { visible } = this.props;
        if (!visible) {
            return null;
        }

        return (
            <Container as={Segment}>
                Would you support a treasury proposal to buy a Lambo for all Dash Watch Report Team members?
                 <Form>
                    <TextArea disabled value={this.props.payload} />
                </Form>
                <Divider hidden />
                <Button className="ui primary" onClick={this.copyToClipboard}>
                    Copy to Clipboard
                </Button>

                <Divider hidden />

                <Form onSubmit={this.onFormSubmit}>
                    <Input
                        fluid
                        placeholder="Masternode Voting Address Key"
                        value={this.state.address}
                        onChange={this.onAddressChange}
                    />
                    <Input
                        fluid
                        placeholder="Message Signature"
                        value={this.state.signature}
                        onChange={this.onSignatureChange}
                    />
                    <Divider hidden />
                    <Button className="ui primary" onClick={this.submitVote}>
                        Submit Vote
                    </Button>
                </Form>
            </Container>
        )
    }
}

export default VoteMessage