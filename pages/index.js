import React, { Component } from 'react';
import { Grid, Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link } from '../routes';

class CrowdfundIndex extends Component {
    static async getInitialProps() {
        const crowdfunds = await factory.methods.getDeployedCrowdfunds().call();

        return { crowdfunds };
    }

    renderCrowdfunds() {
        const items = this.props.crowdfunds.map(address => {
            return {
                header: address,
                description: (
                    <Link route={`/crowdfunds/${address}`}>
                        <a>查看</a>
                    </Link>
                ),
                fluid: true
            };
        });

        return <Card.Group items={items} />;
    }

    render() {
        return (
            <Layout>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={3}>
                            <h3>说明</h3>
                        </Grid.Column>
                        <Grid.Column width={13}>
                            <h3>众筹列表</h3>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={3}>
                            <Card>
                                <Card.Content>
                                    <Card.Description>
                                        <p>
                                            此 Demo 是基于区块链的众筹网站，使用前请安装 
                                            <a target="_blank" href="https://metamask.io/"> MetaMask </a>
                                            并把网络切换至 Rinkeby Test Network
                                        </p>
                                    </Card.Description>
                                </Card.Content>
                            </Card>
                        </Grid.Column>
                        <Grid.Column width={13}>
                            <Link route="/crowdfunds/new">
                                <a>
                                    <Button content="创建众筹" icon="plus circle" floated="right" primary />
                                </a>
                            </Link>
                            {this.renderCrowdfunds()}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}

export default CrowdfundIndex;