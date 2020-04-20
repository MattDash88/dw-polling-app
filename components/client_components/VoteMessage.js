import React from 'react';
import 'semantic-ui-react'
import {
    Container,
    Form,
    Label,
    Segment,
    Button,
    Divider,
    TextArea,
    Message,
    Input,
    Icon,
} from 'semantic-ui-react';
import axios from 'axios';
import copy from 'clipboard-copy';

var labelText = "2. Review and submit your candidates :"

class VoteMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            signature: '',
            database: 'tpe2020'
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
                db: this.state.database,
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
                <Label as="a" ribbon>
                    {labelText}
                </Label>
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
                        placeholder="Masternode voting (recommended), owner or collateral address"
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
                {this.props.showVotingWarning && <Message compact>
                        You may use the voting (recommended), owner or collateral address associated with your Masternode to vote. Only the most recent vote cast using an address associated with a Masternode will count.</Message>}
                        <Message compact warning>
                    <Icon name='warning' />
                        Please only submit the Dash address and signature of your vote. We will NEVER ask for a private key.</Message>                       
            </Container>
            
        )
    }
}

export default VoteMessage