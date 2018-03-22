import React, { Component } from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Crowdfund from '../../ethereum/crowdfund';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';

class CrowdfundShow extends Component {
    static async getInitialProps(props) {
        const crowdfund = Crowdfund(props.query.address);
        const summary = await crowdfund.methods.getSummary().call();
        return {
            minimumContribution: summary[0],
            requestsCount: summary[1],
            balance: summary[2],
            approversCount: summary[3],
            manager: summary[4],
            address: props.query.address
        };
    }

    renderCards() {
        const {
            minimumContribution,
            requestsCount,
            balance,
            approversCount,
            manager
        } = this.props;

        const items = [
            {
                header: manager,
                meta: '创建者地址',
                description: '众筹创建者可以发起付款请求',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: minimumContribution,
                meta: '最小投资额（wei）',
                description: '最小投资此额度成为本众筹的参与者'
            },
            {
                header: requestsCount,
                meta: '付款请求总数',
                description: '创建者发起的付款请求次数'
            },
            {
                header: approversCount,
                meta: '参与者总数',
                description: '投资参与此众筹的用户数'
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: '总金额（ether）',
                description: '此众筹剩余可花费的金额'
            }
        ];

        return <Card.Group items={items} />;
    }

    render() {
        return (
            <Layout>
                <h3>众筹详情</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <ContributeForm address={this.props.address} />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/crowdfunds/${this.props.address}/requests`}>
                                <a>
                                    <Button primary>查看付款请求</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}

export default CrowdfundShow;