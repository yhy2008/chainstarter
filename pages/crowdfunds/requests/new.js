import React, { Component } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import Crowdfund from '../../../ethereum/crowdfund';
import web3 from '../../../ethereum/web3';
import { Router, Link } from '../../../routes';

class RequestNew extends Component {
    state = {
        description: '',
        value: '',
        receiver: '',
        loading: false,
        errorMessage: ''
    };

    static getInitialProps(props) {
        const { address } = props.query;

        return {
            address
        };
    }

    onSubmit = async (event) => {
        event.preventDefault();
        const crowdfund = Crowdfund(this.props.address);

        const {
            description,
            value,
            receiver
        } = this.state;

        this.setState({
            loading: true,
            errorMessage: ''
        });

        try {
            const accounts = await web3.eth.getAccounts();
            await crowdfund.methods.createRequest(
                description,
                web3.utils.toWei(value, 'ether'),
                receiver
            ).send({ from: accounts[0] });
            Router.pushRoute(`/crowdfunds/${this.props.address}/requests`);
        } catch(err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false });
    };

    render() {
        return (
            <Layout>
                <Link route={`/crowdfunds/${this.props.address}/requests`}>
                    <a>返回</a>
                </Link>
                <h3>创建付款请求</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>请求描述</label>
                        <Input
                            value={this.state.description}
                            onChange={event => {this.setState({ description: event.target.value })}}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>付款金额（ether）</label>
                        <Input
                            value={this.state.value}
                            onChange={event => {this.setState({ value: event.target.value })}}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>接收人地址</label>
                        <Input
                            value={this.state.receiver}
                            onChange={event => {this.setState({ receiver: event.target.value })}}
                        />
                    </Form.Field>
                    <Message error header="错误" content={this.state.errorMessage} />
                    <Button primary loading={this.state.loading}>创建</Button>
                </Form>
            </Layout>
        );
    }
}

export default RequestNew;