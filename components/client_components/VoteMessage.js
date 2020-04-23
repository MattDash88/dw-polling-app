import React from 'react';
import 'semantic-ui-react'
import {
    Header,
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

var reviewLabelText = "2. Review your candidate selection"
var submitLabelText = "3. Submit your vote"

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
            console.log(`Vote submitted ${message}`)
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
            <main>
            <Segment>
                <Label as="a" ribbon>
                    {reviewLabelText}
                </Label>
                <Header as='h4'>Please review your candidate selection:</Header> 
                <Form>                    
                    <TextArea disabled value={this.props.payload} />
                </Form>
                <Divider hidden />
                <Button className="ui primary" onClick={this.copyToClipboard}>
                    Copy Message to Clipboard
                </Button>
                </Segment>
                <Segment>
                <Label as="a" ribbon>
                    {submitLabelText}
                </Label>     
                <Header as='h4'>Please sign your voting message with your Masternode address and cast your vote:</Header>           
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
                <Divider hidden />
                {this.props.showVotingWarning && <Message compact>
                        <p>You may use the voting (recommended), owner or collateral address associated with your Masternode to vote.</p>                        
                        <p>It is possible to vote multiple times using a Masternode address, for example if you made a mistake in your vote or changed your mind. In the case of multiple votes, only the most recent vote cast using an address associated with a Masternode will count.</p>
                        </Message>}                      
            </Segment>
            </main>
            
        )
    }
}

export default VoteMessage