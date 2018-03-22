import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

export default () => {
    return (
        <Menu style={{ marginTop: '10px', marginBottom: '30px' }}>
            <Link route="/">
                <a className="item"><b>ChainStarter</b></a>
            </Link>
            <Menu.Menu position="right">
                <Link route="/">
                    <a className="item">所有众筹</a>
                </Link>
                <Link route="/crowdfunds/new">
                    <a className="item">+</a>
                </Link>
            </Menu.Menu>
        </Menu>
    );
};