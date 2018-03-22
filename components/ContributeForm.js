import React, { Component } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import Crowdfund from '../ethereum/crowdfund';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

class ContributeForm extends Component {
    state = {
        value: '',
        loading: false,
        errorMessage: ''
    };

    onSubmit = async (event) => {
        event.preventDefault();

        const crowdfund = Crowdfund(this.props.address);
        this.setState({
            loading: true,
            errorMessage: ''
        });

        try {
            const accounts = await web3.eth.getAccounts();
            await crowdfund.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.value, 'ether')
            });
            Router.replaceRoute(`/crowdfunds/${this.props.address}`);
        } catch (err) {
            this.setState({
                errorMessage: err.message
            });
        }

        this.setState({
            loading: false,
            value: ''
        });
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>投资金额</label>
                    <Input
                        value={this.state.value}
                        onChange={event => this.setState({ value: event.target.value })}
                        label="ether"
                        labelPosition="right"
                    />
                </Form.Field>
                <Message
                    error 
                    header="错误" 
                    content={this.state.errorMessage} 
                />
                <Button loading={this.state.loading} primary>投资</Button>
            </Form>
        );
    }
}

export default ContributeForm;