import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Layout from '../../../components/Layout';
import Crowdfund from '../../../ethereum/crowdfund';
import RequestRow from '../../../components/RequestRow';

class RequestIndex extends Component {
    static async getInitialProps(props) {
        const { address } = props.query;

        const crowdfund = Crowdfund(address);
        const requestsCount = await crowdfund.methods.getRequestsCount().call();
        const approverCount = await crowdfund.methods.approverCount().call();

        const requests = await Promise.all(
            Array(parseInt(requestsCount)).fill().map((element, index) => {
                return crowdfund.methods.requests(index).call();
            })
        );

        return { address, requests, requestsCount, approverCount };
    }

    renderRows() {
        const items = this.props.requests.map((request, index) => {
            return <RequestRow
                key={index}
                id={index}
                approverCount={this.props.approverCount}
                request={request}
                address={this.props.address}
            />
        });

        return items;
    }

    render() {
        const { Row, Header, HeaderCell, Body } = Table;
        return (
            <Layout>
                <h3>付款请求列表</h3>
                <Link route={`/crowdfunds/${this.props.address}/requests/new`}>
                    <a>
                        <Button primary>创建付款请求</Button>
                    </a>
                </Link>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>描述</HeaderCell>
                            <HeaderCell>金额</HeaderCell>
                            <HeaderCell>接收者</HeaderCell>
                            <HeaderCell>投票</HeaderCell>
                            <HeaderCell>同意</HeaderCell>
                            <HeaderCell>完结</HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        {this.renderRows()}
                    </Body>
                </Table>
            </Layout>
        );
    }
}

export default RequestIndex;