import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Crowdfund from '../ethereum/crowdfund';
import { Router } from '../routes';

class RequestRow extends Component {
    state = {
        approveLoading: false,
        finalizeLoading: false
    };

    onApprove = async () => {
        this.setState({ approveLoading: true });

        const crowdfund = Crowdfund(this.props.address);
        try {
            const accounts = await web3.eth.getAccounts();
            await crowdfund.methods.approveRequest(this.props.id).send({
                from: accounts[0]
            });
            Router.pushRoute(`/crowdfunds/${this.props.address}/requests`);
        } catch (err) {}

        this.setState({ approveLoading: false });
    };

    onFinalize = async () => {
        this.setState({ finalizeLoading: true });

        const crowdfund = Crowdfund(this.props.address);
        try {
            const accounts = await web3.eth.getAccounts();
            await crowdfund.methods.finalizeRequest(this.props.id).send({
                from: accounts[0]
            });
            Router.pushRoute(`/crowdfunds/${this.props.address}/requests`);
        } catch (err) {}

        this.setState({ finalizeLoading: false });
    };

    render() {
        const { Row, Cell } = Table;
        const { id, request, approverCount } = this.props;
        const readyToFinalize = request.approvalCount > approverCount / 2;

        return (
            <Row disabled={request.complete} positive={!request.complete && readyToFinalize}>
                <Cell>{id}</Cell>
                <Cell>{request.description}</Cell>
                <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
                <Cell>{request.receiver}</Cell>
                <Cell>{request.approvalCount}/{approverCount}</Cell>
                <Cell>
                    {request.complete ? null : (
                        <Button color="green" basic onClick={this.onApprove} loading={this.state.approveLoading}>
                            同意
                        </Button>
                    )}
                </Cell>
                <Cell>
                    {request.complete ? null : (
                        <Button 
                            color="teal" 
                            basic 
                            onClick={this.onFinalize} 
                            loading={this.state.finalizeLoading}
                            disabled={!readyToFinalize}
                        >
                            完结
                        </Button>
                    )}
                </Cell>
            </Row>
        );
    }
}

export default RequestRow;