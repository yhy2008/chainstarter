import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import web3 from '../../ethereum/web3';
import factory from '../../ethereum/factory';
import { Router } from '../../routes';

class CrowdfundNew extends Component {
    state = {
        minimumContribution: '',
        errorMessage: '',
        loading: false
    };

    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({
            errorMessage: '',
            loading: true
        });

        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods
                .createCrowdfund(this.state.minimumContribution)
                .send({
                    from: accounts[0]
                });
            
            Router.pushRoute('/');
        } catch(err) {
            this.setState({
                errorMessage: err.message
            });
        }

        this.setState({
            loading: false
        });
    };

    render() {
        return (
            <Layout>
                <h1>发起新的众筹</h1>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>最小参与金额</label>
                        <Input 
                            label="wei" 
                            labelPosition="right"
                            value={this.state.minimumContribution}
                            onChange={event => this.setState({ minimumContribution: event.target.value })}
                        />
                    </Form.Field>
                    <Message error header="错误" content={this.state.errorMessage} />
                    <Button loading={this.state.loading} primary>发起</Button>
                </Form>
            </Layout>
        );
    }
}

export default CrowdfundNew;